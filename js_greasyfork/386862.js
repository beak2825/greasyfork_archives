// ==UserScript==
// @name         豆瓣导出工具
// @version      0.3
// @description  导出豆瓣上看过和读过、想看和想读的列表。
// @author       KiseXu(原作者) DannyVim(修改者) tabokie(修改者)
// @copyright 2018, KiseXu (https://kisexu.com)
// @license MIT
// @supportURL   https://github.com/DannyVim/ToolsCollection/issues
// @match        https://book.douban.com/people/*/collect*
// @match        https://book.douban.com/people/*/wish*
// @match        https://movie.douban.com/people/*/collect*
// @match        https://movie.douban.com/people/*/wish*
// @match        https://www.douban.com/people/*
// @require      https://unpkg.com/dexie@latest/dist/dexie.js
// @grant        none
// @namespace https://greasyfork.org/users/313343
// @downloadURL https://update.greasyfork.org/scripts/386862/%E8%B1%86%E7%93%A3%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/386862/%E8%B1%86%E7%93%A3%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面触发部分
    if (location.href.indexOf('//www.douban.com/') > -1) {
        // 加入导出按钮
        var people = location.href.slice(location.href.indexOf('/people') + 8, -1);
        var export_book_link = 'https://book.douban.com/people/' + people + '/collect?start=0&sort=time&rating=all&filter=all&mode=list&export=1';
        $('#book h2 .pl a:last').after('&nbsp;·&nbsp;<a href="'+ export_book_link +'">导出读过的图书</a>');
        var export_book_wish_link = 'https://book.douban.com/people/' + people + '/wish?start=0&sort=time&rating=all&filter=all&mode=list&export=1';
        $('#book h2 .pl a:last').after('&nbsp;·&nbsp;<a href="'+ export_book_wish_link +'">导出想读的图书</a>');
        var export_movie_link = 'https://movie.douban.com/people/' + people + '/collect?start=0&sort=time&rating=all&filter=all&mode=list&export=1';
        $('#movie .pl a:last').after('&nbsp;·&nbsp;<a href="'+ export_movie_link +'">导出看过的电影</a>');
        var export_movie_wish_link = 'https://movie.douban.com/people/' + people + '/wish?start=0&sort=time&rating=all&filter=all&mode=list&export=1';
        $('#movie .pl a:last').after('&nbsp;·&nbsp;<a href="'+ export_movie_wish_link +'">导出想看的电影</a>');
    }

    if (location.href.indexOf('//book.douban.com/') > -1 && location.href.indexOf('export=1') > -1) {
        // 开始导出
        if (location.href.indexOf('/wish') > -1) {
            getPage('book_wish_export');
        } else {
            getPage('book_export');
        }
    }

    if (location.href.indexOf('//movie.douban.com/') > -1 && location.href.indexOf('export=1') > -1) {
        // 开始导出
        if (location.href.indexOf('/wish') > -1) {
            getPage('movie_wish_export');
        } else {
            getPage('movie_export');
        }
    }


    // 获取当前页数据
    function getCurrentPageList() {
        var items = [];

        $('li.item').each(function(index) {
            items[index] = {
                title: $(this).find('a').text().replace(/修改删除/, '').replace(/加入购书单/,'').replace(/>/,'').trim(),
                rating: ($(this).find('.date span').attr('class')) ? $(this).find('.date span').attr('class').slice(6, 7) : '',
                date: $(this).find('.date').text().trim(),
                link: $(this).find('.title a').attr('href').trim(),
                comment:$(this).find('.comment').text().trim(),
            };
        });

        return items;
    }

    // 采集当前页数据，保存到indexedDB
    function getPage(descriptor) {
        const db = new Dexie('db_export');
        db.version(1).stores({
            items: `++id, title, rating, date, link,comment`
        });

        var items = getCurrentPageList();
        db.items.bulkAdd(items).then (function(){
            console.log('保存成功');
            // 获取下一页链接
            var next_link = $('span.next a').attr('href');
            if (next_link) {
                next_link = next_link + '&export=1';
                window.location.href = next_link;
            } else {
                if (descriptor == '') {
                    exportAll('book_movie');
                } else {
                    exportAll(descriptor);
                }
            }
        }).catch(function(error) {
            console.log("Ooops: " + error);
        });

    }

    // 导出所有数据到CSV
    function exportAll(fileName) {
        const db = new Dexie('db_export');
        db.version(1).stores({
            items: `++id, title, rating, date, link,comment`
        });
        db.items.orderBy('date').toArray().then(function(all){
            all = all.map(function(item,index,array){
                delete item.id;
                return item;
            });

            JSonToCSV.setDataConver({
                data: all,
                fileName: fileName,
                columns: {
                    title: ['标题', '个人评分', '打分日期', '条目链接','评论'],
                    key: ['title', 'rating', 'date', 'link','comment']
                }
            });
            db.delete();
        });
    }

    // 导出CSV函数
    // https://github.com/liqingzheng/pc/blob/master/JsonExportToCSV.js
    var JSonToCSV = {
    /*
     * obj是一个对象，其中包含有：
     * ## data 是导出的具体数据
     * ## fileName 是导出时保存的文件名称 是string格式
     * ## showLabel 表示是否显示表头 默认显示 是布尔格式
     * ## columns 是表头对象，且title和key必须一一对应，包含有
          title:[], // 表头展示的文字
          key:[], // 获取数据的Key
          formatter: function() // 自定义设置当前数据的 传入(key, value)
     */
    setDataConver: function(obj) {
      var bw = this.browser();
      if(bw.ie < 9) return; // IE9以下的
      var data = obj.data,
          ShowLabel = typeof obj.showLabel === 'undefined' ? true : obj.showLabel,
          fileName = (obj.fileName || 'UserExport') + '.csv',
          columns = obj.columns || {
              title: [],
              key: [],
              formatter: undefined
          };
      ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
      var row = "", CSV = '', key;
      // 如果要现实表头文字
      if (ShowLabel) {
          // 如果有传入自定义的表头文字
          if (columns.title.length) {
              columns.title.map(function(n) {
                  row += n + ',';
              });
          } else {
              // 如果没有，就直接取数据第一条的对象的属性
              for (key in data[0]) row += key + ',';
          }
          row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
          CSV += row + '\r\n'; // 添加换行符号
      }
      // 具体的数据处理
      data.map(function(n) {
          row = '';
          // 如果存在自定义key值
          if (columns.key.length) {
              columns.key.map(function(m) {
                  row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] : n[m]) + '",';
              });
          } else {
              for (key in n) {
                  row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] : n[key]) + '",';
              }
          }
          row.slice(0, row.length - 1); // 删除最后一个,
          CSV += row + '\r\n'; // 添加换行符号
      });
      if(!CSV) return;
      this.SaveAs(fileName, CSV);
    },
    SaveAs: function(fileName, csvData) {
      var bw = this.browser();
      if(!bw.edge || !bw.ie) {
        var alink = document.createElement("a");
        alink.id = "linkDwnldLink";
        alink.href = this.getDownloadUrl(csvData);
        document.body.appendChild(alink);
        var linkDom = document.getElementById('linkDwnldLink');
        linkDom.setAttribute('download', fileName);
        linkDom.click();
        document.body.removeChild(linkDom);
      }
      else if(bw.ie >= 10 || bw.edge == 'edge') {
        var _utf = "\uFEFF";
        var _csvData = new Blob([_utf + csvData], {
            type: 'text/csv'
        });
        navigator.msSaveBlob(_csvData, fileName);
      }
      else {
        var oWin = window.top.open("about:blank", "_blank");
        oWin.document.write('sep=,\r\n' + csvData);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, fileName);
        oWin.close();
      }
    },
    getDownloadUrl: function(csvData) {
      var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
          csvData = new Blob([_utf + csvData], {
              type: 'text/csv'
          });
          return URL.createObjectURL(csvData);
      }
      // return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
    },
    browser: function() {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var s;
      var dummy = (s = ua.indexOf('edge') !== - 1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
          (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
          (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
          (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
          (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
          (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
      return Sys;
    }
  };

})();
