// ==UserScript==
// @name         unlock reviewers Finder
// @namespace    http://www.hechao.fun/
// @version      0.9
// @description  用来过滤未解锁审稿人
// @author       Zero
// @match         *://finder.susy.mdpi.com/reviewer/*
// @license             End-User License Agreement
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/453453/unlock%20reviewers%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/453453/unlock%20reviewers%20Finder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 复制
  function zeroCopy (text) {
    GM_setClipboard(text);
    console.log(text, '复制成功！');
  }

  // 查询20页内的数据
  function getNextPageData () {
    $('#zeroFilter').text('搜索中');
    const maxPage = 20;
    let num = 0;
    let trueData = [];
    let trueDatas = [];
    let emails = [];
    $('body').find('.job-ad-item').remove();
    const baseUrl = window.location.toString();
    const url = baseUrl.lastIndexOf('page=') > -1 ? baseUrl.slice(0, baseUrl.lastIndexOf('page=' + 5)) : baseUrl + '&page=';
    for (let i = 1; i < maxPage + 1; i++) {
      $.get(url + i, function (data, status) {
        num++;
        if (status === 'success') {
          const nodeList = $(data).find('.job-ad-item');
          for (let key = 0; key < nodeList.length; key++) {
            const item = nodeList[key];
            const cur = item.querySelector('div.ad-meta');;
            const last_invite = cur.children[0].children[0].innerText.replace(/-/g, "/");
            const last_review = cur.children[0].children[1].innerText.replace(/-/g, "/");
            const today = new Date().valueOf();
            //判断邀请时间
            const judge_invite = new Date(last_invite).valueOf() < (today - 7 * 24 * 60 * 60 * 1000);
            const judge_review = new Date(last_review).getFullYear() > 2021;
            if (judge_invite && judge_review) {
              const email = cur.previousElementSibling.children[1].getAttribute('data-clipboard-text');
              const overview = cur.previousElementSibling.children[4];
              trueData.push({
                last_invite,
                last_review,
                email
              });
              emails.push(email);
              trueDatas.push(item);
            }
          }

        }
        if (num === maxPage) {
          $('.featured-top').after(trueDatas);
          console.table(trueData);
          zeroCopy(emails.join('、'));
          $('#zeroFilter').text('Filter');

          const loading = '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>';
          $('.overview-btn').click(function (e) {
            e.preventDefault();
            const currentIcon = $(this).html();
            const url = $(this).data('o-url');
            const $this = $(this);
            $(this).html(loading);

            $.ajax({
              url: url,
              method: 'GET',
              success: function (res) {
                $('#overview-div').find('.modal-body').html(res);
                $('#overview-div').modal();
                $this.html(currentIcon)
              },
              error: function (err) {
                alert(err.statusText);
                $this.html(currentIcon);
              }
            });

          });
        }
      })
    }

  }

  // 获取半年前的时间
  function getHalfYearAgoToday () {
    const today = new Date();
    today.setMonth(today.getMonth() - 6);
    return today.valueOf();
  }

  // 通过邀请人历史过滤数据
  function filterData () {
    $('#zeroUnlock').text('搜索中');
    let trueData = [];
    let trueDatas = [];
    const month_obj = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
    $('body').find('.job-ad-item').remove();
    const baseUrl = window.location.toString();
    const his_url = 'https://finder.susy.mdpi.com/reviewer/susy_invitation_history/';
    const today = getHalfYearAgoToday();
    // 先获取当前页面数据
    $.get(baseUrl, function (data, status) {
      if (status === 'success') {
        const nodeList = $(data).find('.job-ad-item');
        const nodeLen = nodeList.length;
        let num = new Array(nodeLen).fill(false);
        for (let key = 0; key < nodeLen; key++) {
          const item = nodeList[key];
          const email = item.querySelector('.clipboard').getAttribute('data-clipboard-text');
          const emailObj = {
            email,
            result: [],
            number: 0
          }

          let judgeDate = false; // 判断邀请时间在today之前就不查下一页数据
          let jugdeGood = 0; // 判断good出现的次数
          const page = 1;
          recursion(his_url, email, page, emailObj, judgeDate, today, jugdeGood, num, trueData, trueDatas, item, key)
        }

      }

    })
  }

  // 根据邮箱查邀请人历史信息
  function recursion (his_url, email, page, emailObj, judgeDate, today, jugdeGood, num, trueData, trueDatas, item, key) {
    // 根据邮箱查邀请人历史信息
    // 如果邀请人半年内有两个good就保留这条数据
    $.ajax({
      url: his_url + email + '?page=' + page,
      method: 'GET',
      success: function (res) {
        if (res.indexOf('No invitation history') > 1) {
          num[key] = true;
          trueData.push(emailObj);
          judgeFinish(num, trueDatas, trueData, page);
          return;
        }
        const tableDom = page === 1 ? $(res).find('tbody')[0].children : $(res).filter("tr");
        for (let t = 0; t < tableDom.length; t++) {
          if (tableDom[t].children.length > 1) {
            const invite_date = new Date(tableDom[t].children[3].innerText).valueOf();
            const invite_result = tableDom[t].children[5].innerText;
            emailObj.result.push(invite_result);
            if (invite_date < today) {
              judgeDate = true;
              break;
            }
            // 如果邀请时间在半年内 且邀请评分> 4 就jugdeGood+1
            const match = invite_result.match(/Rating:\s*(\d+)\//);
            const rating = match ? isNaN(match[1])? 0 : Number(match[1]) : 0;
            if (invite_date > today && rating > 4) {
              jugdeGood++;
            }
          }
        }
        emailObj.number = jugdeGood;
        if (jugdeGood > 1) {
          num[key] = true;
          jugdeGood = true;
          trueData.push(emailObj);
          trueDatas.push(item);
          judgeFinish(num, trueDatas, trueData, page);
        } else if (!judgeDate) {
          page++;
          recursion(his_url, email, page, emailObj, judgeDate, today, jugdeGood, num, trueData, trueDatas, item, key);
        } else {
          num[key] = true;
          trueData.push(emailObj);
          judgeFinish(num, trueDatas, trueData, page);
        }
      },
      error: function (err) {
        num[key] = true;
        jugdeGood = true;
        judgeFinish(num, trueDatas, trueData, 1);
      },
    })
  }

  // 判断请求完成
  function judgeFinish (num, trueDatas, trueData, type) {
    console.log(num);
    if (num.every(item => item)) {
      $('.featured-top').after(trueDatas);
      console.log(type, trueData);
      $('#zeroUnlock').text('Unlock');

      const loading = '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>';
      $('.overview-btn').click(function (e) {
        e.preventDefault();
        const currentIcon = $(this).html();
        const url = $(this).data('o-url');
        const $this = $(this);
        $(this).html(loading);

        $.ajax({
          url: url,
          method: 'GET',
          success: function (res) {
            $('#overview-div').find('.modal-body').html(res);
            $('#overview-div').modal();
            $this.html(currentIcon)
          },
          error: function (err) {
            alert(err.statusText);
            $this.html(currentIcon);
          }
        });

      });
    }
  }

  $(function () {
    const searchContent = `
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 99999998; font-size: 16px;display: flex;">
      <button id="zeroUnlock" style="padding: 6px 10px;background-color: #21C6E4;border: none;border-radius: 5px;margin-right:15px;">Unlock</button>
      <button id="zeroFilter" style="padding: 6px 10px;background-color: #21C6E4;border: none;border-radius: 5px;">Filter</button>
    </div>
    `
    $('body').append(searchContent);
    $('#zeroFilter').on('click', getNextPageData);
    $('#zeroUnlock').on('click', filterData);
  })

})();