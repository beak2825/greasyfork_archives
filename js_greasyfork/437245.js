// ==UserScript==
// @name        ICV Tagger
// @description ICV posts with IMDB, rottentomatoes
// @author      SH3LL
// @version     0.5.4
// @match       https://www.icv-crew.com/forum/index.php?*
// @grant       none
// @run-at      document-idle
// @grant        GM_xmlhttpRequest
// @license	GPL3
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/437245/ICV%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/437245/ICV%20Tagger.meta.js
// ==/UserScript==


function TMDB_search_api(title, year, content) {

    if (content==="movie" || content==="movie_cartoon" || content==="movie_anime"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/search/movie?api_key=8d6d91941230817f7807d643736e8a49&query='+ title +'&page=1&include_adult=false',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB search api: https://api.themoviedb.org/3/search/movie?api_key=8d6d91941230817f7807d643736e8a49&query='+ title +'&page=1&include_adult=false');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    if (parseInt(json.total_results) !== 0){
                      for(let result of json.results){
                        if(result.release_date === undefined) continue;

                        // animation check
                        let animation_flag=0;
                        if(content==="movie_cartoon" || content==="movie_anime"){
                          for(let curr_genre of result.genre_ids) {if(parseInt(curr_genre)===16) {animation_flag=1; continue;}}
                        }
                        if((content==="movie_cartoon" || content==="movie_anime") && animation_flag!==1) continue;

                        //send result
                        if( parseInt(result.release_date.slice(0,4)) === parseInt(year) || parseInt(result.release_date.slice(0,4)) === parseInt(year) - 1 || parseInt(result.release_date.slice(0,4)) === parseInt(year) + 1){ // FIX exported EU MOVIES & TMDB errors
                          resolve(result.id); return;
                        }
                      }
                    }else{
                      console.log("Error: query returned no results");
                      resolve("error"); return;
                    }
                    //if no year is found
                    console.log("Error: no result matched the year");
                    resolve("error"); return;

                }
            });
        });

    }else if(content==="tv" || content==="tv_cartoon" || content==="tv_anime"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/search/tv?api_key=8d6d91941230817f7807d643736e8a49&query='+ title +'&page=1&include_adult=false',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB search api: https://api.themoviedb.org/3/search/tv?api_key=8d6d91941230817f7807d643736e8a49&query='+ title +'&page=1&include_adult=false');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                  if (parseInt(json.total_results) !== 0){
                      let first_entry = json.results[0];
                      resolve(first_entry.id); return;

                  }else{
                      console.log("Error: query returned no results");
                      resolve("error"); return;
                  }

                }
            });
        });
    }
}

function TMDB_title_api(TMDB_id,content,country) {

    if (content==="movie" || content==="movie_cartoon" || content==="movie_anime"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/movie/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language=it&append_to_response=external_ids,videos',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB title api: https://api.themoviedb.org/3/movie/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language=it&append_to_response=external_ids,videos');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let YT_trailer_url_delta=0,IMDB_id=0,TMDB_title=0,TMDB_year=0,TMDB_poster_delta=0;

                    if(content.includes("anime")) {TMDB_title = json.title;} else {TMDB_title = json.original_title;} //title
                    if(json.external_ids!==undefined && json.external_ids.imdb_id!== null) IMDB_id = json.external_ids.imdb_id; //imdb id
                    if(json.release_date!==null && json.release_date!==undefined) TMDB_year=json.release_date.slice(0,4);
                    if(json.poster_path!==null) TMDB_poster_delta = json.poster_path; //poster
                    if(json.videos!==undefined && json.videos.results.length!==0) YT_trailer_url_delta = json.videos.results[0].key; //videos

                    resolve([IMDB_id,TMDB_title,TMDB_year,TMDB_poster_delta,YT_trailer_url_delta]); return;

                }
            });
        });

    }else if(content==="tv" || content==="tv_cartoon" || content==="tv_anime"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/tv/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language='+country+'&append_to_response=external_ids,videos',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB title api: https://api.themoviedb.org/3/tv/'+TMDB_id+'?api_key=8d6d91941230817f7807d643736e8a49&language='+country+'&append_to_response=external_ids,videos');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let YT_trailer_url_delta=0,IMDB_id=0,TMDB_title=0,TMDB_poster_delta=0,seasonscount=0;

                    if(content.includes("anime")) {TMDB_title = json.name;} else {TMDB_title = json.original_name;} //title
                    if(json.external_ids!==undefined && json.external_ids.imdb_id!== null) IMDB_id = json.external_ids.imdb_id; //imdb id
                    if(json.poster_path!==null) TMDB_poster_delta = json.poster_path; //poster
                    if(json.videos!==undefined && json.videos.results.length!==0) YT_trailer_url_delta = json.videos.results[0].key; //videos
                    if(json.seasons!==undefined && json.seasons!== null) seasonscount = (json.seasons).length;

                    //years range
                    let first_year="N/A",last_year="N/A",years_range;
                    if(json.first_air_date!==undefined && json.first_air_date!==null) first_year = json.first_air_date.slice(0,4);
                    if(json.last_air_date!==undefined && json.last_air_date!==null) {
                      if(json.last_air_date.slice(2,4) !== first_year.slice(2,4)) last_year = json.last_air_date.slice(2,4);
                    }

                    if(last_year !=="N/A") years_range=first_year + "-" + last_year; else years_range=first_year;

                    resolve([IMDB_id,TMDB_title,first_year,TMDB_poster_delta,YT_trailer_url_delta,seasonscount,years_range]); return;

                }
            });
        });
    }
}

function TMDB_providers_api(id,my_country,content) {

    if (content==="movie" || content==="movie_cartoon" || content==="movie_anime"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/movie/'+ id +'/watch/providers?api_key=8d6d91941230817f7807d643736e8a49',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB provder api: https://api.themoviedb.org/3/movie/'+ id +'/watch/providers?api_key=8d6d91941230817f7807d643736e8a49');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let providers = [];
                    for(let curr_country in json.results){
                      if(String(curr_country)===my_country && json.results[curr_country].flatrate !== undefined){
                        for(let provider of json.results[curr_country].flatrate){
                          providers.push(
                            {
                              "provider_name" : provider.provider_name,
                              "provider_logo" : provider.logo_path
                            }
                          );
                        }
                      }
                    }
                    if(providers.length !== 0 ){
                      resolve(providers); return;
                    }else{resolve("error"); return}

                }
            });
        });

    }else if(content==="tv" || content==="tv_cartoon" || content==="tv_anime"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.themoviedb.org/3/tv/'+ id +'/watch/providers?api_key=8d6d91941230817f7807d643736e8a49',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('TMDB provder api: https://api.themoviedb.org/3/tv/'+ id +'/watch/providers?api_key=8d6d91941230817f7807d643736e8a49');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let providers = [];
                    for(let curr_country in json.results){
                      if(String(curr_country)===my_country && json.results[curr_country].flatrate !== undefined){
                        for(let provider of json.results[curr_country].flatrate){
                          providers.push(
                            {
                              "provider_name" : provider.provider_name,
                              "provider_logo" : provider.logo_path
                            }
                          );
                        }
                      }
                    }
                    if(providers.length !== 0 ){
                      resolve(providers); return;
                    }else{resolve("error"); return}
                }
            });
        });
    }
}

function OMDB_title_api(IMDB_id,content) {

    if (content==="movie" || content==="movie_cartoon" || content==="movie_anime"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://www.omdbapi.com/?apikey=75251a35&type=movie&i='+IMDB_id,
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('OMDB title api: https://www.omdbapi.com/?apikey=75251a35&type=movie&i='+IMDB_id);

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let IMDB_rating=0, IMDB_title=json.Title, IMDB_year = json.Year.slice(0,4), Awards=0;
                    for(let rating of json.Ratings){
                      if(rating.Source==="Internet Movie Database") IMDB_rating= rating.Value;
                    }
                    if(json.Awards !== "N/A" && json.Awards !== undefined) Awards = json.Awards;
                    resolve([IMDB_title,IMDB_year,IMDB_rating,Awards]); return;

                }
            });
        });

    }else if(content==="tv"|| content==="tv_cartoon" || content==="tv_anime"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://www.omdbapi.com/?apikey=75251a35&type=series&i='+IMDB_id,
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('OMDB title api: https://www.omdbapi.com/?apikey=75251a35&type=series&i='+IMDB_id);

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let IMDB_rating=0, IMDB_title=json.Title, IMDB_year = json.Year.slice(0,4), Awards=0;
                    for(let rating of json.Ratings){
                      if(rating.Source==="Internet Movie Database") IMDB_rating= rating.Value;
                    }
                    if(json.Awards !== "N/A" && json.Awards !== undefined) Awards = json.Awards;
                    resolve([IMDB_title,IMDB_year,IMDB_rating,Awards]); return;

                }
            });
        });
    }
}

function JIKAN_search_api(title,year,content) {

    title=title.replaceAll(" ","%20"); // <---
    if (content==="movie_anime"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.jikan.moe/v3/search/anime?q='+title+'&page=1',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('MAL search api: https://api.jikan.moe/v3/search/anime?q='+title+'&page=1');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let MAL_url=0, MAL_title_name=0, MAL_score=0, MAL_image_url=0, content_type=0, episodes_count=0, start_date=0;
                    for(let result of json.results){
                      if(result.type!==null && result.start_date!==null &&
                         (parseInt(result.start_date.slice(0,4))===parseInt(year) || parseInt(result.start_date.slice(0,4))===parseInt(year)-1 || parseInt(result.start_date.slice(0,4))===parseInt(year)-2) &&
                         (result.type === "Movie" /*TV*/ || result.type === "ONA" || result.type === "OVA")){

                        if(result.url!== null) MAL_url = result.url;
                        if(result.title!== null) MAL_title_name = result.title;
                        if(result.score!== null) MAL_score = result.score;
                        if(result.image_url!== null) MAL_image_url = result.image_url;
                        if(result.type!== null) content_type = result.type;
                        if(result.episodes!== null) episodes_count = result.episodes;
                        if(result.start_date!== null) start_date = result.start_date.slice(0,4);

                        resolve([MAL_url, MAL_title_name, MAL_score, MAL_image_url, content_type, episodes_count, start_date]); return;
                      }
                    }

                    console.log("JIKAN [MAL]: Error, title not found");
                    resolve("error"); return;


                }
            });
        });

    }else if(content==="tv_anime"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://api.jikan.moe/v3/search/anime?q='+title+'&page=1',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('MAL search api: https://api.jikan.moe/v3/search/anime?q='+title+'&page=1&limit=10');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    let MAL_url=0, MAL_title_name=0, MAL_score=0, MAL_image_url=0, content_type=0, episodes_count=0, start_date=0, end_date=0, date_range=0;
                    for(let result of json.results){
                      if(result.type!==null && result.start_date!==null &&
                         (parseInt(result.start_date.slice(0,4))===parseInt(year) || parseInt(result.start_date.slice(0,4))===parseInt(year)-1 || parseInt(result.start_date.slice(0,4))===parseInt(year)-2) &&
                         (result.type === "TV" || result.type === "ONA" || result.type === "OVA")){

                        if(result.url!== null) MAL_url = result.url;
                        if(result.title!== null) MAL_title_name = result.title;
                        if(result.score!== null) MAL_score = result.score;
                        if(result.image_url!== null) MAL_image_url = result.image_url;
                        if(result.type!== null) content_type = result.type;
                        if(result.episodes!== null) episodes_count = result.episodes;
                        if(result.start_date!== null) start_date = result.start_date.slice(0,4);
                        if(result.end_date!== null) end_date = result.end_date.slice(2,4);

                        if(start_date!== 0 && end_date!== 0) date_range = start_date + "-" + end_date

                        resolve([MAL_url, MAL_title_name, MAL_score, MAL_image_url, content_type, episodes_count, date_range]); return;
                      }
                    }

                    console.log("JIKAN [MAL]: Error, title not found");
                    resolve("error"); return;


                }
            });
        });
    }
}


function RT_search_api(title,year,content) {

    title = title.replaceAll(".","").replaceAll(",","").replaceAll("&","").replaceAll("-","").replaceAll(":","");
    title = title.replaceAll(/Parte \d+/gm,"").replaceAll(/Part \d+/gm,"").replaceAll("The Movie","").replaceAll("Il film","").replaceAll("Il Film","");
    title = title.replace(/\s\s+/g, ' ').trim().replaceAll(" ", "%20");

    if (content==="movie" || content==="movie_cartoon" || content==="movie_anime"){
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://www.rottentomatoes.com/api/private/v2.0/search/?limit=100&q='+ title +'&t=movie',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('RT search api: https://www.rottentomatoes.com/api/private/v2.0/search/?limit=100&q='+ title +'&t=movie');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    if(json.movieCount === 0){
                      console.log("Error: No movies found in RT");
                      resolve("error"); return;
                    }

                    let fresh_certificate=0, meterscore = 0, url=0;
                    for(let movie of json.movies){
                      if(parseInt(movie.year) === parseInt(year) || parseInt(movie.year) === parseInt(year)+1|| parseInt(movie.year) === parseInt(year) +2 || parseInt(movie.year) === parseInt(year)-1){ //fix rotten tomatoes errors
                        if(movie.meterClass === "fresh" || movie.meterClass === "certified_fresh") fresh_certificate='fresh';
                        if(movie.meterClass === "rotten") fresh_certificate='rotten';
                        if(movie.meterScore !== "N/A" && movie.meterScore !== undefined) meterscore=movie.meterScore;
                        url=movie.url;
                        break;
                      }
                    }

                   if(url!==0) {resolve([url,meterscore,fresh_certificate]); return;} else{resolve("error"); return;}
                }
            });
        });

    }else if(content==="tv" || content==="tv_cartoon" || content==="tv_anime"){
      return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                responseType: 'json',
                synchronous: false,
                url: 'https://www.rottentomatoes.com/api/private/v2.0/search/?limit=100&q='+ title +'&t=tvSeries',
                onload: (resp) => {

                    let json = JSON.parse(resp.responseText);
                    console.log('RT search api: https://www.rottentomatoes.com/api/private/v2.0/search/?limit=100&q='+ title +'&t=tvSeries');

                    if (json && json.Error) {
                      console.log("Error: " + json.Error);
                      resolve("error"); return;
                    }

                    if(json.tvCount === 0){
                     console.log("Error: No series found in RT");
                      resolve("error"); return;
                    }

                    let fresh_certificate=0, meterscore = 0, url=0;
                    for(let title of json.tvSeries){
                      if(parseInt(title.startYear) === parseInt(year) || parseInt(title.startYear) === parseInt(year) +1 || parseInt(title.startYear) === parseInt(year) +2 || parseInt(title.startYear) === parseInt(year)-1){ //fix rotten tomatoes errors
                        if(title.meterClass === "fresh" || title.meterClass === "certified_fresh") fresh_certificate='fresh';
                        if(title.meterClass === "rotten") fresh_certificate='rotten';
                        if(title.meterScore !== "N/A" && title.meterScore !== undefined) meterscore=title.meterScore;
                        url=title.url;
                        break;
                      }
                    }

                   if(url!==0) {resolve([url,meterscore,fresh_certificate]); return;} else{resolve("error"); return;}
                }
            });
        });
    }
}

function clean_title(title,content){ //clean special characters
        return new Promise(function (resolve, reject) {
              if(title!=="" && title!==undefined){
                let new_title,new_year;

                //clean
                title=title.replaceAll("&", " ");
                title=title.replaceAll(":", " ");
                title=title.replaceAll(",", " ");
                title=title.replaceAll(".", " ");
                title=title.replaceAll(";", " ");
                title=title.replaceAll("–", "-");
                title=title.replaceAll(" 01 ", " 1 ");
                title=title.replaceAll(" 02 ", " 2 ");
                title=title.replaceAll(" 03 ", " 3 ");
                title=title.replaceAll(" 04 ", " 4 ");
                title=title.replaceAll(" 05 ", " 5 ");
                title=title.replaceAll(" 06 ", " 6 ");
                title=title.replaceAll(" 07 ", " 7 ");
                title=title.replaceAll(" 08 ", " 8 ");
                title=title.replaceAll(" 09 ", " 9 ");
                title=title.replaceAll("Extended", " ");
                title=title.replaceAll("EXTENDED", " ");
                title=title.replaceAll("Director Cut", " ");
                title=title.replaceAll("Director's Cut", " ");
                title=title.replaceAll("The Movie", " ");
                title=title.replaceAll("the movie", " ");
                title=title.replaceAll("The movie", " ");
                title=title.replaceAll("the Movie", " ");
                title=title.replaceAll("THE MOVIE", " ");
                title=title.replaceAll("MOVIE", " ");
                title=title.replaceAll("Movie", " ");
                title=title.replaceAll("il film", " ");
                title=title.replaceAll("Il film", " ");
                title=title.replaceAll("il Film", " ");
                title=title.replaceAll("Il Film", " ");
                title=title.replaceAll("film", " ");
                title=title.replaceAll("Film", " ");
                title=title.replaceAll("FILM", " ");
                title=title.replaceAll("ep", " ");
                title=title.replaceAll("Ep", " ");
                title=title.replaceAll("EP", " ");

                //splitting
                if(content==="movie" || content==="movie_cartoon" || content==="movie_anime"){
                  new_title=title.split("(")[0].trim();
                  //if there is "[SOMETHING]"
                  if(new_title.includes("[")) new_title=title.split("[")[0].trim();

                  new_year=title.split("(")[1].slice(0, 4);
                  //if there is a bracket before the year bracket
                  if(isNaN(new_year)){
                    new_year=parseInt(title.split("(")[2].slice(0, 4));
                  }


                  if(new_title.includes("-") && !content.includes("anime")) new_title = new_title.split("-")[0]; //double title problem (for movies, not anime)
                  if(new_title.includes("-") && content.includes("anime")) new_title=new_title.replaceAll("-", " "); //dash in the anime title (for anime movies)

                }else if(content==="tv"|| content==="tv_cartoon" || content==="tv_anime"){
                  new_title=title.split("(")[0].trim();
                  if(title.includes("(")) new_year=parseInt(title.split("(")[1].slice(0, 4));

                  //if there is a bracket before the year bracket
                  if(isNaN(new_year) && title.includes("(")){
                    if(isNaN(title.split("(")[2])){resolve("Error, title clened was empty"); return;}
                    new_year=parseInt(title.split("(")[2].slice(0, 4));
                  }
                  if(new_title.includes("-")) new_title = new_title.split("-")[0]; //double title problem
                }


                new_title=new_title.replace(/\s\s+/g, ' ').trim().replaceAll(" ", "%20"); //remove multiple espaces and encode all remaining spaces

                resolve([new_title,new_year]); return;
              }else{resolve("Error, title clened was empty"); return;}
        })
}

async function main(){
    //data variables
    let content=0, thread_title_year=0, country = "IT";
    let TMDB_info=0,TMDB_id=0, TMDB_title=0,TMDB_providers=0, TMDB_year=0, YT_trailer_url=0, Seasonscount=0;
    let OMDB_info=0, IMDB_id=0, IMDB_title=0,IMDB_year=0,IMDB_rating=0, Awards=0;;
    let RT_info=0, RT_rating=0, RT_cert=0, RT_url_delta=0;
    let MAL_info=0, MAL_url=0, MAL_title_name=0, MAL_score=0, MAL_image_url=0, MAL_content_type=0, MAL_episodes_count=0, MAL_date=0;

    //content tagging
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=74.")) {content="movie";} //se siamo in FilmHD H265
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=9.")) {content="movie";} //se siamo in FilmHD H264
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=102.")) {content="tv";} //se siamo in Serie H264
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=161.")) {content="tv";} //se siamo in Serie H265
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=17.")) {content="movie_cartoon";} //se siamo in Movie Cartoon
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=18.")) {content="tv_cartoon";} //se siamo in Serie Cartoon
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=15.")) {content="movie_anime";} //se siamo in Movie Anime
    if(window.location.href.includes("https://www.icv-crew.com/forum/index.php?board=16.")) {content="tv_anime";} //se siamo in Serie Anime
    let threads = document.getElementsByClassName("subject windowbg2");
    //loop titles
    for (let thread of threads){
      console.log(1)
      //Link & Label variables
      let TMDB_link = document.createElement("a"), IMDB_link = document.createElement("a"), RT_link = document.createElement("a"), AWARDS_link = document.createElement("a"), Seasons_label = document.createElement("label"), MAL_link= document.createElement("a"), YT_link = document.createElement("a");
      TMDB_link.style.marginRight = '4px'; IMDB_link.style.marginLeft = '4px';  RT_link.style.marginLeft = '4px', AWARDS_link.style.marginLeft="4px", YT_link.style.marginRight = "4px",  MAL_link.style.marginLeft = "4px", Seasons_label.style.marginLeft = "4px";
      TMDB_link.style.color = 'deepskyblue'; IMDB_link.style.color = 'gold';  RT_link.style.color = 'orangered', AWARDS_link.style.color="goldenrod", AWARDS_link.style.fontSize = "70%",  MAL_link.style.color="royalblue", Seasons_label.style.color = "salmon";
      //Images variables
      let TMDB_img = document.createElement('img'),IMDB_img = document.createElement('img'), RT_img = document.createElement('img'), RT_fresh_img = document.createElement('img'), RT_rotten_img = document.createElement('img'), AWARDS_img=document.createElement('img'), MAL_img=document.createElement('img'), YT_img=document.createElement('img'), POSTER_img=document.createElement('img');
      IMDB_img.style.marginLeft = '8px'; MAL_img.style.marginLeft = '8px';MAL_img.style.borderRadius = '3px'; IMDB_img.style.borderRadius = '3px'; RT_img.style.marginLeft = '8px'; RT_rotten_img.style.marginLeft = '8px'; RT_fresh_img.style.marginLeft = '8px'; AWARDS_img.style.marginLeft = '8px';
      AWARDS_img.style.height='16px'; AWARDS_img.style.width='16px'; RT_img.style.height='16px'; RT_img.style.width='16px'; RT_fresh_img.style.height='16px'; RT_fresh_img.style.width='16px'; RT_rotten_img.style.height='16px'; RT_rotten_img.style.width='16px'; POSTER_img.style.width = '46px'; POSTER_img.style.height = '69px';
      TMDB_img.src= 'https://www.google.com/s2/favicons?domain=www.themoviedb.org';
      IMDB_img.src= 'https://www.google.com/s2/favicons?domain=www.imdb.com';
      RT_img.src= 'https://i.postimg.cc/RCkVnKrp/rotten-tomatoes-rating-icons-1.png'; RT_fresh_img.src= 'https://i.postimg.cc/T1RcJQfC/fresh.png'; RT_rotten_img.src= 'https://i.postimg.cc/fbq3rKc8/rotten.png';
      MAL_img.src= 'https://www.google.com/s2/favicons?domain=myanimelist.net';
      AWARDS_img.src = 'https://i.postimg.cc/bNZkqQx6/Oscars-logo.png';
      YT_img.src = 'https://www.google.com/s2/favicons?domain=www.youtube.com';

      //get title from thread
      let thread_full_label=thread.children[0].children[0].children[0].innerText;
      thread_title_year = await clean_title(thread_full_label,content);
      let thread_title=thread_title_year[0], thread_year=thread_title_year[1];
      console.log([thread_title.replaceAll("%20", " "), thread_year]);

      //get imdb ID & tmdb score from TMDB api
      TMDB_id = await TMDB_search_api(thread_title, thread_year,content);
      console.log('TMDB id: ' + TMDB_id);
      if(TMDB_id!=="error"){
        // TMDB title info
        TMDB_info = await TMDB_title_api(TMDB_id,content,country);
        if(TMDB_info!=="error") IMDB_id = TMDB_info[0];
        if(TMDB_info!=="error" && TMDB_info[1]!==0) TMDB_title = TMDB_info[1];
        if(TMDB_info!=="error" && TMDB_info[2]!==0) TMDB_year = TMDB_info[2];
        if(TMDB_info!=="error" && TMDB_info[3]!==0) POSTER_img.src= 'https://image.tmdb.org/t/p/w185' + TMDB_info[3];
        if(TMDB_info!=="error" && TMDB_info[4]!==0 && TMDB_info[4]!==0){ YT_trailer_url = " https://www.youtube.com/watch?v=" + TMDB_info[4]; }else {YT_trailer_url= 'https://www.youtube.com/results?search_query=' + TMDB_title + ' trailer ita';}
        if(content==="tv" && TMDB_info[5]!==0 && TMDB_info[6]!==0) Seasonscount= "{" + TMDB_info[6] +"}{S"+ TMDB_info[5]+"}";
        console.log('IMDB id: ' + IMDB_id);

        // TMDB proviers list
        TMDB_providers = await TMDB_providers_api(TMDB_id,country,content);
      }else{console.log("Skipping for error: " + thread_title.replaceAll("%20"," ") + " (" + thread_year + ")") ;}


      if(TMDB_id !== 'error' && TMDB_id!==0){

        //get IMDB title, rating, awards
        OMDB_info = await OMDB_title_api(IMDB_id,content);
        if(OMDB_info !== 'error'){
           IMDB_title = OMDB_info[0].replaceAll(" ", "%20");
           IMDB_year = OMDB_info[1];
           IMDB_rating = OMDB_info[2];
           //build awards string
           let awards_string = String(OMDB_info[3]).replaceAll("total","").trim();
           if (awards_string[awards_string.length-1]===".") awards_string=awards_string.substring(0, awards_string.length-1); // remove final dot from awards string
           if(OMDB_info[3]!==0) Awards = "(" + awards_string + ")";
        }

        //get RT url, score, certificate
        //RT_info = await RT_search_api(TMDB_title,TMDB_year,content);
        if(RT_info !== 'error' && RT_info!==0){
           RT_url_delta = RT_info[0];
           RT_rating = RT_info[1];
           RT_cert = RT_info[2];
        }
        console.log('IMDB score: ' + IMDB_rating + ' | RT score: '+RT_rating + ' (' + RT_cert +') | Awards: '+ Awards);

        //get MAL url, score, certificate
        /*
        if(content.includes("anime")) MAL_info = await JIKAN_search_api(IMDB_title,TMDB_year,content);
        if(MAL_info !== 'error' && MAL_info!==0){
           MAL_url=MAL_info[0];
           MAL_title_name=MAL_info[1];
           MAL_score=MAL_info[2];
           MAL_image_url=MAL_info[3];
           MAL_content_type=MAL_info[4];
           MAL_episodes_count=MAL_info[5];
           MAL_date=MAL_info[6];
        }
        console.log('MAL url: ' + MAL_url + ' | MAL score: '+ MAL_score );
        */
        //Poster image
        if(TMDB_id !==0 && TMDB_id!=="error"){
          thread.parentNode.children[1].removeChild(thread.parentNode.children[1].children[0]);
          if(POSTER_img.src !== ""){
            thread.parentNode.children[1].append(POSTER_img);
          }else{
            let label_img = document.createElement('label');
            label_img.innerText = "Missing";
            label_img.style.color = "firebrick"
            thread.parentNode.children[1].append(label_img);
          }
        }
        //YT Link
        if(TMDB_title !==0){
          YT_link.href = YT_trailer_url;
          YT_link.append(YT_img);
          thread.children[0].children[0].before(YT_link);
        }
        //TMDB Link
        if(TMDB_id !==0 && TMDB_id!=="error"){
          if(content==="movie" || content==="movie_cartoon"|| content==="movie_anime") TMDB_link.href = 'https://www.themoviedb.org/movie/' + TMDB_id;
          if(content==="tv" || content==="tv_cartoon"|| content==="serie_anime") TMDB_link.href = 'https://www.themoviedb.org/tv/' + TMDB_id;
          TMDB_link.append(TMDB_img);
          thread.children[0].children[1].before(TMDB_link);
        }
        //Season Count
        if(content==="tv" && Seasonscount!==0){
          Seasons_label.innerText=Seasonscount;
          thread.children[0].children[2].append(Seasons_label);
        }
        //IMDB Link
        if(OMDB_info!=='error' && OMDB_info!==0){
          if(IMDB_rating!==0) {IMDB_link.innerText = IMDB_rating.substring(0, IMDB_rating.length - 3);} else {IMDB_link.innerText="N/A"}
          IMDB_link.href = `https://www.imdb.com/title/${IMDB_id}/`;
          thread.children[0].children[2].append(IMDB_img,IMDB_link);
        }
        //MAL Link
        /*
        if(MAL_info!=='error' && MAL_info!==0){
          if(MAL_score!==0) {MAL_link.innerText = MAL_score;} else {MAL_link.innerText="N/A"}
          MAL_link.href = MAL_url;
          thread.children[0].children[2].append(MAL_img, MAL_link);
        }*/
        //RT Link
        if(RT_info!=='error' && RT_info!==0){
          if(RT_rating!==0) {RT_link.innerText = RT_rating;} else {RT_link.innerText ="N/A";}
          RT_link.href = `https://www.rottentomatoes.com${RT_url_delta}/`;
          if(RT_cert===0) {thread.children[0].children[2].append(RT_img,RT_link);}
          if(RT_cert==='fresh') {thread.children[0].children[2].append(RT_fresh_img,RT_link);}
          if(RT_cert==='rotten') {RT_link.style.color="yellowgreen"; thread.children[0].children[2].append(RT_rotten_img,RT_link);}
        }
        //Awards
        if(Awards!==0){
          AWARDS_link.innerText = Awards;
          AWARDS_link.href = "https://www.imdb.com/title/"+IMDB_id+"/awards/"
          thread.children[0].children[2].append(AWARDS_img,AWARDS_link);
        }
        //providers
        if(TMDB_providers !== "error"){
          let div = document.createElement('div');

          let streaming_link = document.createElement('a');
          if(content==="movie" || content==="movie_cartoon"|| content==="movie_anime") streaming_link.href="https://www.themoviedb.org/movie/"+ TMDB_id+"/watch?locale="+country;
          if(content==="tv" || content==="tv_cartoon"|| content==="serie_anime") streaming_link.href="https://www.themoviedb.org/tv/"+ TMDB_id+"/watch?locale="+country
          streaming_link.innerText = "Streaming:"
          streaming_link.style.color = "salmon";
          div.append(streaming_link);

          for(let provider of TMDB_providers){
            let provider_image = document.createElement('img');
            provider_image.style.height='16px';
            provider_image.style.width='16px';
            provider_image.style.marginLeft = '8px';
            provider_image.style.marginTop = '4px';
            //provider_image.style.marginBottom = '8px';
            provider_image.style.borderRadius = '3px';
            provider_image.src = 'https://image.tmdb.org/t/p/w185/' + provider["provider_logo"];
            div.append(provider_image);
          }
          thread.children[0].children[2].after(div);
        }


      }else{ //if no content found in TMDB
        let error_message = document.createElement("label");
        error_message.style.color="firebrick";
        error_message.style.marginLeft = '4px';
        error_message.innerText = "ERR: Title Misspelled/Not Found"
        thread.children[0].children[0].append(error_message);
      }

      //reset all data
      thread_title_year=0; OMDB_info=0; RT_info=0; TMDB_id=0; IMDB_id=0; IMDB_title=0; IMDB_year=0; RT_url_delta=0; IMDB_rating=0; RT_rating=0; RT_cert=0; Awards=0, Seasonscount=0;
    }



}

main();