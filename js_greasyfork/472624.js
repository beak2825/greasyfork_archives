// ==UserScript==
// @name         Previo Redmine Issues Dashboard
// @namespace    thetomcz.previo.redmine.issuesDashboard
// @version      0.6.4
// @description  Create dashboard with all useful issue lists
// @author       Tomáš Hejl <tomas.hejl@previo.info>
// @match        https://redmine.previo.info/news
// @icon         https://www.previo.cz/icons/share/128x128/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472624/Previo%20Redmine%20Issues%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/472624/Previo%20Redmine%20Issues%20Dashboard.meta.js
// ==/UserScript==

(function () {
    var IssuesDashboard = {

        segments : [
            {
                title     : 'Assigned issues',
                urlParams : [
                    ["c[]", "tracker"],
                    ["c[]", "start_date"],
                    ["c[]", "due_date"],
                    ["c[]", "fixed_version"],
                    ["c[]", "status"],
                    ["c[]", "project"],
                    ["c[]", "category"],
                    ["c[]", "tags_relations"],
                    ["c[]", "subject"],
                    ["f[]", "status_id"],
                    ["f[]", "assigned_to_id"],
                    ["f[]", ""],
                    ["group_by", "priority"],
                    ["op[assigned_to_id]", "="],
                    ["op[status_id]", "="],
                    ["sort", "parent:desc,id:desc"],
                    ["t[]", ""],
                    ["v[assigned_to_id][]", "me"],
                    ["v[status_id][]", "1"],
                    ["v[status_id][]", "6"],
                    ["v[status_id][]", "29"],
                    ["v[status_id][]", "16"],
                    ["c[]", "cf_67"], // MR
                ],
                showFilter : true,
            },
            {
                title     : 'Ready to merge',
                urlParams : [
                    ["sort", "id:desc"],
                    ["f[]", "status_id"],
                    ["op[status_id]", "="],
                    ["v[status_id][]", "31"],
                    ["f[]", "assigned_to_id"],
                    ["op[assigned_to_id]", "="],
                    ["v[assigned_to_id][]", "me"],
                    ["c[]", "priority"],
                    ["c[]", "tracker"],
                    ["c[]", "fixed_version"],
                    ["c[]", "project"],
                    ["c[]", "category"],
                    ["c[]", "subject"],
                    ["c[]", "assigned_to"],
                    ["c[]", "cf_46"],// CR
                    ["c[]", "cf_67"], // MR
                ]
            },
            {
                title     : 'Do Code Review',
                urlParams : [
                    ["sort", "start_date,created_on:desc"],
                    ["c[]", "priority"],
                    ["c[]", "tracker"],
                    ["c[]", "fixed_version"],
                    ["c[]", "project"],
                    ["c[]", "category"],
                    ["c[]", "subject"],
                    ["c[]", "assigned_to"],
                    ["c[]", "updated_on"],
                    ["c[]", "spent_hours"],
                    ["c[]", "cf_67"], // MR
                    ["f[]", "status_id"],
                    ["op[status_id]", "="],
                    ["v[status_id][]", "27"],
                    ["f[]", "cf_46"],
                    ["op[cf_46]", "="],
                    ["v[cf_46][]", "me"], // CR = me
                    ["t[]", ""],
                ]
            },
            {
                title     : 'Find / Remind CR',
                urlParams : [
                    ["sort", "updated_on,id:desc"],
                    ["f[]", "status_id"],
                    ["op[status_id]", "="],
                    ["v[status_id][]", "27"],
                    ["f[]", "assigned_to_id"],
                    ["op[assigned_to_id]", "="],
                    ["v[assigned_to_id][]", "me"],
                    ["f[]", ""],
                    ["c[]", "priority"],
                    ["c[]", "tracker"],
                    ["c[]", "fixed_version"],
                    ["c[]", "project"],
                    ["c[]", "category"],
                    ["c[]", "subject"],
                    ["c[]", "cf_46"], // CR
                    ["c[]", "updated_on"],
                    ["c[]", "cf_67"], // MR
                    ["group_by", "fixed_version"],
                    ["t[]", ""],
                ]
            },
            {
                title     : 'Waiting for export <span class="help" title="Recent, testing or resolved">?</span>',
                urlFilter : 'utf8=✓&set_filter=1&sort=updated_on%3Adesc%2Csubject%2Cstart_date&f[]=status_id&op[status_id]=%3D&v[status_id][]=28&v[status_id][]=11&f[]=assigned_to_id&op[assigned_to_id]=%3D&v[assigned_to_id][]=me&f[]=updated_on&op[updated_on]=>t-&v[updated_on][]=180&f[]=project_id&op[project_id]=!&v[project_id][]=48&f[]=&c[]=priority&c[]=tracker&c[]=project&c[]=category&c[]=status&c[]=subject&c[]=assigned_to&c[]=cf_46&c[]=updated_on&group_by=fixed_version&t[]=',
                urlParams : [
                    ["sort", "updated_on:desc,subject,start_date"],
                    ["f[]", "status_id"],
                    ["op[status_id]", "="],
                    ["v[status_id][]", "28"],
                    ["v[status_id][]", "11"],
                    ["f[]", "assigned_to_id"],
                    ["op[assigned_to_id]", "="],
                    ["v[assigned_to_id][]", "me"],
                    ["f[]", "updated_on"],
                    ["op[updated_on]", ">t-"],
                    ["v[updated_on][]", "180"],
                    ["f[]", "project_id"],
                    ["op[project_id]", "!"],
                    ["v[project_id][]", "48"],
                    ["f[]", ""],
                    ["c[]", "priority"],
                    ["c[]", "tracker"],
                    ["c[]", "project"],
                    ["c[]", "category"],
                    ["c[]", "status"],
                    ["c[]", "subject"],
                    ["c[]", "cf_67"], // MR
                    ["group_by", "fixed_version"],
                    ["t[]", ""]
                ]
            },
            {
                title     : 'Free CRs',
                urlFilter : 'set_filter=1&sort=project%2Cid%3Adesc&f[]=status_id&op[status_id]=%3D&v[status_id][]=27&f[]=cf_46&op[cf_46]=!*&f[]=assigned_to_id&op[assigned_to_id]=!&v[assigned_to_id][]=me&f[]=&c[]=priority&c[]=project&c[]=category&c[]=subject&c[]=assigned_to&c[]=updated_on&c[]=tracker&group_by=fixed_version&t[]=&f[]=project_id&op[project_id]=!&v[project_id][]=7&v[project_id][]=8&v[project_id][]=5&nofilter',
                urlParams : [
                    ["sort", "project,id:desc"],
                    ["f[]", "status_id"],
                    ["op[status_id]", "="],
                    ["v[status_id][]", "27"],
                    ["f[]", "cf_46"],
                    ["op[cf_46]", "!*"],
                    ["f[]", "assigned_to_id"],
                    ["op[assigned_to_id]", "!"],
                    ["v[assigned_to_id][]", "me"],
                    ["f[]", ""],
                    ["c[]", "priority"],
                    ["c[]", "tracker"],
                    ["c[]", "project"],
                    ["c[]", "category"],
                    ["c[]", "subject"],
                    ["c[]", "assigned_to"],
                    ["c[]", "updated_on"],
                    ["c[]", "spent_hours"],
                    ["c[]", "cf_67"], // MR
                    ["group_by", "fixed_version"],
                    ["t[]", ""],
                    ["f[]", "project_id"],
                    ["op[project_id]", "!"],
                    ["v[project_id][]", "7"],
                    ["v[project_id][]", "8"],
                    ["v[project_id][]", "5"],
                ]
            },
        ],

        run: function(){
            IssuesDashboard.appendStylesAndScripts();
            IssuesDashboard.appendIframes();
            IssuesDashboard.addListeners();
            $("title").text('My dashboard');
            $("a.news").text('My dashboard');
        },

        appendIframes : function(){
            const element = $("#content");
            element.html('');

            $.each(IssuesDashboard.segments, function(id, segmentData){

                let segmentName = segmentData.title;

                let params = new URLSearchParams();
                for (let data of segmentData.urlParams) {
                    params.append(data[0], data[1]);
                }
                let issueUrlFilter = params.toString();

                if(!segmentData.showFilter){
                    issueUrlFilter += "&nofilter";
                }
                issueUrlFilter += "&set_filter=1";
                issueUrlFilter += "&iframe=true";

                element.append(
                    '<h2>'+segmentName+' <a class="reload" style="font-size: 12px; cursor: pointer" data-ifr-id='+id+'>🔄</a></h2>'
                    + '<iframe id="ifr-'+id+'" src="https://redmine.previo.info/issues?'+issueUrlFilter+'" '
                    + 'class="insider" '
                    + 'style="width: 100%; border: 0px none;visibility:hidden" '
                    + 'onload="restyleFrame(this);autosizeFrame(this);" '
                    + 'scrolling="no"></iframe>'
                );
            });
        },


        addListeners : function(){
            $(window).resize(function(){
                $("iframe.insider").each(function(){ autosizeFrame(this);});
            });

            $(document).on('click', '.reload', function(){
                const ifrId = $(this).data('ifrId');
                const ifrEl = $("#ifr-"+ifrId);

                ifrEl.attr('src', ifrEl.attr('src'));
            })
        },

        appendStylesAndScripts : function(){
            $("body").append(
                '<style>'
                + 'iframe.insider{width:100%;border:0px none}'
                + 'span.help{border-bottom:1px dotted grey;font-size:70%;cursor:help}'
                + '</style>'
                + '<script>'
                + 'let autosizeFrame = function(frameObj){'
                + '    setTimeout(function(){ '
                + '       frameObj.style.height = 0; '
                + '       frameObj.style.height = frameObj.contentWindow.document.documentElement.scrollHeight + "px";'
                + '       $(frameObj).contents().find("a").attr("target", "_top");'
                + '    }, 100) '
                + '};'
                + 'let restyleFrame = function(frameObj){'
                + '    setTimeout(function(){ '
                + '       $(frameObj).contents().find("head").append("<style>#top-menu, #header, #footer, #sidebar, #query_form, #content > h2, .other-formats, .contextual, .pagination{display: none!important;}#content{min-height: auto!important;}</style>");'
                + '       frameObj.style.visibility="visible"'
                + '    }, 100) '
                + '};'
                + 'document.autosizeFrame = autosizeFrame'
                + '</script>'
            );
        },
    };

    IssuesDashboard.run();

})();