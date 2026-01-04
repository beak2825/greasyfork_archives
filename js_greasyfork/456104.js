// ==UserScript==
// @name         E621 辅助翻译
// @name:en-US   E621 translator for Chinese
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.2
// @description  目前仅支持汉化 E621 的标签，且字典尚不完善
// @description:en-US E621 tags translate to Chinese
// @author       LEORChn
// @match        https://e621.net/posts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456104/E621%20%E8%BE%85%E5%8A%A9%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456104/E621%20%E8%BE%85%E5%8A%A9%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
initEZLib();

var tagsRaw = `
  // 所有行都会无视前空格。所有原文都无视大小写。注释必须写在双斜杠后。
  // Copyrights // 版权
  nintendo, pokemon: 任天堂，宝可梦
  mythology, european mythology, greek mythology: 神话，欧洲神话，希腊神话
  asian mythology, east asian mythology, chinese mythology: 亚洲神话，东亚神话，中国神话

  // Species // 种族
  pokemon (species), generation 1 pokemon: 口袋妖怪，第一代口袋妖怪
  mammal: 哺乳动物
  canine, canid, canis, wolf: 高智力犬类，犬科，犬属，狼  // FIXME: 暂时被搞晕了
  leporid, lagomorph, rabbit: 兔类，兔形目，兔子

  // General // 一般
  feral, anthro: 野生形态，直立形态
  clothed, clothing: 着装得体的，着装的                   // FIXME: 这两者的区别有待修改
  asian clothing, east asian clothing, chinese clothing: 亚洲服饰，东亚服饰，中国服饰
  armor: 防具
  chinese, hanfu, chinese dress: 中国的，汉服，旗袍？
  moon, full moon: 月亮，满月
  video games: 电子游戏
  simple background: 简单的背景

  solo, duo, trio: 角色数量 单个，角色数量 两个，角色数量 三个
  group, large group: 团体，三个角色以上大团体
  unseen character: 涉及到图像外的角色
  male, female, male/female, male/male, female/female: 雄性，雌性，雄性和雌性，雄性和雄性，雌性和雌性
  facial hair, beard, hair: 面部毛发，胡子，头发和胡子等毛发
  feathers, wings: 羽毛，翅膀
  smile, blush: 微笑，脸红
  nude, sex, erection, penetration, cum: 裸体，性交，勃起，中出，射精
  bodily fluids, genital fluids: 体液，生殖液
  genitals, penis, balls, breasts, nipples: 生殖器，阴茎，睾丸，乳房，乳头

  // Meta // 图像元数据
  thumbnail, low res: 缩略图，低分辨率
  hi res, absurd res, superabsurd res: 高分辨率，超高分辨率，顶级分辨率
  wallpaper: 可用于壁纸的分辨率
  text, english text: 有文本的，有英语文本
`;
var tags = {};
var tagsFlatArray = tagsRaw.split('\n').map(function(lineText){
    if(!lineText.trim().length) return; // 去除纯空行
    if(lineText.trim().startsWith('//')) return; // 去除注释行
    var kv = lineText.split('//')[0].split(/[:：]/); // 支持行内注释，
    var keys = kv[0].split(/[,，]/),
        values = kv[1].split(/[,，]/);
    if(keys.length != values.length) alert('发现这一行没有对齐：\n' + lineText);
    return keys.map(function(e, i){
        try{
            return [e.trim().toLowerCase(), values[i].trim()];
        }catch(err){
            if(keys.length <= values.length) alert('在解析这一行时发生错误：\n' + lineText);
            // 如果key数量大于value数量，那么前面的没有对齐信息就已经讲过了
        }
    });
}).filter(function(e){ return e; }).flat();
tagsFlatArray.foreach(function(e, i){
    tags[e[0]] = e[1];
});
setInterval(function(){
    $$('.search-tag').foreach(e=>{
        var origin = e.innerText;
        if(!(origin in tags)) return;
        e.innerText = tags[origin];
    });
}, 1000);



function $$(e){ return document.querySelectorAll(e); }
function initEZLib(){
    Array.prototype.foreach =
    NodeList.prototype.foreach = function(func){
        if(!(func instanceof Function)) return;
        for(var i=0; i < this.length; i++) try{
            if(func(this[i], i, this)) return true;
        }catch(e){
            console.warn(e);
        }
    }
}
