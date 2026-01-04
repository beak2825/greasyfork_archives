// ==UserScript==
// @name         Bonus Dispenser
// @description  Send bonus directly in NHD forum and comment areas.
// @version      3.6.2
// @author       Secant(TYT@NexusHD)
// @include      http*://www.nexushd.org/forums.php?*action=viewtopic*&topicid=*
// @include      http*://www.nexushd.org/forums.php?*topicid=*&action=viewtopic*
// @include      http*://v6.nexushd.org/forums.php?*action=viewtopic*&topicid=*
// @include      http*://v6.nexushd.org/forums.php?*topicid=*&action=viewtopic*
// @include      http*://www.nexushd.org/details.php*
// @include      http*://v6.nexushd.org/details.php*
// @include      http*://www.nexushd.org/offers.php*
// @include      http*://v6.nexushd.org/offers.php*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOFvIgDhbyIA4W8iAOFvIgDhbyIA4W8iAOFvIhrhbyJ54W8ik+FvImThbyIx4W8iDuFvIgDhbyIA4W8iAOFvIgD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A4XAiAOFwIgDhcCIA4XAiAOFwIgDhcCIY4G4h195pH//daB7/3mkf/95qH/7fbCDk4G4huuFwIoXhcCJS4XAiI+FwIgb///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDicSQA4nEkAOJxJADicSQA4nEkAOJxJHnfayH/3Wgg/91oIP/daCD/3Wgg/91pIP/eaSH/3moh/99rIf/fbCL64G4j1+FwI6ricSR14nEkQOJxJBj///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOJzJQDicyUA4nMlAOJzJQDicyUA+uXX6//////////////////////////////////////eayL/3msi/95rIv/ebCL/32wj/99tI//gbiP/4G8k8OFxJMv99O/y//////ro25nicyUM////AP///wD///8A////AP///wD///8A43UnAON1JwDjdScA43UnAON1Jwfzx6jw99vJ///////////////////////55Nf/99vJ/99uJf/fbiX/324l/99uJf/fbiX/324l/99uJf/fbiX/77eS////////////8LmU/uFyJuTicye743UnieN1J0rjdScG////AP///wDkdykA5HcpAOR3KQDkdykA5HcpLOJ0KPzgcij/7rCG////////////8LmU/+ByKP/gcij/4HIo/+ByKP/gcij/4HIo/+ByKP/gcij/4HIo/+SEQ//////////////////wuZT/4HIo/+BzKP/hcyj/4nQo/+N3KaTkdykB////AOR5KwDkeSsA5HkrAOR5KwDkeStY4nYr/+F1K//jfjj////////////pmGD/4XUr/+F1K//hdSv/4XUr/+F1K//hdSv/4XUr/+F1K//hdSv/+N3L//////////////////C6lf/hdSv/4XUr/+F1K//hdSv/4ncr/+R5K1T///8A5XssAOV7LADleywA5XssAOV7LI3jei7/4nku/+J5Lv///////////+mbYv/ieS7/4nku/+J5Lv/ieS7/4nku/+J5Lv/ieS7/4nku/+ujcP//////////////////////8byX/+J5Lv/ieS7/4nku/+J5Lv/jei7/5XssdP///wDlfS4A5X0uAOV9LgDlfS4A5X0vwuN8Mf/jfDH/43wx////////////6p1l/+N8Mf/jfDH/43wx/+N8Mf/jfDH/43wx/+N8Mf/lhD7//O/m///////////////////////xvpj/43wx/+N8Mf/jfDH/43wx/+R8MP/lfS5P////AOaAMADmgDAA5oAwAOaAMBPlgDLm5IA0/+SANP/kgDT////////////roGf/5IA0/+SANP/kgDT/5IA0/+SANP/kgDT/5IA0//PIp//////////////////9+PP///////LAmv/kgDT/5IA0/+SANP/kgDT/5YAy9uaAMB////8A54IyAOeCMgDngjIA54IyN+aDNv/lhDj/5YQ4/+WEOP///////////+yjav/lhDj/5YQ4/+WEOP/lhDj/5YQ4/+WEOP/qm13/////////////////99nB//nhzv//////8sKc/+WEOP/lhDj/5YQ4/+WEN//mgzTQ54IyAv///wDnhDQA54Q0AOeENADnhDRs5oc5/+aIO//miDv/5og7////////////7KZs/+aIO//miDv/5og7/+aIO//miDv/5og7//niz/////////////748//pl1T/+eLP///////zxJ3/5og7/+aIO//miDv/5oc6/+eFNaX///8A////AOiHNgDohzYA6Ic2AOiHN57niz3/54w+/+eMPv/njD7////////////tqW7/54w+/+eMPv/njD7/54w+/+eMPv/wt4f/////////////////88af/+eMPv/548////////PGn//njD7/54w+/+eMPv/nizz/6Ic2bv///wD///8A6Ik4AOiJOADoiTgA6Is7z+iOQf/oj0L/6I9C/+iPQv///////////+6rcf/oj0L/6I9C/+iPQv/oj0L/6ZZO//749P////////////zx6P/oj0L/6I9C//nj0P//////9Meh/+iPQv/oj0L/6I9C/+iMPv/oiTg6////AP///wDpizoA6Ys6AOmLOh7pj0D06ZNF/+mTRf/pk0X/6ZNF////////////7650/+mTRf/pk0X/6ZNF/+mTRf/317r/////////////////7650/+mTRf/pk0X/+uTR///////0yaL/6ZNF/+mTRf/pk0T/6Y8/7OmLOhf///8A////AOqNPADqjTwA6o08SOqTRP/qlkj/6pZI/+qWSP/qlkj////////////vsHb/6pZI/+qWSP/qlkj/77B2//////////////////fYu//qlkj/6pZI/+qWSP/65dL///////XLpP/qlkj/6pZI/+qVR//qjz/G////AP///wD///8A6o8+AOqPPgDqjz5665dI/+uaS//rmkv/65pL/+uaS/////////////CzeP/rmkv/65pL/+uaS//77N7////////////++fT/7KBW/+uaS//rmkv/65pL//rm0///////9c2l/+uaS//rmkv/65hI/+qQP5D///8A////AP///wDrkUAA65FAAOuTQrLsm0z/7J1O/+ydTv/snU7/7J1O////////////8bZ6/+ydTv/snU7/9Mic//////////////////TInP/snU7/7J1O/+ydTv/snU7/+ufT///////2zqf/7J1O/+ydTv/smUn/65FAYP///wD///8A////AOuSQQDrkkEJ7JdH2u2eT//tn1D/7Z9Q/+2fUP/tn1D////////////yt3z/7Z9Q/++rZv/++fX////////////87d//7Z9Q/+2fUP/tn1D/7Z9Q/+2fUP/759T///////bPqP/tn1D/7Z9Q/+yZSf/rkkEt////AP///wD///8A7JRDAOyUQyjtnEz87qJT/+6iU//uolP/7qJT/+6iU/////////////K5fv/uolP/+uLK//////////////////K5fv/uolP/7qJT/+6iU//uolP/7qJT//vo1f//////99Gp/+6iU//uoVL/7ZlJ3uyUQwv///8A////AP///wDtlkQP7ZZEWe6gUP/vpVb/76VW/++lVv/vpVb/76VW////////////87yA//O8gP/////////////////42LX/76VW/++lVv/vpVb/76VW/++lVv/vpVb/++nV///////30qv/76VW/++jU//tmUi1////AP///wD///8A////AO2YRzTumkqM76VW//CpW//wqVv/8Klb//CpW//wqVv////////////0v4T//fXr/////////////vr1//GuZf/wqVv/8Klb//CpW//wqVv/8Klb//CpW//76tb///////jUrf/wqVv/76VW/+2YSIH///8A////AP///wD///8A7ZpKT+6eTqzvqFv/8Kxf//CsX//wrF//8Kxf//CsX/////////////vq1//////////////////2y5v/8Kxf//CsX//wrF//8Kxf//CsX//wrF//8Kxf//vq1///////++rX//CsX//vplj/7ZpKSv///wD///8A////AP///wDunEwf7pxMbPCnWv/xrmL/8a9j//GvY//xr2P/9cOK/////////////////////////////OvY//GvY//xr2P/8a9j//GvY//xr2P/8a9j//GvY//0voD//vr2///////++vb/87h2/++mWPXunEwj////AP///wD///8A////AO6dTgDunU4B7p1OlO+mWfzwql7/+Nu6//zw4v/////////////////////////////////0wIP/8bFm//GxZv/xsWb/8bFm//GxZv/2zqD//PHj///////////////////////++vb//Ovb9f/9/DH///8A////AP///wD///8A7p5QAO6eUADunlAA7p5QJO6eUFP64szM/O3f7vvr2fn76tf/++rY//vr2f/869n/+Ni0//Gyaf/xsmn/8bJp//Gyaf/xsmn/8bJp//bPof/87Nr//Oza//zs2v/87Nr//Oza//vr2f/87+Ho////MP///wD///8A////AP///wDun1IA7p9SAO6fUgDun1IA7p9SAO6fUgDun1IA7p9SDe6fUjTun1Jm76FUme+lWszwqV7x8axi//GuZf/xsGj/8rJq//K0a//ytGz/8rRs//K0bP/ytGz/8rRs//K0bP/ytGz/8a5k/+6fUnL///8A////AP///wD///8A////AO6fUwDun1MA7p9TAO6fUwDun1MA7p9TAO6fUwDun1MA7p9TAO6fUwDun1MA7p9TAO6fUxnun1NC7p9Td++jWKzwp13Y8Kth+/GuZf/xsGj/8rJq//K0bP/ytW7/8rVu//K0bP/wqmD+7p9TMv///wD///8A////AP///wD///8A7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVAbuoFQl7qBUVO+hVYfvpVu88Klg5vCtZP/xrmb/8Kph/u6gVIL///8A////AP///wD///8A////AP///wDuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA////AP///wD///8A////AP///wDuoFQO7qBUNe6gVFnuoFQu////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//////9////8A////AA///gAAH/4AAAP+AAAA/gAAAPwAAAD8AAAA/AAAAPwAAAD8AAAA+AAAAfgAAAH4AAAB+AAAAfgAAAHwAAAD8AAAA/AAAAPwAAAD4AAAA+AAAAfwAAAH8AAAB/4AAAf/8AAP//+AD///+A///////////8=
// @namespace    https://greasyfork.org/users/152136
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33053/Bonus%20Dispenser.user.js
// @updateURL https://update.greasyfork.org/scripts/33053/Bonus%20Dispenser.meta.js
// ==/UserScript==
(function($) {
  'use strict';
  // NHD Constants (Status or Settings)
  const phpType = window.location.href.match(/\/(\w+?)\.php/)[1];
  const nhd2cc98TopicIDs = ['25777'];
  const exchangeRate = 8; // 1 NHD魔力值 = ? 98财富值
  const maxExchangeBonus = 100000; // 最大兑换魔力值
  let thisTID;
  switch (phpType) {
    case 'forums':
      thisTID = window.location.href.match(/topicid=(\d+)/)[1];
      break;
    case 'details':
      thisTID = window.location.href.match(/id=(\d+)/)[1];
      break;
    case 'offers':
      thisTID = window.location.href.match(/id=(\d+)/)[1];
      break;
  }
  const isCC98Topic = phpType === 'forums' && nhd2cc98TopicIDs.includes(thisTID);
  const thisTName = getThisTName();
  const currentPageNum = (window.location.href.match(/page=(\d+)/) || [0,0])[1];
  const minimumBonusGift = 25;
  const maximumBonusGift = 1e7;
  const myBonus = getMyBonus();
  const enoughBonus = myBonus >= minimumBonusGift;
  const defaultBonusGift = 1e3;
  const myUserName = getMyUserName();
  const myUserID = getMyUserID();
  const language = getLanguage();
  /*
  const lastPage = getLastPage();
  const currentPage = getCurrentPage();
  const currentPageLastFloor = getCurrentPageLastFloor();
  */
  const selectCSS = {
    'outline-style': 'solid',
    'outline-color': 'invert',
    'outline-width': '2px',
    'outline-offset': '2px'
  };
  const deselectCSS = {
    'outline-style': '',
    'outline-color': '',
    'outline-width': '',
    'outline-offset': ''
  };

  //Lang Translations
  const ERRCODE = {
    '000': { chs: '未处理的异常！', cht: '未處理的異常！', eng: 'Unhandled Error!' },
    '800': { chs: '你没有足够的魔力值！', cht: '你沒有足夠的魔力值！', eng: 'You Don\'t Have Enough Bonus!' },
    '801': { chs: '无效的目标用户！', cht: '無效的目標用戶！', eng: 'Invalid Target User!' },
    '802': { chs: '魔力值系统暂停开放！', cht: '魔力值系統暫停開放！', eng: 'Bonus System Temporarily Down!' },
    '803': {
      chs: `魔力值数量不允许，应当介于${minimumBonusGift.toFixed(1)}与${maximumBonusGift.toFixed(1)}之间！`,
      cht: `魔力值數量不允許，應當介於${minimumBonusGift.toFixed(1)}與${maximumBonusGift.toFixed(1)}之間！`,
      eng: `Unacceptable Amount of Bonus, Which Should Be From ${minimumBonusGift.toFixed(1)} to ${maximumBonusGift.toFixed(1)}!`
    },
    '804': {
      chs: `你的魔力值数量低于${minimumBonusGift.toFixed(1)}！`,
      cht: `你的魔力值數量低於${minimumBonusGift.toFixed(1)}！`,
      eng: `Your Bonus is Less Than ${minimumBonusGift.toFixed(1)}!`
    },
    '805': { chs: '你没有权限更改NexusHD魔力值！', cht: '你沒有權限更改NexusHD魔力值！', eng: 'You Have No Authority to Modify NexusHD Bonus!' },
    '806': { chs: '魔力值不能为空！', cht: '魔力值不能爲空！', eng: 'Bonus Cannot be Empty!'},
    '807': { chs: '用户没有足够的魔力值！', cht: '用戶沒有足夠的魔力值！', eng: 'The User Does\'t Have Enough Bonus!'},
    '810': { chs: '你没有签名权限！', cht: '你沒有簽名權限！', eng: 'You Have No Permission to Sign!' },
    '820': { chs: '收信人不存在！', cht: '收信人不存在！', eng: 'PM Receiver Don\'t Exist!' },
    '821': { chs: '私信内容不能为空！', cht: '私信內容不能為空！', eng: 'Empty PM Body is Not Permitted!' },
    '900': { chs: '你没有权限发放CC98财富值！', cht: '你沒有權限發放CC98財富值！', eng: 'You Have No Authority to Add CC98 Wealth!' },
    '901': { chs: '兑换数量有误！', cht: '兌換數量有誤！', eng: 'Incorrect Excange Number!' },
    '902': { chs: 'CC98用户不存在！', cht: 'CC98用戶不存在！', eng: 'CC98 User Not Existed!' },
    '903': { chs: '用户本月兑换记录已存在！', cht: '用戶本月兌換記錄已存在！', eng: 'User Exchange History in This Month Existed!' },
  };
  const UI = {
    SOURCE: {
      chs: '来源', cht: '來源', eng: 'Source',
      PERSON: { chs: '个人', cht: '個人', eng: 'Person' },
      SYSTEM: { chs: '公款', cht: '公款', eng: 'System' },
    },
    SIGNED: {
      chs: '签名', cht: '籤名', eng: 'Signed',
      YES: { chs: '有', cht: '有', eng: 'Yes' },
      NO: { chs: '无', cht: '無', eng: 'No' },
    },
    AMOUNT: { chs: '数量', cht: '數量', eng: 'Amount' },
    REASON: { chs: '原因', cht: '原因', eng: 'Reason' },
    SEND: {chs: '发送', cht: '發送', eng: 'Send' },
    RANGE: {
      PAGE: {chs: '页码', cht: '頁碼', eng: 'Page'},
      FLOOR: {chs: '楼层', cht: '樓層', eng: 'Floor'},
      CURRENT_PAGE: {chs: '本页', cht: '本頁', eng: 'CrtPg'}
    },
    NOTENOUGH: bonusAmount => ({
      chs: `该用户魔力值数量不够（${bonusAmount}），是否继续扣除？`,
      cht: `該用戶魔力值數量不夠（${bonusAmount}），是否繼續扣除？`,
      eng: `The user doesn\'t have enough bonus (${bonusAmount}). Continue?`
    })
  };
  const SIGNATURE = {
    PRE: (userName, userClassColor, bonusAmount, reason) => ({
      chs: `此条内容已被[url=userdetails.php?id=${myUserID}]${myUserName}[/url]签名${bonusAmount !== 0 ? `，${bonusAmount > 0 ? '赠送' : '扣除'}用户 [b][color=${userClassColor}]${userName}[/color][/b] ${addComma(Math.abs(bonusAmount))}魔力值。${reason ? `原因：${reason}` : ''}` : `。${reason ? `内容：${reason}` : ''}`}`,
      cht: `此条内容已被[url=userdetails.php?id=${myUserID}]${myUserName}[/url]籤名${bonusAmount !== 0 ? `，${bonusAmount > 0 ? '贈送' : '扣除'}用戶 [b][color=${userClassColor}]${userName}[/color][/b] ${addComma(Math.abs(bonusAmount))}魔力值。${reason ? `原因：${reason}` : ''}` : `。${reason ? `內容：${reason}` : ''}`}`,
      eng: `This content is signed by [url=userdetails.php?id=${myUserID}]${myUserName}[/url]${bonusAmount !== 0 ? `. ${addComma(Math.abs(bonusAmount))} bonus is ${bonusAmount > 0 ? 'sent to' : 'deducted from'} user [b][color=${userClassColor}]${userName}[/color][/b]. ${reason ? `Reason: ${reason}` : ''}` : `. ${reason ? `Comment: ${reason}` : ''}`}`
    }),
  };
  const MESSAGE = {
    BONUS_MESSAGE: reason => ({
      chs: reason ? `${reason}` : ``,
      cht: reason ? `${reason}` : ``,
      eng: reason ? `${reason} ` : ``
    }),
    ADDITIONAL_MESSAGE: link => ({
      chs: `（点击[url=${link}]这里[/url]查看详细信息）`,
      cht: `（點擊[url=${link}]這裏[/url]查看詳細信息）`,
      eng: `(Click [url=${link}]HERE[/url] for the details)`,
    }),
    PRE: bonusAmount => ({
      chs: `${myUserName}${bonusAmount !== 0 ? `${bonusAmount > 0 ? '赠送' : '扣除'}了你${addComma(Math.abs(bonusAmount))}魔力值。` : '提到了你。'}`,
      cht: `${myUserName}${bonusAmount !== 0 ? `${bonusAmount > 0 ? '贈送' : '扣除'}了你${addComma(Math.abs(bonusAmount))}魔力值。` : '提到了你。'}`,
      eng: `${myUserName}${bonusAmount !== 0 ? `${bonusAmount > 0 ? ` sent ${addComma(Math.abs(bonusAmount))} bonus to` : ` deducted ${addComma(Math.abs(bonusAmount))} bonus from`} you.` : ' mentioned you.'}`
    }),
    REASON: (bonusAmount, reason) => ({
      chs: `${reason ? `${bonusAmount !== 0 ? '原因' : '内容'}：${reason}` : ''}`,
      cht: `${reason ? `${bonusAmount !== 0 ? '原因' : '內容'}：${reason}` : ''}`,
      eng: `${reason ? `${bonusAmount !== 0 ? ' Reason' : ' Comment'}: ${reason} ` : ' '}`
    })
  };
  const N298 = {
    NHD_MESSAGE_CC98: userNameCC98 => ({
      chs: `${userNameCC98} 兑换CC98财富值`,
      cht: `${userNameCC98} 兌換CC98財富值`,
      eng: `${userNameCC98} changes NexusHD bonus into CC98 wealth`,
    }),
    RELOGIN: {
      chs: '帐号或密码错误，是否重新尝试？',
      cht: '帳號或密碼錯誤，是否重新嘗試？',
      eng: 'Wrong username or password. Try again?'
    },
    CONFIRM: {
      chs: '已找到该用户本月兑换历史记录，是否仍然兑换？',
      cht: '已找到該用戶本月兌換歷史記錄，是否仍然兌換？',
      eng: 'Exchange history in this month is found. Continue?'
    },
    MOSTRECENT: {
      chs: '本月已兑换，请不要重复回帖，最近一次兑换时间：',
      cht: '本月已兑换，請不要重復回帖，最近一次兌換時間：',
      eng: 'Exchange history in this month is found. The most recent time: '
    },
    CC98_MESSAGE: (userNameCC98, userNameNHD, timeString) => ({
      chs: `${userNameCC98} 魔力值兑换，NexusHD用户名：${userNameNHD}，申请时间：${timeString}`,
      cht: `${userNameCC98} 魔力值兌換，NexusHD用戶名：${userNameNHD}，申請時間：${timeString}`,
      eng: `${userNameCC98} bonus exchange. NexusHD username：${userNameNHD}. Application Time: ${timeString}`
    })
  }

  //CC98 Constants (Status or Settings)
  const clientID = '5ef9fc60-4af4-4eec-f967-08d5a39a2737';
  const clientSecret = 'e104d202-4b62-4934-984a-fce6a30aa6db';
  // v4
  const tokenUrl = 'https://qsh.openid.cc98.top/connect/token';
  const apiBaseUrl = 'https://qsh.api.cc98.top'
  // v6
  // const tokenUrl = 'https://v6.openid.cc98.fun/connect/token';
  // const apiBaseUrl = 'https://v6.api.cc98.fun'
  // 内网
  // const tokenUrl = 'https://openid.cc98.org/connect/token';
  // const apiBaseUrl = 'https://api-v2.cc98.org'
  const getRecordUrl = '/super-manage/nhd-add-wealth-record';
  const addWealthUrl = '/super-manage/add-wealth';

  // Helper Functions
  function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  function addComma(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  function $$(htmlString) {
    return $(htmlString, document.implementation.createHTMLDocument('virtual'));
  }
  function getMyBonus() {
    return parseFloat($('#info_block .medium a[href="mybonus.php"]')[0].nextSibling.textContent.match(/[\d,\.]+/)[0].replace(/,/g,''));
  }
  function getMyUserName() {
    return $('#info_block a[href^="userdetails.php"]').text();
  }
  function getMyUserID() {
    return $('#info_block a[href^="userdetails.php"]')[0].href.match(/id=(\d+)/)[1];
  }
  function getThisTName() {
    return $('#top').text();
  }
  function getLanguage() {
    switch ($('#info_block').text().trim()[0]) {
      case '欢':
        return 'chs';
        break;
      case '歡':
        return 'cht';
        break;
      case 'W':
        return 'eng';
        break;
      default:
        return 'eng';
        break;
    }
  }
  function getDateTime() {
    const m = new Date();
    const dateString =
          m.getFullYear() + '-' +
          ("0" + (m.getMonth() + 1)).slice(-2) + '-' +
          ("0" + m.getDate()).slice(-2) + " " +
          ("0" + m.getHours()).slice(-2) + ":" +
          ("0" + m.getMinutes()).slice(-2) + ":" +
          ("0" + m.getSeconds()).slice(-2);
    return dateString;
  }
  function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }
  function transBackground($target, second, color) {
    $target.css({
      '-webkit-transition': `background ${second}s`,
      '-moz-transition': `background ${second}s`,
      '-o-transition': `background ${second}s`,
      'transition': `background ${second}s`,
      'backgroundColor': color
    });
  }
  /*
  function getLastPageLastFloor() {
    return parseInt($('#outer p[align="center"]:first>br~').contents().slice(-1).text().match(/\d+$/)[0]);
  }
  function getCurrentPageFloorRange() {
    return $('#outer p[align="center"]:first font.gray:last').text().match(/^(\d+) - (\d+)$/).slice(1,3).map(e => parseInt(e))
  }
  // Async Helper Functions
  async function getLastFloor(){
    if (currentPage === lastPage) {
      return getCurrentPageLastFloor();
    }
    else {
      const resp = fetch(window.location.href + '&page=last', {
        method: 'GET'
      });
      if (resp.ok) {
        const respText = await resp.text();
        return parseInt($$(respText).find('[id^="pid"] font.big:last').text());
      }
      else {
        return getCurrentPageLastFloor();
      }
    }
  }
  */

  // Blink Background
  async function blinkBackground($target, seconds, newColor, originalColor) {
    transBackground($target, seconds[0], newColor);
    return await new Promise(
      resolve => setTimeout(() => {
        transBackground($target, seconds[1], originalColor);
        resolve(200);
      }, seconds[0]*1000)
    );
  }

  // Precheck Functions
  async function checkAuthority() {
    try {
      const resp = await fetch('/amountbonus.php', {
        method: 'GET'
      });
      if (resp.ok) {
        const respText = await resp.text();
        return Boolean($$(respText).find('form[action="amountbonus.php"]').length);
      }
      else {
        throw false;
      }
    }
    catch (e) {
      return false;
    }
  }
  async function checkGiftable() {
    try {
      const resp = await fetch('/mybonus.php', {
        method: 'GET'
      });
      if (resp.ok) {
        const respText = await resp.text();
        return Boolean($$(respText).find('input[name="bonusgift"]').length);
      }
      else {
        throw false;
      }
    }
    catch (e) {
      return false;
    }
  }
  async function getPostsPerPage() {
    if (['details.php', 'offers.php'].includes(phpType)) {
      return 10;
    }
    else {
      try {
        const resp = await fetch('/usercp.php?action=forum', {
          method: 'GET'
        });
        if (resp.ok) {
          const respText = await resp.text();
          return parseInt($$(respText).find('input[name="postsperpage"]').val()) || 10;
        }
        else {
          throw false;
        }
      }
      catch (e) {
        return 10;
      }
    }
  }

  // Async Functions
  async function getUserBonusAmount(userID) {
    try {
      const resp = await fetch(`/userdetails.php?id=${userID}`, {
        method: 'GET'
      });
      if (resp.ok) {
        const respText = await resp.text();
        return parseFloat(
          $$(respText)
          .find('#outer .main td.rowhead')
          .filter(
            (_, e) => e.textContent.match(/魔力值|魔力值|Karma/)
          )
          .next()[0]
          .textContent
        );
      }
      else {
        throw resp;
      }
    }
    catch (e) {
      console.log(e);
      return NaN;
    }
  }
  async function giveGiftPersonal(userName, bonusAmount, bonusMessage = '') {
    const resp = await fetch('/mybonus.php?action=exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        option: 7,
        username: userName,
        bonusgift: bonusAmount,
        message: bonusMessage
      })
    });
    if (resp.ok) {
      const respText = await resp.text();
      if (respText.includes('mybonus.php?do=transfer')) {
        return 200;
      }
      else{
        const $vdom = $$(respText);
        const message = $vdom.find('#outer table:not(".main")').text();
        if (message.match(/你没有足够的魔力值|你沒有足夠的魔力值|you don't have enough Karma points/i)) {
          throw 800;
        }
        else if (message.match(/不存在该用户|不存在該用戶|No User with that username/i)) {
          throw 801;
        }
        else if (message.match(/\d{1,2}\:\d{2}/i)) {
          throw 802;
        }
        else if (message.match(/魔力值数量不允许|魔力值數量不允許|Bonus amount not allowed/i)) {
          throw 803;
        }
        else if (message === '') {
          throw 804;
        }
        else {
          throw resp;
        }
      }
    }
    else {
      throw resp;
    }
  }
  async function giveGiftSystem(userName, bonusAmount) {
    const resp = await fetch('/amountbonus.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: userName,
        seedbonus: bonusAmount
      })
    });
    if (resp.ok) {
      if (resp.redirected) {
        return 200;
      }
      else {
        const respText = await resp.text();
        const $vdom = $$(respText);
        const message = $vdom.find('#outer table:not(".main")').text();
        if (message.match(/Unable to update account/i)) {
          throw 801;
        }
        else if (message.match(/Access denied/i)) {
          throw 805;
        }
        else {
          throw resp;
        }
      }
    }
    else {
      throw resp;
    }
  }
  async function sendPersonalMail(userID, subject, body, save = 'no') {
    const resp = await fetch('/takemessage.php', {
      method: 'POST',
      body: new URLSearchParams({
        receiver: userID,
        subject: subject,
        body: body,
        save: save
      })
    });
    if (resp.ok) {
      const respText = await resp.text();
      const $vdom = $$(respText);
      const message = $vdom.find('#outer table:not(".main")').text();
      if (message.match(/短讯已成功发送|短訊已成功發送|Message was successfully sent/i)) {
        return 200;
      }
      else if (message.match(/不存在该账号|不存在該帳號|No user with this ID/i)) {
        throw 820;
      }
      else if (message.match(/不能为空|不能為空|Please enter something/i)) {
        throw 821;
      }
      else {
        throw resp;
      }
    }
    else {
      throw resp;
    }
  }
  async function getForm(ID) {
    let resp;
    switch(phpType) {
      case 'forums':
        resp = await fetch(`/forums.php?action=editpost&postid=${ID}`);
        break;
      case 'details':
        resp = await fetch(`/comment.php?action=edit&cid=${ID}&type=torrent`);
        break;
      case 'offers':
        resp = await fetch(`/comment.php?action=edit&cid=${ID}&type=offer`);
        break;
    }
    if (resp.ok) {
      const respText = await resp.text();
      const formDOM = $$(respText).find('#compose')[0];
      if (formDOM === undefined) {
        throw 810;
      }
      else{
        return new URLSearchParams(new FormData(formDOM));
      }
    }
    else {
      throw resp;
    }
  }
  async function previewHTML(bbcode) {
    const formData = new FormData();
    formData.append('body', bbcode);
    const resp = await fetch('/preview.php', {
      method: 'POST',
      body: formData
    });
    if (resp.ok) {
      const respText = await resp.text();
      return respText.slice(87,-18);
    }
    else {
      console.log(resp);
      return '<b><font color="red">Some Thing Went Wrong When Previewing The HTML!</font></b>';
    }
  }
  async function sign(container, form) {
    const bonusAmount = form.bonus_amount_num;
    const URLParams = await getForm(container.ID);
    let quoteHeader;
    if (bonusAmount > 0) {
      quoteHeader = dateTime => `[b][color=Green]${dateTime}[/color][/b]`;
    }
    else if (bonusAmount < 0) {
      quoteHeader = dateTime => `[b][color=Red]${dateTime}[/color][/b]`;
    }
    else if (bonusAmount === 0) {
      quoteHeader = dateTime => `[b]${dateTime}[/b]`;
    }
    const content = SIGNATURE.PRE(container.userName, container.userClassColor, bonusAmount, form.bonus_message)[language];
    const signature = dateTime => `\n[quote=${quoteHeader(dateTime)}]${content}[/quote]`;
    const newBody = URLParams.get('body') + signature(getDateTime());
    URLParams.set('body', newBody);
    let resp;
    switch(phpType) {
      case 'forums':
        resp = await fetch('/forums.php?action=post', {
          method: 'POST',
          body: URLParams
        });
        break;
      case 'details':
        resp = await fetch(`/comment.php?action=edit&cid=${container.ID}&type=torrent`, {
          method: 'POST',
          body: URLParams
        });
        break;
      case 'offers':
        resp = await fetch(`/comment.php?action=edit&cid=${container.ID}&type=offer`, {
          method: 'POST',
          body: URLParams
        });
        break;
    }
    if (!resp.ok) {
      console.log(resp);
      newBody = '[b][color=red]Something Went Wrong When Editing The Post![/color][/b]';
    }
    const newHTML = await previewHTML(newBody);
    switch (phpType) {
      case 'forums':
        container.body.innerHTML = newHTML;
        break;
      case 'details':
        container.body.innerHTML = '<br>' + newHTML;
        break;
      case 'offers':
        container.body.innerHTML = '<br>' + newHTML;
        break;
    }
  }
  async function refreshMyBonus() {
    try {
      const resp = await fetch('/invite.php', {
        method: 'GET'
      });
      if (resp.ok) {
        const respText = await resp.text();
        $('#info_block .medium a[href="mybonus.php"]')[0].nextSibling.textContent = $$(respText).find('#info_block .medium a[href="mybonus.php"]')[0].nextSibling.textContent;
        return 200;
      }
      else {
        throw resp;
      }
    }
    catch (e) {
      console.log(e);
      alert('Cannot refresh you bonus!');
    }
  }

  // CC98 Async Functions
  async function getToken(userName, password) {
    const listParam = new URLSearchParams({
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'password',
      scope: 'cc98-api openid offline_access',
      username: userName,
      password: password
    }).toString();
    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: listParam
    });
    if (resp.ok) {
      const token = await resp.json();
      localStorage.setItem('tokenN298', JSON.stringify(token));
      return token;
    }
    else {
      throw resp;
    }
  }
  async function refreshToken(refreshToken) {
    const listParam = new URLSearchParams({
      client_id: clientID,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: listParam
    });
    if (resp.ok) {
      const token = await resp.json();
      localStorage.setItem('tokenN298', JSON.stringify(token));
      return token;
    }
    else {
      throw resp;
    }
  }
  async function getRecord(year, month, accessToken) {
    const resp = await fetch(`${apiBaseUrl}${getRecordUrl}?year=${year}&month=${month}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (resp.ok) {
      return await resp.json();
    }
    else {
      throw resp;
    }
  }
  async function addWealth(userName, value, reason, accessToken) {
    const resp = await fetch(`${apiBaseUrl}${addWealthUrl}?username=${userName}`, {
      method: 'put',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        Reason: reason,
        Value: value
      })
    });
    if (resp.ok) {
      return 200;
    }
    else {
      throw resp;
    }
  }

  // CC98 Async Wrappers
  async function prompt2Login2GetToken() {
    const defaultUserN298 = localStorage.getItem('userN298') || '';
    const userN298 = prompt('Username: ', defaultUserN298);
    if (userN298 === null) {
      return null;
    }
    localStorage.setItem('userN298', userN298);
    const pswdN298 = prompt('Password: ');
    if (pswdN298 === null) {
      return null;
    }
    try {
      return await getToken(userN298, pswdN298);
    }
    catch (e) {
      if (confirm(N298.RELOGIN[language])) {
        return await prompt2Login2GetToken();
      }
      else {
        throw e;
      }
    }
  }
  async function getTokenWrapper() {
    let token;
    try {
      token = JSON.parse(localStorage.getItem('tokenN298'));
      if (!token) {
        token = await prompt2Login2GetToken();
      }
    }
    catch (e) {
      if (e.name === 'SyntaxError') {
        token = await prompt2Login2GetToken();
      }
      else {
        throw 900;
      }
    }
    return token;
  }
  async function getRecordWrapper(year, month, retry = true) {
    let tokenN298 = await getTokenWrapper();
    if (tokenN298 === null) {
      return null;
    }
    try {
      return await getRecord(year, month, tokenN298.access_token);
    }
    catch (e) {
      switch (e.status) {
        case 401:
          if (retry) {
            try {
              tokenN298 = await refreshToken(tokenN298.refresh_token);
            }
            catch (e) {
              tokenN298 = await prompt2Login2GetToken();
            }
            if (tokenN298 === null) {
              return null;
            }
            return await getRecordWrapper(year, month, false);
          }
          else {
            throw 900;
          }
          break;
        default:
          throw e;
          break;
      }
    }
  }
  async function addWealthWrapper(username, value, reason, retry = true) {
    let tokenN298 = await getTokenWrapper();
    if (tokenN298 === null) {
      return null;
    }
    try {
      return await addWealth(username, value, reason, tokenN298.access_token);
    }
    catch (e) {
      switch (e.status) {
        case 401:
          if (retry) {
            try {
              tokenN298 = await refreshToken(tokenN298.refresh_token);
            }
            catch (e) {
              tokenN298 = await prompt2Login2GetToken();
            }
            if (tokenN298 === null) {
              return null;
            }
            return await addWealthWrapper(username, value, reason, false);
          }
          else {
            throw 900;
          }
          break;
        case 400:
          throw 901;
          break;
        case 404:
          throw 902;
          break;
        default:
          throw e;
          break;
      }
    }
  }

  // Foot Bonus Dispenser Implementation
  const $containers = $('div')
    .has($('table[id^="pid"],table[id^="cid"]').find('a[href^="userdetails.php?id="]'))
    .next('table.main')
    .find('.toolbox[align="right"]');
  $containers.prepend((index, element) => {
    // Constants
    const container = $containers[index];
    const $container = $(container);
    const $info = $container.closest('table.main').prev();
    const user = $info.find('a[href^="userdetails.php?id="]')[0];
    container.userID = user.href.match(/id=(\d+)/)[1];
    container.userName = user.innerText;
    container.userClassColor = rgb2hex(window.getComputedStyle(user, null).getPropertyValue('color'));
    container.timeString = $info.text().match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0];
    container.ID = $info[0].firstChild.id.match(/\d+/)[0];
    switch (phpType) {
      case 'forums':
        container.link = `forums.php?action=viewtopic&topicid=${thisTID}&page=p${container.ID}#pid${container.ID}`;
        container.body = $container.closest('table.main').find(`div#pid${container.ID}body`)[0];
        break;
      case 'details':
        container.link = `details.php?id=${thisTID}&page=${currentPageNum}#cid${container.ID}`;
        container.body = $container.closest('table.main').find('td.rowfollow:nth-of-type(2)')[0];
        break;
      case 'offers':
        container.link = `offers.php?id=${thisTID}&page=${currentPageNum}&off_details=1#cid${container.ID}`;
        container.body = $container.closest('table.main').find('td.rowfollow:nth-of-type(2)')[0];
        break;
    }
    const $bodyClone = $(container.body).clone();
    {
      $bodyClone.find('br:first-child').remove;
      const removableP = $bodyClone.find('p:has("font")');
      const removableBr = removableP.prev('br');
      const removableNewline = $((removableP[0]||[{}]).nextSibling);
      removableNewline.remove();
      removableBr.remove();
      removableP.remove();
    }
    container.bodyContent = $bodyClone.text();
    container.editable = Boolean($container.find('img.f_edit').length);
    container.originalBackgroundColor = $container.css('backgroundColor');

    // Elements
    const $selectBonusSource = $(`<select disabled class="med" name="bonus_source"><option value="0">${UI.SOURCE.PERSON[language]}</option></select>`);
    const $inputBonusAmount = $(`<input ${enoughBonus ? '': 'disabled '}type="number" name="bonus_amount" list="bonus-amount-choice" value="${Math.max(minimumBonusGift, Math.min(defaultBonusGift, myBonus))}" required="required" step="0.1" style="width: 100px" max="${Math.min(maximumBonusGift, myBonus)}" min="${minimumBonusGift}">`);
    const $inputBonusAmountList = $(`<datalist disabled id="bonus-amount-choice">${[[-100000, '-10w'], [-10000, '-1w'], [0, '0'], [3000, '3k'], [5000, '5k'], [10000, '1w'], [100000, '10w']].map(e=>`<option value="${e[0]}">${e[1]}</option>`).join('')}</datalist>`);
    const $inputBonusMessage = $(`<input ${enoughBonus ? '': 'disabled '}type="text" name="bonus_message" style="width: 100px">`);
    const $selectBonusSignature = $(`<select ${container.editable & enoughBonus ? '' : 'disabled '}class="med" name="bonus_signature"><option value="0">${UI.SIGNED.NO[language]}</option>${container.editable ? `<option value="1" selected>${UI.SIGNED.YES[language]}</option>` : ''}</select>`);
    const $inputSendBonus = $(`<input ${enoughBonus ? '': 'disabled '}type="submit" class="med" name="send_bonus" value="${UI.SEND[language]}">`);
    const $table = $('<table border="0" cellspacing="0" cellpadding="0" align="left" style="margin-top: 2px"><tbody><tr><td class="embedded"></td></tr></tbody></table>');
    const $form = $('<form/>').append($table);
    $table.find('td').append(`${UI.SOURCE[language]}&nbsp;`).append($selectBonusSource)
    .append(`&nbsp;${UI.SIGNED[language]}&nbsp;`).append($selectBonusSignature)
    .append(`&nbsp;${UI.AMOUNT[language]}&nbsp;`).append($inputBonusAmount).append($inputBonusAmountList)
    .append(`&nbsp;${UI.REASON[language]}&nbsp;`).append($inputBonusMessage)
    .append('&nbsp;').append($inputSendBonus);

    container.selectBonusSource = $selectBonusSource[0];
    container.inputBonusAmount = $inputBonusAmount[0];
    container.inputBonusMessage = $inputBonusMessage[0];
    container.selectBonusSignature = $selectBonusSignature[0];
    container.inputSendBonus = $inputSendBonus[0];
    container.form = $form[0];
    container.table = $table[0];
    container.selected = false;
    container.copyPasteEvent = (evt) => {
      if (evt.ctrlKey) {
        if(evt.which === 67) {
          localStorage.setItem('BonusConfig', JSON.stringify(Object.fromEntries(new FormData(container.form))));
        }
        else if(evt.which === 86){
          let bonusConfig = localStorage.getItem('BonusConfig');
          if (bonusConfig) {
            bonusConfig = JSON.parse(bonusConfig);
            localStorage.setItem('PrevBonusConfig', JSON.stringify(Object.fromEntries(new FormData(container.form))));
            for (let key in bonusConfig) {
              container.form.elements[key].value = bonusConfig[key];
            }
          }
        }
        else if(evt.which === 90){
          evt.preventDefault();
          let prevBonusConfig = localStorage.getItem('PrevBonusConfig');
          if (prevBonusConfig) {
            prevBonusConfig = JSON.parse(prevBonusConfig);
            localStorage.removeItem('PrevBonusConfig');
            for (let key in prevBonusConfig) {
              container.form.elements[key].value = prevBonusConfig[key];
            }
          }
        }
      }
      else if (evt.which === 27) {
        localStorage.removeItem('PrevBonusConfig');
        localStorage.removeItem('BonusConfig');
        $containers.map((_, e) => e.set(false));
      }
    };
    container.set = (state) => {
      if (state === false) {
        container.selected = false;
        $(container.table).css(deselectCSS);
        $('body').off('keydown', container.copyPasteEvent);
      }
      else if (state === true) {
        container.selected = true;
        $(container.table).css(selectCSS);
        $('body').on('keydown', container.copyPasteEvent);
      }
    }
    // Events
    $selectBonusSource
      .add($inputBonusAmount)
      .add($inputBonusMessage)
      .add($selectBonusSignature)
      .add($inputSendBonus)
      .add($container.find('a')).on('click', (evt) => {
      evt.stopPropagation();
      $containers.map((_, e) => {
        if (e.selected) {
          e.set(false);
        }
      });
    });
    $selectBonusSource.on('change', (evt) => {
      switch($(evt.currentTarget).val()){
        case '0':
          {
            const myBonus = getMyBonus();
            const enoughBonus = myBonus >= minimumBonusGift;
            $inputBonusAmountList.prop('disabled', true);
            $inputBonusAmount.removeAttr('list');
            if (!enoughBonus) {
              $inputBonusAmount.val(minimumBonusGift);
              $inputBonusAmount.prop('disabled', true);
              $inputBonusMessage.prop('disabled', true);
              $selectBonusSignature.prop('disabled', true);
              $inputSendBonus.prop('disabled', true);
            }
            else {
              $inputSendBonus.prop('disabled', false);
              $inputBonusAmount.attr({
                max: Math.min(maximumBonusGift, myBonus),
                min: minimumBonusGift
              }).trigger('change');
            }
          }
          break;
        case '1':
          $inputBonusAmount.prop('disabled', false);
          $inputBonusAmount.attr('list', 'bonus-amount-choice');
          $inputBonusAmountList.prop('disabled', false);
          $inputBonusMessage.prop('disabled', false);
          $inputSendBonus.prop('disabled', false);
          if (container.editable) {
            $selectBonusSignature.prop('disabled', false);
          }
          $inputBonusAmount.removeAttr('max min');
          break;
      }
    });
    $inputBonusAmount.on('change', (evt) => {
      const target = evt.currentTarget;
      let amount = parseFloat($(target).val());
      const max = parseFloat(target.max) || Infinity;
      const min = parseFloat(target.min) || -Infinity;
      if (amount > max) {
        amount = max;
      }
      else if (amount < min) {
        amount = min;
      }
      else {
        if(amount !== parseInt(amount)){
          amount = amount.toFixed(1);
        }
      }
      $(target).val(amount);
    });
    $inputSendBonus.on('click', async (evt) => {
      evt.preventDefault();
      const $target = $(evt.currentTarget);
      $target.prop('disabled', true);
      const form = Object.fromEntries(new FormData($form[0]));
      form.bonus_source = form.bonus_source || '0';
      form.bonus_signature = form.bonus_signature || '0';
      form.bonus_amount_num = parseFloat(form.bonus_amount);
      try {
        if (isNaN(form.bonus_amount_num)) throw 806;
        switch(form.bonus_source) {
          case('0'):
            {
              let additionalMessage = MESSAGE.ADDITIONAL_MESSAGE(container.link)[language];
              if (!form.bonus_message) {
                additionalMessage = additionalMessage.slice(1, -1);
              }
              await giveGiftPersonal(container.userName, form.bonus_amount_num, `${MESSAGE.BONUS_MESSAGE(form.bonus_message)[language]}${additionalMessage}`);
              await refreshMyBonus();
              if (form.bonus_signature === '1') {
                await sign(container, form);
              }
              else {
                await blinkBackground($container, [0.05, 0.3], '#c4e2d8', container.originalBackgroundColor);
              }
              $selectBonusSource.trigger('change');
              $containers.filter((i, _) => i !== index).one('mouseover', (evt) => {
                $(evt.currentTarget.selectBonusSource).trigger('change');
              });
            }
            break;
          case('1'):
            {
              let temp;
              if (form.bonus_amount_num < 0 && form.bonus_amount_num + (temp = await getUserBonusAmount(container.userID)) < 0) {
                if(!confirm(UI.NOTENOUGH(temp)[language])) {
                  throw 807;
                }
              }
              if (isCC98Topic && form.bonus_amount_num < 0 && (temp = form.bonus_message.match(N298.NHD_MESSAGE_CC98('^(\\S+)')[language]))) {
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1;
                const record = await getRecordWrapper(year, month);
                if (record === null) {
                  $selectBonusSource.trigger('change');
                  break;
                }
                const userNameCC98 = temp[1];
                const historyRecord = record.filter(e => {
                    if (e.content.match(new RegExp('\\b' + escapeRegex(userNameCC98)) + '\\b|\\b' + escapeRegex(container.userName) + '\\b')) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if ((temp = historyRecord.length) > 0) {
                  if (!confirm(N298.CONFIRM[language])) {
                    console.log(historyRecord);
                    $inputBonusAmount.val(0);
                    $inputBonusMessage.val(`${N298.MOSTRECENT[language]}${historyRecord[temp - 1].time.replace('T', ' ')}`);
                    throw 903;
                  }
                }
                const result = await addWealthWrapper(userNameCC98, -form.bonus_amount_num*exchangeRate, N298.CC98_MESSAGE(userNameCC98, container.userName, container.timeString)[language]);
                if (result === null) {
                  $selectBonusSource.trigger('change');
                  break;
                }
              }
              await giveGiftSystem(container.userName, form.bonus_amount_num);
              const refresh = container.userName === myUserName;
              if (refresh) {
                await refreshMyBonus();
              }
              await sendPersonalMail(
                container.userID,
                `${MESSAGE.PRE(form.bonus_amount_num)[language].slice(0, -1)} @${thisTID} ${thisTName} #${container.ID}`,
                `${MESSAGE.PRE(form.bonus_amount_num)[language]}${MESSAGE.REASON(form.bonus_amount_num, form.bonus_message)[language]}${MESSAGE.ADDITIONAL_MESSAGE(container.link)[language]}`
              );
              if (form.bonus_signature === '1') {
                await sign(container, form);
              }
              else {
                await blinkBackground($container, [0.05, 0.3], '#c4e2d8', container.originalBackgroundColor);
              }
              $selectBonusSource.trigger('change');
              if (refresh) {
                $containers.filter((i, _) => i !== index).one('mouseover', (evt) => {
                  $(evt.currentTarget.selectBonusSource).trigger('change');
                });
              }
            }
            break;
        }
      }
      catch (e) {
        if (e in ERRCODE) {
          alert(ERRCODE[e][language]);
          $target.prop('disabled', false);
        }
        else {
          alert(ERRCODE['000'][language]);
          $target.prop('disabled', false);
          throw e;
        }
      }
    });

    $table.hide();
    return $form;
  });
  $containers.on('click', (evt) => {
    const activeContainer = evt.currentTarget;
    if (activeContainer.selected) {
      localStorage.removeItem('PrevBonusConfig');
      localStorage.removeItem('BonusConfig');
      activeContainer.set(false);
    }
    else {
      localStorage.removeItem('PrevBonusConfig');
      $containers.map((_, e) => {
        if (e.selected) {
          e.set(false);
        }
      });
      activeContainer.set(true);
    }
  });
  Promise.all([checkAuthority(), checkGiftable()]).then(([auth, giftable]) => {
    if (auth) {
      $containers.map((i, e) => {
        $(e.selectBonusSource).prop('disabled', false).append($(`<option value="1" selected>${UI.SOURCE.SYSTEM[language]}</option>`)).trigger('change');
        if (isCC98Topic) {
          let defaultBonusGift98;
          let defaultBonusMessage98;
          let matchStr = e.bodyContent.match(/([\d,，]+0{3})[^\d\n]*(?:$|\n)(?!.*?[\d,，]+0{3})/);
          if (matchStr) {
            defaultBonusGift98 = -parseInt(matchStr[1].replace(/[,，]/g, ''));
          }
          else if ((matchStr = e.bodyContent.match(/([\d,\.]+)\s*w\b[^\d]*$/i))) {
            defaultBonusGift98 = -parseFloat(matchStr[1].replace(/[,，]/g, ''))*10000;
          }
          else if ((matchStr = e.bodyContent.match(/([\d,\.]+)\s*k\b[^\d]*$/i))) {
            defaultBonusGift98 = -parseFloat(matchStr[1].replace(/[,，]/g, ''))*1000;
          }
          else {
            defaultBonusGift98 = 0;
          }
          if (defaultBonusGift98 < 0 && defaultBonusGift98 >= -maxExchangeBonus && (matchStr = e.bodyContent.trim().match(/^[^\n]+\n.*?([^\s:：]+)\n/))) {
            let userNameCC98 = matchStr[1];
            $(e.inputBonusAmount).val(defaultBonusGift98);
            $(e.inputBonusMessage).val(N298.NHD_MESSAGE_CC98(userNameCC98)[language]);
          }
        }
        else {
          $(e.inputBonusAmount).val(defaultBonusGift);
        }
        if (!giftable || e.userName === myUserName) {
          $(e.selectBonusSource).find('option[value="0"]').remove();
        }
        $(e.table).show();
      });
    }
    else if (giftable && !auth) {
      $containers.filter((_, e) => e.userName !== myUserName).map((_, e) => e.table).show();
    }
  });
  /*
  // Head Bonus Dispenser Implementation
  const $container = $('<td class="toolbox" align="center">');
  $('#outer table.main').next('table').children('tbody').prepend($('<tr>').append($container));
  $container.append((_, element) => {
    const container = $container[0];
    container.editable = Boolean($container.parents('table.main').find('img.f_edit').length);

    const $selectRangeType = $(`<select class="med" name="range_type"><option value="0">${UI.RANGE.PAGE[language]}</option><option value="1">${UI.RANGE.FLOOR[language]}</option></select>`);

    const $spanPageRange = $(`<span>`);
    const $inputStartPage = $(`<input type="number" name="start_page" value="1" min="1" max="${lastPage}" step="1">`);
    const $inputEndPage = $(`<input type="number" name="end_page" value="${lastPage}" min="1" max="${lastPage}" step="1">`);
    const $inputThisPageAsStartPage = $(`<input type="submit" class="med" name="this_as_start_page" value="${UI.RANGE.CURRENT_PAGE[language]}">`);
    const $inputThisPageAsEndPage = $(`<input type="submit" class="med" name="this_as_end_page" value="${UI.RANGE.CURRENT_PAGE[language]}">`);

    const $spanFloorRange = $(`<span hidden>`);
    const $inputStartFloor = $(`<input type="number" name="start_floor" value="1" min="1" max="${currentPageLastFloor}" step="1">`);
    const $inputEndFloor = $(`<input type="number" name="end_floor" value="${currentPageLastFloor}" min="1" max="${currentPageLastFloor}" step="1">`);
    const $inputThisPageAsStartFloor = $(`<input type="submit" class="med" name="this_as_start_floor" value="${UI.RANGE.CURRENT_PAGE[language]}">`);
    const $inputThisPageAsEndFloor = $(`<input type="submit" class="med" name="this_as_end_floor" value="${UI.RANGE.CURRENT_PAGE[language]}">`);

    const $selectBonusSource = $(`<select disabled class="med" name="bonus_source"><option value="0">${UI.SOURCE.PERSON[language]}</option></select>`);
    //const $selectBonusSignature = $(`<select ${container.editable & enoughBonus ? '' : 'disabled '}class="med" name="bonus_signature"><option value="0">${UI.SIGNED.NO[language]}</option>${container.editable ? `<option value="1" selected>${UI.SIGNED.YES[language]}</option>` : ''}</select>`);
    const $inputBonusAmount = $(`<input ${enoughBonus ? '': 'disabled '}type="number" name="bonus_amount" list="bonus-amount-choice" value="${Math.max(minimumBonusGift, Math.min(defaultBonusGift, myBonus))}" required="required" step="0.1" style="width: 100px" max="${Math.min(maximumBonusGift, myBonus)}" min="${minimumBonusGift}">`);
    const $inputBonusAmountList = $(`<datalist disabled id="bonus-amount-choice">${[[-100000, '-10w'], [-10000, '-1w'], [0, '0'], [3000, '3k'], [5000, '5k'], [10000, '1w'], [100000, '10w']].map(e=>`<option value="${e[0]}">${e[1]}</option>`).join('')}</datalist>`);

    $spanPageRange.append($inputStartPage).append($inputThisPageAsStartPage).append($inputEndPage).append($inputThisPageAsEndPage);
    $spanFloorRange.append($inputStartFloor).append($inputThisPageAsStartFloor).append($inputEndFloor).append($inputThisPageAsEndFloor);

    const $table = $('<table border="0" cellspacing="0" cellpadding="0" align="center"><tbody/></table>');
    const $form = $('<form>').append($table);

    $table.append($('<tr>').append($('<td class="embedded">').append($spanPageRange).append($spanFloorRange)));
    return $form;
  });
  getLastFloor().then((lastFloor) => {

  });
  */

})(window.$.noConflict(true));