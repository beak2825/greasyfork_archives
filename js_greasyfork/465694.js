// ==UserScript==
// @name      MAL Images Backup
// @namespace MALImgsBackup
// @description Backups all images on forum topics, blogs and all images on anime/manga lists CSS styles.
// @version  5
// @match    https://myanimelist.net/blog/*
// @match    https://myanimelist.net/animelist/*
// @match    https://myanimelist.net/mangalist/*
// @match    https://myanimelist.net/forum/?topicid=*
// @icon     https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @connect  i.imgur.com
// @connect  media.giphy.com
// @connect  media1.tenor.com
// @connect  thumbs.gfycat.com
// @connect  cdn.myanimelist.net
// @connect  image.myanimelist.net
// @grant    GM_registerMenuCommand
// @grant    GM.xmlHttpRequest
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/465694/MAL%20Images%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/465694/MAL%20Images%20Backup.meta.js
// ==/UserScript==

GM_registerMenuCommand("Backup HTML/CSS", Backup); //Adds an option to the menu
async function Backup() { //Creates a new Backup function
  const imagePromises = []; //Creates a new array
  if (location.pathname.match('list') !== null) //If the user is on a manga/anime list
  { //Starts the if condition
    var component; //Creates a new variable
    var NotCustom = document.querySelector("style:nth-child(2)").innerText; //Creates a new variable
    var Custom = document.querySelector("#custom-css") === null ? '' : document.querySelector("#custom-css").innerText; //Creates a new variable

    if ((Custom + NotCustom).match(/http.+?(?=(?:"|'|`)?\))/gm) === null) //If the css has no image links
    { //Starts the if condition
      alert(location.pathname.split('/')[2] + ' CSS codes has no images!'); //Show a message
      return; //Stop the script
    } //Finishes the if condition
    const HasLinks = Custom.match(/http.+?(?=(?:"|'|`)?\))/gm) !== null; //Creates a new variable

    (Custom + NotCustom).match(/http.+?(?=(?:"|'|`)?\))/gm).forEach(URL => { //For each image URL in the CSS code
      const promise = new Promise((resolve) => { //Convert URL to DataURI using a Promise
        GM.xmlHttpRequest({ //Starts the xmlHttpRequest
          method: "GET",
          url: URL,
          responseType: "blob",
          onload: async (response) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(response.response);
          } //Finishes the onload
        }); //Finishes the xmlHttpRequest
      }); //Finishes the promise const
      imagePromises.push(promise); //Add the promise to the array
      promise.then((dataURI) => { //After the promise resolves, replace URL with DataURI in the CSS code
        Custom = Custom.replace(URL, dataURI); //Change all image links on the variable to DataURI
        NotCustom = NotCustom.replace(URL, dataURI); //Change all image links on the variable to DataURI
        HasLinks ? component = Custom : component = NotCustom; //If the user is on a modern list style and it has a custom css with images
      }); //Finishes the dataURI const
    }); //Finishes the forEach loop
    await Promise.all(imagePromises); //Wait for all image URLs to be fetched and their corresponding data URIs to be generated

    document.body.insertAdjacentHTML('afterbegin', `<a id='dwnldLnk' download="${location.pathname.split('/')[2]}${Custom === '' ? ' Classic Style' : ' Modern Style'}.css" href="data:text/css;charset=utf-8,${encodeURIComponent(component)}"></a>`); //Generate the download button
    document.getElementById('dwnldLnk').click(); //Download the css
  } //Finishes the if condition
  else //If the user is on a forum or blog page
  { //Starts the else condition
    document.querySelectorAll(".message-text > img, .userimg").forEach(function(URL) { //ForEach image URL on the page
      const imagePromise = new Promise((resolve) => GM.xmlHttpRequest({ //Starts the xmlHttpRequest
        method: "GET",
        url: URL.src,
        responseType: "blob",
        onload: async (response) => {
          const dataURI = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(response.response);
          });
          dataURI !== 'data:' ? URL.src = dataURI : ''; //Change the url link with the data URI
          resolve(); //Resolve the promise once the data URI is generated
        } //Finishes the onload
      })); //Finishes the xmlHttpRequest
      imagePromises.push(imagePromise); //Add the promise to the array
    }); //Finishes the forEach loop
    await Promise.all(imagePromises); //Wait for all image URLs to be fetched and their corresponding data URIs to be generated
    document.body.insertAdjacentHTML('afterbegin', `<a id='dwnldLnk' download="https myanimelist.net ${location.href.split(/t\//)[1].replaceAll(/[/?]/gm, ' ').replaceAll(/  /gm, ' ')}.html" href="data:text/html;charset=utf-8,${encodeURIComponent(document.documentElement.outerHTML)}"></a>`); //Generate the download button
    document.getElementById('dwnldLnk').click(); //Download the website html
  } //Finishes the else condition
} //Finishes the Backup function