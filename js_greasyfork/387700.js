// ==UserScript==
// @name         MediaFetchAPI
// @namespace    https://greasyfork.org/users/152136
// @version      0.1
// @description  Media Database API
// @author       TYT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://unpkg.com/number-to-chinese-words@^1.0/number-to-chinese-words.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==
/* globals $ */
(function() {
  'use strict';
  class MediaFetchAPI {
    constructor(){
      console.log(window);
      this.converter = window.index.NumberToChineseWords;
      this.converter.labels = Object.assign(this.converter.labels, {
        digits : ['零','一', '二', '三', '四', '五', '六', '七', '八', '九'],
        units: ['','十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千', '京', '十', '百', '千', '垓']
      });
      this.doubanAPIKeyB64 = 'MGIyYmRlZGE0M2I1Njg4OTIxODM5YzhlY2IyMDM5OWI=';
      this.timeOut = 1e4;
    }
    errorStatus(reject){
      return {
        ontimeout: ()=>{
          reject({
            status: 440,
            statusText: 'Time Out'
          })
        },
        onerror: ()=>{
          reject({
            status: 441,
            statusText: 'Request Error'
          })
        },
        onabort: ()=>{
          reject({
            status: 442,
            statusText: 'Abort'
          })
        }
      }
    };
    url2Blob(url){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: url,
          timeout: 10000,
          responseType: 'blob',
          onload: (res)=>{
            resolve(res.response);
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    blob2DataURL(blob){
      return new Promise((resolve, reject)=>{
        let fr = new FileReader();
        fr.onload = (e)=>{
          resolve(e.target.result);
        }
        Object.assign(fr, this.errorStatus(reject));
        fr.readAsDataURL(blob);
      });
    }
    url2DataURL(url){
      return this.url2Blob(url)
        .then(this.blob2DataURL);
    }
    //Douban
    doubanSuggest(content){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://movie.douban.com/j/subject_suggest?q=${encodeURIComponent(content)}`,
          timeout: this.timeOut,
          responseType: 'json',
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response)
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          },
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    doubanDetail(id, api_key = atob(this.doubanAPIKeyB64)){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://api.douban.com/v2/movie/${id}?apikey=${api_key}`,
          timeout: this.timeOut,
          responseType: 'json',
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response)
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    doubanPage(id){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://movie.douban.com/subject/${id}`,
          timeout: 10000,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response)
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    doubanCard(id, type = 'png', options = {}){
      const type_mapper = {
        png: 'toPng',
        blob: 'toBlob',
        jpg: 'toJpeg',
        svg: 'toSvg',
        pixel: 'toPixelData'
      };
      if(typeof type_mapper[type] === 'undefined'){
        return new Promise((resolve, reject)=>{
          reject({status: 443, statusText: 'Wrong Type'});
        });
      }
      let iframe = $('<iframe/>');
      iframe.css({
        position: 'absolute',
        width: 0,
        height: 0,
        top: -1e4,
        left: -1e4
      });
      iframe.appendTo($('body'));
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://movie.douban.com/subject/${id}/output_card`,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              function resolveMessage(message){
                if(message.data.status === 444){
                  reject(message.data);
                }
                else{
                  resolve(message.data);
                }
                window.removeEventListener('message', resolveMessage);
                iframe.remove();
              }
              window.addEventListener('message', resolveMessage);
              let snippet = `domtoimage.${type_mapper[type]}(document.getElementById("wrapper"),${JSON.stringify(options)}).then(t=>{window.top.postMessage(t,"*")}).catch(t=>{void 0===t||void 0===t.status||void 0===t.statusText?window.top.postMessage({status:444,statusText:"DOM to Image Error"},"*"):window.top.postMessage(t,"*")});`;
              let response = res.response.replace(/<script[^>]+output\-card\.js"><\/script>/, `<script>${snippet}</script>`);
              let bg_reg = /<div class="picture\-wrapper" style="background\-image\: url\(([^\)]+)\)">/;
              let target = bg_reg.exec(response);
              this.url2DataURL(target[1]).then((durl)=>{
                response = `${response.slice(0, target.index)}<div class="picture-wrapper" style="background-image: url(${durl})">${response.slice(target.index + target[0].length)}`;
                let idoc = iframe[0].contentWindow.document;
                idoc.write(response);
              }).catch((err)=>{
                reject(err);
              });
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    doubanAwards(id){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://movie.douban.com/subject/${id}/awards`,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              const vd = document.implementation.createHTMLDocument('virtual');
              const article = $(res.response, vd).find('#content .article');
              let awards = [];
              for (let _awards of article.children('.awards')){
                let award = {};
                let temp = $(_awards).children('.hd');
                award.name = temp.find('a').text().trim();
                award.link = temp.find('a')[0].href;
                award.year = temp.find('.year').text().slice(2, -1);
                award.cats = [];
                for (let _award of $(_awards).children('.award')){
                  let item = {};
                  let temp = $(_award).children();
                  [item.category, item.recipients] = [temp[0].innerText, temp[1].innerText.split(' / ')];
                  if(item.recipients[0] === ''){
                    item.recipients = [];
                  }
                  award.cats.push(item);
                }
                awards.push(award);
              }
              resolve(awards);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    doubanCrew(id){
      function decouple(mixed){
        let match = mixed.match(/(^.*\p{Unified_Ideograph}[^ ]*) ([^\p{Unified_Ideograph}]+)$/u);
        if(match){
          return [match[1], match[2]];
        }
        else{
          return [mixed];
        }
      }
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://movie.douban.com/subject/${id}/celebrities`,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              const vd = document.implementation.createHTMLDocument('virtual');
              const celebrities = $(res.response, vd).find('#celebrities');
              let crew = [];
              for (let _list of $(celebrities).children('.list-wrapper')){
                let list = {
                  profession: {}
                };
                [list.profession.pre, list.profession.alt = list.profession.pre] = $(_list).children('h2').text().split(' ');
                list.people = [];
                for (let _person of $(_list).find('.celebrities-list>.celebrity')){
                  let person = {
                    name: {},
                    title: {}
                  };
                  [person.name.pre,
                   person.name.alt = person.name.pre] = decouple(
                    $(_person).find('.info>.name>a.name').text()
                  );
                  [person.title.pre,
                   person.title.alt = person.title.pre] = decouple(
                    $(_person).find('.info>.role').text().replace(/ \([^\)]+\)$/, '')
                  ).map((e)=>e.split('/').map((e)=>e.trim()));
                  if(list.profession.pre === '演员'){
                    person.role = {
                      pre: [],
                      alt: []
                    };
                    let temp = $(_person).find('.info>.role').text().match(/ \([饰配] ([^\)]+)\)$/);
                    if(temp){
                      temp[1].split(' / ').forEach((e)=>{
                        let temp_1, temp_2;
                        [temp_1, temp_2 = temp_1] = decouple(e);
                        person.role.pre.push(temp_1);
                        person.role.alt.push(temp_2);
                      });
                    }
                  }
                  person.link = $(_person).find('.info>.name>a.name')[0].href;
                  list.people.push(person);
                }
                crew.push(list);
              }
              resolve(crew);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    doubanDetailPlus(id, api_key = atob(this.doubanAPIKeyB64)){
      return Promise.all([this.doubanDetail(id, api_key), this.doubanPage(id)])
        .then(
        ([json, doc]) => {
          const vd = document.implementation.createHTMLDocument('virtual');
          const vdoc = $(doc, vd);
          json.alt_title = [vdoc.filter('title').text().replace(/\(豆瓣\)\s?$/, '').trim()];
          json.title = vdoc.find('h1>span[property="v:itemreviewed"]').text().replace(json.alt_title[0], '').trim() || json.alt_title[0];
          let temp;
          if((temp = vdoc.find('#info>span.pl:contains("又名:")')[0]) !== undefined){
            json.alt_title = json.alt_title.concat(temp.nextSibling.nodeValue.trim().split(' / '))
          }
          json.imdb_id = null;
          return Promise.resolve(doubanRealIMDb(doc)).then(
            id=>{
              json.imdb_id = id;
              return json;
            }
          )
        }
      )
      function doubanRealIMDb(res){
        let e = douban1stSeason(res);
        if(typeof e !== 'undefined'){
          return this.doubanPage(e).then((e)=>doubanIMDb(e));
        }
        return doubanIMDb(res);
        function douban1stSeason(res){
          const vd = document.implementation.createHTMLDocument('virtual');
          const list = $(res, vd).find('#season');
          if(typeof list === 'undefined' || list.find(':selected').text() === '1'){
            return undefined
          }
          return list.children(':first').val();
        }
        function doubanIMDb(res){
          const vd = document.implementation.createHTMLDocument('virtual');
          const link = $(res, vd).find('#info>a[href*="imdb"]')[0];
          let id;
          if(typeof link === 'undefined' || typeof link.href === 'undefined' || typeof (id = link.href.match(/\d+$/)) === 'undefined'){
            return undefined;
          }
          return id[0];
        }
      }
    }
    //IMDb
    imdbRating(id){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://p.media-imdb.com/static-content/documents/v1/title/tt${id}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(JSON.parse(res.response.slice(16, -1)))
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    imdbSuggest(content){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://v2.sg.media-imdb.com/suggestion/${content[0].toLowerCase()}/${encodeURIComponent(content).replace(/%20/g, '+')}.json`,
          timeout: this.timeOut,
          responseType: 'json',
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response)
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    //MTime
    mtimeStatistic(id){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: 'http://service.library.mtime.com/Movie.api'
          + '?Ajax_CallBack=true'
          + '&Ajax_CallBackType=Mtime.Library.Services'
          + '&Ajax_CallBackMethod=GetMovieOverviewRating'
          + `&Ajax_CallBackArgument0=${id}`,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              let m = res.response.match(/^[^{]+({.*});\s*$/);
              let val;
              if(m && (val = JSON.parse(m[1]).value)){
                resolve(val);
              }
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    mtimeRating(id_array){
      if((typeof id_array === 'string' && id_array.match(/^\d+$/)) || Number.isInteger(id_array)){
        id_array = [id_array];
      }
      else if(!(id_array instanceof Array)){
        return Promise.reject({
          status: 446,
          statusText: 'Mtime Rating Argument Wrong Format'
        })
      }
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: 'http://service.mtime.com/Service/Movie.msi'
          + '?Ajax_CallBack=true'
          + '&Ajax_CallBackType=Mtime.MemberCenter.Pages.MovieService'
          + '&Ajax_CallBackMethod=GetRatingsByMovieIds'
          + `&Ajax_CallBackArgument0=${id_array.join('|')}`,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              let m = res.response.match(/^[^{]+({.*});\s*$/);
              let val;
              if(m && (val = JSON.parse(m[1]).value)){
                resolve(val);
              }
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    mtimeQuery(content, count = 20){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: 'http://my.mtime.com/Service/Movie.mc'
          + '?Ajax_CallBack=true'
          + '&Ajax_CallBackType=Mtime.MemberCenter.Pages.MovieService'
          + '&Ajax_CallBackMethod=GetSearchMoviesByTitle'
          + `&Ajax_CallBackArgument0=${encodeURIComponent(content)}`
          + `&Ajax_CallBackArgument1=${count}`,
          timeout: 10000,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              let val;
              if((val = JSON.parse(res.response).value)){
                resolve(val);
              }
              resolve(JSON.parse(res.response));
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    mtimeSearch(content){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: 'http://service-channel.mtime.com/Search.api'
          + '?Ajax_CallBack=true'
          + '&Ajax_CallBackType=Mtime.Channel.Services'
          + '&Ajax_CallBackMethod=GetSearchResult'
          + `&Ajax_CallBackArgument0=${encodeURIComponent(content)}`
          + '&Ajax_CallBackArgument2=1'
          + '&Ajax_CallBackArgument4=10000',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              let m = res.response.match(/^[^{]+({.*});\s*$/);
              let val;
              if(m && (val = JSON.parse(m[1]).value)){
                resolve(val.movieResult);
              }
              else{
                reject({
                  status: 445,
                  statusText: 'Mtime Error',
                });
              }
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    mtimeBehindTheScene(id){
      //revealed_list
      //revealed_lines
      //revealed_news
      //revealed_other
      //revealed_album
      let result = [];
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `http://movie.mtime.com/${id}/behind_the_scene.html`,
          timeout: 10000,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              const vd = document.implementation.createHTMLDocument('virtual');
              const bts = $(res.response, vd).find('.revealed_modle');
              bts.map((i, e)=>{
                result[i] = {};
                result[i].preferred_title = $(e).find('h3').text().trim();
                result[i].alternative_title = $(e).find('h4').text().trim();
                switch($(e).children().filter('[class^="revealed_"]').attr('class')){
                  case 'revealed_list':
                    result[i].content = $(e).find('dl.revealed_list>dd').toArray()
                      .map((e, i)=>e.innerText.trim().replace(new RegExp(`^${i+1}`), ''));
                    result[i].type = 'list';
                    break;
                  case 'revealed_lines':
                    result[i].content = $(e).find('div.revealed_lines>dl>dd').toArray()
                      .map((e, i)=>{$(e).find('br').before(document.createTextNode('\n')).remove(); return e.innerText.trim()});
                    result[i].type = 'lines';
                    if (result[i].content.length === 0){
                      result[i].content = $(e).find('div.revealed_album>div.revealed_album_list li').toArray()
                        .map((e, i)=>`${$(e).attr('title')}：${$(e).attr('imgabstract')}`);
                      result[i].type = 'album';
                    }
                    break;
                  case 'revealed_other':
                    $(e).find('div.revealed_other>p:empty').before(document.createTextNode('\x1995')).remove();
                    $(e).find('div.revealed_other>p>br').before(document.createTextNode('\n')).remove();
                    result[i].content = $(e).find('div.revealed_other').text().trim().split(/\x1995|^　{2}|\n　{2}/u).filter(e=>e.length).map(e=>e.trim().replace(/^\-+|\-+$|^·/g, '').trim());
                    result[i].type = 'other';
                    break;
                  case 'revealed_album':
                    result[i].content = $(e).find('div.revealed_album>div.revealed_album_list li').toArray()
                      .map((e, i)=>`${$(e).attr('title')}：${$(e).attr('imgabstract')}`);
                    result[i].type = 'album';
                    break;
                  case 'revealed_news':
                    result[i].content = $(e).find('h3>a').attr('href');
                    result[i].type = 'news';
                    break;
                }
              });
              resolve(result);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    //MetaCritic
    metacriticSuggest(content, type = 'movie'){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'POST',
          url: 'https://www.metacritic.com/autosearch',
          data: `search_term=${encodeURIComponent(content).replace(/%20/g, '+')}`,
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-requested-with': 'XMLHttpRequest',
            'referer': `//www.metacritic.com/${type}`
          },
          responseType: 'json',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    //RottenTomatoes
    rottentomatoesSuggest(content, limit = 10000){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://www.rottentomatoes.com/napi/search/?query=${encodeURIComponent(content).replace(/%20/g, '+')}&limit=${limit}`,
          responseType: 'json',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    rottentomatoesSearch(content, limit = 10000){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://www.rottentomatoes.com/api/private/v2.0/search?q=${encodeURIComponent(content).replace(/%20/g, '+')}&limit=${limit}`,
          responseType: 'json',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    rottentomatoesId(url){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: url,
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              const vd = document.implementation.createHTMLDocument('virtual');
              const id = $(res.response, vd).find('#rating-root').attr('data-movie-id');
              const emsId = (res.response.match(/emsId":"([^"]+)"/)||[undefined])[1];
              resolve({id: id, emsId: emsId});
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    rottentomatoesDetail(id){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://www.rottentomatoes.com/api/private/v1.0/movies/${id}`,
          responseType: 'json',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    rottentomatoesAudienceScore(emsId){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://www.rottentomatoes.com/napi/audienceScore/${emsId}`,
          responseType: 'json',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    //Flixster
    flixsterDetail(id){
      return new Promise((resolve, reject)=>{
        let request = Object.assign({
          method: 'GET',
          url: `https://api.flixster.com/android/api/v2/movies/${id}`,
          responseType: 'json',
          timeout: this.timeOut,
          onload: (res)=>{
            if(res.status >= 200 && res.status < 300){
              resolve(res.response);
            }
            else{
              reject({
                status: res.status,
                statusText: res.statusText,
              });
            }
          }
        }, this.errorStatus(reject));
        GM_xmlhttpRequest(request);
      });
    }
    //
    parseTorrentName(name){
      name = name.trim();
      let regexp_array = [
        {
          name: 'season',//S01E05 Season01episode05
          pattern: /\b(?:season[\s.]?|s)(\d{1,3})(?:\b|(?:episode[\s.]?|ep?)\d{1,3}\b)/gi,
          fun: (temp)=>Number.parseInt(temp[1])
        },
        {
          name: 'year',//2018
          pattern: /\b([12]\d{3})\b/g,
          fun: (temp)=>Number.parseInt(temp[1])
        },
        {
          name: 'resp',//1080p
          pattern: /\b(\d{3,4})p\b/gi,
          fun: (temp)=>Number.parseInt(temp[1])
        },
        {
          name: 'resi',//1080i
          pattern: /\b(\d{3,4})i\b/gi,
          fun: (temp)=>Number.parseInt(temp[1])
        },
        {
          name: 'resk',//4k
          pattern: /\b(\d)k\b/gi,
          fun: (temp)=>Number.parseInt(temp[1])
        },
        {
          name: 'resd', //SD
          pattern: /\b((?:s|h|uh)d)\b/gi,
          fun: (temp)=>temp[1]
        },
        {
          name: 'source',//bluray web-dl webrip web hdtv hddvd dvd
          pattern: /\b(?:(?<bluray>blue?\-?ray|b[dr]\-?(?:rip)?)|(?<webdl>web\-?dl)|(?<webrip>web\-?rip)|(?<web>web)|(?<hdtv>hdtv)|(?<hddvd>hd-?dvd)|(?<dvd>dvd(?:rip|scr)?))\b/gi,
          fun: (temp)=>Object.keys(temp.groups).find(k=>temp.groups[k] !== undefined)
        }
      ];
      let result = {};
      let temp = null, start_index = -1, end_index = -1;
      let start_index_log = [];
      for(let [index, regexp] of regexp_array.entries()){
        while ((temp = regexp.pattern.exec(name)) !== null) {
          result[regexp.name] = regexp.fun(temp);
          start_index = temp.index;
          end_index = regexp.pattern.lastIndex;
        }
        if(start_index !== -1){
          start_index_log.push(start_index);
          start_index = -1;
          end_index = -1;
        }
      }
      if(start_index_log.length === 0){
        result.name = name;
      }
      else{
        result.name = name.slice(0, Math.min(...start_index_log)).trim().replace(/^\.|\.$/, '');
      }
      return result;
    }
  }
  window.MediaFetchAPI = MediaFetchAPI;
})();