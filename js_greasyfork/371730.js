// ==UserScript==
// @name         Bitbucket branch model
// @namespace    http://camilyo.com/
// @version      0.1
// @description  Branch model implementation for Bitbucket cloud
// @author       Amit
// @match        https://bitbucket.org/branch/create?*issueKey=CAMILYO*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371730/Bitbucket%20branch%20model.user.js
// @updateURL https://update.greasyfork.org/scripts/371730/Bitbucket%20branch%20model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        function setBranchName(branchType, issueKey, issueSummary) {
            var branchName = branchType + '/' + issueKey + '-' + issueSummary.trim().replace(/ /g,'-').replace(/\./g, '').replace(/--/g, '-').replace(/--/g, '-').replace(/--/g, '-').toLowerCase();
            $('#id_branch_name').val(branchName);
        }

        function prepareNewFieldGroup(){
            var $group = $('<div class="field-group" id="id_branch_type_group">');
            $group.append('<label for="id_branch_type">Branch type</label>');

            var $branchType = $('<select class="select aui-select2-container">');
            $branchType.append('<option value="feature">Feature</option>');
            $branchType.append('<option value="hotfix">Hotfix</option>');
            $branchType.on('change', function() {
                setBranchName($branchType.val(), issueKey, issueSummary);
            });
            $group.append($branchType);
            $group.insertAfter('#branch-field-container');
            $branchType.select2();
            return $group;
        }

        $('#id_branch_name').css('max-width', 'initial')

        var searchParams = new URLSearchParams(location.search);
        var issueSummary = searchParams.get('issueSummary');
        var issueKey = searchParams.get('issueKey');

        var $group = prepareNewFieldGroup();
        setBranchName('feature', issueKey, issueSummary);
    })
})();