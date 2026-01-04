// ==UserScript==
// @name         Hentai Heroes Club Contributions
// @namespace    hentaiheroes.com
// @version      2.2
// @description  Save and compare checkpoints for how much members have contributed on hentaiheroes.com
// @author       Qweqwe
// @match        https://www.hentaiheroes.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/390113/Hentai%20Heroes%20Club%20Contributions.user.js
// @updateURL https://update.greasyfork.org/scripts/390113/Hentai%20Heroes%20Club%20Contributions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top === window.self || window.location.pathname.indexOf('clubs') === -1) {
        return;
    }

    GM_addStyle(".contribution-popup { opacity: 1; transition: opacity .3s ease-in-out; }");
    GM_addStyle(".contribution-popup.fade { opacity: 0 }");

    var $ = unsafeWindow.$;
    var Chart = window.Chart;
    var moment = window.moment;

    function saveContributionCheckpoint() {
        $('#members tr').each(function() {
            var $tr = $(this);
            var name = getName($tr);
            var currentContribution = getCurrentContribution($tr);

            appendContributionFor(name, currentContribution);
        });

        compareContributionCheckpoint();
    }

    function compareContributionCheckpoint() {
        $('#members tr').each(function() {
            var $tr = $(this);
            var $contribTD = $tr.find('td:nth-child(4)');
            var name = getName($tr);
            var currentContribution = getCurrentContribution($tr);

            if ($contribTD.get(0).childNodes[2]) {
                $contribTD.get(0).removeChild($contribTD.get(0).childNodes[2]);
            }

            var lastContribution = getLastContribution(name);
            if (!lastContribution || (currentContribution - lastContribution.contribution) < 0) {
                appendContributionFor(name, currentContribution);
                lastContribution = { date: moment().format(), contribution: currentContribution };
            }

            var diff = currentContribution - lastContribution.contribution;
            var $span = $('<span/>')
            .css('position', 'relative')
            .html('(' + formatContribution(diff) + ')');

            var $table = $('.lead_table_view.members_table');

            var hover = false;
            var $popup;
            $span.hover(
                function() {
                    hover = true;
                    if ($popup) {
                        $popup.removeClass('fade');
                        return;
                    }
                    $popup = $('<div/>')
                        .addClass('contribution-popup')
                        .css('position', 'absolute')
                        .css('z-index', 999)
                        .css('right', '30px')
                        .css('width', ((($table.height() * 0.75) / 2) * 2.5) + 'px')
                        .css('background', 'rgba(.2,.2,.2,.9)')
                        .css('border', '1px solid rgba(255, 165, 0, 0.75)')
                        .css('border-radius', '15px')
                        .css('padding', '10px 5px')
                        .css('visibility', 'hidden');

                    var $canvas = $('<canvas/>');
                    var context = $canvas.get(0).getContext('2d');
                    var checkpoints = getCheckpointsSorted(getContributionsFor(name));

                    if (diff > 0 || checkpoints.length == 1 || moment(lastContribution.date).isBefore(moment().subtract(1, 'hour'))) {
                        checkpoints.push({ date: moment(), contribution: currentContribution });
                    }

                    createChart(context, checkpoints, function() {
                        setTimeout(function() {
                            if (!$popup) {
                                return;
                            }

                            if ($table.offset().top + $table.height() < $popup.offset().top + $popup.height()) {
                                $popup.css('bottom', '0px');
                            }
                            $popup.css('visibility', 'initial');
                        }, 0);
                    });

                    $popup.append($canvas);
                    $span.append($popup);
                },
                function() {
                    hover = false;
                    $popup.addClass('fade');
                    setTimeout(function() {
                        if ($popup && !hover) {
                            $popup.remove();
                            $popup = null;
                        }
                    }, 300);
                }
            );

            $contribTD.append($span);
        });
    }

    function createChart(context, checkpoints, callback) {
        var scatterChart = new Chart(context, {
            type: 'scatter',
            data: {
                datasets: [{
                    borderColor: 'rgba(255,255,255,0.4)',
                    pointBorderColor: 'rgba(255,255,255,0.7)',
                    pointBackgroundColor: 'rgba(255,255,255,0.5)',
                    pointBorderWidth: 1,
                    showLine: true,
                    lineTension: 0,
                    data: checkpoints.reduce(function(data, checkpoint) {
                        var last = data[data.length - 1];
                        data.push({
                            x: moment(checkpoint.date),
                            y: checkpoint.contribution,
                            diff: last ? checkpoint.contribution - last.y : checkpoint.contribution
                        });

                        return data;
                    }, [])
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        title: function(items, data) {
                            var item = items[0];
                            var dataItem = data.datasets[item.datasetIndex].data[item.index];

                            return dataItem.y + ' (' + formatContribution(dataItem.diff) + ')';
                        }
                    }
                },
                animation: {
                    onComplete: callback
                },
                aspectRatio: 2.5,
                scales: {
                    xAxes: [{
                        type: 'time',
                        position: 'bottom',
                        gridLines: {
                            color: 'rgba(255,255,255,0.3)'
                        },
                        bounds: 'ticks'
                    }],
                    yAxes: [{
                        position: 'left',
                        gridLines: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            precision: 0
                        }
                    }]
                }
            }
        });
    }

    function formatContribution(contrib) {
        if (contrib < 0) {
            return String(contrib);
        }

        return "+" + contrib;
    }

    function getName($tr) {
        return $tr.find('td:nth-child(2)').get(0).childNodes[2].textContent.trim();
    }

    function getCurrentContribution($tr) {
        var $contribTD = $tr.find('td:nth-child(4)');

        return parseFloat($contribTD.get(0).childNodes[0].textContent.replace(',', ''));
    }

    function appendContributionFor(name, currentContribution) {
        var contributions = getContributionsFor(name);
        contributions.checkpoints.push({
            date: moment().format(),
            contribution: currentContribution
        });
        contributions.checkpoints = contributions.checkpoints.filter(function(x) {
            return typeof x != 'number';
        });

        window.localStorage.setItem(storageKey(name), JSON.stringify(contributions));
    }

    function getLastContribution(name) {
        var contributions = getContributionsFor(name);
        var checkpoints = getCheckpointsSorted(contributions);

        return checkpoints[checkpoints.length - 1];
    }

    function getCheckpointsSorted(contributions) {
        contributions.checkpoints.sort(function(a, b) {
            return a.date > b.date ? 1 : -1;
        });

        return contributions.checkpoints;
    }

    function getContributionsFor(name) {
        var contributions = JSON.parse(window.localStorage.getItem(storageKey(name)));
        if (typeof contributions == 'number' || typeof contributions == 'string') {
            contributions = migrateOldData(contributions, name);
        }

        return contributions || { checkpoints: [] };
    }

    function migrateOldData(contribution, name) {
        var contributions = {
            checkpoints: [{date: moment().format(), contribution: parseFloat(contribution)}]
        };
        window.localStorage.setItem(storageKey(name), JSON.stringify(contributions));

        return contributions;
    }

    function storageKey(name) {
        return 'contribution_checkpoint_' + encodeURIComponent(name);
    }

    compareContributionCheckpoint();

    $("span[sort_by]").on("click", function() {
        setTimeout(function() {
            compareContributionCheckpoint();
        }, 0);
    });

    var $button = $('<button />')
        .addClass('orange_text_button')
        .css({ 'z-index': '3', position: 'absolute', right: '65px', top: '12px', display: 'inline-block', height: '26px', 'line-height': '26px', padding: '0 5px' })
        .append('Checkpoint')
        .click(saveContributionCheckpoint);

    $('.club-container.club_dashboard')
        .prepend($button);
})();