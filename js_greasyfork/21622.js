// ==UserScript==
// @name        JVC Clash
// @namespace   Nique ta mere
// @version      0.9.1
// @description  JVC Clash 0.9.1
// @author       Singles
// @include     http://*.jeuxvideo.com/*
// @include     http://*.forumjv.com/*
// @include     https://*.jeuxvideo.com/*
// @include     https://*.forumjv.com/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21622/JVC%20Clash.user.js
// @updateURL https://update.greasyfork.org/scripts/21622/JVC%20Clash.meta.js
// ==/UserScript==


function change(){$.each(mots,function(e,t){$(".txt-msg p").each(function(){var i=$(this).html();$(this).html(i.replace(t,'<span class="insulte">'+insultes[e]+"</span>"))})})}function preview(){$.each(mots,function(e,t){$("#previewClash ul").append($('<li class="pull-left">').append(t)).append($('<li class="insulte droite">').append(insultes[e]))})}var mots=["Astalavista","Cordialement","Mes salutations","toboggan","dinosaurésque","coupin","gentille personne","truculent","être formidable"],insultes=["va te faire enculer","nique ta mère","suce ma bite","ta mère","fils de pute","fils","chienne","enculé","pute"];$(".jv-editor-toolbar").append('<div class="btn-group"><button class="btn clashButton btn-primary btn-danger " type="button" data-edit="arrow-d" title="JVC Clash"><span >Clash</span></button> </div>'),$(".clashButton").append('<div id="previewClash"><ul class="doube"></ul></div>'),$("#previewClash").css({width:"505px",height:"220px",background:"#34495e",color:"white","z-index":"900",display:"none"}),$("#previewClash").css("position","absolute"),change(),preview(),$(".insulte").css({color:"red","font-style":"italic"}),$(".droite").css({"margin-left":"20px","font-style":"italic",color:"#2ecc71"}),$(".clashButton").mouseover(function(){$("#previewClash").show()}).mouseout(function(){$("#previewClash").hide()}),$("#previewClash ul").css({width:"100%",padding:"0",overflow:"hidden","margin-top":"20px"}),$("#previewClash ul li ").css({"line-height":"1.5em","float":"left",display:"inline",width:"50%",margin:"0"});