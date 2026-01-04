// ==UserScript==
// @name         VkSpam 2.0
// @version      0.4
// @author       Stephanzion
// @description  VkSpam  2.0
// @include  /https:\/\/vk.com\/search.*=people?.+
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/181794
// @downloadURL https://update.greasyfork.org/scripts/372701/VkSpam%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/372701/VkSpam%2020.meta.js
// ==/UserScript==


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var text = "Привет, я Анна!";



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

console.log(1);
var refresh = document.createElement("button");
refresh.innerText = 'Обновить скрипт';
refresh.className = 'flat_button button_wide';
refresh.style.marginTop = "10%";
refresh.onclick = function(){

    if(lastUrl != window.location.href)
    {
        lastUrl = window.location.href;

        lastGroupMember = 0;
    }

    return start();
};
document.getElementsByClassName('left_menu_nav_wrap')[0].appendChild(refresh);


var lastGroupMember = 0;

var lastUrl = "";


var GroupMembersToken = returnGroupMembersToken();

function returnGroupMembers(ids)
{



    var token = GroupMembersToken;

    var groupMembers = "";

    var url = encodeURI( "https://vk.com/dev?act=a_run_method&al=1&hash="+ token +"&method=groups.isMember&param_extended=1&param_group_id=" + "113130247" + "&param_user_ids="+ ids +"&param_v=5.87");

    console.log(url);


    $.ajax({
        url:url,
        type:'get',
        success: function(data){

            groupMembers = data;


            const regex = /\d+<.>dev.css,dev.js<.>.<.>\d+<.>.<.>/gm;


            groupMembers = groupMembers.replace(regex, "");


            console.log(groupMembers);

            var obj = $.parseJSON(groupMembers);
           var values = obj['response'];



            var elem = document.getElementsByClassName('search_row');

            for(var i = lastGroupMember; i < elem.length; i++)
            {


                for(var b = 0; b < values.length; b++)
                {
                    if(elem[i].innerHTML.includes(values[b].user_id))
                    {
                         if(values[b].member == 0)
                         {
                        elem[i].style.backgroundColor = "#ffb2b2";

                         }
                        else
                         {
                        elem[i].style.backgroundColor = "#b2ffbf";

                         }
                    }


                }

            }

            lastGroupMember += values.length;
        }
    });


console.log(lastGroupMember);

}


function returnGroupMembersToken()
{
    var token = "";

    $.ajax({
        url:"https://vk.com/dev/groups.isMember",
        type:'get',
        async: false,
        success: function(data){

            token = data;


    const regex = /Dev\.methodRun\(\'[a-zA-Z0-9_.-:]*/gm;

    let m;

    while ((m = regex.exec(token)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {

            token = match.replace("Dev.methodRun('","");

        });
    }



        }
    });

             console.log(token);
    return token;
}



function start(){






    addSendBtns();

    setInterval(function() {
        for(var i = 0; i < document.getElementsByClassName('people_row search_row clear_fix').length; i++)
        {
            if(!document.getElementsByClassName('people_row search_row clear_fix')[i].className.includes('with_send_btn'))
            {
                addSendBtns();
                break;

            }
        }

    }, 1000);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function addSendBtns()
    {
        await sleep(1000);


        var ids = "";
        for(var i = 0; i < document.getElementsByClassName('people_row search_row clear_fix').length; i++)
        {
            if(!document.getElementsByClassName('people_row search_row clear_fix')[i].className.includes('with_send_btn'))
            {

                document.getElementsByClassName('people_row search_row clear_fix')[i].className = 'people_row search_row clear_fix with_send_btn';

                var id = document.getElementsByClassName('people_row search_row clear_fix')[i].getElementsByTagName('button')[0].onclick.toString().match(/\d+/gm)[0];
                ids += id + ',';

                var btn = document.createElement("button");
                btn.className = 'flat_button button_wide send_message';
                btn.innerText = "Написать сообщение";
                btn.style.marginTop = "10%";
                btn.id = id;

                document.getElementsByClassName('people_row search_row clear_fix')[i].getElementsByClassName('controls')[0].appendChild(btn);
                document.getElementById(btn.id).onclick = function() {

                    d();

                    return showWriteMessageBox(event, this.id);

                };



                var dialog = document.createElement("button");
                dialog.className = 'flat_button button_wide send_message';
                dialog.innerText = "Перейти к диалогу";
                dialog.style.marginTop = "10%";
                dialog.id = id;
                dialog.onclick= function() {



                    window.open("/write" + this.id);

                };

                document.getElementsByClassName('people_row search_row clear_fix')[i].getElementsByClassName('controls')[0].appendChild(dialog);


            }










        }

        if(ids != "")
        {

        returnGroupMembers(ids);

        }

    }
    function d(){

        try { document.getElementById('mail_box_editable').innerText = text; }
        catch(e){

            setTimeout(d , 10) ;

        }



    }


    searcher.showMore = function() {
        var e = ge("ui_search_load_more"),
            s = ge("search_more_results");
        if (!e || !isVisible(e) || cur.isSearchLoading) {return void(s && searcher.appendElements(s))  }
        if (s && searcher.appendElements(s), !cur.has_more) return void hide(e);
        cur.disableAutoMore = !1, cur.isSearchLoading = !0, lockButton(e);
        var t = searcher.getSectionParams();
        t.offset = cur.offset, t.qid = cur.qid, t.edit = nav.objLoc.edit, t.sign = nav.objLoc.sign, t.all = nav.objLoc.all, ajax.post("al_search.php", t, {
            onDone: function(s, t) {
                cur.isSearchLoading = !1, t && (ge("no_results") && re("no_results"), ge("results").insertBefore(ce("div", {
                    innerHTML: t,
                    id: "search_more_results"
                }), e)), unlockButton(e), searcher.applyOptions(s), searcher.scrollCheck()
            },
            cache: "audio" != t["c[section]"] || t["c[q]"] ? 1 : 0
        })

        return addSendBtns();
    }
}

