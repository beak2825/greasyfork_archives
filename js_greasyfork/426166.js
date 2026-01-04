// ==UserScript==
// @name        Mangadex API v5 reader
// @namespace   Violentmonkey Scripts
// @match       https://*.mangadex.org/*
// @grant       none
// @run-at document-start
// @version     1.12
// @author      -
// @description 5/8/2021, 10:46:50 AM
// @downloadURL https://update.greasyfork.org/scripts/426166/Mangadex%20API%20v5%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/426166/Mangadex%20API%20v5%20reader.meta.js
// ==/UserScript==
if(location.href.startsWith("https://api.mangadex.org")) window.addEventListener('beforescriptexecute', function(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.remove();
}, true)
window.addEventListener("load",()=>{
  window.sessionToken = undefined;
  const login = async(username,password)=>{
    let response = await fetch("https://api.mangadex.org/auth/login",{
      method:"POST",
      body:JSON.stringify({
        username,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    let data = await response.json().catch(e=>alert(`/auth/login failed: ${response.status}`));
    if(data.result==="ko") alert("wrong password!");
    window.sessionToken = data.token.session;
  };

  const sleep = (delay)=>new Promise((resolve)=>setTimeout(resolve,delay));

  let last_request = performance.now();

  let cache = new Map();
  window.fetchJSON = async(url)=>{
    if(cache.has(url)) return cache.get(url);

    let resolve;
    let promise = new Promise((r)=>{resolve = r;})
    promise.resolve = resolve;

    cache.set(url,promise);

    // rate limit
    while(true) {
      let diff = performance.now()-last_request;
      let target = diff - 250;
      if(target>=0) break;
      await sleep(-target);
    }
    last_request = performance.now();

    let headers = {};
    if(sessionToken) headers.Authorization = sessionToken;
    let options = {
      mode: location.href.startsWith("https://api.mangadex.org")?"same-origin":"cors",
      headers
    };

    let response = await fetch(url,options);
    try{
      let data = await response.json();
      promise.resolve(data);
      return data;
    }  catch(e) {
      promise.resolve(null);
      return promise;
    }
  };

  async function* listIterator(urlstring, params = {}, limit=100) {
    let i=0;
    params.limit = limit;
    while(true) {
      let url = new URL(urlstring);
      params.offset = i;
      url.search = new URLSearchParams(params);
      let result = await fetchJSON(url.toString());
      if(result===null || result.results.length === 0 || i > result.total) return;
      for(let e of result.results) {
        yield e;
      }
      i+=limit;
      if(i > result.total) return;
    }
  }

  let getImageUrlsFromChapterID = async(chapterID)=>{
    let chapter = await fetchJSON(`https://api.mangadex.org/chapter/${chapterID}`);
    let server = await fetchJSON(`https://api.mangadex.org/at-home/server/${chapterID}`);
    console.log(chapter)
    let urls = chapter.data.attributes.dataSaver.map(s=>`${server.baseUrl}/data-saver/${chapter.data.attributes.hash}/${s}`)
    return urls;
  };
  let getChaptersFromMangaID = async(mangaID)=>{
    let chapters = [];
    for await (let result of listIterator(`https://api.mangadex.org/manga/${mangaID}/feed`,{"translatedLanguage[]":["en"]})) {
      chapters.push(result)
    }
    let string = (c)=>(c.data.attributes.volume||"0")+"."+(c.data.attributes.chapter||"0");
    return chapters.sort((a,b)=>string(b).localeCompare(string(a), undefined, {numeric: true}));
  };
  let getGroupNamesFromChapter = async(chapter)=>{
    let groupIDs = chapter.relationships.filter(e=>e.type==="scanlation_group").map(e=>e.id);
    let groups = await Promise.all(groupIDs.map(id=>fetchJSON(`https://api.mangadex.org/group/${id}`)));
    return groups.map(g=>g.data.attributes.name);
  };
  let search = async(title)=>{
    let matches = [];
    for await (let result of listIterator("https://api.mangadex.org/manga",{title})) {
      let resultTitle = result.data.attributes.title.en;
      if(resultTitle.toLowerCase().indexOf(title.toLowerCase())>=0) matches.push(result);
    }
    return matches;
  };

  const displayChapter = async(chapter)=>{
    searchResults.innerHTML = "";

    let imageIDs = await getImageUrlsFromChapterID(chapter.data.id);
    let mangaID = chapter.relationships.filter(e=>e.type==="manga").map(e=>e.id)[0];
    const links = ()=>{
      let manga = document.createElement("div");
      manga.innerText = "manga";
      manga.addEventListener("click", ()=>{
        displayManga(mangaID);
      });
      searchResults.appendChild(manga);

      let chapterNumber = document.createElement("div");
      chapterNumber.innerText = " chapter: "+chapter.data.attributes.chapter;
      searchResults.appendChild(chapterNumber);
    };

    links();

    for(let e of imageIDs) {
      let image = document.createElement("img");
      image.src = e;
      searchResults.appendChild(image);
    }

    links();
  };

  const displayManga = async(id)=>{
    searchResults.innerHTML = "";
    
    let uploadMenu = document.createElement("div");
    uploadMenu.innerHTML = `
    group ids(seperated by " " or ","): <input type="text" id="upload-groups" value="6cfad7a7-abee-436d-b306-55cf400f8f97">
    files(images not archives/zip files!): <input type="file" multiple id="upload-files">
    volume: <input type="text" id="upload-volume">
    chapter: <input type="text" id="upload-chapter">
    title: <input type="text" id="upload-title">
    language: <input type="text" id="upload-language" value="en">
    <button id="upload-submit">upload</button>
    `
    searchResults.appendChild(uploadMenu);
    uploadMenu.querySelector("#upload-submit").addEventListener("click",async()=>{
      let username = document.querySelector("#username").value;
      let password = document.querySelector("#password").value;
      await login(username,password);
      if(!sessionToken) {
        alert("not logged in");
        return;
      }
      
      let oldUpload = await fetchJSON("https://api.mangadex.org/upload",{
        
      });
      if(oldUpload.result !== "error") {
        console.log(oldUpload);
        if(!confirm("There is an old upload session.\n Do you want to continue (will cancel the old session)?")) return;
        await fetch(`https://api.mangadex.org/upload/${oldUpload.data.id}`,{
          method: "DELETE",
          mode: location.href.startsWith("https://api.mangadex.org")?"same-origin":"cors",
          headers: {
            Authorization: sessionToken
          }
        });
      }
      
      let headers = {
        "Content-Type": "application/json"
      };
      headers.Authorization = sessionToken;
      
      let uploadResponse = await fetch("https://api.mangadex.org/upload/begin",{
        method: "POST",
        body:JSON.stringify({
          manga: id,
          groups: uploadMenu.querySelector("#upload-groups").value.split(/[\s,]+/)
        }),
        mode: location.href.startsWith("https://api.mangadex.org")?"same-origin":"cors",
        headers
      });
      let upload = await uploadResponse.json();
      console.log(upload);
      
      let files = [...uploadMenu.querySelector("#upload-files").files].sort((a,b)=>a.name.localeCompare(b.name,"en", {numeric: true}));
      console.log(files);
      //files.push(new File([Uint8Array.from([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,1,194,0,0,0,42,2,3,0,0,0,93,22,179,141,0,0,0,4,103,65,77,65,0,0,177,143,11,252,97,5,0,0,0,32,99,72,82,77,0,0,122,38,0,0,128,132,0,0,250,0,0,0,128,232,0,0,117,48,0,0,234,96,0,0,58,152,0,0,23,112,156,186,81,60,0,0,0,9,80,76,84,69,0,0,0,255,0,0,255,255,255,103,25,100,30,0,0,0,1,98,75,71,68,2,102,11,124,100,0,0,0,9,112,72,89,115,0,0,0,96,0,0,0,96,0,240,107,66,207,0,0,0,7,116,73,77,69,7,229,7,8,2,22,32,217,187,149,31,0,0,0,16,99,97,78,118,0,0,2,128,0,0,1,224,0,0,0,118,0,0,0,140,85,90,246,167,0,0,1,173,73,68,65,84,88,195,237,83,65,110,196,48,8,4,137,220,125,112,254,131,37,124,119,37,231,255,95,233,64,146,141,35,101,87,213,158,122,240,52,218,218,48,102,0,99,162,137,137,137,137,137,137,137,255,2,193,167,177,202,231,118,119,232,141,115,97,211,193,24,63,250,162,218,197,92,94,103,225,181,49,64,130,49,221,66,248,127,225,71,69,29,50,121,86,124,81,83,57,227,195,91,70,69,236,15,218,168,72,252,182,198,79,138,53,95,149,240,65,231,27,195,35,175,220,97,212,218,132,27,214,248,144,66,94,90,37,250,225,86,119,35,146,226,182,177,194,5,251,105,108,180,52,4,83,115,26,200,171,89,22,184,124,155,150,230,4,38,134,93,211,45,125,243,86,43,26,130,176,38,88,32,44,186,218,148,76,165,89,24,75,218,84,84,117,51,105,181,31,198,234,76,87,172,210,84,204,207,154,44,30,1,219,141,41,8,254,167,42,183,26,77,188,198,80,196,122,115,69,55,33,148,149,14,187,27,177,225,14,69,191,1,72,44,61,152,116,40,122,74,221,106,223,131,192,174,220,209,85,39,48,218,139,131,67,141,8,28,215,189,147,253,172,12,138,81,178,127,164,17,28,186,62,9,72,57,152,174,88,118,69,67,141,103,16,120,69,160,24,149,105,218,15,14,179,90,204,103,181,224,30,113,252,232,42,20,37,20,51,146,47,209,85,146,188,145,43,122,81,7,211,21,243,161,152,247,244,206,180,115,226,32,80,194,90,111,179,42,25,173,195,99,52,140,80,195,218,39,135,211,74,49,18,197,112,5,110,244,201,49,229,134,156,87,159,191,96,162,132,165,33,11,120,157,89,48,57,130,53,226,40,91,162,182,198,59,195,122,189,189,199,199,23,48,218,47,135,62,249,85,233,75,188,83,244,186,62,41,174,223,10,78,76,76,76,76,76,252,1,191,4,15,90,174,67,232,28,160,0,0,0,115,116,69,88,116,99,111,109,109,101,110,116,0,60,97,100,62,32,117,112,108,111,97,100,101,100,32,116,111,32,109,97,110,103,97,100,101,120,46,111,114,103,32,117,115,105,110,103,32,104,116,116,112,115,58,47,47,103,114,101,97,115,121,102,111,114,107,46,111,114,103,47,101,110,47,115,99,114,105,112,116,115,47,52,50,54,49,54,54,45,109,97,110,103,97,100,101,120,45,97,112,105,45,118,53,45,114,101,97,100,101,114,32,60,47,97,100,62,10,10,57,112,150,180,0,0,0,37,116,69,88,116,100,97,116,101,58,99,114,101,97,116,101,0,50,48,50,49,45,48,55,45,48,56,84,48,48,58,50,50,58,51,50,43,48,50,58,48,48,205,25,161,139,0,0,0,37,116,69,88,116,100,97,116,101,58,109,111,100,105,102,121,0,50,48,50,49,45,48,55,45,48,56,84,48,48,58,50,50,58,51,50,43,48,50,58,48,48,188,68,25,55,0,0,0,0,73,69,78,68,174,66,96,130]).buffer],"ad.png",{type:"image/png"}));
      let ids = [];
      for(let i=0; i<files.length; i++) {
        console.log("uploading image:",i);
        let formData = new FormData();
        formData.append("image", files[i]);
        while(true) {
          let res = await fetch(`https://api.mangadex.org/upload/${upload.data.id}`, {
            method: "POST",
            body: formData,
            mode: location.href.startsWith("https://api.mangadex.org")?"same-origin":"cors",
            headers: {
              Authorization: sessionToken
            }
          });
          if(res.status === 200) {
            let json = await res.json();
            console.log(json.data.id,json);
            ids.push(...json.data.map(e=>e.id));
            break;
          }
          await new Promise((res)=>setTimeout(res,500));
        }
      }
      
      let result = await fetch(`https://api.mangadex.org/upload/${upload.data.id}/commit`,{
        method: "POST",
        body: JSON.stringify({
          chapterDraft: {
            volume: uploadMenu.querySelector("#upload-volume").value,
            chapter: uploadMenu.querySelector("#upload-chapter").value,
            title: uploadMenu.querySelector("#upload-title").value,
            translatedLanguage: uploadMenu.querySelector("#upload-language").value,
          },
          pageOrder: ids
        }),
        mode: location.href.startsWith("https://api.mangadex.org")?"same-origin":"cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionToken
        }
      });
      console.log(result);
      alert("done!")
    });
    
    
    
    let chapters = await getChaptersFromMangaID(id);

    let reads = sessionToken?(await fetchJSON(`https://api.mangadex.org/manga/${id}/read`)).data:[];

    for(let e of chapters) {
      let chapter = document.createElement("div");

      let read = "";
      if(sessionToken) read = reads.includes(e.data.id)?"[read] ":"[    ] ";

      getGroupNamesFromChapter(e).then((names)=>{
        chapter.innerText = `${read}${e.data.attributes.volume||0}.${e.data.attributes.chapter||0} ${e.data.attributes.title} by ${names.join(" ")} `;
      });
      chapter.addEventListener("click",()=>{
        displayChapter(e);
      });
      searchResults.appendChild(chapter);
    }
  };

  const displayMangaList = async(mangaList)=>{
    searchResults.innerHTML = "";
    for(let e of mangaList) {
      let id = e.data.id;
      let title = e.data.attributes.title.en;
      let lastChapter = "";
      if(e.data.attributes.lastChapter && e.data.attributes.lastChapter!=="0") lastChapter = `[last chapter: ${e.data.attributes.lastVolume||0}.${e.data.attributes.lastChapter}]`;

      let manga = document.createElement("div");
      manga.innerText = `${title} ${lastChapter}`;
      manga.addEventListener("click",()=>{
        displayManga(id);
      });
      searchResults.appendChild(manga);
    }
  };

  let div = document.createElement("div");
  div.innerHTML = `
  <style>
    body {
      margin: 0px;
      padding: 0px;
    }
    img:not([src^="data:"]) {
      display: block;
      text-align: centre;
    }
    input {
      margin: 10px;
      padding: 5px;
      padding-left: 10px;
      color: #f79421 !important;
      font-size: 15px;
      border-radius: 25px;
      border: solid;
      border-color: #f79421;
    }
    input#search {
      width: 95%;
      margin-bottom: 15px;
    }
    #search-results {
      font-family: monospace;
      white-space: pre;
    }
    button {
      background: #f79421;
      color: white;
      font-size: 15px;
      border-radius: 25px;
      border: none;
      padding: 9px 20px;
      margin: 10px;
    }
    #search {
      color: #f79421;
      margin: 10px 20px 0px 10px;
    }
    textarea:focus, input:focus{
      outline: none;
      box-shadow: 0 0 10px #f79421;
    }
  </style>
  <input id="username" placeholder="username" type="text" name="username">
  <input id="password" placeholder="password" type="password" name="password">
  <button id="show-follows">show follows</button>
  <br/>
  <input id="search" type="search" placeholder="manga title">
  <div id="search-results"></div>
  `;
  document.body.insertBefore(div,document.body.childNodes[0])
  let searchResults = document.querySelector("#search-results");

  let search_debounce_last_timeout;
  document.querySelector("#search").addEventListener("input",async(e)=>{
    console.log(e.target.value);
    clearTimeout(search_debounce_last_timeout);
    search_debounce_last_timeout = setTimeout(async()=>{
      let query = e.target.value;
      let result = await search(query);

      displayMangaList(result);
    },1000);
  });
  document.querySelector("#show-follows").addEventListener("click",async(e)=>{
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    await login(username,password);

    let list = [];
    for await (let result of listIterator(`https://api.mangadex.org/user/follows/manga`)) {
      list.push(result)
    }
    displayMangaList(list);
  });
});