// ==UserScript==
// @name        Picarto - Disable round, yellow emotes in chat
// @namespace   http://github.com/SnowySailor
// @include     https://picarto.tv/*
// @version     1.1
// @grant       none
// @description Replaces the yellow emotes in Picarto chat with their text-based counterparts (aka "normal" emotes).
// @downloadURL https://update.greasyfork.org/scripts/15593/Picarto%20-%20Disable%20round%2C%20yellow%20emotes%20in%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/15593/Picarto%20-%20Disable%20round%2C%20yellow%20emotes%20in%20chat.meta.js
// ==/UserScript==
/*
Created by SnowySailor - http://github.com/SnowySailor
Redefining of a Picarto JS function emoticonize
*/
window.$.fn.emoticonize = function(options) {
    var opts = $.extend({}, $.fn.emoticonize.defaults, options);

    var escapeCharacters = [ ")", "(", "*", "[", "]", "{", "}", "|", "^", "<", ">", "\\", "?", "+", "=", "." ];

    var threeCharacterEmoticons = [
        // really weird bug if you have :{ and then have :{) in the same container anywhere *after* :{ then :{ doesn't get matched, e.g. :] :{ :) :{) :) :-) will match everything except :{
        //  But if you take out the :{) or even just move :{ to the right of :{) then everything works fine. This has something to do with the preMatch string below I think, because
        //  it'll work again if you set preMatch equal to '()'
        //  So for now, we'll just remove :{) from the emoticons, because who actually uses this mustache man anyway?
      // ":{)",
      ":-)", ":o)", ":c)", ":^)", ":-D", ":-(", ":-9", ";-)", ":-P", ":-p", ":-Þ", ":-b", ":-O", ":-/", ":-X", ":-#", ":'(", "B-)", "8-)", ";*(", ":-*", ":-\\",
      "?-)", // <== This is my own invention, it's a smiling pirate (with an eye-patch)!
      // and the twoCharacterEmoticons from below, but with a space inserted
      ": )", ": ]", "= ]", "= )", "8 )", ": }", ": D", "8 D", "X D", "x D", "= D", ": (", ": [", ": {", "= (", "; )", "; ]", "; D", ": P", ": p", "= P", "= p", ": b", ": Þ", ": O", "8 O", ": /", "= /", ": S", ": #", ": X", "B )", ": |", ": \\", "= \\", ": *", ": &gt;", ": &lt;"//, "* )"
    ];

    var twoCharacterEmoticons = [ // separate these out so that we can add a letter-spacing between the characters for better proportions
      ":)", ":]", "=]", "=)", "8)", ":}", ":D", ":(", ":[", ":{", "=(", ";)", ";]", ";D", ":P", ":p", "=P", "=p", ":b", ":Þ", ":O", ":/", "=/", ":S", ":#", ":X", "B)", ":|", ":\\", "=\\", ":*", ":&gt;", ":&lt;"//, "*)"
    ];


    var specialRegex = new RegExp( '(\\' + escapeCharacters.join('|\\') + ')', 'g' );
    // One of these characters must be present before the matched emoticon, or the matched emoticon must be the first character in the container HTML
    //  This is to ensure that the characters in the middle of HTML properties or URLs are not matched as emoticons
    //  Below matches ^ (first character in container HTML), \s (whitespace like space or tab), or \0 (NULL character)
    // (<\\S+.*>) matches <\\S+.*> (matches an HTML tag like <span> or <div>), but haven't quite gotten it working yet, need to push this fix now
    var preMatch = '(^|[\\s\\0])';

    for ( var i=threeCharacterEmoticons.length-1; i>=0; --i ){
      threeCharacterEmoticons[i] = threeCharacterEmoticons[i].replace(specialRegex,'\\$1');
      threeCharacterEmoticons[i] = new RegExp( preMatch+'(' + threeCharacterEmoticons[i] + ')', 'g' );
    }

    for ( var i=twoCharacterEmoticons.length-1; i>=0; --i ){
      twoCharacterEmoticons[i] = twoCharacterEmoticons[i].replace(specialRegex,'\\$1');
      twoCharacterEmoticons[i] = new RegExp( preMatch+'(' + twoCharacterEmoticons[i] + ')', 'g' );
    }

    /*for ( var emoticon in specialEmoticons ){
      specialEmoticons[emoticon].regexp = emoticon.replace(specialRegex,'\\$1');
      specialEmoticons[emoticon].regexp = new RegExp( preMatch+'(' + specialEmoticons[emoticon].regexp + ')', 'g' );
    }*/

    var exclude = 'span.css-emoticon';
    if(opts.exclude){ exclude += ','+opts.exclude; }
    var excludeArray = exclude.split(',')

    return this.not(exclude).each(function() {
      var container = $(this);
      var cssClass = 'css-emoticon'
      if(opts.animate){ cssClass += ' un-transformed-emoticon animated-emoticon'; }


        var time_var = new Date().getTime();
        var content = container.html();


        /* NORMAL SMILIES */
        if(content.match(/:sad:/g)){
            content = (content.replace(/:sad:/g,"<img title='...' class='emoti animated rubberBand' src='../images/chat/emoticons/sad.png'>"));
        }
        if(content.match(/:angry:/g)){
            content = (content.replace(/:angry:/g,"<img title='...' class='emoti animated jello' src='../images/chat/emoticons/angry.png'>"));
        }
        if(content.match(/:condescending:/g)){
            content = (content.replace(/:condescending:/g,"<img title='...' class='emoti animated swing' src='../images/chat/emoticons/condescending.png'>"));
        }
        if(content.match(/:confused:/g)){
            content = (content.replace(/:confused:/g,"<img title='...' class='emoti animated shake' src='../images/chat/emoticons/confused.png'>"));
        }
        if(content.match(/:excited:/g)){
            content = (content.replace(/:excited:/g,"<img title='...' class='emoti animated shake' src='../images/chat/emoticons/excited.png'>"));
        }
        if(content.match(/:grossedout:/g)){
            content = (content.replace(/:grossedout:/g,"<img title='...' class='emoti animated wobble' src='../images/chat/emoticons/grossedout.png'>"));
        }
        if(content.match(/:laugh:/g)){
            content = (content.replace(/:laugh:/g,"<img title='...' class='emoti animated bounce' src='../images/chat/emoticons/laugh.png'>"));
        }
        if(content.match(/:ohmy:/g)){
            content = (content.replace(/:ohmy:/g,"<img title='...' class='emoti animated shake' src='../images/chat/emoticons/ohmy.png'>"));
        }
        if(content.match(/:pouty:/g)){
            content = (content.replace(/:pouty:/g,"<img title='...' class='emoti animated jello' src='../images/chat/emoticons/pouty.png'>"));
        }
        if(content.match(/:sad:/g)){
            content = (content.replace(/:sad:/g,"<img title='...' class='emoti animated swing' src='../images/chat/emoticons/sad.png'>"));
        }
        if(content.match(/:shock:/g)){
            content = (content.replace(/:shock:/g,"<img title='...' class='emoti animated tada' src='../images/chat/emoticons/shock.png'>"));
        }
        if(content.match(/:sleepy:/g)){
            content = (content.replace(/:sleepy:/g,"<img title='...' class='emoti animated pulse' src='../images/chat/emoticons/sleepy.png'>"));
        }
        if(content.match(/:snicker:/g)){
            content = (content.replace(/:snicker:/g,"<img title='...' class='emoti animated bounce' src='../images/chat/emoticons/snicker.png'>"));
        }
        if(content.match(/:uneasy:/g)){
            content = (content.replace(/:uneasy:/g,"<img title='...' class='emoti animated jello' src='../images/chat/emoticons/uneasy.png'>"));
        }
        if(content.match(/:unimpressed:/g)){
            content = (content.replace(/:unimpressed:/g,"<img title='...' class='emoti animated shake' src='../images/chat/emoticons/unimpressed.png'>"));
        }
        if(content.match(/:whiny:/g)){
            content = (content.replace(/:whiny:/g,"<img title='...' class='emoti animated rubberBand' src='../images/chat/emoticons/whiny.png'>"));
        }
        if(content.match(/:kippi:/g)){
            content = (content.replace(/:kippi:/g,"<img title='...' class='emoti animated tada' src='../images/chat/emoticons/kippi.png'>"));
        }
        if(content.match(/:kippi2:/g)){
            content = (content.replace(/:kippi2:/g,"<img title='...' class='emoti animated tada' src='../images/chat/emoticons/kippi2.png'>"));
        }
        if(content.match(/:kippi3:/g)){
            content = (content.replace(/:kippi3:/g,"<img title='...' class='emoti animated tada' src='../images/chat/emoticons/kippi3.png'>"));
        }
        //Special Emotes
        if(content.match(/:special1:/g)){
            content = (content.replace(/:special1:/g,"<span class='special_emote'>͡° ͜ʖ ͡°</span>"));
        }
        if(content.match(/:special2:/g)){
            content = (content.replace(/:special2:/g,"<span class='special_emote'>ಠ_ಠ</span>"));
        }
        if(content.match(/:special3:/g)){
            content = (content.replace(/:special3:/g,"<span class='special_emote'>ΘεΘ</span>"));
        }
        if(content.match(/:special4:/g)){
            content = (content.replace(/:special4:/g,"<span class='animated jello special_emote green_emote'>ᕕ( ᐛ )ᕗ</span>"));
        }
        if(content.match(/:special5:/g)){
            content = (content.replace(/:special5:/g,"<span class='special_emote'> ͠° ͟ʖ ͡°</span>"));
        }
        if(content.match(/:special6:/g)){
            content = (content.replace(/:special6:/g,"<span class='animated tada special_emote brown_emote'>ᕦʳ ´º㉨ºᕤ</span>"));
        }
        if(content.match(/:special7:/g)){
            content = (content.replace(/:special7:/g,"<span class='animated swing special_emote'>ಥ_ಥ</span>"));
        }
        if(content.match(/:special8:/g)){
            content = (content.replace(/:special8:/g,"<span class='animated bounceIn special_emote red_emote'>╬ ಠ益ಠ</span>"));
        }

        //Speechbubble
        if(content.match(/\*\[/g)){
            content = (content.replace(/\*\[/g,"<span class='speechbubble_right'>"));
        }
        if(content.match(/\[/g)){
            content = (content.replace(/\[/g,"<span>"));
        }
        if(content.match(/\]\*/g)){
            content = (content.replace(/\]\*/g,"</span>"));
            content = (content.replace("<span>","<span class='speechbubble_left'>"));
        }
        if(content.match(/\]/g)){
            content = (content.replace(/\]/g,"</span>"));
        }

        //SDFSDAFGSADF


        //MEME
        /*
        if(content.match(/:meme1:/g)){
            content = (content.replace(/\:meme1\:/g,"<img title='Forever alone ;_;' class='memeEmoti animated jello' src='../images/chat/emoticons/meme/alone.png'>"));
        }
        if(content.match(/:meme2:/g)){
            content = (content.replace(/\:meme2\:/g,"<img title='Jackie why?!' class='memeEmoti animated shake' src='../images/chat/emoticons/meme/jackie.png'>"));
        }
        if(content.match(/:meme3:/g)){
            content = (content.replace(/\:meme3\:/g,"<img title='NO WAY!' class='memeEmoti animated flash' src='../images/chat/emoticons/meme/whaaat.jpg'>"));
        }
        if(content.match(/:meme4:/g)){
            content = (content.replace(/:meme4:/g,"<img title='DSFGHG ERUJW TGDF J' class='memeEmoti animated swing' src='../images/chat/emoticons/meme/arms.gif'>"));
        }
        if(content.match(/:meme5:/g)){
            content = (content.replace(/:meme5:/g,"<img title='FU DA BI' class='memeEmoti animated rubberBand' src='../images/chat/emoticons/meme/fubu.png'>"));
        }
        */
        /* HEART */
        if(content.match(/&lt;3/g)){
            content = (content.replace(/&lt;3/g,"<span class='animated rubberBand heart'></span>"));
        }

        container.html(content);
      // fix emoticons that got matched more then once (where one emoticon is a subset of another emoticon), and thus got nested spans
      $.each(excludeArray,function(index,item){
        container.find($.trim(item)+" span.css-emoticon").each(function(){
          $(this).replaceWith($(this).text());
        });
      });
      if(opts.animate){
        setTimeout(function(){$('.un-transformed-emoticon').removeClass('un-transformed-emoticon');}, opts.delay);
      }
    });
}