// ==UserScript==
// @name   QA_tools
// @namespace  http://use.i.E.your.homepage/
// @version    0.2.11
// @description  svn utility tools
// @include       /netease/
// @require  http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @grant GM_download
// @grant GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/422089/QA_tools.user.js
// @updateURL https://update.greasyfork.org/scripts/422089/QA_tools.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var status = 'true'
    function replace_svn_link3() {
       if ($('.issue-show-updated').length > 0||$('.kc-head-link').length > 0) {
                var redmine_id_issues = []
                var redmine_id_kanban = []
                var login_info=document.querySelector('#nis-water-style').sheet.rules[1].style.content
                var svn_revision = [];
                var week_name =''
                var project=''
                const imageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPUSURBVHgBrVVtTBNnHH/aux69a6/c0Z5QYKJQeakwJ7hNQ2a6bC77sGRzb5FlZC5b+mnZl32ZWRaWhWzJdIlxxkQyNl820UD0gxjxLUGDVaMQETSKaAO2vb5CKS21B9fzntqnlqPhJfGXPLnn+d///3t+/9/ztAfACnD4eKByJfmq5SS1t9+nH7qIliQAn+sprH1tEdXW3MzxS9Wpl0o49H+g4cK15LGTZ/zvlhYR1H+d3o+6zvkOrrSLBdizz930xrb+W6Z1fbcO/ON2SzJ+3zs+Dtcw/nPrY/ti9Tltae8YLx4aElq6zwcbwlNzqVj1ljj9XatUsfdb471RZ1yAMTYfB+9sLRhp3Mj+kMumBeT/HuVtXd3BlhsDU3R2vLztYB1eECOc3+8cmvUUCNnvGt9kPB+/X9j21Zdcd05yeGhjfq391Bl/E++bVwu4nb3F7AcDZjifPF3vCRy2LVAJu2j6pKjj111r/kSxzIH6p8kDjpthu5JYUzKRh4ghtDUeGuTApGyf4+aU/Y994xdRDEebeH1C3MULifpXaYZlNYSbT8Tvj8SmX2npnHcrSIuX1hRPEMia6kodrdWqMaNcMzgcDY+5EoNpRyRErqook3pi0dn6gTtCqshkIojeC9W19qkYoVRZ/umDYrL3vTAiDIae18iiQFX53NW0IyKGlDN0USjfWPeh25tIkc3MiOKho0F/4lFhlKx169WkgGfYZV13j6xzOcfisZm4KKLw+mo9IKXh/Q5HVxgqR55LHR0/TVvWEqNKldH+8uknv3w2QnrLXhzGahcFrVHmlhSqb+/evcMj/xySKcWI3Gq1zlWtkfpI7cKrzyRWqXRHvvFMnt7kycS23TFm55BaDNTVgB5oh0r1nAPZAgKBgEpHmTwG44Yvsm+MjsLwhtcM7BXHZHBmsCyasUmXwCMX60Iob0MtDai80b8cV05AS+Yph0j29bVFKis0g9mK3n6L5S5dnvArbaIIDMu2psQsW9K6nUfESnKJ53nRlD+XsaZxM2O83h8JAQVm3YwQ+q35UfffWypQbJXx6TloCeTJSQ53dY70nLVW6QFnIvLgsQSDggByAMZ3/cjzq0u1lLVKB8TZJwNKckxZ5PMNiw2bv36dZYka6DNYBLwv8XTTRgNr5rDr+/dsPQGbyibHFfkpa9bXiD2Pnerkju0sWBoSKDVHOpWqIXL95cINtfLQGAwGVSQSybyQ1yB7DcEwTDIcDkPFQlr5olBbLJY8s9lMyXM9x3F6+JQHnX4qhw7mg2V81VA3MBG32Wx4uhM4NGiuiGPLJX6peAZCtZWOn09dFgAAAABJRU5ErkJggg=="

            if( $('.issue-show-updated').length > 0){
                redmine_id_issues .push($(".issue-show-subject a")[0].href.split("/").pop());
                $(".issue-changeset-revision a").each(function (i, item) {
                    var r = $(item).attr("href").split("/").pop();
                    if (r.indexOf('search') == -1) {
                        svn_revision.push(r);
                    }
                });
                week_name = $(".attribute")[5].childNodes[0].childNodes[2].childNodes[0].innerText
                //console.log(login_info)
                //console.log('svn_revision', svn_revision,login_info,redmine_id_issues)
                project = document.getElementsByClassName("issue-show-project")[0].lastChild.innerText
                var url1 = "http://qassist.qkit.nie.netease.com:8080//?project=" + project + "&week_name=" + week_name + "&redmine_id=" + redmine_id_issues + "&search=" + svn_revision.join() + '&login_info=' + login_info;
                //console.log('QA辅助测试1', url1);
            }
            if( document.getElementsByClassName('kc-head-link').length>0){
                var links=document.getElementsByClassName('kc-head-link')
                for(let i=0;i<links.length;i++){
                    //console.log(links[i].text);
                    redmine_id_kanban.push(links[i].text);
                }
                week_name = document.getElementsByClassName("kanban-version-selectors")[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].wholeText
                project =document.getElementsByClassName('core-layout-project-name inline-top text-ellipsis')[0].innerText
                //console.log('redmine_id_kanban',week_name, redmine_id_kanban,project)
                //console.log('QA辅助测试2',"project=" + project + "&redmine_id_issues=" + redmine_id_issues + "&week_name=" + week_name+"&redmine_id_kanban=" + redmine_id_kanban );
            }

           //console.log(($('.qa_link_kanban').length<=0&&$('.kc-head-link').length>0))
           //console.log(($('.qa_link').length<=0&&$('.issue-show-updated').length > 0))
           //console.log(($('.qa_link_kanban').length<=0&&$('.kc-head-link').length>0)||($('.qa_link').length<=0&&$('.issue-show-updated').length > 0))
           if(($('.qa_link_kanban').length<$('.kc-head-link').length)||($('.qa_link').length<$('.issue-show-updated').length)){
              GM_xmlhttpRequest({
                method: "post",
                url: "http://10.246.52.150:8080/api/check_special_item",
                //url: "http://10.240.185.230:8085/api/check_special_item",
                data: "project=" + project + "&redmine_id_issues=" + redmine_id_issues + "&week_name=" + week_name+"&redmine_id_kanban=" + redmine_id_kanban ,

                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function (res) {
                    if (res.status == 200) {

                        var text = res.responseText;
                        var json = JSON.parse(text);
                        console.log(json);
                        if(json.code==0){
                            let span_text_issues = ['&nbsp;&nbsp;&nbsp;辅助测试']
                            if(json.redmine_id_issues){
                               if(json.redmine_id_issues.length>0&&$('.issue-show-updated').length > 0&&$('.qa_link').length ==0){
                                console.log(json.redmine_id_issues);
                                let issues=json.redmine_id_issues
                                $('.issue-show-updated').append("<a class='qa_link' target=_blank href=" + url1 + " style='text-decoration:none;background:#525FE2;opacity:0.9;border-radius:17px;display:inline-block;margin-left:10px;'><div><img id='qaicon'></img><span style='color:#ffffff;font-size:12px;'class='span_text_issues'></span></div></a>");
                                let qaicon = document.getElementById("qaicon");

                                   if(issues[0].show_assist){
                                        if(issues[0].specail_list.length>0){
                                            if(issues[0].specail_list.includes('compatibility')){
                                                span_text_issues .push('兼')
                                            }
                                            if(issues[0].specail_list.includes('performance')){
                                                span_text_issues .push('客')
                                            }
                                            if(issues[0].specail_list.includes('protocol')){
                                                span_text_issues .push('协')
                                            }
                                            if(issues[0].specail_list.includes('db_alarm')){
                                                span_text_issues .push( '数')
                                            }
                                            if(issues[0].specail_list.includes('switch_info')){
                                                span_text_issues .push( '开')
                                            }
                                            if(issues[0].specail_list.includes('server_info')){
                                                span_text_issues .push('服')
                                            }
                                            if(issues[0].specail_list.includes('table_info')){
                                                span_text_issues .push('表')
                                            }
                                            if(issues[0].specail_list.includes('core_interface')){
                                                span_text_issues .push( '核')
                                            }
                                            if(issues[0].specail_list.includes('shader')){
                                                span_text_issues .push( '材')
                                            }

                                        }
                                       qaicon.src = imageBase64;
                                       document.getElementsByClassName("span_text_issues")[0].innerHTML = span_text_issues.join("&nbsp;&nbsp;") + '&nbsp; &nbsp; '
                                   }
                             }
                            }
                            if(json.redmine_id_kanban){
                               if(json.redmine_id_kanban.length>0&&document.getElementsByClassName('kc-head-link').length>0&&($('.qa_link_kanban').length<$('.kc-head-link').length)){
                                console.log(json.redmine_id_kanban);
                                let kanban=json.redmine_id_kanban
                                for(let i in kanban){

                                   //console.log($('.kc-subject').eq(i),$('.kc-subject').eq(i).children('.qa_link_kanban'));
                                   if($('.kc-subject').eq(i).children('.qa_link_kanban').length==0){

                                     $('.kc-subject').eq(i).append("<a class='qa_link_kanban' target=_blank href='' style='text-decoration:none;display:inline-block;'><div><span style='color:#525FE2;font-size:12px;'>&nbsp; &nbsp;</span><span style='color:#525FE2;font-size:12px;'class='span_text_kanban'></span></div></a>");
                                     let url2 = "http://qassist.qkit.nie.netease.com:8080/?project=" + project + "&week_name=" + week_name + "&redmine_id=" +kanban[i].issue_id + "&search=" + svn_revision.join() + '&login_info=' + login_info;
                                       //http://10.246.52.150:8080
                                       document.getElementsByClassName("qa_link_kanban")[i].href=url2
                                       if(kanban[i].show_assist){
                                         let span_text_kanban = '#辅助测试'
                                         if(kanban[i].specail_list.length>0){
                                           if(kanban[i].specail_list.includes('compatibility')){
                                               span_text_kanban =span_text_kanban + '/' + '兼'
                                           }
                                           if(kanban[i].specail_list.includes('performance')){
                                               span_text_kanban =span_text_kanban + '/' + '客'
                                           }
                                           if(kanban[i].specail_list.includes('protocol')){
                                               span_text_kanban =span_text_kanban + '/' + '协'
                                           }
                                           if(kanban[i].specail_list.includes('db_alarm')){
                                               span_text_kanban =span_text_kanban + '/' + '数'
                                           }
                                           if(kanban[i].specail_list.includes('switch_info')){
                                               span_text_kanban =span_text_kanban + '/' + '开'
                                           }
                                           if(kanban[i].specail_list.includes('server_info')){
                                               span_text_kanban =span_text_kanban + '/' + '服'
                                           }
                                           if(kanban[i].specail_list.includes('table_info')){
                                               span_text_kanban =span_text_kanban + '/' + '表'
                                           }
                                           if(kanban[i].specail_list.includes('core_interface')){
                                               span_text_kanban =span_text_kanban + '/' + '核'
                                           }
                                           if(kanban[i].specail_list.includes('shader')){
                                               span_text_kanban =span_text_kanban + '/' + '材'
                                           }
                                         }
                                         document.getElementsByClassName("span_text_kanban")[i].innerHTML = span_text_kanban
                                       }
                                  
                                    }


                                }
                             }
                            }

                        }
                    }
                }
            });
           }
        }

    }
    setInterval(replace_svn_link3, 1000);
    //setTimeout(replace_svn_link3, 6000);

})();