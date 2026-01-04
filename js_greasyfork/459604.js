// ==UserScript==
// @name         CSDN美化
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  CSDN去广告及主题色改变
// @author       乃木流架
// @match        *://*.csdn.net/*
// @match        https://www.csdn.net/*
// @icon         https://i.jpg.dog/4419a191c8805d1406bbba51431eb188.png
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at       document-start
// @require      https://unpkg.com/sweetalert2/dist/sweetalert2.min.js
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/459604/CSDN%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459604/CSDN%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  //设置默认颜色 https://nipponcolors.com/
  // 桃   "#F596AA"
  // 桜   "#FEDFE1"
  // 灰桜 "#D7C4BB"
  // 露草 "#2EA9DF"
  // 若竹 "#5DAC81"
  // 桔梗 "#6A4C9C"
  GM_setValue("colorDefault", "#F596AA");

  function log(msg) {
    let title = "CSDN美化";
    let titleCss =
      "color:#FFF;font-size: 8px;font-weight:800;padding:4px 5px 2px 5px;border-radius:3px;background: rgb(237,85,100);background: linear-gradient(90deg, rgba(237,85,100,1) 0%, rgba(252,110,81,1) 14%, rgba(255,206,84,1) 28%, rgba(160,212,104,1) 42%, rgba(72,207,173,1) 56%, rgba(79,194,233,1) 70%, rgba(93,156,236,1) 84%, rgba(172,146,235,1) 100%);";
    let m = msg;
    let mCss = "font-size: 8px;";

    if (typeof m == "object") {
      console.log("%c%s", titleCss, title);
      console.log(m);
      return;
    }

    console.log("%c%s%c %s", titleCss, title, mCss, m);
  }

  const removeItems = {
    // 作者文章信息: ".data-info.d-flex.item-tiling",
    勋章墙: ".aside-box-footer",
    搜博主文章: "#asideSearchArticle",
    热门文章: "#asideHotArticle",
    分类专栏: "#asideCategory",
    最新评论: "#asideNewComments",
    您愿意向朋友推荐博客详情页吗: "#asideNewNps",
    您愿意向朋友推荐CSDN个人主页吗: ".user-spm-list",
    您愿意向朋友推荐CSDN首页吗: ".so-questionnaire",
    你推荐CSDN的博客创作和收益体验么: "#nps-box",
    最新文章: "#asideArchive",
    广告: "#footerRightAds",
    文库首页广告: ".el-carousel.el-carousel--horizontal",
    相关推荐对你有帮助么: "#recommendNps",
    谷歌广告: ".box-shadow.mb8",
    登录注册流程满意度: ".satisfied-component",
    开通会员全站VIP资源免费下更有千元大奖等你拿: ".profile-vip-info.no-vip",
    下载CSDNapp签到领现金: ".general-info-sign",
    首次完成学生认证当日购VIP可享7折后续8折: ".edu-infor-cert",
    首次完成工作认证当日购VIP可享8折后续9折: ".job-infor-cert",
  };

  log(removeItems);

  function itemsRemove(removeItems) {
    for (var i in removeItems) {
      if ($(removeItems[i]).length != 0) {
        log(i + " removing......");
        $(removeItems[i]).remove();
      }
    }
  }

  function svgInit(color) {
    // 命名空间
    var SVG_NS = "http://www.w3.org/2000/svg";

    // 1、创建svg容器
    var svg = document.createElementNS(SVG_NS, "svg");

    // 2、创建svg中的 tag, 如rect
    var tag1 = document.createElementNS(SVG_NS, "path");
    var tag2 = document.createElementNS(SVG_NS, "path");

    // 3、设置tag的属性
    tag1.setAttribute(
      "d",
      "M672.299893 374.246613c-30.004361-6.185886-61.073984-9.064446-91.749634-9.685593-41.186028-0.835018-41.774429 0.635473-46.343491 40.450271-5.634324 49.097208-10.223852 98.314143-15.640212 151.144372 31.054273 0.64673 60.628846 2.199085 90.162486 1.626034 32.461319-0.629333 63.944358-6.411013 90.443895-27.424606 29.843702-23.666002 39.58967-55.474452 34.120099-91.764983C728.039381 403.724994 705.951317 381.184629 672.299893 374.246613zM657.900951 500.909407c-23.899316 18.074657-51.306526 20.665669-82.688257 16.613376 3.77907-38.039361 7.468089-75.166957 11.500938-115.768677 18.166755 1.276063 34.453696 1.294482 50.341548 3.818979 20.170388 3.204995 36.021401 13.485129 40.776705 34.985816C683.099866 464.37533 678.124552 485.615073 657.900951 500.909407zM503.672334 369.780905c-1.798972 13.027711-3.473101 25.15082-5.205559 37.702694-25.127284-2.170432-49.036833-5.149277-73.019037-5.934153-12.665461-0.414439-25.856901 1.651616-38.011732 5.276167-5.569856 1.660826-9.213849 9.779737-13.731746 14.969946 4.811586 4.14132 8.978489 10.243295 14.548344 12.07092 20.290115 6.65763 41.37534 10.943236 61.541635 17.912975 21.155832 7.312546 42.117237 17.118889 43.12417 43.801599 1.025353 27.151383-17.099447 42.173518-39.515992 51.339272-49.971112 20.434401-101.250008 18.301831-152.551418 5.27412-2.898003-0.735757-6.615675-6.172583-6.522554-9.320273 0.313132-10.570753 2.179642-21.095457 3.244904-29.927613 30.601972 2.39556 60.002582 5.354961 89.476871 6.611581 9.122775 0.388856 19.11229-2.468215 27.425629-6.486738 5.1503-2.489704 10.989285-10.093892 10.780531-15.165398-0.184195-4.474918-7.630794-10.624988-13.091156-12.520151-13.767562-4.780887-28.474518-6.819313-42.334177-11.387351-13.833053-4.558829-27.958772-9.378601-40.431851-16.687054-29.591969-17.339924-31.312146-47.346331-4.841262-69.316715 20.354584-16.893762 44.992727-22.240537 70.433142-25.527396C426.702312 358.37104 479.267505 361.432773 503.672334 369.780905zM959.473381 445.082938c-2.599198 35.797297-7.000438 71.464635-10.664897 107.833961-19.322068 0-37.140898 0-57.091276 0 3.668553-34.127262 6.729262-67.476811 10.968819-100.67491 4.237511-33.18275-7.367805-47.762817-40.654932-48.962132-40.755216-1.468444-40.883129-1.482771-45.26595 38.807864-3.950985 36.326347-7.580652 72.687486-11.507078 110.530372-19.435655 0-37.172621 0-55.32812 0 5.699816-58.20361 11.107989-115.27749 17.277502-172.269505 0.410346-3.78828 6.15007-9.250688 10.17985-10.045797 38.780235-7.6574 77.796854-12.57848 117.373221-6.016017C941.27081 371.999432 962.885084 398.084531 959.473381 445.082938zM251.989151 359.040283c11.636015 0.905626 23.165606 3.169179 35.938514 4.976338-1.662873 15.230889-3.163039 28.963659-4.333702 39.687908-30.569226 0-58.112536-1.639337-85.379553 0.411369-34.80469 2.616594-56.879452 20.388353-63.36926 46.690392-8.036024 32.567743 5.16258 57.6807 38.144762 63.129806 25.119097 4.149507 51.359738 1.601474 77.102029 1.802042 4.854565 0.037862 9.718339-1.010003 13.933337-1.483794 1.093914 1.38044 1.75804 1.827625 1.74883 2.260483-0.845251 41.947368-0.855484 43.796482-42.837644 43.626613-31.178093-0.125867-63.113433-2.62171-93.28971-9.93221-33.339316-8.077979-58.892295-29.67588-64.336284-66.284659-5.77554-38.832424 10.547217-69.608358 41.553395-91.998297C150.319587 360.548636 200.264093 355.014596 251.989151 359.040283z"
    );
    tag1.setAttribute("p-id", "1982");
    tag1.setAttribute("fill", color);

    tag2.setAttribute(
      "d",
      "M137.883347 595.666538l-1.199315 1.499144c6.715959 8.794293 15.628956 15.409968 26.742061 19.847024-1.239224 1.759063-2.298346 3.357468-3.177366 4.797259-10.553357-5.196349-19.407002-12.172227-26.561959-20.925588-6.116301 7.91425-15.150048 15.150048-27.101241 21.705348-0.799202-1.358951-1.798972-2.858094-2.998287-4.497431 12.351306-6.196119 21.684882-13.670348 28.000728-22.424732L137.883347 595.667561zM106.34505 646.871757l24.762987 0 0-10.432607-19.426445 0 0-4.376681 19.426445 0 0-9.233292-17.207917 0 0-4.376681 39.45357 0 0 4.376681-17.268292 0 0 9.233292 19.48682 0 0 4.376681-19.48682 0 0 10.432607 24.703635 0 0 4.437056-54.44296 0L106.346073 646.871757zM195.804525 642.434701c2.698458-0.279363 5.536087-0.60989 8.513908-0.989537l0-18.138102-7.374968 0 0-4.317329 7.374968 0 0-14.090926-8.154727 0 0-4.317329 20.506033 0 0 4.317329-7.974625 0 0 14.090926 6.955412 0 0 4.317329-6.955412 0 0 17.568121c2.39863-0.339738 4.876054-0.699941 7.435343-1.079588-0.160659 1.599428-0.25992 3.137457-0.299829 4.617158-7.475252 0.959861-13.950733 1.858324-19.426445 2.698458L195.804525 642.434701zM216.430284 638.536928c5.216815-3.177366 10.673084-6.715959 16.368806-10.612709L232.79909 610.476849l-15.349593 0 0-4.317329 15.349593 0 0-10.673084 4.556783 0 0 10.673084 17.028838 0 0 4.317329-17.028838 0 0 5.336542c0.99977 3.27765 2.168386 6.315846 3.507894 9.113565 3.457752-3.357468 6.345522-6.456039 8.664334-9.293667l3.897773 3.298116c-3.298116 3.258207-6.804986 6.5553-10.522658 9.893324 3.477194 6.016017 7.804756 10.673084 12.981662 13.970176-0.239454 0.360204-0.760317 0.979304-1.558495 1.858324-0.880043 0.918929-1.499144 1.639337-1.858324 2.158153-6.5553-4.736884-11.592013-11.552104-15.110139-20.445658l0 19.367093c0 4.756327-2.478448 7.135514-7.435343 7.135514-1.959631 0-4.057409-0.020466-6.29538-0.060375-0.239454-1.518586-0.559748-3.157923-0.959861-4.916986 2.357697 0.279363 4.497431 0.419556 6.41613 0.419556 2.477424 0 3.717671-1.218758 3.717671-3.657296l0-11.422144c-4.137227 2.87856-8.593725 6.085602-13.370519 9.623171L216.430284 638.536928zM217.749326 616.891955l3.657296-2.218528c2.598174 3.397377 5.175883 7.154957 7.735172 11.272741l-3.837398 2.638083C222.545562 623.907743 220.028229 620.009969 217.749326 616.891955zM240.593614 599.024006l2.638083-2.998287c2.837628 1.87879 5.435803 3.816932 7.794523 5.816472l-2.87856 3.298116C245.789962 602.941222 243.271606 600.902796 240.593614 599.024006zM288.621467 646.152373c1.958608-0.199545 3.917216-0.409322 5.875824-0.629333l0-22.814612-6.595208 0 0-3.597945 59.419298 0 0 3.597945-31.298843 0 0 19.996426c1.918699-0.279363 3.837398-0.569982 5.756097-0.86981-0.040932 0.719384-0.020466 1.998517 0.060375 3.837398-1.87879 0.25992-3.817955 0.530073-5.816472 0.809435l0 7.645121-4.076852 0 0-7.045463c-6.875594 0.979304-14.290471 2.088568-22.24463 3.327792L288.621467 646.152373zM296.955272 597.405135l41.491996 0 0 19.247366-4.197602 0 0-1.379417L301.152874 615.273085l0 1.379417-4.197602 0L296.955272 597.405135zM298.574143 627.504664l13.370519 0 0-4.797259L298.574143 622.707404 298.574143 627.504664zM298.574143 635.779118l13.370519 0 0-4.797259L298.574143 630.981858 298.574143 635.779118zM311.945685 643.304512l0-4.047176L298.574143 639.257336l0 5.785773C303.091016 644.502803 307.548538 643.923612 311.945685 643.304512zM334.25069 600.883353 301.152874 600.883353l0 3.837398 33.097816 0L334.25069 600.883353zM301.152874 611.79589l33.097816 0 0-3.837398L301.152874 607.958492 301.152874 611.79589zM319.020824 630.442576l0-3.477194 23.804149 0 0 3.477194c-2.038426 4.89652-4.717442 9.153474-8.035 12.770861 3.417843 2.49789 7.65433 4.397147 12.71151 5.695722-1.039679 1.518586-1.939165 2.918469-2.698458 4.197602-5.15644-1.698688-9.503445-3.997034-13.041014-6.895037-3.437286 3.078105-7.445576 5.596462-12.021801 7.55507-0.679475-1.199315-1.599428-2.457981-2.75781-3.777023 4.53734-1.738597 8.443299-3.957125 11.721973-6.655584-3.338025-3.577478-5.716188-7.874341-7.135514-12.891611L319.020824 630.442576zM338.267167 630.442576l-12.651135 0c1.258667 3.937682 3.28686 7.305383 6.085602 10.103102C334.479911 637.628232 336.667739 634.260531 338.267167 630.442576zM379.939265 649.149637c16.488533-7.335059 25.382087-18.34788 26.681686-33.037441l-25.603121 0 0-4.676509 25.812899 0c0.100284-5.376451 0.149403-10.79281 0.149403-16.249079l5.216815 0c0 5.376451-0.050142 10.79281-0.149403 16.249079l26.591635 0 0 4.676509-26.681686 0c2.837628 15.968693 12.151761 26.501584 27.941376 31.598672-2.038426 1.958608-3.558036 3.577478-4.556783 4.856611-13.011338-5.236258-21.515013-14.560624-25.51307-27.971052-3.118014 12.131295-11.841699 21.85475-26.172079 29.170366C382.857734 652.688229 381.618511 651.149177 379.939265 649.149637zM476.234425 607.77839l23.084765 0 0-13.07069 5.15644 0 0 13.07069 23.324218 0 0 27.341718-4.916986 0 0-3.237741-18.407232 0 0 22.305005-5.15644 0 0-22.305005-18.167778 0 0 3.237741-4.916986 0L476.234425 607.77839zM481.150388 627.445312l18.167778 0 0-15.229866-18.167778 0L481.150388 627.445312zM522.882861 612.215446l-18.407232 0 0 15.229866 18.407232 0L522.882861 612.215446zM565.153594 605.199659l28.780487 0c-2.018983-3.837398-3.597945-6.635117-4.736884-8.394181l4.617158-2.158153c1.119497 1.719154 2.797719 4.516874 5.036713 8.394181l-4.317329 2.158153 28.180829 0 0 4.437056-11.062963 0c-2.13871 11.411911-6.735401 20.585851-13.791098 27.52182 5.316076 3.877307 13.760398 7.355525 25.332968 10.432607-1.838881 2.078335-3.237741 3.816932-4.197602 5.216815-11.272741-3.897773-19.596314-7.974625-24.972764-12.231579-5.395894 4.197602-14.020318 8.43409-25.872251 12.71151-1.039679-1.39886-2.238994-2.958378-3.597945-4.676509 11.432377-3.437286 20.036335-7.265474 25.812899-11.482519-7.29515-7.794523-11.93175-16.95823-13.910824-27.491121l-11.302417 0L565.152571 605.199659zM606.525863 609.636714l-25.272593 0c1.798972 9.832949 6.095835 17.958 12.891611 24.373107C600.639806 627.974361 604.7668 619.850333 606.525863 609.636714zM671.851685 604.50995l-4.466732 0 0 36.305881 4.466732 0 0 5.066389-14.930037 0 0-5.066389 4.466732 0 0-36.305881-4.466732 0 0-5.066389 14.930037 0L671.851685 604.50995zM738.196719 604.780103l-13.401218 0 0 41.102117-6.02625 0 0-41.102117-13.340843 0 0-5.336542 32.767288 0L738.195695 604.780103zM771.71409 611.496062l0-4.317329 19.48682 0 0 4.437056c-1.939165 3.877307-4.237511 7.544837-6.895037 11.002588l0 30.908964-4.676509 0 0-25.482371c-2.198062 2.318812-4.577249 4.516874-7.135514 6.595208-0.360204-1.438769-0.918929-3.097548-1.679245-4.976338 6.15621-4.956895 11.252275-11.012821 15.289218-18.167778L771.71409 611.496062zM777.649266 597.105307l4.197602-2.098801c1.478677 2.358721 3.038196 5.096065 4.676509 8.214079l-4.437056 2.278903C780.527826 602.261747 779.049149 599.464027 777.649266 597.105307zM785.024234 625.946168l3.118014-2.578732c2.438539 2.717901 4.657067 5.296633 6.655584 7.735172l-3.717671 2.937912C789.161461 631.28271 787.143501 628.584252 785.024234 625.946168zM791.20091 646.991484l16.848737 0 0-29.380144-14.270005 0 0-4.676509 14.270005 0 0-17.568121 4.797259 0 0 17.568121 15.229866 0 0 4.676509-15.229866 0 0 29.380144 17.028838 0 0 4.676509-38.673811 0L791.201933 646.991484zM867.8885 599.143733l51.565423 0 0 4.676509-46.468334 0 0 41.851177 47.428196 0 0 4.556783-52.524261 0L867.889523 599.143733zM877.601722 610.416474l3.357468-3.177366c4.996804 4.116761 10.222829 8.634658 15.679098 13.550621 4.177136-4.516874 8.184403-9.43386 12.021801-14.749936l4.376681 2.937912c-4.197602 5.436826-8.454556 10.472516-12.770861 15.110139 4.976338 4.53734 10.132778 9.393951 15.46932 14.569834l-4.137227 4.197602c-4.837168-5.056156-9.813506-10.05296-14.930037-14.989389-5.776563 5.856381-11.652388 11.012821-17.628496 15.46932-0.959861-1.239224-2.238994-2.537799-3.837398-3.897773 6.275937-4.27742 12.241812-9.263991 17.897625-14.959713C888.084471 619.739816 882.918821 615.053074 877.601722 610.416474z"
    );
    tag2.setAttribute("p-id", "1983");
    tag2.setAttribute("fill", color);

    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.setAttribute("p-id", "1981");
    svg.setAttribute("viewBox", "0 0 1100 1100");
    svg.setAttribute("t", "1675610091655");
    //   svg.setAttribute("style", "border: 1px solid red");
    svg.setAttribute("transform", "translate(-10,-20)");

    // 4、将tag塞进svg中
    svg.appendChild(tag1);
    svg.appendChild(tag2);

    // log(svg);
    return svg;
  }

  function svgAdd(svg) {
    log("svgAdd......");

    var imgUp = document.getElementsByClassName(
      "toolbar-logo toolbar-subMenu-box csdn-toolbar-fl"
    )[0].firstChild;
    var img = imgUp.firstChild;
    var div = document.createElement("div");

    // log(imgUp);
    // log(img);
    img.remove();
    // log(imgUp);
    // 5、将svg塞进指定容器
    imgUp.appendChild(div);
    div.appendChild(svg);
    // log(div);
  }

  function themeColor(color) {
    log("themeColor......");

    //搜索按钮
    var searchButton = $("#toolbar-search-button")[0];
    if (searchButton != null) {
      searchButton.style.background = color;
      // log(searchButton);
    }

    //发布按钮
    var writeNew1 = document.querySelectorAll(
      "#csdn-toolbar .toolbar-inside.exp1 .toolbar-btn-write.toolbar-btn-write-new>a"
    );
    var writeNew2 = document.querySelectorAll(
      "#csdn-toolbar .toolbar-btns .toolbar-btn-write > a"
    );
    var writeNew = "";

    if (writeNew1.length == 1) {
      writeNew = writeNew1;
    } else if (writeNew2.length == 1) {
      writeNew = writeNew2;
    }
    if (writeNew != null && writeNew == writeNew1) {
      // log(writeNew);
      writeNew[0].style.background = color;
      writeNew[0].style.backgroundImage =
        "url(https://g.csdnimg.cn/common/csdn-toolbar/images/icon-write.png)";
      writeNew[0].style.backgroundRepeat = "no-repeat";
      writeNew[0].style.backgroundPosition = "16px center";
      writeNew[0].style.backgroundSize = "16px";
    } else if (writeNew == writeNew2) {
      // log(writeNew);
      writeNew[0].style.background = color;
    }

    //创作中心发布按钮
    var cre = document.querySelector(".createBtn");
    if (cre !== null) {
      cre.style.background = color;
    }

    //评论按钮
    var comment = document.querySelector(
      ".comment-box.comment-box-new2.login-comment-box-new .has-comment .has-comment-tit a.has-comment-bt-right"
    );
    // log(comment);
    if (comment !== null) {
      comment.style.background = color;
    }

    // //放弃
    // var titleActive = window.getComputedStyle(
    //   document.querySelector("#csdn-toolbar .toolbar-menus li"),
    //   ":after"
    // );
    // log(titleActive);
    // titleActive.setProperty("background-color", "#1296db");

    // var listActive = document.querySelector(
    //   ".groupfile .pos-box .scroll-box .toc-box >ol li.active >a"
    // );
    // log(listActive);
    // listActive.style.color = color;
  }

  function msgColor(color) {
    log("msgColor......");

    var msgCount = document.querySelector(
      "#csdn-toolbar .toolbar-btns .toolbar-btn-msg #toolbar-remind i"
    );
    // log(msgCount);

    //消息悬浮框红点
    var msgDots = document.querySelectorAll(
      "#csdn-toolbar .toolbar-btns .toolbar-btn-msg .toolbar-subMenu>a i"
    );
    // log(msgDots);

    if (msgCount && msgDots) {
      msgCount.style.background = color;
      for (let i = 0; i < msgDots.length; i++) {
        msgDots[i].style.background = color;
      }
    }
  }

  function sideHandle() {
    log("sideHandle......");

    var sideItemsFather = document.querySelector(".csdn-side-toolbar");
    if (sideItemsFather !== null) {
      let sideItems = sideItemsFather.children;
      // log(sideItems);
      for (let i = sideItems.length - 2; i >= 0; i--) {
        if (
          sideItems[i].getAttribute("data-type") != "show" ||
          sideItems[i].getAttribute("data-type") != "hide"
        ) {
          // log(sideItems[i]);
          sideItems[i].remove();
        } else {
          sideItems[i].setAttribute("style", "display: none");
          // log(sideItems[i]);
        }
      }
    }
    // log(sideItemsFather);
  }

  function colorpickerInit() {
    log("colorpickerInit......");

    var co = document.createElement("div");
    co.setAttribute("id", "app");
    co.innerHTML = '<el-color-picker v-model="color"></el-color-picker>';

    return co;
  }

  function colorpickerAdd(colorpicker) {
    log("colorpickerAdd......");

    var sideItemsFather = document.querySelector(".csdn-side-toolbar");
    if (sideItemsFather !== null) {
      // sideItems = sideItemsFather.children;
      // log(sideItemsFather);
      // var lastChild = sideItemsFather.lastElementChild;
      let _colorpicker = sideItemsFather.insertBefore(
        colorpicker,
        sideItemsFather.lastElementChild
      );
    }

    // log(colorpicker);
  }

  // function colorpickerPol() {
  //   log("colorpickerPol......");

  //   let trigger = document.getElementsByClassName(
  //     "el-color-picker__trigger"
  //   )[0];
  //   let col = document.getElementsByClassName("el-color-picker__color")[0];
  //   let col_inner = document.getElementsByClassName(
  //     "el-color-picker__color-inner"
  //   )[0];
  //   log(trigger.style.padding);
  //   if (trigger !== null && col !== null && col_inner !== null) {
  //     trigger.style.padding = "";
  //     trigger.style.border = "";

  //     col.style.border = "";

  //     col_inner.style.borderRadius = "50%";
  //   }
  // }

  //消息和右下角工具栏

  function resourceInject() {
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js";
    // script.src = "https://unpkg.com/vue@2/dist/vue.js";
    document.documentElement.appendChild(script);

    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    // link.href = "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
    link.href =
      "https://fastly.jsdelivr.net/gh/TojoSeita/vue-study.github.io@main/index.css";
    document.documentElement.appendChild(link);

    let elscript = document.createElement("script");
    elscript.setAttribute("type", "text/javascript");
    elscript.src = "https://unpkg.com/element-ui/lib/index.js";
    document.documentElement.appendChild(elscript);
  }

  var handle = setInterval(() => {
    //函数调用
    // 1、元素删除
    itemsRemove(removeItems);
    // 2、图标更改
    // if (GM_getValue("color") == null) {
    //   svgAdd(svgInit(GM_getValue("colorDefault")));
    // } else {
    //   svgAdd(svgInit(GM_getValue("color")));
    // }

    // // 3、主题颜色更改
    // themeColor(color);
    // // 4、消息红点更改
    // msgHandle();
    // 5、右下角工具栏删除
    // sideHandle();
    // colorPicker();
  }, 1000);

  resourceInject();

  window.onload = () => {
    //去除关注博主即可阅读全文
    var article_content = document.getElementById("article_content");
    var follow_text = document.getElementsByClassName("follow-text")[0];
    var hide_article_box =
      document.getElementsByClassName(" hide-article-box")[0];

    if (follow_text != null) {
      article_content.removeAttribute("style");
      follow_text.parentElement.parentElement.removeChild(
        follow_text.parentElement
      );
      hide_article_box.parentElement.removeChild(hide_article_box);
      log("阅读全文解锁成功！");
    }
    //函数调用
    // 1、元素删除
    // itemsRemove(removeItems);

    // 2、右下角工具栏删除
    sideHandle();

    clearInterval(handle);
    log("clearInterval......");

    // 3、颜色选择器生成
    colorpickerAdd(colorpickerInit());

    new Vue({
      // el: "#app",
      el:
        document.getElementsByClassName("csdn-side-toolbar ")[0] == undefined
          ? {}
          : document.getElementsByClassName("csdn-side-toolbar ")[0]
              .firstElementChild,
      data: function () {
        return {
          color:
            // localStorage.getItem("color") == null
            //   ? localStorage.getItem("colorDefault")
            //   : localStorage.getItem("color"),
            GM_getValue("color") == null
              ? GM_getValue("colorDefault")
              : GM_getValue("color"),
        };
      },
      methods: {
        hello() {
          log("hello......");
        },
      },
      watch: {
        color: {
          handler(newVal, oldVal) {
            log("newVal: " + newVal);
            log("oldVal: " + oldVal);

            //本地存储所选颜色
            GM_setValue("color", newVal);

            log("colorDefault: " + GM_getValue("colorDefault"));
            log("color: " + GM_getValue("color"));
            // 4、图标颜色更改
            svgAdd(svgInit(newVal));
            // 5、主题颜色更改
            themeColor(newVal);
            // 6、消息红点更改
            msgColor(newVal);
          },
          immediate: true,
        },
      },
    });

    // log(GM_listValues());

    // colorpickerPol();
  };

  // Your code here...
})();
