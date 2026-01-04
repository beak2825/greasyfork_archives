// ==UserScript==
// @name         IHA.EE GIF'I EEMALDAJA (TASUTA VIP) | IHA.EE GIF REMOVER (FREE VIP)
// @version      1.0
// @description  IHA.EE GIF'I EEMALDAJA (TASUTA VIP)
// @author       Nigol
// @run-at       document-end
// @match        https://iha.ee/*
// @include      https://*.iha.ee/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @namespace https://greasyfork.org/users/578974
// @downloadURL https://update.greasyfork.org/scripts/404698/IHAEE%20GIF%27I%20EEMALDAJA%20%28TASUTA%20VIP%29%20%7C%20IHAEE%20GIF%20REMOVER%20%28FREE%20VIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404698/IHAEE%20GIF%27I%20EEMALDAJA%20%28TASUTA%20VIP%29%20%7C%20IHAEE%20GIF%20REMOVER%20%28FREE%20VIP%29.meta.js
// ==/UserScript==

(function() {
    window.onload = function(){
        // Remove the wallpaper
        $('body').css('background-image', 'url(https://i.ibb.co/hR726CC/iha-background.jpg)');
        //document.body.style.backgroundImage = ('url(https://i.ibb.co/hR726CC/iha-background.jpg)');

        // Get the page title and change it
        var page_title = document.title;
        // Split the title and change the part - "Iha.ee - Seksikate inimeste kohtumispaik" to "Iha.ee - Tasuta VIP"
        var page_current_location = page_title.split("|")[0];
        var page_title_description = page_title.split("|")[1];

        page_title = `${page_current_location} | Iha.ee - Tasuta VIP`
        document.title = page_title;

        console.log(page_title);
        // We can remove the iha.ee gif sitewide because it is a single gif. The reason I am not only removing the gif with one line of code is because
        // when the gif URL gets changed (current: https://www.iha.ee/images/edf83jd7s6djfkgie843u4.gif), I would manually have to edit the code to remove the new gif.
        // So I think this approach is the best.

        // Remove the iha.ee gif sitewide
        var iha_ee_gif = $("img[src$='https://www.iha.ee/images/edf83jd7s6djfkgie843u4.gif']");
        $(iha_ee_gif).fadeTo("fast", 0);

        // Remove the small preview gifs when looking at photos
        var iha_ee_preview_gif = $("img[src$='https://www.iha.ee/images/edf83us7fkslaowie0937s.gif']");
        $(iha_ee_preview_gif).fadeTo("fast", 0);

        // Later implement a automatic solution that does not take gif source into input

        // Find the iha.ee logo and replace it with my own logo, iha.ee tasuta vip
        var iha_logo = $("img[src$='https://www.iha.ee/images/www_iha_1.gif?170120']");
        $(iha_logo).fadeOut("slow", function() {
            $(iha_logo.attr('src','https://i.ibb.co/Ky5VG0z/iha-tasuta-vip-logo.gif')).fadeIn();
        });

        // Find the iha slogan and replace it with my own
        var iha_slogan = $("img[src$='https://www.iha.ee/images/www_iha_slog_1.gif?140313']");
        $(iha_slogan).fadeOut("slow", function() {
            $(iha_slogan.attr('src', 'https://i.ibb.co/kGj6z5L/iha-slogan.jpg')).fadeIn();
        });

        // Remove the dumb fucking sex ads and replace them with my own content
        var top_ad = $("img[src$='https://www.iha.ee/stats/stats/203b556155.gif']");
        $(top_ad).fadeOut("slow", function() {
            $(top_ad.attr('src', 'https://i.ibb.co/dPwgWpy/iha-top-ad-gif.gif')).fadeIn();
        });

        var bottom_ad = $("img[src$='https://www.iha.ee/stats/stats/200b915890.gif']");
        $(bottom_ad).fadeOut("fast", 0);

        // First of all, check in which section of the page the current user is
        var user_absolute_path = window.location.href;
        // Split the string and get the first element of the array, which is the path of the website
        var user_current_path = user_absolute_path.split('?')[0];
        // Split the string and get the second element of the array, which is the current mode (section) of the webpage
        // Also remove all unwanted parts of the string (php variables (& and anything after that)
        var user_current_mode = user_absolute_path.split('?')[1].replace(/\&.*/,'');
        console.log("Current user mode:", user_current_mode);

        // Get all table elements that contain images
        var images_gif = $('table').find('img.Top_pic[src$=".gif"]');
        // Filter through the images to get only images that do have .gif on top of them
        $(images_gif).fadeTo("fast", 0);

        // Remove the login texts
        $("a:contains('Selle pildi nägemiseks pead olema sisse logitud!')").parent().remove();

        // Get the URL of the image to later copy on click
        var imgURL = undefined;
        var img = document.querySelector("body > div:nth-child(7) > table > tbody > tr:nth-child(2) > td > table:nth-child(2) > tbody > tr:nth-child(1) > td.center_td > table:nth-child(3) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr:nth-child(2) > td");
        imgURL = $(img).css('background-image');
        imgURL = imgURL.replace(/(url\(|\)|")/g, '');

        // Show the image URL on top of the image
        var showImgURL = document.getElementsByClassName("muu")[3];
        var showImgURL_content = `<a href=${imgURL} target="_blank">${imgURL} | ava pilt uues aknas</a>`;
        showImgURL.innerHTML = showImgURL_content;

        // When clicking on an image, copy the URL of the image
        img.addEventListener("click", picture_Click);
        function picture_Click() {
            var dummy = $('<input>').val(imgURL).appendTo('body').select();
            document.execCommand('copy');
        };
    }
})();