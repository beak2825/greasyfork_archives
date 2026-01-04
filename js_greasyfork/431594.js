// ==UserScript==
// @name        TMDB with IMDB, Letterboxd, RottenTomatoes, Metacritic & MyAnimeList ratings
// @description It adds IMDB, RottenTomatoes, Metacritic, MyAnimeList & Awards/Nominations to TMDB
// @match       https://www.themoviedb.org/*
// @version     2.16.13
// @author      SH3LL
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace   https://greasyfork.org/users/762057
// @resource    RT_api https://pastebin.com/raw/NXHeK6nf
// @connect     algolia.net
// @connect     rottentomatoes.com
// @connect     themoviedb.org
// @downloadURL https://update.greasyfork.org/scripts/431594/TMDB%20with%20IMDB%2C%20Letterboxd%2C%20RottenTomatoes%2C%20Metacritic%20%20MyAnimeList%20ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/431594/TMDB%20with%20IMDB%2C%20Letterboxd%2C%20RottenTomatoes%2C%20Metacritic%20%20MyAnimeList%20ratings.meta.js
// ==/UserScript==

// Helpers

function clean_t(title){
  if(title===null||title===undefined) return "";
  return title.toLowerCase()
              .replace("The Motion Picture","")
              .replace("The Movie","").replace("Movie","")
              .replaceAll(/[$&+,:;=?@#|'<>.^*()%!"-]+/g,'') //remove all special characters
              .replaceAll(/\s\s+/g,'') //remove multipla spaces
              .trim()
}

function asyncGet (url, options = {}) {
    if (options.params) {
        url = url + '?' + $.param(options.params)
    }

    const id = options.title || url
    const request = Object.assign({ method: 'GET', url }, options.request || {})
    return new Promise((resolve, reject) => {
        request.onload = res => {
            if (res.status >= 400) {
              console.log(res);
                const error = Object.assign(
                    new Error(`error fetching ${id} (${res.status} ${res.statusText})`),
                    { status: res.status, statusText: res.statusText }
                )

                reject(error)
            } else {
                resolve(res)
            }
        }

        // XXX apart from +finalUrl+, the +onerror+ response object doesn't
        // contain any useful info
        request.onerror = _res => {
            const { status, statusText } = CONNECTION_ERROR
            const error = Object.assign(
                new Error(`error fetching ${id} (${status} ${statusText})`),
                { status, statusText },
            )

            reject(error)
        }

        GM_xmlhttpRequest(request)
    })
}

// Functions

function TMDB_search_api(TMDB_id,content) {

    if (content==="movie"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/movie/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language=en&append_to_response=external_ids,keywords',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB title api: https://api.themoviedb.org/3/movie/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language=en&append_to_response=external_ids,keywords');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;

                    }

                    let IMDB_id=0,TMDB_title=0, TMDB_original_title=0, TMDB_year=0,anime_flag=0;

                    if(json.title!==undefined && json.title!==null) TMDB_title = json.title;
                    if(json.original_title!==undefined && json.original_title!==null) TMDB_original_title = json.original_title;
                    if(json.external_ids!==undefined && json.external_ids.imdb_id!== null) IMDB_id = json.external_ids.imdb_id;
                    if(json.release_date!==null && json.release_date!==undefined) TMDB_year=json.release_date.slice(0,4);
                    if(json.keywords!==undefined && json.keywords.keywords!==undefined && json.keywords.keywords!==null){
                      for(let keyword of json.keywords.keywords){
                        if(keyword.name==="anime"){anime_flag=1; break;}
                      }
                    }
                    resolve([TMDB_title,TMDB_original_title,TMDB_year,IMDB_id,anime_flag]); return;

                }
            });
        });

    }else if(content==="tv"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/tv/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language=en&append_to_response=external_ids,keywords',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB title api: https://api.themoviedb.org/3/tv/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language=en&append_to_response=external_ids,keywords');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;

                    }

                    let IMDB_id=0,TMDB_title=0, TMDB_original_title=0,seasons_count=0,anime_flag=0;

                    if(json.name!==undefined && json.name!==null) TMDB_title = json.name;
                    if(json.original_name!==undefined && json.original_name!==null) TMDB_original_title = json.original_name;
                    if(json.external_ids!==undefined && json.external_ids.imdb_id!== null) IMDB_id = json.external_ids.imdb_id; //imdb id
                    if(json.seasons!==undefined && json.seasons!== null) seasons_count = (json.seasons).length;
                    if(json.keywords!==undefined && json.keywords.results!==undefined && json.keywords.results!==null){
                      for(let keyword of json.keywords.results){
                        if(keyword.name==="anime"){anime_flag=1; break;}
                      }
                    }

                    //years range
                    let first_year="N/A",last_year="N/A",years_range;

                    if(json.first_air_date!==undefined && json.first_air_date!==null) first_year = json.first_air_date.slice(0,4);
                    if(json.last_air_date!==undefined && json.last_air_date!==null) {
                      if(json.last_air_date.slice(2,4) !== first_year.slice(2,4)) last_year = json.last_air_date.slice(2,4);
                    }

                    if(last_year !=="N/A") years_range=first_year + "-" + last_year; else years_range=first_year;

                    resolve([TMDB_title,TMDB_original_title,first_year,years_range,IMDB_id,seasons_count,anime_flag]); return;

                }
            });
        });
    }
}

function IMDB_info_scrape(IMDB_id) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: "https://www.imdb.com/title/"+IMDB_id,
            onload: (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;
                console.log("IMDB link: "+"https://www.imdb.com/title/"+IMDB_id)

                let IMDB_rating=0, IMDB_votes_number=0, IMDB_awards=0, IMDB_next_title=0,IMDB_next_date=0;
                if(doc.querySelectorAll('.sc-acdbf0f3-3')[0]!=undefined){
                  IMDB_rating = doc.querySelectorAll('.sc-d541859f-1')[0].innerText;
                  IMDB_votes_number = doc.querySelectorAll('.sc-d541859f-3')[0].innerText;
                  let awards_hook=doc.querySelectorAll('.sc-aa5ab255-0');
                  if(awards_hook.length!==0) IMDB_awards = awards_hook[0].children[1].children[0].children[0].innerText + ". "+awards_hook[0].children[1].children[0].children[1].innerText;
                  if(IMDB_awards===undefined) IMDB_awards=0;
                }
                resolve([IMDB_rating,IMDB_votes_number,IMDB_awards]); return;
        }
        });
      })
}

function LB_search_scrape(title,year) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://letterboxd.com/search/films/'+title.replaceAll(" ", "+"),
                onload: (resp) => {

                console.log("LT link: "+ 'https://letterboxd.com/search/films/'+title.replaceAll(" ", "+"));

                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;

                let results = doc.getElementsByClassName("film-detail-content");
                for(let curr_movie of results){
                    let curr_title = clean_t(curr_movie.children[0].children[0].children[0].innerText);
                    let curr_year = clean_t(curr_movie.children[0].children[0].children[1].innerText);
                    let curr_url = "https://letterboxd.com"+curr_movie.children[0].children[0].children[0].href;

                    console.log("LB title: "+title)
                    console.log("LB year: "+year)
                    console.log("LB url: "+curr_url)

                    if(   (  parseInt(curr_year) === parseInt(year) && clean_t(curr_title) === clean_t(title) )  ||
                          ( (parseInt(curr_year) === parseInt(year) + 1 || parseInt(curr_year) === parseInt(year) -1 )&& clean_t(curr_title) === clean_t(title) )
                      ){
                      resolve(curr_url); return;
                    }

                }

                resolve("error"); return;
            }
        });
        });
}

function LB_info_scrape(LB_url){
  let LB_score_url=LB_url.replace("/film/","/csi/film/")+"rating-histogram/"
  return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: LB_score_url,
            onload: (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;
                console.log("Scraping LB scores: "+LB_score_url)

                let LB_score=0,LB_users=0;

                if(doc.getElementsByClassName("average-rating")[0]!=undefined){
                  let LB_score_sentence = doc.getElementsByClassName("average-rating")[0].children[0].getAttribute("title");
                  LB_score=LB_score_sentence.split("based on")[0].replace("Weighted average of ","").trim();
                  LB_users=LB_score_sentence.split("based on")[1].replace(" ratings","").trim();
                }
                resolve([LB_score,LB_users]); return;
        }
        });
      })
}

function RT_search_scrape(title,year,content) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://www.rottentomatoes.com/search?search='+title.replaceAll(" ", "%20"),
                onload: (resp) => {
                if(content==="tv"){content="tvSeries";}
                console.log("RT link: "+ 'https://www.rottentomatoes.com/search?search='+title.replaceAll(" ", "%20"));

                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;

                let Search_Sections = doc.getElementsByTagName("search-page-result");
                for(let myelement of Search_Sections){

                  if(myelement.getAttribute("type")===content){

                    let titles = myelement.getElementsByTagName("ul")[0];

                    for(let current_title of titles.children){
                      // get year
                      let curr_year = current_title.getAttribute("releaseyear");
                      if (curr_year==="") curr_year = current_title.getAttribute("startyear");

                      // get title name and link
                      let title_link_node = current_title.getElementsByTagName("a")[1];
                      let curr_title=title_link_node.innerText;
                      let curr_RT_url = title_link_node.href; if(curr_RT_url===undefined || curr_RT_url===null){continue;}

                      if(   (  parseInt(curr_year) === parseInt(year) && clean_t(curr_title) === clean_t(title) )  ||
                            ( (parseInt(curr_year) === parseInt(year) + 1 || parseInt(curr_year) === parseInt(year) -1 )&& clean_t(curr_title) === clean_t(title) )
                        ){
                        resolve(curr_RT_url); return;
                      }

                    }

                  }

                }

                resolve("error"); return;
            }
        });
        });
}

function RT_search_api(title,year,content) {

    return new Promise(async function (resolve, reject) {

        // build request payload
        const template = GM_getResourceText('RT_api');
        const query = JSON.stringify(clean_t(title));
        let typeId; if(content==="movie"){typeId="1"}; if(content==="tv"){typeId="2"};
        const json = template.replace('{{typeId}}', String(typeId)).replace('{{apiLimit}}', String(100));
        const { api, params, data } = JSON.parse(json);
        for (const [key, value] of Object.entries(params)) {
            if (value && typeof value === 'object') {
                params[key] = JSON.stringify(value)
            }
        }

        // add title to request
        Object.assign(data.requests[0], {
            query,
            params: $.param(params),
        })

        // final request
        const apiRequest = {
            title: 'API',
            request: {
                data: JSON.stringify(data),
                method: 'POST',
                responseType: 'json',
            },
        }

        //send request
        let res = await asyncGet(api, apiRequest);

        console.log(res.responseText); //output the api response

        let json_output = JSON.parse(res.responseText);
        let delta=0;
        for(let curr_result of json_output.results[0].hits){
            let curr_title = curr_result.title;
            let curr_year = curr_result.releaseYear;

            console.log("RT search api: [" + clean_t(curr_title)+"]"+"["+clean_t(title)+"]");

            if(parseInt(curr_year) === parseInt(year) && clean_t(curr_title) === clean_t(title)){ //fix rotten tomatoes errors
                delta=curr_result.vanity; break;
              }/*else if(( parseInt(curr_year) === parseInt(year) + 1 || parseInt(curr_year) === parseInt(year) -1 )&& clean_t(curr_title) === clean_t(title)){
                delta=curr_result.vanity; break;
              }else if(parseInt(curr_year) === parseInt(year) && clean_t(curr_title).includes(clean_t(title))){
                delta=curr_result.vanity; break;
              }else if(( parseInt(curr_year) === parseInt(year) + 1 || parseInt(curr_year) === parseInt(year) -1 )&& clean_t(curr_title).includes(clean_t(title))){
                delta=curr_result.vanity; break;
              }*/

            if(curr_result.aka != undefined){
              for(let curr_aka_title of curr_result.aka){
                console.log("RT search AKA api: [" + clean_t(curr_aka_title)+"]"+"["+clean_t(title)+"]");
                if(clean_t(curr_aka_title) === clean_t(title) && parseInt(curr_year) === parseInt(year)){ //fix rotten tomatoes errors
                  delta=curr_result.vanity; break;
                }/*else if(( parseInt(curr_year) === parseInt(year) + 1 || parseInt(curr_year) === parseInt(year) -1 )&& clean_t(curr_title) === clean_t(title)){
                  delta=curr_result.vanity; break;
                }else if(parseInt(curr_year) === parseInt(year) && clean_t(curr_title).includes(clean_t(title))){
                  delta=curr_result.vanity; break;
                }else if(( parseInt(curr_year) === parseInt(year) + 1 || parseInt(curr_year) === parseInt(year) -1 )&& clean_t(curr_title).includes(clean_t(title))){
                  delta=curr_result.vanity; break;
                }*/
              }
            }

        }
      if (content==="movie"){
        resolve("https://www.rottentomatoes.com/m/"+delta);
      }else if(content==="tv"){
        resolve("https://www.rottentomatoes.com/tv/"+delta);
      }
  });
}

function RT_info_scrape(RT_url){
  return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: RT_url,
            onload: (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;
                console.log("Scraping RT: "+RT_url)

                let tomatometer_score=0, tomatometer_state=0, audience_score=0,audience_state=0,tomatometer_icon_box=0,tomatometer_score_box=0,audience_icon_box=0,audience_score_box=0;
                let all_scores_box=0;

                if(doc.querySelector("score-board-deprecated")!==undefined) all_scores_box=doc.querySelector("score-board-deprecated");
                console.log(all_scores_box);

                if(all_scores_box!==undefined && all_scores_box!==null){
                  tomatometer_score = all_scores_box.getAttributeNode('tomatometerscore').value==="" ? 0 : all_scores_box.getAttributeNode('tomatometerscore').value;
                  tomatometer_state = all_scores_box.getAttributeNode('tomatometerstate').value==="" ? 0 : all_scores_box.getAttributeNode('tomatometerstate').value;
                  audience_score = all_scores_box.getAttributeNode('audiencescore').value==="" ? 0 : all_scores_box.getAttributeNode('audiencescore').value;
                  audience_state = all_scores_box.getAttributeNode('audiencestate').value==="" ? 0 : all_scores_box.getAttributeNode('audiencestate').value;

                  console.log(tomatometer_score+"-"+tomatometer_state+"-"+audience_score+"-"+audience_state)

                }else{
                  if(doc.querySelector("media-scorecard")!==undefined) all_scores_box=doc.querySelector("media-scorecard");
                  console.log(all_scores_box)
                  tomatometer_score = all_scores_box.querySelector('rt-text[slot="criticsScore"]') == undefined ? 0 : all_scores_box.querySelector('rt-text[slot="criticsScore"]').innerText.replace("%","").trim();
                  tomatometer_state = all_scores_box.querySelector('score-icon-critics') == undefined ? 0 : all_scores_box.querySelector('score-icon-critics').getAttribute('certified');
                  if(tomatometer_state=="false"){tomatometer_state = all_scores_box.querySelector('score-icon-critics') == undefined ? 0 : all_scores_box.querySelector('score-icon-critics').getAttribute('sentiment');}
                  audience_score = all_scores_box.querySelector('rt-text[slot="audienceScore"]') == undefined ? 0: all_scores_box.querySelector('rt-text[slot="audienceScore"]').innerText.replace("%","").trim();
                  audience_state = all_scores_box.querySelector('score-icon-audience') == undefined ? 0 : all_scores_box.querySelector('score-icon-audience').getAttribute('sentiment');
                  if(tomatometer_state=="POSITIVE"){
                    tomatometer_state = "fresh";
                  }else if(tomatometer_state=="NEGATIVE"){
                    tomatometer_state = "rotten";
                  }else if(tomatometer_state=="true"){
                    tomatometer_state = "certified-fresh";
                  }else{tomatometer_state=0;}

                  if(audience_state=="POSITIVE"){
                    audience_state = "upright";
                  }else if(audience_state=="NEGATIVE"){
                    audience_state = "spilled";
                  }else{audience_state=0;}

                  /*let scoreboxes = doc.getElementsByClassName("mop-ratings-wrap__half");

                  if(scoreboxes.length===0){resolve([0,0,0,0]); return;}
                  let tomatometer_box=scoreboxes[0]; let audience_box=scoreboxes[1];

                  if(tomatometer_box.getElementsByClassName("mop-ratings-wrap__icon")!==undefined) tomatometer_icon_box = tomatometer_box.getElementsByClassName("mop-ratings-wrap__icon")[0]; tomatometer_score_box = tomatometer_box.getElementsByClassName("mop-ratings-wrap__percentage")[0];
                  if(audience_box.getElementsByClassName("mop-ratings-wrap__icon")!==undefined) audience_icon_box = audience_box.getElementsByClassName("mop-ratings-wrap__icon")[0]; audience_score_box = audience_box.getElementsByClassName("mop-ratings-wrap__percentage")[0];

                  if(tomatometer_icon_box!==undefined){
                    if(tomatometer_icon_box.className.includes("rotten")) tomatometer_state="rotten";
                    if(tomatometer_icon_box.className.includes("certified-fresh")) tomatometer_state="certified-fresh";
                    if(tomatometer_icon_box.className.includes("fresh")) tomatometer_state="fresh";
                    tomatometer_score=tomatometer_score_box.innerText.trim().replaceAll("%","");
                  }
                  if(audience_icon_box!==undefined){
                    if(audience_icon_box.className.includes("upright")) audience_state="upright";
                    if(audience_icon_box.className.includes("spilled")) audience_state="spilled";
                    audience_score=audience_score_box.innerText.trim().replaceAll("%","");
                  }
                  */


                }
                resolve([tomatometer_score,tomatometer_state,audience_score,audience_state]); return;
        }
        });
      })
}

function MC_search_scrape(title,year,content,sort) { // title= ORIGINAL->movies, TITLE->anime
  if (content==="movie"){

    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: "https://www.metacritic.com/search/"+title+"/?page=1&category=2"+"&sortBy="+sort,
            onload: async (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;
                console.log("MC link: "+"https://www.metacritic.com/search/"+title.replaceAll(" ", "%20")+"/?page=1&category=2"+"&sortBy="+sort,)

                let result_list = doc.getElementsByClassName('g-grid-container u-grid-columns');
                if (result_list!==undefined){
                  for (let curr_el of result_list){
                    let curr_title=0,curr_title_link=0,curr_rating=0,curr_year=0;

                    if(curr_el.getElementsByClassName('g-text-medium-fluid g-text-bold g-outer-spacing-bottom-small u-text-overflow-ellipsis')[0]===undefined) continue;

                    if(curr_el.getElementsByClassName('g-text-medium-fluid g-text-bold g-outer-spacing-bottom-small u-text-overflow-ellipsis')[0]!=undefined) curr_title = curr_el.getElementsByClassName('g-text-medium-fluid g-text-bold g-outer-spacing-bottom-small u-text-overflow-ellipsis')[0].innerText.trim();
                    curr_title_link = "https://www.metacritic.com/"+content+"/"+clean_t(curr_title).replaceAll(" ","-")
                    if(curr_el.getElementsByClassName('c-siteReviewScore_background c-siteReviewScore_background-critic_medium')[0]!=undefined) curr_rating = curr_el.getElementsByClassName('c-siteReviewScore_background c-siteReviewScore_background-critic_medium')[0].innerText.trim();
                    if(curr_el.getElementsByClassName('u-flexbox u-flexbox-alignCenter u-flexbox-nowrap g-gap-medium g-text-xxxsmall')[0].getElementsByClassName("u-text-overflow-ellipsis")[0]!=undefined) curr_year = curr_el.getElementsByClassName('u-flexbox u-flexbox-alignCenter u-flexbox-nowrap g-gap-medium g-text-xxxsmall')[0].getElementsByClassName("u-text-overflow-ellipsis")[0].innerText.trim();
                    console.log("MC title:"+ curr_title);
                    console.log("MC link:"+curr_title_link);
                    console.log("MC rating:"+curr_rating);
                    console.log("MC year:"+curr_year);

                    if(clean_t(curr_title)===clean_t(title) && ( parseInt(curr_year)===parseInt(year) || parseInt(curr_year)+1===parseInt(year) || parseInt(curr_year)-1===parseInt(year) )){
                      let MC_info = await MC_info_scrape(curr_title_link);
                      resolve([MC_info[0],MC_info[1],MC_info[2],MC_info[3],MC_info[4],curr_title_link]); return;

                    }
                  }


                }
                resolve("error"); return;
        }
      });
    })


  }else if(content==="tv"){

    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: "https://www.metacritic.com/search/"+title+"/?page=1&category=1"+"&sortBy="+sort,
            onload: async (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;
                console.log("MC link: "+"https://www.metacritic.com/search/"+title.replaceAll(" ", "%20")+"/?page=1&category=1"+"&sortBy="+sort)

                let result_list = doc.getElementsByClassName('g-grid-container u-grid-columns');
                if (result_list!==undefined){
                  for (let curr_el of result_list){
                    let curr_title=0,curr_title_link=0,curr_rating=0,curr_year=0;

                    if(curr_el.getElementsByClassName('g-text-medium-fluid g-text-bold g-outer-spacing-bottom-small u-text-overflow-ellipsis')[0]===undefined) continue;

                    if(curr_el.getElementsByClassName('g-text-medium-fluid g-text-bold g-outer-spacing-bottom-small u-text-overflow-ellipsis')[0]!=undefined) curr_title = curr_el.getElementsByClassName('g-text-medium-fluid g-text-bold g-outer-spacing-bottom-small u-text-overflow-ellipsis')[0].innerText.trim();
                    curr_title_link = "https://www.metacritic.com/"+content+"/"+clean_t(curr_title).replaceAll(" ","-")
                    if(curr_el.getElementsByClassName('c-siteReviewScore_background c-siteReviewScore_background-critic_medium')[0]!=undefined) curr_rating = curr_el.getElementsByClassName('c-siteReviewScore_background c-siteReviewScore_background-critic_medium')[0].innerText.trim();
                    if(curr_el.getElementsByClassName('u-flexbox u-flexbox-alignCenter u-flexbox-nowrap g-gap-medium g-text-xxxsmall')[0].getElementsByClassName("u-text-overflow-ellipsis")[0]!=undefined) curr_year = curr_el.getElementsByClassName('u-flexbox u-flexbox-alignCenter u-flexbox-nowrap g-gap-medium g-text-xxxsmall')[0].getElementsByClassName("u-text-overflow-ellipsis")[0].innerText.trim();
                    console.log("MC title:"+ curr_title);
                    console.log("MC link:"+curr_title_link);
                    console.log("MC rating:"+curr_rating);
                    console.log("MC year:"+curr_year);

                    if(clean_t(curr_title)===clean_t(title) && ( parseInt(curr_year)===parseInt(year) || parseInt(curr_year)+1===parseInt(year) || parseInt(curr_year)-1===parseInt(year) )){
                      let MC_info = await MC_info_scrape(curr_title_link);
                      resolve([MC_info[0],MC_info[1],MC_info[2],MC_info[3],MC_info[4],curr_title_link]); return;

                    }
                  }


                }
                resolve("error"); return;
        }
      });
    })

  }
}

function MC_info_scrape(link){
   return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: link,
            onload: (resp) => {
                const doc = document.implementation.createHTMLDocument().documentElement;
                doc.innerHTML = resp.responseText;

                let MC_MetaScore=0, MC_UserScore=0, MC_Critics=0, MC_Users=0,MC_must_see=0;

                // Get number of critics and users
                let stats_blocks = doc.getElementsByClassName("c-productScoreInfo_scoreContent u-flexbox u-flexbox-alignCenter u-flexbox-justifyFlexEnd g-width-100 u-flexbox-nowrap");
                if(stats_blocks[0]!=undefined && stats_blocks[1]!=undefined && stats_blocks[0].innerText.includes("Metascore")) {
                  if(stats_blocks[0].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0]!=undefined) MC_Critics = stats_blocks[0].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0].innerText
                  if(stats_blocks[0].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0]!=undefined) MC_MetaScore = stats_blocks[0].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0].innerText.trim();
                  if(stats_blocks[1].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0]!=undefined) MC_Users = stats_blocks[1].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0].innerText
                  if(stats_blocks[1].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0]!=undefined) MC_UserScore = stats_blocks[1].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0].innerText.trim();
                }else if(stats_blocks[0]!=undefined && stats_blocks[1]!=undefined){
                  if(stats_blocks[1].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0]!=undefined) MC_Critics = stats_blocks[1].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0].innerText
                  if(stats_blocks[1].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0]!=undefined) MC_MetaScore = stats_blocks[1].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0].innerText.trim();
                  if(stats_blocks[0].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0]!=undefined) MC_Users = stats_blocks[0].getElementsByClassName("c-productScoreInfo_reviewsTotal u-block")[0].innerText
                  if(stats_blocks[0].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0]!=undefined) MC_UserScore = stats_blocks[0].getElementsByClassName("c-productScoreInfo_scoreNumber u-float-right")[0].innerText.trim();
                }
                // Fix Strings
                if(MC_Critics!==undefined && MC_Critics!==0 && MC_Critics!=="tbd"){MC_Critics=MC_Critics.replace(/[^0-9]/g,'').trim();}else{MC_Critics="n/a"}
                if(MC_Users!==undefined && MC_Users!==0 && MC_Users!=="tbd"){MC_Users=MC_Users.replace(/[^0-9]/g,'').trim();}else{MC_Users="n/a"}
                if(MC_MetaScore!==undefined && MC_MetaScore!==0 && MC_MetaScore!=="tbd"){MC_MetaScore=MC_MetaScore.replace(/[^0-9]/g,'').trim();}else{MC_MetaScore="n/a"}
                if(MC_UserScore!==undefined && MC_UserScore!==0 && MC_UserScore!=="tbd"){MC_UserScore=MC_UserScore.replace(/[^0-9]/g,'').trim();}else{MC_UserScore="n/a"}
                // Get MustSee Tag
                if(doc.querySelector('img[src="https://www.metacritic.com/a/neutron/images/logos/badge/must-see.png"]')!==undefined && doc.querySelector('img[src="https://www.metacritic.com/a/neutron/images/logos/badge/must-see.png"]')!==null) MC_must_see=1;
                resolve([MC_MetaScore,MC_Critics,MC_UserScore,MC_Users,MC_must_see]); return;
        }
        });
      })
}

function JIKAN_search_api(title,original_title,year,content) {

    if (content==="movie"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.jikan.moe/v4/anime?q='+original_title.replaceAll(" ","%20")+'&page=1',
                onload: (resp) => {
                    let json = JSON.parse(resp.responseText);
                    console.log('MAL search api: https://api.jikan.moe/v4/anime?q='+original_title.replaceAll(" ","%20")+'&page=1');

                    if (json.data==undefined || json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;

                    }

                    let MAL_url=0, MAL_title_name=0, MAL_score=0, content_type=0, episodes_count=0, start_date=0;
                    for(let result of json.data){

                      console.log("[JIKAN en:"+result.title_english+"] - [JIKAN:"+result.title+"] - [TMDB:"+title+"]");

                      if(result.aired.from!== null) console.log("JIKAN year:"+result.aired.from.slice(0,4)+" ||||| TMDB year:"+year)

                      if( result.type!==null && result.aired.from!==null &&
                         (parseInt(result.aired.from.slice(0,4))===parseInt(year) || parseInt(result.aired.from.slice(0,4))===parseInt(year)-1 || parseInt(result.aired.from.slice(0,4))===parseInt(year)-2) &&
                         (result.type === "Movie" /*TV*/ || result.type === "ONA" || result.type === "OVA") &&
                         (  clean_t(result.title_english) === clean_t(title) ||
                            clean_t(result.title_japanese) === clean_t(title) ||
                            clean_t(result.title) === clean_t(title) ||
                            clean_t(result.title_english) === clean_t(original_title) ||
                            clean_t(result.title_japanese) === clean_t(original_title) ||
                            clean_t(result.title) === clean_t(original_title)
                         )){

                        if(result.url!== null) MAL_url = result.url;
                        if(result.score!== null) MAL_score = result.score;
                        if(result.episodes!== null) episodes_count = result.episodes;
                        if(result.aired.from!== null) start_date = result.aired.from.slice(0,4);

                        resolve([MAL_url, MAL_score, episodes_count, start_date]); return;
                      }
                    }
                    console.log("JIKAN [MAL]: Error, title not found");
                    resolve("error"); return;

                }
            });
        });

    }else if(content==="tv"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.jikan.moe/v4/anime?q='+original_title.replaceAll(" ","%20")+'&page=1&limit=10',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('MAL search api: https://api.jikan.moe/v4/anime?q='+original_title.replaceAll(" ","%20")+'&page=1&limit=10');

                    if (json.data==undefined || json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;

                    }

                    let MAL_url=0, MAL_score=0, episodes_count=0, start_date=0, end_date=0, date_range=0;
                    for(let result of json.data){

                      console.log("[JIKAN en:"+result.title_english+"] - [JIKAN:"+result.title+"] - [TMDB:"+title+"]");

                      if(result.type!==null && result.aired.from!==null &&
                         (parseInt(result.aired.from.slice(0,4))===parseInt(year) || parseInt(result.aired.from.slice(0,4))===parseInt(year)-1 || parseInt(result.aired.from.slice(0,4))===parseInt(year)-2) &&
                         (result.type === "TV" || result.type === "ONA" || result.type === "OVA") &&
                         (  clean_t(result.title_english) === clean_t(title) ||
                            clean_t(result.title_japanese) === clean_t(title) ||
                            clean_t(result.title) === clean_t(title) ||
                            clean_t(result.title_english) === clean_t(original_title) ||
                            clean_t(result.title_japanese) === clean_t(original_title) ||
                            clean_t(result.title) === clean_t(original_title)
                         )){

                        if(result.url!== null) MAL_url = result.url;
                        if(result.score!== null) MAL_score = result.score;
                        if(result.episodes!== null) episodes_count = result.episodes;
                        if(result.aired.from!== null) start_date = result.aired.from.slice(0,4);
                        if(result.aired.to!== null) end_date = result.aired.to.slice(2,4);

                        if(start_date!== 0 && end_date!== 0) date_range = start_date + "-" + end_date

                        resolve([MAL_url, MAL_score, episodes_count, date_range]); return;
                      }
                    }

                    console.log("JIKAN [MAL]: Error, title not found");
                    resolve("error"); return;

                }
            });
        });
    }
}

async function main(){
    let content=0;
    let TMDB_info=0, TMDB_id=0, TMDB_title=0, TMDB_original_title=0, TMDB_year=0, tv_year_range=0, seasons_count=0;
    let IMDB_info, IMDB_id=0, IMDB_score=0, IMDB_votes_number=0,IMDB_awards=0;
    let RT_scraped_info=0, RT_url=0, RT_audience_state=0, RT_audience_score=0, RT_tomatometer_state=0, RT_tomatometer_score=0;
    let LB_scraped_info=0,LB_score=0,LB_users=0;
    let MAL_info=0, MAL_url=0, MAL_score=0, episodecount=0, MAL_year=0, anime_flag=0;
    let MC_info=0, MC_MetaScore=0,MC_Critics=0,MC_UserScore=0,MC_Users=0,MC_url=0,MC_must_see=0;
    let YT_trailer_delta=0;

    //get youtube link
    let YT_button = document.getElementsByClassName("no_click play_trailer")[0];
    if(YT_button!==undefined && YT_button!==null) YT_trailer_delta=YT_button.getAttribute("data-id");
    console.log("Grabbed Youtube Delta: "+YT_trailer_delta);
    //Remove bloats
    $(".tooltip").remove();
    $(".play_trailer").remove();
    $("#vibes_label").remove();
    $(".consensus_reaction_items").remove();

    //Hook per appendere i punteggi dei providers
    let page_score_icon = document.getElementsByClassName("chart");
    let loading_div = document.createElement("div");
    let loading_label = document.createElement("label");
    loading_label.innerText="⏳ Loading Results.."
    loading_label.style.color="firebrick";
    loading_div.style.paddingRight="20px";
    loading_div.append(loading_label);

    page_score_icon[0].after(loading_div);

    //Grab TMDB ID
    if(window.location.href.includes("https://www.themoviedb.org/movie/")){
      content="movie";
      TMDB_id = parseInt(window.location.href.split("https://www.themoviedb.org/movie/")[1].split("-")[0]);
    }else if(window.location.href.includes("https://www.themoviedb.org/tv/")){
      content="tv";
      TMDB_id = parseInt(window.location.href.split("https://www.themoviedb.org/tv/")[1].split("-")[0]);
    }else{return;}

    //Get TMDB title info
    TMDB_info = await TMDB_search_api(TMDB_id,content);
    if(content==="movie"){
      TMDB_title=TMDB_info[0];
      TMDB_original_title=TMDB_info[1];
      TMDB_year=TMDB_info[2];
      IMDB_id=TMDB_info[3];
      if(parseInt(TMDB_info[4])===1)  anime_flag="movie";
    }else if(content==="tv"){
      TMDB_title=TMDB_info[0];
      TMDB_original_title=TMDB_info[1];
      TMDB_year=TMDB_info[2];
      tv_year_range=TMDB_info[3];
      IMDB_id=TMDB_info[4];
      seasons_count=TMDB_info[5];
      if(parseInt(TMDB_info[6])===1)  anime_flag="tv";
    }

    //Get IMDB score
    if(IMDB_id!==0 && IMDB_id!=="error") IMDB_info = await IMDB_info_scrape(IMDB_id);
    if(IMDB_info!=="error" && IMDB_info!==0){
      if(IMDB_info[0]!=0){IMDB_score=IMDB_info[0];}else{IMDB_score="N/A"}
      if(IMDB_info[1]!=0){IMDB_votes_number=IMDB_info[1];}else{IMDB_votes_number="N/A"}
      IMDB_awards=IMDB_info[2];
    }

    //Get RT score
    //if(TMDB_title!==0) RT_url = await RT_search_scrape(TMDB_title,TMDB_year,content);
    console.log(TMDB_title+":"+TMDB_year);
    if(TMDB_title!==0) RT_url= await RT_search_api(TMDB_title,TMDB_year,content);

    if(RT_url!=="error" && RT_url!==0){

      RT_scraped_info = await RT_info_scrape(RT_url);
      RT_tomatometer_score=RT_scraped_info[0]; if(RT_tomatometer_score==0){RT_tomatometer_score="N/A"}
      RT_tomatometer_state=RT_scraped_info[1];
      RT_audience_score=RT_scraped_info[2]; if(RT_audience_score==0){RT_audience_score="N/A"}
      RT_audience_state=RT_scraped_info[3];
    }

    //Get LB score
    if(content==="movie"){

      if(TMDB_title!==0) LB_url= await LB_search_scrape(TMDB_title,TMDB_year);
      if(LB_url!=="error" && LB_url!==0){

        LB_scraped_info = await LB_info_scrape(LB_url);
        LB_score=LB_scraped_info[0]; if(LB_score==0){LB_score="N/A"}
        LB_users=LB_scraped_info[1]; if(LB_users==0){LB_users="N/A"}
      }

    }

    //Get MAL score
    if(TMDB_title!==0 && anime_flag!==0) MAL_info = await JIKAN_search_api(TMDB_title,TMDB_original_title,TMDB_year,content);
    if(MAL_info!=="error" && MAL_info!==0 && anime_flag!==0){
      MAL_url=MAL_info[0];
      MAL_score=parseFloat(MAL_info[1]);
      if(Number.isInteger(MAL_score)){
        MAL_score = String(MAL_score)+".00"
      }else{
        let f_numbers = String(MAL_score).split(".")[1].length;
        if(f_numbers===1) MAL_score=MAL_score+"0";
      }
      episodecount=MAL_info[2];
      MAL_year=MAL_info[3];
    }

    //Get MC score
    //console.log("TMDB_Title:"+TMDB_title+" | TMDB_Original_Title="+TMDB_original_title);
    if(TMDB_title!==0 ) MC_info = await MC_search_scrape(TMDB_title,TMDB_year,content,"");
    if(TMDB_title!==0 && (MC_info=="error" || MC_info==0)) MC_info = await MC_search_scrape(TMDB_title,TMDB_year,content,"META_SCORE");
    if(MC_info!=="error" && MC_info!==0){
      MC_MetaScore=MC_info[0];
      MC_Critics=MC_info[1];
      MC_UserScore=MC_info[2];
      MC_Users=MC_info[3];
      MC_must_see=MC_info[4];
      MC_url=MC_info[5];
      //console.log(MC_MetaScore+"-"+MC_Critics+"-"+MC_UserScore+"-"+MC_Users+"-"+MC_url+"- MustSee="+MC_must_see);
    }

    //Build IMDB label
    let IMDB_image_link = document.createElement("a");
    let IMDB_image = document.createElement("img");
    let IMDB_image_div = document.createElement("div");
    let IMDB_link = document.createElement("a");
    let IMDB_link_div = document.createElement("div");
    let IMDB_label = document.createElement("label");
    let IMDB_div = document.createElement("div");

    if(IMDB_info!=="error" && IMDB_info!==0){
      IMDB_image.src="https://i.postimg.cc/13Vp7gMQ/245px-IMDB-Logo-2016-svg.png"; IMDB_image.style.width="60px";
      IMDB_image_link.href="https://www.imdb.com/title/"+IMDB_id;
      IMDB_image_link.append(IMDB_image);
      IMDB_image_div.append(IMDB_image_link);

      IMDB_link.href="https://www.imdb.com/title/"+IMDB_id+"/ratings"; IMDB_link.innerText=IMDB_score; IMDB_link.style.color="gold"; IMDB_link.style.fontWeight = 'bold';  IMDB_link.style.marginLeft="auto";  IMDB_link.style.marginRight="auto";
      IMDB_label.innerText="("+IMDB_votes_number+")"; IMDB_label.style.fontSize="50%"; IMDB_label.style.color="gold"; IMDB_label.style.paddingLeft="5px";
      IMDB_link_div.append(IMDB_link,IMDB_label);

      IMDB_div.style.marginRight="13px"; IMDB_div.style.marginLeft="15px"; IMDB_div.style.width="60px"
      IMDB_div.append(IMDB_image_div,IMDB_link_div);
    }

    //Build LB label
    let LB_image_link = document.createElement("a");
    let LB_image = document.createElement("img");
    let LB_image_div = document.createElement("div");
    let LB_link = document.createElement("a");
    let LB_link_div = document.createElement("div");
    let LB_label = document.createElement("label");
    let LB_div = document.createElement("div");

    if(LB_scraped_info!=="error" && LB_scraped_info!==0){
      LB_image.src="https://i.postimg.cc/qRWTyVNV/letterbox.png"; LB_image.style.width="69px";LB_image.style.borderRadius = "3px";
      LB_image_link.href=LB_url;
      LB_image_link.append(LB_image);
      LB_image_div.append(LB_image_link);

      LB_link.href=LB_url+"members"; LB_link.innerText=LB_score; LB_link.style.color="deepskyblue"; LB_link.style.fontWeight = 'bold';  LB_link.style.marginLeft="auto";  LB_link.style.marginRight="auto";
      LB_label.innerText="("+LB_users+")"; LB_label.style.fontSize="50%"; LB_label.style.color="deepskyblue"; LB_label.style.paddingLeft="5px";LB_label.style.marginRight="30px";
      LB_link_div.append(LB_link,LB_label);

      LB_div.style.marginRight="28px"; LB_div.style.marginLeft="15px"; LB_div.style.width="60px"
      LB_div.append(LB_image_div,LB_link_div);
    }

    //Build RT label
    let RT_image_link = document.createElement("a");
    let RT_image = document.createElement("img");
    let RT_image_critic = document.createElement("img");
    let RT_image_audience = document.createElement("img");
    let RT_image_div = document.createElement("div");
    let RT_link_critic = document.createElement("a");
    let RT_link_users = document.createElement("a");
    let RT_link_div = document.createElement("div");
    let RT_div = document.createElement("div");

    if(RT_url!=="error" && RT_url!==0){
      if(RT_tomatometer_state==="certified-fresh") {RT_image.src="https://i.postimg.cc/MGvKmRY7/fresh-rotten.png"}else{RT_image.src="https://i.postimg.cc/YtNd2pYn/rotten-tomatoes-new-logo.png";} RT_image.style.borderRadius = "3px";
      RT_image.style.width="69px"; RT_image.style.marginRight="15px"; RT_image.style.marginLeft="5px"; if(RT_tomatometer_score==="100" || RT_audience_score==="100"){ RT_image.style.marginLeft="10px"}
      RT_image_link.href=RT_url;
      RT_image_link.append(RT_image);
      RT_image_div.append(RT_image_link);

      RT_image_critic.style.width= RT_tomatometer_score===0 || RT_tomatometer_score==="N/A" ? "0px" : "12px"; RT_image_critic.style.display="inline"; RT_link_critic.style.paddingRight="5px"; RT_link_critic.style.paddingLeft="5px";
      RT_image_audience.style.width= RT_audience_score===0 || RT_audience_score==="N/A" ? "0px" : "12px"; RT_image_audience.style.display="inline";  RT_link_users.style.paddingRight="5px"; RT_link_users.style.paddingLeft="5px";
      if(RT_tomatometer_state==="fresh") RT_image_critic.src='https://i.postimg.cc/0xxLPX6n/fresh.png';
      if(RT_tomatometer_state==="certified-fresh") RT_image_critic.src='https://i.postimg.cc/FNmmCgXd/certified-fresh.png';
      if(RT_tomatometer_state==="rotten") RT_image_critic.src='https://i.postimg.cc/HW1HgbJN/rotten.png';
      if(RT_audience_state==="upright") RT_image_audience.src='https://i.postimg.cc/b81pRVWf/upright.png';
      if(RT_audience_state==="spilled") RT_image_audience.src='https://i.postimg.cc/2YsChNHx/spilled.png';
      RT_link_critic.href=RT_url+"/reviews";
      RT_link_critic.innerText= RT_tomatometer_score===0 ? "N/A" : RT_tomatometer_score ; RT_link_critic.style.color= RT_tomatometer_score===0 ? "grey" : "white"; RT_link_critic.style.fontWeight="bold";
      RT_link_users.href=RT_url+"/reviews?type=user";
      RT_link_users.innerText= RT_audience_score===0 ? "N/A" : RT_audience_score ; RT_link_users.style.color= RT_audience_score===0 ? "grey" : "white"; RT_link_users.style.fontWeight="bold";
      console.log(RT_image_critic)
        RT_link_div.append(RT_image_critic,RT_link_critic,RT_image_audience,RT_link_users); RT_link_div.style.paddingRight="15px";

      RT_div.append(RT_image_div,RT_link_div);
    }

    //Build MC Label
    let MC_image_link = document.createElement("a");
    let MC_image = document.createElement("img");
    let MC_image_div = document.createElement("div");
    let MC_critics_link = document.createElement("a");
    let MC_critics_label = document.createElement("label");
    let MC_users_link = document.createElement("a");
    let MC_users_label = document.createElement("label");
    let MC_scores_div = document.createElement("div");
    let MC_div = document.createElement("div");

    if(MC_info!==0 && MC_info!=="error"){
      if(MC_must_see===1){MC_image.src="https://i.postimg.cc/QNKCWSTq/mc.png"}else{MC_image.src="https://i.postimg.cc/dtLsHFTJ/mc.png"}
      MC_image.style.width="69px"; MC_image.style.marginLeft="5px"; MC_image.style.borderRadius = "3px";
      MC_image_link.href=MC_url;
      MC_image_link.append(MC_image);
      MC_image_div.append(MC_image_link);

      let compact_critics; if(parseInt(MC_Critics)>1000){compact_critics=String((MC_Critics/1000).toFixed(2)).slice(0,-1) + "k";}else{compact_critics=MC_Critics}
      let compact_users; if(parseInt(MC_Users)>1000){compact_users=String((MC_Users/1000).toFixed(2)).slice(0,-1) + "k";}else{compact_users=MC_Users}
      //critics
      MC_critics_link.innerText=MC_MetaScore; MC_critics_link.href=MC_url+"/critic-reviews"; MC_critics_link.style.fontWeight="bold"; MC_critics_link.style.paddingLeft="4px";
      if(!isNaN(MC_MetaScore) && MC_MetaScore<=39){MC_critics_link.style.color="red"; MC_critics_label.style.color=MC_critics_link.style.color;}
      else if(!isNaN(MC_MetaScore) && MC_MetaScore>=39 && MC_MetaScore<=60){MC_critics_link.style.color="burlywood"; MC_critics_label.style.color=MC_critics_link.style.color;}
      else if(!isNaN(MC_MetaScore) && MC_MetaScore>=61){MC_critics_link.style.color="greenyellow"; MC_critics_label.style.color=MC_critics_link.style.color;}
      else if(isNaN(MC_MetaScore)){MC_critics_link.style.color="grey"; MC_critics_label.style.color=MC_critics_link.style.color;}
      MC_critics_label.innerText=" ("+compact_critics+")"; MC_critics_label.style.fontSize="50%";
      //users
      MC_users_link.innerText=MC_UserScore; MC_users_link.href=MC_url+"/user-reviews"; MC_users_link.style.fontWeight="bold"; MC_users_link.style.paddingLeft="4px";
      if(!isNaN(MC_UserScore) && parseFloat(MC_UserScore)<=3.9){MC_users_link.style.color="red"; MC_users_label.style.color=MC_users_link.style.color;}
      else if(!isNaN(MC_UserScore) && parseFloat(MC_UserScore)>=3.9 && parseFloat(MC_UserScore)<=6.0){MC_users_link.style.color="burlywood"; MC_users_label.style.color=MC_users_link.style.color;}
      else if(!isNaN(MC_UserScore) && parseFloat(MC_UserScore)>=6.1){MC_users_link.style.color="greenyellow"; MC_users_label.style.color=MC_users_link.style.color;}
      else if(isNaN(MC_UserScore)){MC_users_link.style.color="grey"; MC_users_label.style.color=MC_users_link.style.color;}
      MC_users_label.innerText=" ("+compact_users+")"; MC_users_label.style.fontSize="50%";
      MC_scores_div.append(MC_critics_link,MC_critics_label,MC_users_link,MC_users_label);

      MC_div.append(MC_image_div,MC_scores_div); MC_div.style.paddingRight="15px";
    }

    //Build MAL Label
    let MAL_image_link = document.createElement("a");
    let MAL_image = document.createElement("img");
    let MAL_image_div = document.createElement("div");
    let MAL_link = document.createElement("a");
    let MAL_link_div = document.createElement("div");
    let MAL_div = document.createElement("div");

    if(MAL_info!==0 && MAL_info!=="error"){
      MAL_image.src="https://i.postimg.cc/bwPmk7d2/apple-touch-icon-256.png"; MAL_image.style.width="30px"; MAL_image.style.borderRadius = '3px'
      MAL_image_link.href=MAL_url;
      MAL_image_link.append(MAL_image);
      MAL_image_div.append(MAL_image_link); MAL_image_div.style.paddingLeft="5px";

      MAL_link.innerText=MAL_score; MAL_link.href=MAL_url+"/reviews"; MAL_link.style.color="cornflowerblue"; MAL_link.style.fontWeight="bold"; MAL_link.style.paddingLeft="4px";
      MAL_link_div.append(MAL_link);

      MAL_div.append(MAL_image_div,MAL_link_div); MAL_div.style.paddingRight="15px";
    }

    //Build YouTube Label
    let YT_image_link = document.createElement("a");
    let YT_image = document.createElement("img");
    let YT_image_div = document.createElement("div");
    let YT_link = document.createElement("a");
    let YT_link_div = document.createElement("div");
    let YT_div = document.createElement("div");
    if(TMDB_title!==0){
      YT_image.src="https://i.postimg.cc/CKGRZxLF/youtube-PNG102349.png"; YT_image.style.width="46px"; YT_image.style.paddingBottom="18px"; YT_image.style.borderRadius = '3px';
      if(YT_trailer_delta!==0 && YT_trailer_delta!==null && YT_trailer_delta!==undefined) {
        YT_image_link.href="https://www.youtube.com/watch?v="+YT_trailer_delta;
      }else{
        YT_image_link.href="https://www.youtube.com/results?search_query="+TMDB_title+" trailer";
      }
      YT_image_link.append(YT_image);
      YT_image_div.append(YT_image_link);

      //YT_link.innerText="Trailer"; YT_link.href=YT_image_link.href; YT_link.style.color="red"; YT_link.style.fontSize="80%"; YT_link.style.marginLeft="4px";
      //YT_link_div.append(YT_link);

      YT_div.append(YT_image_div); YT_div.style.paddingRight="15px";
    }

    //Build Wikipedia Label
    let WP_image_link = document.createElement("a");
    let WP_image = document.createElement("img");
    let WP_image_div = document.createElement("div");
    let WP_link = document.createElement("a");
    let WP_link_div = document.createElement("div");
    let WP_div = document.createElement("div");
    if(TMDB_title!==0){
      WP_image.src="https://i.postimg.cc/C5nzTd6y/wiki.png"; WP_image.style.width="46px"; WP_image.style.paddingBottom="18px"; WP_image.style.borderRadius = '3px';
      WP_image_link.href="https://en.wikipedia.org/w/index.php?search="+TMDB_title;
      WP_image_link.append(WP_image);
      WP_image_div.append(WP_image_link);

      //YT_link.innerText="Trailer"; YT_link.href=YT_image_link.href; YT_link.style.color="red"; YT_link.style.fontSize="80%"; YT_link.style.marginLeft="4px";
      //YT_link_div.append(YT_link);

      WP_div.append(WP_image_div);
    }


    //Build Oscars Label
    let AWARDS_image = document.createElement("img");
    let AWARDS_link = document.createElement("a");
    let AWARDS_div = document.createElement("div");
    if(IMDB_awards!==0){
      AWARDS_image.src="https://i.postimg.cc/bvtXCJcS/5131089.png"; AWARDS_image.style.width="28px";AWARDS_image.style.display="inline";
      AWARDS_link.innerText=IMDB_awards; AWARDS_link.href="https://www.imdb.com/title/"+IMDB_id+"/awards/"; AWARDS_link.style.fontSize="90%"; AWARDS_link.style.paddingLeft="5px";
      AWARDS_div.append(AWARDS_image,AWARDS_link); AWARDS_div.style.paddingTop="25px";
    }

    //Build Original Title
    let OT_header = document.createElement("h3");
    if(TMDB_original_title!==0){
        OT_header.innerText=TMDB_original_title;
        let title_hook=document.getElementsByClassName("title ott_true")[0];
        if(title_hook!==undefined) {
          let h2_hook = title_hook.getElementsByTagName("h2")[0];
          if(h2_hook!==undefined) h2_hook.after(OT_header);
        }
    }

    //Remove Loading
    page_score_icon[0].nextSibling.remove();

    //Append SCORES
    if(anime_flag!==0) page_score_icon[0].after(IMDB_div,LB_div,RT_div,MC_div,MAL_div,WP_div,YT_div); else page_score_icon[0].after(IMDB_div,LB_div,RT_div,MC_div,WP_div,YT_div);

    //Append AWARDS
    let top_bar = document.getElementsByClassName("auto actions");
    if(IMDB_awards!==0) top_bar[0].after(AWARDS_div);

    //set runtime color
    let runtime_div= document.querySelectorAll(".facts")[0].querySelectorAll(".runtime")[0];
    if(runtime_div!== undefined) runtime_div.style.color="orange";

}

main();