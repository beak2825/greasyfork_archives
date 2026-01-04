// ==UserScript==
// @name         RecomWP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Wikipedia Recommendation System
// @homepage     https://github.com/AlexanderMisel/RecomWP
// @supportURL   https://github.com/AlexanderMisel/RecomWP/issues
// @author       Alexander Misel
// @license      GPL-3.0
// @match        https://zh.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371385/RecomWP.user.js
// @updateURL https://update.greasyfork.org/scripts/371385/RecomWP.meta.js
// ==/UserScript==

(function () {

// Polyfill for Wikipedia with no jQuery
  if (Array.isArray(window.RLQ) && window.RLQ.length > 1) {
    var tempMW = null;
    if (window.mw) {
      tempMW = window.mw;
    }
    window.mw = {
      config: {
        set: function (data) {
          for (var key in data) {
            window[key] = data[key];
          }
        }
      },
      loader: {
        load: function (data) {},
        state: function () {},
        implement: function () {}
      }
    };
    window.RLQ[0]();
    window.RLQ[1]();
    window.mw = tempMW;
  } else {
    window.wgAction = mw.config.get('wgAction');
    window.wgArticleId = mw.config.get('wgArticleId');
    window.wgPageName = mw.config.get('wgPageName');
    window.wgNamespaceNumber = mw.config.get('wgNamespaceNumber');
  }

  var navLink = document.createElement('li');
  navLink.id = 'RecomWP';
  navLink.innerHTML = '<a href="/wiki/Special:%E7%A9%BA%E7%99%BD%E9%A1%B5%E9%9D%A2/RecomWP" title="为你推荐的条目">推荐条目</a>';
  document.querySelector('#p-navigation ul').appendChild(navLink);

  if (window.wgNamespaceNumber === 0 || window.wgPageName === 'Special:空白页面/RecomWP') {

    var wpdb;

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    console.log('RecomWP initialised.');

    var DBOpenRequest = window.indexedDB.open('RecomWP');

    DBOpenRequest.onerror = function (event) {
      console.log('Error loading database.');
    };

    DBOpenRequest.onsuccess = function (event) {
      console.log('Database initialised.');

      // store the result of opening the database in the db variable. This is used a lot below
      wpdb = DBOpenRequest.result;

      if (window.wgArticleId) {
        addData({
          pageId: window.wgArticleId,
          pageName: window.wgPageName
        });
      } else if (window.wgAction === 'view') {

        var GM_addStyle = function (css) {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.id = 'GM_addStyleBy8626';
          style.innerHTML = css;
          document.head.appendChild(style);
        };

        document.title = '推荐条目';
        document.getElementById('firstHeading').innerText = '推荐条目';
        GM_addStyle('.recom-root:after{clear:both;display:table;content:" "}.ra-read-more{overflow:hidden;max-height:300px;transition:max-height 1s;}#left-recom{float:left;width:66.666667%}#right-recom{float:left;width:33.333333%}.ra-read-more h2{border-bottom:0;font-size:.8em;font-weight:400;color:#72777d;padding-bottom:.5em;text-transform:uppercase;letter-spacing:1px}.ra-read-more ul{margin:0}.ext-related-articles-card-list{border-top:0}.ext-related-articles-card-list{display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;flex-flow:row wrap;font-size:1em;list-style:none;overflow:hidden;position:relative}.ext-related-articles-card-list .ext-related-articles-card{border-radius:6px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,0.12),0 2px 4px rgba(0,0,0,0.24);transition:all 0.3s cubic-bezier(.25,.8,.25,1);}.ext-related-articles-card-list .ext-related-articles-card:hover{box-shadow:0 5px 10px rgba(0,0,0,0.25),0 5px 10px rgba(0,0,0,0.22);}.ext-related-articles-card-list .ext-related-articles-card:active{box-shadow:0 2px 4px rgba(0,0,0,0.12),0 2px 4px rgba(0,0,0,0.24);}.ext-related-articles-card-list .ext-related-articles-card{background-color:#fff;box-sizing:border-box;margin:0;height:80px;position:relative;border:1px solid rgba(0,0,0,.2);margin-right:1%;margin-bottom:10px;width:49%;}.ext-related-articles-card-list .ext-related-articles-card-thumb{background-color:#eaecf0;background-image:url(/w/extensions/RelatedArticles/resources/ext.relatedArticles.cards/noimage.png?9e3d8);background-image:linear-gradient(transparent,transparent),url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 56 56%22%3E %3Cpath fill=%22%23eaecf0%22 d=%22M0 0h56v56h-56%22/%3E %3Cpath fill=%22%2372777d%22 d=%22M36.4 13.5h-18.6v24.9c0 1.4.9 2.3 2.3 2.3h18.7v-25c.1-1.4-1-2.2-2.4-2.2zm-6.2 3.5h5.1v6.4h-5.1v-6.4zm-8.8 0h6v1.8h-6v-1.8zm0 4.6h6v1.8h-6v-1.8zm0 15.5v-1.8h13.8v1.8h-13.8zm13.8-4.5h-13.8v-1.8h13.8v1.8zm0-4.7h-13.8v-1.8h13.8v1.8z%22/%3E %3C/svg%3E");background-repeat:no-repeat;background-position:top center;-webkit-background-size:100% 100%;background-size:100% 100%;background-size:cover;float:left;height:100%;width:80px;margin-right:10px}.ext-related-articles-card-list .ext-related-articles-card>a{position:absolute;top:0;right:0;bottom:0;left:0;z-index:1}.ext-related-articles-card-list .ext-related-articles-card-detail{position:relative;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}.ext-related-articles-card-list h3{font-family:inherit;font-size:1em;max-height:2.6em;line-height:1.3;margin:0;overflow:hidden;padding:0;position:relative;font-weight:500}.ext-related-articles-card-list h3 a{color:#000}.ext-related-articles-card-list h3::after{content:" ";position:absolute;right:0;bottom:0;width:25%;height:1.3em;background-color:transparent;background-image:-webkit-linear-gradient(right,rgba(255,255,255,0),#fff 50%);background-image:-moz-linear-gradient(right,rgba(255,255,255,0),#fff 50%);background-image:-o-linear-gradient(right,rgba(255,255,255,0),#fff 50%);background-image:linear-gradient(to right,rgba(255,255,255,0),#fff 50%)}.ext-related-articles-card-list .ext-related-articles-card-extract{color:#72777d;font-size:.8em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}.recom-card{box-shadow:0 2px 4px rgba(0,0,0,0.12),0 2px 4px rgba(0,0,0,0.24);padding:10px;transition:all 0.3s cubic-bezier(.25,.8,.25,1);}.recom-card + .recom-card{margin-top:20px;}.recom-card:hover{box-shadow:0 5px 10px rgba(0,0,0,0.25),0 5px 10px rgba(0,0,0,0.22);}.recom-card img,.img-banner img{cursor:pointer;width:100%;}.trend-list{list-style-type:none;}.trend-list li{display:flex;line-height:36px;font-size:24px;cursor:pointer;}.trend-list li:hover{color:#4284f3;}.trend-item-left{display:inline-block;min-width:50px;user-select:none;}');

        let landscapeDiv = document.createElement('div');
        landscapeDiv.id = 'landscape-recom';
        let leftDiv = document.createElement('div');
        leftDiv.id = 'left-recom';
        let rightDiv = document.createElement('div');
        rightDiv.id = 'right-recom';
        let rootDiv = document.getElementById('mw-content-text');
        rootDiv.innerHTML = '';
        rootDiv.classList.add('recom-root');
        rootDiv.appendChild(landscapeDiv);
        rootDiv.appendChild(leftDiv);
        rootDiv.appendChild(rightDiv);

        generateRecom();
        getTrend();
      }
    };

    DBOpenRequest.onupgradeneeded = function (event) {
      wpdb = event.target.result;

      wpdb.onerror = function (event) {
        console.error('Error loading database.');
      };

      // Create an objectStore for this database

      var objectStore = wpdb.createObjectStore('historyArticles', { keyPath: 'pageId' });

      // define what data items the objectStore will contain

      objectStore.createIndex('pageName', 'pageName', { unique: true });
      objectStore.createIndex('visitCount', 'visitCount', { unique: false });
      objectStore.createIndex('lastTime', 'lastTime', { unique: false });

      console.log('Object store created.');
    };

    var addData = function (newItem) {
      var transaction = wpdb.transaction(['historyArticles'], 'readwrite');

      // report on the success of the transaction completing, when everything is done
      transaction.oncomplete = function () {
        console.log('Transaction completed: database modification finished.');
      };

      transaction.onerror = function () {
        console.error('Transaction not opened due to error: ' + transaction.error + '');
      };

      // call an object store that's already been added to the database
      var objectStore = transaction.objectStore('historyArticles');

      objectStore.openCursor(newItem.pageId).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          newItem.visitCount = cursor.value.visitCount + 1;
          newItem.lastTime = Date.now();

          var request = cursor.update(newItem);
          request.onsuccess = function () {
            console.log('Update success');
          };
        } else {
          newItem.visitCount = 1;
          newItem.lastTime = Date.now();
          var objectStoreRequest = objectStore.add(newItem);
          objectStoreRequest.onsuccess = function (event) {
            console.log('Insert success');
          };
        }
      };
    };

    var removeData = function (pageId) {
      wpdb.transaction(['historyArticles'], 'readwrite').objectStore('historyArticles').delete(pageId);
    };

    var httpGet = function(url, callback) {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var responseText = JSON.parse(request.responseText);
          callback(responseText);
        }
      };
      request.send();
    }

    var relativeSearch = function (pageName, callback) {
      let queryUrl = 'https://zh.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|description&piprop=thumbnail&pithumbsize=160&generator=search&gsrsearch=morelike%3A'
                + encodeURI(pageName) + '&gsrnamespace=0&gsrlimit=4&gsrqiprofile=classic_noboostlinks&uselang=content&smaxage=86400&maxage=86400';
      httpGet(queryUrl, callback);
    };

    var dailyFeatured = function (callback) {
      let ymd = new Date(Date.now() - 2 * 60 * 60000).toISOString().split('T')[0].replace(/-/g, '/');
      let queryUrl = 'https://zh.wikipedia.org/api/rest_v1/feed/featured/' + ymd;
      httpGet(queryUrl, callback);
    };

    // O(n) time & O(n) space
    var mergeTwo = function(arr1, arr2) {
      let merged = [];
      let index1 = 0;
      let index2 = 0;
      let current = 0;
      let duplicate = 0;

      while (current + duplicate < (arr1.length + arr2.length)) {

        let isArr1Depleted = index1 >= arr1.length;
        let isArr2Depleted = index2 >= arr2.length;

        if (!isArr1Depleted && (isArr2Depleted || (arr1[index1].views >= arr2[index2].views))) {
          merged[current] = arr1[index1];
          index1++;
        } else {
          if (merged[current-1] && merged[current-1].article === arr2[index2].article) {
              duplicate++;
              current--;
          } else {
              merged[current] = arr2[index2];
          }
          index2++;
        }

        current++;
      }

      return merged;
    }

    var dailyTrend = function (params, callback) {
      var result = [];
      Promise.all(params.split(',')
        .map(x => fetch('https://alex-wiki.toolforge.org/topviews?' + x)
          .then(response => response.json())
          .then(data => {
            result = mergeTwo(result, data);
          })
        )
      ).then(() => callback(result));
    };

    var getTrend = function () {
      var generateImage = function (imgCard, imageObj) {
        let featImg = new Image();
        featImg.onclick = function () {
          window.location.href = imageObj.file_page
        }
        // normal image
        featImg.src = imageObj.thumbnail.source;
        imgCard.className = 'recom-card';
        imgCard.appendChild(featImg);
        if (imageObj.description) {
          imgCard.insertAdjacentHTML('beforeend', imageObj.description.html);
        }
      };

      var trendParams = {
        'ACG': 'topic=acg',
        '影视娱乐': 'topic=drama|film|show,type=star',
        '': 'topic=!drama|!film|!show|!acg&type=!star'
      };

      var generateTrendList = function (type) {
        let trendTitle = document.createElement('h2');
        trendTitle.innerHTML = type + '热门条目';
        trendTitle.style = 'text-align:center';
        let trendCard = document.createElement('div');
        trendCard.className = 'recom-card';
        trendCard.appendChild(trendTitle)

        let trendList = document.createElement('ul');
        trendList.className = 'trend-list'
        trendCard.appendChild(trendList);
        document.getElementById('right-recom').appendChild(trendCard);

        dailyTrend(trendParams[type], articles => {
          for (let i = 0; i < 10; i++) {
            let trendItemLeft = document.createElement('span');
            trendItemLeft.className = 'trend-item-left';
            trendItemLeft.innerText = i + 1;
            let trendItemRight = document.createElement('span');
            trendItemRight.className = 'trend-item-right';
            if (!articles[i]) break;
            trendItemRight.innerText = articles[i].article.replace(/_/g, ' ');
            let trendItem = document.createElement('li');
            trendItem.onclick = function () {
              window.location.href = 'https://zh.wikipedia.org/wiki/' + articles[i].article
            }
            trendItem.appendChild(trendItemLeft);
            trendItem.appendChild(trendItemRight);
            trendList.appendChild(trendItem);
          }
        });
      };

      let imgCard = document.createElement('div');
      document.getElementById('right-recom').appendChild(imgCard);
      dailyFeatured(res => {
        if (res.image) {
          generateImage(imgCard, res.image);
        }
      });

      generateTrendList('');
      generateTrendList('影视娱乐');
      generateTrendList('ACG');
    }

    var appendToPage = function (pageName, pages, pageId) {
      let titleBar = document.createElement('h2');
      titleBar.innerHTML = '<strong>' + pageName + '</strong>相关页面 ';

      let alist = document.createElement('ul');
      alist.className = 'ext-related-articles-card-list';
      pages.forEach(function (item) {
        let listItem = document.createElement('li');
        listItem.className = 'ext-related-articles-card';
        listItem.title = item.title;

        let cardDiv = document.createElement('div');
        cardDiv.className = 'ext-related-articles-card-thumb';
        if (item.thumbnail) {
          cardDiv.style['background-image'] = 'url("' + item.thumbnail.source + '")';
        }

        let cardLink = document.createElement('a');
        cardLink.href = '/wiki/' + encodeURI(item.title);

        let cardDetail = document.createElement('div');
        cardDetail.className = 'ext-related-articles-card-detail';
        cardDetail.innerHTML = '<h3>' + item.title + '</h3>';
        if (item.description) {
          cardDetail.innerHTML += '<p class="ext-related-articles-card-extract">' + item.description + '</p>';
        }

        listItem.appendChild(cardDiv);
        listItem.appendChild(cardLink);
        listItem.appendChild(cardDetail);
        alist.appendChild(listItem);
      });

      let blockDiv = document.createElement('div');
      blockDiv.className = 'ra-read-more';

      let dontLike = document.createElement('a');
      dontLike.innerText = '[不感兴趣]';
      dontLike.onclick = function () {
        removeData(pageId);
        blockDiv.style['max-height'] = '0';
      };
      titleBar.appendChild(dontLike);
      blockDiv.appendChild(titleBar);
      blockDiv.appendChild(alist);
      let leftDiv = document.getElementById('left-recom');
      leftDiv.appendChild(blockDiv);
    };

    var generateRecom = function () {
      /*
   * Simple implementation of Binary heap
   */
      function BinaryHeap (scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
      }

      BinaryHeap.prototype = {
        push: function (element) {
          // Add the new element to the end of the array.
          this.content.push(element);
          // Allow it to bubble up.
          this.bubbleUp(this.content.length - 1);
        },

        pop: function () {
          // Store the first element so we can return it later.
          var result = this.content[0];
          // Get the element at the end of the array.
          var end = this.content.pop();
          // If there are any elements left, put the end element at the
          // start, and let it sink down.
          if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
          }
          return result;
        },

        remove: function (node) {
          var length = this.content.length;
          // To remove a value, we must search through the array to find
          // it.
          for (var i = 0; i < length; i++) {
            if (this.content[i] !== node) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i === length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
          }
        },

        size: function () {
          return this.content.length;
        },

        bubbleUp: function (n) {
          // Fetch the element that has to be moved.
          var element = this.content[n],
            score = this.scoreFunction(element);
          // When at 0, an element can not go up any further.
          while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
              parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.scoreFunction(parent)) {
              break;
            }

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
          }
        },

        sinkDown: function (n) {
          // Look up the target element and its score.
          var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

          while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
              // Look it up and compute its score.
              var child1 = this.content[child1N],
                child1Score = this.scoreFunction(child1);
              // If the score is less than our element's, we need to swap.
              if (child1Score < elemScore) {
                swap = child1N;
              }
            }
            // Do the same checks for the other child.
            if (child2N < length) {
              var child2 = this.content[child2N],
                child2Score = this.scoreFunction(child2);
              if (child2Score < (swap == null ? elemScore : child1Score)) {
                swap = child2N;
              }
            }

            // No need to swap further, we are done.
            if (swap == null) break;

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
          }
        }
      };

      var heap = new BinaryHeap(function (x) {
        var res = ((Date.now() - x.lastTime) / 604800000) - x.visitCount;
        return res;
      });

      // Database iterate
      var objectStore = wpdb.transaction('historyArticles').objectStore('historyArticles');

      objectStore.openCursor().onsuccess = function (event) {
        document.getElementById('left-recom').innerHTML = '';
        var cursor = event.target.result;

        if (cursor) {
          heap.push(cursor.value);
          cursor.continue();
        } else {
          // first remove the backmost entries to keep size, default size 127
          if (heap.size() >= 128) {
            for (let i = 127; i < heap.size(); i++) {
              removeData(heap.content[i].pageId);
            }
          }
          var getPage = function () {
            if (!heap.size()) {
              return false;
            }
            let topEntry = heap.pop();
            let pageName = topEntry.pageName;
            relativeSearch(pageName, function (data) {
              if (data.batchcomplete) {
                if (data.query) {
                  appendToPage(pageName, data.query.pages, topEntry.pageId);
                } else {
                  removeData(topEntry.pageId);
                  getPage();
                }
              }
            });
            return true;
          };
          for (let i = 1; i <= 6; i++) {
            if (!getPage()) {
              break;
            }
          }
        }
      };
    };

  }

})();
