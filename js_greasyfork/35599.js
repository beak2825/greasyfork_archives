// ==UserScript==
// @name		kebap
// @namespace		http://www.wykop.pl/ludzie/wytrzzeszcz/
// @description		odtworzenie guzika link
// @author		wytrzeszcz
// @version		1.8
// @grant		none
// @include		http://www.wykop.pl/*
// @include		https://www.wykop.pl/*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/35599/kebap.user.js
// @updateURL https://update.greasyfork.org/scripts/35599/kebap.meta.js
// ==/UserScript==
(function() {
 const removeKebap= function(){
			$(".responsive-menu").each(function(){
                var address=$(this).find(".social-list").find(".fa-chain").parent().attr("href");
				if( address != null)
				{
					$(this).append('<li><a class="affect hide kebap" href="'+address+'">KEBAP</a></li>');
					$(this).find(".social-list").parent().parent().parent().remove();
                    console.log("REMOVE KEBAP:DONE");

				}
				});};


        var observerKebap = new MutationObserver(function(mut){
              var sum=0;
       mut.forEach(function(el,index){sum=sum+el.addedNodes.length;});
            if(sum>0)
            removeKebap();});
	$(document).ready(function(){
      var config = { attributes: true, childList: true,subtree:true };
      observerKebap.observe(document.getElementById("itemsStream"),config);
      removeKebap();
	});



})();