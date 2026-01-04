// ==UserScript==
// @name         网易云音乐列表导出为CSV文件
// @name:ar      تصدير قائمة موسيقى نيت إيز كلاود إلى ملف CSV
// @name:bg      Експортиране на списъка с музика от NetEase Cloud в CSV файл
// @name:cs      Export seznamu hudby NetEase Cloud do souboru CSV
// @name:da      Eksportér NetEase Cloud Musikliste til CSV-fil
// @name:de      Exportiere die NetEase Cloud Musikliste in eine CSV-Datei
// @name:el      Εξαγωγή λίστας μουσικής NetEase Cloud σε αρχείο CSV
// @name:en      Export NetEase Cloud Music List to CSV File
// @name:eo      Eksporti NetEase Cloud Muzikan Liston al CSV-Dosiero
// @name:es      Exportar la lista de música de NetEase Cloud a un archivo CSV
// @name:fi      Vie NetEase Cloud -musiikkilista CSV-tiedostoon
// @name:fr      Exporter la liste de musique NetEase Cloud vers un fichier CSV
// @name:fr-CA   Exporter la liste de musique NetEase Cloud dans un fichier CSV
// @name:he      ייצא את רשימת המוזיקה של NetEase Cloud לקובץ CSV
// @name:hr      Izvezi popis glazbe NetEase Cloud u CSV datoteku
// @name:hu      A NetEase Cloud zenei lista exportálása CSV-fájlba
// @name:id      Ekspor Daftar Musik NetEase Cloud ke File CSV
// @name:it      Esporta la lista musicale di NetEase Cloud in un file CSV
// @name:ja      ネットイースクラウド音楽リストをCSVファイルにエクスポート
// @name:ka      NetEase Cloud მუსიკის სიის ექსპორტი CSV ფაილში
// @name:ko      넷이즈 클라우드 음악 목록을 CSV 파일로 내보내기
// @name:nb      Eksporter NetEase Cloud-musikkliste til CSV-fil
// @name:nl      Exporteer de NetEase Cloud-muzieklijst naar een CSV-bestand
// @name:pl      Eksportuj listę muzyki NetEase Cloud do pliku CSV
// @name:pt-BR   Exportar a lista de músicas do NetEase Cloud para um arquivo CSV
// @name:ro      Exportă lista de muzică NetEase Cloud într-un fișier CSV
// @name:ru      Экспортировать список музыки NetEase Cloud в CSV-файл
// @name:sk      Exportovať zoznam hudby NetEase Cloud do súboru CSV
// @name:sr      Извези листу музике NetEase Cloud у CSV датотеку
// @name:sv      Exportera NetEase Cloud-musiklistan till en CSV-fil
// @name:th      ส่งออกบัญชีเพลง NetEase Cloud เป็นไฟล์ CSV
// @name:tr      NetEase Cloud Müzik Listesini CSV Dosyasına Aktar
// @name:ug      NetEase Cloud مۇزىكا تىزىملىكىنى CSV ھۆججىتىگە چىقىرىش
// @name:uk      Експортувати список музики NetEase Cloud у файл CSV
// @name:vi      Xuất danh sách nhạc NetEase Cloud sang tệp CSV
// @name:zh      网易云音乐列表导出为CSV文件
// @name:zh-CN   网易云音乐列表导出为CSV文件
// @name:zh-HK   網易雲音樂列表匯出為CSV檔案
// @name:zh-SG   网易云音乐列表导出为CSV文件
// @name:zh-TW   網易雲音樂列表匯出為CSV檔案
// @description  导出当前页网易云音乐列表为CSV文件
// @description:ar  تصدير قائمة موسيقى نيت إيز كلاود للصفحة الحالية إلى ملف CSV
// @description:bg  Експортиране на текущата страница със списъка на NetEase Cloud Music в CSV файл
// @description:cs  Export seznamu hudby NetEase Cloud z aktuální stránky do souboru CSV
// @description:da  Eksportér den aktuelle side af NetEase Cloud Musikliste til en CSV-fil
// @description:de  Exportiere die aktuelle Seite der NetEase Cloud Musikliste in eine CSV-Datei
// @description:el  Εξαγωγή της τρέχουσας σελίδας της λίστας μουσικής NetEase Cloud σε αρχείο CSV
// @description:en  Export the current page of NetEase Cloud Music list as a CSV file
// @description:eo  Eksporti la nunan paĝon de NetEase Cloud Muzika Listo kiel CSV-dosieron
// @description:es  Exportar la página actual de la lista de música de NetEase Cloud como archivo CSV
// @description:fi  Vie nykyinen sivu NetEase Cloud -musiikkilistasta CSV-tiedostona
// @description:fr  Exporter la page actuelle de la liste de musique NetEase Cloud en fichier CSV
// @description:fr-CA Exporter la page actuelle de la liste de musique NetEase Cloud dans un fichier CSV
// @description:he  ייצא את העמוד הנוכחי של רשימת המוזיקה של NetEase Cloud כקובץ CSV
// @description:hr  Izvezi trenutnu stranicu popisa glazbe NetEase Cloud kao CSV datoteku
// @description:hu  A NetEase Cloud zenei lista aktuális oldalának exportálása CSV-fájlként
// @description:id  Ekspor halaman saat ini dari daftar musik NetEase Cloud sebagai file CSV
// @description:it  Esporta la pagina corrente della lista musicale di NetEase Cloud come file CSV
// @description:ja  現在のページのネットイースクラウド音楽リストをCSVファイルとしてエクスポート
// @description:ka  NetEase Cloud მუსიკის სიის მიმდინარე გვერდის ექსპორტი CSV ფაილში
// @description:ko  현재 페이지의 넷이즈 클라우드 음악 목록을 CSV 파일로 내보내기
// @description:nb  Eksporter den gjeldende siden av NetEase Cloud-musikklisten som en CSV-fil
// @description:nl  Exporteer de huidige pagina van de NetEase Cloud-muzieklijst als een CSV-bestand
// @description:pl  Eksportuj bieżącą stronę listy muzyki NetEase Cloud jako plik CSV
// @description:pt-BR Exportar a página atual da lista de músicas do NetEase Cloud como um arquivo CSV
// @description:ro  Exportă pagina curentă a listei de muzică NetEase Cloud ca fișier CSV
// @description:ru  Экспортировать текущую страницу списка музыки NetEase Cloud в CSV-файл
// @description:sk  Exportovať aktuálnu stránku zoznamu hudby NetEase Cloud ako súbor CSV
// @description:sr  Извези тренутну страницу листе музике NetEase Cloud као CSV датотеку
// @description:sv  Exportera den aktuella sidan av NetEase Cloud-musiklistan som en CSV-fil
// @description:th  ส่งออกหน้าปัจจุบันของบัญชีเพลง NetEase Cloud เป็นไฟล์ CSV
// @description:tr  NetEase Cloud Müzik Listesinin mevcut sayfasını CSV dosyası olarak aktar
// @description:ug  NetEase Cloud مۇزىكا تىزىملىكىنىڭ نۆۋەتتىكى بېتىنى CSV ھۆججىتى سۈپىتىدە چىقىرىش
// @description:uk  Експортувати поточну сторінку списку музики NetEase Cloud у файл CSV
// @description:vi  Xuất trang hiện tại của danh sách nhạc NetEase Cloud dưới dạng tệp CSV
// @description:zh  导出当前页网易云音乐列表为CSV文件
// @description:zh-CN 导出当前页网易云音乐列表为CSV文件
// @description:zh-HK 匯出當前頁網易雲音樂列表為CSV檔案
// @description:zh-SG 导出当前页网易云音乐列表为CSV文件
// @description:zh-TW 匯出當前頁網易雲音樂列表為CSV檔案
// @namespace    undefined
// @version      0.0.5.2
// @author       allen smith, aspen138
// @match        *://music.163.com/*
// @license      MIT
// @icon         https://s1.music.126.net/style/favicon.ico
// @require      https://update.greasyfork.org/scripts/27254/174357/clipboardjs.js
// @require      https://update.greasyfork.org/scripts/482500/1297545/Sortable%20JS.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522865/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA%E4%B8%BACSV%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/522865/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA%E4%B8%BACSV%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 检测页面
  let htm = document.getElementsByClassName('f-oh');
  if (htm.length === 0) {
    return;
  }

  // 创建dom节点
  function createDocument(txt) {
    const template = `<div class='childdom'>${txt}</div>`;
    let doc = new DOMParser().parseFromString(template, 'text/html');
    let div = doc.querySelector('.childdom');
    return div;
  }

  // 检测文档变动
  let doc = document.getElementById('g_mymusic');
  let _body = document.body;
  let clipboard, btn, spli, interId, waitTimeoutId, wait;
  let ckdiv;
  let check1, check2, check3, check4, check5;
  let sortdiv;


  console.log("doc=", doc);


  function DOMSubtreeModifiedEventHandler() {

    console.log("DOMSubtreeModified event trigged.");

    //查找列表动画
    wait = document.getElementById('wait-animation');
    if (wait) _body.removeChild(wait);
    wait = document.createElement("span");
    wait.id = 'wait-animation';
    wait.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:100px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
    _body.appendChild(wait);
    wait.innerHTML = '导出：没有合适的列表';

    //检测列表
    console.log("find m-table elements", document.getElementsByClassName('m-table'));

    let list = document.getElementsByClassName('m-table')[0];
    console.log("if clause before, list=", list);
    if (!list) {
      btn = document.getElementById('export-btn');
      spli = document.getElementById('export-spli');
      if (btn) _body.removeChild(btn);
      if (spli) _body.removeChild(spli);
      return;
    }
    console.log("if clause after, list=", list);
    _body.removeChild(wait);

    //创建按钮
    btn = null;
    spli = null;
    btn = document.getElementById('export-btn');
    spli = document.getElementById('export-spli');
    if (!spli) {
      spli = document.createElement("input");
      spli.id = 'export-spli';
      spli.className = 'export-spli';
      spli.setAttribute('placeholder', '自定义分隔符（默认 -- ）');
      spli.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:100px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
      _body.appendChild(spli);
    }
    if (!btn) {
      btn = document.createElement("button");
      btn.id = 'export-btn';
      btn.className = 'export-btn';
      btn.innerText = '导出列表';
      btn.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:229px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
      _body.appendChild(btn);
    }
    // 选择列
    if (!ckdiv) {
      ckdiv = document.createElement("div");
      ckdiv.id = 'ckdiv';
      ckdiv.className = 'export-ck';
      ckdiv.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:128px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');
      _body.appendChild(ckdiv);
    }
    // 排序
    if (!sortdiv) {
      // sortdiv = document.createElement("div");
      // sortdiv.id = 'sortdiv';
      // sortdiv.className = 'sortdiv';
      // sortdiv.setAttribute('style', 'display:inline-block;position:absolute;right:50px;top:156px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;');

      let divstr = `<div id="sortdivbox" style="display:inline-block;position:absolute;right:50px;top:159px;padding:3px 5px;border:1px solid lightgray;background-color:white;color:black;border-radius:5px;font-size:14px;"><div>拖动以排序</div><div id="sortdiv" style="margin:10px 0px;cursor:pointer;"><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">歌名</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">歌手</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">专辑</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">时长</span><span style="margin:0 4px;padding:4px 8px;border-radius:3px;border:1px solid lightgray">链接</span></div></div>`
      _body.appendChild(createDocument(divstr));
      sortdiv = new Sortable(document.querySelector('#sortdiv'))
    }

    let ckbuilder = function (id, label, uncheck, readonly) {
      let tmpid = 'ck_' + id;
      let ckbox = document.createElement("input");
      ckbox.id = tmpid
      ckbox.setAttribute('type', 'checkbox');
      ckbox.setAttribute('style', 'vertical-align: middle;margin-top: -2px;');
      if (!uncheck) ckbox.checked = true;
      if (!!readonly) ckbox.setAttribute("disabled", "disabled");
      ckdiv.appendChild(ckbox);

      let ckspn = document.createElement("label");
      ckspn.setAttribute('for', tmpid);
      ckspn.innerHTML = ' ' + label;
      ckdiv.appendChild(ckspn);
      return ckbox;
    }
    if (!check1) {
      check1 = ckbuilder("ck01", "歌名 ", false, true);
    }
    if (!check2) {
      check2 = ckbuilder("ck02", "歌手 ");
    }
    if (!check3) {
      check3 = ckbuilder("ck03", "专辑 ", true);
    }
    if (!check4) {
      check4 = ckbuilder("ck04", "时长 ", true);
    }
    if (!check5) {
      check5 = ckbuilder("ck05", "链接", true);
    }


    // 创建剪贴板
    if (clipboard) clipboard.destroy();
    // Example JavaScript with Clipboard.js and CSV download functionality

    clipboard = new Clipboard('.export-btn', {
      text: function (trigger) {

        // 导出列表
        btn.innerText = '正在导出 ...';
        let result = '';
        let csvContent = ''; // Initialize CSV content
        let listBody = list.getElementsByTagName('tbody')[0];
        let rows = listBody.getElementsByTagName('tr');

        // Initialize CSV headers based on selected fields
        let headers = [];
        document.querySelectorAll('#sortdiv span').forEach(item => {
          let type = item.innerText;
          switch (type) {
            case "歌名":
              headers.push('歌名');
              break;
            case "歌手":
              if (check2.checked) headers.push('歌手');
              break;
            case "专辑":
              if (check3.checked) headers.push('专辑');
              break;
            case "时长":
              if (check4.checked) headers.push('时长');
              break;
            case "链接":
              if (check5.checked) headers.push('链接');
              break;
          }
        });
        csvContent += headers.join(',') + '\r\n'; // Add headers to CSV

        for (let i = 0; i < rows.length; i++) {
          let ele = rows[i];
          let cells = ele.getElementsByTagName('td');
          let name = cells[1].getElementsByTagName('b')[0].getAttribute('title')
            .replace(/<div class="soil">[\s\S\n]*?<\/div>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&");
          let link = `https://music.163.com/#${cells[1].getElementsByTagName('a')[0].getAttribute('href')}`;
          let time = cells[2].querySelector('.u-dur').innerText;
          let artist = cells[3].getElementsByTagName('span')[0].getAttribute('title')
            .replace(/<div class="soil">[\s\S\n]*?<\/div>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&");
          let album = cells[4].getElementsByTagName('a')[0].getAttribute('title')
            .replace(/<div class="soil">[\s\S\n]*?<\/div>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&");

          let spliChar = spli.value;
          if (!spliChar) spliChar = ' -- ';

          let isFirst = true;
          let row = [];
          document.querySelectorAll('#sortdiv span').forEach(item => {
            let type = item.innerText;
            let tempSplit;
            if (isFirst) {
              tempSplit = () => { isFirst = false; return ""; }
            } else {
              tempSplit = () => spliChar;
            }
            switch (type) {
              case "歌名":
                row.push(`"${name}"`); // Enclose in quotes to handle commas
                break;
              case "歌手":
                if (check2.checked) {
                  row.push(`"${artist}"`);
                }
                break;
              case "专辑":
                if (check3.checked) {
                  row.push(`"${album}"`);
                }
                break;
              case "时长":
                if (check4.checked) {
                  row.push(`"${time}"`);
                }
                break;
              case "链接":
                if (check5.checked) {
                  row.push(`"${link}"`);
                }
                break;
            }
          });
          result += row.join(spliChar) + '\r\n'; // For clipboard
          csvContent += row.join(',') + '\r\n'; // For CSV
        }

        // 提示动画
        btn.innerText = '已复制到剪贴板 =';
        let count = 6;
        clearInterval(interId);
        interId = setInterval(function () {
          count--;
          if (count > 0) {
            btn.innerText = '已复制到剪贴板 ' + waitAnimationChar(count);
          }
          else {
            btn.innerText = '导出列表';
            clearInterval(interId);
          }
        }, 300);

        // 输出到控制台
        console.log(result);

        // 输出到剪贴板
        trigger.setAttribute('aria-label', result);
        // Store CSV content in a data attribute for later use
        trigger.dataset.csv = csvContent;
        return trigger.getAttribute('aria-label');
      }
    });

    // Listen for the successful copy event to trigger CSV download
    clipboard.on('success', function (e) {
      // Retrieve CSV content from data attribute
      let csvContent = e.trigger.dataset.csv;

      // Encode CSV content
      //前面加的那个uFEFF是utf-8 BOM的头,目的是把utf-8的文件变成utf-8 BOM,让微软的excel打开csv文件后不会乱码.
      let encodedUri = 'data:text/csv;charset=utf-8,' + '\uFEFF' +encodeURIComponent(csvContent);

      // Create a link to download the encoded URI
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      let timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      link.setAttribute("download", `网易云音乐-export-${timestamp}.csv`);
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);

      console.log("CSV file has been downloaded.");
    });


  }



  doc.addEventListener('DOMSubtreeModified', DOMSubtreeModifiedEventHandler);

  setTimeout(() => { DOMSubtreeModifiedEventHandler(); }, 3 * 1000);


  //字符动画
  let waitAnimationChar = function (n) {
    let temp = n % 3;
    if (temp === 0) return '#';
    else if (temp == 1) return '$';
    else if (temp == 2) return '+';
  };
})();