// ==UserScript==
// @name        One Click Download 4.0
// @namespace   localhost
// @include     http://www.videoweed.*/*
// @include     http://www.novamov.*/*
// @include     http://www.nowvideo.*/*
// @include     http://www.movshare.*/*
// @version     4.0
// @grant       GM_xmlhttpRequest
// @description Downloads from nowvideo, novamov, videoweed, movshare
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/17037/One%20Click%20Download%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/17037/One%20Click%20Download%2040.meta.js
// ==/UserScript==


//OCD Button CSS
var ocd_css1 = "div#button_div{opacity:0.85;color:#d8d8d8;!important;text-align:center;line-height:65px;!important;}"; //Text Color & Alignment
var ocd_css2 = "div#button_div{border-style:dotted;border-color:#d8d8d8;border-width:3px;height:70px;width:70px;background:#343333;}";  //Style
var ocd_css3 = "div#button_div{-moz-border-radius:35px;-webkit-border-radius:35px;-khtml-border-radius:35px;border-radius:35px;}";    //Curvature
var ocd_css4 = "div#button_div{font-size:20px;!important;font-family:georgia,sans-serif;!important;}";   //Font Style
var ocd_css5 = "a#ocd_button{display:block;text-decoration:none;color:#d8d8d8;!important;text-align:center;line-height:65px;!important;}"; //Text Color & Alignment
var ocd_css6 = "a#ocd_button:visited{display:block;text-decoration:none;outline:none;!important;color:#d8d8d8;!important;text-align:center;line-height:65px;!important;}";
var ocd_css7 = "a#ocd_button:active{display:block;outline:none;!important;text-decoration:none;!important;color:#bdbdbd;!important;text-align:center;line-height:65px;!important;}";
var ocd_css8 = "a#ocd_button:focus{display:block;outline:none;!important;text-decoration:none;!important;}div.player_hover_ad{display:none;!important;}";

var ocd_css = ocd_css1+ocd_css2+ocd_css3+ocd_css4+ocd_css5+ocd_css6+ocd_css7+ocd_css8;

var head = document.getElementsByTagName('head')[0];
var ocd_style = document.createElement('style');
ocd_style.type = "text/css";
ocd_style.innerHTML = ocd_css;
head.insertBefore(ocd_style,head.childNodes[1]);  
//END OCD BUTTON CSS


//Append OCD Button Function
var ocd_button = function(innerHTML,left,top) {
        var b = document.getElementsByTagName('body')[0];
        var t = document.createElement('div');
        t.innerHTML = innerHTML;
        t.style.position = 'absolute';
        t.style.left = left;
        t.style.top = top;
        b.appendChild(t);

}
//END BUTTON FUNCTION


//START EXTRACT LINK PROGRAM
var location = window.location.toString();
if(location.match(/nowvideo.sx|nowvideo.eu|movshare.net|novamov.eu|divxstage.eu|videoweed.es|novamov.com|nowvideo.ch/i)){

  
//Get whole source as string
var str = document.documentElement.innerHTML; //make whole file to string

//Get Domain
var domain_matching = /http:\/\/www.nowvideo.sx|http:\/\/www.nowvideo.ch|http:\/\/www.nowvideo.eu|http:\/\/www.movshare.net|http:\/\/www.novamov.com|http:\/\/www.divxstage.eu|http:\/\/www.videoweed.es/i;	//Matching for domain
var domain = str.match(domain_matching);   //assign matched domain to a variable


var src = document.documentElement.innerHTML;

var file = "&file="+unsafeWindow.flashvars.file; 
var filekey ="&key="+unsafeWindow.flashvars.filekey;                              

var api="api/player.api.php?";
var xml_link=domain+"/"+api+filekey+file;
  
 
GM_xmlhttpRequest({
  method: "GET",
  url: xml_link,
  onload: function(response){
  
    var final = response.responseText;  //Get from Page(2) With the Link
    
    //Begin Parse
    var parser = new DOMParser();
    var doc = parser.parseFromString(final, "text/html");
    
    //Make Doc as string
    var doc_str0 = doc.documentElement.innerHTML; 
    var doc_str = decodeURIComponent(doc_str0);
    var match_link = /url=http:[0-9A-Za-z./]*/i;
    var saved_match_link = doc_str.match(match_link);
    var str_final_link = saved_match_link.toString();
    var link = str_final_link.slice(4);
    
        
    var innerHTML = '<div id="button_div" ><a id="ocd_button" href="'+link+'">OCD</a></div>';
    var left = '5px';
    var top = '5px';
    
    ocd_button(innerHTML,left,top);
    

    }//End Onload
    
});//End GM_xmlhttpRequest
}
//END EXTRACT LINK PROGRAM
