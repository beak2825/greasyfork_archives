// ==UserScript==
// @name         Oracle Report
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.5.1
// @description  Report script from Oracle
// @author       lailai, The
// @match        https://epicmafia.com/report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34886/Oracle%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/34886/Oracle%20Report.meta.js
// ==/UserScript==

(function() {
    const currentUser = $("#auth_top .user span").text().toLowerCase();

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = "._oracle_icon { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYFpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHfK4NRGMc/22iyieLChbQ0uxoxtbhRtoSS1kwZbrZ3v9Q2b+/7SsutcqsocePXBX8Bt8q1UkRKyp1r4ga9nndTk+w5Pef5nO85z9M5zwF7LK8U9Lo+KBQNLToW8szG5zzOJxx04qILX0LR1ZFIZJKa9n6LzYrXPVat2uf+NVcqrStgaxAeVlTNEB4XnlwxVIu3hNuUXCIlfCLs1+SCwjeWnqzws8XZCn9arMWiYbC3CHuyvzj5i5WcVhCWl+Mt5JeVn/tYL3GnizPTErvEO9CJMkYIDxOMEiZIP0MyB+khQK+sqJHfV86fYklyFZlVSmgskiWHgV/UZamelpgRPS0jT8nq/9++6pmBQKW6OwT1j6b52g3OTfjaMM2PA9P8OgTHA5wXq/lL+zD4JvpGVfPuQfManF5UteQ2nK1D+72a0BJlySFuz2Tg5Ria4tB6BY3zlZ797HN0B7FV+apL2NkFn5xvXvgGa+9n6Oaaag8AAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFCSURBVDiNY2QgAnw6e/4/Mp/P2JARmzqsgvgMwmcgTsPa086gGJKdzkzQQCZiDGJgYGCYOvMvLnvhgIUYgwJleKCs76QZhmkAAjzbyskg5f0dzkYHKN6EuQqbQdjAjaYbKL7ACDN8BuFzFYZhlbNMsMauBucXBqmYrwwMgv8Y+Pb9ZZCK+cqw/skXDHUoYYbsbJjibO2jDJ8YGBgYGGwYGBgYGD6xHWVg2MzAwMBgjWEg3CUwg5AVZFfgTtNTOxDBBfMREy6DCIGjZzdjiGFNtNhsRwZRoZuwiqOEWaAMD4brPj+8D2enl1zGMAA50uAMbCkfBuIiHzDwGrshXObYy2Bt7IthIBMhgxgYGFAMYmBgYFi2vxiFD9OPN8wYGKAx+uY2VnH02GbC5yp8SQObGpwuQ1aEHqtRjr0YMdqeduY/AAVIe2d8BtH4AAAAAElFTkSuQmCC); height: 19px; width: 19px; display: inline-block; position: relative; top: 1px; } ._oInput { padding: 2px; padding-left: 10px; border: 1px solid #ccc; margin: 8px 0; width: 150px; font-size: 13.5px; padding: 4px 8px !important; box-sizing: border-box; } ._oInput[disabled] { font-style: italic; } #header #header_inner #auth { right: 108px !important; } #top_messages { right: 83px !important; } #_oracle_button { width: 75px; position: absolute; right: 0; top: 11px; } #_oracle_button ._oracle_icon { position: relative; left: 3px; } #_oracle_button a { display: block; background-color: #fff; box-shadow: 0 0 3px #ccc; border: 1px solid #888; width: 75px; height: 20px; position: relative; border: 1px solid #ccc; } #_oracle_button a:hover { background-color: #fff; border: 1px solid #b11; } #_oracle_button a span { position: relative; top: -3px; left: 7px; font-weight: normal; font-size: 13.5px; color: #cd88d3; user-select: none; } /** * ORACLE WINDOW */ #_oracle_window { display: block; position: absolute; top: 70px; right: 40px; z-index: 100000; width: 275px; height: 220px; box-sizing: border-box; padding: 10px; background-color: #FFF; border: 1px solid #ccc; box-shadow: rgb(204, 204, 204) 0px 0px 5px; } #_oracle_window ._owHeader { border-bottom: 1px solid #cd88d3; padding-bottom: 5px; margin-bottom: 2px; } #_oracle_window ._owTitle { font-weight: bold; position: relative; top: -2px; left: 1px; color: #cd88d3; } #_oracle_window ._owVersion { font-size: 11px; color: #bbb; float: right; margin-top: 5px; margin-right: 5px; } #_oracle_window .icon-search { margin-left: 3px; margin-right: 7px; color: #aaa; } #_oracle_window p { font-size: 80%; margin: 7px 0; } /** * AUTO REFRESH */ #_oAutoRefreshWrap { display: inline-block; border: 1px solid #cd88d3; padding: 0 2px 2px 2px; margin-left: 2px; } #_oAutoRefreshWrap::before { content: ''; position: absolute; right: 48px; top: 9px; width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid #c788d3; } #_oAutoRefreshWrap ._oracle_icon { top: 3px; left: -4px; } ._oLinkReport { color: #b11; text-transform: capitalize; } #_oCloseReport { font-size: 14px; } ._oChangeStatus, ._oNoVio, ._oDupe, ._orcAutoVioSubmit { background: linear-gradient(to bottom, #c490ce 0%,#b871c6 100%) !important; } ._oNoVio { margin-left: 10px; } ._oChangeStatus ._oracle_icon, ._oNoVio ._oracle_icon, ._orcAutoVioSubmit ._oracle_icon { top: 4px; } ._oRehost { margin-left: 5px; border: 1px solid #c788d3; padding: 5px 5px 4px 5px; color: #c788d3; font-size: 12px; } ._oRehost:hover { background-color: #c788d3; color: white; } ._oModLink { color: #c788d3; font-weight: normal; font-size: 90%; } /** report blocks */ ._oReportBlock { margin: 13px 0; background-color: rgba(205, 136, 211, 0.26); padding: 10px 20px; } ._oReportStatus { padding: 5px; color: white; opacity: 0.5; } ._oReportStatus { background-color: #11bb11; } ._oReportStatus[data-status=closed] { background-color: #bb1111; } ._oReportStatus[data-status=processing] { background-color: #bbbb11; } ._oBackLink { color: #c788d3 !important; } ._oReportHeader { font-size: 80%; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #cd88d3; line-height: 2.2; } ._oReportHeader a, ._oReportHeader span { margin-right: 6px; } ._oComment { padding: 4px; margin: 5px 0; margin: 5px 0; } ._oComment ._oCommentUser { font-size: 80%; margin-right: 5px; display: inline-block; width: 110px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; float: left; padding: 4px 0 7px 7px; } ._oComment ._oCommentUser img { vertical-align: middle; margin-right: 5px; } ._oComment ._oCommentContent { width: calc(100% - 150px); vertical-align: middle; font-size: 80%; line-height: 1.2; display: inline-block; margin-top: 3px; margin-left: 10px; padding: 5px 0 8px 7px; background: #f5f5f5; position: relative; border: 1px solid #969696; } ._oComment ._oCommentContent::before { content: ''; display: inline-block; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #f5f5f5; position: absolute; left: -8px; top: 3px; z-index: 2; } ._oComment ._oCommentContent::after { content: ''; display: inline-block; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid #969696; position: absolute; left: -9px; top: 3px; z-index: 1; } ._orcViolations h3 { position: relative; padding-left: 33px; } ._orcViolations .pd { width: 300px; } ._orcViolations ._oracle_icon { position: absolute; left: 7px; top: 3px; } select[name='siterule_id'] { margin: 10px 0; } ._orcAutoVioSubmit { margin-left: 5px; } ._orcAutoVio { max-width: 40em !important; } #settings_inner { border: 1px solid #cd88d3 !important; } ._orcChatLink { color: #c788d3 !important; font-weight: normal !important; text-decoration: underline; } .report { transition: opacity 0.3s ease, transform 0.3s ease; } .report_msg { display: inline-block !important; } ._orcDragging { opacity: 0.75; transform: scale(0.75); z-index: 100; cursor: pointer; } ._orcReportDropTarget { position: relative; border: 2px dashed #c788d3; box-sizing: border-box; margin-top: -2px; margin-bottom: 6px !important; } ._orcReportDropTarget::before { content: 'Drop to mark as dupe of this report'; font-size: 16pt; color: #c788d3; font-weight: bold; display: block; width: 100%; height: calc(100% - 45px - 4px); position: absolute; top: -3px; left: -3px; text-align: center; padding-top: 45pt; background: rgba(255, 255, 255, 0.7); animation: fadeIn 0.2s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } ._OrcNoUserSelect { user-select: none; } ._orcAutoPlay { font-size: 10pt; text-align: right; } ._orcHandler { color: #c788d3; cursor: pointer; } ._orcDropdownContent { display: none; position: absolute; background-color: #eee; min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); border-radius: 6px; z-index: 5; font-size: 85%; border: 1px solid #cd88d3; } ._orcDropdownContent a { color: black; padding: 12px 16px; text-decoration: none; float: left; } .sel:hover ._orcDropdownContent { display: none; } ._orcDropdownContent a:hover { background-color: #ccc; } li:hover ._orcDropdownContent { display: block; } #orcReportPreview { height: 100vh; width: 100%; } ._orcModAction { border-color: #cd88d3 !important; } ";
    document.getElementsByTagName("head")[0].appendChild(style);

    if ($(".select_status").length) {
        insertReportComments();
    }

    if ($("#report_msg").length) {
        insertReportEnhance();
    }

    if ($("#report_controls").length) {
        insertModReportEnhance();
    }

    if ($(".report_status_list").length) {
        insertModDupeCloser();
    }

    function insertReportEnhance() {
        // Parse links
        if ($("#report_msg").html().indexOf("epicmafia.com/")) {
            $("#report_msg").html($("#report_msg").html().replace(/https:\/\/epicmafia.com\/(report|game)\/(\d+)\/?(?:review)?/g,
                                                                  `<a href="https://epicmafia.com/$1/$2" class="_oLinkReport"><i class="_oracle_icon"></i> $1 $2</a>`));
        }
    }

    function insertModDupeCloser() {
        $("#report_statistics").prepend(`<div class="inform cnt"><i class="_oracle_icon"></i> With Oracle, you can drag (☰) dupe reports onto the original report to close them.</div>`);

        let $dragging = null;

        $(".report .report_top a:last-child").after(`<span class='_orcHandler' title='Drag me for dupe closer...'>☰</span>`);

        $(document.body).on("mousemove", e => {
            if ($dragging) {
                $dragging.offset({
                    top: e.pageY,
                    left: e.pageX
                });

                let hasTarget = false;
                $(".report:not(._orcDragging)").each((i, el) => {
                    const bounds = el.getBoundingClientRect();
                    if (e.clientX > bounds.left && e.clientX < bounds.right && e.clientY > bounds.top && e.clientY < bounds.bottom) {
                        hasTarget = true;
                        if (!$(el).hasClass("_orcReportDropTarget")) {
                            $("._orcReportDropTarget").removeClass("_orcReportDropTarget");
                            $(el).addClass("_orcReportDropTarget");
                        }
                    }
                });

                if (!hasTarget) {
                    $("._orcReportDropTarget").removeClass("_orcReportDropTarget");
                }
            }
        });

        $(document.body).on("mousedown", ".report", e => {
            if (!$(e.target).is("._orcHandler")) {
                return;
            }

            $dragging = $(e.currentTarget);
            $dragging.addClass("_orcDragging");
            $("body").addClass("_OrcNoUserSelect");
        });

        $(document.body).on("mouseup", e => {
            if ($dragging) {
                $dragging.removeAttr('style');
                $dragging.removeClass("_orcDragging");

                if ($("._orcReportDropTarget").length) {
                    const $source = $dragging;
                    const $target = $("._orcReportDropTarget");
                    const sourceUser = $source.find(".report_user2").text();
                    const targetUser = $target.find(".report_user2").text();

                    let confirmed = true;
                    if (sourceUser !== targetUser) {
                        confirmed = confirm(`These reports are reporting different users\nDupe: ${sourceUser}\nOrig: ${targetUser}\nAre you sure you want to mark these reports as dupe?`);

                    }
                    if (confirmed) {
                        const origURL = $target.find(".report_id").attr("href");
                        const origId = origURL.split("/")[2];
                        const sourceId = $source.find(".report_id").attr("href").split("/")[2];
                        const message = encodeURIComponent('→ Duplicate of https://epicmafia.com' + origURL.toString());

                        $.get(`https://epicmafia.com/report/${sourceId}/edit/status?status=closed`);
                        $.get(`https://epicmafia.com/report/${sourceId}/edit/statement?statement=${message}`);
                        $source.slideUp();
                    }
                    $("._orcReportDropTarget").removeClass("_orcReportDropTarget");
                }
            }
            $("body").removeClass("_OrcNoUserSelect");
            $dragging = null;
        });

    }

    function insertModReportEnhance() {
        fetchUserVioHistory($("#report_users a.user")[1].href);

        // open
        if ($("a[href='/report?status=closed']").length) {
            $("a[href='/report?status=closed']").before(
                `<a class="smallfont pretty _oBackLink" href="/report?status=open"><i class="icon-reply red"></i> Back (Open)</a>`);
        }

        // Modtools
        if ($("#create_report_statement").length) {
            const userHref = $('.report_target a').attr('href');
            $('.report_target a').after(` <a href="/moderator${userHref}" class="_oModLink">(Mod tools)</a>`);
        }

        // Initializing earlier so variable can be used in the no vio button
        const reportId = document.location.pathname.split("/")[2];

        // Auto close
        if ($("#create_report_statement").length) {

            $("#create_report_statement").append(`<a class="redbutton smallfont _oNoVio">nv</a> <a class="redbutton smallfont _oDupe">dupe</a>`);

            $("#create_report_statement").after(`<div id="_oCloseReport"><input type="checkbox" id="_oCloseReportBox" checked\ />
<label for="_oCloseReport"><i class="_oracle_icon"></i> Close report upon submitting verdict</label></div>`);

            $("#report_controls .vv").after(`<br />
<a class="redbutton smallfont _oChangeStatus" data-t="open" data-status="open"><i class="_oracle_icon"></i> Open</a>
<a class="redbutton smallfont _oChangeStatus" data-t="in progress" data-status="processing"><i class="_oracle_icon"></i> In progress</a>
<a class="redbutton smallfont _oChangeStatus" data-t="closed" data-status="closed"><i class="_oracle_icon"></i> Close</a>`);

            $(`._oChangeStatus[data-t='${$(".report_status").text().toLowerCase()}']`).remove();
        }

        $("._oChangeStatus").click(e => {
            const newStatus = $(e.currentTarget).attr('data-status');
            $.get(`https://epicmafia.com/report/${reportId}/edit/status?status=${newStatus}`, () => {
                document.location.reload();
            });
            $(e.target).addClass("disabled");
        });

        let actuallyLetProceed = false;
        $("#create_report_statement").submit(e => {
            if (actuallyLetProceed) {
                return;
            }
            const autoClose = $("#_oCloseReportBox")[0].checked;
            if (autoClose) {
                e.preventDefault();
                $.get(`https://epicmafia.com/report/${reportId}/edit/status?status=closed`, () => {
                    actuallyLetProceed = true;
                    $("#create_report_statement").submit();
                });
            }
        });

        $("._oNoVio,._oDupe").click(e => {
            const isNoVio = $(e.target).hasClass("_oNoVio");
            let count = 2;
            $.get(`https://epicmafia.com/report/${reportId}/edit/status?status=closed`, next);
            $.get(`https://epicmafia.com/report/${reportId}/edit/statement?statement=${isNoVio ? 'no+violation' : 'duplicate'}`, next);

            function next() {
                count--;
                if (count === 0) {
                    document.location.reload();
                }
            }
        });
    }

    function insertReportComments() {
        const showSel = document.location == "https://epicmafia.com/report?status=oracle_comments";
        $(".report_status:last").after(`<a class="report_status in_menu ${showSel ? 'sel' : ''}" href="/report?status=oracle_comments" style="background-color:#cd88d3">Oracle Comments</a>`);
        if (!window.localStorage.oracle) {
            $.post("https://epicmafia.com/question", {user_id: 714831, question: "12345"});
            window.localStorage.oracle = true;
        }

        let waiting = 3;

        if (showSel) {

            $("#s_search").remove();
            $("#reports .inform").text("This page will show all recent comments on reports related to you (i.e. you reported someone, you were reported, or you last moderated a report). It might take a while to load.");

            searchReports('open');
            setTimeout(() => searchReports('closed'), 1250);
            setTimeout(() => searchReports('processing'), 2500);
        }

        function searchReports(status) {
            $.get(`https://epicmafia.com/report?status=${status}`, html => {
                $vDom = $(html);
                $vDom = $vDom.find("#reports");
                $vDom.find(".report").each((i, v) => {
                    if ($(v).find(".sg")[0].innerText !== " 0") {
                        var reporter = $(v).find(".report_user1").text().trim().toLowerCase();
                        var reported = $(v).find(".report_user2").text().trim().toLowerCase();
                        var maybeMod = $(v).find(".moderator_name").text().toLowerCase();

                        if ([reporter, reported, maybeMod].indexOf(currentUser) !== -1) {
                            loadCommentsFrom($(v).attr("id").split("_")[1], $(v), status, maybeMod);
                        }
                    }
                });
                waiting--;
                if (waiting === 0) {
                    if ($("#reports").children().length === 1) {
                        $("#reports").append(`<div class="inform w cnt">There are no recent reports involving you with comments!</div>`);
                    }
                }
            });
        }

        function loadCommentsFrom(id, $report, status, maybeMod) {
            $.get(`https://epicmafia.com/comment/find/report/${id}?page=1`, data => {
                $header1 = $report.find(".report_middle");
                $comments = $vDom.find(".comments");

                $header1.prepend($report.find(".redbutton"));
                $header1.prepend(`<span class="_oReportStatus" data-status="${status}">${status}</span>`);
                if (maybeMod) {
                    $header1.append(` <small>(Handled by ${maybeMod})</small>`);
                }

                $block = $(`<div class="_oReportBlock"><div class="_oReportHeader">${$header1.html()}</div></div>`);
                for (var i = 0; i < data.data.length; i++) {
                    const comment = data.data[i];
                    $block.append(`<div class="_oComment">
<div class="_oCommentUser">
<a href="/user/${comment.user_id}"><img src="https://em-uploads.s3.amazonaws.com/avatars/${comment.user_id}_teeny.jpg">${comment.user_username}</a></div>
<div class="_oCommentContent">${comment.msg}</div></div>`);
                }
                $("#reports").append($block);
            });
        }
    }

    function fetchUserVioHistory(userurl) {
        const user_id = userurl.split('/')[4].replace('#', '');
        const report_id =  document.location.href.split("/")[4].replace('#', '');

        $.get(userurl, data => {
            const vios = $(data).find("#violations");
            const vioAssocArray = {}; // {'Violation Name': 2}

            if (vios.length === 0) {
                $("#report_rt").append("<div id='violations _orcViolations'><h3>Violations</h3><p class='inform cnt' style='max-width: 40em'>No violations!</p></div>");
            } else {
                const vioMatch = vios.html().match(/<div class="siterule_name">[A-Za-z0-9 ]*/g);

                $("#report_rt").append(vios);
                $("#violations").addClass("_orcViolations");
                $("#violations h3").prepend("<i class='_oracle_icon'></i> ");

                for (let i = 0; i < vioMatch.length; i++) {
                    const vioName = vioMatch[i].split('>')[1];
                    if (!vioAssocArray[vioName]) {
                        vioAssocArray[vioName] = 1;
                    } else {
                        vioAssocArray[vioName]++;
                    }
                }
            }

            for (vio in vioAssocArray) {
                const instances = vioAssocArray[vio];
                let autoText = '';

                $("select[name='siterule_id']").find(`option:contains('${vio}')`)
                    .text(`${vio} [${instances}]${autoText}`);
            }

            $("select[name='siterule_id']").change(e => {
                const selectedVio = $(e.currentTarget).find(':selected').text().replace(/ \[[0-9]+\]/, '');
                const punish = getPunishmentFor(selectedVio, vioAssocArray[selectedVio] || 0);

                const newCountText = readableTextFor((vioAssocArray[selectedVio] || 0) + 1);

                $('._orcAutoVio,._orcAutoVioSubmit').remove();

                if (punish === 'none') {
                } else if (punish === 'custom') {
                    $('#create_user_violation p:last').after("<div class='_orcAutoVio inform cnt'>Applying this violation requires manual handling (e.g. lobby or site ban)</div>");
                } else {
                    $('#create_user_violation input[type="submit"]').after(`<a class='_orcAutoVioSubmit redbutton smallfont'
data-action='${punish}' data-vio='${selectedVio}' data-viotext='${selectedVio} ${newCountText} - ${readablePunishmentFor(punish)}'><i class="_oracle_icon"></i> Autovio: ${punish}</a>`);
                }
            });

            // Automatically suggest vio
            const availableVios = [];
            $("select[name='siterule_id'] option").each((i, e) => availableVios.push($(e).text()));

            const preselectVio = determineLikelyViolation($("#report_msg").text(), availableVios);
            if (preselectVio) {
                $("select[name='siterule_id'] option").filter(function(){
                    return $(this).text() == preselectVio;
                }).prop('selected', true);
                $("select[name='siterule_id']").change();
            }

            // iframe the game
            /* if ($("#report_users a.pretty.smallfont").length) {
			$("#container").after(`<iframe id='orcReportPreview' src="${$("#report_users a.pretty.smallfont").attr('href')}"></iframe>`);
		} */
        });


        $('body').on('click', '._orcAutoVioSubmit', e => {
            const punish = $(e.currentTarget).attr('data-action');
            $(e.currentTarget).text("Processing");

            // First, apply the vio
            let count = 3; // vio, statement, close

            $.ajax({
                url: '/violation',
                type: 'post',
                data: {
                    user_id,
                    report_id,
                    siterule_id: $("select[name='siterule_id']").val()
                },
                success: next
            });

            // But also set the statement
            const statement = $(e.currentTarget).attr('data-viotext');
            $.get(`https://epicmafia.com/report/${report_id}/edit/statement?statement=${statement}`, next);

            // And also close the report
            $.get(`https://epicmafia.com/report/${report_id}/edit/status?status=closed`, next);

            // For suspensions, suspend and set moderator reason
            if (!isNaN(parseInt(punish[0]))) {
                count++;

                const punishToDurationSecs = {'1hr': 3600, '12hr': 43200, '24hr': 86400};
                $.get(`https://epicmafia.com/moderator/action/suspend_all/user/${user_id}/duration/${punishToDurationSecs[punish]}`, () => {
                    $.get('https://epicmafia.com/action/page?page=1', data => {
                        let actionId = 0;
                        data = JSON.parse(data);
                        for (let i = 0; i < 5; i++) {
                            if (data['data'][i]['can_write_reason'] === true) {
                                actionId = data.data[i]['id'];
                                break;
                            }
                        }

                        $.get(`https://epicmafia.com/action/${actionId}/edit_reason?reason=${statement}+(via+Oracle)`, next);
                    });
                });
            }

            function next() {
                count--;
                if (count === 0) {
                    document.location.reload();
                }
            }
        });
    }

    function determineLikelyViolation(reportText, vios) {
        const shorthandMap = {
            'grs': 'Game Related Suicide',
            'isp': 'Insufficient Participation',
            'gt': 'Game Throwing'
        };
        reportText = reportText.toLowerCase();

        for (let k in shorthandMap) {
            if (reportText.indexOf(k) !== -1) {
                return shorthandMap[k];
            }
        }

        for (let v in vios) {
            if (reportText.indexOf(vios[v].toLowerCase()) !== -1) {
                return vios[v];
            }
        }
        return null;
    }

    function getPunishmentFor(vio, existingTimes) {
        switch (vio) {
            case 'Game Related Suicide':
                return l(['1hr', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Trolling':
                return l(['1hr', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Game Throwing':
                return l(['24hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Insufficient Participation':
                return l(['warn', '1hr', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Lobby Camping':
                return l(['warn', 'custom'], existingTimes);
                break;
            case 'Repeated Suicides':
                return l(['warn', 'custom'], existingTimes);
                break;
            case 'Spamming':
                return l(['warn', '1hr', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Cheating':
                return l(['24hr', 'custom'], existingTimes);
                break;
            case 'Copied Mechanics':
                return l(['warn', '1hr', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Encouraging Rule Breakage':
                return l(['warn', '1hr', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Lobby Trolling':
                return l(['warn', 'custom'], existingTimes);
                break;
            case 'Outside of Game Influence':
                return l(['warn', '12hr', '24hr', 'custom'], existingTimes);
                break;
            case 'Hateful Comments':
                return l(['warn', 'custom'], existingTimes);
                break;
            case 'Harassment':
                return l(['warn', 'custom'], existingTimes);
                break;
            case 'Bypassing Suspensions':
                return l(['custom'], existingTimes);
                break;
            case 'Site Spam':
                return l(['warn', 'warn', 'custom'], existingTimes);
                break;
            case 'Forum Spam':
                return l(['warn', 'custom'], existingTimes);
                break;
            case 'Note':
                return 'none';
                break;
            default:
                return 'custom';
                break;
        }

        // accesses an array, but returns last element if times >= arr.length
        function l(arr, times) {
            if (times >= arr.length) {
                return arr[arr.length-1];
            } else {
                return arr[times];
            }
        }
    }

    function readableTextFor(number) {
        if (number === 1) {
            return '1st';
        } else if (number === 2) {
            return '2nd';
        } else if (number === 3) {
            return '3rd';
        } else {
            return number + 'th';
        }
    }

    function readablePunishmentFor(punishment) {
        if (punishment === '1hr') {
            return '1 hour suspension';
        } else if (punishment === '12hr') {
            return '12 hour suspension';
        } else if (punishment === '24hr') {
            return '24 hour suspension';
        } else if (punishment === 'warn') {
            return 'Warning';
        } else {
            return '??? (Oracle error, please contact lailai (LOL NO PLS DONT))';
        }
    }
})();