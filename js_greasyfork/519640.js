// ==UserScript==
// @name         ParagonJSTool
// @version      2.4
// @description  添加自动回复识别、跳过功能
// @author       jianfeng, lulzhang
// @icon        https://m.media-amazon.com/images/G/01/Help/pg.png
// @match        https://paragon-fe.amazon.com/hz/view-case?caseId=*
// @grant        none
// @namespace https://greasyfork.org/users/1326983
// @downloadURL https://update.greasyfork.org/scripts/519640/ParagonJSTool.user.js
// @updateURL https://update.greasyfork.org/scripts/519640/ParagonJSTool.meta.js
// ==/UserScript==

window.addEventListener("wheel",CheckLoading)

let progress={
    "create_Reply_Button":false,
    "Add_result_Decoration":false,
    "Check_Textarea_NG_word":false

}

let functions={
    "create_Reply_Button":create_Reply_Button,
    "Add_result_Decoration":Add_Seasonal_Decoration,
    "Check_Textarea_NG_word":Check_Textarea_NG_word
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
    button.id="Quote_Button"
    button.innerHTML="📑"

    let pl = document.querySelectorAll('kat-table-cell.value')[2];
    let download_link;

    // 同时安装完了JS的话会有冲突, 因此删除
    //let emailBodyElements = document.getElementsByClassName('container_FmaJb');
    //if (emailBodyElements.length > 1) {
    //    let buttonElement = emailBodyElements[1].querySelector('button');
    //    if (buttonElement) {
    //        buttonElement.click();
    //    } else {
    //        console.log('第二个 emailBodyElement 中没有找到button');
    //    }
    //} else {
    //    console.log('没有emailBodyElements attribute');
    //}


    // 241203更新 P167830065
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
        let confirm_text =''
        let btn_resolver = document.querySelector('input[type="radio"][id^="katal-id-"][value="Resolved"]')
        let btn_wip = document.querySelector('input[type="radio"][id^="katal-id-"][value="Work-in-Progress"]')
        let btn_pma = document.querySelector('input[type="radio"][id^="katal-id-"][value="Pending Merchant Action"]')
        let reply_Text=document.querySelector("#composer > kat-card:nth-child(3) > div:nth-child(4) > div.textarea-container.component.outbound-textbox > div:nth-child(1) > textarea")

        let title_text=document.getElementsByClassName("composer-input-group")[0]
        let emailBodyElements = document.getElementsByClassName('container_FmaJb');
        emailBodyElements[1].querySelector('button').click() //关闭展开
        let email_number = emailBodyElements[1].children.length;

        let title_element = document.querySelector(".composer-input-group input");

        const headerTextElement = document.querySelector('.headerDate_siPAE .text_hF6BH');
        const last_datetime = headerTextElement && headerTextElement.textContent.trim() ? headerTextElement.textContent.trim() : new Date();

        var diffDays = (new Date() - new Date(last_datetime)) / (1000 * 60 * 60 * 24);
        var isMoreThanSixDays = diffDays > 6;
        console.log(isMoreThanSixDays);
        console.log(diffDays);

        function updateTitle(prefix) {
            let currentTitle = title_element.value;
            if (!currentTitle.includes(prefix)) {
                title_element.value = `${prefix}${currentTitle}`;
                title_element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        // each blurbs
        if (title_text.value.includes('画像修正依頼') && btn_pma.checked) {　//画像修正+ pending Merchant action
            updateTitle("（確認連絡）");
            confirm_text = `ご担当者様

いつもお世話になっております。アマゾンアシスタントの○○です。
お忙しいところ恐縮ですが、納品いただいた現物と弊社のカタログ画像に相違がある件につきまして、ご確認の進捗はいかがでしょうか。
弊社にて早めに画像修正が対応できるように、現物の画像をご送付いただけますでしょうか。
ご確認の上、○月○日までにご送付頂けましたら幸いです。
改めてご依頼内容を下記に記載致します。

■対象商品
JAN:XX
Asin:B00XXXXXX
商品名:YY

■修正が必要な画像
（SIMの情報を記載。例えば、メイン画像、サブ画像PT01）
＞薬剤師の依頼内容は「修正or削除」である場合
＊サブ画像PT01(商品詳細ページの2枚目）は古いバージョンですが、新たな画像をいただければ幸いです。
新たなサブ画像がなければ、こちらは削除いたします。ご了承のほどお願いいたします。
大変お手数をおかけしますが、ご確認のほどよろしくお願い致します。
今後ともよろしくお願いいたします。`;
        } else if (title_text.value.includes('画像修正依頼')) {
            updateTitle("");
        } else if (btn_pma.checked) {
            updateTitle("(確認連絡)");
            confirm_text = `ご担当者様

いつも大変お世話になっております。アマゾンアシスタントの○○です。
ご依頼頂いた件、作業を進めるにあたり、下記の事項をご確認お願い申し上げます。

要置換：
・×××××(確認事項を記載)

大変お手数ですが、上記の事項をご確認の上、ご指示の程よろしくお願いいたします。
その他ご質問、ご不明な点がございましたら、こちらのメールへご連絡いただけますと幸いです。

お忙しいところ恐縮ですが、ご返信いただきたく存じます。`;
        } else if (isMoreThanSixDays) {
            updateTitle("(進捗報告)");
            confirm_text = `ご担当者様

いつも大変お世話になっております。アマゾンアシスタントの○○です。

前日ご依頼の案件の進捗状況について、以下の通り報告させていただきます。
今回のご依頼はxx ASINのXXXXX設定作業でございますが、

要置換：①まだ对应中の場合：
現時点まだ作業中になっております。

要置換：②TS中の場合：
現時点はエラーが出て反映失敗しており、社内で調査・対応しております。
（要置換：＊状況に応じて連絡してください。）

進捗がありましたらまたご連絡いたします。少々お待ちいただけますと幸いです。

どうぞよろしくお願いいたします。`;
        }  else if  (title_element.value.includes("至急") && title_element.value.includes("JP031") && !title_element.value.includes("受領連絡")) {
            title_element.value = email_number < 3 ? "（受領連絡）" + title_element.value : title_element.value;
            title_element.dispatchEvent(new Event('input', { bubbles: true }));
            confirm_text = `ご担当者様

いつもお世話になっております。
この度ご依頼いただき、誠にありがとうございます。

ご依頼の件、承知いたしました。今から至急で対応させていただきます。
基本xx営業日(要置換：基本的にはwinston作業日＋２営業日）以内に作業完了を予定しておりますが、
それ以上の時間がかかる場合もございます。予めご了承ください。
お急ぎのところ恐れ入りますが、しばらくお待ちいただければ幸いです。

なお、作業途中で確認事項が発生した場合は、別途確認のメールをお送りさせていただきます。

ご不明な点があればこちらのメールまでお問い合わせください。

宜しくお願いいたします。

また、ご依頼のビデオは下記のような情報が含まれると、「景品表示法」やその他の広告規制などにより拒否されている可能性が高いです。
1. 価額宣伝、リリース日にち。
2. 医薬服用アドバイス。
3. 性的な内容が含まれ、成人向け。
4. 外部リンク。
予めご了承いただけますようお願いいたします。
**************************************************************************************************************
Seller Centralのトレーニング資料
https://sellercentral.amazon.co.jp/gp/help/external/G202024200?language=ja_JP
Note: Amazonで商品を掲載または販売する場合には、適用されるすべての法規制（通知・通達等を含む）を順守していなければなりません。

その他お役立ち情報：
· 消費者庁: 景品表示法（日本語）
<www.caa.go.jp/policies/policy/representation/fair_labeling/>
· 消費者庁: 健康や栄養に関する表示の制度について（日本語）
<www.caa.go.jp/policies/policy/food_labeling/health_promotion/>
· 厚生労働省: 医薬品等の広告規制について（日本語）
<www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iyakuhin/koukokukisei/index.html>
· 東京都福祉保健局: 医薬品的な効果効能について（日本語）
<https://www.fukushihoken.metro.tokyo.lg.jp/kenkou/kenko_shokuhin/ken_syoku/kanshi/kounou.html>

法的な制限に関して、ご不明点があれば担当ブランドスペシャリストまでご連絡ください。
宜しくお願いいたします。`;
        } else if (title_element.value.includes("JP031") && !title_element.value.includes("受領連絡")) {
            title_element.value = email_number < 3 ? "（受領連絡）" + title_element.value : title_element.value;
            title_element.dispatchEvent(new Event('input', { bubbles: true }));
            confirm_text = `ご担当者様

いつもお世話になっております。アマゾンアシスタントの○○です。
この度ご依頼いただき、誠にありがとうございます。

ご依頼の件に関して、ファイルを受領したことをご連絡させていただきます。
５営業日ごとに定期的に案件の進捗を報告いたしますので、ご安心ください。
作業完了後にまた完了連絡をいたしますので、しばらくお待ちください。

なお、作業途中で確認事項が発生した場合は、別途確認のメールをお送りさせていただきます。
何かご不明な点やわかりにくい部分などございましたら、いつでもお気軽にご連絡いただけたらと存じます。

宜しくお願いいたします。

また、ご依頼のビデオは下記のような情報が含まれると、「景品表示法」やその他の広告規制などにより拒否されている可能性が高いです。
1. 価額宣伝、リリース日にち。
2. 医薬服用アドバイス。
3. 性的な内容が含まれ、成人向け。
4. 外部リンク。
予めご了承いただけますようお願いいたします。
**************************************************************************************************************
Seller Centralのトレーニング資料
https://sellercentral.amazon.co.jp/gp/help/external/G202024200?language=ja_JP
Note: Amazonで商品を掲載または販売する場合には、適用されるすべての法規制（通知・通達等を含む）を順守していなければなりません。

その他お役立ち情報：
· 消費者庁: 景品表示法（日本語）
<www.caa.go.jp/policies/policy/representation/fair_labeling/>
· 消費者庁: 健康や栄養に関する表示の制度について（日本語）
<www.caa.go.jp/policies/policy/food_labeling/health_promotion/>
· 厚生労働省: 医薬品等の広告規制について（日本語）
<www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iyakuhin/koukokukisei/index.html>
· 東京都福祉保健局: 医薬品的な効果効能について（日本語）
<https://www.fukushihoken.metro.tokyo.lg.jp/kenkou/kenko_shokuhin/ken_syoku/kanshi/kounou.html>

法的な制限に関して、ご不明点があれば担当ブランドスペシャリストまでご連絡ください。
宜しくお願いいたします。`;
        } else if (title_element.value.includes("至急") && !title_element.value.includes("受領連絡")) {
            title_element.value = email_number < 3 ? "（受領連絡）" + title_element.value : title_element.value;
            title_element.dispatchEvent(new Event('input', { bubbles: true }));
            confirm_text = `ご担当者様

いつもお世話になっております。
この度ご依頼いただき、誠にありがとうございます。

ご依頼の件、承知いたしました。今から至急で対応させていただきます。
基本xx営業日(要置換：基本的にはwinston作業日＋２営業日）以内に作業完了を予定しておりますが、
それ以上の時間がかかる場合もございます。予めご了承ください。
お急ぎのところ恐れ入りますが、しばらくお待ちいただければ幸いです。

なお、作業途中で確認事項が発生した場合は、別途確認のメールをお送りさせていただきます。

ご不明な点があればこちらのメールまでお問い合わせください。

宜しくお願いいたします。`;
        } else if (!title_element.value.includes("受領連絡")) {
            title_element.value = email_number < 3 ? "（受領連絡）" + title_element.value : title_element.value;
            title_element.dispatchEvent(new Event('input', { bubbles: true }));
            confirm_text = `ご担当者様

いつもお世話になっております。
この度ご依頼いただき、誠にありがとうございます。

ご依頼の件に関して、ファイルを受領したことをご連絡させていただきます。
５営業日ごとに定期的に案件の進捗を報告いたしますので、ご安心ください。
作業完了後にまた完了連絡をいたしますので、しばらくお待ちください。

なお、作業途中で確認事項が発生した場合は、別途確認のメールをお送りさせていただきます。
ご不明な点があればこちらのメールまでお問い合わせください`;
        }

        reply_Text.value=`${confirm_text}\n\nアマゾンジャパン合同会社\nアシスタント：张 璐（チョウ ロ）/Zhang Lu${download_link}${reply_Text.value}
        \n以下、前回の連絡になります*********************************************************\n${first_Reply.innerText}`}
    space.append(button)
}


function Add_Seasonal_Decoration(){
    let space=One("//button[@id='Quote_Button']",document)

    let FourSeasons=new Date()
    let tempMonth=FourSeasons.getMonth()+1

    let seasonalReminder={
        "春":"🐸🤹‍♀️",
        "夏":"💃🦩🏝️",
        "秋":"🧜‍♂️🌾🐖🍂",
        "冬":"🤸‍♀️⛄🐈🎄"
    }

    let seasonalCSS={
        "春":"font-style:bold;border:2px solid gold;color:white;background:linear-gradient(90deg, rgba(255,192,203,1) 46%, rgba(98,240,8,1) 100%);",
        "夏":"font-style:bold;border:2px solid gold;color:white;background:linear-gradient(90deg, rgba(88,204,66,1) 0%, rgba(128,227,114,1) 39%, rgba(255,240,100,1) 67%, rgba(255,244,138,1) 89%);",
        "秋":"font-style:bold;border:2px solid gold;color:white;background:linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);",
        "冬":"font-style:bold;border:2px solid gold;color:white;background:linear-gradient(90deg, rgba(142,180,58,1) 0%, rgba(29,207,253,1) 50%, rgba(3,92,199,1) 100%);"
    }

    let seasonalReference={
        3:"春",4:"春",5:"春",
        6:"夏",7:"夏",8:"夏",
        9:"秋",10:"秋",11:"秋",
        12:"冬",1:"冬",2:"冬"
    }

    space.style.cssText =seasonalCSS[seasonalReference[tempMonth]]
    space.innerText=space.innerText + seasonalReminder[seasonalReference[tempMonth]]

    window.removeEventListener("wheel",CheckLoading)
}


function Check_Textarea_NG_word() {
    let checkSpace= One("//span[text()='返信']/..",document)
    let button=document.createElement("button")
    button.id="NG_Check"
    button.innerHTML='TextCheck'

    button.style.margin='10px'
    button.style.borderRadius='8px'
    button.style.backgroundColor='#e6e6fa' // 这里换背景色哦


    checkSpace.append(button)
    //console.log('找到元素',checkSpace)

    var ngwords = ['要置換', '○○', 'XX']; // 在这里填写自己像检查的NG woed； 只检查邮件编辑框内的内容， 不包括title！

    button.addEventListener('click', function() {
        var textarea = document.querySelector('textarea');
        if (!textarea) {
            alert('没有找到邮件输入框！');
            return;
        }

        var content = textarea.value;
        var foundNgwords = ngwords.filter(word => content.includes(word));

        if (foundNgwords.length > 0) {
            alert('请替换: ' + foundNgwords.join(', '));
        } else {
            alert('检查完毕，无需替换哦');
        }
    });
};