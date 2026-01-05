// ==UserScript==
// @name         7cups Master Addons
// @namespace    7cups
// @version      1.7
// @description  Modify 7cups with addons BY AZURE
// @author       Azure 
// @match        *://www.7cups.com/member/connect/conversation.php?c=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/21235/7cups%20Master%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/21235/7cups%20Master%20Addons.meta.js
// ==/UserScript==        

var exec_heart_spam_button;
var eхec_new_emojis;
var exec_remove_censors;
var collapsable_side_chatnav;


var sns = (function() {
return {
    init: function() {
        var loopactv = 0;
        var heartloop;
        name = ChatSession.user.screenName;
        blacklist = [''];
        y = 0;
        isInArray = function(value, array)  {
            return array.indexOf(value) > -1;
        };
        chatbox = document.getElementById("actionButtons");
        convhead = document.getElementById("conversationHead");
        chatbox.setAttribute("style", "display: none;");
        heartbox = document.createElement("img");

        heartbox.setAttribute("data-original-title", "Heart Everything! Made by Isa");
        heartbox.setAttribute("data-toggle", "tooltip");
        heartbox.setAttribute("onclick","sns.main()");
        heartbox.setAttribute("src","https://emojipedia-us.s3.amazonaws.com/cache/c6/f0/c6f08ffe2a8203eaf9df15b36e611ee0.png");
        heartbox.onclick = function () {
            sns.main();
        };
        heartbox.setAttribute("style", "zoom: .7;");
        chatbox.appendChild(heartbox);
        btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "Turn on Heart Loop");
        btn.setAttribute("class", "btn btn-danger");
        btn.setAttribute("style", "zoom: .7;");
        chatbox.appendChild(btn);
        btn.onclick = function () {
            if (loopactv === 0) {
                heartloop = setInterval(sns.main, 100);
                btn.setAttribute("value", "Turn OFF Heart Loop");
                btn.setAttribute("class", "btn btn-success");
                loopactv = 1;
                return;
            }
            if (loopactv === 1) {
                clearInterval(heartloop);
                btn.setAttribute("value", "Turn ON Heart Loop");
                btn.setAttribute("class", "btn btn-danger");
                loopactv = 0;
                return;
            }
        };
        convhead.onclick = function () {
            if (chatbox.getAttribute("style") == "display: none;") {
                chatbox.setAttribute("style", "");
                return;
            }
            if (chatbox.getAttribute("style") == "") {
                chatbox.setAttribute("style", "display: none;");
                return;
            }
        };

    },

    main: function() {
        curPoints = -99999;
        alert = function() {};
        newPoints = -99999;
        x=document.getElementsByClassName("convRow");
        y = y +1;
        document.getElementById("conversationHead").innerHTML = "Heart Round: " + y;
        for (i = 0; i < x.length; i++) {
        z = x[i].getElementsByClassName("youArea");
        g = x[i].getElementsByClassName("meArea");
        if (z.length !== 0) {
        if(z[0].getAttribute("heart") != "hearted"){
        e = z[0].getElementsByClassName("userScreenName")[0].innerHTML;
        z[0].setAttribute("heart", "hearted");
        index = isInArray(e, blacklist);
        if (index === false) {
        u = z[0].getElementsByClassName("heartCommentButton");
        u[0].click();
        }
        }
        }

        if (g.length !== 0) {
        if (x[i].getAttribute("heart") != "hearted"){

        o1= x[i].getAttribute("id");
        c5 = o1.substring(8);
        heartMsg(c5);
        x[i].setAttribute("heart", "hearted");
        }}
        }
    },
    rmc:  function() {
        getCensorList = function() {};
    },
    emj:  function() {
        swapEmoticons = function(text) {
        var emoArr=[
        {from:'o\\.O',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/b9/96/b99649ed6d9c11ba1ebc5d1ba737a251.png" />'},
        {from:'O\\.o',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/b9/96/b99649ed6d9c11ba1ebc5d1ba737a251.png" />'},
        {from:':\'\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/a5/7c/a57c2d408eca78c1f86ef84701b9fdc4.png" />'},
        {from:':\'-\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/a5/7c/a57c2d408eca78c1f86ef84701b9fdc4.png" />'},
        {from:'3:\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/ab/32/ab32ed029fe5e389fd6a58a1567b47e6.png" />'},
        {from:'3:-\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/ab/32/ab32ed029fe5e389fd6a58a1567b47e6.png" />'},
        {from:'&#62;:\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/83/77/837745687df45a277eab1dffdcbb683f.png" />'},
        {from:'&#62;:-\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/83/77/837745687df45a277eab1dffdcbb683f.png" />'},
        {from:':-\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/c6/2b/c62bf0bd71884ed240ea04ea52df1af0.png" />'},
        {from:':\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/c6/2b/c62bf0bd71884ed240ea04ea52df1af0.png" />'},
        {from:':\\[',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/c6/2b/c62bf0bd71884ed240ea04ea52df1af0.png" />'},
        {from:'=\\(',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/c6/2b/c62bf0bd71884ed240ea04ea52df1af0.png" />'},
        {from:'&#62;:O',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/83/77/837745687df45a277eab1dffdcbb683f.png" />'},
        {from:'&#62;:-O',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/83/77/837745687df45a277eab1dffdcbb683f.png" />'},
        {from:'&#62;:o',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/83/77/837745687df45a277eab1dffdcbb683f.png" />'},
        {from:'&#62;:-o',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/83/77/837745687df45a277eab1dffdcbb683f.png" />'},
        {from:':-O',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6b/a8/6ba8e96767593a0f18a49a00e2e0c3d7.png" />'},
        {from:':O',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6b/a8/6ba8e96767593a0f18a49a00e2e0c3d7.png" />'},
        {from:':-o',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6b/a8/6ba8e96767593a0f18a49a00e2e0c3d7.png" />'},
        {from:':o',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6b/a8/6ba8e96767593a0f18a49a00e2e0c3d7.png" />'},
        {from:'8-\\)',to:'<img width="16" height="16" src="'+'http://emojipedia-us.s3.amazonaws.com/cache/b9/f2/b9f287feecfe7b286298177d80900dc8.png" />'},
        {from:'8\\)',to:'<img width="16" height="16" src="'+'http://emojipedia-us.s3.amazonaws.com/cache/b9/f2/b9f287feecfe7b286298177d80900dc8.png" />'},
        {from:'B-\\)',to:'<img width="16" height="16" src="'+'http://emojipedia-us.s3.amazonaws.com/cache/b9/f2/b9f287feecfe7b286298177d80900dc8.png" />'},
        {from:'B\\)',to:'<img width="16" height="16" src="'+'http://emojipedia-us.s3.amazonaws.com/cache/b9/f2/b9f287feecfe7b286298177d80900dc8.png" />'},
        {from:':-D',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6d/2a/6d2a0d4969706af6405b4e7e2404425f.png" />'},
        {from:':D',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6d/2a/6d2a0d4969706af6405b4e7e2404425f.png" />'},
        {from:'=D',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/6d/2a/6d2a0d4969706af6405b4e7e2404425f.png" />'},
        {from:'&#60;3',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/c6/f0/c6f08ffe2a8203eaf9df15b36e611ee0.png" />'},
        {from:':-\\*',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/a4/d5/a4d5a581d1ac308ee30be400a55ad3a5.png" />'},
        {from:':\\*',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/a4/d5/a4d5a581d1ac308ee30be400a55ad3a5.png" />'},
        {from:':-\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/4c/79/4c792c981f358f25ccb0e0ee4ce336e9.png" />'},
        {from:':\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/4c/79/4c792c981f358f25ccb0e0ee4ce336e9.png" />'},
        {from:':\\]',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/4c/79/4c792c981f358f25ccb0e0ee4ce336e9.png" />'},
        {from:'=\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/4c/79/4c792c981f358f25ccb0e0ee4ce336e9.png" />'},
        {from:'8-\\|',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/14/1a/141abadb2a517ef47fc9c5ac55b76971.png" />'},
        {from:'8\\|',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/14/1a/141abadb2a517ef47fc9c5ac55b76971.png" />'},
        {from:'B-\\|',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/14/1a/141abadb2a517ef47fc9c5ac55b76971.png" />'},
        {from:'B\\|',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/14/1a/141abadb2a517ef47fc9c5ac55b76971.png" />'},
        {from:':-P',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/32/af/32af19300295481c3ea74fb808162e4e.png" />'},
        {from:':P',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/32/af/32af19300295481c3ea74fb808162e4e.png" />'},
        {from:':-p',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/32/af/32af19300295481c3ea74fb808162e4e.png" />'},
        {from:':p',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/32/af/32af19300295481c3ea74fb808162e4e.png" />'},
        {from:'=P',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/32/af/32af19300295481c3ea74fb808162e4e.png" />'},
        {from:':-\\/',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/85/b6/85b6144f09d9af20a4d7cc0eabe9d488.png" />'},
        {from:':\\\\',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/85/b6/85b6144f09d9af20a4d7cc0eabe9d488.png" />'},
        {from:':-\\\\',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/85/b6/85b6144f09d9af20a4d7cc0eabe9d488.png" />'},
        {from:';-\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/05/1c/051c8e2c85dc6355d43bc28c29611c5e.png" />'},
        {from:';\\)',to:'<img width="16" height="16" src="'+'https://emojipedia-us.s3.amazonaws.com/cache/05/1c/051c8e2c85dc6355d43bc28c29611c5e.png" />'}];
        var currentCounter=0;

        for(var i=0;i<emoArr.length;i++)
        {var re=new RegExp(emoArr[i].from,'igm');var count=(text.match(re)||[]).length;if(currentCounter+count<20)
        text=text.replace(re,emoArr[i].to);else
        text=text.replace(re,'');currentCounter+=count;}

        return text;
        };
    },
    chattoggle: function() {
        var chat = document.querySelector("#layout-wrapper > div.container-fluid > div > div.col-lg-3.col-lg-pull-6.col-md-4.col-md-pull-8.hidden-sm-down.left-hand-content > div.card.card-block.subtle-box-shadow.stats.conversationBox > h5");
        chat.setAttribute('onclick', ' $(".tab-content").fadeToggle();');
    },
    check: function() {
        if (eхec_new_emojis === true) {
            sns.emj();
        }
        if (exec_remove_censors === true) {
            sns.rmc();
        }
        if (exec_heart_spam_buttons === true) {
            sns.init();
        }
        if (collapsable_side_chatnav === true) {
            sns.chattoggle();
        }

    },
    load: function() {
        exec_heart_spam_buttons = true;
        eхec_new_emojis = true;
        exec_remove_censors = true;
        collapsable_side_chatnav = true;
        sns.check();
    }
};
})();
sns.load();