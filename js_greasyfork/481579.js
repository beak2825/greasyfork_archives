// ==UserScript==
// @name        TOTAL KPOP DEATH client
// @namespace   Violentmonkey Scripts
// @version     1.0
// @author      Etho
// @description Roundhouse kick a kshitter into the pavement
// @match       https://boards.4channel.org/vg/*
// @connect     rentry.org
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/481579/TOTAL%20KPOP%20DEATH%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/481579/TOTAL%20KPOP%20DEATH%20client.meta.js
// ==/UserScript==


/*
 * Kill Asukafag. Behead Asukafag. Roundhouse kick a Asukafaginto the
 * concrete. Slam dunk a Asukafag baby into the trashcan. Defecate in
 * a Asukafag food. Launch Asukafag into the sun. Stir fry Asukafag
 * in a wok. Toss Asukafag into active volcanoes. Urinate into a
 * Asukafaggas tank. Judo throw Asukafaginto a wood chipper.
 * Twist Asukafagheads off. Report Asukafagto the IRS. Karate chop
 *  Asukafagin half. Curb stomp pregnant black Asukafag. Trap
 * Asukafagin quicksand. Crush Asukafagin the trash compactor.
 * Liquefy Asukafagin a vat of acid. Eat Asukafag.
 *  Dissect Asukafag. Exterminate Asukafagin the gas chamber.
 * Stomp Asukafagskulls with steel toed boots. Cremate Asukafag
 * in the oven. Lobotomize Asukafag. Mandatory abortions for
 * Asukafag. Grind Asukafagfetuses in the garbage disposal.
 * Drown Asukafagin fried chicken grease. Vaporize Asukafag
 * with a ray gun. Kick old Asukafagdown the stairs.
 * Feed Asukafagto alligators. Slice Asukafag with a katana.
*/


function ismmcg(){
  oppost =  document.getElementsByClassName("post\ op")[0];
  subject = oppost.querySelector(".subject").innerText.split(" ")[0];
  return (subject == "/mmcg/");
}

async function getspamposts(){
  url = "https://rentry.org/5at2s"
  /*
    GM.xmlHttpRequest({
  method: "GET",
  url: url,
  //responseType: "document",
  onload: function(response) {

    found = response.responseText.split("entry-text")[1].split("div")[1].split("\<p\>")[1].split("\<")[0];

      return JSON.parse(found);

  }

});
  */

    return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
         found = response.responseText.split("entry-text")[1].split("div")[1].split("\<p\>")[1].split("\<")[0];

      resolve(JSON.parse(found));
        //resolve(response.responseText);
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });

}

function getPostNumber(post){return post.getElementsByClassName("postNum\ desktop")[0].innerText.split("\.").slice(-1)[0];}

function getPostText(post){return post.getElementsByClassName("postMessage")[0].innerHTML.split("\<br\>").slice(-1)[0];}

function loadposts(){
  //create list of posts in form [num, parsedtext]

  return posts;
}


async function main(){
console.log("Deleting ASUKASPAM");
spam = await getspamposts();
 // console.log(spam);
    posts = [];
  rawposts = document.querySelectorAll( '[ class*="postContainer" ]' )
  //rawposts = document.getElementsByClassName("post\ Container");
  console.log(rawposts.length)
  for(post of rawposts){
    num = getPostNumber(post);
    //console.log(num);
    for(spamitem of spam){
      if(parseInt(num) == parseInt(spamitem)){
        console.log("remove", num);
        post.remove();
      }

    }
  }

}


if(ismmcg()){
  main();
 setInterval(main,30000);
}
else{
  console.log("not mmcg");
}