// ==UserScript==
// @name         Jenkins branch names
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Jenkins Branch Hot Switcher
// @author       Willem D'Haeseleer
// @match        https://jenkins.origami42.com/*
// @match        http://cti01jm0001e1.t1.usw2.origami42.com:8080/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/24521/Jenkins%20branch%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/24521/Jenkins%20branch%20names.meta.js
// ==/UserScript==
/* jshint -W097 */
/*globals $:false*/
'use strict';

var BUILDING_SIGN = ' -&gt; ';
var ROOT = 'https://jenkins.origami42.com/';

function getJobUrl(jobId) {
    return ROOT + 'job/' + jobId + '/api/json';
}

function prop(keyword) {
    return function (a) {
        if (a) {
            return a[keyword];
        }
        return false;
    };
}

function getBranchName(jobId) {
    return $.when(
            $.get(getJobUrl(jobId) + '?tree=lastSuccessfulBuild[actions[causes[userName,shortDescription],lastBuiltRevision[branch[name]]]]').then(function (data) {
                var userName = '';
                var causes = data.lastSuccessfulBuild.actions.find(prop('causes')).causes;
                try {
                    userName = causes.find(prop('shortDescription')).shortDescription.split(' ').slice(-1);
                    userName = causes.find(prop('userName')).userName;
                } catch (e) {
                }
                return {
                    userName: userName,
                    branchName: data.lastSuccessfulBuild.actions.find(prop('lastBuiltRevision')).lastBuiltRevision.branch[0].name
                }
            }),
            $.get(getJobUrl(jobId) + '?tree=lastBuild[building,actions[causes[userName,shortDescription],lastBuiltRevision[branch[name]]]]').then(function (data) {
                var userName = '';
                var causes = data.lastBuild.actions.find(prop('causes')).causes;
                try {
                    userName = causes.find(prop('shortDescription')).shortDescription.split(' ').slice(-1);
                    userName = causes.find(prop('userName')).userName;
                } catch (e) {
                }

                return {
                    userName: userName,
                    branchName: data.lastBuild.actions.find(prop('lastBuiltRevision')).lastBuiltRevision.branch[0].name,
                    building: data.lastBuild.building
                };
            })
    ).then(function (lastSuccessfulBuild, lastBuild) {
        if (lastBuild.building) {
            return {
                branchName: lastSuccessfulBuild.branchName + BUILDING_SIGN + lastBuild.branchName,
                userName: lastBuild.userName
            };
        }
        return {
            branchName: lastSuccessfulBuild.branchName,
            userName: lastSuccessfulBuild.userName
        };
    });
}

function updateAndBuildBranch(jobId, branch) {
    var configUrl = ROOT + 'job/' + jobId + '/config.xml';
    return $.get(configUrl).then(function (config) {
        $(config).find('hudson\\.plugins\\.git\\.BranchSpec name').text(branch);
        return $.post(configUrl, $(config).find('project')[0].outerHTML).then(function () {
            $('a[href^="job/' + jobId + '/build"] img').click();
        });
    });
}


$('#projectstatus tr[id]').find('.model-link.inside:eq(0)').each(function getText() {
    var jobId = $(this).text();
    var parent = $(this).parent();
    var container = null;
    getBranchName(jobId).then(
        function setText(build) {
            var culprit = build.userName;
            var branchName = build.branchName;
            var branch = branchName.split('/');
            if (branch.length > 2) {
                // weird bug with ghost branch name prefixes...
                branchName = branch.slice(-2).join('/');
            }

            if (container) container.remove();
            container = $('<span style="cursor: pointer;">');
            container
                .html(branchName + ' ( ' + culprit + ' )')
                .appendTo(parent)
                .on('click', function () {
                    var input = $('<input title="Hit Esc or Enter" type="text">');
                    container.html('').append(input);
                    input.focus();
                    input.on('keyup', function (e) {
                        var ENTER = 13;
                        var ESCAPE = 27;
                        if (e.keyCode === ENTER) {
                            var nextBranch = branchName.split(BUILDING_SIGN);
                            var toBuild = input.val();
                            if (nextBranch.length == 2) {
                                branchName = nextBranch[1];
                            }
                            branchName = branchName + BUILDING_SIGN + toBuild;
                            culprit = 'You';
                            var jobId = container.closest('tr').attr('id').slice(4);
                            updateAndBuildBranch(jobId, toBuild);
                            setText({
                                branchName: branchName,
                                userName: culprit
                            });
                        } else if (e.keyCode === ESCAPE) {
                            setText({
                                branchName: branchName,
                                userName: culprit
                            });
                        }
                    });
                });
        });
});
