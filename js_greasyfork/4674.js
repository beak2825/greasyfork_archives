// ==UserScript==
// @name        ClipFormat! (Derpibooru - comment autoformatter from clipboard)
// @namespace   https://derpiboo.ru/pasteformatizer
// @description Save format, images and links when pasting from clipboard into commentbox in derpibooru. (script by VcSaJen, icon by TryHardBrony)
// @include     /https?://(www\.)?derpiboo.ru/.*/
// @include     /https?://(www\.)?trixiebooru.org/.*/
// @include     /https?://(www\.)?derpibooru.org/.*/
// @icon        https://dl.dropboxusercontent.com/u/7410519/ScreenS/i_came_to_write_fanfics_by_tryhardbrony-64px-256col.png
// @license     LGPL 3 or later
// @version     0.8
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.selection/1.0.1/jquery.selection.min.js
// @require     https://greasyfork.org/scripts/4535-htmlparser/code/htmlparser.js?version=15389
// @downloadURL https://update.greasyfork.org/scripts/4674/ClipFormat%21%20%28Derpibooru%20-%20comment%20autoformatter%20from%20clipboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4674/ClipFormat%21%20%28Derpibooru%20-%20comment%20autoformatter%20from%20clipboard%29.meta.js
// ==/UserScript==

(function($) //< custom $ compatibility
{ 

  $(function() //ready
  {
    var textasrea_selector = 'textarea#comment_body,textarea#topic_posts_attributes_0_body,textarea#post_body,textarea#image_description';
    var simple_format_tags = /^(em|i|strong|b|ins|u|del|strike|s|pre|sup|sub|cite)$/i;
    var basic_fomat_chars = {"strong":"*",
                             "b":"**",
                             "em":"_",
                             "i":"__",
                             "del":"-",
                             "ins":"+",
                             "sup":"^",
                             "sub":"~",
                             "pre":"@",
                             "cite":"??"
                             };
    //$(textasrea_selector).after('<textarea id="mymymy"></textarea>');
    
    $(textasrea_selector).parent().before($('<div/>',{'class': 'field'}).append($('<label/>',{'for': 'clipformat_check', text: 'Clipformat', 'title': 'Format text from clipboard'}),
                                                                                $('<input/>',{id: 'clipformat_check', 'type': 'checkbox'}),
                                                                                $('<span/>',{id: 'clipformat_error', 'style': 'display:none;', 'class': 'comment_deleted', text: ' Error!'})));
    var mycbChecked;
    
    $('#clipformat_check').change(function (e) {
      mycbChecked = $('#clipformat_check').prop('checked');
      if (mycbChecked)
      {
        $(textasrea_selector).css('outline-color', '#5E95BC');
        $(textasrea_selector).css('outline-width', '1px');
        $(textasrea_selector).css('outline-style', 'solid');
      } else
      {
        $(textasrea_selector).css('outline-style', 'none');
      }
    }).dblclick(function (e) {
      $('#clipformat_check').prop("checked", true);
      $('#clipformat_check').prop("indeterminate", true);
      $('#clipformat_check').trigger("change");
    });
    
    $(textasrea_selector).on('paste', function (e) {
      if (!mycbChecked) return;
      if (e.originalEvent.clipboardData || e.clipboardData)
      {
        //alert('ok!');
        $('#clipformat_error').hide();
        var s = "";
        var clipdata = (e.originalEvent.clipboardData || e.clipboardData);
        
        /*s+="html:"+clipdata.getData('text/html')+"\n";
        s+="plain:"+clipdata.getData('text/plain')+"\n";
        
        var types = clipdata.types;
        var count = types.length;
        s+="types:\n";
        for (var i = 0; i < count; i++) 
        {
            s+="type"+i+": "+types[i]+"\n";
        }
        //$("#output").text(s);
        alert(s);*/
        
        try {
          s="";
          var myhtml = clipdata.getData('text/html');

          if (!myhtml) {
            //alert("NO HTML!"); 
            //flashElement($(textasrea_selector));
            return;
          }
          
          if (/^<html xmlns:v="urn:schemas-microsoft-com:vml"/.test(myhtml))
            myhtml=cleanHTML(myhtml);
            
          myhtml=myhtml.replace(/<!?\[[^>]*?\](?!--)?>/g, "");
          myhtml=myhtml.replace(/<title>([\s\S].*?)<\/title>/gi, " ");
          myhtml=myhtml.replace(/<style[\s\S]*?<\/style>/gi, " ");
          
          if (!$('#clipformat_check').prop('indeterminate'))
          {
            $('#clipformat_check').prop("checked", false);
            $('#clipformat_check').trigger("change");
          }
          
          //alert(myhtml);
          
          function writableTag(tag)
          {
            var result = tag;
            if (result==="strike"||result==="s") result="del";
            if (result==="u") result="ins";
            /*em|i|strong|b|ins|u|del|strike|pre|sup|sub*/
            return result;
          }
          function htmlCharize(s)
          {
            var i, result="";
            for (i=0;i<s.length;i++)
            {
              result+='&#'+s.charCodeAt(i)+';';
            }
            //alert("result="+result);
            return result;
          }
          function escapeFull(s)
          {
            var i, result="";
            for (i=0;i<s.length;i++)
            {
              var tmp="";
              tmp=Number(s.charCodeAt(i)).toString(16);
              if (tmp.length<2) tmp='0'+tmp;
              result+='%'+tmp;
            }
            //alert("result="+result);
            return result;
          }
          function escapeRegexStr(s)
          {
            var i, result="";
            for (i=0;i<s.length;i++)
            {
              var ch = s.charAt(i);
              if (ch==="*"||ch==="+"||ch==="?"||ch==="\\"||ch==="^"||ch==="$"||ch==="."||ch==="|"||ch==="("||ch===")"||ch==="["||ch==="]"||
                  ch==="{"||ch==="}") result+="\\"+ch;
              else result+=ch;
            }
            return result;
          }
          
          var nomoreparseing = false;
          var currentLinkTitle;
          var currentLinkURL;
          var currentLinkContent="";
          var currently_a = false;
          var spoilerLevel = 0;
          var state = {"strong":false,
                       "b":false,
                       "em":false,
                       "i":false,
                       "del":false,
                       "ins":false,
                       "sup":false,
                       "sub":false,
                       "pre":false,
                       "cite":false};
          

          
          HTMLParser(myhtml, {
            start: function( tag, attrs, unary ) {
              tag=tag.toLowerCase();
              if (tag.match(simple_format_tags))
              {
                s += "<" + writableTag(tag) + ">";
                state[writableTag(tag)]=true;
                return;
              }
              var atlist = {"href": "", "src": "http://"};
              /*s += "[" + tag;
           
              for ( var i = 0; i < attrs.length; i++ )
                s += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
          
              s += (unary ? "/" : "") + "]";*/
              
              for ( var i = 0; i < attrs.length; i++ )
                atlist[attrs[i].name.toLowerCase()]=attrs[i].value;
              
              if (unary && tag==="br") s += "\n";
              if (tag==="img")
              {
                var imgstr = "", imgdescr="";
                imgstr += "!"+'<link>'+escapeFull(atlist["src"])+'</link>';
                if (!(currently_a&&currentLinkTitle))
                {
                  if (atlist["title"]!==undefined)
                    imgdescr = atlist["title"];
                  else if (atlist["alt"]!==undefined)
                    imgdescr = atlist["alt"];
                  if (/\)|!/.test(imgdescr))
                    imgdescr = "[=="+imgdescr+"==]";
                }
                if (imgdescr)
                  imgstr += "<bracket>"+imgdescr+"</bracket>";
                imgstr += "!";
                s += imgstr;
                if (currently_a) currentLinkContent+="[img]";
              }
              if (tag==="a")
              {
                if (atlist["href"]==="") 
                {
                  currently_a = false;
                  return;
                }
                
                s += '"';
                currentLinkTitle = decodeSimpleHTMLEntities(atlist["title"]===undefined ? "" : atlist["title"]);
                if (/\)/.test(currentLinkTitle))
                  currentLinkTitle = "[=="+currentLinkTitle+"==]";
                currentLinkURL=atlist["href"];
                currentLinkURL=currentLinkURL.replace(/^.+deviantart\.com\/users\/outgoing\?(.+)$/ig, "$1");
                if (!currentLinkURL.match(/^(?:https?:)/)) currentLinkURL="#nope";
                currentLinkContent="";
                
                currently_a = true;
              }
              if (tag==="blockquote")
              {
                var bqtext = "";
                bqtext+="[bq";
                if (atlist["title"]!==undefined)
                {
                  bqtext+='="'+atlist["title"]+'"';
                }
                bqtext+="]";
                s+=bqtext;
              }
              if (tag==="span")
              {
                //s+="[span]";
                if (spoilerLevel>0) spoilerLevel++;
                if (atlist["class"]==="spoiler" || atlist["class"]==="spoiler-revealed")
                {
                  s+="[spoiler]";
                  spoilerLevel++;
                }
              }
              if (tag==="acronym"||tag==="abbr")
              {
                s+="<acronym";
                if (atlist["title"]!==undefined)
                {
                  s+='='+atlist["title"];
                }
                s+=">";
              }
              if (tag==="hr")
              {
                s+="\n-----------\n";
                return;
              }
            },
            end: function( tag ) {
              tag=tag.toLowerCase();
              if (tag.match(simple_format_tags))
              {
                s += "</" + writableTag(tag) + ">";
                state[writableTag(tag)]=false;
                return;
              }
              if (tag.match(/^(blockquote|dd|dl|fieldset|form|h[1-6]|hr|ol|p|pre|section|table|tfoot|ul|div|li)$/i))
              {
                s += "\n";
              }
              if (tag==="a")
              {
                if (!currently_a) return;
                currently_a = false;
                if (currentLinkContent==="") s+="&nbsp;";
                var linkstr = "";
                if (currentLinkTitle!=="") linkstr+="<bracket>"+currentLinkTitle+"</bracket>";
                currentLinkURL=currentLinkURL.replace(/#$/g,"");
                linkstr+='":<link>'+escapeFull(currentLinkURL)+'</link>'; //I'm a master of kludge!
                s+=linkstr+' ';
                return;
              }
              if (tag==="blockquote")
              {
                s+="[/bq]";
              }
              if (tag==="span")
              {
                //s+="[/span]";
                if (spoilerLevel===1)
                {
                  s+="[/spoiler]";
                  spoilerLevel=0;
                }
                if (spoilerLevel>0) spoilerLevel--;
              }
              if (tag==="acronym"||tag==="abbr")
              {
                s+="</acronym>";
              }
              if (tag==="html")
                nomoreparseing = true;
            },
            chars: function( text ) {
              if (nomoreparseing) return;
              var trimed = text.replace(/\s+/g, " ");
              if (s.length>0 && s.charAt(s.length-1)===" " && (/^\s/.test(trimed)))
                trimed = trimed.replace(/^\s+/g, "");
              
              for(var key in basic_fomat_chars)
              {
                if (state[key])
                {
                  var fmtchr = basic_fomat_chars[key].charAt(0);
                  fmtchr=escapeRegexStr(fmtchr);
                  var myregex = new RegExp("(?:(\\W)"+fmtchr+")|(?:"+fmtchr+"(?=\\W))", 'gm');
                  trimed = trimed.replace(myregex, "$1"+htmlCharize(fmtchr.charAt(fmtchr.length-1)));
                }
              }
              if (currently_a) 
              {
                trimed = trimed.replace(/"/g, "&quot;");
                if (currentLinkTitle==="") 
                {
                  trimed = trimed.replace(/\(/g, "&#40;");
                  trimed = trimed.replace(/\)/g, "&#41;");
                }
                if (currentLinkContent=="")
                {
                  trimed = trimed.replace(/^\s/g, "&#32;");
                }
                currentLinkContent+=trimed;
              }
              //if (state.strong||state.b) text.replace(/(?:(\s)\*)|(?:\*(?=\s))/gm, "&#42;");
              //if (state.em||state.i)     text.replace(/(?:(\s)\*)|(?:\*(?=\s))/gm, "&#95;");
              
              
              s += trimed;
            },
            comment: function( text ) {
              //s += "/*" + text + "*/";
            }
          });
          
          
          
          //var myAntiFormatRegex = /(\W|^)(\*|\*\*|_|__|\?\?|\+|-|\^|~|@)((?:\S)|(?:(?!\2\s)\S.*?\S))\2(?!\2)(?:(?=\W)|$)/g;
          for(var tag in basic_fomat_chars)
          {
            var myAntiFormatRegex = new RegExp("(\\W|^)("+escapeRegexStr(basic_fomat_chars[tag])+")((?:\\S)|(?:(?!\\2\\s)\\S[\\s\\S]*?\\S))\\2(?!\\2)(?:(?=\\W)|$)", 'g');
            s=s.replace(myAntiFormatRegex, function(str, p1, p2, p3, offset, fullstr)
            {
              //alert("replacing!"+p1+","+p2+","+p3);
              if (/^-+$/.test(p3)) return str;
              return p1+htmlCharize(p2)+p3+htmlCharize(p2);
            });
          }
          
          s=s.replace(/\(c\)|\(tm\)|\(r\)|-{5,}|[A-Z]{2,}\([^)]+\)/g, "[==$&==]");
          
          s=s.replace(/([^-])(-{2,4}(?!-))/gi, function(str, p1, p2, offset, fullstr) {return p1+htmlCharize(p2);});
          
          s=s.replace(/\[(<.+?>)\]/g, "&#91;$1&#93;");
          //-----------
          //Escape: end, Format: begin
          //-----------
          s=s.replace(/<acronym=([^>)]+)>([A-Z]{2,})<\/acronym>/g, "$2($1)");
          s=s.replace(/<acronym[^>]*>(.+?)<\/acronym>/g, "$1");
          //var myReplSimpleFormatRegex = new RegExp(, 'g');
          
          for(var tag in basic_fomat_chars)
          {
            var myTagRegEx = new RegExp("(\\w?)<"+tag+">(\\s*)([\\s\\S]*?)(\\s?)</"+tag+">(\\w?)", 'g');
            s=s.replace(myTagRegEx, function(str, p1, p2, p3, p4, p5, offset, fullstr)
            {
              if (p3==="") return p1+p2+p4+p5;
              var b = p1!=="" || p5!=="" || p4!=="";
              if ((tag==="sup"||tag==="sub")&&!b)
              {
                if (offset>0&&!fullstr.charAt(offset-1).match(/[\s\^~]/))
                {
                  b=true;
                }
              }
              //alert(p1+','+p2+','+p3+','+p4+','+p5);

              return p1+(b?"[":"")+basic_fomat_chars[tag]+htmlCharize(p2)+p3+p4+basic_fomat_chars[tag]+(b?"]":"")+p5;
              
              //DONE: Escape brackets in titles and quotes in links!
            });
          }
          
          s=s.replace(/<bracket>/g, "\(");
          s=s.replace(/<\/bracket>/g, "\)");
          
          s=s.replace(/<link>([0-9A-Z%].*?)<\/link>/gi, function(str, p1, offset, fullstr)
          {
            return unescape(p1);
          });
          
          //alert(s);
          //$('#mymymy').val(s);
          //clipdata.setData("Text", s)
          e.preventDefault();
          //this.value = s;
          $(this).selection('replace', {
            text: s,
            caret: 'end'
          });
        } catch(ex) {
          //DONE: add user-friendly error-handling!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          $('#clipformat_error').show();
          $('#clipformat_error').attr("title", ex + "\nname: " + ex.name + "\nmessage: " + ex.message + "\nstack: " + ex.stack);
          //alert(s);
          
          //alert(err);
        }
        /*finally {
          
        }*/
        
      }
      else /*alert("Nope.jpg")*/;
    });
  });
  
  // removes MS Office generated guff by Anthony (http://forums.squizsuite.net/index.php?showtopic=11304)
  function cleanHTML(input) {
    // 1. remove line breaks / Mso classes
    var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g; 
    var output = input.replace(stringStripper, ' ');
    // 2. strip Word generated HTML comments
    var commentSripper = new RegExp('<!--(.*?)-->','g');
    var output = output.replace(commentSripper, '');
    var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>','gi');
    // 3. remove tags leave content if any
    output = output.replace(tagStripper, '');
    // 4. Remove everything in between and including tags '<style(.)style(.)>'
    var badTags = ['style', 'script','applet','embed','noframes','noscript'];
    
    for (var i=0; i< badTags.length; i++) {
      tagStripper = new RegExp('<'+badTags[i]+'.*?'+badTags[i]+'(.*?)>', 'gi');
      output = output.replace(tagStripper, '');
    }
    // 5. remove attributes ' style="..."'
    var badAttributes = ['style', 'start'];
    for (var i=0; i< badAttributes.length; i++) {
      var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"','gi');
      output = output.replace(attributeStripper, '');
    }
    return output;
  }
  
  function flashElement($el) {
    $el.css({outline:'1px solid yellow'});
    setTimeout(function() {
      $('#clipformat_check').trigger("change");
    }, 500);
  }
  
  function decodeSimpleHTMLEntities(text) { //by William Lahti
    var entities = [
        ['apos', '\''],
        ['amp', '&'],
        ['lt', '<'],
        ['gt', '>']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
  }
  
})( jQuery );

/*
Notes:

regulars:
<b>(?=\S)([^<]*?\S)<\/b> -nope

(\w?)<b>(\s*)(.*?)(\s*)<\/b>(\w?) -yup
*/








































