// ==UserScript==
// @name         [HFR] SFBA descriptor
// @namespace    sfba.hfr
// @version      1.3
// @description  Copie la description de l'article lorsque une url appropriée est présente dans le presse papier
// @include       https://forum.hardware.fr/message.php*
// @include       https://forum.hardware.fr/forum2.php*
// @include       https://forum.hardware.fr/hfr/*
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @connect       *
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_info
// @grant         GM_deleteValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_setValue
// @grant         GM_getResourceText
// @grant         GM_getResourceURL
// @grant         GM_addStyle
// @grant         GM_log
// @grant         GM_openInTab
// @grant         GM_registerMenuCommand
// @grant         GM_setClipboard
// @grant         GM_xmlhttpRequest
// @require       http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32834/%5BHFR%5D%20SFBA%20descriptor.user.js
// @updateURL https://update.greasyfork.org/scripts/32834/%5BHFR%5D%20SFBA%20descriptor.meta.js
// ==/UserScript==

function init_throbber(){
  GM_addStyle("#hiu_throbber_sfba{position:fixed;left:0;top:0;background-color:#242424;z-index:1001;" +
              "display:none;opacity:0;transition:opacity 0.7s ease 0s;}");
  GM_addStyle("#hiu_throbber_img_sfba{position:fixed;left:calc(50% - 64px);top:calc(50% - 64px);width:128px;height:128px;z-index:1002;" +
              "display:none;opacity:0;transition:opacity 0.7s ease 0s;border:0;padding:0;}");
  GM_addStyle(".hfr_apercu_nope{display:none !important;}");
  var throbber_image_url = "https://reho.st/self/30271dc1b7cac925aeabb89fa70e1e17cf5e1840.png";
  var hiu_throbber_img_sfba = new Image();
  hiu_throbber_img_sfba.src = throbber_image_url;
  hiu_throbber_img_sfba.setAttribute("id", "hiu_throbber_img_sfba");
  var hiu_throbber_sfba = document.createElement("div");
  hiu_throbber_sfba.setAttribute("id", "hiu_throbber_sfba");
  hiu_throbber_sfba.appendChild(hiu_throbber_img_sfba);
  hiu_throbber_sfba.addEventListener("transitionend", throbber_transitionend, false);
  document.body.appendChild(hiu_throbber_sfba);


}


function init_config(){
    GM_config.init(
    {
         'id': 'SFBAconfig', // The id used for this instance of GM_config
         'title': 'SFBA descriptor configuration', // Panel Title
         'fields': // Fields object
         {
             'amazon': // This is the id of the field
             {
                  'label': 'Amazon', // Appears next to field
                  'type': 'checkbox', // Makes this setting a checkbox input
                  'default': true // Default value if user doesn't change it
             },
             'aliexpress': // This is the id of the field
             {
                  'label': 'Aliexpress', // Appears next to field
                  'type': 'checkbox', // Makes this setting a checkbox input
                  'default': true // Default value if user doesn't change it
             },
             'dealabs': // This is the id of the field
             {
                  'label': 'Dealabs', // Appears next to field
                  'type': 'checkbox', // Makes this setting a checkbox input
                  'default': true // Default value if user doesn't change it
             },
             'gearbest': // This is the id of the field
             {
                  'label': 'Gearbest', // Appears next to field
                  'type': 'checkbox', // Makes this setting a checkbox input
                  'default': true // Default value if user doesn't change it
             },
             'banggood': // This is the id of the field
             {
                  'label': 'Banggood', // Appears next to field
                  'type': 'checkbox', // Makes this setting a checkbox input
                  'default': true // Default value if user doesn't change it
             },
             'thingiverse': // This is the id of the field
             {
                  'label': 'Thingiverse', // Appears next to field
                  'type': 'checkbox', // Makes this setting a checkbox input
                  'default': true // Default value if user doesn't change it
             }
         },
         css: '#SFBAconfig { background-color: #d0e0ff; }',
    });
    GM_registerMenuCommand("[HFR] SFBA descriptor -> configuration", function(){GM_config.open();});
}

function display_throbber(){
  if(document.querySelector("div#apercu_reponse")){
    document.querySelector("div#apercu_reponse").classList.add("hfr_apercu_nope");
  }
  hiu_throbber_img_sfba.style.display = "block";
  hiu_throbber_sfba.style.display = "block";
  hiu_throbber_sfba.style.width = document.documentElement.scrollWidth + "px";
  hiu_throbber_sfba.style.height = document.documentElement.scrollHeight + "px";
  hiu_throbber_img_sfba.style.opacity = "1";
  hiu_throbber_sfba.style.opacity = "0.8";
}

function throbber_transitionend() {
  if(hiu_throbber_sfba.style.opacity === "0") {
    hiu_throbber_img_sfba.style.display = "none";
    hiu_throbber_sfba.style.display = "none";
    if(document.querySelector("div#apercu_reponse")){
      document.querySelector("div#apercu_reponse").classList.remove("hfr_apercu_nope");
    }
  }
}

function hide_throbber(){
  hiu_throbber_img_sfba.style.opacity = "0";
  hiu_throbber_sfba.style.opacity = "0";
}

function insert_text_at_cursor (textarea, text) {
	var start = textarea.selectionStart;
	var end = textarea.selectionEnd;
	textarea.value = textarea.value.substr (0, start) + text + textarea.value.substr (end);
	textarea.setSelectionRange (start + text.length, start + text.length);
}

function isUrlValid(url) {
    var valid = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url.href);

    var parsable = false;
    
    if (valid)
    {
        if ( (url.host.indexOf("amazon") !== -1) && (GM_config.get('amazon')))
        {
            parsable = true;
        }
        else if ( (url.host.indexOf("aliexpress") !== -1)  && (GM_config.get('aliexpress')))
        {
            parsable = true;
        }
        else if ( (url.host.indexOf("dealabs") !== -1) && (GM_config.get('dealabs')))
        {
            parsable = true;
        }
        else if ( (url.host.indexOf("gearbest") !== -1) && (GM_config.get('gearbest')))
        {
            parsable = true;
        }
        else if ( (url.host.indexOf("banggood") !== -1) && (GM_config.get('banggood')))
        {
            parsable = true;
        }
        else if ( (url.host.indexOf("thingiverse") !== -1) && (GM_config.get('thingiverse')))
        {
            parsable = true;
        }
    }
    
    return (valid & parsable);
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function parseAmazon(doc, raw = false)
{
    var img = "";
    var title = doc.find("#productTitle").text().trim();    
    var imgJson = doc.find("#imgTagWrapperId").children().attr('data-a-dynamic-image');
    if (imgJson)
        img = Object.keys(JSON.parse(imgJson))[0];
    var price = doc.find(".a-size-medium.a-color-price").eq(0).text();
    if (price)
        price = price.trim();

    if (title && img && price)
    {
        if (raw)
        {
            return [img, title + " - " + price];
        }
        else
        {
            return title + " - " + price + "[/url]\n[img]http://reho.st/preview/" + img + "[/img]";
        }
    }
    else
        return "";
}

function parseAli(doc, raw = false)
{
    var title = doc.find(".product-name").text().trim();
    var img = doc.find(".ui-image-viewer-thumb-frame").children().attr('src');
    var price = doc.find("#j-sku-discount-price").text().trim() + doc.find(".p-symbol").text()[0];
    if (price)
        price = price.trim();

    if (title && img && price)
    {
        if (raw)
        {
            return [img, title + " - " + price];
        }
        else
        {
            return title + " - " + price + "[/url]\n[img]http://reho.st/preview/" + img + "[/img]";
        }
    }
    else
        return "";
}

function parseDealabs(doc, raw = false)
{
    var title = doc.find("h1.thread-title").text().trim();
    var img = doc.find("a.threadItem-imgFrame").children().attr('src');
    var price = "";
    var oldPrice = "";
    try 
    {
        price = doc.find("span.thread-price").first().text().trim();
        oldPrice = doc.find("span.text--lineThrough").text().trim();
    }
    catch(err){}
    
    if (title && img && price)
    {
        if (oldPrice)
        {
            if (raw)
            {
                return [img, title + " - " + price + oldPrice];
            }
            else
            {
                return title + "[/url]\n[img]http://reho.st/preview/" + img + "[/img]\n[b][#FF0000]" + price + "[/#FF0000][/b] [strike]" + oldPrice + "[/strike]";
            }
        }
        else
        {
            if (raw)
            {
                return [img, title + " - " + price];
            }
            else
            {
                return title + "[/url]\n[img]http://reho.st/preview/" + img + "[/img]\n[b][#FF0000]" + price + "[/#FF0000][/b]";
            }
        }
    }
    else
    {
        return "";
    }
}

function parseGearbest(doc, raw= false)
{
    var title = doc.find("h1").text().trim();
    var img = doc.find("#js-goodsNormalImg").attr('src');
    var price = doc.find(".goodsIntro_price.js-currency.js-panelIntroPrice").text();
    if (price)
        price = price.trim();
    
    if (title && img && price)
    {
        if (raw)
        {
           return [img, title + " - " + price];
        }
        else
        {
            return title + " - " + price + "[/url]\n[img]" + img + "[/img]";
        }
    }
    else
        return ""; 
}

function parseBanggood(doc, raw = false)
{
    var title = doc.find("h1").text().trim();
    var img = doc.find(".left_largerView_image_20161213").children().attr('src');
    var price = doc.find(".now").text().trim() + doc.find(".top_price_datalist_20161213").children().first().text().trim();
    if (price)
        price = price.trim();

    if (title && img && price)
    {
        if (raw)
        {
            return [img, title + " - " + price];
        }
        else
        {
            return title + " - " + price + "[/url]\n[img]" + img + "[/img]";
        }
    }
    else
        return "";
}

function parseThingiverse(doc, raw = false)
{
    var title = doc.find("h1").first().text().trim();
    var img = doc.find(".gallery-slider").children().attr('data-medium');

    if (title && img)
    {
        if (raw)
        {
            return [img, title];
        }
        else
        {
            return title + "[/url]\n[img]" + img + "[/img]";
        }
    }
}

function displayContent(link)
{
    var container;

    link.addEventListener("mouseover", function()
    {
        container = document.createElement("div");
        container.style.position = "fixed";
        container.style.background = "#dedfdf";
        container.style.width = "auto";
        container.style.padding = "5px";
        container.style.border = "1px solid black";
        container.style.top = "10px";
        container.style.right = "10px";
        container.style.maxWidth = "450px";

        document.body.appendChild(container);

        let text = document.createElement("p");
        text.style.fontFamily = "arial,sans-serif";
        text.style.fontWeight = "bold";
        text.innerHTML = "Chargement";
        container.appendChild(text);

        let img = new Image();
        img.style.display = "block";
        img.style.margin = "auto";
        img.style.maxWidth = "450px";
        img.style.maxHeight = parseInt((document.documentElement.clientHeight - 20 - 12), 10) + "px";

        getData(link.href, img, text);

        container.appendChild(img);
    });

    link.addEventListener("mouseout", function()
    {
        if(container && container.parentNode)
        {
            let elts = container.querySelectorAll("p, img");
            for(let elt of elts)
            {
                elt.parentNode.removeChild(elt);
            }
            container.parentNode.removeChild(container);
        }
    }, false);

}

function getData(url, img, txt)
{
    var content = "";

    GM_xmlhttpRequest({
		method : "GET",
		url : url,
        anonymous: true,
        context : {
			textarea : this
		},
		onabort : hide_throbber,
		onerror : hide_throbber,
		ontimeout : hide_throbber,
		onload : function (response) {
			// fin du chargement
			hide_throbber();

            if (extractHostname(url).indexOf("amazon") !== -1)
            {
                content = parseAmazon($(response.responseText), true);
            }
            else if (extractHostname(url).indexOf("aliexpress") !== -1)
            {
                content = parseAli($(response.responseText), true);
            }
            else if (extractHostname(url).indexOf("dealabs") !== -1)
            {
                content = parseDealabs($(response.responseText), true);
            }
            else if (extractHostname(url).indexOf("gearbest") !== -1)
            {
                content = parseGearbest($(response.responseText), true);
            }
            else if (extractHostname(url).indexOf("banggood") !== -1)
            {
                content = parseBanggood($(response.responseText), true);
            }
            else if (extractHostname(url).indexOf("thingiverse") !== -1)
            {
                content = parseThingiverse($(response.responseText), true);
            }
            img.src = content[0];
            txt.innerHTML = content[1];
        }
    });
}

init_throbber();
init_config();

function pasting (event) {
    var url = "";
    var bbcode = "";
	if (event.clipboardData.files.length < 1)
    {
		var str = event.clipboardData.getData("text/plain");
		if ( (str.length === 0) || (!isUrlValid(str)) )
			return;
        else
            url = str;
	}
    else
    {
        return;
    }
	
	// chargement
	display_throbber();
	
	GM_xmlhttpRequest({
		method : "GET",
		url : url,
        context : {
			textarea : this
		},
		onabort : hide_throbber,
		onerror : hide_throbber,
		ontimeout : hide_throbber,
		onload : function (response) {
			// fin du chargement
			hide_throbber();

            if (extractHostname(url).indexOf("amazon") !== -1)
            {
                bbcode = parseAmazon($(response.responseText));
            }
            else if (extractHostname(url).indexOf("aliexpress") !== -1)
            {
                bbcode = parseAli($(response.responseText));
            }
            else if (extractHostname(url).indexOf("dealabs") !== -1)
            {
                bbcode = parseDealabs($(response.responseText));
            }
            else if (extractHostname(url).indexOf("gearbest") !== -1)
            {
                bbcode = parseGearbest($(response.responseText));
            }
            else if (extractHostname(url).indexOf("banggood") !== -1)
            {
                bbcode = parseBanggood($(response.responseText));
            }
            else if (extractHostname(url).indexOf("thingiverse") !== -1)
            {
                bbcode = parseThingiverse($(response.responseText));
            }
            
            if (bbcode)
                insert_text_at_cursor(this.context.textarea, "[url=" + url + "]" + bbcode);
            else
                insert_text_at_cursor(this.context.textarea, "[url]" + url + "[/url]");
		}
	});
	return event.preventDefault();
	
}

var content_form = document.querySelector("#content_form");
if (content_form !== null)
	content_form.addEventListener('paste', pasting);




var observer=new MutationObserver(function(mutations, observer){ 
  var textareas=document.querySelectorAll("textarea[id^=\"rep_editin_\"]" ); 
  if(textareas.length){ 
    for(var textarea of textareas) { 
      textarea.removeEventListener('paste', pasting, false); 
      textarea.addEventListener('paste', pasting, false); 
    } 
  } 
}); 
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree: true});

var links = document.getElementById("mesdiscussions").querySelectorAll(
  "table.messagetable td.messCase2 div[id^='para'] > span:not(.signature) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > div:not(.edited) a.cLink, " +
  "table.messagetable td.messCase2 div[id^='para'] > *:not(span):not(div) a.cLink");
for(let link of links)
{
  if (isUrlValid(link))
  {
      displayContent(link);
  }
}