// ==UserScript==
// @name         CENSORED TAG COPY
// @description  Gathers tags from a few boorus but censors bad tags for civitai
// @author       @Archgoddess_gd /edited by gavare
// @match        https://danbooru.donmai.us/*
// @match        https://gelbooru.com/*
// @match        https://rule34.xxx/*
// @match        https://censored.booru.org/*
// @license MIT 
// @grant        none
// @version 0.0.1.20240706102917
// @namespace https://greasyfork.org/users/80751
// @downloadURL https://update.greasyfork.org/scripts/499844/CENSORED%20TAG%20COPY.user.js
// @updateURL https://update.greasyfork.org/scripts/499844/CENSORED%20TAG%20COPY.meta.js
// ==/UserScript==

// Create the button and textarea elements
var button = document.createElement("button");
var textarea = document.createElement("textarea");
var closeButton = document.createElement("button");

button.innerHTML = "Extract Tags";
button.style.position = "fixed";
button.style.bottom = "0";
button.style.right = "0";
button.style.backgroundColor = "black";
button.style.color = "white";

textarea.style.position = "fixed";
textarea.style.bottom = "0";
textarea.style.right = "0";
textarea.style.width = "400px";
textarea.style.height = "200px";
textarea.style.backgroundColor = "black";
textarea.style.color = "white";
textarea.style.display = "none";

closeButton.innerHTML = "Close";
closeButton.style.position = "fixed";
closeButton.style.bottom = "210px";
closeButton.style.right = "0";
closeButton.style.backgroundColor = "black";
closeButton.style.color = "white";
closeButton.style.display = "none";

// Add the button and textarea to the page
document.body.appendChild(button);
document.body.appendChild(textarea);
document.body.appendChild(closeButton);

// Add a click event listener to the button
button.addEventListener("click", function() {
  // Find all instances of "tags=" in the page
  var matches = document.body.innerHTML.match(/tags=([^&"]+)/g);

  if (matches) {
    // For each match, extract the text after the "=" and before the next " or &
    for (var i = 0; i < matches.length; i++) {
      var tag = matches[i].split("=")[1];

      // Replace "%3A" with ":", "%28" with "(", and "%29" with ")"
      tag = tag.replace(/%3A/g, ":").replace(/_/g, " ").replace(/%28/g, "(").replace(/%29/g, ")").replace(/%27/g, "'").replace(/%21/g, "!").replace(/%3F/g, "?").replace(/%2B/g, "+").replace(/daughter/g, " ") .replace(/dike/g, " ") .replace(/dog-fucker/g, " ") .replace(/dune coon/g, " ") .replace(/dyke/g, " ") .replace(/gas chamber/g, " ") .replace(/gook/g, " ") .replace(/gooks/g, " ") .replace(/guinne/g, " ") .replace(/honkey/g, " ") .replace(/incest/g, " ") .replace(/incestuous/g, " ") .replace(/jail bait/g, " ") .replace(/jailbait/g, " ") .replace(/jap/g, " ") .replace(/japs/g, " ") .replace(/jejune/g, " ") .replace(/jew/g, " ") .replace(/jews/g, " ") .replace(/jigaboo/g, " ") .replace(/juvenile/g, " ") .replace(/kike/g, " ") .replace(/kikes/g, " ") .replace(/kkk/g, " ") .replace(/kraut/g, " ") .replace(/loli/g, " ") .replace(/loli-con/g, " ") .replace(/loli.con/g, " ") .replace(/loli_con/g, " ") .replace(/lolicon/g, " ") .replace(/lolis/g, " ") .replace(/lolita/g, " ") .replace(/mick/g, " ") .replace(/midget/g, " ") .replace(/midgets/g, " ") .replace(/mongoloid/g, " ") .replace(/n1g/g, " ") .replace(/n1gga/g, " ") .replace(/n1gger/g, " ") .replace(/nazi/g, " ") .replace(/nazis/g, " ") .replace(/necro/g, " ") .replace(/necrophilia/g, " ") .replace(/negro/g, " ") .replace(/negros/g, " ") .replace(/neonazi/g, " ") .replace(/neonazis/g, " ") .replace(/nig/g, " ") .replace(/niga/g, " ") .replace(/nigas/g, " ") .replace(/nigg3r/g, " ") .replace(/nigg4h/g, " ") .replace(/nigga/g, " ") .replace(/niggah/g, " ") .replace(/niggar/g, " ") .replace(/niggas/g, " ") .replace(/niggaz/g, " ") .replace(/nigger/g, " ") .replace(/niggers/g, " ") .replace(/niglet/g, " ") .replace(/niglets/g, " ") .replace(/nignog/g, " ") .replace(/nignogs/g, " ") .replace(/nigs/g, " ") .replace(/nonconsentual/g, " ") .replace(/paedophile/g, " ") .replace(/paki/g, " ") .replace(/pakis/g, " ") .replace(/pedobear/g, " ") .replace(/pedophile/g, " ") .replace(/porch monkey/g, " ") .replace(/porch monkeys/g, " ") .replace(/puberty/g, " ") .replace(/puerile/g, " ") .replace(/rag-head/g, " ") .replace(/raghead/g, " ") .replace(/ragheads/g, " ") .replace(/rape/g, " ") .replace(/raped/g, " ") .replace(/raping/g, " ") .replace(/rapist/g, " ") .replace(/rapists/g, " ") .replace(/retard/g, " ") .replace(/retarded/g, " ") .replace(/retards/g, " ") .replace(/rice nigger/g, " ") .replace(/rigor mortis/g, " ") .replace(/scat/g, " ") .replace(/scrawny/g, " ") .replace(/shit/g, " ") .replace(/shitter/g, " ") .replace(/shitting/g, " ") .replace(/shota/g, " ") .replace(/shota-con/g, " ") .replace(/shota.con/g, " ") .replace(/shota_con/g, " ") .replace(/shotacon/g, " ") .replace(/spic/g, " ") .replace(/spics/g, " ") .replace(/spook/g, " ") .replace(/spooks/g, " ") .replace(/statutory rape/g, " ") .replace(/swastika/g, " ") .replace(/terrorist/g, " ") .replace(/third reich/g, " ") .replace(/towel head/g, " ") .replace(/towel heads/g, " ") .replace(/towelhead/g, " ") .replace(/towelheads/g, " ") .replace(/turk/g, " ") .replace(/turks/g, " ") .replace(/wetback/g, " ") .replace(/wetbacks/g, " ") .replace(/wigger/g, " ") .replace(/wiggers/g, " ") .replace(/wop/g, " ") .replace(/yigger/g, " ") .replace(/young/g, " ") .replace(/younger/g, " ") .replace(/youngest/g, " ") .replace(/adolescence/g, " ") .replace(/jnr/g, " ") .replace(/jr/g, " ") .replace(/youth/g, " ") .replace(/youthful/g, " ") .replace(/yng/g, " ") .replace(/childish/g, " ") .replace(/child/g, " ") .replace(/neotenous/g, " ") .replace(/immatured?/g, " ") .replace(/infantile/g, " ") .replace(/schol/g, " ") .replace(/litle/g, " ") .replace(/lil/g, " ") .replace(/small/g, " ") .replace(/tiny/g, " ") .replace(/bairn/g, " ") .replace(/nipper/g, " ") .replace(/babyish/g, " ") .replace(/babylike/g, " ") .replace(/childlike/g, " ") .replace(/teenie/g, " ") .replace(/teeny/g, " ") .replace(/not mature/g, " ") .replace(/not old/g, " ") .replace(/disney/g, " ") .replace(/loli/g, " ") .replace(/shota/g, " ") .replace(/babe/g, " ")  .replace(/sister/g, " ") .replace(/daughter/g, " ") .replace(/brother/g, " ") .replace(/son/g, " ") .replace(/young looking/g, " ") .replace(/extremely young/g, " ") .replace(/mini girl/g, " ") .replace(/mini boy/g, " ") .replace(/kindergartens*/g, " ") .replace(/pubescent/g, " ") .replace(/pre pubescent/g, " ") .replace(/toddler/g, " ") .replace(/under ager/g, " ") .replace(/under age/g, " ") .replace(/under the legal age/g, " ") .replace(/under aged/g, " ") .replace(/under developed/g, " ") .replace(/under grown/g, " ") .replace(/un grown/g, " ") .replace(/very young/g, " ") .replace(/infant/g, " ") .replace(/kindergartener/g, " ") .replace(/kindergarten/g, " ") .replace(/preschooler/g, " ") .replace(/preschool/g, " ") .replace(/pre k/g, " ") .replace(/elementary school?/g, " ") .replace(/elementary aged/g, " ") .replace(/primary school/g, " ") .replace(/middle school/g, " ") .replace(/middle schooler/g, " ") .replace(/high school/g, " ") .replace(/high schooler/g, " ") .replace(/whippersnapper/g, " ") .replace(/newborn/g, " ") .replace(/tike/g, " ") .replace(/tyke/g, " ") .replace(/sprog/g, " ") .replace(/minor/g, " ") .replace(/toddle/g, " ") .replace(/teen/g, " ") .replace(/tean/g, " ") .replace(/youth/g, " ") .replace(/stripling/g, " ") .replace(/youngster/g, " ") .replace(/youngling/g, " ") .replace(/kid/g, " ") .replace(/kiddo/g, " ") .replace(/children/g, " ") .replace(/juvenile/g, " ") .replace(/1 shota/g, " ") .replace(/one shota/g, " ") .replace(/shota/g, " ") ;

      // Exclude instances of "all" and tags that include "user:", "date:", or "status:"
      if (tag.toLowerCase() !== "all" && !tag.toLowerCase().includes("user:") && !tag.toLowerCase().includes("video") && !tag.toLowerCase().includes("date:") && !tag.toLowerCase().includes("status:") && !tag.toLowerCase().includes("order:") && !tag.toLowerCase().includes("my_tags") && !tag.toLowerCase().includes("parent:") && !tag.toLowerCase().includes("+")) {
        // Append the tag to the textarea
        textarea.value += tag + ", ";
      }
    }
  }

  // Show the textarea and close button
  textarea.style.display = "block";
  closeButton.style.display = "block";
});

// Add a click event listener to the close button
closeButton.addEventListener("click", function() {
  // Hide the textarea and close button
  textarea.style.display = "none";
  closeButton.style.display = "none";
});