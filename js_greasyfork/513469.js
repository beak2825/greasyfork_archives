// ==UserScript==
// @name        完了联络专用
// @version      1.6
// @description  增加自动回复对应功能
// @author       jianfeng, lulzhang
// @icon         https://m.media-amazon.com/images/G/01/Help/pg.png
// @match       https://paragon-fe.amazon.com/hz/view-case?caseId=*
// @grant        none
// @namespace https://greasyfork.org/users/1326983
// @downloadURL https://update.greasyfork.org/scripts/513469/%E5%AE%8C%E4%BA%86%E8%81%94%E7%BB%9C%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513469/%E5%AE%8C%E4%BA%86%E8%81%94%E7%BB%9C%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

window.addEventListener("wheel",CheckLoading)

let progress={
    "create_Reply_Button":false,
    "Add_result_Decoration":false,

}

let functions={
    "create_Reply_Button":create_Reply_Button,
    "Add_result_Decoration":Add_result_Decoration,

}

function CheckLoading(){
    for (step_Name in progress){

        if (progress[step_Name]===false){
            functions[step_Name]()
            progress[step_Name]=true
        }
    }
}

//ノード取得用のXPATH関数
const One=(expr,start)=> document.evaluate(
    expr,start,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null
).singleNodeValue


function create_Reply_Button(){
    let space=One("//span[text()='問題の概要']/..",document)
    let button=document.createElement("button")
    button.id="result_Button"
    button.innerHTML="完了するぞ👏"

    // 241203更新 P167830995
    let emailBodyElements = document.getElementsByClassName('container_FmaJb');
    emailBodyElements[1].querySelector('button').click()

    let first_Reply = '';
    const interval = setInterval(() => {
        let latest_reply_title = document.querySelector('div[class*="subject_"] span[class*="text_"]');
        if (latest_reply_title) {
            console.log('latest_title:', latest_reply_title);
            const keywords = ["自動応答", "Automatic reply"]; // 在这里填写需要的keyword
            if (keywords.some(keyword => latest_reply_title.textContent.includes(keyword))) {
                first_Reply = One(
                    "(//span[text()='対応履歴']/../../..//div[contains(@class,'pre_') or contains(@class,'contact-text')])[4]",document);
            } else {
                first_Reply = One(
                    "//span[text()='対応履歴']/../../..//div[contains(@class,'pre_') or contains(@class,'contact-text')]",document);
            }
            if (first_Reply) {
                console.log('First Reply:', first_Reply.innerText);
            } else {
                console.error('未找到latest title attribute');
            }
        }
    }, 100);

    let pl = document.querySelectorAll('kat-table-cell.value')[2];
    let download_link;
    if (pl.textContent.includes('ll')) {
        download_link = `
——————————————————————————————————————————————————————————
LL※下記のリンクから各タスクのInputsheetの最新バージョンをダウンロードできます。 更新日：2024/5/31　更新タスク：JP021更新
<https://jpavs.awsapps.com/workdocs/index.html#/share/document/7ffb983bcc4507ea0b91dc8d3bdc69d1ed21a10babd9fba5665573f51ddf484b>
——————————————————————————————————————————————————————————
`;
    } else if (pl.textContent.includes('books')) {
        download_link = `
————————————————————————————————————————————————————————
Books※下記のリンクから各タスクのInputsheetの最新バージョンをダウンロードできます。   更新日：2023/04/11
<https://jpavs.awsapps.com/workdocs/index.html#/share/document/c432e5b5d52a10a3dd4f35676280d451787e8891f8d8017d255a594fcf0b8b74>
————————————————————————————————————————————————————————
`;
    }else if (pl.textContent.includes('sl')) {
        download_link = `
——————————————————————————————————————————————————————————
Sl※下記のリンクから各タスクのInputsheetの最新バージョンをダウンロードできます。   更新日：2023/12/1　更新タスク：JP119
<https://jpavs.awsapps.com/workdocs/index.html#/share/document/d5aed372339db66aa89ce933b4794538b76bc27270a19d0750514254192497d1>
——————————————————————————————————————————————————————————
`;
    }else if (pl.textContent.includes('eits')) {
        download_link = `
—————————————————————————————————————————————————————————
Eits※下記のリンクから各タスクのInputsheetの最新バージョンをダウンロードできます。 更新日：2023/11/16　更新タスク：JP036
<https://jpavs.awsapps.com/workdocs/index.html#/share/document/6eb3f1602a1537b0e50131c2154994af48d388c41b2f21b77e2337f1db9fef9b>
—————————————————————————————————————————————————————————
`;
    } else {
        download_link = `
——————————————————————————————————————————————————————————
Cons※下記のリンクから各タスクのInputsheetの最新バージョンをダウンロードできます。   更新日：2024/3/11　更新タスク：JP009廃棄;JP077更新
<https://jpavs.awsapps.com/workdocs/index.html#/share/document/273fb26860eb00b8337d418e82c51f8dddbc7d4ff08515494ef9f94d5d3b1cb5>
——————————————————————————————————————————————————————————
`;
    };

    button.onclick=function Test(){
        // 添加自动点选Resolved方法
        let btn_resolver = document.querySelector('input[type="radio"][id^="katal-id-"][value="Resolved"]')
        let btn_wip = document.querySelector('input[type="radio"][id^="katal-id-"][value="Work-in-Progress"]')
        let status_reopened = document.querySelector("#flo-ccd-case-info > kat-table-body > kat-table-row:nth-child(4) > kat-table-cell.value > span").textContent == 'Reopened'

        if (btn_resolver && !btn_resolver.checked) {
            btn_resolver.click();}

        // 20241022 Shuhui updated
        let reply_Text=document.querySelector("#composer > kat-card:nth-child(3) > div:nth-child(4) > div.textarea-container.component.outbound-textbox > div:nth-child(1) > textarea")
        let title_text=document.getElementsByClassName("composer-input-group")[0]
        let paragon_id = document.querySelectorAll('kat-table-cell.value')[0].textContent.match(/\d+/)[0];
        let caution_infos = {"JP051":
                             `
注意事項：
・バリエーションを組むには同ブランドである必要があります。
・バリエーション新規作成の作業につきまして、P_ASINの商品名をご提供する必要があります。ご記入頂いていない場合、C ASIN 商品名の共通内容などにより設定いたします。
・一つのASINは一組のバリエーションしか作成されませんので、「新規」と「追加」作業をご依頼する場合、先に既存バリエーション削除してから作業を行いますので、事前ご了承のほどよろしくお願い致します。
・同じバリエーション内のASINを区別するには、異なる表示内容を記入する必要があります。
※ 上記の注意事項に従わずにバリエーション関係を作成することは可能ですが、作成後弊社のシステムより不適切と判断して自動的に解除される可能性があります。
ご希望のバリエーション関係が自動的に解除された場合、新規にてお問い合わせください。担当者が迅速に事情確認を対応いたしますので、ご安心ください。
ご了承・ご理解のほどよろしくお願いいたします。`,
                             "JP036":`

注意事項：
商品詳細ページには7枚の画像(PT06まで)しか閲覧できませんが、
これら7枚の画像のいずれかをクリックするだけでPT07以降の画像を見ることができます。
モバイル端末の場合、7枚目まで（PT06）しか表示されません。
予めご了承いただけますようお願いいたします。`,
                             "JP068":`

注意事項：
商品のショッピングカートは多数の原因より影響されやすいので、ご依頼のASINのカートが後に再度落ちる場合、ASIN自体はエラーがある（収益性問題等）可能性があります。
その際は新規ケースにて再度ご依頼いただけますようお願い申し上げます。
案件を受けましたら、こちら側は迅速に対応いたしますので、ご安心ください。
ご理解のほどよろしくお願いいたします。`,
                             "JP006":`

注意事項：
＊ セット買いに含まれている商品のどちらかが在庫切れの場合、セット商品のショッピングカートが落ちる可能性が高いと思います。
カートの修正をご希望の場合、新規案件でタスク「JP068_カート落ち商品の原因分析と修正」をご依頼いただければ幸いです。
こちらで迅速に対応いたしますので、ご安心ください。
予めご了承いただけますようお願いいたします。`,
                             "JP077":`

注意事項：
弊社のシステム変更に伴い、2024年9月より、A+コンテンツ内の比較チャートの数が、1 A+につき1つに制限されることになりました。
また、既存のA+に複数の比較チャートがある場合、自動的に1つの比較チャートに削減されることになります。
この変更により、最初の比較チャートのみが商品詳細ページのA+コンテンツ内に表示され、その下にある他の比較チャートは表示されないことになります。
ご迷惑をおかけいたしますが、何卒ご了承賜りますようお願い申し上げます。`}

        function findCautionInfo(title_text){
            let upperText = title_text.value.toUpperCase()
            for (let i in caution_infos){
                if (upperText.includes(i)) {return caution_infos[i]}
            }return ""
        }
        let caution_info_in_thiscase = findCautionInfo(title_text) // 添加特殊task注意事项识别

        let emailBodyElements = document.getElementsByClassName('container_FmaJb');
        if (emailBodyElements.length > 1) {
            let title_element = document.querySelector(".composer-input-group input");
            if (title_text.value.includes('画像修正依頼')) {
                let currentTitle = title_element.value;
                title_element.value =title_element.value.includes("（完了連絡）") ? title_element.value : "（完了連絡）" + title_element.value;
                title_element.dispatchEvent(new Event('input', { bubbles: true }));
                let asin = title_element.value.match(/([A-Z0-9]{10})/)[0];

                download_link =''
                reply_Text.value = `ご担当者様

いつも大変お世話になっております。アマゾンアシスタントのXXXです。
ASIN「${asin}」の画像修正作業に関して、作業が完了しましたのでご連絡させていただきます。

ご指示の通り、ブランド所有者様の画像を削除いたしました。
差し替えの画像は商品詳細ページに反映されています。

結果については下記リンクをご確認ください。
<https://www.amazon.co.jp/dp/${asin}/?th=1>
結果のキャプチャも添付致しました、ご参考になれば幸いです。

何卒よろしくお願い申し上げます。
————————————————————————————————————————
弊社はオペレーションチームのクオリティ改善に向け、
ケースクローズに伴う満足度調査を実施しております。
下記のアンケートにご協力いただき、ご意見をお聞かせ願えますと幸いです。
管理番号：${paragon_id}
https://amazonexteu.qualtrics.com/jfe/form/SV_8kLXQ56NcX0UmYC
————————————————————————————————————————
アマゾンジャパン合同会社
アシスタント：张 璐（チョウ ロ）/Zhang Lu
————————————————————————————————————————
以下、前回の連絡になります*********************************************************\n${first_Reply.innerText}
`
            } else if (status_reopened) {
                let currentTitle = title_element.value;
                title_element.value = title_element.value.includes("（完了連絡）") ? title_element.value : "（完了連絡）" + title_element.value;
                title_element.dispatchEvent(new Event('input', { bubbles: true }));
                reply_Text.value=`ご担当者様

いつもお世話になっております。
ご確認とご連絡、誠にありがとうございます。

引き続き、弊社のサービス向上に尽力して参ります。
お忙しいところ恐縮ですが、下記のアンケートをご協力いただけますと幸いです。
———————————————————————————————————————————————————————————
弊社はオペレーションチームのクオリティ改善に向け、
ケースクローズに伴う満足度調査を実施しております。
下記のアンケートにご協力いただき、ご意見をお聞かせ願えますと幸いです。
管理番号：${paragon_id}
満足度調査アンケート：<https://amazonexteu.qualtrics.com/jfe/form/SV_8kLXQ56NcX0UmYC>
———————————————————————————————————————————————————————————
アマゾンジャパン合同会社
アシスタント：张 璐（チョウ ロ）/Zhang Lu ${download_link}${reply_Text.value}\n以下、前回の連絡になります*********************************************************\n${first_Reply.innerText}`

            } else if (title_element) {
                let currentTitle = title_element.value;
                title_element.value =title_element.value.includes("（完了連絡）") ? title_element.value : "（完了連絡）" + title_element.value;
                title_element.dispatchEvent(new Event('input', { bubbles: true }));
                reply_Text.value=`ご担当者様

いつもお世話になっております。アマゾンアシスタントのチョウでございます。
ご依頼頂きました「 」の件に関して、作業が完了しましたのでご連絡させていただきます。
作業結果はすでに弊社システムと商品詳細ページまで反映されております。
本案件のASIN数量が多いので、添付レポートにてご確認お願い致します。

ご確認のほどよろしくお願い申し上げます。

何かご不備などがございましたら、ご遠慮なく新規案件をご依頼ください。
案件を受け次第すぐに対応いたしますので、ご安心ください。

何卒よろしくお願いいたします。${caution_info_in_thiscase}
————————————————————————————————————————
弊社はオペレーションチームのクオリティ改善に向け、
ケースクローズに伴う満足度調査を実施しております。
下記のアンケートにご協力いただき、ご意見をお聞かせ願えますと幸いです。
管理番号：${paragon_id}
https://amazonexteu.qualtrics.com/jfe/form/SV_8kLXQ56NcX0UmYC
————————————————————————————————————————
アマゾンジャパン合同会社
アシスタント：张 璐（チョウ ロ）/Zhang Lu ${download_link}${reply_Text.value}\n以下、前回の連絡になります*********************************************************${first_Reply.innerText}`
            }
        } else {
            console.log("指定的类名元素不存在或只有一个");
        }

    }
    space.append(button)
}


function Add_result_Decoration(){
    let space=One("//button[@id='result_Button']",document)
    let FourSeasons=new Date()
    let tempMonth=FourSeasons.getMonth()+1
    let seasonalReminder={
        "p1":"⛹️‍♂️",
        "p2":"💃",
        "p3":"🧜‍♂️",
        "p4":"🤸‍♀️"
    }

    let seasonalCSS={
        "p1":"font-style:bold;border:2px solid white;color:darkslategray;background:linear-gradient(90deg, rgba(211, 211, 211,1) 0%, rgba(220, 220, 220,1) 50%, rgba(119, 136, 153,1) 100%);",
        "p2":"font-style:bold;border:2px solid white;color:darkslategray;background:linear-gradient(90deg, rgba(211, 211, 211,1) 0%, rgba(220, 220, 220,1) 50%, rgba(119, 136, 153,1) 100%);",
        "p3":"font-style:bold;border:2px solid white;color:darkslategray;background:linear-gradient(90deg, rgba(211, 211, 211,1) 0%, rgba(220, 220, 220,1) 50%, rgba(119, 136, 153,1) 100%);",
        "p4":"font-style:bold;border:2px solid white;color:darkslategray;background:linear-gradient(90deg, rgba(211, 211, 211,1) 0%, rgba(220, 220, 220,1) 50%, rgba(119, 136, 153,1) 100%);"
    }

    let seasonalReference={
        3:"p1",4:"p2",5:"p3",
        6:"p4",7:"p1",8:"p2",
        9:"p3",10:"p4",11:"p1",
        12:"p2",1:"p3",2:"p4"
    }


    space.style.cssText =seasonalCSS[seasonalReference[tempMonth]]
    space.innerText=space.innerText + seasonalReminder[seasonalReference[tempMonth]]

    window.removeEventListener("wheel",CheckLoading)
}
