// ==UserScript==
// @name    Smilley BBCode for dealabs
// @version 1.9.2
// @description Ajout d'options de formatage sur dealabs
// @include *.dealabs.com/*
// @run-at document-end
// @namespace https://greasyfork.org/users/33719
// @downloadURL https://update.greasyfork.org/scripts/18012/Smilley%20BBCode%20for%20dealabs.user.js
// @updateURL https://update.greasyfork.org/scripts/18012/Smilley%20BBCode%20for%20dealabs.meta.js
// ==/UserScript==
/*jshint multistr: true */

var smileyarr = {
    "siffle" : "http://www.turbopix.fr/i/RZAK5VBi4M.gif",
    "fouet" : "http://www.turbopix.fr/i/BpU1pU7Onm.gif",
    "troll" : "http://www.turbopix.fr/i/7FU50TeJ5C.png",
    "jaime" : "http://www.turbopix.fr/i/hb4xtAwWjK.png"
};

if(unsafeWindow.localStorage.getItem('userscript_emoticones') === null){
     unsafeWindow.localStorage.setItem('userscript_emoticones', JSON.stringify(smileyarr));
}

function passFunctionToConsole(func){
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(func));
    (document.body || document.head || document.documentElement).appendChild(script);
}

function addSmiley(name, url){
    name = name || null;
    url = url || null;

    if(name === null){
       name = prompt("Nom de votre emoticone (lettres seulement)");
        if(name === null){
           console.log("abandon !");
            return;
        }
    }

    if(url === null){
       url = prompt("url de votre emoticone");
        if(url === null){
           console.log("abandon !");
            return;
        }
    }
    
    
    if(typeof unsafeWindow == "undefined")
        unsafeWindow = window;
    
    current_smileys = JSON.parse(unsafeWindow.localStorage.getItem('userscript_emoticones'))||{};
    current_smileys[name] = url;
    localStorage.setItem('userscript_emoticones', JSON.stringify(current_smileys));
    jQuery('[data-role="emoticone_add_userscript"]').remove();
    update_emoticone_textarea();
    return "";
}

function insertSmiley()
{
    textarea = jQuery(this).parents('.formating_text_contener').parent('div').find('textarea');
    if(textarea.length > 0){
        textarea = textarea.get(0);
    }
    else{
        return;
    }

    var scrollTop = textarea.scrollTop;
    var scrollLeft = textarea.scrollLeft;

    var nom = this.getElementsByTagName('img')[0].getAttribute("title");
    textarea.focus();
    //textarea.value += '[img size="300px"]'+image+"[/img]";
    //add smiley at cursor position
    var cursorPos = jQuery(textarea).prop('selectionStart');
    var v = jQuery(textarea).val()
    v = v.slice(0, textarea.selectionStart) + v.slice(textarea.selectionEnd);;
    var textBefore = v.substring(0,  cursorPos);
    var textAfter  = v.substring(cursorPos, v.length);
    $(textarea).val(textBefore + ':'+nom+":" + textAfter);

    //positionne cursor in textarea
    selectionStart = selectionEnd = (textBefore + ':'+nom+":").length
    if (textarea.setSelectionRange) {
        textarea.focus();
        textarea.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (textarea.createTextRange) {
        var range = textarea.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }

    // textarea.value += ':'+nom+":";
    textarea.scrollTop = scrollTop;
    textarea.scrollLeft = scrollLeft;
}

function removeSmiley(name){
    if(typeof unsafeWindow == "undefined")
        unsafeWindow = window;
    
    current_smileys = JSON.parse(unsafeWindow.localStorage.getItem('userscript_emoticones'))||{};

    arrayObjectIndexOf = function (myArray, searchTerm) {
        for (var name in myArray){
            if (name === searchTerm) return name;
        }
        return null;
    }

    
    index = arrayObjectIndexOf(current_smileys, name);
    
    if (index !== null) {
        delete current_smileys[index];
    }
    else{
        console.log("Aucun emoticone avec ce nom, voici la liste de vos emoticones :");
        console.group();
        
        for(name in current_smileys)
        {
            console.log('- '+name);
        }   
        console.groupEnd();
    }    
    
    localStorage.setItem('userscript_emoticones', JSON.stringify(current_smileys));
    jQuery('[data-role="emoticone_add_userscript"]').remove();
    update_emoticone_textarea();
    return "";
}

function update_emoticone_textarea()
{
    if(typeof jQuery == "undefined")
        return;


    jQuery('.third_part_button').each(function(index, value){
        c=this;
        
        if(typeof unsafeWindow == "undefined")
            unsafeWindow = window;
        
        current_smileys = JSON.parse(unsafeWindow.localStorage.getItem('userscript_emoticones'))||{};
        for(var title in current_smileys)
        {
            mm=document.createElement("a");
            mm.href="javascript:;";
            mm.setAttribute("style",'text-decoration:none');
            mm.dataset.role = "emoticone_add_userscript";
            mm.innerHTML='<img style="max-height:20px" title="'+title+'" src="'+current_smileys[title]+'" alt="'+title+'"/>';
            mm.addEventListener("click", insertSmiley, true);
            c.appendChild(mm);
        }   
    });
}

function preview(){
    
}

//override
function validate_comment() {
    error = false;
    error_text = "Des champs obligatoires n’ont pas été remplis, ou l’ont été incorrectement.";
    $("#discussed .flag.obligatoire").each(function() {
        verif_champs_obligatoire(this)
    });
    if (!error) {
        $("#discussed .message_erreur_header").hide();
        $("#discussed .validate_form a").attr('onclick', "");
        $("#discussed .spinner_validate").show();
        if (typeof document.forms.comment_form.deal_id != 'undefined') {
            var v = sessionStorage.getItem('comment_for_deal_' + document.forms.comment_form.deal_id.value);
            if (v) {
                sessionStorage.removeItem('comment_for_deal_' + document.forms.comment_form.deal_id.value)
            }
        } else if (typeof document.forms.comment_form.thread_id != 'undefined') {
            var v = sessionStorage.getItem('comment_for_thread_' + document.forms.comment_form.thread_id.value);
            if (v) {
                sessionStorage.removeItem('comment_for_thread_' + document.forms.comment_form.thread_id.value)
            }
        }
        jQuery(document.comment_form).trigger('submit')
    } else {
        $("#discussed .message_erreur_header").slideDown("fast");
        $("#discussed .message_erreur_header p").text(error_text)
    }
}
function send_reply(number_form) {
    error = false;
    var error_text = "Des champs obligatoires n’ont pas été remplis.";
    $("#reply_MP_form_" + number_form + " .flag.obligatoire").each(function() {
        verif_champs_obligatoire(this)
    });
    if (!error) {
        $("#reply_message.message_erreur_header").hide();
        $("#reply_MP_form_" + number_form + " .enter_validate").attr('onclick', "");
        $("#reply_MP_form_" + number_form + " .spinner_validate").show();
        jQuery(document.forms["reply_MP_form_" + number_form]).trigger('submit');
    } else {
        $("#reply_message.message_erreur_header").slideDown("fast");
        $("#reply_message.message_erreur_header p").text(error_text)
    }
}

function send_mp() {
    error = false;
    var error_text = "Des champs obligatoires n’ont pas été remplis, ou l’ont été incorrectement.";
    $("#new_MP_form .flag.obligatoire").each(function() {
        verif_champs_obligatoire(this)
    });
    if (!error) {
        $("#all_contener_content_messagerie .message_erreur_header").hide();
        $("#new_MP_form .enter_validate").attr('onclick', "");
        $("#new_MP_form .spinner_validate").show();
        jQuery(document.forms["new_MP_form"]).trigger('submit')
    } else {
        $("#all_contener_content_messagerie .message_erreur_header").slideDown("fast");
        $("#all_contener_content_messagerie .message_erreur_header p").text(error_text)
    }
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

iframeTpl = '<div class="quote" style="height: 500px;"><iframe id="ytplayer" height="100%" width="100%" type="text/html"\
  src="http://www.youtube.com/embed/{{id}}?autoplay=1&origin={{base_url}}"\
  frameborder="0"/></div>';

YTBLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgFEBsGdGFydgAAAUpJREFUKM99krFKXFEQhr8598gVXAyYNApioqAQF0KKPMGKLyEWlnkOCxtJGSzEWgVLwTxBLJJHSJNCMNEQiSibe2Z+C7fY624y8DfD/3/DmTn2/fXypCX7CLwDpoEpoAYmgIrHcqAB+sAdcAN8Veh9DtgxaYv/Vx5AO8BzYB7oCv5kl3qmMZGqggiQ/kkV9FJxzZYQw2qaQmdjk7TaxfMERfDUU0IU12zyUMdDtORB/eYtC8cnzOx+IC2v4BgjvlAnuUgl4KnkDsBMb425/QN4uUjjbY+LlD0UI28L4f0+zeUl14dH/NjbI+7usSpBeyVhXxZe/QRetNoePFtf4/bzOeX6F1bXkGzcHn/nEroYAZhxdXqG5QrqejBr7DUucoTOBF1Eal8+jwaHGYYMPuXGYyeZLQErQK3H31cNgGkoGoAbFOAv4ltI2w/zrcgq2WPx2AAAAABJRU5ErkJggg==";

function viewYoutubeInline(){
    $('.commentaire_div a.link_a_reduce').each(function(){
        link = this.title || this.innerText;
        youtubeID = link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
        if(youtubeID != null && typeof youtubeID[1] != "undefined"){
           $(this).after(' <span data-userscript-ytb-iframe="close" data-userscript-ytb-id="'+youtubeID[1]+'"><img src="'+YTBLogo+'" alt="open or close youtube video"/></span>');
        }
        //debugger;
    });
    
    $('body').on('click', '[data-userscript-ytb-id]', function(){
       console.log($(this).data('userscript-ytb-iframe'));
       if($(this).data('userscript-ytb-iframe') == "close"){
           iframeYTB = $(iframeTpl.replace(/{{base_url}}/, location.protocol+'//'+location.hostname).replace(/{{id}}/,$(this).data('userscript-ytb-id')));
           this.iframeYTB = iframeYTB;
           $(this).after(iframeYTB);
           $(this).data('userscript-ytb-iframe', "open");
       }
       else{
           $(this.iframeYTB).remove();
           $(this).data('userscript-ytb-iframe', "close");
       }
    });
}

update_emoticone_textarea();
passFunctionToConsole(update_emoticone_textarea);
passFunctionToConsole(addSmiley);
passFunctionToConsole(insertSmiley);
passFunctionToConsole(removeSmiley);
passFunctionToConsole(validate_comment);
passFunctionToConsole(send_reply);
passFunctionToConsole(send_mp);
passFunctionToConsole(viewYoutubeInline);

jQuery(function(){
  viewYoutubeInline();
  jQuery('body').on('submit', 'form', function(){
    text = jQuery(this).find('[name="post_content"]').val();
    if(typeof text == "undefined")
        return;      
    if(typeof unsafeWindow == "undefined")
      unsafeWindow = window;
    current_smileys = JSON.parse(unsafeWindow.localStorage.getItem('userscript_emoticones'))||{};
    for(var nom in current_smileys){
       text = text.replace(new RegExp(':'+escapeRegExp(nom)+':', 'g'), '[img size="300px"]'+current_smileys[nom]+'[/img]');
    }

    jQuery(this).find('[name="post_content"]').val(text);      
  });
    
  jQuery('.validate_button_form').each(function(index){
    clone =  $(this).clone()
    clone = clone.get(0)  
  })
  
  jQuery('.validate_button_form').each(function(index){
    if(jQuery(this).parents('#right_profil_param').length>0)
        return;
      
    clone =  jQuery(this).clone().attr('onclick', null).attr('accesskey', 'p').text("Prévisualiser");
    jQuery(this).after(clone);
    clone.on('click', function(){
      if(jQuery(this).parents('#discussed').length > 0){
        $putContainer = jQuery('#comment_contener');
        func = "append";
        commentContainer = '<div id="_userscript_preview_container" data-userscript="comment_contener" style="display:none;" class="padding_comment_contener">\
          <div class="profil_image_part">\
              <a href="{{userlink}}" class="open_profil"><img src="{{useravatar}}"></a>\
          </div>\
          <div class="comment_text_part">\
              <div class="header_comment">\
                  <a href="{{userlink}}" class="pseudo text_color_blue">{{username}}</a>\
                  <p><span>prévisualisation</span></p>\
              </div>\
              <div>\
                  <div class="commentaire_div">\
                      {{commentaire}}\
                  </div>\
              </div>\
          </div>\
        </div>';
      }
      else if(jQuery(this).parents('#add_thread_form').length > 0 ){
        $putContainer = jQuery('#left_global .padding_left_global');
        func = "prepend";
        commentContainer = '<div id="_userscript_preview_container" data-userscript="comment_contener" style="display:none;" class="padding_comment_contener">\
          <div class="comment_text_part">\
            <fieldset style="padding:20px;margin-bottom:20px;"><legend>Prévisualisation</legend>\
              <div class="commentaire_div">\
                  {{commentaire}}\
              </div>\
            </fieldset>\
          </div>\
        </div>';
      }
      else if(jQuery(this).parents('#reply_ancre').length){
        $putContainer = jQuery('#all_contener_messagerie > .content_profil_messagerie:first()');
        func = "append";
        commentContainer = '<div id="_userscript_preview_container" data-userscript="comment_contener" style="display:none;" class="content_message background_color_white">\
            <div class="profil_message">\
                <div class="image_profil">\
                    <img src="{{useravatar}}">\
                </div>\
                <div class="right_titre_message">\
                            </div>\
                <div class="info_message">\
                                    <p class="username text_color_333333">{{username}}</p>\
                                <p class="date text_color_777777" style="float:left;">prévisualisation</p>\
                            </div>\
            </div>\
            <p class="text_color_777777 message_content_text" style="padding:15px 0px;">\
                {{commentaire}}\
            </p>\
        </div>';
      }
      else{
        $putContainer = jQuery(this).parents('.padding_comment_contener');
        func = "before"; 
        commentContainer = '<div id="_userscript_preview_container" data-userscript="comment_contener" style="display:none;" class="padding_comment_contener">\
          <div class="profil_image_part">\
              <a href="{{userlink}}" class="open_profil"><img src="{{useravatar}}"></a>\
          </div>\
          <div class="comment_text_part">\
              <div class="header_comment">\
                  <a href="{{userlink}}" class="pseudo text_color_blue">{{username}}</a>\
                  <p><span>prévisualisation</span></p>\
              </div>\
              <div>\
                  <div class="commentaire_div">\
                      {{commentaire}}\
                  </div>\
              </div>\
          </div>\
        </div>';
      }
      
      commentaire = jQuery(this).parents('form').find('textarea').val();
      if(jQuery('#_userscript_preview_container').length>0){
        jQuery('#_userscript_preview_container').slideUp(500, function(){
          jQuery(this).remove()
          $putContainer[func](generatePreview(commentContainer, commentaire));
          jQuery('#_userscript_preview_container').slideDown(500);
        });  
      }
      else{
        $putContainer[func](generatePreview(commentContainer, commentaire));
        jQuery('#_userscript_preview_container').slideDown(500);
      }

      //override spoiler
      $('.click_div_spoiler').off('click');
      $('.click_div_spoiler').click(function(e) {
        if ($(this).next().is(":hidden")) {
            $(this).parents(".quote").last().children('.quote_message').css('max-height', 'none')
        }
        $(this).next().slideToggle("fast", function() {
            if ($(this).is(":hidden")) {
                $(this).parent().children('.click_div_spoiler').html('Ce message a été masqué par son auteur. Cliquez pour l’afficher.')
            } else {
                $(this).parent().children('.click_div_spoiler').html('Contenu du message :')
            }
        })
      });
      //override long quote
      $('.commentaire_div > div.quote').each(function() {
        quote_height_max = parseInt($(".quote_message").css("max-height"), 10);
        var current_height = $(this).find('.quote_message').height();
        if (current_height == quote_height_max) {
          $(this).find('a.open:first').stop().fadeTo('fast', 1);
          $(this).find('a.open:first').text("Afficher l'intégralité de la citation")
        } else if (current_height > quote_height_max) {
          $(this).find('a.open:first').stop().fadeTo('fast', 1);
          $(this).find('a.open:first').text("Masquer la citation")
        }
      })
      $('.commentaire_div > div.quote > div.quote_pseudo > p.pseudo_tag > a.open').off('click');
      $('.commentaire_div > div.quote > div.quote_pseudo > p.pseudo_tag > a.open').click(function(e) {
        var current_height = $(this).parents(".quote").children('.quote_message').height();
        if (current_height <= quote_height_max) {
          $(this).parents(".quote").children('.quote_message').css('max-height', 'none');
          $(this).text("Masquer la citation")
        } else {
          $(this).parents(".quote").children('.quote_message').css('max-height', quote_height_max + 'px');
          $(this).text("Afficher l'intégralité de la citation")
        }
      });
    })
  })
})

BBcodes = [
  {
    regex : /\[img size="?([0-9]*)px"?\]([^\]]*)\[\/img\]/gi,
    html : '<img alt="" class="BBcode_image" onclick="window.open(this.src);" style="max-width:$1px;" src="$2">',
    name : 'img'
  },
  {
    regex : /\[img size="?([0-9]*)"?\]([^\]]*)\[\/img\]/gi,
    html : '<img alt="" class="BBcode_image" onclick="window.open(this.src);" style="max-width:$1px;" src="$2">',
    name : 'img'
  },
  {
    regex : /\[img\s*\]([^\]]*)\[\/img\]/gi,
    html : '<img alt="" class="BBcode_image" onclick="window.open(this.src);" style="max-width:300px;" src="$1">',
    name : 'img'
  },
  {
    regex : /\[citer pseudo="?([^"]*)"?\]/gi, 
    html : '<div class="quote">\
    <div class="quote_pseudo text_color_777777">\
        <p class="pseudo_tag">\
            <span class="text_color_333333">$1</span><span> a écrit</span><a href="javascript:;" class="open text_color_777777">Afficher l\'intégralité de la citation</a>\
        </p>\
    </div>\
    <div class="quote_message text_color_777777">',
    name : 'quote_start'
  },
  {
    regex : /\[citer\s*\]/gi, 
    html : '<div class="quote">\
    <div class="quote_pseudo text_color_777777">\
        <p class="pseudo_tag">\
            <span class="text_color_333333">Quelqu\'un</span><span> a écrit</span><a href="javascript:;" class="open text_color_777777">Afficher l\'intégralité de la citation</a>\
        </p>\
    </div>\
    <div class="quote_message text_color_777777">',
    name : 'quote_start'
  },
  {
    regex : /\[\/citer\]/gi, 
    html : '</div></div>',
    name : 'quote_end'
  },
  {
    regex : /\[spoiler\s*\]/gi, 
    html : '<div class="spoiler">\
          <a href="javascript:;" class="click_div_spoiler text_color_333333">Ce message a été masqué par son auteur. Cliquez pour l’afficher.</a>\
          <div class="spoiler_hide text_color_777777" style="display: none;">',
    name : 'spoil_start'
  },
  {
    regex : /\[\/spoiler\]/gi, 
    html : '</div></div>',
    name : 'spoil_end'
  },
  {
    regex : /\[b\]/gi, 
    html : '<b>',
    name : 'b_end'
  },
  {
    regex : /\[\/b\]/gi, 
    html : '</b>',
    name : 'b_end'
  },
  {
    regex : /\[i\]/gi, 
    html : '<i>',
    name : 'i_end'
  },
  {
    regex : /\[\/i\]/gi, 
    html : '</i>',
    name : 'i_end'
  },
  {
    regex : /\[u\]/gi, 
    html : '<u>',
    name : 'u_end'
  },
  {
    regex : /\[\/u\]/gi, 
    html : '</u>',
    name : 'u_end'
  },
  {
    regex : /\[s\]/gi, 
    html : '<del>',
    name : 'del_end'
  },
  {
    regex : /\[\/s\]/gi, 
    html : '</del>',
    name : 'del_end'
  },
  {
    regex : /\[up\]/gi, 
    html : '<font style="font-size:1.2em;">',
    name : 'up_end'
  },
  {
    regex : /\[\/up\]/gi, 
    html : '</font>',
    name : 'up_end'
  }
];

BBcodesSmiley = [
  { 
    name:"img-souris",
    smiley:":)"
  },
  { 
    name:"img-clindoeil",
    smiley:";)"
  },
  { 
    name:"img-triste",
    smiley:":("
  },
  { 
    name:"img-rire",
    smiley:":D"
  },
  { 
    name:"img-surpris",
    smiley:":o"
  },
  { 
    name:"img-cool",
    smiley:"^^"
  },
  { 
    name:"img-lunette",
    smiley:"B)"
  },
  { 
    name:"img-stress",
    smiley:"-_-'"
  },
  { 
    name:"img-sour",
    smiley:"xS"
  },
  { 
    name:"img-silly",
    smiley:":P"
  },
  { 
    name:"img-sick",
    smiley:":S"
  },
  { 
    name:"big_grin_squint",
    smiley:"xD"
  },
  { 
    name:"crying",
    smiley:":'("
  },
  { 
    name:"evil",
    smiley:"':)"
  },
  { 
    name:"inlove",
    smiley:":3"
  },
  { 
    name:"nerdy",
    smiley:"|D"
  },
  { 
    name:"zipped",
    smiley:":|"
  },
  { 
    name:"redface",
    smiley:"|o"
  }
]

function match_all(re, str){
  var retour = [];
  while ((m = re.exec(str)) !== null) {
    if (m.index === re.lastIndex) {
        re.lastIndex++;
    }
    retour.push(m);
  }

  return retour;
}

function nl2br(str) {  
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2');
}

function getUrls(content){
  var re = /((?:http|ftp|https):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/g; 
  return content.match(re) || [];
}

function generatePreview(commentContainer, commentaire){
  userData = jQuery('#pseudo_right_header_contener');

  replacements = {};

  if(typeof commentaire == "undefined")
    return;      
  if(typeof unsafeWindow == "undefined")
    unsafeWindow = window;
  current_smileys = JSON.parse(unsafeWindow.localStorage.getItem('userscript_emoticones'))||{};
  for(var nom in current_smileys){
     commentaire = commentaire.replace(new RegExp(':'+escapeRegExp(nom)+':', 'g'), '[img size="300px"]'+current_smileys[nom]+'[/img]');
  }

  for (var i = 0; i < BBcodes.length; i++) {
    if(typeof replacements[BBcodes[i].name] == "undefined")
      replacements[BBcodes[i].name] = [];

    bbcodes_found = match_all(BBcodes[i].regex, commentaire);
    for (var j = bbcodes_found.length - 1; j >= 0; j--) {
      cur_bbcodes_found = bbcodes_found[j][0];

      subst = BBcodes[i].name+'_'+replacements[BBcodes[i].name].length
      
      commentaire = commentaire.replace(new RegExp(escapeRegExp(cur_bbcodes_found)), '['+subst+']');
      replacements[BBcodes[i].name].push({
        subst : subst, 
        after : cur_bbcodes_found.replace(BBcodes[i].regex, BBcodes[i].html)
      });
    }
  }

  //match url, and replace by bbcode, for escape smiley
  if(typeof replacements["link"] == "undefined")
    replacements["link"] = [];
  urls = getUrls(commentaire);
  for (var i = urls.length - 1; i >= 0; i--) {
    subst = 'link_'+replacements["link"].length
    commentaire = commentaire.replace(new RegExp(escapeRegExp(urls[i])), '['+subst+']');
    //url length
    if(urls[i].length<=25)
      after = '<a href="'+urls[i]+'">'+urls[i]+'</a>';
    else
      after = '<a class="link_a_reduce" href="'+urls[i]+'">'+urls[i].substr(0,15)+'<i></i><span>'+urls[i].substr(15,urls[i].length-10-15)+'</span>'+urls[i].substr(urls[i].length-10,urls[i].length)+'</a>';

    replacements["link"].push({
      subst : subst, 
      after : after
    });
  }

  //match smiley
  for (var i = 0; i < BBcodesSmiley.length; i++) {
    commentaire = commentaire.replace(new RegExp(escapeRegExp(BBcodesSmiley[i].smiley), 'gi'), '<img src="http://static.dealabs.com/images/smiley/'+BBcodesSmiley[i].name+'.png" width="16" height="16" alt="'+BBcodesSmiley[i].smiley+'" title="'+BBcodesSmiley[i].smiley+'" class="bbcode_smiley">')
  }

  for( code in replacements){
    for (var i = 0; i < replacements[code].length; i++) {
      cur_code = replacements[code][i];
      commentaire = commentaire.replace(new RegExp('\\['+cur_code.subst+'\\]'), cur_code.after);
    }
  }

  commentContainer = commentContainer.replace(/{{userlink}}/g, userData.attr('href'));
  commentContainer = commentContainer.replace(/{{useravatar}}/g, userData.find('img').attr('src'));
  commentContainer = commentContainer.replace(/{{username}}/g, userData.find('span').text());
  commentContainer = commentContainer.replace(/{{commentaire}}/g, nl2br(commentaire));
  return commentContainer;
}

settingsContainer = '<style>\
#_userscript_setting_modal{\
    display: none;\
    left: 50%;\
    margin-left: -330px;\
    position: fixed;\
    text-align: left;\
    top: 5%;\
    z-index: 1000;\
    border: 10px solid rgba(0, 0, 0, 0.4);\
    width: 660px;\
    border: 10px solid rgba(0, 0, 0, 0.4);\
    -webkit-transition: opacity .3s ease, top .3s ease;\
    -moz-transition: opacity .3s ease, top .3s ease;\
    -ms-transition: opacity .3s ease, top .3s ease;\
    -o-transition: opacity .3s ease, top .3s ease;\
    transition: opacity .3s ease, top .3s ease;    \
}\
#_userscript_setting_modal form {\
    padding: 50px 20px 20px 20px;\
}\
#_userscript_setting_modal input {\
    width: initial;\
}\
#_userscript_setting_modal .header_popup{\
    padding: 15px 0px 15px 0px;\
    background-color: #02A5C1;\
    width: 100%;\
    float: left;\
    background-image: url(http://www.turbopix.fr/i/xYPzILHzRT.png);\
    background-position: right top;\
    background-repeat: no-repeat;\
}\
#_userscript_setting_modal .header_popup p {\
    color: white;\
    font-size: 2.2em;\
    margin-left: 15px;\
}\
#_userscript_setting_modal .sub_header_popup{\
    background-color: #f5f5f5;\
    width: 100%;\
    float: left;\
}\
#_userscript_setting_modal .sub_header_popup p {\
    line-height: 30px;\
    color: black;\
    font-weight: bold;\
    margin: 0px 15px;\
}\
#_userscript_setting_modal .content{\
    width: 100%;\
}\
#_userscript_setting_modal .background_white{\
    background: white;\
}\
[data-userscript="close_modal"]{\
    position: absolute;\
    margin-top: -32px;\
    font-weight: bold;\
    color: white;\
    line-height: 22px;\
    margin-left: 601px;\
    top: 0;\
    width: auto;\
}   \
</style>\
<div id="_userscript_setting_modal">\
    <div class="background_white">\
        <div class="header_popup">\
            <a data-userscript="close_modal" href="javascript:;">Fermer X</a>\
            <p>Paramètres</p>\
        </div>\
        <div class="content">\
            <div class="sub_header_popup">\
                <p><span>Paramètres de formatage avancé</span></p>\
            </div>\
            <div class="message_erreur_header" style="padding:0px;"><p></p></div>\
            <form name="_userscript_setting_form">\
                <label for="_userscript_turbopix_api_key">Turbopix API key</label> : <input type="text" name="_userscript_turbopix_api_key">\
                <b>Où trouver ma clé utilisateur ?</b>Vous pouvez trouver votre clé sur la page "Mon Compte" (<a href="http://www.turbopix.fr/profile">www.turbopix.fr/profile</a>) > "Clé utilisateur :".\
            </form>\
        </div>\
    </div>\
</div>'

function openSettings(){
  jQuery("#overlay").css("visibility", "visible").css("opacity", 1);
  if(jQuery('#_userscript_setting_modal').length == 0){
    jQuery('body').append(settingsContainer);
    jQuery('#overlay').click(function(){
      jQuery("#_userscript_setting_modal").hide();    
    })
    jQuery('[data-userscript="close_modal"]').on('click',function(){
      jQuery(this).parents('#_userscript_setting_modal').slideUp(500, function(){
        jQuery("#overlay").css("visibility", "none").css("opacity",0);
      })
    })
  }
  jQuery("#_userscript_setting_modal").slideDown(500)
}


passFunctionToConsole(openSettings);