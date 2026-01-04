// ==UserScript==
// @name         妖火网表情图片插件
// @namespace    https://yaohuo.me/
// @version      0.15
// @description  2022-12-18 表情选择、图片图床
// @author       外卖不用券(id:23825)
// @match        https://yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456680/%E5%A6%96%E7%81%AB%E7%BD%91%E8%A1%A8%E6%83%85%E5%9B%BE%E7%89%87%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456680/%E5%A6%96%E7%81%AB%E7%BD%91%E8%A1%A8%E6%83%85%E5%9B%BE%E7%89%87%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function addToolBar(form) {
  const submitBtn = document.getElementsByName("g")[0];
  const toolBarDiv = createToolBar();
  form.insertBefore(toolBarDiv, submitBtn);
}

function createToolBar() {
  const toolContainer = document.createElement("div");
  toolContainer.setAttribute("name", "tool-container");
  toolContainer.setAttribute("style", "display: inline-block; float: left");

  toolContainer.appendChild(createFlexContainer());

  return toolContainer;
}

function createFlexContainer() {
  const flexContainer = document.createElement("div");
  flexContainer.setAttribute("name", "flex-container");
  flexContainer.setAttribute("style", "display: flex; align-items: center;");
  flexContainer.appendChild(createEmojiContainer());
  flexContainer.appendChild(createImgContainer());

  return flexContainer;
}

function createEmojiContainer() {
  const emojiContainer = document.createElement("div");
  emojiContainer.setAttribute("name", "emoji-container");
  emojiContainer.setAttribute(
    "style",
    "display: flex; align-items: center; position: relative"
  );

  emojiContainer.appendChild(createEmojiBox());
  emojiContainer.appendChild(creatEmojiPicker());

  emojiContainer.onclick = function () {
    // emoji picker show and close
    const emojiPicker = document.getElementsByName("emoji-picker")[0];
    emojiPicker.style.display == "none"
      ? (emojiPicker.style.display = "block")
      : (emojiPicker.style.display = "none");
    // btn变蓝
  };

  return emojiContainer;
}

function createEmojiBox() {
  const emojiBox = document.createElement("div");
  emojiBox.setAttribute("name", "emoji-box");
  emojiBox.setAttribute(
    "style",
    "display: flex; align-items: center; position: relative;"
  );
  emojiBox.insertAdjacentHTML(
    "afterbegin",
    `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style='margin-right: 4px; fill: #4e5969'><path fill-rule="evenodd" clip-rule="evenodd" d="M8.00002 0.666504C12.0501 0.666504 15.3334 3.94975 15.3334 7.99984C15.3334 12.0499 12.0501 15.3332 8.00002 15.3332C3.94993 15.3332 0.666687 12.0499 0.666687 7.99984C0.666687 3.94975 3.94993 0.666504 8.00002 0.666504ZM8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM10.6667 5.66667V7.66667H9.33333V5.66667H10.6667ZM6.66667 5.66667V7.66667H5.33333V5.66667H6.66667ZM10.0767 9.33333H11.0495C11.1804 9.33333 11.2866 9.43951 11.2866 9.57048C11.2866 9.60754 11.2779 9.64409 11.2612 9.67718L11.244 9.71053C10.6294 10.8739 9.40726 11.6667 7.99998 11.6667C6.61523 11.6667 5.40977 10.8991 4.7859 9.76612L4.73786 9.67593C4.67845 9.56052 4.72385 9.4188 4.83926 9.35939C4.87253 9.34226 4.90941 9.33333 4.94683 9.33333H5.92347C6.02396 9.33332 6.11908 9.37865 6.18238 9.4567C6.26207 9.55496 6.32833 9.62955 6.38117 9.68046C6.80074 10.0847 7.37133 10.3333 7.99998 10.3333C8.63289 10.3333 9.20694 10.0814 9.62728 9.67224C9.67791 9.62296 9.74135 9.55121 9.8176 9.45698C9.88089 9.37877 9.97611 9.33333 10.0767 9.33333Z"></path></svg>
    <span>表情</span>
    `
  );
  // emojiBox.onclick = function () {};  // 变色

  return emojiBox;
}

function creatEmojiPicker() {
  const emojiPicker = document.createElement("div");
  emojiPicker.setAttribute("name", "emoji-picker");
  emojiPicker.setAttribute(
    "style",
    "position: absolute; top: 36px; left: 0; background: #fff; box-shadow: 0 8px 24px rgb(0 0 0 / 16%); border-radius: 2px; width: 94vw; max-width: 416px; display: none;  z-index: 1;"
  );

  const pickerBody = document.createElement("div");
  pickerBody.setAttribute("name", "pickerBody");
  const pickerItem = document.createElement("div");
  pickerItem.setAttribute("name", "pickerItem");
  pickerItem.setAttribute(
    "style",
    "overflow-x: hidden; overflow-y: scroll; height: 270px; box-sizing: border-box; margin: 12px 4px;"
  );
  const emojiList = document.createElement("div");
  emojiList.setAttribute("name", "emojiList");
  emojiList.setAttribute(
    "style",
    "padding-left: 12px; padding-bottom: 12px; display: flex; flex-wrap: wrap;"
  );

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
      const position = `${-38 * j}px ${-38 * i}px`,
        index = i * 10 + j;
      if (index + 1 > emojiTxt.length) break;
      emojiList.appendChild(createEmojiItem(emojiTxt[index], position));
    }
  }
  pickerItem.appendChild(emojiList);
  pickerBody.appendChild(pickerItem);
  emojiPicker.appendChild(pickerBody);

  return emojiPicker;
}

function createEmojiItem(emojitxt, position) {
  const emojiItem = document.createElement("div");
  emojiItem.setAttribute("name", emojitxt);
  emojiItem.setAttribute(
    "style",
    `width: 28px; height: 28px; margin: 0 8px 8px 0; background: url(${emojiSprites}) no-repeat; background-position: ${position};`
  );
  emojiItem.onclick = function (e) {
    // choose emoji
    e.stopPropagation();
    const emojiPicker = document.getElementsByName("emoji-picker")[0];
    emojiPicker.style.display = "none"; // hide picker box
    const contentArea = document.getElementsByName("content")[0];
    contentArea.value = `${contentArea.value}${emojitxt}`; // add emoji text to content textarea
  };

  return emojiItem;
}

function createEmojiPicker() {
  const picker = document.createElement("div");
  picker.setAttribute(
    "style",
    "position: absolute; top: 34px; left: 0; background: #fff;  box-shadow: 0 8px 24px rgb(0 0 0 / 16%);  border-radius: 2px; max-width: 416px; width: 96vw;"
  );
}

function handleEmoji() {
  const submitBtn = document.getElementsByName("g")[0];
  const originClick = submitBtn.onclick; // click event interception
  submitBtn.onclick = function (e) {
    const content = document.getElementsByName("content")[0];
    if (!content.value.includes("[")) return void 0; // with no [ ] flag in content, do not intercept
    content.value = content.value.replaceAll(
      /\[[\u4e00-\u9fa5|\w]+\]/g,
      (x) => {
        return emojiTxt.includes(x)
          ? `[img]${emojiPrefix}${emojiSrc[emojiTxt.indexOf(x)]}[/img]`
          : x;
      }
    );
    originClick(e);
  };
}

function createImgContainer() {
  const imgContainer = document.createElement("div");
  imgContainer.setAttribute("name", "img-container");
  imgContainer.setAttribute(
    "style",
    "display: flex; align-items: center; position: relative"
  );

  imgContainer.appendChild(createImgBox());
  // imgContainer.appendChild(creatEmojiPicker());

  // imgContainer.onclick = function () {
  // btn变蓝
  // };

  return imgContainer;
}

function createImgBox() {
  const imgBox = document.createElement("div");
  imgBox.setAttribute("name", "img-btn");
  imgBox.setAttribute("type", "file");
  imgBox.setAttribute(
    "style",
    "display: flex; align-items: center; position: relative; cursor: pointer; margin-left: 12px; margin-right: 12px"
  );

  imgBox.insertAdjacentHTML(
    "afterbegin",
    `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style='margin-right: 4px; fill: #4e5969'><path data-v-48a7e3c5="" fill-rule="evenodd" clip-rule="evenodd" d="M14 1.3335C14.3514 1.3335 14.6394 1.60546 14.6648 1.95041L14.6666 2.00016V14.0002C14.6666 14.3516 14.3947 14.6396 14.0497 14.665L14 14.6668H1.99998C1.64853 14.6668 1.36059 14.3949 1.33514 14.0499L1.33331 14.0002V2.00016C1.33331 1.64871 1.60527 1.36077 1.95023 1.33532L1.99998 1.3335H14ZM13.3333 2.66618H2.66664V13.3328H13.3333V2.66618ZM11.9219 6.7879C11.9719 6.83791 12 6.90574 12 6.97647V11.7993C12 11.9098 11.9104 11.9993 11.8 11.9993H6.81615C6.7975 11.9993 6.77945 11.9968 6.76232 11.992L3.91042 11.9847C3.79996 11.9844 3.71063 11.8947 3.7109 11.7842C3.71102 11.7313 3.73209 11.6807 3.76948 11.6433L6.52468 8.88807C6.62882 8.78393 6.79766 8.78393 6.9018 8.88807L8.17297 10.1593L11.5447 6.7879C11.6489 6.68376 11.8177 6.68376 11.9219 6.7879ZM5.99997 3.99951V5.99951H3.99997V3.99951H5.99997Z"></path></svg> 
        <span>图片</span>
        <input id="imgFile" type="file" accept="image/*" style="position: absolute; left:0; top: 0; opacity: 0; width: 60px;">
    `
  );

  return imgBox;
}

function handleImg() {
  document.getElementById("imgFile").onchange = function () {
    const file = this.files[0];
    const content = document.getElementsByName("content")[0];
    const formData = new FormData();
    formData.append("files", file);
    formData.append("fileName", file.name);
    formData.append("part", "0");
    formData.append("partSize", "1");
    formData.append("fileID", new Date().getTime());
    console.log(file.name);
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = function() { // image async upload
    imgHosting(formData).then((visitId) => {
      fetch(
        atob(
          "aHR0cHM6Ly9rZi5kaWFucGluZy5jb20vYXBpL2ZpbGUvYnVyc3RVcGxvYWRGaWxl"
        ),
        {
          method: "POST",
          headers: {
            "CSC-VisitId": visitId,
          },
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            // console.log(data.data.uploadPath);
            content.value = `${content.value}[img]${data.data.uploadPath}[/img]`;
          }
        });
    });
  };
}

async function imgHosting() {
  return await fetch(
    atob(
      "aHR0cHM6Ly9rZi5kaWFucGluZy5jb20vY3NDZW50ZXIvYWNjZXNzL2RlYWxPcmRlcl9IZWxwX0RQX1BD"
    ),
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    }
  ).then((res) => new URL(res.url).searchParams.get("visitId"));
}

const viewPage = ["/bbs/book_re.aspx", "/bbs/book_view.aspx"];
const emojiTxt = [
  "[微笑]",
  "[呲牙]",
  "[色]",
  "[发呆]",
  "[可怜]",
  "[流泪]",
  "[害羞]",
  "[闭嘴]",
  "[睡]",
  "[吃瓜群众]",
  "[尴尬]",
  "[发怒]",
  "[调皮]",
  "[撇嘴]",
  "[思考]",
  "[不失礼貌的微笑]",
  "[奸笑]",
  "[抓狂]",
  "[吐]",
  "[偷笑]",
  "[愉快]",
  "[白眼]",
  "[傲慢]",
  "[困]",
  "[灵光一现]",
  "[流汗]",
  "[憨笑]",
  "[捂脸]",
  "[奋斗]",
  "[咒骂]",
  "[疑问]",
  "[嘘]",
  "[晕]",
  "[衰]",
  "[骷髅]",
  "[敲打]",
  "[再见]",
  "[擦汗]",
  "[抠鼻]",
  "[泣不成声]",
  "[坏笑]",
  "[左哼哼]",
  "[右哼哼]",
  "[打哈欠]",
  "[鄙视]",
  "[委屈]",
  "[快哭了]",
  "[摸头]",
  "[阴险]",
  "[亲亲]",
  "[机智]",
  "[得意]",
  "[大金牙]",
  "[拥抱]",
  "[大笑]",
  "[送心]",
  "[震惊]",
  "[酷拽]",
  "[尬笑]",
  "[大哭]",
  "[哭笑]",
  "[做鬼脸]",
  "[红脸]",
  "[鼓掌]",
  "[恐惧]",
  "[斜眼]",
  "[嘿哈]",
  "[惊讶]",
  "[绝望的凝视]",
  "[囧]",
  "[皱眉]",
  "[耶]",
  "[石化]",
  "[我想静静]",
  "[吐血]",
  "[互粉]",
  "[互相关注]",
  "[加好友]",
  "[强]",
  "[钱]",
  "[飞吻]",
  "[打脸]",
  "[惊恐]",
  "[悠闲]",
  "[泪奔]",
  "[舔屏]",
  "[紫薇别走]",
  "[听歌]",
  "[难过]",
  "[生病]",
  "[绿帽子]",
  "[如花]",
  "[惊喜]",
  "[吐彩虹]",
  "[吐舌]",
  "[无辜呆]",
  "[看]",
  "[白眼的狗]",
  "[黑脸]",
  "[猪头]",
  "[熊吉]",
  "[不看]",
  "[玫瑰]",
  "[凋谢]",
  "[嘴唇]",
  "[爱心]",
  "[心碎]",
  "[赞]",
  "[弱]",
  "[握手]",
  "[ok]",
  "[谢谢]",
  "[比心]",
  "[碰拳]",
  "[击掌]",
  "[左]",
  "[右]",
  "[力量]",
  "[胜利]",
  "[抱拳]",
  "[勾引]",
  "[拳头]",
  "[庆祝]",
  "[礼物]",
  "[红包]",
  "[18禁]",
  "[去污粉]",
  "[666]",
  "[给力]",
  "[v5]",
  "[菜刀]",
  "[炸弹]",
  "[便便]",
  "[月亮]",
  "[太阳]",
  "[发]",
  "[黄瓜]",
  "[西瓜]",
  "[啤酒]",
  "[咖啡",
  "[蛋糕]",
];
const emojiSrc = [
  "196423/31/31741/1532/639c7b6dEeb45cf52/30aabbf274fd1665.png",
  "75615/8/21024/1466/639c7b70E1e12943f/62398f80ee8ec5c7.png",
  "200988/8/30089/1521/639c7b72E27eb18e5/7f673009c84ac469.png",
  "131973/13/31331/1513/639c7b74Ebff16600/4cab612553ecc5b8.png",
  "155184/25/26282/1538/639c7b79E17bb17b1/d98967f38e11a131.png",
  "90627/32/34641/1551/639c7b7eE35265029/359eb031b6897037.png",
  "151810/3/29001/1510/639c7b83Edc22af78/490859b1c0c50482.png",
  "182807/10/31753/1502/639c7b88Ed9261502/25591976b6b917b6.png",
  "98791/13/21756/1485/639c7b8cE947d802a/c797adf019cc7c0f.png",
  "9281/21/21000/1536/639c7b90E6daabb7c/9d3947d6c190c936.png",
  "97166/35/35792/1474/639c7b93Ef56359b6/4ff93cbfe8de0293.png",
  "215436/5/23998/1559/639c7b98Ee777db6e/11589f2ad7a2d338.png",
  "212609/24/24265/1551/639c7b9aE56b5a45a/76e7052033b9793e.png",
  "135190/25/33452/1520/639c7baaEd6c0d1c9/7df21843cc535d98.png",
  "194770/4/31202/1460/639c7baeEc951295d/6b78b66ae6a9809e.png",
  "70070/33/19862/1552/639c7bb4E1cc50cce/ccc06a20c9f851d9.png",
  "122498/39/29530/1523/639c7bb7E06823f9e/63feaf75bd8f939c.png",
  "89897/29/21721/1555/639c7bbdE74f84121/44228864bc53817d.png",
  "201309/16/26294/1544/639c7bdbE5760b698/f4d0578f8b0d6c93.png",
  "156848/20/33756/1526/639c7be2E606b6d20/a6fedf9159b530a5.png",
  "36439/36/19251/1523/639c7be8Eb434530d/92680e892e11128d.png",
  "69734/13/23683/1497/639c7beaE5749235f/8bd0d673e21e8293.png",
  "106679/33/34379/1531/639c7becE05204def/dadb9beb22efd9fa.png",
  "41962/3/20079/1507/639c7beeE76633ae4/e95cb6fd70bc05ef.png",
  "152070/4/32485/1543/639c7bf0Ecc2a154c/9dd46cdb0efc846a.png",
  "157398/27/33403/1459/639c7bf2E3a5bf412/e2f169539b397ed0.png",
  "98797/24/34001/1541/639c7bf4Ea7d269a5/04b5dc18e89bbce8.png",
  "200859/29/29464/1547/639c7bf6E3bd1cb13/4b74b27f5a3e00ed.png",
  "180265/22/30807/1557/639c7bf8Eb7dc20e4/5d31296cfa07ad2d.png",
  "60919/21/23071/1551/639c7bfaEff4ef994/54e1773ef3dcf251.png",
  "190534/38/32040/1326/639c7bfcE62c4a079/e8aa0e460d5956f1.png",
  "76369/16/22757/1532/639c7bffE2813fb61/54f93c91314ecd88.png",
  "190396/14/31731/1533/639c7c01E09087a22/447cf2d3a4474f06.png",
  "99726/9/28686/1358/639c7c03E8487f261/481640ac6d897e1a.png",
  "112889/17/34412/1396/639c7c04E679a9209/f087d0cf03747cc7.png",
  "193141/21/31034/1480/639c7c06E96579fe7/85cd840c441dbce8.png",
  "192697/19/29910/1467/639c7c08E527a0576/126f0487d3ab2e97.png",
  "190131/3/32398/1472/639c7c0bEa8a8f4ed/3f8fd73980d2b324.png",
  "74657/21/24444/1532/639c7c0dE3bdf4f34/fec3420ede3d69a6.png",
  "89919/22/31401/1543/639c7c10E7ac7b35a/41f3948bc6319db3.png",
  "221907/37/16947/1518/639c7c12E8921d9e7/9fd30859c3a6c0b3.png",
  "59844/11/16484/1505/639c7c14E1a11b3e9/c1f3e565f9d7cf9e.png",
  "217128/27/22453/1517/639c7c16E15a6703b/e699dd7fd4eb9663.png",
  "176077/14/32215/1548/639c7c18Ebba72c51/07df90c9107df241.png",
  "109288/29/30208/1527/639c7c1aEb419111b/81b43a974d9f1fde.png",
  "63308/11/23351/1528/639c7c2cE401f62df/c7649126d0861cd5.png",
  "186235/27/32243/1540/639c7c2eEa68726fb/7d9246936c747a9e.png",
  "205041/40/20113/1522/639c7c31E3a9e996f/a58f7a52d565ff58.png",
  "212474/2/24575/1545/639c7c32Ef89156f9/a00613bfadbe06aa.png",
  "168940/11/33107/1521/639c7c36E33e45b5b/eaf97df18781aece.png",
  "113991/5/30882/1499/639c7c38E2c7940c3/358c4142d7db0511.png",
  "179882/35/31170/1555/639c7c3aEe88336b5/dab156d5b7e851d1.png",
  "190989/23/31100/1567/639c7c3eE3dc613b7/8c1f5d491263e077.png",
  "32580/11/19562/1215/639c7c40E37f2ffaa/c70378403d29113d.png",
  "174679/23/32831/1555/639c7c42E0a3f3ae5/6e9455062c20f178.png",
  "42889/8/22289/1544/639c7c44E7f297aeb/0c01d133029be61f.png",
  "145722/12/31667/1396/639c7c46E06b88e3a/a57bb99b698f2090.png",
  "134936/11/29492/1482/639c7c48E75bd481a/e4ae83378b951ff6.png",
  "205926/16/29912/1532/639c7c4aEf167a0b9/13b68c3ffb96f3e8.png",
  "212693/1/24078/1350/639c7c4cE47fe459d/54f804cb9321aa3f.png",
  "33891/40/18305/1381/639c7c4eE1a432443/da6334c499861bb0.png",
  "57160/16/16831/1541/639c7c5eE61e3ac1f/3ddb9b6ee6ea569a.png",
  "123434/22/34079/1524/639c7c63Efa53a2a7/992efb5ed71489c2.png",
  "146066/29/33362/1472/639c7c66E3de6b872/cdb091d1747ae1c1.png",
  "158952/13/33045/1330/639c7c6aEf2ae9e24/d025c2bec0c17b0f.png",
  "52204/2/22719/1504/639c7c6cE8e87f1b3/bade0871f197a46d.png",
  "220378/23/24297/1477/639c7c6eE3fb79106/b63c0858eb8aeebf.png",
  "191873/7/31613/1507/639c7c71E8786db20/b571f16c23ab02c8.png",
  "98633/26/34196/1532/639c7c73Ee64e68a1/4315d92ee3904b70.png",
  "188626/21/22099/1546/639c7c77Ec18a85a4/301c31a45de05680.png",
  "201760/19/30285/1501/639c7c7fEb5e5fb0a/88dce26ef46a1539.png",
  "189828/18/30511/1404/639c7c90E0d6c14c2/5733f541450f3f78.png",
  "170917/30/33133/1410/639c7c96E44b96329/7d5791686e30863a.png",
  "220899/10/22035/1403/639c7ca0E0c685871/e0ceb81edd0ff17d.png",
  "70324/12/23662/1453/639c7ca2E91860d5a/1b23dce2eb1066dd.png",
  "65091/22/23367/1492/639c7ca7E5d6216d0/cafbb1069d4b75bf.png",
  "212220/5/24900/1494/639c7cacE1f403a0e/ae7e6a339bb67460.png",
  "146640/40/33144/1483/639c7cafEa7185ae9/1870b57c967bf001.png",
  "60329/12/24517/1460/639c7cb5Ee62dce5f/de3ebe1d15ae4bfe.png",
  "194333/33/31512/1536/639c7cb7E9fdcc4e5/e3ae1d9c6acc872d.png",
  "182135/29/31660/1528/639c7cbaEb467b352/87bd79c31df0ede1.png",
  "205188/19/24908/1515/639c7cbeE71332388/beeffc685e111390.png",
  "222496/18/18780/1523/639c7cc0Ee9afdd09/1b60fe5cb0732516.png",
  "117947/9/31325/1429/639c7cc2E076f86cc/2af119ca8efdc957.png",
  "223605/30/19023/1513/639c7cc4E8004369c/5fd87e4be065d420.png",
  "189248/22/30917/1598/639c7cc8Ea919c9b9/f8094127b8b46c74.png",
  "125887/5/33488/1467/639c7ccaE68462e88/5dda4c4c715d9e05.png",
  "151464/12/32769/1365/639c7cceEe7f04920/c410342fd99b4c0a.png",
  "106021/39/35573/1543/639c7cd2Eddb46027/d59a3f647fe9124b.png",
  "9220/16/21407/1403/639c7cd7E6d7d83e0/63e37001a2b95658.png",
  "158360/1/33282/1587/639c7cd9E9c2f1bc3/393b9b1ba31ee9ac.png",
  "928/29/17405/1546/639c7cddEdb3d6a7e/3daf41d1c4c19e8f.png",
  "132687/12/29187/1534/639c7ce2E9c8edb82/36b7678a2e941018.png",
  "69855/37/23402/1530/639c7ce4Ee6f0d9f5/b561b6b2bd859df8.png",
  "202226/23/30314/1480/639c7ceaE018e5e21/bea59866f1b0462b.png",
  "64768/1/23058/1453/639c7cecEa05eccd9/a9a85b8542dffe71.png",
  "159651/27/33437/1440/639c7ceeE648a1113/8cf9d06e28037def.png",
  "213751/40/24315/1572/639c7cf8E3068a4ec/041c97947c43493d.png",
  "194786/27/30844/1340/639c7cfbEb0ff4627/5f0001c5bf6c4ab9.png",
  "124871/35/29510/1508/639c7d07E9385de1c/824eb4c98a71fcab.png",
  "213645/6/24283/1437/639c7d22E0d9b84be/9e62b2e07b49e0a5.png",
  "875/32/17256/1588/639c7d27E9c60bc57/77fc4cd4ffe39d0c.png",
  "98859/17/23299/1210/639c7d29Eb7c234b7/a1c6fce81a537afd.png",
  "116468/27/32947/1380/639c7d3bEc9ee47ae/5da97d547074b857.png",
  "213708/33/24044/1265/639c7d50E8e4185f9/e491bf30f57c6773.png",
  "63838/27/23649/1353/639c7d55E7ae2f5e2/da054d2e47e8fdae.png",
  "160901/18/33827/1409/639c7d5eE27a9e4c4/d006cfdfec1d018b.png",
  "72397/9/17053/1401/639c7d65E6b8076be/164b7e2501726fc2.png",
  "223326/1/21659/1394/639c7d67E17efe662/6a0201fde0903cfc.png",
  "31511/20/18861/1351/639c7d69Ed5456da0/59a0c15f254557f1.png",
  "111786/5/33331/1299/639c7d6bEddd0728c/05841f669c7b6cfb.png",
  "152189/7/31963/1192/639c7d6dE9a924f93/33375d68638681cb.png",
  "42989/24/20827/1242/639c7d6fE16b8f8d7/a4f6fbd2bcdc7f6c.png",
  "196500/25/30750/1331/639c7d71Eac6ffa73/f980f2518767aca6.png",
  "70383/21/23241/1573/639c7d73E06408435/a2b449a69722bed6.png",
  "35455/14/19138/1227/639c7d75Ef575121d/a29b26273067f476.png",
  "181733/32/31792/1213/639c7d77Ef9c14a0f/786fa618f3ebd8d8.png",
  "168970/23/32997/1412/639c7d79Ea1bd0b02/35641c7c3ce6dccf.png",
  "135280/18/32560/1474/639c7d7bE91c9c404/f8779ae3c9732825.png",
  "201373/4/27010/1399/639c7d7dE6a98dde3/2bb480f661fc0c1a.png",
  "134836/29/29211/1361/639c7d7fE9352c9b0/e4c56bc37d67d718.png",
  "179629/31/31474/1421/639c7d81E699a129a/33f8e587fbdbf57c.png",
  "173694/32/31148/1548/639c7d83E3eaf7b6c/06b5bd3da1886282.png",
  "136261/3/28298/1557/639c7d85E7478fc1c/8a751d093929e1b4.png",
  "176774/39/32438/1096/639c7d87E492e20d2/372e1496d1cf31b1.png",
  "91990/23/35749/1493/639c7d89E65d97156/d209c5b10bdd2e07.png",
  "201734/39/30089/1394/639c7d8bEfa534e0a/380ab95e56a1a59a.png",
  "35177/15/19270/1346/639c7d8dEaa401102/cdc67cbe73b4bd20.png",
  "36373/40/19180/1418/639c7d8fEde7aef3c/f364f48a3a7d9f9e.png",
  "214966/28/24110/1304/639c7d91Ed5fc351c/1ca41a06d235c690.png",
  "31614/31/20024/1367/639c7d93E966416b9/a9391b29ef57ec6b.png",
  "172111/14/32587/1479/639c7d95E7af19426/35f8c868e0e2ad5c.png",
  "192464/40/30834/1561/639c7d97Effb9b4a8/ad60c2589eb68a22.png",
  "55981/35/22039/1454/639c7d99E68b8b700/bfeacf93b20e2983.png",
  "172508/3/31974/1330/639c7d9bE780a422f/0dbadb535bf17b61.png",
  "222060/36/20082/1106/639c7d9dE2ac69ecc/cfb9b302e12180ea.png",
  "67301/4/16440/1381/639c7d9fE05ef6489/0aeb639d2f822c9e.png",
  "151769/40/28981/1415/639c7da1E40621b99/cf6bee2df48b3b50.png",
  "143406/40/31114/1358/639c7da3Efcb20c73/8127d0ade3a885c5.png",
  "155447/38/21933/1423/639c7da5E5c497302/b5c167ccb6f16261.png",
  "169364/13/33106/1486/639c7da9Eb931a42f/e5189c8a5728cb81.png",
];
const emojiSprites =
  "http://p1.meituan.net/csc/d7c7b76364ea3df8eff969e839fbe646256811.png";
const emojiPrefix = "https://m.360buyimg.com/babel/jfs/t1/";
const imghosturl = "";

(function () {
  if (
    /^\/bbs-.*\.html$/.test(window.location.pathname) ||
    viewPage.includes(window.location.pathname)
  ) {
    const form = document.forms && document.forms[0];
    if (form) {
      addToolBar(form);
      handleEmoji();
      handleImg();
    }
  }
})();
