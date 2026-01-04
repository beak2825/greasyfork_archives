// ==UserScript==
// @name         FCup Mobile Chat
// @version      1.1.1.2.0
// @author       Criyessei
// @description  Fcup Mobile Chat
// @include      http*://futbolcup.net*
// @include      http*://fussballcup.de*
// @include      http*://fussballcup.at*
// @include      http*://futbolcup.pl*
// @include      http*://footcup.fr*
// @include      http*://footballcup.nl*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-end
// @license      MIT
// @namespace    https://greasyfork.org/users/178210
// @downloadURL https://update.greasyfork.org/scripts/377973/FCup%20Mobile%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/377973/FCup%20Mobile%20Chat.meta.js
// ==/UserScript==

if(location.protocol!='https:'){ //Routing to secure protocol
    let pageHref = location.href;
    location.href = 'https'+pageHref.substring(pageHref.indexOf(':'));
    return;
}

let images = {
    close : 'data:image/png;base64,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'
}

PageLoad(()=>{
    if(typeof serverTime!=="number"
       || $('#ChangeContent').length
      ){
        if(location.search.indexOf('action=logout') //Çıkış yapıldı
           && $('#tutorial-container > div > div.message > form').length
          ) location.href = location.origin; //Go main page
        return;
    }

    $('#chatFrame > h2').append('<img src="'+images.close+'" id="CloseChat" style="height: 35px;cursor:pointer;position:absolute;right: 16px;top: 45%;transform: translate(50%,-50%);">');
    $('#CloseChat').click(function(){
        HideChat();
        Cookies.set('chatVisible',0, {
            expires: 365
        });
    });

    $('#chatToggleBtn').click(function(){
        ShowChat();
        Cookies.set('chatVisible',1, {
            expires: 365
        });
    });
    setTimeout(function(){
        $('#nav > ul > li.first.png > ul').css('margin-left','41px');
        $('#user-team-squad > p')[0].style="background: url(/designs/redesign/images/layout/navigation_sprite.png) 0 -310px;";
        $('#chatToggleBtn').css({
            'transform':'scaleX(-1)',
            'left':'+=40px'
        });
        $('#chatFrame').css({
            'width':'75%',
            'height':'95%',
            'z-index':'10',
            'left':'50%',
            'top':'10px',
            'transform':'translate(-50%,0)',
            'display':'block',
            'margin':'auto'
        });
        $('#chatFrame > h2').css({
            'height':'35px',
            'font-size':'25px',
            'font-weight':'bold',
            'text-align':'center'
        });
        $('#channels > li').css({
            'font-size':'20px',
            'font-weight':'bold',
            'text-align':'center'
        });
        $('#chatFrameInner').css('height',$('#chatFrame').height()-$('#chatFrame > h2').height());
        $('#chat').css({
            'height' : $('#chatFrameInner').height(),
            'width' : '100%',
        });
        $('#messages').css('width','100%');
        $('#messages').css('height',$('#chat').height()-$('#channels').height()-$('#chatForm').height());
        $('#chatForm > input')[0].style = 'width:100%;margin:auto;padding-right:0;padding-left:0;box-sizing:border-box';

        $('#smileybutton').css('left',$('#inputDiv').width()-30);
        $('#smileylist').css({
            'width':'100%',
            'left':'-1px',
        });

        if(Cookies.get('chatVisible') == "1")
            ShowChat();
        else HideChat();
    },2000);
    $('body').append('<script>setLeftPosition = function(animationTime){} </script>');

    $('#body').append('<input type="button" style="display:none;" id="ChangeContent">');
    $('#ChangeContent').click(function(){
        if(!$('#content').find('h2').first().attr('Fixed')) PageLoad(PageChange); //Sayfa değiştirilince Fixed özelliği olmayacağı için undefined değeri dönecek ve main fonksiyonu çalıştırılacak.
    });

    //The function named updateLayout are needed update for the FCUP Script. Because when the page change, fcup script should work then.
    $(document.head).append(
        "<script id='FunctionupdateLayout'>"+
        (()=>{
            let codes = (updateLayout).toString();
            codes = 'function updateLayout'+codes.substring(codes.indexOf('('));
            return codes.substring(0,codes.lastIndexOf('}'))+"$('#ChangeContent').click();}";
        })()+
        "</script>"
    );
});

function PageChange(){
    $('#nav > ul > li.first.png > ul').css('margin-left','41px');
    $('#user-team-squad > p')[0].style="background: url(/designs/redesign/images/layout/navigation_sprite.png) 0 -310px;";
    //
    $('#content').find('h2').first().attr('Fixed',new Date().getTime());
}

//FUNCTIONS
function PageLoad(func){
    setTimeout(function(){
        if(!$('#body').hasClass('loading'))
            func();
        else
            var a = setInterval(function(){
                if(!$('#body').hasClass('loading')){
                    clearInterval(a);
                    func();
                }
            },50);
    },10);
}
function ShowChat(){
    $('#header').hide();
    $('#section-outer-container').hide();
    $('#footer').hide();
    $('#chatToggleBtn').hide();
    $('#chatFrame').show();
}
function HideChat(){
    $('#header').show();
    $('#section-outer-container').show();
    $('#footer').show();
    $('#chatToggleBtn').show();
    $('#chatFrame').hide();
}