// ==UserScript==
// @name         论剑小号3.0
// @namespace    http://tampermonkey.net/
// @include      http://*.yytou.cn*
// @version      3.0
// @description  脚本有风险 使用需谨慎
// @author       68区神游
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371455/%E8%AE%BA%E5%89%91%E5%B0%8F%E5%8F%B730.user.js
// @updateURL https://update.greasyfork.org/scripts/371455/%E8%AE%BA%E5%89%91%E5%B0%8F%E5%8F%B730.meta.js
// ==/UserScript==
/**
 * Created by 神游 on 29/3/2018
 */

// 论剑小号
var urllist4 = [
    //'http://sword-direct68.yytou.cn:8085/?key=5da2ef8d621f83c465bb5c38a9e6862f&id=6547610&name=weixin_***&time=1522300380998&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000南海
    'http://sword-direct68.yytou.cn:8085/?key=f2081133c2f1dada23e248acc7a1d3f6&id=6596975&name=13537586678n&time=1530094075652&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//暗影绝殇
];
var urllist3 = [
    'http://sword-direct68.yytou.cn:8085/?key=c145d446ecb43433c6403e4651c806e3&id=6738628&name=F11111&time=1518457102655&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 47198 20
    'http://sword-direct68.yytou.cn:8085/?key=7b8580b4bc671a76d6040165d66875bf&id=6738690&name=F33333&time=1518457222452&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 47470 20
    'http://sword-direct68.yytou.cn:8085/?key=89547c36b70374d7c0f69352f80d74b0&id=6738737&name=F44444&time=1518457190111&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 47670 20
    'http://sword-direct68.yytou.cn:8085/?key=2303ce688d874c8f6ad5a9772a72f05e&id=6698107&name=shuailb6&time=1515386910642&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 47778 13
    'http://sword-direct68.yytou.cn:8085/?key=df597475bed6ac7422e45ef38103c1bd&id=6545982&name=shuailb2&time=1515386857748&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 48670 24
    'http://sword-direct68.yytou.cn:8085/?key=166e86492982dd61c0b9ef610ed37fb5&id=6760983&name=mianpi2&time=1522300115252&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 49154 26
    'http://sword-direct68.yytou.cn:8085/?key=226efff4838bfd6a295fbaac9fd634ed&id=6724431&name=starzou&time=1515795094468&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 54157 16
    'http://sword-direct68.yytou.cn:8085/?key=948d02a8e9be7e3d38d3d149d4283417&id=6549699&name=e1076459347&time=1516884524501&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 58026 20
    'http://sword-direct68.yytou.cn:8085/?key=68da1551988a0f6f633199b4a5510579&id=6545845&name=shuailb4&time=1515386979900&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 61178 20
    'http://sword-direct68.yytou.cn:8085/?key=24b8b28da11153b0e4587f301e574dd8&id=6740262&name=F55555&time=1516266471062&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000 47672 13
];
var urllist2 = [
    'http://sword-direct68.yytou.cn:8085/?key=8393e03c0a953b521c125801bbc86f66&id=6708589&name=asd66666&time=1515836138892&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//30000
    'http://sword-direct68.yytou.cn:8085/?key=9a57dd3b5633cd6a6d7c582860279404&id=6741861&name=Nsb6Hh63M0D0&time=1516255566510&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//20000
    //'http://sword-direct68.yytou.cn:8085/?key=cfb44b55439def4a0d646e6d6a58aa8a&id=6690471&name=chengluhao128&time=1516287350176&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//20000
    'http://sword-direct68.yytou.cn:8085/?key=50a92c16be313f65005d59466152e61b&id=6603812&name=13537586678p&time=1516430096306&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//20000
    'http://sword-direct68.yytou.cn:8085/?key=04dda0c0e58cb77d1f3c9b6723809344&id=6545889&name=shuailb5&time=1515386895766&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//20000
    'http://sword-direct68.yytou.cn:8085/?key=d1f55340b83d06a253a74629018d7aa7&id=6625362&name=zxstar&time=1516790159371&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//20000
    'http://sword-direct68.yytou.cn:8085/?key=f669b1645538650b55257366bac35ff7&id=6625198&name=zxstar7789&time=1517747521495&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//20000
    'http://sword-direct68.yytou.cn:8085/?key=0e6795bec606be99ddf4638938945fa1&id=6632733&name=9bCRts5Dsy2j&time=1514333956578&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//10000
    'http://sword-direct68.yytou.cn:8085/?key=a80f0b0ba0547729db911bcf04989a9c&id=6733063&name=BhLWRu0Tz98j&time=1516095109557&area=68&port=8085&arg=&s_line=1&is_sub_page=1',//10000
];
var urllist1 = [
    'http://sword-direct68.yytou.cn:8085/?key=11baba5eb5043a731a8de62da3083fd9&id=7019405&name=fD8sGa5bTxIw&time=1521813418690&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=23b8f0614753f3aa5a30ee496c42a440&id=7019072&name=VIdlq9C0XL4t&time=1521793690080&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=39246ddb7bad9dd1ec503da369215009&id=7019016&name=K43zFOc0jjjT&time=1521793980130&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3b0ed3e6684bd74c689be35a4ca05666&id=7018821&name=bWj9WqsFdSgK&time=1521768738122&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3e471c413927f039ed0b82c955073883&id=7018818&name=r3xrTS67ArLf&time=1521762823240&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4dba3bb572ccffa869424a313ba84555&id=7019006&name=bTtKxAFTX0EG&time=1521794268341&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=700e40fa9228b04b137d1887ad034b8a&id=7018943&name=8zxFGbRgivxJ&time=1521777452553&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=74b5f62db5d5c387012bb241385ab718&id=7019048&name=HpyHccJBZxlg&time=1521794172904&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=84cbdc8cf8ca473eb46ce97f400574b6&id=7018804&name=bkNQLZPGUMXR&time=1521767062028&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=93687953ef98c5a1f97e52144b4cf595&id=7019075&name=RsjYg4aeFzQW&time=1521794850678&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=98f08131eea580bd8300e539fadb4c96&id=7019089&name=135HbZBmaBpg&time=1521794750327&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9d278b8ea61083599a06949f50874ff7&id=7019046&name=wQdv5liKbILi&time=1521796312915&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ab75ac492d019d4b9d99abba7afc047b&id=7019071&name=hoGfBNmy7N17&time=1521797648495&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c5c9f065bfb7cd852ad8d31dce5d08df&id=7018915&name=6ShpP7vBXopK&time=1521788183874&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ca3413b3c36d6e8a20ac3aa17e73445c&id=7018857&name=7oUAf0TevARz&time=1521765050863&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cde03d50084d5f3a03a565f1a3df1f28&id=7018894&name=ETsfwGiSnegi&time=1521764715731&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f3f206929e90c5f41ecfbd5cff502990&id=7019102&name=Q6oahw3XNGlR&time=1521807378611&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f93cad98a0ae363b375149b7d7db9e4f&id=7019418&name=FKjEpMPUXbdE&time=1521811704648&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f9fde234cd45c1c5c82abbb9110c764f&id=6732832&name=rU44dv9p7eah&time=1519218130043&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ff5fd54905bab18444a9740d28ab9fb4&id=7019074&name=9jJBbm7xejpF&time=1521794653857&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
];
var urllist0 = [
    'http://sword-direct68.yytou.cn:8085/?key=7749133a8f2e9783de9d9afd344a796d&id=7019340&name=BjYSXkAkTpi8&time=1521808938017&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7e246f22f80e9c41b1509d0041563806&id=7019256&name=WbHZ7RaTcU4V&time=1521805870051&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bc142aad078950a10af230dca64221b9&id=7019463&name=ug9KACdD0Usg&time=1521810247144&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=002601c03c6d44a66d87850f3d194d70&id=7019568&name=z0xx0BM4adD2&time=1521817452343&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0064b0087a82e2c5c5907262b48cdc59&id=7019170&name=18oitB99sqGf&time=1521805418273&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=019d778cffcf1207f9f6c53891c4322b&id=7019097&name=EbgdLfYFeD3U&time=1521798125374&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=02b142e2373b930d8a243e5f9947f3cd&id=7019087&name=7PLjavipHAMa&time=1521795239693&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=03df2725c93b084e6a344cd27a218486&id=7019342&name=9fjXzDtLgFHv&time=1521809793133&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=043bc6542ce0d1736ebce1c7905c20b4&id=7019309&name=QBqQxU6ZLd5O&time=1521811758678&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=045fa0bbbe8786c7ef7c4c275c238983&id=7019232&name=FYq1xH9NJOtb&time=1521803381203&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=051424cb704b21bafc7f54dad0532ea3&id=7019667&name=mv8ClBA3bn5b&time=1521817401938&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=05b265edadd50f0b13d1578d656dca7a&id=7019429&name=4XIW1prHgh3t&time=1521811453471&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=05e61176d2f9adc0923daf542e1aa969&id=7018902&name=JnXZYBrSYl0b&time=1521778458412&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0602707fa32793bac6576603f37f6d8e&id=7019700&name=1rI4ln4yvz1a&time=1521818105064&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=06892b46c9c0983855e2ff3f10ee00c1&id=7019488&name=zvyPMnaljkQ8&time=1521815843942&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=07162a29e2c2d52f655d5f20c90104e7&id=7018929&name=v1cYFgAEqmvi&time=1521786170992&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=08f7b60a83b0b72c9fc018248d580117&id=7019222&name=Ol1Qh8gqcpat&time=1521808282862&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=091c8193a888124545334d06b5e977a1&id=7019416&name=hhbF3xLZb8xk&time=1521813117197&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0b520551852a34fc5ac1f646867591f6&id=7018944&name=SV94HTxTG80b&time=1521789189561&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0b9880e957e6c628c0ac53e95910ef33&id=7019200&name=r1UuEy6XcAxm&time=1521807629879&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0baa658b415f59a515e1e3edcf134cde&id=7019350&name=aKQu8G459fv3&time=1521812514279&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0c4186601e4a3cb5e64570696573a1a0&id=7019346&name=5Dky9kUdzStG&time=1521810549404&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0d38595f259fe7b834c2aa6463156f42&id=7019057&name=v0xLh2QcFmDa&time=1521798602303&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0d57596eed1c739fae3e9855137f9d6c&id=7018885&name=xEVFJg3jtdVZ&time=1521765721221&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0e67922f9fa30076095045496fd39885&id=7019156&name=jKK5bBkpp94f&time=1521805920293&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0ecec8b670fe5e7447bdaca659b4881c&id=7019478&name=4GEP8P2s0V0S&time=1521808988219&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0f09a7ca4267421be446619b3f7f7113&id=7019077&name=JHg173a2P5Rd&time=1521791871598&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0f52b7541da29fd74542400dc03c5366&id=7018917&name=aUMO8QCHqQij&time=1521778123169&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0f5f07f47cb439ea8160124f1facf299&id=7019136&name=z4e5XXieWjaO&time=1521802132492&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0f61181306a7d7f57bc7360e0fb4ed74&id=7019165&name=rVbvrMsqrLnh&time=1521806625524&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=0f6b922b5ff239712d6a96b37ececbd5&id=7019414&name=JFUXpIZ8dCTm&time=1521810398621&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=10d243a17072162f8edc51ee9985a551&id=7019320&name=bZlQv6svhNWy&time=1521813066926&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=117a91951c09a213167b961771a297b9&id=7019189&name=ccsqpEFv5Cnf&time=1521801941712&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=11a130993e68d7c2d46ae47d2fbcaea2&id=7019507&name=vzU3QHE20JtW&time=1521817301543&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=12529aab97854319c873ed6bf41a3801&id=7019392&name=fuINur1VaLWB&time=1521813772038&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=126580f1d6c77f45101f9fe73af09a61&id=7019474&name=ceVYLBSgFH9s&time=1521814281680&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=12be2115d06ae4e82d37edf1a5a6cc0d&id=7019285&name=w6tHXYZpWxXL&time=1521808182388&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=132817b587f99b22ebd8b8b3e088a68e&id=7019164&name=Ls9p7WoVodtJ&time=1521805317904&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1466997fbe60c78e194c861567eab8f5&id=7018949&name=qpiIa8uxpB6q&time=1521784491666&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=15b5e2e925452f195ad5803bc0728c09&id=7019249&name=KEtIPjGxcQG5&time=1521808735346&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=16618407e2c043078a52bc242e162163&id=7019131&name=iO9QxlhAEApc&time=1521808634452&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1704ce90d696f961937c88f7a07d3703&id=7019483&name=p32KW4VU2bDf&time=1521815643042&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1742bd9444b35ee133963a097d01297a&id=7019121&name=UHUhogygzTdI&time=1521800415284&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=17645e055e406bbc3c80570e181daf76&id=7019117&name=8r5uwbvRrWRx&time=1521806070931&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=17dfb957d293d3f164b641b1467002d8&id=7019366&name=j31BHPYuyg1l&time=1521811353005&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1829615f24abd4421e3e0074a5bf95d2&id=7019240&name=D7KGNgrecPcC&time=1521806725937&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=186dafe42c9957b0813ff2b66305f66b&id=7019357&name=s7Kro1XCFgGi&time=1521813671421&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=18b87f9038ebac88487d5fb541c5b2ef&id=7019144&name=yI4LrMzdT7n3&time=1521807027143&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=191918728d2c201ee8a43c9a09a14c0f&id=7019275&name=wSeohctuJIsJ&time=1521803667611&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=19bcd0266e107f4667d3b0f6c62e59d4&id=7019019&name=s3ok9187Qxsm&time=1521797743852&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1b1358129068f562ad0ca6821c7f8d16&id=7019356&name=CAISfHQqaZtp&time=1521812715175&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1c0a9792c126ac4ee3a9a5d9daa30178&id=7019338&name=GG6IzAG97rKq&time=1521811654268&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1c0b6697d6444a4435a81391b3c743e8&id=7019142&name=nOJckYFDls5X&time=1521807077376&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1d87df8b6a56793f2a4f2f834c74d940&id=7019393&name=MJhEKkQJLjJm&time=1521809189059&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1ec1581c33e6828266c27fbdfef7142c&id=7019450&name=qLwsVt15trAp&time=1521815793723&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1f3370cc5913ac096a5f4748ba9ba067&id=7019369&name=PfXYLS88GEXR&time=1521813569528&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1fd123540d84cc92a5ee526a9b7ec4a9&id=7019065&name=6H4S0rLdz5GW&time=1521798793197&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=1fdee397e693d80588b4d5d1386ac931&id=7019062&name=9mcFIFTeesoE&time=1521799174725&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=20d19a0c338de2b297a4f4c9a7fddc82&id=7019101&name=FGJQyOtsWohs&time=1521801369362&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=20f2c620ee0b58bcb19efa09d067ec14&id=7019419&name=iauLMol94rUx&time=1521810700079&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=21434d6bbb9daaa97d7b8ca9ba208408&id=7019211&name=JxfmaMsfn0hM&time=1521802808571&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2191fbc905ebaf8d737793a1ee45e002&id=7019093&name=grMCZdInRMNL&time=1521795931336&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=21fbabe873a9789470e7a8ddbff19bfc&id=7018803&name=0VxCY0bRJl24&time=1521764380488&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=21fea2083dfa122460d332c41d742a0e&id=7019437&name=YkcSGGXnnZTZ&time=1521810750312&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2252e7b1236c3be9bb3696635c4213b2&id=7018889&name=m0yUbXd28YZ9&time=1521763374855&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2284a90e7d0e5a854d3347bd5c96effc&id=7019104&name=IxCheBeFqXKH&time=1521806976903&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2383626dc2a9b2d2bbed75bd0aa4cd3b&id=7019037&name=KqBIfEaQmRwn&time=1521792206767&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=239c708d8f0a1bd6fd6ef45f2ee24c80&id=7018927&name=KcdEoxsOQzMu&time=1521776782247&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=23d43532eccd1ad8f3d2cdd3fea56a7e&id=7018928&name=8XERONlr1dOa&time=1521790195672&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2404db4185c92aad77d150fc56ee28d5&id=7019042&name=umabtUKYq7Uh&time=1521796980634&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=241e54a02c9544ccf6200627ef59e9c1&id=7018996&name=MUAb1Ky7mmHw&time=1521781810263&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=242547953fc5d0c69cbab83bf53ad3fc&id=7019276&name=6ykTQcQzhqFT&time=1521802230674&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=24cb34ad78469b17b83fcfb66245c3ea&id=7019557&name=BRXOIQo6frUv&time=1521817100810&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=24daf1626c0eed9fc2d6aeefeed08ea9&id=7019306&name=ghDWIpHxf3mi&time=1521810850816&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=253ed42f2f6e27afa48f865217c4b8a7&id=7019666&name=dfa4tJkDs54Z&time=1521817853953&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=25621bb03f54bed141fcb010fb4646d7&id=7019395&name=0fMCdrwgzdNJ&time=1521816095207&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=256a8b79ac7b7b4a6a7963ec450f5d1a&id=7019153&name=fieZF3SIEB58&time=1521808132164&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=258d3ca5cbe0c8ed5982e9709460539e&id=7019234&name=GgpoE3qfnbKn&time=1521805016471&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=25bd9fa891aefdb8a169cc49f0433ea5&id=7019002&name=gpWWcKlDOyGq&time=1521795740484&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=26c3f9f4b5645b908a48c0d2bb807bd8&id=7018898&name=9k3K2UZ31bis&time=1521770749114&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=27829c787bbc6369364f1c9460c37a83&id=7018923&name=o0mDNaqL1o7w&time=1521779464006&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=279ce378ec3d7745d022b0b78ea4d1b6&id=7019548&name=K7fAy044xgfj&time=1521818004574&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=289de1cfb93081069799261645158cdd&id=7019098&name=PAajbgSWIpNm&time=1521796598915&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=28d9573a4bac4588cd0507ba67e93795&id=7019458&name=uxFMY8vQFFOL&time=1521811152120&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=29348c389ba25c1c4f40ef88d0a5addc&id=7019471&name=yHIsY2PIRrVY&time=1521812865781&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2934a29fb0ab3cdb1f5fff2cf80c5976&id=7019173&name=DK92BkpYyaMB&time=1521808534070&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=29fee9223eb97964a01aae684531dd8a&id=7018961&name=UFEl9B3rSupD&time=1521780804756&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2b6e778fdd624d2e6554cedbed414d5d&id=7019011&name=HeJnTyE8kGex&time=1521796408202&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2c646183a42f86f20c02a0c6d742eca5&id=7019008&name=vnsx7Y5WwXw5&time=1521798029945&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2c9cfff260d3f2ff9f28e934b60cb7de&id=7019248&name=XgapiB0ikCvs&time=1521804212881&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2caeb399475f5a06c67574627bcbe5e5&id=7018995&name=vJDcd3DQPYTj&time=1521779128873&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2de1c59aa6e1ff04781c76a940a3e975&id=7019288&name=TnNBhlkchwtt&time=1521800987800&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2fc18156e89a6a605d9fa38bf151f841&id=7018834&name=2kYNwAW3CEgb&time=1521766056393&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2fd1e1b15f47920183ed95b734cb9344&id=7018854&name=XlCxwU9nNLzE&time=1521768402851&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2fdb6b56e799bec87c88b057141f2991&id=7018965&name=DiWqA0Fv5V16&time=1521776111986&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=2ff10db72b40e42c5ec28c2b93dfa108&id=7019660&name=3iLHATxGuM0f&time=1521816949516&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3005e1c933f2b57e2ff4663320295953&id=7019332&name=RUOaDGJ1i7lg&time=1521813934686&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=302b231960adae0154d09eaa8bcc263d&id=7019426&name=hZPPNTGFWC77&time=1521815743528&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3079ba928483eba756b928c8cc483eb7&id=7019139&name=FzKk9EarSorn&time=1521807881088&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=31a2f8d5f89d5f253731b6baa58d1247&id=7019051&name=VElCQU2tMMWf&time=1521797076048&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=31bed8d57958efeacdc9e5b71e3a1797&id=7019286&name=ABbIhwVbOfRL&time=1521800606123&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=323611bbeab9d26939af21ed31024524&id=7019434&name=luFOUXHDLXXk&time=1521816397248&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=334b87deb235424e587c65520709e285&id=7019466&name=QaCGWKriBFav&time=1521809490319&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3389bd9f48debcde4156b8dec5d543c7&id=7019225&name=6ruz8kxhR2Xs&time=1521803190460&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=33e4b1784e98a95cb0cd5a76ca0907e7&id=7019221&name=PCMIGsEojgGr&time=1521808483798&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3418bd6ac59acbcdbcea91a7831f730b&id=7018921&name=gKvkHGtx0bTK&time=1521781139920&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=35181549743842f6299a2474ccf60619&id=7018994&name=gUK5Ueg5Medt&time=1521784156513&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=35d57b0ba75997c4e1e27a33b8f656ce&id=7019214&name=8ivEhiTsFjhK&time=1521805468492&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=37cffdd881c74eb113fa8a281fd3b590&id=7018901&name=mYS4tqMtWI4Z&time=1521782480605&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=37d1f35ad81ac218cd1135c8993f8ced&id=7019133&name=brTuK0JiiFoU&time=1521808684736&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=380b2fef449d286c2e0d887fd074c3a9&id=7019282&name=aa2hwGDv1eNy&time=1521807278181&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=385a015175015f8aa04d29fb02ac6600&id=7019611&name=7AjW6yoQM4Pa&time=1521818205401&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=38b48b8484863b2257c15964830456d6&id=7019032&name=Yv6w1SaeADqF&time=1521792542047&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=39fe59d3dcdebde8b5efcad44f268e5d&id=7019261&name=PB76VMNREOeh&time=1521808383346&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3a526a9255ed8977a8b957fec1250a2b&id=7019243&name=1FioEumLm20A&time=1521803961339&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3a54fab0e8cfefdc4bc85af088929154&id=7019273&name=o3RhOvAaGB7u&time=1521804363558&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3b5335369b694c6b0862ff7ee8455d3d&id=7019331&name=2wD88GaqAg4r&time=1521814862693&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3b908eb97ae958a68ffaf0c0a33c7aed&id=7018860&name=DYn4MiwEwTrI&time=1521774436122&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3bb142eb26c5f290d26e6b434c4ea3d3&id=7019436&name=7JAbMTeOr977&time=1521809389841&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3c6e3d65a0e772c339489a22ae987915&id=7019540&name=s6Rl2wZtWrQj&time=1521817602863&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3d8e8d31c43d67fb0296002fc6889b53&id=7019374&name=pGc3hpluy0BW&time=1521811403217&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3da7c2ad5e0711db3c9d6391c94e1715&id=7019026&name=SBRtQbQ6rwea&time=1521797266827&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3f30d4698a4a0d7bf76f46a21b2f6e02&id=7019226&name=s8MhlAk7o1zU&time=1521804815747&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=3f4d97c903f16088d693d7996aa63ef3&id=7019308&name=QiyewWg3y9iW&time=1521811604066&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4019e888daae9731dd89c91378ef1399&id=7019291&name=t2HF91IUYCo4&time=1521805217487&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=40b13b8d4250b9c5a62fa01bbff84719&id=7019160&name=OtoFzDBTYeb4&time=1521804162437&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=411367bb5eeeffc4603403db3fd2aab3&id=7019059&name=UPWeoxHEw5yg&time=1521798411558&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=433d8b9f671eb8d5b3b4ccfad268e70a&id=7019078&name=6BCR5Sot3U40&time=1521793402664&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4344ed1c584593482ead76d496c71029&id=7019106&name=lj4lU8dVSyLG&time=1521801083176&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=437f187ddee182f5ce4493727e68af89&id=7019423&name=B2qjaZ74MDIT&time=1521809239252&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4501348167814b7106a626ae47c0b9ab&id=7018882&name=eUcKKoZFTWd8&time=1521773430627&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4509804411ae2812c612219ebc8ce6f0&id=7019676&name=9jEnlTZnsa7J&time=1521817351764&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=45d7869291a43765924d31d007a3120e&id=7018870&name=y0LKMDaa3fQY&time=1521774100974&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=45ed0614787293b5773be51066c59e97&id=7019265&name=QAyE2TJcooJb&time=1521807227910&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4618a4576b09e353a49cfff20df2b18e&id=7019107&name=MZoIEckshcy2&time=1521807529383&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=46243ffa75ed28967fd4e8394746fe57&id=7019323&name=a0q0PvQffBDN&time=1521813468848&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=465f271d444b0d9bcbfcd61a15e74d62&id=7019397&name=hLMAOdRsGoKo&time=1521815994692&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=46b4a969a738cab0dc812b5aa0b07afd&id=7019569&name=tSjX0nylwQNW&time=1521817552735&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=46c1212945777195ef7725c71b270736&id=7018922&name=73fgguhxAaV7&time=1521779799168&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=46d9625252914315ef15c60ab045bf65&id=7019343&name=8G3LRRUpVo6b&time=1521813016667&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=475d62ed12ab28549bad1360ebf7d122&id=7018841&name=nKpHL8jTn43v&time=1521766391634&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=480c243db318c7e65ce20164027e733e&id=7019258&name=QtPrlw6dWAvu&time=1521807177725&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=488815c6f5b2e75a312f36642a5e40fe&id=7019575&name=sdD0c5szrvgo&time=1521817753482&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=48f7e8d2729adae120d882719253aac5&id=7019689&name=UgDvWOuZi7Hu&time=1521817703341&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=49cef67d2a29a5cf2aade6d2dde18911&id=7019005&name=e5OA25GyZDLL&time=1521794948719&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4a07b8ba0ecb31917db461ca16b47b7f&id=7019492&name=q6oQWSc3C4oO&time=1521813267822&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4afcfd820642da71e5bc816d33b3f47a&id=7019073&name=LljLmtuqMjkU&time=1521799365809&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4beed97e357672d0100d0c530dbf664a&id=7019122&name=6S1wCTVI94TE&time=1521808333127&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4d2e13e4021bd37179b7837c00b3358d&id=7019281&name=5wtwuefxYqhP&time=1521806422539&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4d707475004d285fccc42a2099c2ad43&id=7019402&name=L8IThooVGpyY&time=1521809289450&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4d91f5f12b6645228d2f924fbb341048&id=7019452&name=zSfI2ROtCrlF&time=1521813621176&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4df3f46c4af82bbffcd6d6a8c802b47e&id=7019398&name=LqnpJE6RKZpj&time=1521814514697&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4eb26c2f64ac96422f0355763c0938b5&id=7019549&name=bn0cUzpuGeG8&time=1521817150991&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4effefc940fae174ad4b7241bc68a767&id=7019422&name=WeaKaAcQOywl&time=1521813368527&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=4fe1ff30697cf4948b9d57afc5be155a&id=7019421&name=AU0HgazIs0Z5&time=1521812112562&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=50c3827f4dc92e620b8aa84189a58b45&id=7018984&name=jdnrR46Qufy3&time=1521787848078&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=510d5d01c5aa1542e836ad650c8e0fe3&id=7019608&name=ZGq8Y7Z5nLke&time=1521816598161&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=516218c5b277e26aa28323763203dd20&id=7019010&name=TsC8m088VjLL&time=1521799079234&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=517fefa4636cf4a16fd4fb9c814092a0&id=7019603&name=bfbm3IoBHZVd&time=1521817904178&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=51d7e3c5b7e56f6bb84470cb9ccb2141&id=7019229&name=DmrXl1n9hVUE&time=1521804614642&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=521d54f7be2f8d70e57538a62c6cf751&id=7019298&name=s91iIySU3Pho&time=1521807780636&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5299f353826060ee986abbd940609dfa&id=7018981&name=vmQHe5mNI8ii&time=1521782815749&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=529c76a0214760d8bf0f319cfe199b98&id=7019058&name=smPHXoBKC9NY&time=1521796122142&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=53a67617a295ff84e9396b60e638906c&id=7019114&name=cTYMpNmLv32I&time=1521804061921&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=54aadc711ade2bc22bf67f0ae5f51e2b&id=7019056&name=1FvmgyHmhsdk&time=1521797171464&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=555a1cf18c3a9d6313fb2d37988519c2&id=7019497&name=rGYQooSBPZqk&time=1521810045469&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=55a81953f564ab683488374d7d4d90d6&id=7018864&name=9UN5Rde2eOTS&time=1521773095424&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=574dfce9af64d064180622267156013f&id=7019068&name=igLZmKzFuuwG&time=1521793785597&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=57b74eeee1b1adf7e5e22fab3b72c31f&id=7019085&name=UDqXOAtu6PYn&time=1521795445672&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=58118a8561b782b366fe64bf7d4925c8&id=7019194&name=7Q8BU0KYl22i&time=1521806876552&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=58bdf24d513f316c6c86615f1d69814e&id=7019216&name=bWXnyTxmBUM8&time=1521806776087&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=58fb1d784436748b582570ecb03c5e0d&id=7019348&name=sKuSvn9kZTwQ&time=1521812464019&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=59ae9ec41cd0bfa27eb4ae89c4ba6d90&id=7019383&name=qlvZxaPRUFF5&time=1521813217650&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5c51ae09775b6e4a2462d15535836e3d&id=7018893&name=30Ol93ZPuDy3&time=1521771084278&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5da1324681ed863c30535db2dedf69f7&id=7019641&name=lcIJ1dHmJRQ4&time=1521816899242&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5e1b7945443560f3e3a195446ae91213&id=7019670&name=AN1fwa5gB29T&time=1521817050659&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5e8523e80d0003c0244cc203b9c444f0&id=7019238&name=dtwVrj2rZw41&time=1521804313326&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5f61c7834becd162ee9dfdc8995f551a&id=7019406&name=CmAQye4hYXG4&time=1521809138876&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=5f948a673c8cc817143df651f13bbc68&id=7019175&name=tQNYQlnquuJo&time=1521804263131&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=600dbeefc2a71943aafd57594e3b00b1&id=7019118&name=qB6r6pDt4XEy&time=1521803285857&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=60417bb6d1bc80ab0df58248d202d8cc&id=7019500&name=q87eqdXcCff0&time=1521815894178&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=60500e0a33c1f73942a4c23b55224542&id=7019134&name=aw8IPsD6vp8R&time=1521806474555&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6090ed47435324e6c4b6823f0dcb7b38&id=7019460&name=WJOGm4TT0Eg7&time=1521813318296&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=615853c2c4dcabc4cde16cd6a72c257b&id=7019035&name=SbedOFptsill&time=1521795141165&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=61e5c09d5c6d3911084524d8dbfcbc79&id=7019303&name=1sDCd1Nkxiz6&time=1521812916054&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=62623c680194c1b808e41d2f2cb7ac9e&id=7019244&name=hhuhCr1bMVvz&time=1521800033717&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6356bab772213fb1c1fe867313f7ddc5&id=7019167&name=w6pl57L6rZrR&time=1521801464675&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=636cab06d231dc1824eb4d5df5e9dadd&id=7019095&name=ysa2DcWu5zSa&time=1521793307485&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=63b1b52e98cbf2e76c610de27951fb5e&id=7019001&name=1aWhb18sA6Gc&time=1521796217531&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=63c1f9111012e4ff9714bd17615c8497&id=7019207&name=FmWwurAHEZNr&time=1521806575236&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=63d1cbf2861f4385f8c9cb9cc474d448&id=7019415&name=W32hHJIr6j6X&time=1521814688698&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=65556137165ce47e69c51a194b37c3f3&id=7019135&name=e1NSklmWzw9e&time=1521802423890&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=65813e8432bbf151d0d023dffe296a3d&id=7018954&name=y9nDNYRjRXGv&time=1521775776878&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=69870b6fae1de06d2dde5de72a37ff9d&id=7019354&name=fmvjrm9w2LPP&time=1521816045004&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6a97ea18618de4266694ce04eb0bfa00&id=7019315&name=nuzYbTIKJM9V&time=1521809893538&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6b060dc8f2d6749c0717328925f751a6&id=7019109&name=rWAX9ybbmW92&time=1521801750969&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6b081b4926ff6370f7631b37da69b751&id=7019204&name=DEcLYUeiqHdW&time=1521800701443&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6c798bc48ca7c185039678728322211b&id=7019295&name=tGH0894HYKNT&time=1521804664989&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6c8b1bc40bdb3c78ef5c263218a2f970&id=7018835&name=VZ9xvr5PIIBV&time=1521767732494&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6d52e511a2a3cd34dc9b43bd175fa46b&id=7019347&name=WFZr2HXK1N0m&time=1521810951295&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6d83a8b92b3e506a5701a29205c5f0aa&id=7018809&name=gagO8oR4Nyxr&time=1521772424994&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6e9fc04a69bb6357716df2d9f38b43fc&id=7018865&name=lFS0gzxFPJ0d&time=1521769073260&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6f8a0d0d9a4291bced0f4e1a4d51b8f4&id=7018887&name=oOkyFBYpQ6r7&time=1521771754645&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=6f902b5e31f632e0ba40373af9cb0f39&id=7019410&name=DVc5uITBgxm5&time=1521816145402&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=709dae616928998d6a784b4acabd9551&id=7019145&name=j4eAt857P18p&time=1521807428919&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=70fb3e661aa6c63d0ed1ab9b2bd74506&id=7019301&name=7qBHu8Lx8h2m&time=1521812313423&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=72995453eb782a3f1ac3d00e4bc05bb0&id=7018963&name=SD8iOzsEGbeX&time=1521783486043&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=730b487e4164b3e0ce947e5265c08cc1&id=7019020&name=CSmgivTtl1X7&time=1521798506987&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=73fee9da0e543bd56e8de930dcd624c0&id=7019213&name=hhxls5bJCCI9&time=1521805117007&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=75286a4f6830c867444c82c509554715&id=7018999&name=gdCKMqjCULF3&time=1521787512610&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=752c18ba28c141d5d69a394992fba385&id=7019201&name=ipopWagN02JH&time=1521808787084&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=762e31921fb6ea4c5e022eaafefe3dc3&id=7018855&name=u1olIk702JsB&time=1521770413874&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=76ba29a8462fa8590dc2d005c89b44e0&id=7018985&name=66NBm7ybuRJn&time=1521777788061&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=77152490c2b08e0cb09144d20f3b2335&id=7018812&name=wz0Js48squeO&time=1521768067673&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=77554379115bb30d4ecb7ebf2f0c85e7&id=7019559&name=7ScRy93BLREM&time=1521818155235&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=785ed9e10dab7b17fe89d8b1611b7c3d&id=7019438&name=ZuflxxJmvUul&time=1521812564486&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=78a0952c9643a447070662437ea0bf6b&id=7019389&name=bkL9NdrpOIwL&time=1521810499211&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=78c8662fbb0207be8a53f880a9d34116&id=7019143&name=GB2BnfYQx6rI&time=1521804715287&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=78c91cccfbfc428c728f9fb355eb6bab&id=7019181&name=whY1hEaDSVqR&time=1521808232590&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=79f55c2020359b1e6c7841dc7b66be2d&id=7019043&name=ii3z1ErWjgLB&time=1521797553070&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7a2450604f27868f275dabd4c16aef78&id=7019111&name=WeiE6uFDc712&time=1521808031715&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7a24d99f6504608dfb97817c7026980b&id=7019190&name=b8jut39mKhGv&time=1521805267712&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7a791f9b5b1bbf38427836bfaab16f0d&id=7019372&name=H596LqrsIlXW&time=1521812413832&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7b0ba742f38e166cdd0f8e4dba669cae&id=7019241&name=z8DZLIACXSmG&time=1521799938254&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7b6a0f2441a5ac25e413348a9ab67f76&id=7019644&name=wbhZWOVFiUVD&time=1521817653049&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7bb77b3dc8b2e60e1e912d39e19ff91d&id=7019456&name=O8s40bwFMMGh&time=1521811553902&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7bf4e636092911640c64caa164ca555a&id=7019465&name=6T5tctkPfkpg&time=1521812765385&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7c74828d67e305f5c02d991d90aa3454&id=7019044&name=Lcp9A8TXNI6g&time=1521794076777&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7cec2449085d9e845316cddd4708bb70&id=7019435&name=raTPU0IfN4Gh&time=1521809440041&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7d6423dede117ad0f1533c5dc7a764b2&id=7019094&name=pf4Ozpxg8djp&time=1521795835942&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7d903455d6b99ebbf74c0cf07c320379&id=7019594&name=L3b2aKjzXFsB&time=1521817251360&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7e5d1a53777f1f7b3b6b5eeeb606fb99&id=7019260&name=BzNyRIcTVm6Y&time=1521806675741&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7f341c67a71191aa6560d15a4fe060a0&id=7019034&name=yycNZaSkHnf7&time=1521794364679&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=7f6ba5faff3f3f92f344808a6a50db56&id=7019408&name=PFB1IIodfOyN&time=1521809540539&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=801c2c6fc7054174543886fa0ccb15cf&id=7019242&name=m6TGHGVQAhLs&time=1521803095035&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=80447ad2e8e91cee830877f4e35af374&id=7019484&name=fNDLqWKFtDzo&time=1521811202331&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=804aee47f5075bf07b7e917ea7b22090&id=7019205&name=vVlrqQFy3Gv4&time=1521804865967&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=81448b71a0f5b92bde64c3ae078caa04&id=7019217&name=sVXRL4Hv2e8C&time=1521805618982&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=817571edc89726f7405c5bfc5b667441&id=7018910&name=WSU4wzlJ7eR0&time=1521791201208&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=82ea0f7271812548fccf16b5c0fbd681&id=7019126&name=bQHnvBWm1QKi&time=1521802617668&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=82fe1ea41d377552473c85865bd6c6f7&id=7019028&name=i2ke4xjMbXNR&time=1521797934454&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=832e495af33f5662ee277170d66c48d5&id=7019337&name=ow6br9PIxprc&time=1521810297886&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=833de02b37c4b12fab5295235c22d835&id=7019009&name=M3pwniMQNgua&time=1521798983916&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8578945bffacec121c1ca609a0aad2b9&id=7019279&name=l4cinAVOCGwM&time=1521804011707&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=86736cbf82599645a9e1b0a451d96112&id=7019314&name=bhSLuHnTkeq1&time=1521811961772&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=867e07d863f1efb58fd182de2deee892&id=7019120&name=hhbKSmC6mpWA&time=1521804112260&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=867ee5df23704be913f17ae6b3150403&id=7019105&name=jLZ7StzjS4VU&time=1521799842852&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=86c4515fcf18058eef2895b4affffa33&id=7019401&name=D4Ywc4wADrvV&time=1521814456668&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8a5534500a4f621f53775957163181e3&id=7019326&name=aVP5Pt7suwxW&time=1521812263234&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8b37e5c2e0573e27d8ec274129d26311&id=7019146&name=kO00QvqOqBAR&time=1521807931295&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8b5f442911efa6e94fe4406fd25718ad&id=7019380&name=cwUtT2LGwFFU&time=1521809038399&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8bded8ed5e9a8c8923c756e7f11de126&id=7019271&name=shiwgbqfSQcv&time=1521805819833&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8c085cb3614649f742442e1fce7f4527&id=7019412&name=2nh5VNsthDfQ&time=1521816195580&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8c915a8164fba7f7507fe3f8976b6dd3&id=7018975&name=BvuMCjbWQcUA&time=1521788519131&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8cbf67047dc649fd69e9b8b54a0bb2f0&id=7019003&name=32KIwo35NpVK&time=1521795342675&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8da36e33a0d28b09984b750bf57ec7db&id=7019237&name=ghHEhsvIGywe&time=1521801273930&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8e295165b073fce39230dd79d239894d&id=7019498&name=YVZKgpusFTgb&time=1521812162717&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8e7b78e34cae334ec58f8de0424a3b4d&id=7019000&name=GCJt7CJWXxId&time=1521790530902&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8ecf7a23036a5efdbc0bca6acd53b10b&id=7019030&name=vI81vYgv7V5T&time=1521795548693&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8f85d55ed93942e9e5c92caffdbfa1c0&id=7019428&name=h21K5pFs9oSg&time=1521815944340&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=8ff57a5d8f782c1b5b851c0f8ff8b33a&id=7019403&name=Ntt7VI3PJunI&time=1521811861033&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=904be8e4ce46fdc79345d2496b2c0809&id=7018820&name=mMUrI9eOg7FW&time=1521767397167&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=925863316802e685b53e8deb4805d679&id=7019045&name=QPzyp3QyLOaJ&time=1521797362250&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=925b8d579997dbee320a4662ae296942&id=7019054&name=FeSNPlZTGRsR&time=1521799461249&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=92a1a3317c905a6ba0ce9cc5072a806a&id=7019388&name=TUichrXLkEVN&time=1521809843330&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9410fe985a255434d89378ded4b6c3ee&id=7019031&name=n73gThQfCpb0&time=1521795045452&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=948d7d568c0cc2e8dbe2808407a014f3&id=7019255&name=lVkU5nfBX3NS&time=1521805719418&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=964c9802bef11ba9662d88aa1d78aaa9&id=7019339&name=UNoePxoWIOFE&time=1521810599603&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=969e75b822125977488eacd98858c4a6&id=7019305&name=MODlClc8S3xH&time=1521809339663&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=96c91811686218480abcd44dcc8528fa&id=7019066&name=3CJkutNxuQV8&time=1521799651998&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=972d65f583b664f5afcf25bcf53589dd&id=7019033&name=69QEyW3sFzjx&time=1521799270218&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=977885e8d547dfef3d8ce5f9d734fcb3&id=7019127&name=pyouiggV79Oi&time=1521806221787&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=97f78fdf98af0e9ef91de192f8b4aad7&id=7019157&name=wCqgkOjwMMKy&time=1521805769618&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=98e3b9aa3539f44cdc426fb0f60d52be&id=7019316&name=I9jwxgCGOEhy&time=1521811101913&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=993d2129d52383a959f2930578231509&id=7018998&name=AKiXsuSnSQjT&time=1521789524720&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=997234071461fa1b28a9c225bcf1e409&id=7019199&name=1o4UpKBPh1QK&time=1521805518668&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=99beacdcbdfc21d82e6e95b3100f7cdb&id=7019658&name=fdfuf4kMQKEl&time=1521816798881&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9a5b158e21b33dc222ffaa310b5425b7&id=7019373&name=b2rkOeZPZ0vn&time=1521814050672&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9c5a25a8f7e30897454a895959305bd0&id=7019299&name=It40aUpX950P&time=1521808433605&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9d186dda44fbe586d495b1c3b0724b81&id=7019129&name=w4Z7bZFnFuCp&time=1521808081930&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9edf7ee23a90a566ef5bf43255b0d2ec&id=7019386&name=6QDYRczdMT1Q&time=1521812212999&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9f2d1ceb819a855513ad8ad8c85347ac&id=7019206&name=snQ5qqWylC2O&time=1521807328338&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=9f383dd77fffe5a82d4b1f8e5ed68621&id=7019370&name=jCM5WILOnXtA&time=1521809641946&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a0903c982df7b4789ee3f51c703fef8a&id=7019113&name=DPQFQUlyHygM&time=1521801560219&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a0ff79235757bd2f946b124d3f28823f&id=7019407&name=aNrXejHzShMS&time=1521812966336&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a13273a9670622b52aaed4b10b7e2ab3&id=7018918&name=qhlht4iCqiYF&time=1521783821257&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a1c30641538844fe68547de571c22218&id=7018912&name=1RgunI5DgQbr&time=1521789860226&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a207d9249689769bbf91ab63f936c72d&id=7019090&name=E2DQxTbWijT2&time=1521799556678&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a250db1dab1a16f5d7ec73f1a1f5071d&id=7018951&name=6uE0YceXLHVg&time=1521781475065&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a28779e825fef892205f9824833abb41&id=7019489&name=p8kFMRZwFgIb&time=1521816295977&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a3a48b934b2e438811b3dd8b374e2d5b&id=7019202&name=AiSKwaz42GsU&time=1521804413787&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a3ccc21af6b00a147bb7068282516e12&id=7019195&name=lpQENj11Pr9p&time=1521800797013&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a493b67ec472fd4a63f748ee575f0cf6&id=7019082&name=K87DoCffHGjH&time=1521796789804&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a52f0492d1dd49118e593e5804d01069&id=7019047&name=N4JVxTh99X7X&time=1521798697779&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a53535bb38ad9cd5ec2442c55f07b378&id=7019321&name=0L4UXpYKsGot&time=1521810348335&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a5a8060de3405997ee13f335292a7f8b&id=7018826&name=t4cgKSxXYKX1&time=1521772089756&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a6837694cefb5b628894815b88b03174&id=7019324&name=urz7DEkrXyCX&time=1521813876672&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a78ea53376fab5751d89ae6faa4d025b&id=7018936&name=M4OMqMmJFZHt&time=1521788854372&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a7a74f36106b365371dd4ea3768a85a7&id=7019358&name=sV6BPOcjV9ot&time=1521809994263&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a8aa50b7a2861274393897f250011fca&id=7018895&name=aY0h0vl254bA&time=1521769743614&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a8f5f0c7100cb7863bf89329154a1c7f&id=7019455&name=eq2aZImUAH5q&time=1521814920759&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=a97324b40393822b3a630ffaef8a7b58&id=7019212&name=KOFxL4k92tdJ&time=1521803763083&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ab0b6d5fa0ddd53e4014bb957c74f3b9&id=7019294&name=TYc8jZeYGwrR&time=1521806372381&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ac2cdacce3658a4305419ee8b9e69f14&id=7019025&name=7dlMj3wLgEmz&time=1521797457655&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ad24123d8b3d3daa5fff72b36971c64d&id=7019477&name=vbNXPtq8V4ym&time=1521813822394&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ad3889a69c13da992b000b3e7ba4548c&id=7019335&name=KIabkXxxV5sA&time=1521810901017&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=af1ad70baaeb223ed133f174cee672f8&id=7019312&name=KOkGmujoiE74&time=1521816245759&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b0aad6617c2bd70f1c1b9576e768210e&id=7018879&name=nKmD4wnV659p&time=1521771419436&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b18726f3a011246ac2a27bccb3f31b29&id=7019086&name=6GoMcCNmYiqn&time=1521795645177&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b1b0e8b4c013ad188194b4782ddaaf89&id=7019251&name=5rImWmG3Ljy0&time=1521807479177&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b23222a2a90ab55f6c364b31800328da&id=7018947&name=vp59WFpol3H8&time=1521780469526&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b328a4f6861e04969b2a67482a29c76f&id=7019171&name=JzGQoItNL5bl&time=1521805066733&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b328b391b24eca10f2b98e364d4bd2da&id=7018987&name=PWriqUQz76yd&time=1521787177476&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b3c5ff35cf935f2f2344aa1f9eafd6ce&id=7019022&name=mECuBn4RjTnR&time=1521792877225&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b489f8a1841c9da9e66a2114b2881e68&id=7019215&name=ANLRWBHyRb2t&time=1521801846338&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b5fb9bbcac1f8e9763a7fb4f41e563e2&id=7019375&name=koGHfP7fa88Q&time=1521811503683&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b696c53e837c19691fed599b6e7b2b8a&id=7018913&name=dKT1FwGEwLbS&time=1521786842351&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b8e17a7d5f6bfd095e433c8195d27d50&id=7019322&name=id7GFqQNODf2&time=1521812363583&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b919923bff71fb0bc02cd003337ec9f7&id=7019236&name=Q1e7O6uKFJXC&time=1521800224606&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b9227e6fa76e3471ebec42d50b990e6c&id=7019149&name=6i5gDiFQcsnR&time=1521807830873&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=b9a2509b82a9118ad9f4d5db600fbf72&id=7019430&name=AirIEA2clRQ6&time=1521813992673&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ba591fa08e994cc04b2f11cf10096939&id=7019178&name=wP5vpYOrF5Qp&time=1521806926718&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bb023284bd97f42430e796d4c8d6ff10&id=7019334&name=ytvtPYJVNh0u&time=1521816346204&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bb7fc1f0f78bb5fda574ff2abdd23027&id=7019328&name=T5pXjXAZqJmS&time=1521810196521&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bb81c63549bf4cd7d09955ada3605340&id=7019601&name=nqiR2bWAHcrw&time=1521818255591&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bbf092c8a5803a927c9bbfce0d89a906&id=7019382&name=UIDKkKD9irUt&time=1521814572711&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bcaf4848be10cefa60251f8e34277718&id=7019688&name=07hlanWHhKDY&time=1521816849084&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bcda0181da19b91898a168546098b551&id=7019112&name=A3kwLdPo8uQe&time=1521800892431&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bda58affad6a9eb59d60d5827484f9ed&id=7019526&name=paxCfvLm2S1K&time=1521817502556&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=bdb453d52986fad3eccda9991730c4b5&id=7019319&name=8RpAW1w3qjh6&time=1521816447425&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=be0fd3b81cd546e02305146c589d729d&id=7019158&name=oYwxPBzzMKR3&time=1521802904070&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=be42b043f064feba8f0b4e41223ede57&id=7019363&name=0DW6EEcwx5Ie&time=1521813167464&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=be6554e044d51e750b20cc0787fe0782&id=7019300&name=N8xQOYHDwe40&time=1521803861675&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c02c43151bcd9c86964c19e2a649b71a&id=7019360&name=7tU0kr5qN1AV&time=1521809088644&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c034317b304e955cabcc3d6e61090503&id=7019345&name=xJppWzqOmjiO&time=1521811051735&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c19117fafb4c8849f0279ead6d2a8fed&id=7019385&name=YZvvtDL3s3kc&time=1521810448872&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c1fffba9c355703d714cef9be3292117&id=7019384&name=hYwlFBoMnlG6&time=1521812614657&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c2017fa28851404fa56705a32ec81ab5&id=7019475&name=0P0SDanrrtn5&time=1521812011998&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c361fbfd88476bc29f152dcb117332f6&id=7019495&name=icX8imICmKDy&time=1521809692724&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c41a018a28198f0f98fe9e0936c1a0b5&id=7018905&name=LMxNi8u4IOzv&time=1521774771295&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c4770ee1d8750e38879527545de16463&id=7019021&name=wxkY7wSfkqxB&time=1521796503537&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c538e78776c79b246d5cb81c58454d87&id=7018989&name=5UpPiykRpkdQ&time=1521782145454&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c54b1bf60eb4ba1cddc8dc83abeaf109&id=7019378&name=mwLm9JIEp9QL&time=1521811911538&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c61d9aa43cac1a41b1a00afee1c7f374&id=7019174&name=yvtKuWAbnPna&time=1521807730394&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c6460b6b93df60ce9ed1b3fcb44507a2&id=7018825&name=6Q9XIROrTMFu&time=1521764045343&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c7745a56f018ff3ca8d8e27a02b7ba67&id=7019330&name=QhPKDyWqkms1&time=1521811302792&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c81c360b39db895a999fc94962544a42&id=7018993&name=8vu4fjmzphaM&time=1521790866065&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c855aa6af6908f6fcfa74dc7cbbfda51&id=7018907&name=isswpcMfYrvj&time=1521775106465&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c9258501a2ac8eb2602516bc61bae73d&id=7019185&name=VzkV2WqOoEaV&time=1521800319965&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c959020f77e695086ac2110625824a1d&id=7019341&name=eLubKnFXNLKV&time=1521814223671&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c97e6fae61a56118ea706066990adfee&id=7019154&name=L63gKo0xSP0u&time=1521801178563&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=c9b959198de0337a79b2c14ed631c231&id=7019055&name=2rPpjtJf015a&time=1521793882043&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cb8dfc40132db08ecf2e04b77c2b8480&id=7018827&name=MrXMbCVCDWcr&time=1521763039702&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cc47cc8558ba4ca5873dd14200daf1ae&id=7019547&name=3zbkBocQ3T7z&time=1521816698569&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cd311fd8c8907a4f63154f48f29cae43&id=7019446&name=VlxDLA1FLe6H&time=1521814107696&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cd8496a485982d80cf0468d32a085e12&id=7018946&name=bvKgw9fu6x8Y&time=1521777117383&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cdb92de4749580d5e1d9e7ecb685666a&id=7019396&name=ucPGSIsN5FZT&time=1521809590958&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cdd8482da0e73495c8af6a50540fe98e&id=7018997&name=MQaVTdv7Wnk3&time=1521778793628&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ce3578baad1013319e60b3f3af1013d5&id=7019038&name=F1NZF62hYGrb&time=1521798316203&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ce535ec45221850dea82fbd00d9cf087&id=7018931&name=4igvvdjHFkiJ&time=1521776447142&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ce70fd744cd73bcaccc05250eadeda89&id=7019270&name=m0121x5bWD4l&time=1521806322200&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=cf344c9a64e8a8b9aec7ddfb7b169deb&id=7019359&name=rUFWtBr0Wesu&time=1521814398674&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d01f827ff23637eb9932c95b306972cc&id=7019268&name=yIZC7xblIX7R&time=1521806524936&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d161a182d3660b8c0fb91b4d6a47fc3c&id=7019490&name=1XqOUZIdpXQP&time=1521812062335&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d183acb29b3c66270b39e1ccfcf51f8f&id=7019284&name=GueYvk7t0JoW&time=1521800129112&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d1b572eb850a40e254d58af05a4272f4&id=7019227&name=Rn1QbVgcEDkm&time=1521806171489&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d2e930042baa035f48a8dc59f42c4361&id=7019272&name=JOrIS4iyGluk&time=1521805568828&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d3365aa8360a10e024488b27a2ee8a1c&id=7019394&name=EtU6CfI4IXqe&time=1521811252524&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d450ca31ad8f586986a81a8d21d21363&id=7019039&name=NXJYISe80DGi&time=1521794558047&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d48d152bc19fb37b2991ef2a0e3e90cd&id=7018964&name=EydkwvHOYsPD&time=1521775441655&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d5da9b5d6fb2d084eed6ff66871c48ed&id=7019277&name=ZbBao9gWJPgW&time=1521803476667&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d670541d013ebea702f07286e14d41c4&id=7019246&name=IX8Z78a0Zo4o&time=1521801655595&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d6aa4c44d6501f1f45a34ddb55865beb&id=7019069&name=N6SZW1F6tIAI&time=1521796885188&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d6b4bd123d1561e03ab46ae9b7180bdf&id=7019304&name=RpZqYG6CXU7e&time=1521812815584&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d77c731747ba49f3615b5df40e1429f1&id=7019151&name=xMVgjt9GZ1HD&time=1521800510670&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d8b9ec02814fa07e8c05fb68ae96bc4c&id=7019067&name=BFr5XYxCP5P5&time=1521794461649&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d95adeced0572b8e72024b5437086890&id=7018911&name=Zywo5YsIENI0&time=1521784826791&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=d9a61e8a180dcaf8ddc4d313efc5a0c4&id=7018980&name=WPMArICepzE2&time=1521786507142&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=dacf4d677037ae38c0aea6bfa92ec717&id=7019253&name=uYmqTMKi3HGu&time=1521806121272&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=dc773601c10cd109c21e6215b1e913e3&id=7018942&name=5HEcwe2y7IYB&time=1521791536424&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ddb0a3ffbb084fd4206465e91131601b&id=7019296&name=wpI4Pr4CQLpQ&time=1521805970453&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ddbd883ec3766c5d289ad80cfdfa10a6&id=7019468&name=GC6vk9rQ1njC&time=1521815693241&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=de044be022409ee0d491b811c4b7cbc5&id=7018962&name=QO0EpLnJRhnI&time=1521785498722&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=df087ed9ba36fa115f9049c8c5a873b7&id=7019137&name=0cVdIx5QAavT&time=1521805167227&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e09b01acd267d95fb8584e44f9e5c41a&id=7019220&name=wffY66toXIJL&time=1521802713132&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e10171606cc76913d56081bd4af79bef&id=7019125&name=LJg08ucn1rx9&time=1521805368098&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e2670cfc8839dd0315a8ebed1c871187&id=7018810&name=hhLH4M5O8TU6&time=1521772760317&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e2ae6097317f58153db20851352985ad&id=7019177&name=GWwIJJsI3prn&time=1521804464004&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e36c75418a9fad9cfd69efce5beeea74&id=7019007&name=wLhcS0fzO6hX&time=1521798888567&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e38e4b8ddfff8c3b2565c1ccfd220671&id=7019180&name=DUy2RBuvB3Ba&time=1521799747451&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e466695b15f25ae3ed316cbc664f7621&id=7019080&name=O9CQCRiI2icE&time=1521793212423&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e4ab1e206f00f38064d49cc6dfafc358&id=7019076&name=yiEY5JHqXS4M&time=1521796694402&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e4c2e88b91ae823c9db3603ff291840a&id=7019536&name=7M6kVlMRyNru&time=1521817201178&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e5062be7d225900c80d7756763ea34d5&id=7019230&name=WGPmVN6T1rr8&time=1521806020740&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e6a2ba2ad2a5706537a18a2f0405e829&id=7019179&name=QNgyCaDwBWuT&time=1521802037137&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e6e1c4bb227722a0eb37fe8298ded80a&id=7019399&name=uanmgY5ldCmZ&time=1521814630681&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e7b599259bdcb2b414708fdd68cd9cc3&id=7019663&name=rLVzLoM8rABu&time=1521818054762&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e7b87064fadbe84d9d2d394bf0918ff0&id=7019493&name=f1uXtRmXC0WM&time=1521810096186&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e7c0f4e997fa780f6f4b3153e3f4b0c0&id=7018831&name=D66UdtYT6n0i&time=1521765386089&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e7fdb299b9f88e20c155b1ceb6fd7682&id=7019404&name=izECiHJdOZZr&time=1521808887865&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e80a881bc70111c5acaef7ce52f88893&id=7019259&name=WBbs3xXdC7Ee&time=1521804966336&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e87cff85f83d20c3332db3f9d7374d8c&id=7019311&name=v6V02cMOH3p1&time=1521814978678&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e8c644b11f7e672acf06e44d56afefe4&id=7019567&name=YWUFLog8nlRp&time=1521817954373&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e90ca0e6d6a8a0152d988055d95ef29c&id=7019041&name=Kz29B08ZlIGp&time=1521797839159&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e9a26f83b37c086e4f7727201a9183a8&id=7019336&name=aTprbWAyKfd6&time=1521814746681&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=e9c213c2c9ebd4338cb71005e064ebde&id=7019607&name=fEpq1MnwlauX&time=1521817000259&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=eabdfa14273c11917a1265e3d25e9344&id=7019518&name=2a2C3SLZuSHo&time=1521816648395&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=eac47cdb7001de35a3275501e42cf15f&id=7019235&name=aocl8347t7NV&time=1521804564466&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=eb2a2da70b39f7ab1326b8e21d949e60&id=7019297&name=sr7LVFXdX29f&time=1521802328249&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=eb79d2032eba1574ef59056ea0f56472&id=7019141&name=okTBLpczufO9&time=1521805669211&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=eba26e960ac186d1eda54f6a82e54954&id=7019231&name=arWtaFgEOATr&time=1521804765494&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=eba2d894100850e374c88fcacdbe4992&id=7019581&name=ToKwtUS4GSn3&time=1521816748744&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ed5b8e4c74a52165fe33f966546f380c&id=7019223&name=ylFmjAzviFq7&time=1521807981544&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=edd8769aa629edfef7a5edb9af34b655&id=7018914&name=rTp6bFaCxIQG&time=1521785162267&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=efacb7d5a09d7fb45c0cecdc8515c7ab&id=7019649&name=9Gihtqg5UZhb&time=1521817803736&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=efe180ca4548aacaa3f49e5d0ceaeffe&id=7019652&name=uloyDzLm1eNO&time=1521816497705&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=efed4ed39ee5075864202e76209a3a5d&id=7019132&name=3xKyISFcFeUH&time=1521806271965&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f019cce773a88b766a8df8c7a68e80cc&id=7019245&name=aYiITw2kOzhH&time=1521804514201&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f135c463908891eaeebb5f69f707e053&id=7019168&name=QhfF4FlNzO3M&time=1521808837580&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f13d5ac5bec372dfbe6079120dd92ca2&id=7019224&name=v2MjVa4LP0Er&time=1521807579657&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f188d9f5b38ef0362a545d910f286611&id=7019362&name=uEB2LyVklgR5&time=1521812664927&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f1c95da78ae8217bfd171b48e882bab9&id=7019409&name=fF05EcSYHs9m&time=1521813519229&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f2ef609a2c08cb2fada04f258371ea2b&id=7018969&name=1AATgZi5klao&time=1521783150903&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f3a0270a521b8ec0e72f20ccfdf2ef60&id=7019411&name=XNsOw6rWJxpQ&time=1521809943824&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f3e2d3e4270e28b732571f31d9adc89d&id=7018880&name=aAj2ZNJtU0Ve&time=1521766726824&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f3f18765a44e2f5bb67e91f1db61a6b3&id=7019193&name=TuQOI2K3GOhG&time=1521802999538&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f4e5a4b2da4df85ca7fed08d2c0a3e73&id=7018924&name=oeV24HrMygtk&time=1521785833871&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f502e9bea8a44b3bee15c14357d0d03e&id=7019228&name=gRSYfGKBkMAy&time=1521803572101&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f5e73442e32f032fa45b00fd20959fbc&id=7019293&name=Z5OfEe7Y5sV8&time=1521807680128&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f5f4e5ee0b891691452353bde5cd2c68&id=7018872&name=3AfeGGyhqAgE&time=1521763710013&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f87c0d7b42669d679c18e350637ff31b&id=7019472&name=rxkHZagKKGmo&time=1521810146340&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=f92a068a778a4d638f3b62e7add5bd6e&id=7018816&name=LfRJYkQljj1s&time=1521770078728&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fa1f8e9e845b04dca703529fba5a8668&id=7019449&name=AseEhiS8O9xS&time=1521811001581&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fa948fb2477519e94771d38f02787b3d&id=7019169&name=Ze8el9kGsQVJ&time=1521802522299&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fad5f70d5098cdde145d464d82811fec&id=7019377&name=Odk1Cd8RMS9k&time=1521811810624&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fad73ecfe80fd031140b6bf4e70133b9&id=7019400&name=JAUG9HDWkZHz&time=1521810800510&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fae3e6f2d510e766944a8765d0f7d2d0&id=7019681&name=4oALceIwQ2zD&time=1521816547924&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fae717dfe63510308aca359ce7b90f75&id=7019050&name=in80NcMMGhpH&time=1521796026710&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fb2ede6d5ccd76a7c297fdde9ae722d0&id=7019208&name=yOXriSYZDk4W&time=1521804916175&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fcbcd35d4f2582d45ed37efb508bc743&id=7019329&name=vTCWtKfe7W2M&time=1521814339681&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fcd12e456a5c1c6790427eb8da0c072c&id=7019053&name=LXt44Ss4xatP&time=1521798220817&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fd2505a87f1ccd9c8242476fc1eef670&id=7019379&name=xtVdy92777oG&time=1521813721740&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fd7fa165561fe7fb6dca94b1cae52456&id=7019420&name=jgnnoArfYDl9&time=1521814804687&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fdb529f7f3b0e2e080b4fbfc46df09e0&id=7018858&name=lz9yEnjtgLEY&time=1521773765861&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fe2fbe5c2ef84592a2cfe83eb1f13c7d&id=7019103&name=3eENWQ9KqPyg&time=1521808584280&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fe6d4625ac051799d4304c0aaf988fd2&id=7019439&name=wC7hSbLrfxRh&time=1521810649831&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fe85f62e2b84aea3bffed6624684a017&id=7018891&name=AVmv5ASPioDa&time=1521769408491&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fee94c58babc87e3ac6d4aa210e09beb&id=7019424&name=XYzNsqagt4rg&time=1521809742974&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ff26a46dbb42e5f4389d30fb6e4efe9c&id=7018988&name=mwEmpLt7dnO7&time=1521780134315&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=ffc30eda7d7c69813b08edefb49785e4&id=7019191&name=xNwSB7mooza7&time=1521806826272&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
    'http://sword-direct68.yytou.cn:8085/?key=fffe848a70112eeebe8daf578373790e&id=7019254&name=Sb3jrFIzXU0v&time=1521807127533&area=68&port=8085&jian=1&s_line=1&is_sub_page=1',
];

var knownlist=[];
var curstamp=0;
var prestamp=0;
var cmdlist=[];
var deadlock=0;
function overrideclick(cmd){
    deadlock=1;
    cmdlist.push(cmd);
    deadlock=0;
}
function newoverrideclick(){
    if (cmdlist.length===0){
        setTimeout(function(){newoverrideclick();},10);
    }else{
        if (cmdlist.length>0&&deadlock==1){//有指令写入 不动数组
            setTimeout(function(){newoverrideclick();},10);
        }else if(deadlock===0&&cmdlist.length>0){
            curstamp=(new Date()).valueOf();
            if ((curstamp-prestamp)>200){
                if (cmdlist.length!==0){
                    clickButton(cmdlist[0]);
                    cmdlist.shift();
                    prestamp=curstamp;
                }
                setTimeout(function(){newoverrideclick();},10);
            }else{
                setTimeout(function(){newoverrideclick();},10);//等待10毫秒执行下一次
            }
        }
    }
}
newoverrideclick();

function Go(dir) {
    var d = dir.split(";");
    for (var i = 0; i < d.length; i++)
        overrideclick(d[i]);
}


var btnList = {};		// 按钮列表
var buttonWidth = '60px';
var buttonHeight = '20px';
var currentPos = 30;
var delta = 25;
function createButton(btnName,func){
    btnList[btnName]=document.createElement('button');//生成按钮
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '0px';
    myBtn.style.top = currentPos + 'px';
    currentPos = currentPos + delta;
    myBtn.style.width = buttonWidth+12;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);
    document.body.appendChild(myBtn);// 按钮加入窗体中
}



// 是什么礼包？
function clickLibaoBtn(){
    var LiBaoName = ['兑换礼包','1元礼包'];
    var btn = $('.cmd_click2');
    btn.each(function(){
        var txt = $(this).text();
        if(txt.indexOf('礼包') != '-1'){
            if($.inArray(txt, LiBaoName) == -1){
                var clickText = $(this).attr('onclick'); // clickButton('event_1_41502934', 1)
                var clickAction = getLibaoId(clickText);
                overrideclick(clickAction);
            }
        }
    });
    // 获取礼包的名称
    function getLibaoId(text){
        var arr = text.split(',');
        var newArr = arr[0].split('(');
        var nowArr = newArr[1].split("'");
        return nowArr[1];
    }
}




createButton('清储存',clearStorage);
createButton('读储存',showStorage);
createButton('读num',showNum);
createButton('去num',goNum);

var storage = window.localStorage;
function inputStorage(){
    var r = Math.random();
    var url = window.location;
    storage.setItem(r,url);
}
function showNum(){
    var urlindex = parseInt(storage.storage_urlindex);
    console.log("小号序号 " + urlindex);
    btnList['读num'].innerText = "小号" + urlindex;
}
function goNum(){
    var urlindex = prompt('要跳转到的小号',200);
    storage.storage_urlindex = urlindex;
    window.location.href = urllist[parseInt(urlindex)];
}

function showStorage(){
    for(var i=0;i<storage.length;i++){
        //key(i)获得相应的键，再用getItem()方法获得对应的值
        console.log(storage.getItem(storage.key(i)));
    }
}
function clearStorage(){
    for(var i=0;i<storage.length;i++){
        //key(i)获得相应的键，再用getItem()方法获得对应的值
        console.log(storage.getItem(storage.key(i)));
        storage.clear();
    }
}

createButton("小号数量",countNum);
function countNum(){
    alert("小号数量 " + urllist.length);
}

createButton('上个小号',prevurl);
function prevurl(){
    var urlindex = 0;
    if(storage.hasOwnProperty("storage_urlindex")){
        urlindex = parseInt(storage.storage_urlindex);
        if(urlindex === 0 || urlindex > urllist.length-1)urlindex = urllist.length;
        urlindex--;
        storage.storage_urlindex = urlindex;
        console.log("小号序号 " + urlindex);
    }else{
        storage.storage_urlindex = urlindex;
    }
    window.location.href = urllist[urlindex];
}
createButton('下个小号',nexturl);
function nexturl(){
    var urlindex = 0;
    if(storage.hasOwnProperty("storage_urlindex")){
        urlindex = parseInt(storage.storage_urlindex);
        if(urlindex > urllist.length-2)urlindex = -1;
        urlindex++;
        storage.storage_urlindex = urlindex;
        console.log("小号序号 " + urlindex);
    }else{
        storage.storage_urlindex = urlindex;
    }
    window.location.href = urllist[urlindex];
}

createButton('理财',licai);
function licai(){
    Go('jh 2;n;n;n;n;n;n;n;e');
    Go('touzi_jihua2 buygo 6;touzi_jihua2 buygo 5;touzi_jihua2 buygo 4;touzi_jihua2 buygo 3;touzi_jihua2 buygo 2');
    Go('tzjh_lq');
}

createButton('自动答题',questionFunc);
//var questionTrigger = 0;
function questionFunc(){
//    if (questionTrigger==0){
//        btnList['自动答题'].innerText = '停止答题';
//        questionTrigger=1;
        Go('question');
//    }else if (questionTrigger==1){
//        btnList['自动答题'].innerText = '自动答题';
//        questionTrigger=0;
//    }
}

createButton('奇侠',knowqixiaFunc);//
function knowqixiaFunc(){
    var step = 0;
    var i = 0;
    var qixia=[
        "步惊鸿","郭济","火云邪神","浪唤雨","王蓉","吴缜","狐苍雁","庞统","李宇飞","风南","逆风舞","护竺","风行骓",
        "玄月研","狼居胥","烈九州","穆妙羽","宇文无敌","李玄霸","八部龙将","风无痕","厉沧若","夏岳卿","妙无心","巫夜姬"
    ];
    knowqixia();
    function knowqixia(){
        Go('open jhqx');
        setTimeout(function qixiainfo(){
            if($('#out > span > span.out3 > span > p').text() === '江湖奇侠成长信息'){
                liaoqixia();
            }else{
                setTimeout(qixiainfo,100);
            }
        }, 200);
    }
    function liaoqixia(){
        if(i<qixia.length){
            var name=qixia[i];
            i++;
            gojhqx();
        }else{
            i = 0;
            step++;
            if(step === 2){
                dazuoFunc();
            }else{
                knowqixia();
            }
        }

        function gojhqx(){
            var out = $("#out > span > table > tbody > tr");
            out.each(function(){
                var txt = $(this).text();
                if(txt.indexOf(name) > -1){
                    var done = istodaydone(name,6);
                    if(done || txt.indexOf('师门') > -1 || txt.indexOf('隐居修炼') > -1 || (step === 0 && txt.indexOf('(') > -1)){
                        liaoqixia();
                    }else{
                        var arr = $(this).find('a').attr("href");
                        var cmd = arr.split(':');
                        eval(cmd[1]);
                        setTimeout(talkjhqx,200);
                    }
                }
            });
        }

        function talkjhqx(){
            var nameArr = [];
            var nameDom = $('.cmd_click3');
            nameDom.each(function(){
                if(name === $(this).text()){
                    var npcLook = $(this).attr('onclick');
                    var id = getId(npcLook);
                    if(step===0)Go('ask '+id);
                    if(step===1){
                        if(i<2){
                            for(var j=0;j<26;j++)Go('ask '+id);
                        }else{
                            for(j=0;j<6;j++)Go('ask '+id);
                        }
                    }
                }
            });
            knowqixia();
        }

        function getId(text){
            var arr = text.split(',');
            var newArr = arr[0].split('(');
            var nowArr = newArr[1].split(' ');
            var str = nowArr[1];
            var id = str.substr(0,str.length-1);
            return id;
        }
    }
}

function CheckLocFunc(Loc,Cmd){
    var txt = $('#out>span>table:nth-child(1)>tbody>tr>td:nth-child(2)').text();
    if( txt.indexOf(Loc) > -1){
        eval(Cmd);
    }else{
        setTimeout(function(){
            CheckLocFunc(Loc,Cmd);
        },100);
    }
}

function dazuoFunc(){
Go('home;exercise stop;exercise');
}

function SignFunc(){
    Go('jh 5;n;n;n;w;sign7;home;exercise stop;exercise');
}
function ShareFunc(){
    Go('share_ok 1;share_ok 7;share_ok 2;shop money_buy shop1_N_10;share_ok 3;share_ok 4;share_ok 5;home;exercise stop;exercise');
}
function FengyiFunc(){
    Go('jh 1;look_npc snow_mercenary');
    setTimeout(function(){
        CheckLocFunc("逄义","clickLibaoBtn();Go('jh 2;n;n;n;n;n;n;n;e;tzjh_lq;home;exercise stop;exercise');");
    },100);
}
function ShuangerFunc(){
    Go('jh 5;n;n;e;look_npc yangzhou_yangzhou9');
    setTimeout(function(){
        CheckLocFunc("双儿","clickLibaoBtn();Go('home;exercise stop;exercise');");
    },100);
}
function tempFunc(){
    Go('jh 2;n;n;n;n;n;n;n;look_npc luoyang_luoyang3');
    setTimeout(function(){
        CheckLocFunc("卖花姑娘","clickLibaoBtn();Go('home;exercise stop;exercise');");
    },100);
}
function RoseFunc(){
    Go('items use meigui hua;items use obj_taiyanghua;items use obj_longzhouzong;home;exercise stop;exercise');
}
function LihuoshiFunc(){
    Go('jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;event_1_16891630;home;exercise stop;exercise');
}
function todaydone(arg){
    var date = new Date();
    var now = date.getTime();
    var url = window.location;
    storage.setItem(arg+url, now);
}
function istodaydone(arg,arg2){
    var done = false;
    var url = window.location;
    var date = new Date();
    var H = date.getHours();
    date.setHours(arg2,0,0,0);
    var check = date.getTime();
    if(H < arg2)check -= 24*60*60*1000;
	//console.log('check = ' + check);
    if(storage.hasOwnProperty(arg+url)){
        var t = parseInt(storage.getItem(arg+url));
        if(check < t){
            done = true;
        }
    }
    return(done);
}
function todayFunc(arg1,arg2,arg3){
	var done = istodaydone(arg1,arg3);
	//console.log('istodaydone?' + done);
    if(!done){
        eval(arg2);
        todaydone(arg1);
    }
}

function fengyi(){
    todayFunc("fengyi","FengyiFunc();",6);
}
function shuanger(){
    todayFunc("shuanger","ShuangerFunc();",6);
}
function share(){
    todayFunc("share","ShareFunc();",6);
}
function sign(){
    todayFunc("sign","SignFunc();",0);
}
function rose(){
    todayFunc("rose","RoseFunc();",6);
}
function lihuoshi(){
    todayFunc("lihuoshi","LihuoshiFunc();",6);
}

var date = new Date();
var H = date.getHours();
var M = date.getMinutes();
var W = date.getDay();
var D = date.getDate();

createButton('小号挂机',autoFunc);
function autoFunc(){
    if($('#skill_1').length !== 0){
        setTimeout(function(){nexturl();}, 200);
    }else if($("#page>#out>span>table>tbody>tr>td").length !== 0){
        if(W === 3 && H === 19){Go('swords report go');setTimeout(nexturl, 200);} //论剑报名
        else if(W === 3 && H === 20){setTimeout(function(){nexturl();}, 200);}
        else if(W === 3 && H === 21){Go('swords get_drop go');setTimeout(nexturl, 200);} //论剑积分
        else if(W === 2 && H === 16){FengyiFunc();} //临时
        else if(H === 12 && M < 20){autoclanFunc();} //帮主开福利
        else if(H === 13 && M > 40){autoclanFunc();} //帮主放BOSS
        else if(H === 12){tempFunc();} //卖花姑娘礼包
        else if(H === 13){rose();setTimeout(dazuoFunc,2000);} //送花
        else if(H === 14 || H === 15){licai();setTimeout(dazuoFunc,5000);} //理财
        else if(H === 0 || H === 8 || H === 16){sign();setTimeout(questionFunc,2000);} //签到-答题-奇侠
        else if(H === 1 || H === 9 || H === 17){shuanger();setTimeout(questionFunc,5000);} //双儿礼包-答题-奇侠
        else if(H === 2 || H === 10 || H === 18){fengyi();setTimeout(questionFunc,5000);} //逢义礼包-答题-奇侠
        else if(H === 3 || H === 11 || H === 22){share();setTimeout(questionFunc,2000);} //分享-答题-奇侠
        else if(H === 4 || H === 23){lihuoshi();setTimeout(questionFunc,2000);} //李火师-答题-奇侠
        else{questionFunc();} //答题-奇侠
    }else{
        setTimeout(function(){autoFunc();},100);
    }
}

createButton('自动帮主',autoclanFunc);
function autoclanFunc(){
    urllist = urllist3;

    var clanchairlist = ['小豆包','桑桑暴击④号','黑色月幕','寒若霜','面皮暴击1号','桑桑暴击③号','桑桑暴击②号','小面包','小油条','小豆浆'];
    var clanchairidlist = ['u6740262','u6545845','u6549699','u6724431','u6760983','u6545982','u6698107','u6738737','u6738690','u6738628'];

    var d = D % 10;

    var in5days = d+5;
    var in4days = d+4;
    var in3days = d+3;
    var in2days = d+2;
    var tomorrow = d+1;
    var today = d;
    var yesterday = d-1;
    if(tomorrow > 9)tomorrow -= 10;
    if(in2days > 9)in2days -= 10;
    if(in3days > 9)in3days -= 10;
    if(in4days > 9)in4days -= 10;
    if(in5days > 9)in5days -= 10;
    if(yesterday < 0)yesterday += 10;

    Go('clan incense cx;clan incense cx;clan incense cx');
    Go('clan buy 101;clan buy 101;clan buy 101;clan buy 101;clan buy 101');
    Go('clan view 15172885043270;clan join 15172885043270;home');
    setTimeout(clanFunc,3000);

    function clanFunc(){
        var title = $("#out>span>table:nth-child(3)>tbody>tr>td>span").text();
        if(title.indexOf(clanchairlist[today]) > -1){
            if(H === 12)Go('clan open_double go;clan open_triple go;clan open_triple gogo;clan bzmt select 1;');
            if(H === 13)Go('clan boss go;clan boss go;clan boss gogo;clan boss go;clan boss gogo;clan fb open shenshousenlin;clan fb open daxuemangongdao;');
            if(H === 13 && D !== 31){
                setTimeout(clanTransFunc,3*1000);
            }
            setTimeout(nexturl,10*1000);
        }else{
            nexturl();
        }
    }

    function clanTransFunc(){
        var id0 = clanchairidlist[yesterday];
        var id1 = clanchairidlist[tomorrow];
        var id2 = clanchairidlist[in2days];
        var id3 = clanchairidlist[in3days];
        var id4 = clanchairidlist[in4days];
        var id5 = clanchairidlist[in5days];
        Go('clan;clan_members');
        Go('clan kickout '+id0);
        Go('clan kickout go '+id0);
        Go('clan reqs');
        Go('clan accept '+id1);
        Go('clan accept '+id2);
        Go('clan accept '+id3);
        Go('clan accept '+id4);
        Go('clan accept '+id5);
        Go('clan;clan_members');
        Go('clan appoint chair '+id1);
        Go('clan appoint chair go '+id1);
    }

    function clan_member_id(name){
        var id = '';
        var out = $('#out>span>table>tbody>tr>td>a');
        out.each(function(){
            if($(this).text().indexOf(name) > -1){
                var str0 = $(this).attr('href');
                var Arry1 = str0.split("'");
                var Arry2 = Arry1[1].split(' ');
                id = Arry2[1];
                return;
            }
        });
        return(id);
    }
}

createButton('刷新',autoReload);
function autoReload(){
    window.location.reload();
}


var urllist=urllist4.concat(urllist3.concat(urllist2.concat(urllist1.concat(urllist0))));

showNum();
autoFunc();
setTimeout(autoReload, 1*60*1000);
setTimeout(autoReload, 5*60*1000);
setTimeout(autoReload, 30*60*1000);

var qixialist=[
    "步惊鸿","郭济","火云邪神","浪唤雨","王蓉","吴缜","狐苍雁","庞统","李宇飞","风南","逆风舞","护竺","风行骓",
    "玄月研","狼居胥","烈九州","穆妙羽","宇文无敌","李玄霸","八部龙将","风无痕","厉沧若","夏岳卿","妙无心","巫夜姬"
];
function GoNextFunc(){
    var errout = $('body>center:nth-child(1)>h1').text();
    if(errout.indexOf('502 Bad Gateway')>-1){
        setTimeout(autoReload, 2*1000);
    }

    var out = $('#out2 .out2');
    out.each(function(){
        if($(this).hasClass('pass')){
            return;
        }
        $(this).addClass('pass');
        var txt = $(this).text();
        if(txt.indexOf('已经在打坐中') > -1 || txt.indexOf('一股内息开始在体内流动') > -1 ){
            nexturl();
        }
        if(txt.indexOf('武林知识问答次数已经达到限额') > -1 ){
            knowqixiaFunc();
        }
        for(var i=0;i<qixialist.length;i++){
            var name=qixialist[i];
            //var name = qixialist.pop();
            var qixiapass = name+"盯着你看了一会儿。"+name+"挺有兴致地跟你聊了起来。"+name+"说道：嗯....江湖上好玩吗？"+name+"摇摇头，说道：你在这做什么？"+name+"疑惑地看着你，道：你想干什么？"+name+"睁大眼睛望着你，似乎想问你天气怎么样。";
            //if(txt.indexOf(name+'摇摇头') > -1 || txt.indexOf(name+'说道') > -1 || txt.indexOf(name+'盯着你看了一会儿') > -1 || txt.indexOf(name+'睁大眼睛望着你') > -1 || txt.indexOf(name+'疑惑地看着你') > -1 || txt.indexOf(name+'挺有兴致地跟你聊了起来') > -1 ){
            if(qixiapass.indexOf(txt) > -1 ){
                todaydone(name);
                return;
            }
        }
    });
}
var GoNext_i = setInterval(GoNextFunc, 200);



(function (window) {

    function MyMap(){
        this.elements = [];
        this.size = function() {
            return this.elements.length;
        };
        this.isEmpty = function() {
            return 1 > this.elements.length;
        };
        this.clear = function() {
            this.elements = [];
        };
        this.put = function(a, b) {
            for (var c = !1, d = 0; d < this.elements.length; d++)
                if (this.elements[d].key == a) {
                    c = !0;
                    this.elements[d].value = b;
                    break;
                }
            !1 == c && this.elements.push({key:a, value:b});
        };
        this.remove = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key == a)
                        return this.elements.splice(c, 1), !0;
            } catch (d) {
                b = !1;
            }
            return b;
        };
        this.get = function(a) {
            try {
                for (var b = 0; b < this.elements.length; b++)
                    if (this.elements[b].key == a)
                        return this.elements[b].value;
            } catch (c) {
                return null;
            }
        };
        this.copy = function(a) {
            null == a && (a = new Map);
            try {
                for (var b = 0; b < this.elements.length; b++)
                    a.put(this.elements[b].key, this.elements[b].value);
                return a;
            } catch (c) {
                return null;
            }
        };
        this.element = function(a) {
            return 0 > a || a >= this.elements.length ? null : this.elements[a];
        };
        this.containsKey = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].key ==
                        a) {
                        b = !0;
                        break;
                    }
            } catch (d) {
                b = !1;
            }
            return b;
        };
        this.containsValue = function(a) {
            var b = !1;
            try {
                for (var c = 0; c < this.elements.length; c++)
                    if (this.elements[c].value == a) {
                        b = !0;
                        break;
                    }
            } catch (d) {
                b = !1;
            }
            return b;
        };
        this.values = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].value);
            return a;
        };
        this.keys = function() {
            for (var a = [], b = 0; b < this.elements.length; b++)
                a.push(this.elements[b].key);
            return a;
        };
    }

    function Question() {
        this.answers = new MyMap();
        this.answers.put("锦缎腰带是腰带类的第几级装备", "a");
        this.answers.put("扬州询问黑狗子能到下面哪个地点", "a");
        this.answers.put("跨服天剑谷每周六几点开启", "a");
        this.answers.put("青城派的道德经可以提升哪个属性", "c");
        this.answers.put("论剑中以下哪个不是晚月庄的技能", "d");
        this.answers.put("跨服天剑谷是星期几举行的", "b");
        this.answers.put("玉女剑法是哪个门派的技能", "b");
        this.answers.put("玉草帽可以在哪位npc那里获得？", "b");
        this.answers.put("逍遥林是第几章的地图", "c");
        this.answers.put("精铁棒可以在哪位npc那里获得", "d");
        this.answers.put("鎏金缦罗是披风类的第几级装备", "d");
        this.answers.put("神雕大侠在哪一章", "a");
        this.answers.put("华山武器库从哪个NPC进", "d");
        this.answers.put("首冲重置卡需要隔多少天才能在每日充值奖励中领取", "b");
        this.answers.put("以下哪个不是空空儿教导的武学", "b");
        this.answers.put('“迎梅客栈”场景是在哪个地图上', "d");
        this.answers.put('独孤求败有过几把剑', "d");
        this.answers.put('晚月庄的小贩在下面哪个地点', "a");
        this.answers.put('扬州询问黑狗能到下面哪个地点', "a");
        this.answers.put('“清音居”场景是在哪个地图上', "a");
        this.answers.put('一天能完成师门任务有多少个', "c");
        this.answers.put('林祖师是哪个门派的师傅', "a");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('去唐门地下通道要找谁拿钥匙', "a");
        this.answers.put('能增容貌的是下面哪个技能', "a");
        this.answers.put('铁手镯  可以在哪位npc那里获得', "a");
        this.answers.put('街头卖艺是挂机里的第几个任务', "a");
        this.answers.put('“三清宫”场景是在哪个地图上', "c");
        this.answers.put('论剑中以下哪个是大理段家的技能', "a");
        this.answers.put('藏宝图在哪里npc那里买', "a");
        this.answers.put('六脉神剑是哪个门派的绝学', "a");
        this.answers.put('如何将华山剑法从400级提升到440级', "d");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('在庙祝处洗杀气每次可以消除多少点', "a");
        this.answers.put('以下哪个宝石不能镶嵌到衣服', "a");
        this.answers.put('达摩杖的伤害是多少', "d");
        this.answers.put('嫁衣神功是哪个门派的技能', "b");
        this.answers.put('可以召唤金甲伏兵助战是哪个门派', "a");
        this.answers.put('端茶递水是挂机里的第几个任务', "b");
        this.answers.put('下列哪项战斗不能多个玩家一起战斗', "a");
        this.answers.put('寒玉床在哪里切割', "a");
        this.answers.put('拜师风老前辈需要正气多少', "b");
        this.answers.put('每天微信分享能获得多少元宝', "d");
        this.answers.put('丐帮的绝学是什么', "a");
        this.answers.put('以下哪个门派不是隐藏门派', "c");
        this.answers.put('玩家想修改名字可以寻找哪个NPC', "a");
        this.answers.put('论剑中以下哪个不是古墓派的的技能', "b");
        this.answers.put('安惜迩是在那个场景', "c");
        this.answers.put('神雕侠侣的时代背景是哪个朝代', "d");
        this.answers.put('论剑中以下哪个是华山派的技能的', "a");
        this.answers.put('夜皇在大旗门哪个场景', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('乌檀木刀可以在哪位npc那里获得', "d");
        this.answers.put('易容后保持时间是多久', "a");
        this.answers.put('以下哪个不是宋首侠教导的武学', "d");
        this.answers.put('踏云棍可以在哪位npc那里获得', "a");
        this.answers.put('玉女剑法是哪个门派的技能', "b");
        this.answers.put('根骨能提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁血大旗门的技能', "b");
        this.answers.put('明教的九阳神功有哪个特殊效果', "a");
        this.answers.put('辟邪剑法在哪学习', "b");
        this.answers.put('论剑中古墓派的终极师傅是谁', "d");
        this.answers.put('论剑中青城派的终极师傅是谁', "d");
        this.answers.put('逍遥林怎么弹琴可以见到天山姥姥', "b");
        this.answers.put('论剑一次最多能突破几个技能', "c");
        this.answers.put('劈雳拳套有几个镶孔', "a");
        this.answers.put('仓库最多可以容纳多少种物品', "b");
        this.answers.put('以下不是天宿派师傅的是哪个', "c");
        this.answers.put('易容术在哪学习', "b");
        this.answers.put('瑷伦在晚月庄的哪个场景', "b");
        this.answers.put('羊毛斗篷是披风类的第几级装备', "a");
        this.answers.put('弯月刀可以在哪位npc那里获得', "b");
        this.answers.put('骆云舟在乔阴县的哪个场景', "b");
        this.answers.put('屠龙刀是什么级别的武器', "a");
        this.answers.put('天蚕围腰可以镶嵌几颗宝石', "d");
        this.answers.put('“蓉香榭”场景是在哪个地图上', "c");
        this.answers.put('施令威在哪个地图', "b");
        this.answers.put('扬州在下面哪个地点的npc处可以获得玉佩', "c");
        this.answers.put('拜师铁翼需要多少内力', "b");
        this.answers.put('九区服务器名称', "d");
        this.answers.put('"白玉牌楼"场景是在哪个地图上', "c");
        this.answers.put('宝玉鞋在哪获得', "a");
        this.answers.put('落英神剑掌是哪个门派的技能', "b");
        this.answers.put('下面哪个门派是正派', "a");
        this.answers.put('兑换易容面具需要多少玄铁碎片', "c");
        this.answers.put('以下哪些物品是成长计划第五天可以领取的', "b");
        this.answers.put('论剑中以下哪个是晚月庄的人物', "a");
        this.answers.put('论剑中以下哪个不是魔教的技能', "a");
        this.answers.put('匕首加什么属性', "c");
        this.answers.put('钢丝甲衣可以在哪位npc那里获得', "d");
        this.answers.put('论剑中花紫会的师傅是谁', "c");
        this.answers.put('暴雨梨花针的伤害是多少', "c");
        this.answers.put('吸血蝙蝠在下面哪个地图', "a");
        this.answers.put('论剑中以下是峨嵋派技能的是哪个', "a");
        this.answers.put('蓝止萍在晚月庄哪个小地图', "b");
        this.answers.put('下面哪个地点不是乔阴县的', "d");
        this.answers.put('领取消费积分需要寻找哪个NPC', "c");
        this.answers.put('下面哪个不是门派绝学', "d");
        this.answers.put('人物背包最多可以容纳多少种物品', "a");
        this.answers.put('什么装备不能镶嵌黄水晶', "d");
        this.answers.put('古灯大师在大理哪个场景', "c");
        this.answers.put('草帽可以在哪位npc那里获得', "b");
        this.answers.put('西毒蛇杖的伤害是多少', "c");
        this.answers.put('成长计划六天可以领取多少银两', "d");
        this.answers.put('朱老伯在华山村哪个小地图', "b");
        this.answers.put('论剑中以下哪个是唐门的技能', "b");
        this.answers.put('游龙散花是哪个门派的阵法', "d");
        this.answers.put('高级乾坤再造丹加什么', "b");
        this.answers.put('唐门的唐门毒经有哪个特殊效果', "a");
        this.answers.put('葛伦在大招寺的哪个场景', "b");
        this.answers.put('“三清殿”场景是在哪个地图上', "b");
        this.answers.put('哪样不能获得玄铁碎片', "c");
        this.answers.put('在哪里捏脸提升容貌', "d");
        this.answers.put('论剑中以下哪个是天邪派的技能', "b");
        this.answers.put('向师傅磕头可以获得什么', "b");
        this.answers.put('骆云舟在哪一章', "c");
        this.answers.put('论剑中以下哪个不是唐门的技能', "c");
        this.answers.put('华山村王老二掉落的物品是什么', "a");
        this.answers.put('下面有什么是寻宝不能获得的', "c");
        this.answers.put('寒玉床需要切割多少次', "d");
        this.answers.put('绿宝石加什么属性', "c");
        this.answers.put('魏无极处读书可以读到多少级', "a");
        this.answers.put('天山姥姥在逍遥林的哪个场景', "d");
        this.answers.put('天羽奇剑是哪个门派的技能', "a");
        this.answers.put('大招寺的铁布衫有哪个特殊效果', "c");
        this.answers.put('挖剑冢可得什么', "a");
        this.answers.put('灭绝师太在峨眉山哪个场景', "a");
        this.answers.put('论剑是星期几举行的', "c");
        this.answers.put('柳淳风在雪亭镇哪个场景', "b");
        this.answers.put('萧辟尘在哪一章', "d");
        this.answers.put('论剑中以下哪个是明教的技能', "b");
        this.answers.put('天邪派在哪里拜师', "b");
        this.answers.put('钨金腰带是腰带类的第几级装备', "d");
        this.answers.put('灭绝师太在第几章', "c");
        this.answers.put('一指弹在哪里领悟', "b");
        this.answers.put('翻译梵文一次多少银两', "d");
        this.answers.put('刀法基础在哪掉落', "a");
        this.answers.put('黯然消魂掌有多少招式', "c");
        this.answers.put('黑狗血在哪获得', "b");
        this.answers.put('雪蕊儿在铁雪山庄的哪个场景', "d");
        this.answers.put('东方教主在魔教的哪个场景', "b");
        this.answers.put('以下属于正派的门派是哪个', "a");
        this.answers.put('选择武学世家会影响哪个属性', "a");
        this.answers.put('寒玉床睡觉一次多久', "c");
        this.answers.put('魏无极在第几章', "a");
        this.answers.put('孙天灭是哪个门派的师傅', "c");
        this.answers.put('易容术在哪里学习', "a");
        this.answers.put('哪个NPC掉落拆招基础', "a");
        this.answers.put('七星剑法是哪个门派的绝学', "a");
        this.answers.put('以下哪些物品不是成长计划第二天可以领取的', "c");
        this.answers.put('以下哪个门派是中立门派', "a");
        this.answers.put('黄袍老道是哪个门派的师傅', "c");
        this.answers.put('舞中之武是哪个门派的阵法', "b");
        this.answers.put('隐者之术是那个门派的阵法', "a");
        this.answers.put('踏雪无痕是哪个门派的技能', "b");
        this.answers.put('以下哪个不是在雪亭镇场景', "d");
        this.answers.put('排行榜最多可以显示多少名玩家', "a");
        this.answers.put('貂皮斗篷是披风类的第几级装备', "b");
        this.answers.put('武当派的绝学技能是以下哪个', "d");
        this.answers.put('兰花拂穴手是哪个门派的技能', "a");
        this.answers.put('油流麻香手是哪个门派的技能', "a");
        this.answers.put('披星戴月是披风类的第几级装备', "d");
        this.answers.put('当日最低累积充值多少元即可获得返利', "b");
        this.answers.put('追风棍在哪里获得', "b");
        this.answers.put('长剑在哪里可以购买', "a");
        this.answers.put('莫不收在哪一章', "a");
        this.answers.put('读书写字最高可以到多少级', "b");
        this.answers.put('哪个门派拜师没有性别要求', "d");
        this.answers.put('墨磷腰带是腰带类的第几级装备', "d");
        this.answers.put('不属于白驼山的技能是什么', "b");
        this.answers.put('婆萝蜜多心经是哪个门派的技能', "b");
        this.answers.put('乾坤一阳指是哪个师傅教的', "a");
        this.answers.put('“日月洞”场景是在哪个地图上', "b");
        this.answers.put('倚天屠龙记的时代背景哪个朝代', "a");
        this.answers.put('八卦迷阵是哪个门派的阵法', "b");
        this.answers.put('七宝天岚舞是哪个门派的技能', "d");
        this.answers.put('断云斧是哪个门派的技能', "a");
        this.answers.put('跨服需要多少级才能进入', "c");
        this.answers.put('易容面具需要多少玄铁兑换', "c");
        this.answers.put('张教主在明教哪个场景', "d");
        this.answers.put('玉蜂浆在哪个地图获得', "a");
        this.answers.put('在逍遥派能学到的技能是哪个', "a");
        this.answers.put('每日微信分享可以获得什么奖励', "a");
        this.answers.put('红宝石加什么属性', "b");
        this.answers.put('金玉断云是哪个门派的阵法', "a");
        this.answers.put('正邪任务一天能做几次', "a");
        this.answers.put('白金戒指可以在哪位npc那里获得', "b");
        this.answers.put('金戒指可以在哪位npc那里获得', "d");
        this.answers.put('柳淳风在哪哪一章', "c");
        this.answers.put('论剑是什么时间点正式开始', "a");
        this.answers.put('黯然销魂掌是哪个门派的技能', "a");
        this.answers.put('在正邪任务中不能获得下面什么奖励', "d");
        this.answers.put('孤儿出身增加什么', "d");
        this.answers.put('丁老怪在星宿海的哪个场景', "b");
        this.answers.put('读书写字301-400级在哪里买书', "c");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼长老”', "c");
        this.answers.put('以下属于邪派的门派是哪个', "b");
        this.answers.put('论剑中以下哪个不是丐帮的人物', "a");
        this.answers.put('论剑中青城派的第一个师傅是谁', "a");
        this.answers.put('以下哪个不是何不净教导的武学', "c");
        this.answers.put('吕进在哪个地图', "a");
        this.answers.put('拜师老毒物需要蛤蟆功多少级', "a");
        this.answers.put('蛇形刁手是哪个门派的技能', "b");
        this.answers.put('乌金玄火鞭的伤害是多少', "d");
        this.answers.put('张松溪在哪个地图', "c");
        this.answers.put('欧阳敏是哪个门派的', "b");
        this.answers.put('以下哪个门派是正派', "d");
        this.answers.put('成功易容成异性几次可以领取易容成就奖', "b");
        this.answers.put('论剑中以下不是峨嵋派技能的是哪个', "b");
        this.answers.put('城里抓贼是挂机里的第几个任务', "b");
        this.answers.put('每天的任务次数几点重置', "d");
        this.answers.put('莲花掌是哪个门派的技能', "a");
        this.answers.put('大招寺的金刚不坏功有哪个特殊效果', "a");
        this.answers.put('多少消费积分可以换取黄金钥匙', "b");
        this.answers.put('什么装备都能镶嵌的是什么宝石', "c");
        this.answers.put('什么影响打坐的速度', "c");
        this.answers.put('蓝止萍在哪一章', "c");
        this.answers.put('寒玉床睡觉修炼需要多少点内力值', "c");
        this.answers.put('武穆兵法通过什么学习', "a");
        this.answers.put('倒乱七星步法是哪个门派的技能', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼护法”', "b");
        this.answers.put('兽皮鞋可以在哪位npc那里获得', "b");
        this.answers.put('寒玉床在那个地图可以找到', "a");
        this.answers.put('易容术可以找哪位NPC学习', "b");
        this.answers.put('铁戒指可以在哪位npc那里获得', "a");
        this.answers.put('通灵需要寻找哪个NPC', "c");
        this.answers.put('功德箱在雪亭镇的哪个场景', "c");
        this.answers.put('蓝宝石加什么属性', "a");
        this.answers.put('每天分享游戏到哪里可以获得20元宝', "a");
        this.answers.put('选择书香门第会影响哪个属性', "b");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('新手礼包在哪领取', "c");
        this.answers.put('春风快意刀是哪个门派的技能', "b");
        this.answers.put('朱姑娘是哪个门派的师傅', "a");
        this.answers.put('出生选武学世家增加什么', "a");
        this.answers.put('以下哪个宝石不能镶嵌到内甲', "a");
        this.answers.put('生死符的伤害是多少', "a");
        this.answers.put('扬文的属性', "a");
        this.answers.put('云问天在哪一章', "a");
        this.answers.put('首次通过桥阴县不可以获得那种奖励', "a");
        this.answers.put('剑冢在哪个地图', "a");
        this.answers.put('在哪里消杀气', "a");
        this.answers.put('闯楼每多少层有称号奖励', "a");
        this.answers.put('打坐增长什么属性', "a");
        this.answers.put('从哪个npc处进入跨服战场', "a");
        this.answers.put('下面哪个是天邪派的师傅', "a");
        this.answers.put('每天能做多少个谜题任务', "a");
        this.answers.put('小男孩在华山村哪里', "a");
        this.answers.put('追风棍可以在哪位npc那里获得', "a");
        this.answers.put('逍遥派的绝学技能是以下哪个', "a");
        this.answers.put('沧海护腰是腰带类的第几级装备', "a");
        this.answers.put('花花公子在哪个地图', "a");
        this.answers.put('每次合成宝石需要多少银两', "a");
        this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
        this.answers.put('打排行榜每天可以完成多少次', "a");
        this.answers.put('夜行披风是披风类的第几级装备', "a");
        this.answers.put('白蟒鞭的伤害是多少', "a");
        this.answers.put('易容术向谁学习', "a");
        this.answers.put('支线对话书生上魁星阁二楼杀死哪个NPC给10元宝', "a");
        this.answers.put('斗转星移是哪个门派的技能', "a");
        this.answers.put('杨过在哪个地图', "a");
        this.answers.put('钻石项链在哪获得', "a");
        this.answers.put('多少消费积分换取黄金宝箱', "a");
        this.answers.put('每突破一次技能有效系数加多少', "a");
        this.answers.put('茅山学习什么技能招宝宝', "a");
        this.answers.put('陆得财在乔阴县的哪个场景', "a");
        this.answers.put('独龙寨是第几个组队副本', "a");
        this.answers.put('以下哪个是花紫会的祖师', "a");
        this.answers.put('金弹子的伤害是多少', "a");
        this.answers.put('明月帽要多少刻刀摩刻', "a");
        this.answers.put('论剑输一场获得多少论剑积分', "a");
        this.answers.put('论剑中以下哪个是铁血大旗门的师傅', "a");
        this.answers.put('8级的装备摹刻需要几把刻刀', "a");
        this.answers.put('赠送李铁嘴银两能够增加什么', "a");
        this.answers.put('金刚不坏功有什么效果', "a");
        this.answers.put('少林的易筋经神功有哪个特殊效果', "a");
        this.answers.put('大旗门的修养术有哪个特殊效果', "a");
        this.answers.put('金刚杖的伤害是多少', "a");
        this.answers.put('双儿在扬州的哪个小地图', "a");
        this.answers.put('花不为在哪一章', "a");
        this.answers.put('铁项链可以在哪位npc那里获得', "a");
        this.answers.put('武学世家加的什么初始属性', "a");
        this.answers.put('师门磕头增加什么', "a");
        this.answers.put('全真的道家心法有哪个特殊效果', "a");
        this.answers.put('功德箱捐香火钱有什么用', "a");
        this.answers.put('雪莲有什么作用', "a");
        this.answers.put('论剑中以下哪个是花紫会的技能', "a");
        this.answers.put('柳文君所在的位置', "a");
        this.answers.put('岳掌门在哪一章', "a");
        this.answers.put('长虹剑在哪位npc那里获得？', "a");
        this.answers.put('副本一次最多可以进几人', "a");
        this.answers.put('师门任务每天可以完成多少次', "a");
        this.answers.put('逍遥步是哪个门派的技能', "a");
        this.answers.put('新人礼包在哪个npc处兑换', "a");
        this.answers.put('使用朱果经验潜能将分别增加多少', "a");
        this.answers.put('欧阳敏在哪一章', "a");
        this.answers.put('辟邪剑法是哪个门派的绝学技能', "a");
        this.answers.put('在哪个npc处可以更改名字', "a");
        this.answers.put('毒龙鞭的伤害是多少', "a");
        this.answers.put('晚月庄主线过关要求', "a");
        this.answers.put('怎么样获得免费元宝', "a");
        this.answers.put('成长计划需要多少元宝方可购买', "a");
        this.answers.put('青城派的道家心法有哪个特殊效果', "a");
        this.answers.put('藏宝图在哪个NPC处购买', "a");
        this.answers.put('丁老怪是哪个门派的终极师傅', "a");
        this.answers.put('斗转星移阵是哪个门派的阵法', "a");
        this.answers.put('挂机增长什么', "a");
        this.answers.put('鹰爪擒拿手是哪个门派的技能', "a");
        this.answers.put('八卦迷阵是那个门派的阵法', "a");
        this.answers.put('一天能完成挑战排行榜任务多少次', "a");
        this.answers.put('论剑每天能打几次', "a");
        this.answers.put('需要使用什么衣服才能睡寒玉床', "a");
        this.answers.put('张天师是哪个门派的师傅', "a");
        this.answers.put('技能柳家拳谁教的', "a");
        this.answers.put('九阴派梅师姐在星宿海哪个场景', "a");
        this.answers.put('哪个npc处可以捏脸', "a");
        this.answers.put('论剑中步玄派的师傅是哪个', "a");
        this.answers.put('宝玉鞋击杀哪个npc可以获得', "a");
        this.answers.put('慕容家主在慕容山庄的哪个场景', "a");
        this.answers.put('闻旗使在哪个地图', "a");
        this.answers.put('虎皮腰带是腰带类的第几级装备', "a");
        this.answers.put('在哪里可以找到“香茶”？', "a");
        this.answers.put('打造刻刀需要多少个玄铁', "a");
        this.answers.put('包家将是哪个门派的师傅', "a");
        this.answers.put('论剑中以下哪个是天邪派的人物', "a");
        this.answers.put('升级什么技能可以提升根骨', "a");
        this.answers.put('NPC公平子在哪一章地图', "a");
        this.answers.put('逄义是在那个场景', "a");
        this.answers.put('锻造一把刻刀需要多少银两', "a");
        this.answers.put('以下哪个不是岳掌门教导的武学', "a");
        this.answers.put('捏脸需要寻找哪个NPC？', "a");
        this.answers.put('论剑中以下哪个是晚月庄的技能', "a");
        this.answers.put('碧海潮生剑在哪位师傅处学习', "a");
        this.answers.put('干苦力是挂机里的第几个任务', "a");
        this.answers.put('铁血大旗门云海心法可以提升什么', "a");
        this.answers.put('以下哪些物品是成长计划第四天可以领取的？', "a");
        this.answers.put('易容术多少级才可以易容成异性NPC', "a");
        this.answers.put('摹刻扬文需要多少把刻刀？', "a");
        this.answers.put('正邪任务中客商的在哪个地图', "a");
        this.answers.put('白驼山第一位要拜的师傅是谁', "a");
        this.answers.put('枯荣禅功是哪个门派的技能', "a");
        this.answers.put('漫天花雨匕在哪获得', "a");
        this.answers.put('摧心掌是哪个门派的技能', "a");
        this.answers.put('“花海”场景是在哪个地图上？', "a");
        this.answers.put('雪蕊儿是哪个门派的师傅', "a");
        this.answers.put('新手礼包在哪里领取', "a");
        this.answers.put('论语在哪购买', "a");
        this.answers.put('银丝链甲衣可以在哪位npc那里获得？', "a");
        this.answers.put('乾坤大挪移属于什么类型的武功', "a");
        this.answers.put('移开明教石板需要哪项技能到一定级别', "a");
        this.answers.put('开通VIP月卡最低需要当天充值多少元方有购买资格', "a");
        this.answers.put('黯然销魂掌有多少招式', "c");
        this.answers.put('“跪拜坪”场景是在哪个地图上', "b");
        this.answers.put('孤独求败称号需要多少论剑积分兑换', "b");
        this.answers.put('孔雀氅可以镶嵌几颗宝石', "b");
        this.answers.put('客商在哪一章', "b");
        this.answers.put('疯魔杖的伤害是多少', "b");
        this.answers.put('丐帮的轻功是哪个', "b");
        this.answers.put('霹雳掌套的伤害是多少', "b");
        this.answers.put('方媃是哪个门派的师傅', "b");
        this.answers.put('拜师张三丰需要多少正气', "b");
        this.answers.put('天师阵法是哪个门派的阵法', "b");
        this.answers.put('选择商贾会影响哪个属性', "b");
        this.answers.put('银手镯可以在哪位npc那里获得？', "b");
        this.answers.put('清风寨在哪个地图', "d");
        this.answers.put('清风寨在哪', "b");
        this.answers.put('在雪亭镇李火狮可以学习多少级柳家拳', "b");
        this.answers.put('华山施戴子掉落的物品是什么', "b");
        this.answers.put('尹志平是哪个门派的师傅', "b");
        this.answers.put('病维摩拳是哪个门派的技能', "b");
        this.answers.put('茅山的绝学是什么', "b");
        this.answers.put('茅山派的轻功是什么', "b");
        this.answers.put('风泉之剑可以在哪位npc那里获得？', "b");
        this.answers.put('凌波微步是哪个门派的技能', "b");
        this.answers.put('藏宝图在哪个npc处购买', "b");
        this.answers.put('军营是第几个组队副本', "b");
        this.answers.put('北岳殿神像后面是哪位npc', "b");
        this.answers.put('王重阳是哪个门派的师傅', "b");
        this.answers.put('跨服是星期几举行的', "b");
        this.answers.put('学习屠龙刀法需要多少内力', "b");
        this.answers.put('高级乾坤再造丹是增加什么的', "b");
        this.answers.put('银项链可以在哪位npc那里获得', "b");
        this.answers.put('每天在线多少个小时即可领取消费积分', "b");
        this.answers.put('晚月庄的内功是什么', "b");
        this.answers.put('冰魄银针的伤害是多少', "b");
        this.answers.put('论剑中以下哪个是丐帮的技能', "b");
        this.answers.put('神雕大侠所在的地图', "b");
        this.answers.put('突破丹在哪里购买', "b");
        this.answers.put('白金手镯可以在哪位npc那里获得', "a");
        this.answers.put('金手镯可以在哪位npc那里获得', "b");
        this.answers.put('以下哪个不是梁师兄教导的武学', "b");
        this.answers.put('技能数量超过了什么消耗潜能会增加', "b");
        this.answers.put('白金项链可以在哪位npc那里获得', "b");
        this.answers.put('小龙女住的古墓是谁建造的', "b");
        this.answers.put('打开引路蜂礼包可以得到多少引路蜂', "b");
        this.answers.put('购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益', "b");
        this.answers.put('白玉腰束是腰带类的第几级装备', "b");
        this.answers.put('老顽童在全真教哪个场景', "b");
        this.answers.put('神雕侠侣的作者是', "b");
        this.answers.put('晚月庄的七宝天岚舞可以提升哪个属性', "b");
        this.answers.put('论剑在周几进行', "b");
        this.answers.put('vip每天不可以领取什么', "b");
        this.answers.put('每天有几次试剑', "b");
        this.answers.put('晚月庄七宝天岚舞可以提升什么', "b");
        this.answers.put('哪个分享可以获得20元宝', "b");
        this.answers.put('大保险卡可以承受多少次死亡后不降技能等级', "b");
        this.answers.put('凌虚锁云步是哪个门派的技能', "b");
        this.answers.put('屠龙刀法是哪个门派的绝学技能', "b");
        this.answers.put('金丝鞋可以在哪位npc那里获得', "b");
        this.answers.put('老毒物在白驮山的哪个场景', "b");
        this.answers.put('毒物阵法是哪个门派的阵法', "b");
        this.answers.put('以下哪个不是知客道长教导的武学', "b");
        this.answers.put('飞仙剑阵是哪个门派的阵法', "b");
        this.answers.put('副本完成后不可获得下列什么物品', "b");
        this.answers.put('晚月庄意寒神功可以提升什么', "b");
        this.answers.put('北冥神功是哪个门派的技能', "b");
        this.answers.put('论剑中以下哪个是青城派的技能', "b");
        this.answers.put('六阴追魂剑是哪个门派的技能', "b");
        this.answers.put('王铁匠是在那个场景', "b");
        this.answers.put('以下哪个是步玄派的祖师', "b");
        this.answers.put('在洛阳萧问天那可以学习什么心法', "b");
        this.answers.put('在哪个npc处能够升级易容术', "b");
        this.answers.put('摹刻10级的装备需要摩刻技巧多少级', "b");
        this.answers.put('师门任务什么时候更新', "b");
        this.answers.put('哪个npc属于全真七子', "b");
        this.answers.put('正邪任务中卖花姑娘在哪个地图', "b");
        this.answers.put('风老前辈在华山哪个场景', "b");
        this.answers.put('“留云馆”场景是在哪个地图上？', "b");
        this.answers.put('割鹿刀可以在哪位npc那里获得', "b");
        this.answers.put('论剑中以下哪个是大招寺的技能', "b");
        this.answers.put('全真的基本阵法有哪个特殊效果', "b");
        this.answers.put('论剑要在晚上几点前报名', "b");
        this.answers.put('碧磷鞭的伤害是多少？', "b");
        this.answers.put('一天能完成谜题任务多少个', "b");
        this.answers.put('正邪任务杀死好人增长什么', "b");
        this.answers.put('木道人在青城山的哪个场景', "b");
        this.answers.put('论剑中以下哪个不是大招寺的技能', "b");
        this.answers.put('“伊犁”场景是在哪个地图上？', "b");
        this.answers.put('“冰火岛”场景是在哪个地图上', "b");
        this.answers.put('“双鹤桥”场景是在哪个地图上', "b");
        this.answers.put('“百龙山庄”场景是在哪个地图上？', "b");
        this.answers.put('九阳神功是哪个门派的技能', "c");
        this.answers.put('树王坟在第几章节', "c");
        this.answers.put('阳刚之劲是哪个门派的阵法', "c");
        this.answers.put('上山打猎是挂机里的第几个任务', "c");
        this.answers.put('一张分身卡的有效时间是多久', "c");
        this.answers.put('锻造一把刻刀需要多少玄铁碎片锻造', "c");
        this.answers.put('论剑中以下哪个不是铁血大旗门的技能', "c");
        this.answers.put('如意刀是哪个门派的技能', "c");
        this.answers.put('跨服在哪个场景进入', "c");
        this.answers.put('在哪个NPC可以购买恢复内力的药品？', "c");
        this.answers.put('欧阳敏在唐门的哪个场景', "c");
        this.answers.put('密宗伏魔是哪个门派的阵法', "c");
        this.answers.put('孔雀氅是披风类的第几级装备？', "c");
        this.answers.put('天山折梅手是哪个门派的技能', "c");
        this.answers.put('玩家每天能够做几次正邪任务', "c");
        this.answers.put('柳淳风在哪一章', "c");
        this.answers.put('茅山天师正道可以提升什么', "c");
        this.answers.put('洪帮主在洛阳哪个场景', "c");
        this.answers.put('以下哪个不是全真七子？', "c");
        this.answers.put('云九天是哪个门派的师傅', "c");
        this.answers.put('摹刻烈日宝链需要多少级摩刻技巧', "c");
        this.answers.put('伏虎杖的伤害是多少', "c");
        this.answers.put('灵蛇杖法是哪个门派的技能', "c");
        this.answers.put('“子午楼”场景是在哪个地图上', "c");
        this.answers.put('什么装备可以镶嵌紫水晶', "c");
        this.answers.put('石师妹哪个门派的师傅', "c");
        this.answers.put('烈火旗大厅是那个地图的场景', "c");
        this.answers.put('打土匪是挂机里的第几个任务', "c");
        this.answers.put('捏脸需要花费多少银两', "c");
        this.answers.put('大旗门的云海心法可以提升哪个属性', "c");
        this.answers.put('论剑中以下哪个是铁雪山庄的技能', "c");
        this.answers.put('“白玉牌楼”场景是在哪个地图上', "c");
        this.answers.put('以下哪个宝石不能镶嵌到披风', "c");
        this.answers.put('魏无极身上掉落什么装备', "c");
        this.answers.put('以下不是步玄派的技能的哪个', "c");
        this.answers.put('“常春岛渡口”场景是在哪个地图上', "c");
        this.answers.put('北斗七星阵是第几个的组队副本', "c");
        this.answers.put('宝石合成一次需要消耗多少颗低级宝石', "c");
        this.answers.put('烈日项链可以镶嵌几颗宝石', "c");
        this.answers.put('达摩在少林哪个场景', "c");
        this.answers.put('积分商城在雪亭镇的哪个场景', "c");
        this.answers.put('全真的双手互搏有哪个特殊效果', "c");
        this.answers.put('论剑中以下哪个不是唐门的人物', "c");
        this.answers.put('棋道是哪个门派的技能', "c");
        this.answers.put('七星鞭的伤害是多少', "c");
        this.answers.put('富春茶社在哪一章', "c");
        this.answers.put('等级多少才能在世界频道聊天', "c");
        this.answers.put('以下哪个是封山派的祖师', "c");
        this.answers.put('论剑是星期几进行的', "c");
        this.answers.put('师门任务每天可以做多少个', "c");
        this.answers.put('风泉之剑加几点悟性', "c");
        this.answers.put('黑水伏蛟可以在哪位npc那里获得？', "c");
        this.answers.put('陆得财是哪个门派的师傅', "c");
        this.answers.put('拜师小龙女需要容貌多少', "c");
        this.answers.put('下列装备中不可摹刻的是', "c");
        this.answers.put('古灯大师是哪个门派的终极师傅', "c");
        this.answers.put('“翰墨书屋”场景是在哪个地图上', "c");
        this.answers.put('论剑中大招寺第一个要拜的师傅是谁', "c");
        this.answers.put('杨过小龙女分开多少年后重逢', "c");
        this.answers.put('选择孤儿会影响哪个属性', "c");
        this.answers.put('论剑中逍遥派的终极师傅是谁', "c");
        this.answers.put('不可保存装备下线多久会消失', "c");
        this.answers.put('一个队伍最多有几个队员', "c");
        this.answers.put('以下哪个宝石不能镶嵌到戒指', "c");
        this.answers.put('论剑是每周星期几', "c");
        this.answers.put('茅山在哪里拜师', "c");
        this.answers.put('以下哪个宝石不能镶嵌到腰带', "c");
        this.answers.put('黄宝石加什么属性', "c");
        this.answers.put('茅山可以招几个宝宝', "c");
        this.answers.put('唐门密道怎么走', "c");
        this.answers.put('论剑中以下哪个不是大理段家的技能', "c");
        this.answers.put('论剑中以下哪个不是魔教的人物', "d");
        this.answers.put('每天能做多少个师门任务', "c");
        this.answers.put('一天能使用元宝做几次暴击谜题', "c");
        this.answers.put('成长计划第七天可以领取多少元宝', "d");
        this.answers.put('每天能挖几次宝', "d");
        this.answers.put('日月神教大光明心法可以提升什么', "d");
        this.answers.put('在哪个npc处领取免费消费积分', "d");
        this.answers.put('副本有什么奖励', "d");
        this.answers.put('论剑中以下不是华山派的人物的是哪个', "d");
        this.answers.put('论剑中以下哪个不是丐帮的技能', "d");
        this.answers.put('以下哪个不是慧名尊者教导的技能', "d");
        this.answers.put('慕容山庄的斗转星移可以提升哪个属性', "d");
        this.answers.put('论剑中以下哪个不是铁雪山庄的技能', "d");
        this.answers.put('师门任务一天能完成几次', "d");
        this.answers.put('以下有哪些物品不是每日充值的奖励', "d");
        this.answers.put('论剑中以下哪个不是华山派的技能的', "d");
        this.answers.put('武穆兵法提升到多少级才能出现战斗必刷', "d");
        this.answers.put('论剑中以下哪个不是全真教的技能', "d");
        this.answers.put('师门任务最多可以完成多少个', "d");
        this.answers.put('张三丰在哪一章', "d");
        this.answers.put('倚天剑加多少伤害', "d");
        this.answers.put('以下谁不精通降龙十八掌', "d");
        this.answers.put('论剑中以下哪个不是明教的技能', "d");
        this.answers.put('受赠的消费积分在哪里领取', "d");
        this.answers.put('以下哪个不是道尘禅师教导的武学', "d");
        this.answers.put('古墓多少级以后才能进去', "d");
        this.answers.put('千古奇侠称号需要多少论剑积分兑换', "d");
        this.answers.put('魔鞭诀在哪里学习', "d");
        this.answers.put('通灵需要花费多少银两', "d");
        this.answers.put('白银宝箱礼包多少元宝一个', "d");
        this.answers.put('以下哪个不是论剑的皮肤', "d");
        this.answers.put('小李飞刀的伤害是多少', "d");
        this.answers.put('下面哪个npc不是魔教的', "d");
        this.answers.put('天蚕围腰是腰带类的第几级装备', "d");
        this.answers.put('黄岛主在桃花岛的哪个场景', "d");
        this.answers.put('宝玉帽可以在哪位npc那里获得？', "d");
        this.answers.put('什么影响攻击力', "d");
        this.answers.put('紫宝石加什么属性', "d");
        this.answers.put('少林的混元一气功有哪个特殊效果', "d");
        this.answers.put('以下哪个是晚月庄的祖师', "d");
        this.answers.put('以下不是隐藏门派的是哪个', "d");
        this.answers.put('第一个副本需要多少等级才能进入', "d");
        this.answers.put('风泉之剑在哪里获得', "d");
        this.answers.put('镖局保镖是挂机里的第几个任务', "d");
        this.answers.put('下面哪个不是古墓的师傅', "d");
        this.answers.put('每个玩家最多能有多少个好友', "b");
        this.answers.put('以下哪个不是在扬州场景', "d");
        this.answers.put('茅山的天师正道可以提升哪个属性', "d");
        this.answers.put('“无名山脚”场景是在哪个地图上', "d");
        this.answers.put('闯楼第几层可以获得称号“藏剑楼楼主”', "d");
        this.answers.put('充值积分不可以兑换下面什么物品', "d");
        this.answers.put('魔教的大光明心法可以提升哪个属性', "d");
        this.answers.put('以下哪些物品不是成长计划第三天可以领取的', "d");
        this.answers.put('论剑中以下哪个不是峨嵋派可以拜师的师傅', "d");
        this.answers.put('哪个技能不是魔教的', "d");
        this.answers.put('沧海护腰可以镶嵌几颗宝石', "d");
        this.answers.put('城里打擂是挂机里的第几个任务', "d");
        this.answers.put('以下哪个不是鲁长老教导的武学', "d");
        this.answers.put('以下哪些物品不是成长计划第一天可以领取的', "d");
        this.answers.put('包拯在哪一章', "d");
        this.answers.put('张天师在茅山哪个场景', "d");
        this.answers.put('山河藏宝图需要在哪个NPC手里购买？', "d");
        this.answers.put('影响你出生的福缘的出生是', "d");
        this.answers.put('张三丰在武当山哪个场景', "d");
        this.answers.put('春秋水色斋需要多少杀气才能进入', "d");
        this.answers.put('论剑中以下哪个不是是晚月庄的技能', "d");
        this.answers.put('大乘佛法有什么效果', "d");
        this.answers.put('正邪任务最多可以完成多少个', "d");
        this.answers.put('高级突破丹多少元宝一颗', "d");
        this.answers.put('清虚道长在哪一章', "d");
        this.answers.put('在战斗界面点击哪个按钮可以进入聊天界面', "d");
        this.answers.put('“鹰记商号”场景是在哪个地图上？', "d");
        this.answers.put('改名字在哪改', "d");
        this.answers.put('以下哪个不是在洛阳场景', "d");
        this.answers.put('金项链可以在哪位npc那里获得', "d");
        this.answers.put('首次通过乔阴县不可以获得那种奖励？', "a");

        this.answer = function(a) {
            //          alert("答案是：" + a);
            overrideclick("question " + a,0);
            //            go("question");
        };

        this.dispatchMessage = function(b) {
            var type = b.get("type"), msg= b.get("msg");
            if (type == "show_html_page" && msg.indexOf("知识问答第") > 0) {
                console.log(msg);
                if (msg.indexOf("回答正确！") > 0) {
                    overrideclick("question");
                    return;
                }

                var q = this.answers.keys();
                for (var i in q) {
                    var k = q[i];

                    if (msg.indexOf(k) > 0) {
                        this.answer(this.answers.get(k));
                        break;
                    }
                }
            }
            //if (type=="notice"||type=="main_msg"){
            //    if (msg.match("武林知识问答次数已经达到限额")!=null){
            //        console.log("今天知识问答结束了");
            //        questionTrigger = 1;
            //        questionFunc();
            //    }
            //}
        };
    }
    var question = new Question();

    window.game = this;

    window.attach = function() {

        webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;

        gSocketMsg.dispatchMessage = function(b) {
            this.old(b);
            //if (questionTrigger == 1){
                question.dispatchMessage(b);
            //}
        };
    };
    attach();

})(window);


