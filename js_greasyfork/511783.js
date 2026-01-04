// ==UserScript==
// @name         Show resumeCollectionNum at PipeChina campus recruitment site
// @name:zh-CN   在国家管网招聘平台显示简历收集数，无需跳转二级页面
// @name:es      Mostrar número de colección de currículums en el sitio de reclutamiento de campus de PipeChina
// @name:fr      Afficher le nombre de collections de CV sur le site de recrutement de campus de PipeChina
// @name:de      Anzeige der Lebenslauf-Sammelanzahl auf der PipeChina Campus-Recruiting-Seite
// @name:ja      パイプチャイナキャンパス採用サイトでの履歴書収集数の表示
// @name:ko      파이프차이나 캠퍼스 채용 사이트에서 이력서 수집 수 표시
// @name:it      Mostra il numero di raccolta dei curriculum sul sito di reclutamento PipeChina
// @name:ru      Показать количество резюме на сайте кампусного набора PipeChina
// @name:hi      पाइपचाइना कैंपस भर्ती साइट पर रेज़्यूमे संग्रह संख्या दिखाएं
// @name:ar      عرض عدد جمع السيرة الذاتية في موقع توظيف PipeChina للجامعات
// @name:pt      Mostrar número de currículos coletados no site de recrutamento de PipeChina
// @name:tr      PipeChina kampüs işe alım sitesinde özgeçmiş toplama numarasını göster
// @name:id      Tampilkan jumlah pengumpulan resume di situs rekrutmen kampus PipeChina
// @name:th      แสดงจำนวนการรวบรวมเรซูเม่ที่เว็บไซต์สมัครงาน PipeChina
// @name:vi      Hiển thị số lượng thu thập hồ sơ tại trang tuyển dụng PipeChina
// @name:pl      Pokaż liczbę zebranych CV na stronie rekrutacji kampusowej PipeChina
// @name:sv      Visa antalet insamlade CV på PipeChina:s rekryteringssajt för campus
// @name:nl      Toon het aantal verzamelde cv's op de campusrecruitmentsite van PipeChina
// @name:no      Vis antall CV-samlinger på PipeChinas rekrutteringsside for campus
// @name:fi      Näytä PipeChinan kampuksen rekrytointisivustolla CV-kokoelmien lukumäärä
// @name:da      Vis antal indsamlede CV'er på PipeChinas campus rekrutteringsside
// @name:el      Εμφάνιση αριθμού συλλογής βιογραφικών στη σελίδα προσλήψεων πανεπιστημίου PipeChina
// @description  Add another column `resumeCollectionNum`, make a POST request for each matching element and fill the new column
// @description:zh-CN 为每个匹配元素添加一个新的列 `resumeCollectionNum`，进行 POST 请求并填充新列
// @description:es Agregar otra columna `resumeCollectionNum`, realizar una solicitud POST para cada elemento coincidente y llenar la nueva columna
// @description:fr Ajouter une autre colonne `resumeCollectionNum`, faire une requête POST pour chaque élément correspondant et remplir la nouvelle colonne
// @description:de Eine weitere Spalte `resumeCollectionNum` hinzufügen, für jedes übereinstimmende Element eine POST-Anfrage stellen und die neue Spalte ausfüllen
// @description:ja 一致する各要素に対してPOSTリクエストを行い、新しい列 `resumeCollectionNum` を追加して埋める
// @description:ko 각 일치하는 요소에 대해 POST 요청을 보내고 새 열 `resumeCollectionNum`을 추가하여 채움
// @description:it Aggiungi un'altra colonna `resumeCollectionNum`, fai una richiesta POST per ogni elemento corrispondente e riempi la nuova colonna
// @description:ru Добавить еще один столбец `resumeCollectionNum`, сделать POST-запрос для каждого совпадающего элемента и заполнить новый столбец
// @description:hi प्रत्येक मिलान तत्व के लिए POST अनुरोध करें और नए कॉलम `resumeCollectionNum` को जोड़कर भरें
// @description:ar إضافة عمود آخر `resumeCollectionNum`، وإجراء طلب POST لكل عنصر مطابق وملء العمود الجديد
// @description:pt Adicionar outra coluna `resumeCollectionNum`, fazer uma solicitação POST para cada elemento correspondente e preencher a nova coluna
// @description:tr Eşleşen her bir eleman için POST isteği yaparak `resumeCollectionNum` adlı yeni bir sütun ekleyin ve doldurun
// @description:id Tambahkan kolom lain `resumeCollectionNum`, buat permintaan POST untuk setiap elemen yang cocok dan isi kolom baru
// @description:th เพิ่มคอลัมน์ใหม่ `resumeCollectionNum` ส่งคำขอ POST สำหรับแต่ละองค์ประกอบที่ตรงกันและเติมคอลัมน์ใหม่
// @description:vi Thêm cột `resumeCollectionNum` khác, thực hiện yêu cầu POST cho mỗi phần tử khớp và điền vào cột mới
// @description:pl Dodaj nową kolumnę `resumeCollectionNum`, wykonaj żądanie POST dla każdego pasującego elementu i wypełnij nową kolumnę
// @description:sv Lägg till en ny kolumn `resumeCollectionNum`, gör en POST-förfrågan för varje matchande element och fyll den nya kolumnen
// @description:nl Voeg een extra kolom `resumeCollectionNum` toe, doe een POST-verzoek voor elk overeenkomend element en vul de nieuwe kolom in
// @description:no Legg til en annen kolonne `resumeCollectionNum`, gjør en POST-forespørsel for hvert samsvarende element og fyll ut den nye kolonnen
// @description:fi Lisää uusi sarake `resumeCollectionNum`, tee POST-pyyntö jokaiselle vastaavalle elementille ja täytä uusi sarake
// @description:da Tilføj en ny kolonne `resumeCollectionNum`, lav en POST-anmodning for hvert matchende element og udfyld den nye kolonne
// @description:el Προσθέστε μια ακόμη στήλη `resumeCollectionNum`, κάντε ένα POST αίτημα για κάθε αντίστοιχο στοιχείο και συμπληρώστε τη νέα στήλη
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @author       aspen138
// @match        *://wecruit.hotjob.cn/SU617b87702f9d247cb97cc6b7/*
// @match        *://wecruit.hotjob.cn/SU61e77e622f9d245151b7e600/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511783/Show%20resumeCollectionNum%20at%20PipeChina%20campus%20recruitment%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/511783/Show%20resumeCollectionNum%20at%20PipeChina%20campus%20recruitment%20site.meta.js
// ==/UserScript==



// test case: https://wecruit.hotjob.cn/SU617b87702f9d247cb97cc6b7/pb/school.html
// 建议和中国融通的招聘网站学一下，不要弄什么二级页面显示投递人数 https://job.crtc-hr.com/portal/#/recruitmentc/campus/ebab6691-2fe1-4e72-b0fa-27e63fbcef3e


// 哪些公司使用了用友大易hotjob.cn服务？
// TCL、华泰证券、美亚光电、越秀资本、华润集团、海光芯片、地平线、海天集团、怀柔实验室、信步科技、永赢基金、九江银行、五矿钢铁



(function() {
    'use strict';

    // Function to extract postId and make a POST request
    function makePostRequest(element, mobile = false) {
        const postId = element.id || element.getAttribute('id');
        if (!postId) {
            console.error('Post ID is missing!');
            return;
        }
        const url = `https://wecruit.hotjob.cn/wecruit/positionInfo/listPositionDetail/SU617b87702f9d247cb97cc6b7?iSaJAx=isAjax&request_locale=zh_CN&t=${Date.now()}`;
        const referer = mobile ?
            `https://wecruit.hotjob.cn/SU61e77e622f9d245151b7e600/mc/position/campus?postId=${postId}` :
            `https://wecruit.hotjob.cn/SU617b87702f9d247cb97cc6b7/pb/posDetail.html?postId=${postId}&postType=campus`;

        const bodyData = `postId=${postId}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': referer,
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://wecruit.hotjob.cn',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0'
            },
            body: bodyData
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Response for postId ${postId}:`, data);
            if (data && data.data && data.data.resumeCollectionNum !== undefined) {
                const resumeCollectionNum = data.data.resumeCollectionNum;
                let newColumn;
                if (mobile) {
                    newColumn = element.querySelector('.resume-collection-mobile');
                    if (!newColumn) {
                        newColumn = document.createElement('div');
                        newColumn.className = 'resume-collection-mobile';
                        newColumn.style.color = 'rgba(0, 0, 0, 0.8)';
                        element.querySelector('.listItemRt').appendChild(newColumn);
                    }
                } else {
                    newColumn = element.querySelector('.resume-collection');
                    if (!newColumn) {
                        newColumn = document.createElement('div');
                        newColumn.className = 'list-cell resume-collection';
                        newColumn.style.width = '10%';
                        newColumn.style.flex = 'initial';
                        element.querySelector('.list-row-item').appendChild(newColumn);
                    }
                }
                newColumn.textContent = `${resumeCollectionNum}`;
            }
        })
        .catch(error => {
            console.error(`Error for postId ${postId}:`, error);
        });
    }

    // Add a new header column for Resume Collection Number (PC site)
    function addResumeCollectionHeader() {
        const headerRow = document.querySelector('.list-hd.list-row-item');
        if (headerRow && !headerRow.querySelector('.resume-collection-header')) {
            const newHeader = document.createElement('div');
            newHeader.className = 'list-cell resume-collection-header';
            newHeader.style.width = '10%';
            newHeader.style.flex = 'initial';
            newHeader.textContent = '投递';
            headerRow.appendChild(newHeader);
        }
    }

    // Function to process all current and future elements
    function processElements(mobile = false) {
        if (!mobile) {
            addResumeCollectionHeader();
        }
        const selector = mobile ? 'div.listItem' : 'div.list-item-main';
        document.querySelectorAll(selector).forEach(element => {
            const postId = mobile ? element.querySelector('.listItemRtMsgs').getAttribute('id') : element.getAttribute('id');
            if (postId) {
                makePostRequest(element, mobile);
            }
        });
    }

    // Start by processing existing elements
    setTimeout(() => {
        const mobile = window.location.href.includes('/mc/position/campus');
        processElements(mobile);
    }, 1000);

    // Use MutationObserver to detect when new list items are added and process them
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const mobile = window.location.href.includes('/mc/position/campus');
                    if (mobile && node.classList.contains('listItem')) {
                        const postId = node.querySelector('.listItemRtMsgs').getAttribute('id');
                        if (postId) {
                            makePostRequest(node, true);
                        }
                    } else if (!mobile && node.classList.contains('list-item-main')) {
                        const postId = node.getAttribute('id');
                        if (postId) {
                            makePostRequest(node);
                        }
                    }
                }
            });
        });
    });

    // Observe changes in the document's body or a specific container
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

