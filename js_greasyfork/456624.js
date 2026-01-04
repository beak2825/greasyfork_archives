// ==UserScript==
// @name        LZT Chat Images
// @namespace   lzt_chat_images
// @match       https://lolz.guru/*
// @match       https://zelenka.guru/*
// @match       https://lzt.market/*
// @match       https://lolz.live/*
// @grant       none
// @version     2.5
// @author      its_niks
// @icon        https://zelenka.guru/favicon.ico
// @description Предпросмотр фотографий в чате Lolzteam
// @downloadURL https://update.greasyfork.org/scripts/456624/LZT%20Chat%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/456624/LZT%20Chat%20Images.meta.js
// ==/UserScript==


var scroll_status = true

setInterval(() => {
	var elem = document.getElementsByClassName('chat2-messages lztng-1nmmi2z')[0]
	if (elem){
		var chatbox_messages = Array.from(elem.children).slice(0, elem.children.length - 1)
		if (chatbox_messages.length > 0){
			chatbox_messages.forEach(function(elem) {
				var content_links = elem.getElementsByClassName('chat2-message-text-inner lztng-1hpx4rn')[0]
                if (content_links){
                    links = content_links.getElementsByClassName('externalLink')
                    if(links){
                        var links = Array.from(links);
                        links.forEach(function(link_el) {
                            var link = link_el.href
                            if (link.startsWith("https://i.imgur.com/") || link.startsWith("https://imgur.com/") || link.startsWith("https://lztcdn.com/files/")){
                                if (link.startsWith("https://imgur.com/")){
                                    link = `https://i.imgur.com/${link.split('https://imgur.com/')[1]}.png`
                                };
                                var html = ''
                                if (content_links.textContent.replace(link_el.href, '').trim() == ''){
                                    html = `<img src="${link}" style="" class="bbCodeImage LbImage" alt="[&ZeroWidthSpace;IMG]" data-url="${link}">`
                                } else {
                                    html = `<br><img src="${link}" style="" class="bbCodeImage LbImage" alt="[&ZeroWidthSpace;IMG]" data-url="${link}"><br>`
                                };
                                const image_element = document.createElement('a');
                                image_element.href = link
                                image_element.target = "_blank"
                                image_element.innerHTML = html
                                link_el.replaceWith(image_element);
                            }
                        })}}
			});
			if(scroll_status){
				chatbox_messages[chatbox_messages.length - 1].scrollIntoView()
				scroll_status = false
			};
		}}}, 100);