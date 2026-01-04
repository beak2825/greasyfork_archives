// ==UserScript==
// @name        TM Name CN new
// @namespace   trophymanager.cn
// @description 球员姓名汉化
// @include     *trophymanager.com*
// @exclude     *trophymanager.com/training*
// @exclude     *trophymanager.com/sponsors*
// @exclude     *trophymanager.com/players/
// @exclude     *trophymanager.com/players/#/a/true/b//
// @exclude     *trophymanager.com/players/#/a/true/b/true/
// @exclude     *trophymanager.com/players/#/a//b/true/
// @version     202112070001
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/373201/TM%20Name%20CN%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/373201/TM%20Name%20CN%20new.meta.js
// ==/UserScript==

var htmlstr=document.getElementsByTagName('html')[0].innerHTML;
htmlstr=htmlstr.replace(/(111(?=))|(111$)/g,"111");

//No.1
//北京零点
htmlstr=htmlstr.replace(/Ling MuYuan/g,"凌穆辕");  
htmlstr=htmlstr.replace(/Li JinYu/g,"李金羽");  
htmlstr=htmlstr.replace(/Tang ShanLang/g,"唐山狼");  

//No.2
//义乌创达集团有限公司 
htmlstr=htmlstr.replace(/Wang YanFei/g,"王延飞"); 
htmlstr=htmlstr.replace(/Xie XueZheng/g,"谢学征"); 
htmlstr=htmlstr.replace(/Mo AiMin/g,"莫艾闵");
htmlstr=htmlstr.replace(/Zhu ZhongYou/g,"朱忠友");
htmlstr=htmlstr.replace(/Ye ShuRen/g,"叶庶仁"); 
htmlstr=htmlstr.replace(/Tie JiuZhou/g,"铁久洲");
htmlstr=htmlstr.replace(/Li YiKang/g,"李益康");


//No.3
//太原FC
htmlstr=htmlstr.replace(/Bi Xiao/g,"毕萧");
htmlstr=htmlstr.replace(/Bi ZhongTian/g,"毕中天");
htmlstr=htmlstr.replace(/Cao MiaoRui/g,"曹妙瑞");
htmlstr=htmlstr.replace(/Gao GuangZhong/g,"高光忠");
htmlstr=htmlstr.replace(/Gao XinYue/g,"高欣越");
htmlstr=htmlstr.replace(/Gong ChaoYuan/g,"宫朝原");
htmlstr=htmlstr.replace(/Guan Chun/g,"关淳");
htmlstr=htmlstr.replace(/Guo KangCheng/g,"郭康成");
htmlstr=htmlstr.replace(/Han MingYi/g,"韩明义");
htmlstr=htmlstr.replace(/He ShengYi/g,"何圣依");
htmlstr=htmlstr.replace(/He Zhi/g,"何志");
htmlstr=htmlstr.replace(/Hong DongBing/g,"洪东兵");
htmlstr=htmlstr.replace(/Hong WeiQiang/g,"洪伟强");
htmlstr=htmlstr.replace(/Hu JinPing/g,"胡金平");
htmlstr=htmlstr.replace(/Huang XiaoMing/g,"黄晓明");
htmlstr=htmlstr.replace(/Huang ZhiXuan/g,"黄智炫");
htmlstr=htmlstr.replace(/HuangFu PengHan/g,"皇甫澎瀚");
htmlstr=htmlstr.replace(/Jia DeChao/g,"贾德超");
htmlstr=htmlstr.replace(/Kong ZhenSheng/g,"孔振生");
htmlstr=htmlstr.replace(/Li DeNan|Li '小李飞刀' DeNan/g,"李德南");
htmlstr=htmlstr.replace(/Li FangZhuo/g,"李方卓");
htmlstr=htmlstr.replace(/Li KaiRen/g,"李开仁");
htmlstr=htmlstr.replace(/Li QiXian/g,"李齐贤");
htmlstr=htmlstr.replace(/Li RuiQiang/g,"李瑞强");
htmlstr=htmlstr.replace(/Liang JianChun/g,"梁建春");
htmlstr=htmlstr.replace(/Liang Liang/g,"梁良");
htmlstr=htmlstr.replace(/Liu Lu/g,"刘陆");
htmlstr=htmlstr.replace(/Lu XueFei/g,"陆学飞");
htmlstr=htmlstr.replace(/Ma LiQiang/g,"马立强");
htmlstr=htmlstr.replace(/Ma NingYuan/g,"马宁远");
htmlstr=htmlstr.replace(/Mi SanQiang/g,"米三强");
htmlstr=htmlstr.replace(/Niu XinKai/g,"牛新凯");
htmlstr=htmlstr.replace(/Ou ZhenHua/g,"欧振华");
htmlstr=htmlstr.replace(/Pan FengYi/g,"潘峰怡");
htmlstr=htmlstr.replace(/Qian HaiCheng/g,"钱海澄");
htmlstr=htmlstr.replace(/Qian PengCheng/g,"钱鹏程");
htmlstr=htmlstr.replace(/She JiHua/g,"佘继华");
htmlstr=htmlstr.replace(/Shen RuiLin/g,"沈瑞琳");
htmlstr=htmlstr.replace(/Shi JiangHua/g,"石江华");
htmlstr=htmlstr.replace(/Shi ZhiNing/g,"石志宁");
htmlstr=htmlstr.replace(/Si ZhengPeng/g,"司正鹏");
htmlstr=htmlstr.replace(/Sun Lei/g,"孙磊");
htmlstr=htmlstr.replace(/Wan Qiang/g,"万强");
htmlstr=htmlstr.replace(/Wang TieSheng/g,"王铁生");
htmlstr=htmlstr.replace(/XianYu RunTao/g,"鲜于润涛");
htmlstr=htmlstr.replace(/Xiang QiuMing/g,"项秋明");
htmlstr=htmlstr.replace(/Xie YiFan/g,"谢一凡");
htmlstr=htmlstr.replace(/Xiong JianQiang/g,"熊建强");
htmlstr=htmlstr.replace(/Yan FengSheng/g,"闫丰胜");
htmlstr=htmlstr.replace(/Ye DeNan/g,"叶德楠");
htmlstr=htmlstr.replace(/Yi HaiDong|Yi '一嗨咚' HaiDong/g,"易海东");
htmlstr=htmlstr.replace(/Zhai YueFei/g,"翟跃飞");
htmlstr=htmlstr.replace(/Zhang ChenXi/g,"张晨曦");
htmlstr=htmlstr.replace(/Zhang DaWei/g,"张达维");
htmlstr=htmlstr.replace(/Zhang YuanHang/g,"张远航");
htmlstr=htmlstr.replace(/Zhao BinJia/g,"赵彬嘉");
htmlstr=htmlstr.replace(/Zhen XiangNan/g,"甄向楠");
htmlstr=htmlstr.replace(/Zhou PengZhi/g,"周鹏志");
htmlstr=htmlstr.replace(/Zhou TaoFu/g,"周涛福");
htmlstr=htmlstr.replace(/Zhou Zheng/g,"周正");
htmlstr=htmlstr.replace(/ZhuGe BinYi/g,"诸葛滨懿");
htmlstr=htmlstr.replace(/Zhuang Han/g,"庄寒");
htmlstr=htmlstr.replace(/Zhuang LongYuan/g,"庄龙渊");
htmlstr=htmlstr.replace(/Zu JiangHua/g,"祖江华");

//No.4
//纽约市市委办公室
htmlstr=htmlstr.replace(/Chen ChenYuan/g,"陈尘缘");
htmlstr=htmlstr.replace(/Dai WenXin/g,"戴闻盺");
htmlstr=htmlstr.replace(/Du ZhengYu/g,"杜征宇");
htmlstr=htmlstr.replace(/Fuk Chik Chow/g,"周符继");
htmlstr=htmlstr.replace(/Hu DaWei/g,"胡达维"); 
htmlstr=htmlstr.replace(/Hua BaoLiang/g,"华宝亮");
htmlstr=htmlstr.replace(/Ji MuZong/g,"季木宗"); 
htmlstr=htmlstr.replace(/Kang QuanShun/g,"康权舜"); 
htmlstr=htmlstr.replace(/Li RuiMing/g,"李锐铭");
htmlstr=htmlstr.replace(/Liu Ting/g,"刘挺"); 
htmlstr=htmlstr.replace(/MuRong KeXing/g,"慕容克星"); 
htmlstr=htmlstr.replace(/OuYang LongLong/g,"欧阳龙龙");
htmlstr=htmlstr.replace(/OuYang WenLiang/g,"欧阳文良");
htmlstr=htmlstr.replace(/Pan Shu/g,"潘树");
htmlstr=htmlstr.replace(/Qin MingHao/g,"秦明昊");
htmlstr=htmlstr.replace(/Qiu YunZhou/g,"邱云洲"); 
htmlstr=htmlstr.replace(/Shu ZeYong/g,"舒泽勇");
htmlstr=htmlstr.replace(/Tan XuanYi/g,"谭轩逸");
htmlstr=htmlstr.replace(/Wang Chou/g,"王畴");
htmlstr=htmlstr.replace(/Wu PeiZhao/g,"吴培朝");
htmlstr=htmlstr.replace(/Xun SiDe/g,"荀嗣德");
htmlstr=htmlstr.replace(/Yan JiangRui/g,"闫江瑞"); 
htmlstr=htmlstr.replace(/Yuan XiaoMa/g,"袁小马");
htmlstr=htmlstr.replace(/Zhan JiangRui/g,"詹江睿");
htmlstr=htmlstr.replace(/ZhangLiang ShangKun/g,"张良尚鲲");
htmlstr=htmlstr.replace(/Zhou MinWei/g,"周敏未");


//No.5
//川沙辅川
htmlstr=htmlstr.replace(/Ao JiHai/g,"岙冀海");
htmlstr=htmlstr.replace(/Bai DaShan/g,"白耷善");
htmlstr=htmlstr.replace(/Cai JiaJi/g,"蔡伽季");
htmlstr=htmlstr.replace(/Cai TaiZhen/g,"蔡台臻");
htmlstr=htmlstr.replace(/Cao YunDing/g,"曹耘町");
htmlstr=htmlstr.replace(/Chen ChaoWei/g,"陈朝潍");
htmlstr=htmlstr.replace(/Chen YiZhe/g,"陈益哲");
htmlstr=htmlstr.replace(/Cui Chen/g,"崔郴");
htmlstr=htmlstr.replace(/Du Hai/g,"杜海");
htmlstr=htmlstr.replace(/He YiJie/g,"何益节");
htmlstr=htmlstr.replace(/He YouLin/g,"贺忧临");
htmlstr=htmlstr.replace(/Jiang WeiShen/g,"蒋为慎");
htmlstr=htmlstr.replace(/Liao WeiShen/g,"廖韦深");
htmlstr=htmlstr.replace(/Lv FeiFan/g,"吕霏樊");
htmlstr=htmlstr.replace(/Lv FuCheng/g,"吕辅承");
htmlstr=htmlstr.replace(/Mao YuGong/g,"毛遇躬");
htmlstr=htmlstr.replace(/MuRong JunLi/g,"慕容隽笠");
htmlstr=htmlstr.replace(/Nong AnYi/g,"农安逸");
htmlstr=htmlstr.replace(/Qin XuJun/g,"秦绪均");
htmlstr=htmlstr.replace(/Sang YunLong/g,"桑匀垄");
htmlstr=htmlstr.replace(/Shi ZhiBo/g,"石知博");
htmlstr=htmlstr.replace(/Tan ZhaoHui/g,"谭召辉");
htmlstr=htmlstr.replace(/Xu JiaHe/g,"徐嘉禾");
htmlstr=htmlstr.replace(/Zhang BaiChuan/g,"张伯川");
htmlstr=htmlstr.replace(/Zhong GuoJie/g,"钟虢届");
htmlstr=htmlstr.replace(/Zhu ZuDe/g,"祝祖德");
htmlstr=htmlstr.replace(/Zu Yao KaiWen/g,"祖姚楷闻");


//Bayer 04 Leverkusen 
//No.6
htmlstr=htmlstr.replace(/Anas Nafti/g,"阿纳斯·纳法蒂"); 
htmlstr=htmlstr.replace(/Bai GuoHao/g,"白国豪"); 
htmlstr=htmlstr.replace(/Bu GaiJie/g,"卜垓杰"); 
htmlstr=htmlstr.replace(/Cecyliusz Gotowicki/g,"塞西柳丝·格托维斯基"); 
htmlstr=htmlstr.replace(/Chi HengZhi/g,"迟恒之"); 
htmlstr=htmlstr.replace(/Fan FengChui/g,"樊风吹"); 
htmlstr=htmlstr.replace(/Fang JiaMin/g,"方佳敏"); 
htmlstr=htmlstr.replace(/Fei ZiRan/g,"妃子冉"); 
htmlstr=htmlstr.replace(/Fu WenTao/g,"付文韬"); 
htmlstr=htmlstr.replace(/Hu LiangYu/g,"胡良宇"); 
htmlstr=htmlstr.replace(/Hu XueDong/g,"胡学冬"); 
htmlstr=htmlstr.replace(/Hua ZhongYi/g,"华中一"); 
htmlstr=htmlstr.replace(/Huang WuShuang/g,"皇无双"); 
htmlstr=htmlstr.replace(/Huang ZhuoJun/g,"黄卓君"); 
htmlstr=htmlstr.replace(/Isaac Weijgertze/g,"伊萨克·维嘉格雷泽"); 
htmlstr=htmlstr.replace(/Jae-Sun Mok/g,"孙缄默"); 
htmlstr=htmlstr.replace(/Jia MingHu/g,"贾明虎"); 
htmlstr=htmlstr.replace(/Jian HongJun/g,"建红军"); 
htmlstr=htmlstr.replace(/Kanaan Al Qanawati/g,"卡纳安·埃卡那瓦迪"); 
htmlstr=htmlstr.replace(/Lai RuiLin/g,"莱瑞林"); 
htmlstr=htmlstr.replace(/Li JianFeng/g,"李剑锋"); 
htmlstr=htmlstr.replace(/Lin BeiHai/g,"林北海");
htmlstr=htmlstr.replace(/Lin HaoRan/g,"林浩然"); 
htmlstr=htmlstr.replace(/Lin ShuangBang/g,"林双邦"); 
htmlstr=htmlstr.replace(/Liu JiaXian/g,"柳嘉仙"); 
htmlstr=htmlstr.replace(/Ma ZhongShi/g,"马中士"); 
htmlstr=htmlstr.replace(/Marko Arkko/g,"马尔科·阿珂"); 
htmlstr=htmlstr.replace(/Nie AnRong/g,"聂安荣"); 
htmlstr=htmlstr.replace(/Nong ZiYun/g,"农子云"); 
htmlstr=htmlstr.replace(/Pan YinLong/g,"潘银龙"); 
htmlstr=htmlstr.replace(/Peng YuXi/g,"彭玉玺"); 
htmlstr=htmlstr.replace(/Shang BoXuan/g,"尚博轩"); 
htmlstr=htmlstr.replace(/Shao YanQiu/g,"邵彦丘"); 
htmlstr=htmlstr.replace(/Tan ZiYi/g,"谭子仪"); 
htmlstr=htmlstr.replace(/Tong GouSheng/g,"童狗剩"); 
htmlstr=htmlstr.replace(/Wu YiXin/g,"吴一心"); 
htmlstr=htmlstr.replace(/Yang DengKe/g,"杨登科"); 
htmlstr=htmlstr.replace(/Yang ShaoQiu/g,"杨少秋"); 
htmlstr=htmlstr.replace(/You YuanHang/g,"游远航"); 
htmlstr=htmlstr.replace(/Yu GuoJian/g,"俞国坚"); 
htmlstr=htmlstr.replace(/Yu RongJi/g,"于荣吉"); 
htmlstr=htmlstr.replace(/Zhao YaWen/g,"赵亚文"); 
htmlstr=htmlstr.replace(/Zhi JinJie/g,"智金杰"); 
htmlstr=htmlstr.replace(/Zou ShouCheng/g,"邹守城"); 

//NO.7
//赤龙 
htmlstr=htmlstr.replace(/Cheng '张月鹿' ZeHua|Cheng ZeHua/g,"程泽华"); 
htmlstr=htmlstr.replace(/Fu '弱水旺' WangCai|Fu WangCai/g,"符旺财"); 
htmlstr=htmlstr.replace(/Gao '牛金牛' JunHao|Gao JunHao/g,"高俊豪"); 
htmlstr=htmlstr.replace(/Guo '鬼金羊' BangBin|Guo BangBin/g,"郭邦斌"); 
htmlstr=htmlstr.replace(/He '星日马' HengZhi|He HengZhi/g,"何衡之"); 
htmlstr=htmlstr.replace(/Huang YongFei/g,"黄永飞");
htmlstr=htmlstr.replace(/Ji '亢金龙' YanSheng|Ji YanSheng/g,"季炎升"); 
htmlstr=htmlstr.replace(/Ji '狻猊' BoXiang|Ji BoXiang/g,"纪博翔"); 
htmlstr=htmlstr.replace(/Jin '觜火猴' HanRu|Jin HanRu/g,"金汉茹"); 
htmlstr=htmlstr.replace(/Li '角木蛟' YingLong|Li YingLong/g,"黎应龙");
htmlstr=htmlstr.replace(/Lin '房日兔' SanZhen|Lin SanZhen/g,"林三震"); 
htmlstr=htmlstr.replace(/Mo '翼火蛇' FuSheng|Mo FuSheng/g,"莫福生"); 
htmlstr=htmlstr.replace(/Nan '心月狐' XinYue|Nan XinYue/g,"南歆越");
htmlstr=htmlstr.replace(/Rao '虚日鼠' YaoTong|Rao YaoTong/g,"饶耀彤"); 
htmlstr=htmlstr.replace(/Sang '逆鳞' ZhiXing|Sang ZhiXing/g,"桑之星"); 
htmlstr=htmlstr.replace(/Sha '奎木狼' WenXin|Sha WenXin/g,"沙文欣"); 
htmlstr=htmlstr.replace(/Shi '井木犴' BaoRong|Shi BaoRong/g,"释宝荣"); 
htmlstr=htmlstr.replace(/Shi '圣龙' ShengLong|Shi ShengLong/g,"释圣龙");
htmlstr=htmlstr.replace(/TaiShi '氐土貉' JingRen|TaiShi JingRen/g,"太史靖仁");
htmlstr=htmlstr.replace(/Yu '箕水豹' ZhiWei|Yu ZhiWei/g,"余智威"); 
htmlstr=htmlstr.replace(/Zhong '蒲牢' ZhiXuan|Zhong ZhiXuan/g,"钟智轩");
htmlstr=htmlstr.replace(/Zou '毕月乌' ZheBin|Zou ZheBin/g,"邹哲斌");



//No.8
//艾斯丁学校
htmlstr=htmlstr.replace(/Che XiWang/g,"车希望"); 
htmlstr=htmlstr.replace(/Diao YiJie/g,"刁易杰"); 
htmlstr=htmlstr.replace(/Hong PeiYuan/g,"洪裴元"); 
htmlstr=htmlstr.replace(/Hua ShouWu/g,"华首乌"); 
htmlstr=htmlstr.replace(/Ji YiDa/g,"吉益达"); 
htmlstr=htmlstr.replace(/Ma GuangYu/g,"马光宇"); 
htmlstr=htmlstr.replace(/Qiao GuangYao/g,"乔广姚");
htmlstr=htmlstr.replace(/Qiu ZhengYue/g,"邱震岳"); 
htmlstr=htmlstr.replace(/Wang ChenChen/g,"汪晨晨"); 
htmlstr=htmlstr.replace(/Xiao XinYuan/g,"箫新远"); 
htmlstr=htmlstr.replace(/Yao JingTian/g,"姚惊天"); 
htmlstr=htmlstr.replace(/Zhang JianJun/g,"章建军"); 
htmlstr=htmlstr.replace(/Zhang XiSha/g,"张希沙"); 
htmlstr=htmlstr.replace(/Zhong JiaKang/g,"钟家康"); 
htmlstr=htmlstr.replace(/Zu XuanYi/g,"祖轩逸"); 


//No.9
//梅桥岭FC
htmlstr=htmlstr.replace(/Ao ZhiHua/g,"敖志华"); 
htmlstr=htmlstr.replace(/Arne Van Rossem/g,"阿恩·范·罗斯") 
htmlstr=htmlstr.replace(/Bei HanYun/g,"北汉云"); 
htmlstr=htmlstr.replace(/Bob Sant Biswas/g,"鲍勃·桑特比斯"); 
htmlstr=htmlstr.replace(/Cai XinYi/g,"蔡新一"); 
htmlstr=htmlstr.replace(/Calvino Damasco/g,"卡尔文·大马士革"); 
htmlstr=htmlstr.replace(/Chao HaiYu/g,"晁海虞"); 
htmlstr=htmlstr.replace(/Chen QianShi/g,"陈乾世") 
htmlstr=htmlstr.replace(/Chu Liangde/g,"褚良德"); 
htmlstr=htmlstr.replace(/Chu ZhuZi/g,"楚朱子"); 
htmlstr=htmlstr.replace(/Dang GuoYu/g,"党国玉") 
htmlstr=htmlstr.replace(/Dennis Peeters/g,"丹尼斯·皮特斯"); 
htmlstr=htmlstr.replace(/Eino Ruuskanen/g,"埃诺·卢卡南"); 
htmlstr=htmlstr.replace(/Fei WeiCheng/g,"费卫城"); 
htmlstr=htmlstr.replace(/Gabriel De Beul/g,"加布里埃尔·德·比尔"); 
htmlstr=htmlstr.replace(/Gan ShouZhi/g,"甘守志"); 
htmlstr=htmlstr.replace(/Hadrien Leplat/g,"哈德里恩·莱普拉"); 
htmlstr=htmlstr.replace(/He WenYong/g,"何文勇"); 
htmlstr=htmlstr.replace(/Hong GuoQiang/g,"洪国强"); 
htmlstr=htmlstr.replace(/Hong ShuoCheng/g,"洪硕成"); 
htmlstr=htmlstr.replace(/Hu JunBo/g,"胡俊波"); 
htmlstr=htmlstr.replace(/Hu LiXing/g,"胡立兴"); 
htmlstr=htmlstr.replace(/Hu ZiHe/g,"胡子和"); 
htmlstr=htmlstr.replace(/HuangShu JiaHe/g,"皇叔嘉禾"); 
htmlstr=htmlstr.replace(/Ion Oancea/g,"艾恩·欧安思"); 
htmlstr=htmlstr.replace(/Irakli Makashvili/g,"伊拉克里·玛卡"); 
htmlstr=htmlstr.replace(/Jiao KangWen/g,"焦亢文"); 
htmlstr=htmlstr.replace(/Kang XuePeng/g,"康学鹏"); 
htmlstr=htmlstr.replace(/Kang YaLong/g,"康亚龙"); 
htmlstr=htmlstr.replace(/Kedar Alshomrani/g,"凯达尔·阿尔索拉尼"); 
htmlstr=htmlstr.replace(/Kong ZhiXing/g,"孔智星"); 
htmlstr=htmlstr.replace(/Li BingJie/g,"李冰杰"); 
htmlstr=htmlstr.replace(/Li BoHan/g,"李博涵"); 
htmlstr=htmlstr.replace(/Li JinWei/g,"李金伟"); 
htmlstr=htmlstr.replace(/Liang JiBin/g,"梁纪斌"); 
htmlstr=htmlstr.replace(/Lin YanMing/g,"林彦明"); 
htmlstr=htmlstr.replace(/Lin ZhaoTian/g,"林昭天"); 
htmlstr=htmlstr.replace(/Liu ShangKun/g,"刘尚坤"); 
htmlstr=htmlstr.replace(/Lu WenAn/g,"卢文安"); 
htmlstr=htmlstr.replace(/Lv Ye/g,"吕爷"); 
htmlstr=htmlstr.replace(/Mao FengFeng/g,"毛凤凤"); 
htmlstr=htmlstr.replace(/Niu LianZhi/g,"牛连志"); 
htmlstr=htmlstr.replace(/Peng XuHao/g,"彭旭豪"); 
htmlstr=htmlstr.replace(/Qiao Bei/g,"乔北"); 
htmlstr=htmlstr.replace(/Rukia Naganuma/g,"露琪亚·长沼"); 
htmlstr=htmlstr.replace(/Shi GuoQing/g,"石国庆"); 
htmlstr=htmlstr.replace(/Shi XianLu/g,"石仙陆"); 
htmlstr=htmlstr.replace(/Shu YueWu/g,"舒跃武"); 
htmlstr=htmlstr.replace(/Si ChenYe/g,"斯陈爷"); 
htmlstr=htmlstr.replace(/Song FengFeng/g,"宋丰丰"); 
htmlstr=htmlstr.replace(/Sun GuangRi/g,"孙广日"); 
htmlstr=htmlstr.replace(/Wang YunDing/g,"王赟定"); 
htmlstr=htmlstr.replace(/Wang ZeYong/g,"王泽勇"); 
htmlstr=htmlstr.replace(/Wei ShiZhuang/g,"魏世庄"); 
htmlstr=htmlstr.replace(/Wei YiHu/g,"魏一虎"); 
htmlstr=htmlstr.replace(/Wu QiPeng/g,"武齐鹏"); 
htmlstr=htmlstr.replace(/Wu XuChu/g,"吴旭初"); 
htmlstr=htmlstr.replace(/Xian LuCao/g,"仙露草"); 
htmlstr=htmlstr.replace(/Xie YanWei/g,"谢严伟"); 
htmlstr=htmlstr.replace(/Xu HongGang/g,"徐洪刚"); 
htmlstr=htmlstr.replace(/Xu ShengRui/g,"徐晟锐");
htmlstr=htmlstr.replace(/Xu Xiao/g,"徐骁"); 
htmlstr=htmlstr.replace(/Xue YangYang/g,"薛洋洋"); 
htmlstr=htmlstr.replace(/Yani Chonov/g,"亚尼·科诺夫"); 
htmlstr=htmlstr.replace(/Ye JiKuan/g,"叶季宽"); 
htmlstr=htmlstr.replace(/Ye YuXi/g,"叶禹锡"); 
htmlstr=htmlstr.replace(/Yi WeiTing/g,"易伟霆"); 
htmlstr=htmlstr.replace(/Youssef Flores/g,"尤瑟夫·弗洛雷斯"); 
htmlstr=htmlstr.replace(/Yu LongXiang/g,"于龙翔"); 
htmlstr=htmlstr.replace(/Yuan AnNie/g,"袁安聂"); 
htmlstr=htmlstr.replace(/Yuan QingHe/g,"袁清河"); 
htmlstr=htmlstr.replace(/Yue YuJing/g,"岳玉京"); 
htmlstr=htmlstr.replace(/Zhangsun BangWei/g,"长孙邦威"); 
htmlstr=htmlstr.replace(/Zhao XiHe/g,"赵锡禾"); 
htmlstr=htmlstr.replace(/Zhong HeXuan/g,"钟贺轩"); 
htmlstr=htmlstr.replace(/Zhu Qun/g,"朱群"); 
htmlstr=htmlstr.replace(/Zhu YaDong/g,"朱亚东"); 
htmlstr=htmlstr.replace(/Zhuang LingPu/g,"庄灵浦"); 
htmlstr=htmlstr.replace(/Zou YiTai/g,"邹伊泰"); 

//No.10
//俄城雷霆
htmlstr=htmlstr.replace(/Ai JiaMin/g,"艾嘉敏"); 
htmlstr=htmlstr.replace(/Bao QiPeng/g,"包祁鹏"); 
htmlstr=htmlstr.replace(/Cai '鑫豪' XinHao|Cai XinHao/g,"偲鑫豪"); 
htmlstr=htmlstr.replace(/Cao YuMo/g,"曹宇墨"); 
htmlstr=htmlstr.replace(/Chi FeiQin/g,"赤飞禽"); 
htmlstr=htmlstr.replace(/Da '国王' GuangNan|Da GuangNan/g,"达光南"); 
htmlstr=htmlstr.replace(/Da GuangNan/g,"达光楠"); 
htmlstr=htmlstr.replace(/Deng MingHu/g,"邓明虎"); 
htmlstr=htmlstr.replace(/Ding JunSheng/g,"丁俊生"); 
htmlstr=htmlstr.replace(/Ding YouSu/g,"丁游溯"); 
htmlstr=htmlstr.replace(/Dong JunTao/g,"董峻涛");
htmlstr=htmlstr.replace(/DongFang HaiMing/g,"东方海明"); 
htmlstr=htmlstr.replace(/Fan HongXuan/g,"范鸿轩"); 
htmlstr=htmlstr.replace(/Fan LuoGen/g,"范罗艮"); 
htmlstr=htmlstr.replace(/Fei WenZhuo/g,"斐文卓"); 
htmlstr=htmlstr.replace(/Gao HongBing/g,"高鸿秉");
htmlstr=htmlstr.replace(/Hao HuXiang/g,"郝湖湘"); 
htmlstr=htmlstr.replace(/Hao Run/g,"郝润"); 
htmlstr=htmlstr.replace(/Bai '黑澤明' ZeMin|Bai ZeMin/g,"黑泽民"); 
htmlstr=htmlstr.replace(/Hua Chou/g,"花丑"); 
htmlstr=htmlstr.replace(/Hua YeCheng/g,"花烨成"); 
htmlstr=htmlstr.replace(/Huang DeKai/g,"黄德凯"); 
htmlstr=htmlstr.replace(/Ji YiShan/g,"季一山"); 
htmlstr=htmlstr.replace(/Jian JuJi/g,"简巨基"); 
htmlstr=htmlstr.replace(/Jin ZiHang/g,"金子航"); 
htmlstr=htmlstr.replace(/Li FengChui/g,"李丰炊"); 
htmlstr=htmlstr.replace(/Li GuangMing/g,"李广明");
htmlstr=htmlstr.replace(/Meng '门长明' ChangMin|Meng ChangMin/g,"孟昶闵"); 
htmlstr=htmlstr.replace(/Niu PengYi/g,"牛彭毅"); 
htmlstr=htmlstr.replace(/Pan LiQiang/g,"潘礼强"); 
htmlstr=htmlstr.replace(/Peng Tie/g,"彭铁");
htmlstr=htmlstr.replace(/Qian SuZheng/g,"钱肃正"); 
htmlstr=htmlstr.replace(/Qiu ZhuoXi/g,"邱卓溪"); 
htmlstr=htmlstr.replace(/Rao LingFu/g,"饶令符");
htmlstr=htmlstr.replace(/Shi ZhiHao/g,"时志豪"); 
htmlstr=htmlstr.replace(/Shu Xia/g,"舒夏"); 
htmlstr=htmlstr.replace(/Si KaiWen/g,"司凯文"); 
htmlstr=htmlstr.replace(/Sun SanQiang/g,"隼三强"); 
htmlstr=htmlstr.replace(/Tian ZhiPing/g,"田志平");
htmlstr=htmlstr.replace(/Wang HaiYu/g,"王海宇"); 
htmlstr=htmlstr.replace(/Wang Hang/g,"王航");
htmlstr=htmlstr.replace(/Wei '喂！星辰' XinChen|Wei XinChen/g,"魏心辰"); 
htmlstr=htmlstr.replace(/Wei ZeZhou/g,"魏泽州"); 
htmlstr=htmlstr.replace(/Xiong DengKe/g,"熊登科");
htmlstr=htmlstr.replace(/Yu QianShi/g,"于乾释");
htmlstr=htmlstr.replace(/Zhang ZiHan/g,"张梓涵"); 
htmlstr=htmlstr.replace(/Zhao DeRong/g,"赵德荣");
htmlstr=htmlstr.replace(/Zhao JieXian/g,"赵杰宪"); 
htmlstr=htmlstr.replace(/Zhao YunJie/g,"杜云杰");
htmlstr=htmlstr.replace(/Zhen HanYun/g,"甄汉云");
htmlstr=htmlstr.replace(/Zheng XiuQuan/g,"郑秀全"); 
htmlstr=htmlstr.replace(/Zhong JianFu/g,"钟健孚"); 
htmlstr=htmlstr.replace(/Zhou LongTeng/g,"周龙腾"); 
htmlstr=htmlstr.replace(/Zhou YongWang/g,"周永王"); 

//No.11
//唐风
htmlstr=htmlstr.replace(/Cai ZhiFei/g,"蔡志飞");
htmlstr=htmlstr.replace(/Cui Hui/g,"崔晖");
htmlstr=htmlstr.replace(/Dang ZhiYong/g,"党志勇");
htmlstr=htmlstr.replace(/Du MingWen/g,"杜明文");
htmlstr=htmlstr.replace(/Dávid Patkó/g,"达维德·保特科"); 
htmlstr=htmlstr.replace(/Fan YiHu/g,"范一虎");
htmlstr=htmlstr.replace(/Fu Dong/g,"傅东");	
htmlstr=htmlstr.replace(/Gabriele Mazzucchelli/g,"加布里埃勒·马祖凯利");
htmlstr=htmlstr.replace(/Gong RongSheng/g,"宫荣升");
htmlstr=htmlstr.replace(/Guan JinTao/g,"关锦涛");
htmlstr=htmlstr.replace(/Guo YongHao/g,"郭永好");
htmlstr=htmlstr.replace(/Han DaPing/g,"韩大平");
htmlstr=htmlstr.replace(/Hua SuZheng/g,"华苏征");
htmlstr=htmlstr.replace(/Huang HanLiang/g,"黄汉良");
htmlstr=htmlstr.replace(/Huang XiangNan/g,"黄翔南");
htmlstr=htmlstr.replace(/Huo Zhou/g,"霍舟");
htmlstr=htmlstr.replace(/Jan Geluk/g,"扬格鲁克");
htmlstr=htmlstr.replace(/Jian You/g,"简友");
htmlstr=htmlstr.replace(/Jin XuFen/g,"金许分");
htmlstr=htmlstr.replace(/Ke YaKe/g,"柯亚科");
htmlstr=htmlstr.replace(/Lai KaiBin/g,"赖楷斌");
htmlstr=htmlstr.replace(/Li DongJian/g,"李冬健");
htmlstr=htmlstr.replace(/Li LiRong/g,"李立荣");
htmlstr=htmlstr.replace(/Lian Ting/g,"廉挺");
htmlstr=htmlstr.replace(/Liang HaiLiang/g,"梁海亮");
htmlstr=htmlstr.replace(/Liang MingYan/g,"梁茗砚");
htmlstr=htmlstr.replace(/Lin ChengJun/g,"林承君");
htmlstr=htmlstr.replace(/Lin JianYong/g,"林建勇");
htmlstr=htmlstr.replace(/Lu HaiLiang/g,"卢海亮");
htmlstr=htmlstr.replace(/Ma ChengJian/g,"马成建");
htmlstr=htmlstr.replace(/Mao ShiLin/g,"毛时林");
htmlstr=htmlstr.replace(/Peng ShunKai/g,"彭顺凯"); 
htmlstr=htmlstr.replace(/Qin HuiJun/g,"秦晖钧");
htmlstr=htmlstr.replace(/Qin YouAn/g,"秦友安");
htmlstr=htmlstr.replace(/Ran ZhuoYi/g,"冉卓易");
htmlstr=htmlstr.replace(/Shu Jia/g,"舒佳");
htmlstr=htmlstr.replace(/Shuji Otsuka/g,"大津贺崇时");
htmlstr=htmlstr.replace(/Sun ChaoCe/g,"孙晁策");
htmlstr=htmlstr.replace(/Tan HuXiang/g,"谭浒翔");
htmlstr=htmlstr.replace(/Wang GuangMin/g,"王光闵"); 
htmlstr=htmlstr.replace(/Wang JiMi/g,"王吉米");
htmlstr=htmlstr.replace(/Wang KangWen/g,"王亢文");
htmlstr=htmlstr.replace(/Wang SongYan/g,"王松岩");
htmlstr=htmlstr.replace(/Wen Yong/g,"温勇");
htmlstr=htmlstr.replace(/Xing KeWei/g,"刑克伟");
htmlstr=htmlstr.replace(/Xu LiJi/g,"徐里继");
htmlstr=htmlstr.replace(/Yu DongLong/g,"于东龙");
htmlstr=htmlstr.replace(/Yun JinYuan/g,"云津源");
htmlstr=htmlstr.replace(/Zhang WenChou/g,"张文丑");
htmlstr=htmlstr.replace(/Zheng Pu/g,"郑普");
htmlstr=htmlstr.replace(/Zhou ChengHao/g,"周成好");
htmlstr=htmlstr.replace(/Zhou XinHao/g,"周心昊");
htmlstr=htmlstr.replace(/Zhu ZeXuan/g,"朱泽轩");
htmlstr=htmlstr.replace(/Zhuang WeiGuo/g,"庄卫国");
htmlstr=htmlstr.replace(/Zhuang ZhuCheng/g,"庄诸成");
htmlstr=htmlstr.replace(/Zu ChenJun/g,"祖晨钧");

//FC.北京布丁 
//No.12
htmlstr=htmlstr.replace(/Cao HongWu/g,"曹洪武"); 
htmlstr=htmlstr.replace(/He DongYa/g,"何东亚"); 
htmlstr=htmlstr.replace(/Jia YueBo/g,"贾越波"); 
htmlstr=htmlstr.replace(/Jin ZiXuan/g,"金子轩"); 
htmlstr=htmlstr.replace(/Mu ZiJie/g,"穆子杰"); 
htmlstr=htmlstr.replace(/Qian ChengZhong/g,"钱承中"); 
htmlstr=htmlstr.replace(/Qiu Huo/g,"丘豁");
htmlstr=htmlstr.replace(/Qiu WeiJun/g,"丘伟军"); 
htmlstr=htmlstr.replace(/Wei Miao/g,"维淼"); 
htmlstr=htmlstr.replace(/Xiong JingHua/g,"熊京华"); 
htmlstr=htmlstr.replace(/Xiong JingHua/g,"熊京华"); 
htmlstr=htmlstr.replace(/Xu HengZhi/g,"徐恒智"); 
htmlstr=htmlstr.replace(/Xue ZhaoJun/g,"薛昭君"); 
htmlstr=htmlstr.replace(/Ye Gan/g,"叶敢"); 
htmlstr=htmlstr.replace(/Zhang ZhongYou/g,"张忠友"); 

//No.13
//重庆麻辣火锅
htmlstr=htmlstr.replace(/Akmal Gaspar/g,"阿克马尔·加斯珀");
htmlstr=htmlstr.replace(/Cai Liang/g,"蔡凉");
htmlstr=htmlstr.replace(/Cao YuanYuan/g,"曹渊源"); 
htmlstr=htmlstr.replace(/Cen ChunJi/g,"岑春季"); 
htmlstr=htmlstr.replace(/Cheng Ying/g,"承影"); 
htmlstr=htmlstr.replace(/Cui SongYan/g,"崔松烟");
htmlstr=htmlstr.replace(/Dibya Ramvani/g,"迪比亚·拉姆瓦尼");
htmlstr=htmlstr.replace(/Dong Zu/g,"冬祖");
htmlstr=htmlstr.replace(/Eliseo Garcia/g,"埃利塞奥·加西亚");
htmlstr=htmlstr.replace(/Feng FengXin/g,"冯封心"); 
htmlstr=htmlstr.replace(/Gan ZeQi/g,"甘泽奇");
htmlstr=htmlstr.replace(/Gao ShiLei/g,"高石磊");
htmlstr=htmlstr.replace(/Gao WenBo/g,"高稳波");
htmlstr=htmlstr.replace(/Ge XiangTao/g,"葛祥韬");
htmlstr=htmlstr.replace(/Guo JingGe/g,"郭惊歌");
htmlstr=htmlstr.replace(/Ha TanChao/g,"哈谭超"); 
htmlstr=htmlstr.replace(/Han HongLi/g,"韩弘历"); 
htmlstr=htmlstr.replace(/Huang ShengLi/g,"黄胜利"); 
htmlstr=htmlstr.replace(/Hubert Gębura/g,"休伯特·乔布拉");
htmlstr=htmlstr.replace(/Jia MingChang/g,"贾铭昶"); 
htmlstr=htmlstr.replace(/Jiao JianWen/g,"焦建文");
htmlstr=htmlstr.replace(/Kang ChengDa/g,"康承达");
htmlstr=htmlstr.replace(/Li Dun/g,"李盾"); 
htmlstr=htmlstr.replace(/Li YaJian/g,"黎亚坚"); 
htmlstr=htmlstr.replace(/Li ZiXin/g,"李子鑫");
htmlstr=htmlstr.replace(/Liang ChangLin/g,"梁长麟");
htmlstr=htmlstr.replace(/Liang XuGang/g,"梁旭刚"); 
htmlstr=htmlstr.replace(/Lin XiJun/g,"林西军");
htmlstr=htmlstr.replace(/Lin ZhenYang/g,"林振阳");
htmlstr=htmlstr.replace(/Liu BoQiang/g,"柳柏强");
htmlstr=htmlstr.replace(/Lu DeXin/g,"卢德兴");
htmlstr=htmlstr.replace(/Lu LingTing/g,"卢凌霆"); 
htmlstr=htmlstr.replace(/Lu ZhangYi/g,"卢长义"); 
htmlstr=htmlstr.replace(/Mao Xiang/g,"毛翔"); 
htmlstr=htmlstr.replace(/Mu ShiJie/g,"穆世杰"); 
htmlstr=htmlstr.replace(/Ou HaiJian/g,"欧海建"); 
htmlstr=htmlstr.replace(/Ou Peng/g,"欧鹏");  
htmlstr=htmlstr.replace(/Pan YongQi/g,"潘永奇"); 
htmlstr=htmlstr.replace(/Pan ZeXi/g,"潘泽西");
htmlstr=htmlstr.replace(/Qu ShaoQuan/g,"曲绍泉"); 
htmlstr=htmlstr.replace(/Shan HaiYang/g,"山海阳");
htmlstr=htmlstr.replace(/Shi GuangHu/g,"石光虎"); 
htmlstr=htmlstr.replace(/Shi JieXian/g,"史杰贤"); 
htmlstr=htmlstr.replace(/Shi YanHan/g,"史炎寒"); 
htmlstr=htmlstr.replace(/Shu Donghua/g,"舒栋华"); 
htmlstr=htmlstr.replace(/Somanshu Ilyas/g,"苏曼殊·伊利亚斯"); 
htmlstr=htmlstr.replace(/Tian FengTao/g,"田奉韬"); 
htmlstr=htmlstr.replace(/Tupuri Achu/g,"图布里·阿苏");
htmlstr=htmlstr.replace(/Vasile Blanaru/g,"瓦西里·布勒纳鲁"); 
htmlstr=htmlstr.replace(/Wang ChangRui/g,"王长瑞"); 
htmlstr=htmlstr.replace(/Xie XianPing/g,"谢仙屏"); 
htmlstr=htmlstr.replace(/Xie XueMing/g,"谢学铭");
htmlstr=htmlstr.replace(/Xu JunChen/g,"徐俊辰");
htmlstr=htmlstr.replace(/You BeiHai/g,"游北海"); 
htmlstr=htmlstr.replace(/Zhang HanWen/g,"张瀚文");
htmlstr=htmlstr.replace(/Zhang KeLiang/g,"张克良");
htmlstr=htmlstr.replace(/Zhang ShengYuan/g,"张圣元"); 
htmlstr=htmlstr.replace(/Zheng LinHu/g,"郑麟虎");
htmlstr=htmlstr.replace(/Zhu YunChuan/g,"朱云川");


//No.14
//范迪克
htmlstr=htmlstr.replace(/Bo XiangFu/g,"薄湘福");
htmlstr=htmlstr.replace(/Cai DongPeng/g,"蔡冬鹏"); 
htmlstr=htmlstr.replace(/Cui ChaoYuan/g,"崔超远"); 
htmlstr=htmlstr.replace(/Ding HongCai/g,"丁宏才"); 
htmlstr=htmlstr.replace(/Du YiBin/g,"杜一斌"); 
htmlstr=htmlstr.replace(/Hu Ju/g,"胡菊"); 
htmlstr=htmlstr.replace(/Huang BingJie/g,"黄秉杰"); 
htmlstr=htmlstr.replace(/Lai ZhenDong/g,"赖振东"); 
htmlstr=htmlstr.replace(/Ling MuYuan/g,"凌沐源"); 
htmlstr=htmlstr.replace(/Pan ShunFeng/g,"潘顺峰"); 
htmlstr=htmlstr.replace(/Peng TianHong/g,"彭天鸿"); 
htmlstr=htmlstr.replace(/Qu XueYou/g,"曲学友"); 
htmlstr=htmlstr.replace(/Ren Tai/g,"任泰"); 
htmlstr=htmlstr.replace(/Shao Shang/g,"邵商"); 
htmlstr=htmlstr.replace(/She BuBai/g,"佘步柏"); 
htmlstr=htmlstr.replace(/Shi HeJing/g,"石河晶"); 
htmlstr=htmlstr.replace(/Tan JinXiang/g,"谭晋翔"); 
htmlstr=htmlstr.replace(/Wu LinFeng/g,"吴林峰"); 
htmlstr=htmlstr.replace(/Wu YongCheng/g,"吴勇成"); 
htmlstr=htmlstr.replace(/Xu Kuo/g,"徐括"); 
htmlstr=htmlstr.replace(/Ye BingQuang/g,"叶炳权"); 
htmlstr=htmlstr.replace(/Yi GuangHu/g,"易广虎"); 
htmlstr=htmlstr.replace(/Yuan BoYan/g,"苑博言"); 
htmlstr=htmlstr.replace(/Zhai YanHuai/g,"翟延槐"); 


//No.15
//河北华夏幸福
htmlstr=htmlstr.replace(/Chang ShiJu/g,"常世驹"); 
htmlstr=htmlstr.replace(/Chen BaiLin/g,"陈百林"); 
htmlstr=htmlstr.replace(/Dong ZhaoZhong/g,"董兆中"); 
htmlstr=htmlstr.replace(/Frank Allison/g,"弗兰克·阿里森"); 
htmlstr=htmlstr.replace(/Hao XiangJie/g,"郝相杰"); 
htmlstr=htmlstr.replace(/Ji MingJun/g,"姬明俊"); 
htmlstr=htmlstr.replace(/Jiang HaoYuan/g,"姜浩源"); 
htmlstr=htmlstr.replace(/Jonatan Acosta/g,"乔纳丹·阿科斯塔"); 
htmlstr=htmlstr.replace(/Ke Fa/g,"柯发"); 
htmlstr=htmlstr.replace(/Lin ShiAn/g,"林世安"); 
htmlstr=htmlstr.replace(/Luo RongJi/g,"罗荣基"); 
htmlstr=htmlstr.replace(/Oleg Trefiolov/g,"奥雷格·特雷费奥罗夫"); 
htmlstr=htmlstr.replace(/Otello Crescenzo/g,"奥特罗·卡雷斯科恩佐"); 
htmlstr=htmlstr.replace(/Pang JiSun/g,"庞吉顺"); 
htmlstr=htmlstr.replace(/Pravoslav Jakubko/g,"普拉沃斯拉夫·雅库布科");
htmlstr=htmlstr.replace(/Shao DaWei/g,"邵大伟"); 
htmlstr=htmlstr.replace(/Sheng WuBa/g,"盛无霸"); 
htmlstr=htmlstr.replace(/Shui XiaoHui/g,"水小辉");
htmlstr=htmlstr.replace(/Sun ZhiJiong/g,"孙志炯"); 
htmlstr=htmlstr.replace(/Tai ChunBin/g,"邰春斌"); 
htmlstr=htmlstr.replace(/Vadim Chernekov/g,"瓦蒂姆·切尔尼科夫"); 
htmlstr=htmlstr.replace(/Xin BoWei/g,"辛博伟"); 
htmlstr=htmlstr.replace(/Xu LeYuan/g,"徐乐元"); 
htmlstr=htmlstr.replace(/Zhong YaLong/g,"钟亚龙"); 
htmlstr=htmlstr.replace(/Zhou HaiHang/g,"周海航"); 


//No.16
//龙子湖竞技
htmlstr=htmlstr.replace(/An JinXi/g,"安进喜");
htmlstr=htmlstr.replace(/Bu Rui/g,"步瑞");
htmlstr=htmlstr.replace(/Cai TingYao/g,"蔡亭尧");
htmlstr=htmlstr.replace(/Cai WeiChao/g,"蔡伟超");
htmlstr=htmlstr.replace(/Chen ZiYuan/g,"陈子元");
htmlstr=htmlstr.replace(/Du ZhouZhe/g,"杜周哲");
htmlstr=htmlstr.replace(/Duan BuBai/g,"段不败");
htmlstr=htmlstr.replace(/Gan QuanZhang/g,"甘全章");
htmlstr=htmlstr.replace(/Geng LongLong/g,"耿龙龙");
htmlstr=htmlstr.replace(/Guan JianFeng/g,"关剑锋");
htmlstr=htmlstr.replace(/Gui LongXiang/g,"桂龙翔");
htmlstr=htmlstr.replace(/Guo JiangHua/g,"郭江华");
htmlstr=htmlstr.replace(/Han ZiXuan/g,"韩子轩");
htmlstr=htmlstr.replace(/He JunPeng/g,"何俊鹏");
htmlstr=htmlstr.replace(/Hu DeGang/g,"胡德刚");
htmlstr=htmlstr.replace(/Hua XuanDe/g,"华玄德");
htmlstr=htmlstr.replace(/Lei ZhiZhao/g,"雷志昭");
htmlstr=htmlstr.replace(/Leng XiRui/g,"冷希瑞");
htmlstr=htmlstr.replace(/Liang JingHao/g,"梁景皓");
htmlstr=htmlstr.replace(/Lin HongGang/g,"林宏刚");
htmlstr=htmlstr.replace(/Lin RuiQi/g,"林瑞琪");
htmlstr=htmlstr.replace(/Lu JingWen/g,"卢靖文");
htmlstr=htmlstr.replace(/Mu YaoYang/g,"穆耀阳");
htmlstr=htmlstr.replace(/Ning Ce/g,"宁策");
htmlstr=htmlstr.replace(/Nong Ke/g,"农科");
htmlstr=htmlstr.replace(/Peng WenCheng/g,"彭文成");
htmlstr=htmlstr.replace(/Peng ZiXin/g,"彭子鑫");
htmlstr=htmlstr.replace(/Qin ZiMo/g,"秦子墨");
htmlstr=htmlstr.replace(/Ran JinJian/g,"冉金健");
htmlstr=htmlstr.replace(/Rao ChengYe/g,"饶成业");
htmlstr=htmlstr.replace(/Tan XiangMin/g,"谭湘闵");
htmlstr=htmlstr.replace(/Tang JinXi/g,"唐进喜");
htmlstr=htmlstr.replace(/TuoBa HongLi/g,"拓跋弘历");
htmlstr=htmlstr.replace(/Xin ZiMing/g,"辛子明");
htmlstr=htmlstr.replace(/Xu ChaoYuan/g,"徐超元");
htmlstr=htmlstr.replace(/Xu XiaoFeng/g,"徐晓峰");
htmlstr=htmlstr.replace(/Yao ZiJie/g,"姚子杰");
htmlstr=htmlstr.replace(/Ye ChunJie/g,"叶春杰");
htmlstr=htmlstr.replace(/Ye WenJun/g,"叶文俊");
htmlstr=htmlstr.replace(/Yin MinWei/g,"尹敏伟");
htmlstr=htmlstr.replace(/Zhang RenJie/g,"张仁杰");
htmlstr=htmlstr.replace(/Zhou YeXuan/g,"周叶轩");
htmlstr=htmlstr.replace(/Zhu WeiFei/g,"朱伟飞");

//No.17
//公馆FC
htmlstr=htmlstr.replace(/Hou LeLe/g,"侯乐乐");
htmlstr=htmlstr.replace(/Li Chi/g,"利齿");
htmlstr=htmlstr.replace(/Luo ZhiYu/g,"罗志宇");
htmlstr=htmlstr.replace(/Xu YaZhao/g,"徐亚昭");
htmlstr=htmlstr.replace(/Yue ShaoHua/g,"岳少滑");
htmlstr=htmlstr.replace(/Zhuo TingYan/g,"卓挺严");

//No.18
//青岛教师联队
htmlstr=htmlstr.replace(/Cai KaiZe/g,"蔡开泽"); 
htmlstr=htmlstr.replace(/Dai Kun/g,"戴琨"); 
htmlstr=htmlstr.replace(/Fan HaoWen/g,"范浩文"); 
htmlstr=htmlstr.replace(/Feng DaLei/g,"冯大雷"); 
htmlstr=htmlstr.replace(/Gao Tie/g,"高铁"); 
htmlstr=htmlstr.replace(/Hong DaZhan/g,"洪大展"); 
htmlstr=htmlstr.replace(/Jiang GuoQiang/g,"姜国强"); 
htmlstr=htmlstr.replace(/Lv ZhuoJun/g,"吕卓君"); 
htmlstr=htmlstr.replace(/Ma KunPeng/g,"马坤鹏"); 
htmlstr=htmlstr.replace(/Mao WeiJie/g,"毛伟杰"); 
htmlstr=htmlstr.replace(/Peng ShiLin/g,"彭世林"); 
htmlstr=htmlstr.replace(/Pi YuQing/g,"皮玉清"); 
htmlstr=htmlstr.replace(/Qian Biao/g,"钱彪"); 
htmlstr=htmlstr.replace(/Shi ShangZhe/g,"石尚哲"); 
htmlstr=htmlstr.replace(/Tao HongLi/g,"陶宏历"); 
htmlstr=htmlstr.replace(/Xi YanKai/g,"席延凯"); 
htmlstr=htmlstr.replace(/Xia YaZhao/g,"夏雅照"); 
htmlstr=htmlstr.replace(/Xian He/g,"贤鹤"); 
htmlstr=htmlstr.replace(/Xue Jia/g,"薛佳"); 
htmlstr=htmlstr.replace(/You ZeDong/g,"尤泽东"); 
htmlstr=htmlstr.replace(/Zhang Ju/g,"张举"); 
htmlstr=htmlstr.replace(/Zhi JunRu/g,"智俊如"); 
htmlstr=htmlstr.replace(/Zhou YuShuai/g,"周玉帅"); 
htmlstr=htmlstr.replace(/Zhu XuanWu/g,"朱玄武"); 
htmlstr=htmlstr.replace(/Zu YunDing/g,"祖云定"); 

//No.19
//AKB48
htmlstr=htmlstr.replace(/Bai RuoFei/g,"白若飞");
htmlstr=htmlstr.replace(/Bai ShiJu/g,"白世居"); 
htmlstr=htmlstr.replace(/Cai JinShu/g,"蔡金书");
htmlstr=htmlstr.replace(/Chao XuChu/g,"晁许初");
htmlstr=htmlstr.replace(/Chen GuoSheng/g,"陈国胜"); 
htmlstr=htmlstr.replace(/Chen JiXiang/g,"陈吉祥"); 
htmlstr=htmlstr.replace(/Cheng LeLe/g,"程乐乐"); 
htmlstr=htmlstr.replace(/Deng HongGen/g,"邓红根");
htmlstr=htmlstr.replace(/Deng WangSong/g,"邓王松");
htmlstr=htmlstr.replace(/Ding YuanHang/g,"丁远航"); 
htmlstr=htmlstr.replace(/Dong JiaJian/g,"董嘉健");
htmlstr=htmlstr.replace(/Duan JinPeng/g,"段金鹏"); 
htmlstr=htmlstr.replace(/Fei ZaiYu/g,"斐在雨");
htmlstr=htmlstr.replace(/Fu DaLei/g,"付大雷");
htmlstr=htmlstr.replace(/Gan Ang/g,"甘昂");
htmlstr=htmlstr.replace(/Gao HongYuan/g,"高洪渊"); 
htmlstr=htmlstr.replace(/Gong JiaQian/g,"龚家钱");
htmlstr=htmlstr.replace(/Gou QianShuo/g,"句千硕"); 
htmlstr=htmlstr.replace(/Guo Guan/g,"郭敢");
htmlstr=htmlstr.replace(/Guo YiWen/g,"郭益文");
htmlstr=htmlstr.replace(/Hong JianLei/g,"洪建磊");
htmlstr=htmlstr.replace(/Hua HaiBin/g,"花海滨");
htmlstr=htmlstr.replace(/Hua ZiQian/g,"花子谦"); 
htmlstr=htmlstr.replace(/HuangFu DongHui/g,"皇甫东辉");
htmlstr=htmlstr.replace(/Jian MingFei/g,"简明非"); 
htmlstr=htmlstr.replace(/Jiang HongGang/g,"江鸿刚");
htmlstr=htmlstr.replace(/Jing XinPeng/g,"荆新朋");
htmlstr=htmlstr.replace(/Ke RuiQing/g,"柯瑞清");
htmlstr=htmlstr.replace(/Lei ChenXuan/g,"雷晨轩");
htmlstr=htmlstr.replace(/Lei GaoPeng/g,"雷高鹏"); 
htmlstr=htmlstr.replace(/Li JianGang/g,"李建刚"); 
htmlstr=htmlstr.replace(/Li MingFei/g,"李铭飞"); 
htmlstr=htmlstr.replace(/Li ShiGang/g,"李师刚");
htmlstr=htmlstr.replace(/Li YouAn/g,"李幼安"); 
htmlstr=htmlstr.replace(/Lian XiaoMing/g,"连晓明"); 
htmlstr=htmlstr.replace(/Liang JingPing/g,"梁京平");
htmlstr=htmlstr.replace(/Lin YunSheng/g,"林云升");
htmlstr=htmlstr.replace(/Lin KaiNing/g,"林凯宁"); 
htmlstr=htmlstr.replace(/Liu ShiKai /g,"刘师凯");
htmlstr=htmlstr.replace(/Long SuMin/g,"龙苏民");
htmlstr=htmlstr.replace(/Lu AnYi/g,"卢安义"); 
htmlstr=htmlstr.replace(/Ma RunZhong/g,"马润中");
htmlstr=htmlstr.replace(/Mei YuShuai/g,"梅雨帅");
htmlstr=htmlstr.replace(/Min WenKai/g,"闵闻凯"); 
htmlstr=htmlstr.replace(/Min XiaoQian/g,"闵啸乾"); 
htmlstr=htmlstr.replace(/Pan TanChao/g,"潘谭超"); 
htmlstr=htmlstr.replace(/Peng Ru/g,"朋如");
htmlstr=htmlstr.replace(/Qian Cheng/g,"钱成");
htmlstr=htmlstr.replace(/Qian XiRong/g,"千禧荣"); 
htmlstr=htmlstr.replace(/Qian XueLin/g,"钱雪麟"); 
htmlstr=htmlstr.replace(/Qiang WenJian/g,"强文剑");
htmlstr=htmlstr.replace(/Qiu DianZuo/g,"邱殿座"); 
htmlstr=htmlstr.replace(/Shi PeiZhao/g,"石沛昭"); 
htmlstr=htmlstr.replace(/Shi TianMing/g,"施天鸣"); 
htmlstr=htmlstr.replace(/Shui SanSha/g,"谁三杀");
htmlstr=htmlstr.replace(/Song LiMin/g,"宋李民");
htmlstr=htmlstr.replace(/Tai XueSen/g,"泰学森");
htmlstr=htmlstr.replace(/Tang XiLong/g,"唐希龙");
htmlstr=htmlstr.replace(/Tian XiaoNan/g,"田笑南"); 
htmlstr=htmlstr.replace(/Tie Wei/g,"铁伟");
htmlstr=htmlstr.replace(/Wang Gan/g,"王感"); 
htmlstr=htmlstr.replace(/Wang YueFei/g,"王跃飞"); 
htmlstr=htmlstr.replace(/Wei HongYang/g,"魏宏阳"); 
htmlstr=htmlstr.replace(/Weng ZeHong/g,"翁泽鸿"); 
htmlstr=htmlstr.replace(/Xiao WenJun/g,"萧文君"); 
htmlstr=htmlstr.replace(/Xiao YingJie/g,"肖英杰"); 
htmlstr=htmlstr.replace(/Xu NanXing/g,"许楠星");
htmlstr=htmlstr.replace(/Xu Tao/g,"徐韬"); 
htmlstr=htmlstr.replace(/Xue DeQun/g,"薛德群"); 
htmlstr=htmlstr.replace(/Yan YuanJi/g,"严元吉");
htmlstr=htmlstr.replace(/Yang GuanXi/g,"杨冠希"); 
htmlstr=htmlstr.replace(/Ye Ke/g,"野可");
htmlstr=htmlstr.replace(/Ye ShuFeng/g,"叶庶峰"); 
htmlstr=htmlstr.replace(/Ying RenJie/g,"应人杰");
htmlstr=htmlstr.replace(/Yu ChenJun/g,"余晨军");
htmlstr=htmlstr.replace(/Yu YaDong/g,"于亚东"); 
htmlstr=htmlstr.replace(/Zeng XingLiang/g,"曾兴亮"); 
htmlstr=htmlstr.replace(/Zhai Ming/g,"翟明"); 
htmlstr=htmlstr.replace(/Zhao BiDe/g,"赵璧德");
htmlstr=htmlstr.replace(/Zhao ChenHui/g,"赵辰晖"); 
htmlstr=htmlstr.replace(/Zhao YuDao/g,"赵宇道");
htmlstr=htmlstr.replace(/Zhao YunDao/g,"赵云到"); 
htmlstr=htmlstr.replace(/Zhen NingTao/g,"贞宁涛");
htmlstr=htmlstr.replace(/Zheng HanYu/g,"郑涵余");
htmlstr=htmlstr.replace(/Zheng XiJie/g,"郑希杰");
htmlstr=htmlstr.replace(/Zheng YunQi/g,"郑允奇"); 
htmlstr=htmlstr.replace(/Zhong ZhiYi/g,"钟志毅"); 
htmlstr=htmlstr.replace(/Zhou HuiKang/g,"周惠康"); 
htmlstr=htmlstr.replace(/Zhou ZiYao/g,"周自姚");
htmlstr=htmlstr.replace(/Zhu DeLun/g,"朱德伦");
htmlstr=htmlstr.replace(/Zhu YunLong/g,"朱云龙");


//No.20
//飞翔鸟
htmlstr=htmlstr.replace(/Shu HuaiDe/g,"舒怀德"); 
htmlstr=htmlstr.replace(/Fu JiaoShou/g,"伏叫兽");
htmlstr=htmlstr.replace(/Li XiaoPing/g,"李小平");
htmlstr=htmlstr.replace(/Liao YuHao/g,"廖禹豪");
htmlstr=htmlstr.replace(/Cui JunJie/g,"崔俊杰");
htmlstr=htmlstr.replace(/Wang MingZe/g,"王明泽");
htmlstr=htmlstr.replace(/She BangWei/g,"佘邦威");
htmlstr=htmlstr.replace(/Du ZhenZhong/g,"杜震忠");
htmlstr=htmlstr.replace(/Qiao YiDa/g,"乔益达");
htmlstr=htmlstr.replace(/Chen Dun/g,"陈盾");
htmlstr=htmlstr.replace(/Meng XiaoMa/g,"孟小马");
htmlstr=htmlstr.replace(/Bian LiQin/g,"边立勤");
htmlstr=htmlstr.replace(/Li YuXi/g,"李玉溪");
htmlstr=htmlstr.replace(/Lai PengQiang/g,"赖鹏强");
htmlstr=htmlstr.replace(/Liu XueJun/g,"刘学军");
htmlstr=htmlstr.replace(/Zhou LeiLei/g,"周雷雷");
htmlstr=htmlstr.replace(/Guo XiRui/g,"郭喜瑞");
htmlstr=htmlstr.replace(/Zhou LinKai/g,"周林楷");
htmlstr=htmlstr.replace(/Wang YaoDong/g,"王耀东");
htmlstr=htmlstr.replace(/Mao RongZe/g,"毛荣泽");
htmlstr=htmlstr.replace(/Niu XiaoFu/g,"牛小福");
htmlstr=htmlstr.replace(/Liang GuoPin/g,"梁国品");
htmlstr=htmlstr.replace(/Song GuoNing/g,"宋国宁");
htmlstr=htmlstr.replace(/Jian MuSheng/g,"简沐笙");
htmlstr=htmlstr.replace(/Ye LiMing/g,"夜里明");
htmlstr=htmlstr.replace(/Zhong ChiMing/g,"钟驰明");
htmlstr=htmlstr.replace(/Che HongZhi/g,"车鸿志");
htmlstr=htmlstr.replace(/Zhou JinQian/g,"周金钱");

//No.21
//喜洋洋
htmlstr=htmlstr.replace(/Bao RuiHua/g,"包瑞华");
htmlstr=htmlstr.replace(/Bao ShiJie/g,"保时捷");
htmlstr=htmlstr.replace(/Cheng ChangFeng/g,"程常锋");
htmlstr=htmlstr.replace(/Du WeiJie/g,"杜韦杰");
htmlstr=htmlstr.replace(/Gao MingGang/g,"高明刚");
htmlstr=htmlstr.replace(/GongSun AiMin/g,"公孙艾闵");
htmlstr=htmlstr.replace(/He WenChao/g,"何文超");
htmlstr=htmlstr.replace(/Jiang ZhiMing/g,"江智明");
htmlstr=htmlstr.replace(/Kang ChaoBo/g,"康朝博");
htmlstr=htmlstr.replace(/Li XiaoHu/g,"李小虎");
htmlstr=htmlstr.replace(/Lu GuoJie/g,"陆国杰");
htmlstr=htmlstr.replace(/Mu YiHu/g,"穆一虎");
htmlstr=htmlstr.replace(/Shu Qi/g,"舒淇");
htmlstr=htmlstr.replace(/Song Huo/g,"怂货");
htmlstr=htmlstr.replace(/Tang YouXun/g,"唐佑逊");
htmlstr=htmlstr.replace(/Zhan JinTong/g,"战金童");
htmlstr=htmlstr.replace(/Zhang LinPeng/g,"张琳芃");

//No.22
//悠悠小仙姑
htmlstr=htmlstr.replace(/Fu WenWei/g,"符文卫");
htmlstr=htmlstr.replace(/Guo HuWei/g,"郭虎威");
htmlstr=htmlstr.replace(/Qiu QiPeng/g,"裘奇蓬");

//No.23
//Super-inter
htmlstr=htmlstr.replace(/Chu XiongWei/g,"楚雄伟");
htmlstr=htmlstr.replace(/Liang ShuSheng/g,"梁舒声");
htmlstr=htmlstr.replace(/Ou BoQiang/g,"欧博强");
htmlstr=htmlstr.replace(/Wang BaoRen/g,"王宝仁");
htmlstr=htmlstr.replace(/Wu XiRui/g,"吴溪睿");
htmlstr=htmlstr.replace(/Xie XuanQi/g,"谢炫七");
htmlstr=htmlstr.replace(/Yue ChangQing/g,"岳长青");
htmlstr=htmlstr.replace(/Yun YuanHang/g,"云源航");
htmlstr=htmlstr.replace(/Zhang BingJie/g,"张兵杰");
htmlstr=htmlstr.replace(/Zhang ShouCheng/g,"张守诚");
htmlstr=htmlstr.replace(/ZhuGe WeiSheng/g,"诸葛伟胜");

//No.24 
//Blood Raiders
//ID：4187485
htmlstr=htmlstr.replace(/Bian ChenGuang/g,"卞晨光");
htmlstr=htmlstr.replace(/Chu JinSong/g,"楚晋松");
htmlstr=htmlstr.replace(/Du XinMing/g,"杜心明");
htmlstr=htmlstr.replace(/Fu FeiFei/g,"傅非飞");
htmlstr=htmlstr.replace(/Gao HaoRan/g,"高浩然");
htmlstr=htmlstr.replace(/Hao MinBo/g,"郝珉博");
htmlstr=htmlstr.replace(/Huang DiFan/g,"黄狄凡");
htmlstr=htmlstr.replace(/Ji LuoGen/g,"季罗根");
htmlstr=htmlstr.replace(/Ke JinQing/g,"柯晋卿");
htmlstr=htmlstr.replace(/Li ShiLei/g,"黎世磊");
htmlstr=htmlstr.replace(/Long YuWei/g,"龙禹威");
htmlstr=htmlstr.replace(/Lu NingYuan/g,"陆宁远");
htmlstr=htmlstr.replace(/Mao HongGang/g,"毛洪刚");
htmlstr=htmlstr.replace(/Niu ChengRui/g,"牛承瑞");
htmlstr=htmlstr.replace(/Pang FengFeng/g,"庞丰锋");
htmlstr=htmlstr.replace(/Qiu DaYu/g,"邱大鱼"); 
htmlstr=htmlstr.replace(/Qu HongXuan/g,"曲鸿轩");
htmlstr=htmlstr.replace(/Ran ZhuoXi/g,"冉卓溪");
htmlstr=htmlstr.replace(/Tan GuoYao/g,"谭国耀");
htmlstr=htmlstr.replace(/Wu Bing/g,"武冰");
htmlstr=htmlstr.replace(/Xi HongPing/g,"奚洪平");
htmlstr=htmlstr.replace(/Xu KaiRen/g,"徐凯仁");
htmlstr=htmlstr.replace(/Xuan GuangXin/g,"轩光信");
htmlstr=htmlstr.replace(/Yan ShouWu/g,"严寿武");
htmlstr=htmlstr.replace(/Yan ZiZhou/g,"燕子洲");
htmlstr=htmlstr.replace(/Yu ZhiZhi/g,"于致志");
htmlstr=htmlstr.replace(/Zhang ChuiChui/g,"张吹炊");
htmlstr=htmlstr.replace(/Zhong YingHui/g,"钟颍辉");


//No.25
//蝎子足球-潘公子
//ID：2748735

htmlstr=htmlstr.replace(/Cao '艹欲宫' YuGong|Cao YuGong/g,"曹御恭");
htmlstr=htmlstr.replace(/Christoffer 'C罗' Fuglesang|Christoffer Fuglesang/g,"Christoffer Fuglesang");
htmlstr=htmlstr.replace(/Fang '放羊羊' YangYang|Fang YangYang/g,"方洋洋");
htmlstr=htmlstr.replace(/Gavin '拉姆塞' Gascoigne|Gavin Gascoigne/g,"Gavin Gascoigne");
htmlstr=htmlstr.replace(/Luo '罗桂山' GuiShan|Luo GuiShan/g,"罗桂山");
htmlstr=htmlstr.replace(/Pei '伞队' Wei|Pei Wei/g,"裴威");
htmlstr=htmlstr.replace(/Ruaridh '达格利什' Dunwoodie|Ruaridh Dunwoodie/g,"Ruaridh Dunwoodie");
htmlstr=htmlstr.replace(/Sulkhan '萨内' Dadesheli|Sulkhan Dadesheli/g,"Sulkhan Dadesheli");
htmlstr=htmlstr.replace(/Thomas '托马斯' Svan|Thomas Svan/g,"Thomas Svan");
htmlstr=htmlstr.replace(/Wang '王贱凯' JianKai|Wang JianKai/g,"王健凯");
htmlstr=htmlstr.replace(/Yu '梅克斯' YueHan|Yu YueHan/g,"于越涵");
htmlstr=htmlstr.replace(/Yu '梅克斯' YueHan|Yu YueHan/g,"于越涵");
htmlstr=htmlstr.replace(/Zheng '潇洒哥' XuWei|Zheng XuWei/g,"郑旭威");
htmlstr=htmlstr.replace(/Zhuo '神舟' ShenZhou|Zhuo ShenZhou/g,"卓神舟");

//ID：4202000
//No.26
//梅麓星空
htmlstr=htmlstr.replace(/Cao MingYue/g,"曹明乐");
htmlstr=htmlstr.replace(/Cui ChuGui/g,"崔楚贵");
htmlstr=htmlstr.replace(/Dai PeiPei/g,"戴培培");
htmlstr=htmlstr.replace(/Di ZhiLin/g,"狄志林");
htmlstr=htmlstr.replace(/DongFang DaYu/g,"东方大宇");
htmlstr=htmlstr.replace(/Ge ZhenMing/g,"葛振明");
htmlstr=htmlstr.replace(/Guo RongJiang/g,"郭荣江");
htmlstr=htmlstr.replace(/Hou YunChang/g,"侯云长");
htmlstr=htmlstr.replace(/Ji HongBing/g,"纪宏秉");
htmlstr=htmlstr.replace(/Jian YinJie/g,"简尹杰");
htmlstr=htmlstr.replace(/Jiang KaiQin/g,"蒋凯勤");
htmlstr=htmlstr.replace(/Lang ShiZhang/g,"郎仕璋");
htmlstr=htmlstr.replace(/Li HuiSheng/g,"李辉胜");
htmlstr=htmlstr.replace(/Liu GaoYang/g,"刘高扬");
htmlstr=htmlstr.replace(/Lu XiaoHan/g,"鹿小晗");
htmlstr=htmlstr.replace(/Luo YongZhen/g,"罗永真");
htmlstr=htmlstr.replace(/Ma YanCheng/g,"马彦成");
htmlstr=htmlstr.replace(/Mu ShiJie/g,"穆世杰");
htmlstr=htmlstr.replace(/Rao GongShao/g,"饶功韶");
htmlstr=htmlstr.replace(/Ruan HuiFeng/g,"阮慧峰");
htmlstr=htmlstr.replace(/Shi ChenYi/g,"石晨义");
htmlstr=htmlstr.replace(/Tang HanChao/g,"唐汉超");
htmlstr=htmlstr.replace(/Tian RongKai/g,"田荣凯");
htmlstr=htmlstr.replace(/Tong FengMing/g,"佟凤鸣");
htmlstr=htmlstr.replace(/Tsang Tsolin/g,"臧卓林");
htmlstr=htmlstr.replace(/Wang ZheHao/g,"王哲昊");
htmlstr=htmlstr.replace(/Xu MingQuan/g,"许明权");
htmlstr=htmlstr.replace(/Yang ZuDe/g,"杨祖德");
htmlstr=htmlstr.replace(/Ye ZenKai/g,"叶㻸恺");
htmlstr=htmlstr.replace(/Yu Hunghui/g,"于洪辉");
htmlstr=htmlstr.replace(/Zhong RongKai/g,"钟镕锴");
htmlstr=htmlstr.replace(/Zhou YuanSheng/g,"周远生");
htmlstr=htmlstr.replace(/ZhuGe HongGang/g,"诸葛洪刚");


//No.27
//福建中天FC
//ID:
htmlstr=htmlstr.replace(/Dai YiHu/g,"戴伊虎");
htmlstr=htmlstr.replace(/Du ShiZhao/g,"杜石昭");
htmlstr=htmlstr.replace(/Fei JingRen/g,"费景仁");
htmlstr=htmlstr.replace(/Fu XiangXian/g,"傅祥贤");
htmlstr=htmlstr.replace(/Gong ShiKai/g,"龚世凯"); 
htmlstr=htmlstr.replace(/Hong DaYu/g,"洪大羽");
htmlstr=htmlstr.replace(/Jian YingJie/g,"简英杰");
htmlstr=htmlstr.replace(/Jiang JiaQiang/g,"蒋嘉强");
htmlstr=htmlstr.replace(/Jiang YiFeng/g,"江逸风"); 
htmlstr=htmlstr.replace(/Li ZhiNing/g,"李志宁"); 
htmlstr=htmlstr.replace(/Lv GuangLin/g,"吕广林");
htmlstr=htmlstr.replace(/Ma JiongWen/g,"马炅文");
htmlstr=htmlstr.replace(/Shi YaTao/g,"石亚涛");
htmlstr=htmlstr.replace(/Tan DongYa/g,"谭东亚");
htmlstr=htmlstr.replace(/Wan ZaiYu/g,"万载羽");
htmlstr=htmlstr.replace(/Weng YuJie/g,"翁羽杰");
htmlstr=htmlstr.replace(/Wu SuZheng/g,"吴苏正"); 
htmlstr=htmlstr.replace(/Xie JianJun/g,"谢剑钧"); 
htmlstr=htmlstr.replace(/Ye EnHua/g,"叶恩华"); 
htmlstr=htmlstr.replace(/Ye Qi/g,"叶齐");
htmlstr=htmlstr.replace(/Ying ChangLe/g,"赢长乐");
htmlstr=htmlstr.replace(/Zeng TengLong/g,"曾腾龙");
htmlstr=htmlstr.replace(/Zhang QiongZhong/g,"章琼忠");
htmlstr=htmlstr.replace(/Zhao ZhiKang/g,"赵志康"); 
htmlstr=htmlstr.replace(/Zhi XingYan/g,"智兴岩"); 
htmlstr=htmlstr.replace(/Zhu YunLong/g,"朱云龙");
htmlstr=htmlstr.replace(/Zong DaMing/g,"宗达名");
htmlstr=htmlstr.replace(/Zou JiuZhang/g,"邹玖章");


//28
//根宝足球训练基地
htmlstr=htmlstr.replace(/An WeiWei/g,"安韦玮");

//No.29
//SnowyTown
htmlstr=htmlstr.replace(/Bu YiGuang/g,"卜一光");
htmlstr=htmlstr.replace(/Chao HouLin/g,"晁后邻");
htmlstr=htmlstr.replace(/Chu LiZe/g,"褚利泽");
htmlstr=htmlstr.replace(/Dong MeiYu/g,"董美玉");
htmlstr=htmlstr.replace(/Du PinQuan/g,"杜品荃");
htmlstr=htmlstr.replace(/Gao Gang/g,"高岗");
htmlstr=htmlstr.replace(/Ge ZhiLu/g,"葛志璐");
htmlstr=htmlstr.replace(/GongSun ZhaoShun/g,"公孙昭顺");
htmlstr=htmlstr.replace(/Gui YunFeng/g,"桂云峰");
htmlstr=htmlstr.replace(/He ZhongYou/g,"贺忠友");
htmlstr=htmlstr.replace(/Hong JianYe/g,"洪建业");
htmlstr=htmlstr.replace(/Hou JiuTao/g,"侯久涛");
htmlstr=htmlstr.replace(/Huo MengGu/g,"霍猛故"); 
htmlstr=htmlstr.replace(/Jia JingYang/g,"贾京阳");
htmlstr=htmlstr.replace(/Jian EnHua/g,"简恩华");
htmlstr=htmlstr.replace(/Lai GuangNan/g,"赖光楠");
htmlstr=htmlstr.replace(/Li BoRui/g,"李柏瑞");
htmlstr=htmlstr.replace(/LiYang De/g,"李阳德");
htmlstr=htmlstr.replace(/Liang ZiHeng/g,"梁子恒");
htmlstr=htmlstr.replace(/Liao XiangTao/g,"廖祥涛");
htmlstr=htmlstr.replace(/Luo YanKai/g,"罗颜开");
htmlstr=htmlstr.replace(/Nong An/g,"农安");
htmlstr=htmlstr.replace(/Ou Cheng/g,"欧城");
htmlstr=htmlstr.replace(/Ou JunNan/g,"欧俊男");
htmlstr=htmlstr.replace(/Qian TingRui/g,"钱庭瑞");
htmlstr=htmlstr.replace(/Qiao Da/g,"乔大");
htmlstr=htmlstr.replace(/Shao HanWen/g,"邵汉文");
htmlstr=htmlstr.replace(/Shen GuangQi/g,"沈光奇");
htmlstr=htmlstr.replace(/Shu GuangZhong/g,"舒光忠");
htmlstr=htmlstr.replace(/Shui ShengYuan/g,"水生源");
htmlstr=htmlstr.replace(/Si ZhaoYao/g,"司照耀");
htmlstr=htmlstr.replace(/Sun ShiDuo/g,"孙士多");
htmlstr=htmlstr.replace(/Tang YongBo/g,"汤勇博");
htmlstr=htmlstr.replace(/Wan JinShan/g,"万金山");
htmlstr=htmlstr.replace(/Wang DongLiang/g,"王栋梁");
htmlstr=htmlstr.replace(/Wang XueRui/g,"王雪芮");
htmlstr=htmlstr.replace(/Wei JiaJu/g,"魏家驹");
htmlstr=htmlstr.replace(/Wu Yue/g,"吴越");
htmlstr=htmlstr.replace(/Xu YongHuai/g,"徐勇怀");
htmlstr=htmlstr.replace(/Yang DongJie/g,"杨东杰");
htmlstr=htmlstr.replace(/Ye XiaoPeng/g,"叶霄鹏");
htmlstr=htmlstr.replace(/You HaiQing/g,"游海清");
htmlstr=htmlstr.replace(/Yu Guang/g,"余光");
htmlstr=htmlstr.replace(/Zhai Xun/g,"翟寻");
htmlstr=htmlstr.replace(/Zhang GengYang/g,"张耿阳");
htmlstr=htmlstr.replace(/Zhang XinJie/g,"张新杰");
htmlstr=htmlstr.replace(/Zhang ZhenYang/g,"张震杨");
htmlstr=htmlstr.replace(/Zhang ZhiNing/g,"张志宁");
htmlstr=htmlstr.replace(/Zou QiChen/g,"邹启晨");
htmlstr=htmlstr.replace(/Zou YingChun/g,"邹迎春");


//No.30 
//蓝调火花 
htmlstr=htmlstr.replace(/Arnold Elder/g,"阿诺德·艾尔德");
htmlstr=htmlstr.replace(/Bu ChangHao/g,"卜昌浩");
htmlstr=htmlstr.replace(/Bu ShengJiong/g,"卜圣炅");
htmlstr=htmlstr.replace(/Chen JinLong/g,"陈金龙"); 
htmlstr=htmlstr.replace(/Cheuk Fei Hau/g,"楚飞花");
htmlstr=htmlstr.replace(/Di HouYong/g,"狄侯勇");
htmlstr=htmlstr.replace(/Fábio Da Silva/g,"法比奥·达·席尔瓦"); 
htmlstr=htmlstr.replace(/Gu ChuLiang/g,"顾楚良"); 
htmlstr=htmlstr.replace(/Gu MinWei/g,"顾明伟");
htmlstr=htmlstr.replace(/Huang Rui/g,"黄瑞"); 
htmlstr=htmlstr.replace(/Huo XiJie/g,"霍希杰"); 
htmlstr=htmlstr.replace(/Jia LuChen/g,"贾璐晨"); 
htmlstr=htmlstr.replace(/Li HongGang/g,"李洪刚"); 
htmlstr=htmlstr.replace(/Lin JunJie/g,"林俊杰"); 
htmlstr=htmlstr.replace(/Lin ShuFeng/g,"林澍风");
htmlstr=htmlstr.replace(/Luo YunDing/g,"罗云鼎"); 
htmlstr=htmlstr.replace(/Meng XiaoTian/g,"孟小天"); 
htmlstr=htmlstr.replace(/Mu ChenSong/g,"慕辰松");
htmlstr=htmlstr.replace(/Pan DaMing/g,"潘达明"); 
htmlstr=htmlstr.replace(/Qu Si/g,"曲肆"); 
htmlstr=htmlstr.replace(/Ren QiuMing/g,"任秋明");
htmlstr=htmlstr.replace(/Shu JiaJie/g,"舒佳杰");
htmlstr=htmlstr.replace(/Song KaiMing/g,"宋凯明"); 
htmlstr=htmlstr.replace(/Su XingHan/g,"苏星瀚");
htmlstr=htmlstr.replace(/Tian YuJing/g,"田玉静"); 
htmlstr=htmlstr.replace(/Tong WuLian/g,"童武莲");
htmlstr=htmlstr.replace(/Xi WenQiang/g,"习文强"); 
htmlstr=htmlstr.replace(/Xun LeiLuo/g,"寻雷落");
htmlstr=htmlstr.replace(/Yan HuiLiang/g,"闫慧良");
htmlstr=htmlstr.replace(/Yang HuiPing/g,"杨慧平"); 
htmlstr=htmlstr.replace(/Yin Shi/g,"隐士");
htmlstr=htmlstr.replace(/Yunis Al Mouataz/g,"尤尼斯·爱·蒙塔斯"); 
htmlstr=htmlstr.replace(/Zhao ZeXiang/g,"赵泽翔");
htmlstr=htmlstr.replace(/Zhong JinYuan/g,"钟金元"); 
htmlstr=htmlstr.replace(/Zhou WuKong/g,"周悟空");


//No.31 
//福州泰然 
htmlstr=htmlstr.replace(/Bian JiaKang/g,"卞加康"); 
htmlstr=htmlstr.replace(/Ding XiaoXin/g,"丁晓昕"); 
htmlstr=htmlstr.replace(/Fei YuanDong/g,"费源东"); 
htmlstr=htmlstr.replace(/Gan ChangQing/g,"甘长青"); 
htmlstr=htmlstr.replace(/Gao ZiTeng/g,"高梓腾"); 
htmlstr=htmlstr.replace(/Geng ShenZhou/g,"耿胜周"); 
htmlstr=htmlstr.replace(/Hua GuiYan/g,"华归雁"); 
htmlstr=htmlstr.replace(/Jia XiaoTian/g,"贾晓天"); 
htmlstr=htmlstr.replace(/Jiao DongDong/g,"胶东东"); 
htmlstr=htmlstr.replace(/Li XingHui/g,"李星辉"); 
htmlstr=htmlstr.replace(/Luo JunLing/g,"洛筠凌"); 
htmlstr=htmlstr.replace(/Peng ZiLong/g,"鹏子龙"); 
htmlstr=htmlstr.replace(/Qi YaoTong/g,"齐遥桐"); 
htmlstr=htmlstr.replace(/Tong TianLe/g,"同天乐"); 
htmlstr=htmlstr.replace(/Tu Bai/g,"涂拜"); 
htmlstr=htmlstr.replace(/Weng GenGen/g,"翁根根"); 
htmlstr=htmlstr.replace(/Xian MeiYan/g,"冼梅雁"); 
htmlstr=htmlstr.replace(/Zhan YueSheng/g,"占越胜"); 
htmlstr=htmlstr.replace(/Zhang WenKai/g,"张文凯"); 
htmlstr=htmlstr.replace(/ZhangLiang XiYan/g,"张梁西彦"); 
htmlstr=htmlstr.replace(/Zhao ZuoLin/g,"赵作霖"); 
htmlstr=htmlstr.replace(/Zheng HengShan/g,"正恒山"); 
htmlstr=htmlstr.replace(/Zheng XiGuang/g,"郑熙广"); 
htmlstr=htmlstr.replace(/Zhou JingRen/g,"周惊人"); 
htmlstr=htmlstr.replace(/Zhou JingRen/g,"周景仁"); 

//No.32 
//福州智衡 
htmlstr=htmlstr.replace(/Chen XueFei/g,"陈雪飞"); 
htmlstr=htmlstr.replace(/Chen YinXian/g,"陈寅现"); 
htmlstr=htmlstr.replace(/Ching-Ying Noh/g,"卢称㑞"); 
htmlstr=htmlstr.replace(/Chu DaLei/g,"楚大磊"); 
htmlstr=htmlstr.replace(/Dai XinLei/g,"戴鑫磊"); 
htmlstr=htmlstr.replace(/Dai ZongXian/g,"戴宗宪"); 
htmlstr=htmlstr.replace(/Dong HaiDong/g,"董海东"); 
htmlstr=htmlstr.replace(/Du XinJie/g,"杜鑫杰"); 
htmlstr=htmlstr.replace(/Fu KeJing/g,"傅柯景"); 
htmlstr=htmlstr.replace(/Gao ZhiGang/g,"高志刚"); 
htmlstr=htmlstr.replace(/Guo QiTeng/g,"郭启腾"); 
htmlstr=htmlstr.replace(/He Rui/g,"何睿"); 
htmlstr=htmlstr.replace(/Hua YingXiong/g,"华英雄"); 
htmlstr=htmlstr.replace(/Izidor Zachar/g,"伊兹多尔·扎查尔"); 
htmlstr=htmlstr.replace(/Liao YuXiang/g,"廖宇翔"); 
htmlstr=htmlstr.replace(/Liang TaoMao/g,"梁涛茂"); 
htmlstr=htmlstr.replace(/Lin ShuBao/g,"林书宝"); 
htmlstr=htmlstr.replace(/Lin ShuoCheng/g,"林烁诚"); 
htmlstr=htmlstr.replace(/Lin YaBin/g,"林亚滨"); 
htmlstr=htmlstr.replace(/Lin YaNing/g,"林亚宁"); 
htmlstr=htmlstr.replace(/Lin ZhiBiao/g,"林志彪"); 
htmlstr=htmlstr.replace(/Luan WeiZhuo/g,"栾伟卓"); 
htmlstr=htmlstr.replace(/Ma LongPing/g,"马隆凭"); 
htmlstr=htmlstr.replace(/Mao JiHai/g,"毛济海"); 
htmlstr=htmlstr.replace(/Mao WeiZhuang/g,"毛炜庄"); 
htmlstr=htmlstr.replace(/Milijan Kadirić/g,"米利扬·卡迪里奇"); 
htmlstr=htmlstr.replace(/Ni HuiLiang/g,"倪辉梁"); 
htmlstr=htmlstr.replace(/Pan ZeDong/g,"潘则冬"); 
htmlstr=htmlstr.replace(/Peng ChuYue/g,"彭楚越"); 
htmlstr=htmlstr.replace(/Petros Mavrias/g,"彼得斯·马夫里亚斯"); 
htmlstr=htmlstr.replace(/Qian ZheXuan/g,"钱哲轩"); 
htmlstr=htmlstr.replace(/Sang LinRui/g,"桑林瑞"); 
htmlstr=htmlstr.replace(/Shen MingYi/g,"沈明义"); 
htmlstr=htmlstr.replace(/Shi ChuSheng/g,"石楚生"); 
htmlstr=htmlstr.replace(/Shi ShiKai/g,"石世凯"); 
htmlstr=htmlstr.replace(/Su MingZe/g,"苏铭泽"); 
htmlstr=htmlstr.replace(/Tan AnRui/g,"谭安睿"); 
htmlstr=htmlstr.replace(/Tang ZeZhou/g,"唐泽洲"); 
htmlstr=htmlstr.replace(/Tu DongJian/g,"涂东健"); 
htmlstr=htmlstr.replace(/Wang DaLei/g,"王大雷"); 
htmlstr=htmlstr.replace(/Wang YaoZu/g,"王耀祖"); 
htmlstr=htmlstr.replace(/Wang YouCai/g,"王幼才"); 
htmlstr=htmlstr.replace(/Wen ShaoGu/g,"文绍古"); 
htmlstr=htmlstr.replace(/Wu ShuoCheng/g,"吴朔程"); 
htmlstr=htmlstr.replace(/Yan Chao/g,"严超"); 
htmlstr=htmlstr.replace(/Ye ChenBo/g,"叶辰波"); 
htmlstr=htmlstr.replace(/You DuXu/g,"尤笃旭"); 
htmlstr=htmlstr.replace(/Yu GuiShan/g,"于桂山"); 
htmlstr=htmlstr.replace(/Yu YongYong/g,"于勇勇"); 
htmlstr=htmlstr.replace(/Zhai WenJing/g,"翟文靖"); 
htmlstr=htmlstr.replace(/Zhao ZhaoJing/g,"赵昭景"); 
htmlstr=htmlstr.replace(/Zhang WenHai/g,"张文海"); 
htmlstr=htmlstr.replace(/Zheng MaoMao/g,"郑茂茂"); 
htmlstr=htmlstr.replace(/Zheng PeiSi/g,"郑佩斯"); 
htmlstr=htmlstr.replace(/Zhong JiBin/g,"钟继斌"); 
htmlstr=htmlstr.replace(/Zhong YiDe/g,"钟毅德"); 
htmlstr=htmlstr.replace(/Zhou Lei/g,"周雷"); 
htmlstr=htmlstr.replace(/Zhou ShiPing/g,"周世平"); 
htmlstr=htmlstr.replace(/Zhu JunBiao/g,"朱骏彪"); 
htmlstr=htmlstr.replace(/Zhu ZhenYu/g,"朱镇宇"); 
htmlstr=htmlstr.replace(/Zhuang XiaoMi/g,"庄晓弥");


//No.33
//青岛黄海
htmlstr=htmlstr.replace(/Shu ShuangBang/g,"舒双邦");
htmlstr=htmlstr.replace(/Xu XiangChuang/g,"徐向闯");
htmlstr=htmlstr.replace(/Musgu Bigo/g,"玛斯古·宾狗");
htmlstr=htmlstr.replace(/Nie ZhuoRan/g,"聂卓然");
htmlstr=htmlstr.replace(/Luan JunSheng/g,"栾俊生");

//No.34
//迷途小球童
htmlstr=htmlstr.replace(/Cao XinZhi/g,"曹馨之"); 
htmlstr=htmlstr.replace(/De'ron Powell/g,"德朗·鲍威尔"); 
htmlstr=htmlstr.replace(/Günther Selinger/g,"甘瑟·塞林格"); 
htmlstr=htmlstr.replace(/Hu YaZhao/g,"胡亚朝"); 
htmlstr=htmlstr.replace(/Li ZeTao/g,"李泽涛"); 
htmlstr=htmlstr.replace(/Lin Shou/g,"林寿"); 
htmlstr=htmlstr.replace(/Liu LiMing/g,"刘利明"); 
htmlstr=htmlstr.replace(/Liu YaoDong/g,"刘耀东"); 
htmlstr=htmlstr.replace(/Lu JiaChen/g,"卢佳辰");
htmlstr=htmlstr.replace(/Luo PengXiang/g,"罗鹏翔"); 
htmlstr=htmlstr.replace(/Mohamed Hamdoud/g,"穆罕默德·哈姆杜德"); 
htmlstr=htmlstr.replace(/Niu ShaoNan/g,"牛少楠"); 
htmlstr=htmlstr.replace(/Paul Banica/g,"保罗·巴尼卡"); 
htmlstr=htmlstr.replace(/Ren ChengDe/g,"任成德"); 
htmlstr=htmlstr.replace(/Shan ZhuoYi/g,"单卓义"); 
htmlstr=htmlstr.replace(/Shi GongQing/g,"石功青"); 
htmlstr=htmlstr.replace(/Shu YiJi/g,"书一击"); 
htmlstr=htmlstr.replace(/Shu YueFeng/g,"舒岳峰"); 
htmlstr=htmlstr.replace(/Tian TaoMao/g,"田涛茂"); 
htmlstr=htmlstr.replace(/Wang ShuXiao/g,"王书晓"); 
htmlstr=htmlstr.replace(/Wen JinHuang/g,"文金黄"); 
htmlstr=htmlstr.replace(/Wu JiangHui/g,"吴江辉"); 
htmlstr=htmlstr.replace(/Zhao ShiKai/g,"赵世开"); 
htmlstr=htmlstr.replace(/Zheng ZhiWei/g,"郑智威"); 
htmlstr=htmlstr.replace(/Zhuang XiaoPing/g,"庄小平"); 
htmlstr=htmlstr.replace(/Zu YuanAn/g,"祖元安"); 

//No.35
//湖南楚灵
htmlstr=htmlstr.replace(/Anatoliy Malkovich/g,"安纳托利·马尔科维奇");
htmlstr=htmlstr.replace(/Cen ZhuoXiang/g,"岑啄祥");
htmlstr=htmlstr.replace(/Fang TaiLan/g,"方泰岚");
htmlstr=htmlstr.replace(/Ge ZhiGuo/g,"葛治国");
htmlstr=htmlstr.replace(/Geng ZhongZhong/g,"耿仲忠");
htmlstr=htmlstr.replace(/Giuseppe Giordan/g,"朱塞佩·乔丹");
htmlstr=htmlstr.replace(/Jiang WeiFei/g,"蒋魏霏");
htmlstr=htmlstr.replace(/Kjell Sunde Strøm/g,"凯尔·森德·斯特罗姆");
htmlstr=htmlstr.replace(/Kong YanQiang/g,"孔彦强");
htmlstr=htmlstr.replace(/Li MingYan/g,"黎明言");
htmlstr=htmlstr.replace(/Li XiaoBin/g,"李晓宾");
htmlstr=htmlstr.replace(/Li YiXiang/g,"李亦襄");
htmlstr=htmlstr.replace(/LiuSu HanYu/g,"刘苏涵予");
htmlstr=htmlstr.replace(/LiuSu ZhengXue/g,"刘苏征月");
htmlstr=htmlstr.replace(/Lou RiHua/g,"娄日华");
htmlstr=htmlstr.replace(/Lu DiDi/g,"陆迪迪");
htmlstr=htmlstr.replace(/Luo SongRong/g,"罗松荣");
htmlstr=htmlstr.replace(/Mu ZhongXun/g,"牧众勋");
htmlstr=htmlstr.replace(/MuRong KaiHong/g,"慕容凯虹");
htmlstr=htmlstr.replace(/Qiao MoYi/g,"乔墨衣");
htmlstr=htmlstr.replace(/Shen NiMa/g,"沈尼玛");
htmlstr=htmlstr.replace(/Sang YiCong/g,"桑义聪");
htmlstr=htmlstr.replace(/Sun JiaHao/g,"孙家豪");
htmlstr=htmlstr.replace(/Wang DaBao/g,"王大宝");
htmlstr=htmlstr.replace(/Wen ZhongQian/g,"闻衷谦");
htmlstr=htmlstr.replace(/Xie YunPeng/g,"谢学鹏");
htmlstr=htmlstr.replace(/Ye XiaoBin/g,"叶筱彬");
htmlstr=htmlstr.replace(/Yu WeiGuo/g,"余卫国");
htmlstr=htmlstr.replace(/Yuan Wei/g,"袁炜");
htmlstr=htmlstr.replace(/Zhong Zhi/g,"钟芷");



//No.36
//Deqing C 

htmlstr=htmlstr.replace(/Lai ZiXiang/g,"莱自香"); 
htmlstr=htmlstr.replace(/Ni ShengJie/g,"尼圣洁"); 
htmlstr=htmlstr.replace(/Zhou JinCheng/g,"周金城");
htmlstr=htmlstr.replace(/Fu ZuYao/g,"富祖瑶"); 
	
//No.37
//东莞FC
htmlstr=htmlstr.replace(/jiao zhenxun/g,"焦振勋"); 
htmlstr=htmlstr.replace(/Liang LeYuan/g,"梁乐源"); 
htmlstr=htmlstr.replace(/Qian ShouTing/g,"钱寿庭"); 
htmlstr=htmlstr.replace(/Fu WangWang/g,"付旺旺"); 
htmlstr=htmlstr.replace(/Kong BingQuan/g,"孔冰泉"); 
htmlstr=htmlstr.replace(/Zhang BinKai/g,"张冰凯"); 
htmlstr=htmlstr.replace(/Shi JiaHong/g,"石驾洪"); 
htmlstr=htmlstr.replace(/XiMen YanKai/g,"西门闫凯"); 
htmlstr=htmlstr.replace(/Fu Chong/g,"傅翀"); 
htmlstr=htmlstr.replace(/Chen HengShan/g,"陈衡山"); 
htmlstr=htmlstr.replace(/Zhao YiFan/g,"赵一帆"); 
htmlstr=htmlstr.replace(/Zhang HuiJie/g,"张慧杰"); 
htmlstr=htmlstr.replace(/Chao WenYi /g,"晁文毅"); 
htmlstr=htmlstr.replace(/Qiang HanLiang/g,"强寒凉"); 
htmlstr=htmlstr.replace(/Lu GuangYuan/g,"陆光远"); 
htmlstr=htmlstr.replace(/SiMa YiWei/g,"司马亿纬"); 
htmlstr=htmlstr.replace(/Wu ZiBo/g,"吴子博"); 
htmlstr=htmlstr.replace(/Huo ZhiLu/g,"霍志璐"); 
htmlstr=htmlstr.replace(/Ping KongMing/g,"平空明"); 
htmlstr=htmlstr.replace(/Zhang Min/g,"张闵"); 
htmlstr=htmlstr.replace(/Jin YiHan/g,"金易寒"); 
htmlstr=htmlstr.replace(/Qin YingJie/g,"秦应节"); 
htmlstr=htmlstr.replace(/Zheng YongHao/g,"郑永昊"); 
htmlstr=htmlstr.replace(/Lu JinTong/g,"路金童"); 
htmlstr=htmlstr.replace(/Feng YaJian/g,"冯涯间"); 
htmlstr=htmlstr.replace(/Hu DaLei/g,"呼大雷"); 
htmlstr=htmlstr.replace(/Zu Yao YuHao/g,"祖姚宇浩"); 




//No.38 严良贤的私人足球队
htmlstr=htmlstr.replace(/Xie ShengLong/g,"谢申龙"); 
htmlstr=htmlstr.replace(/Lei YuanPei/g,"雷元鹏");

//No.39 
//宁波包子队
htmlstr=htmlstr.replace(/Cai SenXiang/g,"蔡森祥");
htmlstr=htmlstr.replace(/Chi JianHua/g,"迟建华");
htmlstr=htmlstr.replace(/Ding JinSha/g,"丁金杀"); 
htmlstr=htmlstr.replace(/Du KeCheng/g,"杜克成");
htmlstr=htmlstr.replace(/Gu ZhuangFei/g,"古庄飞"); 
htmlstr=htmlstr.replace(/Guo YongQi/g,"郭永奇");
htmlstr=htmlstr.replace(/Huo YuanChao/g,"霍元超");
htmlstr=htmlstr.replace(/Kang BinYi/g,"康秉义");
htmlstr=htmlstr.replace(/Kang GaoJun/g,"康高俊");
htmlstr=htmlstr.replace(/Lan AiMin/g,"兰爱民");
htmlstr=htmlstr.replace(/Lei ZhengDong/g,"雷正东"); 
htmlstr=htmlstr.replace(/Li WenZhai/g,"李文斋");
htmlstr=htmlstr.replace(/Li XinKai/g,"李新凯"); 
htmlstr=htmlstr.replace(/Min HongLve/g,"闵洪略");
htmlstr=htmlstr.replace(/Pang Tai/g,"庞泰");
htmlstr=htmlstr.replace(/Qian KaiHong/g,"钱开宏");
htmlstr=htmlstr.replace(/Qian MingYi/g,"钱明一"); 
htmlstr=htmlstr.replace(/Sheng ChengXuan/g,"盛成轩");
htmlstr=htmlstr.replace(/Sun SanSha/g,"孙三沙");
htmlstr=htmlstr.replace(/Wang JianXin/g,"王建新");
htmlstr=htmlstr.replace(/Wang WenLong/g,"王文龙");
htmlstr=htmlstr.replace(/Wu YaJun/g,"吴亚军");
htmlstr=htmlstr.replace(/XiaHou YaoKun/g,"夏侯耀坤");
htmlstr=htmlstr.replace(/Xie SuYi/g,"谢苏仪");
htmlstr=htmlstr.replace(/Xu HongPing/g,"徐洪平");
htmlstr=htmlstr.replace(/Yang HuWei/g,"杨虎威");
htmlstr=htmlstr.replace(/Zhang HouLei/g,"张厚雷");
htmlstr=htmlstr.replace(/Zhang HuiYu/g,"张辉钰"); 
htmlstr=htmlstr.replace(/Zhang YuChuan/g,"张玉川");
htmlstr=htmlstr.replace(/Zhao ShuaiGang/g,"赵帅刚");
htmlstr=htmlstr.replace(/Zheng XianJi/g,"郑宪基");
htmlstr=htmlstr.replace(/Zhuang BingKai/g,"庄兵凯"); 

//No.40
//重庆山层
htmlstr=htmlstr.replace(/Bu ChenJia/g,"步辰嘉");
htmlstr=htmlstr.replace(/Bu ShiDun/g,"步仕敦");
htmlstr=htmlstr.replace(/Chen YuBin/g,"陈宇斌");
htmlstr=htmlstr.replace(/Chu Han/g,"楚汉");
htmlstr=htmlstr.replace(/Ge HouYong/g,"葛侯勇");
htmlstr=htmlstr.replace(/Han Run/g,"韩润");
htmlstr=htmlstr.replace(/Jin GuangZhong/g,"金光中");
htmlstr=htmlstr.replace(/Liang RuiChen/g,"梁睿宸");
htmlstr=htmlstr.replace(/Liu HaiGuang/g,"柳海光");
htmlstr=htmlstr.replace(/Luo Bei/g,"罗贝");
htmlstr=htmlstr.replace(/Luo GuangXin/g,"罗广欣");
htmlstr=htmlstr.replace(/Mu YuShu/g,"穆钰澍");
htmlstr=htmlstr.replace(/Qiu RuoFei/g,"邱若飞");
htmlstr=htmlstr.replace(/Qiu YuJing/g,"邱玉京");
htmlstr=htmlstr.replace(/Rao QunLi/g,"饶群立");
htmlstr=htmlstr.replace(/Ren YuanJi/g,"任元吉");
htmlstr=htmlstr.replace(/Shi JiZe/g,"石纪泽");
htmlstr=htmlstr.replace(/Shi PengCheng/g,"施鹏程");
htmlstr=htmlstr.replace(/Song JianLei/g,"宋健雷");
htmlstr=htmlstr.replace(/Xue ZhenCheng/g,"薛甄诚");
htmlstr=htmlstr.replace(/Yao JiaZe/g,"姚嘉泽");
htmlstr=htmlstr.replace(/Zhang RuiLin/g,"张瑞麟");
htmlstr=htmlstr.replace(/Zhi WenYuan/g,"治文渊");
htmlstr=htmlstr.replace(/Zhou AiHua/g,"周爱华");
	
//No.41
//温格
htmlstr=htmlstr.replace(/Ding XinChen/g,"丁歆宸");

//No.42
//北京海王星足球俱乐部
htmlstr=htmlstr.replace(/Bao Song/g,"鲍松");
htmlstr=htmlstr.replace(/Cai WeiChao/g,"蔡韦超");
htmlstr=htmlstr.replace(/Cui WangSong/g,"崔望嵩");
htmlstr=htmlstr.replace(/Fei ShiHao/g,"费世豪");
htmlstr=htmlstr.replace(/Feng YuGang/g,"冯玉刚");
htmlstr=htmlstr.replace(/Guo SuMin/g,"郭苏民");
htmlstr=htmlstr.replace(/He CangLong/g,"贺苍龙");
htmlstr=htmlstr.replace(/Hong XiaoMi/g,"AUOK洪小米");
htmlstr=htmlstr.replace(/Hu ShunCheng/g,"胡顺成");
htmlstr=htmlstr.replace(/Jiang QiTeng/g,"蒋启腾");
htmlstr=htmlstr.replace(/Josip Rudman/g,"桥西普·路德曼");
htmlstr=htmlstr.replace(/Ke YouAn/g,"柯有安");
htmlstr=htmlstr.replace(/Liao TieZhu/g,"廖铁柱");
htmlstr=htmlstr.replace(/Lin JiZe/g,"林吉泽");
htmlstr=htmlstr.replace(/Lin WenJian/g,"林文剑");
htmlstr=htmlstr.replace(/Lin XueLiang/g,"林雪亮");
htmlstr=htmlstr.replace(/Liu CunXi/g,"柳存羲");
htmlstr=htmlstr.replace(/Mao JiaLe/g,"毛家乐");
htmlstr=htmlstr.replace(/Mo CangHai/g,"莫沧海");
htmlstr=htmlstr.replace(/Mo YunPeng/g,"莫芸芃");
htmlstr=htmlstr.replace(/Mu WenZhai/g,"穆文斋");
htmlstr=htmlstr.replace(/NanGong JiaLong/g,"南宫佳龙");
htmlstr=htmlstr.replace(/Nikola Pantev/g,"尼古拉·潘德夫");
htmlstr=htmlstr.replace(/Qiao YiXun/g,"乔易迅");
htmlstr=htmlstr.replace(/Qin HuiLiang/g,"秦辉亮");
htmlstr=htmlstr.replace(/Qiu HuiSheng/g,"邱惠生");
htmlstr=htmlstr.replace(/Qiu ZiLiang/g,"丘子良");
htmlstr=htmlstr.replace(/Shan AnRui/g,"单安瑞");
htmlstr=htmlstr.replace(/Shui XianDong/g,"水贤东");
htmlstr=htmlstr.replace(/Stefanos Stamatelos/g,"斯蒂法诺斯·斯塔马特罗斯");
htmlstr=htmlstr.replace(/Tu Chuanhua/g,"屠传华");
htmlstr=htmlstr.replace(/Wang HouCheng/g,"王后塍");
htmlstr=htmlstr.replace(/Waverly Ackman/g,"韦弗利·阿克曼");
htmlstr=htmlstr.replace(/Xi Qian/g,"奚堑");
htmlstr=htmlstr.replace(/Xia JianShan/g,"夏建山");
htmlstr=htmlstr.replace(/XianYu XiaoKai/g,"鲜于小凯");
htmlstr=htmlstr.replace(/Xu ZhaoZhong/g,"许兆忠");
htmlstr=htmlstr.replace(/Yuan RongJiang/g,"袁荣江");
htmlstr=htmlstr.replace(/Zeng LinFu/g,"曾林甫");
htmlstr=htmlstr.replace(/Zhang MeiYu/g,"张梅羽");
htmlstr=htmlstr.replace(/Zhang SangChao/g,"张桑超");
htmlstr=htmlstr.replace(/Zhang You/g,"张有");
htmlstr=htmlstr.replace(/Zheng ZhuangFei/g,"郑庄飞");
htmlstr=htmlstr.replace(/Zhu YunSheng/g,"朱运生");


//No.43
//ZhengJiang GreenTown
htmlstr=htmlstr.replace(/Cheng ChunJie/g,"程纯杰"); 
htmlstr=htmlstr.replace(/Chu TianYang/g,"楚天扬"); 
htmlstr=htmlstr.replace(/He XueShi/g,"何雪诗"); 
htmlstr=htmlstr.replace(/Kang YaoFa/g,"康耀发"); 
htmlstr=htmlstr.replace(/Ke ChenXiong/g,"柯晨雄"); 
htmlstr=htmlstr.replace(/Lei YuYi/g,"雷玉义"); 
htmlstr=htmlstr.replace(/Li ZhiLi/g,"李志立");
htmlstr=htmlstr.replace(/Lian YuKun/g,"连玉琨"); 
htmlstr=htmlstr.replace(/Lin XuePeng/g,"林学鹏"); 
htmlstr=htmlstr.replace(/Liu XiangLin/g,"刘祥林"); 
htmlstr=htmlstr.replace(/Lv ChengYuan/g,"吕程远"); 
htmlstr=htmlstr.replace(/Niu HaiYuan/g,"牛海源"); 
htmlstr=htmlstr.replace(/Rao XunWei/g,"饶迅维"); 
htmlstr=htmlstr.replace(/Sha RuiZe/g,"沙瑞泽"); 
htmlstr=htmlstr.replace(/ShangGuan JianMing/g,"上官建明"); 
htmlstr=htmlstr.replace(/Song WeiSi/g,"宋伟思"); 
htmlstr=htmlstr.replace(/Tong JianFeng/g,"童剑锋"); 
htmlstr=htmlstr.replace(/Wen XueJun/g,"温学军"); 
htmlstr=htmlstr.replace(/Wu ZhiLei/g,"吴志磊"); 
htmlstr=htmlstr.replace(/Xia AiHua/g,"夏爱华"); 
htmlstr=htmlstr.replace(/Xie JinPing/g,"谢金平"); 
htmlstr=htmlstr.replace(/Yao LeiLei/g,"姚磊磊"); 
htmlstr=htmlstr.replace(/Ye CunWei/g,"叶存伟"); 
htmlstr=htmlstr.replace(/Zhang GeZhuo/g,"张歌卓"); 
htmlstr=htmlstr.replace(/Zhang XueSen/g,"张学森"); 
htmlstr=htmlstr.replace(/Zhang ZhongZhong/g,"张钟中"); 
htmlstr=htmlstr.replace(/Zhen ZongCheng/g,"甄宗成"); 
htmlstr=htmlstr.replace(/Zheng JinJiang/g,"郑锦江"); 
htmlstr=htmlstr.replace(/Zheng WenDe/g,"郑文德"); 
htmlstr=htmlstr.replace(/Zhou KaiZe/g,"周凯泽"); 
htmlstr=htmlstr.replace(/Zhu SanQiang/g,"褚三强"); 

//Chelsea FC
//No.44
htmlstr=htmlstr.replace(/Bai BoYan/g,"白博彦");
htmlstr=htmlstr.replace(/Besik Beraia/g,"贝西克·贝拉亚");
htmlstr=htmlstr.replace(/Drahoslav Špilár/g,"德拉霍斯拉夫·斯皮拉尔");
htmlstr=htmlstr.replace(/Errikos Anargyrou/g,"埃里科斯·安纳吉鲁");
htmlstr=htmlstr.replace(/Federico Vergari/g,"费代里科·维尔加里");
htmlstr=htmlstr.replace(/Gong JiaPeng/g,"龚佳鹏");
htmlstr=htmlstr.replace(/José Marcelo Arévalo/g,"何塞·马塞洛·阿雷瓦洛");
htmlstr=htmlstr.replace(/Joško Penezić/g,"约什科·佩尼西奇");
htmlstr=htmlstr.replace(/Juan Benavente/g,"胡安·贝纳文特");
htmlstr=htmlstr.replace(/Kymani Spain/g,"基曼尼·斯班");
htmlstr=htmlstr.replace(/Li HaoZe/g,"李浩泽");
htmlstr=htmlstr.replace(/Liao HaiYuan/g,"廖海源");
htmlstr=htmlstr.replace(/Mohammed Shawqi/g,"穆罕默德·肖齐");
htmlstr=htmlstr.replace(/Na YingLong/g,"那应龙");
htmlstr=htmlstr.replace(/Shi ChengHao/g,"施成浩");
htmlstr=htmlstr.replace(/Sun YaNan/g,"孙亚楠");
htmlstr=htmlstr.replace(/Tomislav Špoljarić/g,"托米斯拉夫·斯波尔贾里奇");
htmlstr=htmlstr.replace(/Valentin Demenko/g,"瓦伦丁·德门科 ");
htmlstr=htmlstr.replace(/Wang JunChao/g,"王俊超");
htmlstr=htmlstr.replace(/Wu TieZhu/g,"吴铁柱");
htmlstr=htmlstr.replace(/Xiong PinLiang/g,"熊品良");
htmlstr=htmlstr.replace(/Xu HengShui/g,"徐衡水");
htmlstr=htmlstr.replace(/Zeng ChaoQun/g,"曾超群");
htmlstr=htmlstr.replace(/Ying ZiXiang/g,"应子翔");
htmlstr=htmlstr.replace(/Zu TingHuan/g,"祖庭欢");


//No.45
//大连秋叶
htmlstr=htmlstr.replace(/Guo SiDe/g,"郭思德");
htmlstr=htmlstr.replace(/Lian JianChun/g,"连建春");
htmlstr=htmlstr.replace(/Liu YunSheng/g,"刘允升");
htmlstr=htmlstr.replace(/Long RuiZhi/g,"龙瑞芝");
htmlstr=htmlstr.replace(/Mao ZhiAn/g,"毛芝安");
htmlstr=htmlstr.replace(/Qiang GuoQing/g,"强国庆");
htmlstr=htmlstr.replace(/Yun ShengQiao/g,"云盛桥");

//No.46
//厦门蓝狮
htmlstr=htmlstr.replace(/Cai XinYu/g,"蔡新宇");
htmlstr=htmlstr.replace(/Chen ZongCheng/g,"陈总成");
htmlstr=htmlstr.replace(/Cian Rodden/g,"锡安·罗登");
htmlstr=htmlstr.replace(/Dai ShiPeng/g,"戴世鹏");
htmlstr=htmlstr.replace(/Davide Pedrini/g,"戴维·佩德里尼");
htmlstr=htmlstr.replace(/Di HaiGuang/g,"狄海光");
htmlstr=htmlstr.replace(/Guan Shou/g,"关守");
htmlstr=htmlstr.replace(/He GenWei/g,"何根伟");
htmlstr=htmlstr.replace(/Jin KaiLing/g,"金凯灵");
htmlstr=htmlstr.replace(/Lv FengYi/g,"吕冯毅");
htmlstr=htmlstr.replace(/Meng MeiSheng/g,"孟美盛");
htmlstr=htmlstr.replace(/Meng YiQiang/g,"孟义强");
htmlstr=htmlstr.replace(/Pan YingChun/g,"潘迎春");
htmlstr=htmlstr.replace(/Ping ShuYun/g,"平书云");
htmlstr=htmlstr.replace(/Qian GouDan/g,"钱狗蛋");
htmlstr=htmlstr.replace(/Ran XiangLi/g,"冉向里");
htmlstr=htmlstr.replace(/Serafeim Ramfos/g,"拉姆福斯");
htmlstr=htmlstr.replace(/Shota Vasadze/g,"瓦萨泽");
htmlstr=htmlstr.replace(/Shui ZhuoXiang/g,"水卓翔");
htmlstr=htmlstr.replace(/Si TingHuan/g,"司挺欢");
htmlstr=htmlstr.replace(/Vanko Chardakov/g,"范科·查达科夫");
htmlstr=htmlstr.replace(/Wang Wen/g,"王文");
htmlstr=htmlstr.replace(/Wei GuoZheng/g,"魏国政");
htmlstr=htmlstr.replace(/Wu ZePeng/g,"吴泽鹏");
htmlstr=htmlstr.replace(/Xuan JunHua/g,"宣俊华");
htmlstr=htmlstr.replace(/Yang ZhiHao/g,"杨志豪");
htmlstr=htmlstr.replace(/Yao TianYi/g,"姚天一");
htmlstr=htmlstr.replace(/Yue BaiQun/g,"岳柏群");
htmlstr=htmlstr.replace(/Yue YaKai/g,"岳亚凯");


//No.47
//流火弱水
htmlstr=htmlstr.replace(/Cui Can/g,"崔璨");
htmlstr=htmlstr.replace(/Gabriele Bosio/g,"加布里埃尔·博西奥");
htmlstr=htmlstr.replace(/Gheorghe Dolanescu/g,"格奥尔基·多兰斯库");
htmlstr=htmlstr.replace(/Guo RuiZhi/g," 郭锐志");
htmlstr=htmlstr.replace(/Hou FengXin/g,"侯奉新");
htmlstr=htmlstr.replace(/Hou SuZheng/g,"侯肃政");
htmlstr=htmlstr.replace(/Jia ZhaoLin/g,"贾兆麟");
htmlstr=htmlstr.replace(/Lai QiMing/g,"赖启铭");
htmlstr=htmlstr.replace(/Li CongRui/g,"李琮瑞");
htmlstr=htmlstr.replace(/Li PeiZhang/g,"李培章");
htmlstr=htmlstr.replace(/Lu WenAn/g,"卢文安");
htmlstr=htmlstr.replace(/Mo Rong/g,"莫荣");
htmlstr=htmlstr.replace(/Nikolaj Jokanović/g,"尼科拉·约卡诺维奇");
htmlstr=htmlstr.replace(/Niu LinGen/g,"牛霖艮");
htmlstr=htmlstr.replace(/Peng MaoGong/g,"彭茂公");
htmlstr=htmlstr.replace(/Qiu HuWei/g,"邱虎威");
htmlstr=htmlstr.replace(/Shi XueQian/g,"史学谦");
htmlstr=htmlstr.replace(/Vince Moret/g,"文斯·莫雷特");
htmlstr=htmlstr.replace(/Xiong TianYou/g,"熊天佑");
htmlstr=htmlstr.replace(/Yang ZeJia/g,"杨泽嘉");
htmlstr=htmlstr.replace(/Zhai YueLei/g,"翟岳磊");
htmlstr=htmlstr.replace(/Zhuang JunHui/g,"庄君辉");
htmlstr=htmlstr.replace(/Zu Yao XiaoBin/g,"祖尧小斌");

//No.48
//绿帽子FC
htmlstr=htmlstr.replace(/Deng YuGang/g,"邓玉刚"); 
htmlstr=htmlstr.replace(/Ren ChenChen/g,"任晨晨"); 
htmlstr=htmlstr.replace(/Wan JuJi/g,"万巨基");
htmlstr=htmlstr.replace(/Wei YanJun/g,"魏彦军"); 
htmlstr=htmlstr.replace(/Wu YuanQing/g,"吴苑晴"); 
htmlstr=htmlstr.replace(/Zhuang TieLin/g,"庄铁林"); 


//No.49
//成都FC
htmlstr=htmlstr.replace(/Wu ZhuoFan/g,"武周芳"); 
htmlstr=htmlstr.replace(/Zhou YiCong/g,"周义从");
htmlstr=htmlstr.replace(/He ZiChen/g,"何子辰"); 
htmlstr=htmlstr.replace(/Yu JunCheng/g,"雨均城");
htmlstr=htmlstr.replace(/Xiong YingXiong/g,"熊应雄");
htmlstr=htmlstr.replace(/Liu Kang/g,"刘康");
htmlstr=htmlstr.replace(/Dong Long/g,"董龙");
htmlstr=htmlstr.replace(/Wang YiShan/g,"王一山");
htmlstr=htmlstr.replace(/Zhao Han/g,"赵韩");
htmlstr=htmlstr.replace(/Nong Jin/g,"农进");
htmlstr=htmlstr.replace(/Hong ZheQian/g,"洪哲乾");
htmlstr=htmlstr.replace(/Zhang HaiJie/g,"张海杰");

//No.50
//喵喵FC
htmlstr=htmlstr.replace(/Ping PengDong/g,"屏彭栋");
htmlstr=htmlstr.replace(/Wang ShiRong/g,"王仕荣");
htmlstr=htmlstr.replace(/Zhou LinFeng/g,"周林峰");
htmlstr=htmlstr.replace(/Zhu Dao/g,"朱刀");


//No.51
//天淡蓝
htmlstr=htmlstr.replace(/Alvydas Guogas/g,"阿尔维达斯·郭加斯");
htmlstr=htmlstr.replace(/Cai TianWen/g,"蔡天文");
htmlstr=htmlstr.replace(/ChuLi RunFa/g,"樗里润发");
htmlstr=htmlstr.replace(/GongSun RenJie/g,"公孙仁杰");
htmlstr=htmlstr.replace(/Zuo ZhiFei/g,"左挚飞");

//No.52
//纯白
htmlstr=htmlstr.replace(/Cheng JingZe/g,"程景泽");
htmlstr=htmlstr.replace(/DongGuo ZongJi/g,"东郭宗济");
htmlstr=htmlstr.replace(/He YiJi/g,"何伊基");
htmlstr=htmlstr.replace(/Meng Xu/g,"孟旭"); 
htmlstr=htmlstr.replace(/Mo GuangJian/g,"莫广建");
htmlstr=htmlstr.replace(/Ning ZhuoXiang/g,"宁卓祥");
htmlstr=htmlstr.replace(/Wang JingDong/g,"王京东");
htmlstr=htmlstr.replace(/Xiao XueDong/g,"萧学栋");
htmlstr=htmlstr.replace(/Yuan RuiYang/g,"袁瑞阳"); 
htmlstr=htmlstr.replace(/ZhangSun JinZhong/g,"长孙晋忠");
htmlstr=htmlstr.replace(/Zhao PinGuan/g,"赵品冠");
htmlstr=htmlstr.replace(/Zhen XuePeng/g,"甄学鹏");

//No.53
//SHE
htmlstr=htmlstr.replace(/Chi ShiChao/g,"迟诗潮");
htmlstr=htmlstr.replace(/Chi YueYan/g,"迟悦颜");
htmlstr=htmlstr.replace(/Chu DaYou/g,"楚大悠");
htmlstr=htmlstr.replace(/Cui Bu/g,"崔卜");
htmlstr=htmlstr.replace(/Dai PinXian/g,"戴品娴");
htmlstr=htmlstr.replace(/Du WenYan/g,"杜雯妍");
htmlstr=htmlstr.replace(/Fan SuMeng/g,"范苏萌");
htmlstr=htmlstr.replace(/He XuSheng/g,"何絮笙");
htmlstr=htmlstr.replace(/Kang JiQin/g,"康寄琴");
htmlstr=htmlstr.replace(/Li JinFei/g,"李锦霏");
htmlstr=htmlstr.replace(/Li YiTeng/g,"李依藤");
htmlstr=htmlstr.replace(/Luo ChenRui/g,"罗晨蕊");
htmlstr=htmlstr.replace(/Pan WanChun/g,"潘婉纯");
htmlstr=htmlstr.replace(/Qi Cen/g,"祁涔");
htmlstr=htmlstr.replace(/Qiu ChangBiao/g,"秋长飚");
htmlstr=htmlstr.replace(/Shu XiuFu/g,"舒秀芙");
htmlstr=htmlstr.replace(/Sun FengSheng/g,"孙枫笙");
htmlstr=htmlstr.replace(/Sun JiLi/g,"孙霁丽");
htmlstr=htmlstr.replace(/Xiao JuXin/g,"萧鞠昕");
htmlstr=htmlstr.replace(/Xiao ZhaoXian/g,"萧昭娴");
htmlstr=htmlstr.replace(/Yan YiCong/g,"颜伊丛");
htmlstr=htmlstr.replace(/Yang DiZhou/g,"杨笛舟");
htmlstr=htmlstr.replace(/Yang GaoJun/g,"杨高郡");
htmlstr=htmlstr.replace(/Yuan GuoWen/g,"袁果雯");
htmlstr=htmlstr.replace(/Yuan ZhuoFan/g,"袁卓帆");
htmlstr=htmlstr.replace(/Zhai HaiTing/g,"翟海婷");
htmlstr=htmlstr.replace(/Zhang ZhengDong/g,"张筝冬");
htmlstr=htmlstr.replace(/Zhao KeYi/g,"赵珂伊");

//No.54
//重庆云栖
htmlstr=htmlstr.replace(/Abraham Zuffi/g,"亚伯拉罕·祖菲"); 
htmlstr=htmlstr.replace(/Ao YaKe/g,"敖亚可"); 
htmlstr=htmlstr.replace(/Aristos Kougias/g,"阿里斯托·库吉亚斯"); 
htmlstr=htmlstr.replace(/Bei WeiFei/g,"贝伟飞"); 
htmlstr=htmlstr.replace(/Chai MinWei/g,"柴敏伟"); 
htmlstr=htmlstr.replace(/Cheng Ying/g,"程英"); 
htmlstr=htmlstr.replace(/Diao LingHui/g,"刁灵辉"); 
htmlstr=htmlstr.replace(/Dong PeiDong/g,"董培栋"); 
htmlstr=htmlstr.replace(/Du HongLiang/g,"杜洪亮"); 
htmlstr=htmlstr.replace(/Irven Coleman/g,"艾文·科尔曼"); 
htmlstr=htmlstr.replace(/Jonne Jokinen/g,"乔尼·乔金恩"); 
htmlstr=htmlstr.replace(/Li QuanShun/g,"李全顺"); 
htmlstr=htmlstr.replace(/Li ZhongLong/g,"李忠龙"); 
htmlstr=htmlstr.replace(/Lin ZiXiang/g,"林子祥"); 
htmlstr=htmlstr.replace(/Lu Hong/g,"陆宏"); 
htmlstr=htmlstr.replace(/Ma HaoZheng/g,"马浩正"); 
htmlstr=htmlstr.replace(/Pei HuXiang/g,"裴虎翔"); 
htmlstr=htmlstr.replace(/Qiao Zhen/g,"乔真"); 
htmlstr=htmlstr.replace(/Rao XuePeng/g,"饶学鹏"); 
htmlstr=htmlstr.replace(/She ChenBin/g,"佘晨彬"); 
htmlstr=htmlstr.replace(/Shu RongZe/g,"舒荣泽"); 
htmlstr=htmlstr.replace(/Wang JianFeng/g,"王剑锋"); 
htmlstr=htmlstr.replace(/Weng BaiChuan/g,"翁百川"); 
htmlstr=htmlstr.replace(/Xi HongHai/g,"席洪海"); 
htmlstr=htmlstr.replace(/Xu GuanHong/g,"徐关宏"); 
htmlstr=htmlstr.replace(/Yu ChongWen/g,"于崇文"); 
htmlstr=htmlstr.replace(/Zhan YueFei/g,"詹岳飞");
htmlstr=htmlstr.replace(/Zong ZhenXiang/g,"宗振祥"); 
htmlstr=htmlstr.replace(/Zou ZhenDong/g,"邹振东"); 

htmlstr=htmlstr.replace(/Guo TianQi/g,"郭天奇"); 
htmlstr=htmlstr.replace(/Yu WeiJie/g,"于伟杰"); 
htmlstr=htmlstr.replace(/Mu YouHe/g,"穆友河"); 
htmlstr=htmlstr.replace(/Wan ZhongYing/g,"王忠英"); 
htmlstr=htmlstr.replace(/Zhang JianTing/g,"张建亭"); 
htmlstr=htmlstr.replace(/Shu MianXin/g,"舒绵新"); 
htmlstr=htmlstr.replace(/Ye XiYan/g,"叶西岩"); 
htmlstr=htmlstr.replace(/Xu XuanYi/g,"徐轩仪"); 
htmlstr=htmlstr.replace(/Huang ShanGen/g,"黄山根"); 
htmlstr=htmlstr.replace(/Song RenYing/g,"宋仁颖"); 
htmlstr=htmlstr.replace(/An YiJian/g,"安义剑"); 
htmlstr=htmlstr.replace(/Bai HaoRong/g,"白浩荣"); 
htmlstr=htmlstr.replace(/Chu LiangJun/g,"褚良军"); 


//No.55
//陕西长安竞技
htmlstr=htmlstr.replace(/Chen YuGang/g,"陈玉刚"); 
htmlstr=htmlstr.replace(/Cheng Bo/g,"程博"); 
htmlstr=htmlstr.replace(/Dang ShiMin/g,"党世敏"); 
htmlstr=htmlstr.replace(/Dou NingTao/g,"窦宁涛"); 
htmlstr=htmlstr.replace(/Du ShanGen/g,"杜善根"); 
htmlstr=htmlstr.replace(/Fan ZhiHeng/g,"范志恒"); 
htmlstr=htmlstr.replace(/He ZheHao/g,"何哲豪"); 
htmlstr=htmlstr.replace(/Hong XuRi/g,"洪旭日");
htmlstr=htmlstr.replace(/Hua XiaoXin/g,"华晓鑫"); 
htmlstr=htmlstr.replace(/Jiang QiuMing/g,"姜秋明"); 
htmlstr=htmlstr.replace(/Li ZhenDong/g,"李振东"); 
htmlstr=htmlstr.replace(/Lian XiangMin/g,"廉项敏"); 
htmlstr=htmlstr.replace(/Liu XianZhi/g,"刘献志"); 
htmlstr=htmlstr.replace(/Ma ChenXi/g,"马晨曦"); 
htmlstr=htmlstr.replace(/Ping YanSong/g,"平岩松"); 
htmlstr=htmlstr.replace(/Qin QingLin/g,"秦清霖"); 
htmlstr=htmlstr.replace(/Su YiTai/g,"苏毅泰"); 
htmlstr=htmlstr.replace(/Wang JinFei/g,"王锦飞"); 
htmlstr=htmlstr.replace(/Wei YeXuan/g,"韦叶轩"); 
htmlstr=htmlstr.replace(/Wu RuiHao/g,"吴睿皓"); 
htmlstr=htmlstr.replace(/You XiaoPeng/g,"游霄鹏"); 
htmlstr=htmlstr.replace(/Zhai XuHeYue/g,"翟徐和悦"); 
htmlstr=htmlstr.replace(/Zhang JingTian/g,"张景添"); 
htmlstr=htmlstr.replace(/Zhang TianCheng/g,"张天成"); 
htmlstr=htmlstr.replace(/Zhang YuQing/g,"张宇清"); 
htmlstr=htmlstr.replace(/Zhao FeiFan/g,"赵非凡"); 
htmlstr=htmlstr.replace(/Zheng JingLiao/g,"郑景辽"); 
htmlstr=htmlstr.replace(/Zhuang SanSha/g,"庄三沙"); 

//No.56
//醉酒青牛
htmlstr=htmlstr.replace(/Du HongLiang/g,"杜洪亮");
htmlstr=htmlstr.replace(/Fei ZhenDong/g,"费振东");
htmlstr=htmlstr.replace(/He DongJian/g,"何东健");
htmlstr=htmlstr.replace(/Hong KaiGe/g,"洪凯歌");
htmlstr=htmlstr.replace(/Hu Man/g,"胡曼");
htmlstr=htmlstr.replace(/Ji MingJing/g,"姬明镜");
htmlstr=htmlstr.replace(/Jing Ming/g,"荆铭");
htmlstr=htmlstr.replace(/Lei DeChao/g,"雷德超");
htmlstr=htmlstr.replace(/Liang XiangYang/g,"梁向阳");
htmlstr=htmlstr.replace(/Liao HongXuan/g,"廖洪轩");
htmlstr=htmlstr.replace(/Lin ZuXian/g,"林祖贤");
htmlstr=htmlstr.replace(/Ma XuanDe/g,"马宣德");
htmlstr=htmlstr.replace(/Peng RuiHua/g,"彭瑞华");
htmlstr=htmlstr.replace(/Pu ZhengTu/g,"蒲正图");
htmlstr=htmlstr.replace(/Song YanHeng/g,"宋衍蘅");
htmlstr=htmlstr.replace(/Su XinKai/g,"苏新凯");
htmlstr=htmlstr.replace(/Tai ZhiLi/g,"邰智力");
htmlstr=htmlstr.replace(/Xiao LiJun/g,"肖丽君");
htmlstr=htmlstr.replace(/Yu YanQiu/g,"于艳秋");
htmlstr=htmlstr.replace(/Zhai HengCheng/g,"翟恒诚");
htmlstr=htmlstr.replace(/Zhao YueYing/g,"赵月英");
htmlstr=htmlstr.replace(/Zhao ZhongShan/g,"赵中山");
htmlstr=htmlstr.replace(/Zhi HuiChen/g,"跖汇诚");
htmlstr=htmlstr.replace(/Zong WangSong/g,"宗忘松");

//No.57
//釜山航海
htmlstr=htmlstr.replace(/Cheol-Suk Rhee/g,"李哲石");
htmlstr=htmlstr.replace(/Chang-Hyun You/g,"游昌贤");
htmlstr=htmlstr.replace(/Chul-Ho Cha/g,"车哲豪");
htmlstr=htmlstr.replace(/Dae-Ui Kim/g,"金大义");
htmlstr=htmlstr.replace(/Doo-Hyun Cho/g,"赵斗现");
htmlstr=htmlstr.replace(/Doo-Hyung Lee/g,"李斗亨");
htmlstr=htmlstr.replace(/Eun-Sung Yim/g,"尹恩成");
htmlstr=htmlstr.replace(/Geert Wiegmans/g,"盖尔特·威格曼斯");
htmlstr=htmlstr.replace(/Heung-Soo Park/g,"朴兴秀");
htmlstr=htmlstr.replace(/Ho-Jun Lee/g,"李浩俊");
htmlstr=htmlstr.replace(/Hon-Yong Park/g,"朴仁勇");
htmlstr=htmlstr.replace(/Hong-Cheol I/g,"易洪哲");
htmlstr=htmlstr.replace(/Hyang-Soon Lee/g,"李香顺");
htmlstr=htmlstr.replace(/Jae-Soo Son/g,"孙贵寿");
htmlstr=htmlstr.replace(/Jeaki Choi/g,"崔杰基");
htmlstr=htmlstr.replace(/Ji-Sung Chung/g,"郑至诚");
htmlstr=htmlstr.replace(/Ji-Sung Kwon/g,"权智成");
htmlstr=htmlstr.replace(/Ji-Sung Park/g,"朴智成");
htmlstr=htmlstr.replace(/Jin-Kyu Yeo/g,"杨镇圭");
htmlstr=htmlstr.replace(/Jong-Chun Kim/g,"金钟纯");
htmlstr=htmlstr.replace(/Joo-Hyung Lee/g,"李卓雄");
htmlstr=htmlstr.replace(/Joong-Kyung Kim/g,"金钟京");
htmlstr=htmlstr.replace(/Jung-Ho Lee/g,"李正浩");
htmlstr=htmlstr.replace(/Jung-Hyun Lee/g,"李正贤");
htmlstr=htmlstr.replace(/Ki-Bo Park/g,"朴琪甫");
htmlstr=htmlstr.replace(/Kyung-Ho Choi/g,"崔景镐");
htmlstr=htmlstr.replace(/Magor Csanádi/g,"马加尔·萨纳迪");
htmlstr=htmlstr.replace(/Matteo Meneghini/g,"马特奥·蒙内基尼");
htmlstr=htmlstr.replace(/Min-Kwi Cha/g,"车敏贵");
htmlstr=htmlstr.replace(/Mirko Paesano/g,"米尔科·帕萨诺");
htmlstr=htmlstr.replace(/Myung-Bo Choi/g,"崔明博");
htmlstr=htmlstr.replace(/Sa-Vik Lee/g,"李沙伟");
htmlstr=htmlstr.replace(/Sang-Ki Lee/g,"李相基");
htmlstr=htmlstr.replace(/Seung-Hwa Koo/g,"具承华");
htmlstr=htmlstr.replace(/Seung-Mee Cho/g,"赵胜玟");
htmlstr=htmlstr.replace(/So-Young Lee/g,"李素容");
htmlstr=htmlstr.replace(/Stoil Vidov/g,"斯蒂尔·维多夫");
htmlstr=htmlstr.replace(/Sung-Ki Moon/g,"文成基");
htmlstr=htmlstr.replace(/Sung-Kuk Shin/g,"宋成国");
htmlstr=htmlstr.replace(/Sung-Yong Jung/g,"郑成龙");
htmlstr=htmlstr.replace(/Tae-Song Lee/g,"李泰松");
htmlstr=htmlstr.replace(/Yong-Jin You/g,"游永进");
htmlstr=htmlstr.replace(/Yong-Soo Park/g,"朴龙洙");
htmlstr=htmlstr.replace(/Young-A Cho/g,"赵荣阿");
htmlstr=htmlstr.replace(/Young-Kwang Hwang/g,"黄英光");
htmlstr=htmlstr.replace(/Young-Pyo Park/g,"朴英杓");




//No.58
//U.C.kaifeng
htmlstr=htmlstr.replace(/Daniel Kobierski/g,"丹尼尔·科比尔斯基");
htmlstr=htmlstr.replace(/Dea Yanpeng/g,"狄延鹏");
htmlstr=htmlstr.replace(/DuanMu ZhouHong/g,"端木周鸿");
htmlstr=htmlstr.replace(/Guo ZhongLong/g,"郭忠龙");
htmlstr=htmlstr.replace(/He ZhiXuan/g,"何志轩"); 
htmlstr=htmlstr.replace(/Lavrentiy Nebozhuk/g,"拉夫伦蒂·尼博祖克");
htmlstr=htmlstr.replace(/Mohammad Ali Vaghari/g,"穆罕默德•阿里·瓦格哈里");
htmlstr=htmlstr.replace(/Toms Ķesteris/g,"汤姆斯·埃斯特里斯");
htmlstr=htmlstr.replace(/Wang YongHuai/g,"王永怀");
htmlstr=htmlstr.replace(/Zhou Yang/g,"周洋");

//No.59
//魔法少女TeRiRi 
htmlstr=htmlstr.replace(/Bai YuHe/g,"白羽鹤"); 
htmlstr=htmlstr.replace(/Chen BinJie/g,"陈斌杰");
htmlstr=htmlstr.replace(/Chen ZeMin/g,"陈泽民"); 
htmlstr=htmlstr.replace(/Chu XiaoYi/g,"楚晓伊"); 
htmlstr=htmlstr.replace(/Fan ShaGen/g,"范杀亘");
htmlstr=htmlstr.replace(/Feng Jie/g,"冯杰"); 
htmlstr=htmlstr.replace(/Hu TaiLang/g,"胡太郎"); 
htmlstr=htmlstr.replace(/Hua Feng/g,"画风"); 
htmlstr=htmlstr.replace(/Jia MuYao/g,"贾慕遥"); 
htmlstr=htmlstr.replace(/Lei ChengDe/g,"雷承德"); 
htmlstr=htmlstr.replace(/Lei ZeRui/g,"雷泽锐"); 
htmlstr=htmlstr.replace(/Lian HengCheng/g,"连恒成"); 
htmlstr=htmlstr.replace(/Lin BaoShan/g,"林宝山"); 
htmlstr=htmlstr.replace(/Lin ZhiKai/g,"林志凯"); 
htmlstr=htmlstr.replace(/Lin ZiXin/g,"林梓新"); 
htmlstr=htmlstr.replace(/Liu KaiZhong/g,"刘凯钟"); 
htmlstr=htmlstr.replace(/Luo ZhenSheng/g,"罗臻晟");
htmlstr=htmlstr.replace(/Mou YouAn/g,"牟佑安"); 
htmlstr=htmlstr.replace(/Na Tu/g,"那途"); 
htmlstr=htmlstr.replace(/Niu TiXiang/g,"牛题湘"); 
htmlstr=htmlstr.replace(/Qiu DaChui/g,"邱大锤"); 
htmlstr=htmlstr.replace(/She ShiMing/g,"佘室铭"); 
htmlstr=htmlstr.replace(/Shi JingKai/g,"师敬楷"); 
htmlstr=htmlstr.replace(/Song ShuSheng/g,"颂书生"); 
htmlstr=htmlstr.replace(/Tian ShuHao/g,"田书豪"); 
htmlstr=htmlstr.replace(/Wang EnLai/g,"王恩来"); 
htmlstr=htmlstr.replace(/Xiang Fa/g,"向法"); 
htmlstr=htmlstr.replace(/Xue TianRui/g,"薛天睿"); 
htmlstr=htmlstr.replace(/Yan YongKang/g,"颜永康"); 
htmlstr=htmlstr.replace(/Zhan YaJie/g,"詹亚杰"); 
htmlstr=htmlstr.replace(/Zhang JianJun/g,"章剑鋆"); 
htmlstr=htmlstr.replace(/Zhang XueLiang/g,"张学良");
htmlstr=htmlstr.replace(/Zhou ShangYuan/g,"周尚垣"); 
htmlstr=htmlstr.replace(/Zhou TaoTao/g,"周滔涛"); 


//No.60
//自由人
htmlstr=htmlstr.replace(/Ai YanQiu/g,"艾雁秋"); 
htmlstr=htmlstr.replace(/Hua YiDuo/g,"花一朵"); 
htmlstr=htmlstr.replace(/Ou JingXuan/g,"区静轩"); 
htmlstr=htmlstr.replace(/Qu Jin/g,"曲尽"); 
htmlstr=htmlstr.replace(/Shi JiaQian/g,"石嘉乾"); 
htmlstr=htmlstr.replace(/Su YaoZu/g,"苏耀祖"); 
htmlstr=htmlstr.replace(/Su ZePeng/g,"苏泽鹏"); 
htmlstr=htmlstr.replace(/XiaHou BinJia/g,"夏侯宾佳"); 
htmlstr=htmlstr.replace(/Xian XueGen/g,"冼雪根"); 
htmlstr=htmlstr.replace(/Xing TaiLang/g,"幸太郎"); 
htmlstr=htmlstr.replace(/Zhang BenJian/g,"张本舰"); 
htmlstr=htmlstr.replace(/Zhong KeXing/g,"钟恪兴"); 
htmlstr=htmlstr.replace(/Zhong YunHe/g,"中云鹤"); 
htmlstr=htmlstr.replace(/Zhou LiFu/g,"周礼服");

//No.61
//宁夏凤凰涅槃足球俱乐部
//NID:4336460
htmlstr=htmlstr.replace(/Dai XiaoQian/g,"戴晓倩"); 
htmlstr=htmlstr.replace(/Guo He/g,"郭郃"); 
htmlstr=htmlstr.replace(/He XingHan/g,"何兴涵"); 
htmlstr=htmlstr.replace(/Hu WenZhao/g,"胡文钊"); 
htmlstr=htmlstr.replace(/Lang JiaJie/g,"梁佳杰"); 
htmlstr=htmlstr.replace(/Liang AnQi/g,"梁安琪"); 
htmlstr=htmlstr.replace(/Lu LiSan/g,"陆离三"); 
htmlstr=htmlstr.replace(/Mu ZhiFan/g,"穆志帆"); 
htmlstr=htmlstr.replace(/Wang GuanYin/g,"王冠殷"); 
htmlstr=htmlstr.replace(/Wang ShuRen/g,"王树人"); 
htmlstr=htmlstr.replace(/Wang YaoYao/g,"王瑶瑶"); 
htmlstr=htmlstr.replace(/Xi WenMing/g,"席文明"); 
htmlstr=htmlstr.replace(/Xu ZhongShi/g,"徐忠师"); 
htmlstr=htmlstr.replace(/Yan ZhiPing/g,"闫志平"); 
htmlstr=htmlstr.replace(/Yuan WenXiong/g,"袁文雄"); 


//ID:4370110 
//No.62
//昆山FC
htmlstr=htmlstr.replace(/Cai JingChang/g,"蔡靖昶"); 
htmlstr=htmlstr.replace(/Cao QingChang/g,"曹清昌"); 
htmlstr=htmlstr.replace(/Deng ChenXi/g,"邓陈熙"); 
htmlstr=htmlstr.replace(/Gan ChengDong/g,"甘成栋"); 
htmlstr=htmlstr.replace(/Hong ChenYuan/g,"洪辰元"); 
htmlstr=htmlstr.replace(/Jia Cheng/g,"贾诚"); 
htmlstr=htmlstr.replace(/Jiang HaiQuan/g,"江海泉"); 
htmlstr=htmlstr.replace(/Jin RuiZhe/g,"金瑞泽"); 
htmlstr=htmlstr.replace(/Lv BoRui/g,"吕博睿"); 
htmlstr=htmlstr.replace(/Naj AI Garni/g," 加尔尼"); 
htmlstr=htmlstr.replace(/Qian XiaoTian/g,"钱啸天"); 
htmlstr=htmlstr.replace(/Qiu HouYong/g,"邱侯勇"); 
htmlstr=htmlstr.replace(/Shan JunYan/g,"单俊彦"); 
htmlstr=htmlstr.replace(/Shao GuoQiang/g,"邵国强"); 
htmlstr=htmlstr.replace(/Song Gan/g,"宋敢"); 
htmlstr=htmlstr.replace(/SunWuJi/g,"孙武骥"); 
htmlstr=htmlstr.replace(/Tao Tong/g,"陶彤"); 
htmlstr=htmlstr.replace(/Tian ZhiXin/g,"田智鑫"); 
htmlstr=htmlstr.replace(/Wang WeiCheng /g,"王伟成"); 
htmlstr=htmlstr.replace(/Wu Tong/g,"吴桐"); 
htmlstr=htmlstr.replace(/Xi Fan/g,"郗范"); 
htmlstr=htmlstr.replace(/Yan ShengRui/g,"严晟睿"); 
htmlstr=htmlstr.replace(/Yang HaiYu/g,"杨海羽"); 
htmlstr=htmlstr.replace(/Zhen DeMin/g,"甄德旻"); 
htmlstr=htmlstr.replace(/Zhou Li/g,"周礼"); 
htmlstr=htmlstr.replace(/Zhu ChunJie/g,"朱春杰"); 


//No.63
//NID:4357337
//载云旗兮委蛇
htmlstr=htmlstr.replace(/Evandro Bondosog/g,"伊万德罗·博恩多索"); 
htmlstr=htmlstr.replace(/Ge TianHao/g,"葛天豪"); 
htmlstr=htmlstr.replace(/Hillar Kösse/g,"希拉尔·科泽"); 
htmlstr=htmlstr.replace(/Hou JianFu/g,"侯建福"); 
htmlstr=htmlstr.replace(/Hu ShiAn/g,"胡世安"); 
htmlstr=htmlstr.replace(/Huang JianShan/g,"黄建山"); 
htmlstr=htmlstr.replace(/Ning XuFeng/g,"宁旭峰"); 
htmlstr=htmlstr.replace(/Qu WeiZhuo/g,"曲伟卓"); 
htmlstr=htmlstr.replace(/Roan Moreno/g,"罗安·莫雷诺"); 
htmlstr=htmlstr.replace(/Song WeiJian/g,"宋伟健"); 
htmlstr=htmlstr.replace(/Søren Bonnum/g,"索伦·博恩纳姆"); 
htmlstr=htmlstr.replace(/Valentín Moreira/g,"瓦伦汀·莫雷拉"); 
htmlstr=htmlstr.replace(/Xiong Miao/g,"熊苗"); 
htmlstr=htmlstr.replace(/Xue RongJi/g,"薛荣吉"); 
htmlstr=htmlstr.replace(/Yang JianTing/g,"杨建亭"); 
htmlstr=htmlstr.replace(/Yosgart Carrasco/g,"约斯加特·卡拉斯科"); 
htmlstr=htmlstr.replace(/Yu Qingi/g,"余庆"); 
htmlstr=htmlstr.replace(/Zhou YiTai/g,"周一泰"); 


//No.64
//ZID:4357352
//孙笑川258
htmlstr=htmlstr.replace(/Bei JinTao/g,"北京涛"); 
htmlstr=htmlstr.replace(/Bi LiFu/g,"比利弗");
htmlstr=htmlstr.replace(/Cai WenLong/g,"蔡文龙"); 
htmlstr=htmlstr.replace(/Cheng ChangLe/g,"程长乐");
htmlstr=htmlstr.replace(/Dang Gan/g,"党干");
htmlstr=htmlstr.replace(/Gao WenJia/g,"高稳佳");
htmlstr=htmlstr.replace(/Gui Bai/g,"归白");
htmlstr=htmlstr.replace(/Guo YeCheng/g,"郭叶城");
htmlstr=htmlstr.replace(/He FuZe/g,"何福泽");
htmlstr=htmlstr.replace(/He YongLai/g,"何永来");
htmlstr=htmlstr.replace(/Hong DeNan/g,"洪德南");
htmlstr=htmlstr.replace(/HuYan ZhiWei/g,"呼延志伟");
htmlstr=htmlstr.replace(/Huo GuoRong/g,"火锅荣");
htmlstr=htmlstr.replace(/Jia YinChen/g,"贾胤辰");
htmlstr=htmlstr.replace(/Jiang ZhiJian/g,"姜知渐");
htmlstr=htmlstr.replace(/Jing JiaJun/g,"荆嘉俊");
htmlstr=htmlstr.replace(/Lei ZiYuan/g,"雷子远");
htmlstr=htmlstr.replace(/Li TongShu/g,"李同书"); 
htmlstr=htmlstr.replace(/Li XiongWei/g,"李雄玮");
htmlstr=htmlstr.replace(/Liang Tao/g,"梁韬"); 
htmlstr=htmlstr.replace(/Lin DongHui/g,"林东荟");
htmlstr=htmlstr.replace(/Lin YiAo/g,"林一傲");
htmlstr=htmlstr.replace(/Liu ChangJie/g,"柳长杰");
htmlstr=htmlstr.replace(/Liu ChengJian/g,"柳城渐");
htmlstr=htmlstr.replace(/Liu JianLei/g,"柳渐磊");
htmlstr=htmlstr.replace(/Lu XiYa/g,"露西亚");
htmlstr=htmlstr.replace(/Lu XuanCheng/g,"卢轩城");
htmlstr=htmlstr.replace(/Luo Shuo/g,"罗烁");
htmlstr=htmlstr.replace(/Ma ShiHao/g,"马世豪");
htmlstr=htmlstr.replace(/Ma Tian/g,"马天");
htmlstr=htmlstr.replace(/Nong EnLai/g,"农恩来");
htmlstr=htmlstr.replace(/Nong ZongJi/g,"农宗基");
htmlstr=htmlstr.replace(/Ping LiangPing/g,"平梁屏");
htmlstr=htmlstr.replace(/Ren JingLiao/g,"任景聊");
htmlstr=htmlstr.replace(/Ren ZongSheng/g,"任宗盛");
htmlstr=htmlstr.replace(/Sha HanChao/g,"杀涵朝");
htmlstr=htmlstr.replace(/Shi YunTao/g,"时云韬");
htmlstr=htmlstr.replace(/SiMa XiaoLong/g,"司马小龙");
htmlstr=htmlstr.replace(/Tang YiWen/g,"唐亦文");
htmlstr=htmlstr.replace(/Tong YuanChao/g,"童远超");
htmlstr=htmlstr.replace(/Wang ChengGong/g,"旺成功");
htmlstr=htmlstr.replace(/Wang XueMing/g,"旺学明");
htmlstr=htmlstr.replace(/Wei ErWen/g,"维尔文"); 
htmlstr=htmlstr.replace(/Wu GuoHua/g,"伍国华"); 
htmlstr=htmlstr.replace(/Wu ShiKai/g,"武世凯");
htmlstr=htmlstr.replace(/Xia XuWei /g,"夏旭伟");
htmlstr=htmlstr.replace(/Xu JunLing/g,"徐俊凌");
htmlstr=htmlstr.replace(/Xue GuangQi/g,"薛光启");
htmlstr=htmlstr.replace(/Yan TengFei/g,"颜腾飞");
htmlstr=htmlstr.replace(/Ye ZiRui/g,"叶子瑞");
htmlstr=htmlstr.replace(/Yuan YanQin/g,"袁言钦"); 
htmlstr=htmlstr.replace(/Zhan DiFan/g,"战地犯");
htmlstr=htmlstr.replace(/Zhang RongAo/g,"张荣奥");
htmlstr=htmlstr.replace(/Zhao SiJie/g,"赵思杰");
htmlstr=htmlstr.replace(/Zhao ZiXin/g,"赵自信"); 
htmlstr=htmlstr.replace(/Zhou ShangYuan/g,"周尚垣");
htmlstr=htmlstr.replace(/Cai HongChen/g,"蔡鸿辰");
htmlstr=htmlstr.replace(/Hu YaoZong/g,"胡耀宗");
htmlstr=htmlstr.replace(/Pan ShuSheng/g,"潘书生");
htmlstr=htmlstr.replace(/Wu ZhiJian/g,"吴至贱");
htmlstr=htmlstr.replace(/Xu QiDi/g,"徐启迪");


//No.65
//ZID:4370152
//济南泰山
htmlstr=htmlstr.replace(/Antonio Marina/g,"安东尼奥·马里纳");
htmlstr=htmlstr.replace(/Girardo Mangiarotti/g,"吉拉多·曼乔洛蒂"); 
htmlstr=htmlstr.replace(/Gou Tu/g,"苟荼");
htmlstr=htmlstr.replace(/He NiuNiu/g,"何牛牛"); 
htmlstr=htmlstr.replace(/He ZhiAn/g,"何志安"); 
htmlstr=htmlstr.replace(/Huo HuaJun/g,"霍花俊"); 
htmlstr=htmlstr.replace(/Jing XinDe/g,"井新德"); 
htmlstr=htmlstr.replace(/Kang KunPeng/g,"康鲲鹏"); 
htmlstr=htmlstr.replace(/Leng JunPeng/g,"冷峻鹏"); 
htmlstr=htmlstr.replace(/Li AiShan/g,"李爱山"); 
htmlstr=htmlstr.replace(/Liang YanLiang/g,"梁颜亮"); 
htmlstr=htmlstr.replace(/Lin BoYun/g,"林拨云"); 
htmlstr=htmlstr.replace(/Ling WenXiong/g,"凌文兄"); 
htmlstr=htmlstr.replace(/Luo XiaoYong/g,"罗骁勇"); 
htmlstr=htmlstr.replace(/Mi GongQing/g,"糜共青"); 
htmlstr=htmlstr.replace(/Peng HenShui/g,"彭恨水"); 
htmlstr=htmlstr.replace(/Qiao DongLiang/g,"乔栋梁"); 
htmlstr=htmlstr.replace(/Qiu DaoJun/g,"裘道军"); 
htmlstr=htmlstr.replace(/Shu DengKe/g,"束登科"); 
htmlstr=htmlstr.replace(/Tang Hai/g,"唐海"); 
htmlstr=htmlstr.replace(/Wu Tongshu/g,"吴桐树"); 
htmlstr=htmlstr.replace(/Xiao GuoBin/g,"肖国彬"); 
htmlstr=htmlstr.replace(/Xie YanHuai/g,"谢言怀"); 
htmlstr=htmlstr.replace(/Yao ZiJian/g,"姚自健"); 

//No.66
//ZID:4383289
//吉林江密峰 
htmlstr=htmlstr.replace(/Daniel Carmonedo/g,"丹尼尔·卡蒙多"); 
htmlstr=htmlstr.replace(/Ding Bu/g,"丁逋"); 
htmlstr=htmlstr.replace(/Gökdeniz Topa/g,"格德尼兹·托帕"); 
htmlstr=htmlstr.replace(/Hong ShouQi/g,"洪寿启"); 
htmlstr=htmlstr.replace(/Huang MingYan/g,"黄明严"); 
htmlstr=htmlstr.replace(/Leng Fu/g,"冷甫"); 
htmlstr=htmlstr.replace(/Long ZhiJie/g,"龙治杰"); 
htmlstr=htmlstr.replace(/Lu AiHua/g,"卢爱华"); 
htmlstr=htmlstr.replace(/Menderes Kesek/g,"曼德莱斯·克赛科"); 
htmlstr=htmlstr.replace(/Qian ShengRui/g,"钱胜睿"); 
htmlstr=htmlstr.replace(/Xu LingFu/g,"许灵甫"); 
htmlstr=htmlstr.replace(/Xu YuYi/g,"徐语易"); 
htmlstr=htmlstr.replace(/Yue HuWei/g,"岳祜伟"); 
htmlstr=htmlstr.replace(/ZhangLiang Dao/g,"张梁道"); 

//No.67
//香港英华
htmlstr=htmlstr.replace(/Bowen Hau/g,"侯博文");
htmlstr=htmlstr.replace(/Cheung Tsing Muk/g,"穆昌清");
htmlstr=htmlstr.replace(/Chi Doy Sha/g,"沙支顿");
htmlstr=htmlstr.replace(/Ching Lung Wong/g,"黄正龙");
htmlstr=htmlstr.replace(/Cho Yan Cheung/g,"张祖仁");
htmlstr=htmlstr.replace(/Chun Cheung Lee/g,"李俊昌");
htmlstr=htmlstr.replace(/Chun Fai Ho/g,"何俊辉");
htmlstr=htmlstr.replace(/Him Hoi Ng/g,"吴谦凯");
htmlstr=htmlstr.replace(/Ho Kwan Yam/g,"任皓均");
htmlstr=htmlstr.replace(/Ka Fa Tung Fong/g,"方嘉华东");
htmlstr=htmlstr.replace(/Kai Chun Lam/g,"林启俊");
htmlstr=htmlstr.replace(/Kowk Leung Cheng/g,"郑国梁");
htmlstr=htmlstr.replace(/Kwok Sum Chan/g,"陈国森");
htmlstr=htmlstr.replace(/Kwun Chow Koi/g,"瞿管周");
htmlstr=htmlstr.replace(/Lai Fun Kuen/g,"权黎雚");
htmlstr=htmlstr.replace(/Li AoShuang/g,"李傲霜");
htmlstr=htmlstr.replace(/Long Pun Look/g,"陆泷盆");
htmlstr=htmlstr.replace(/Lung Tai Chow/g,"周龙大");
htmlstr=htmlstr.replace(/Mang Tip Chow/g,"周盟帖");
htmlstr=htmlstr.replace(/Min Long Ho/g,"何文郎");
htmlstr=htmlstr.replace(/Nong Fan/g,"农凡");
htmlstr=htmlstr.replace(/On Chio Kung/g,"龚安焦");
htmlstr=htmlstr.replace(/On Ki Lam/g,"林安纪");
htmlstr=htmlstr.replace(/Shai Kwun Lau/g,"刘世管");
htmlstr=htmlstr.replace(/ShangGuan MingLing/g,"上官明凌");
htmlstr=htmlstr.replace(/Siu Yin Yiu/g,"姚肇然");
htmlstr=htmlstr.replace(/Sui Kei Or/g,"柯帅纪");
htmlstr=htmlstr.replace(/Sui Lau/g,"刘帅");
htmlstr=htmlstr.replace(/Tie JingTian/g,"铁景天");
htmlstr=htmlstr.replace(/Tik Hung Ting/g,"丁狄鸿");
htmlstr=htmlstr.replace(/To Ho/g,"何都");
htmlstr=htmlstr.replace(/Tom Yip/g,"叶汤姆");
htmlstr=htmlstr.replace(/Tsz Chung Tsang/g,"曾梓聪");
htmlstr=htmlstr.replace(/Wei Kit Lam/g,"林伟杰");
htmlstr=htmlstr.replace(/Wing Cham Choi/g,"蔡荣湛");
htmlstr=htmlstr.replace(/Wing Kwong Tuen/g,"段永光");
htmlstr=htmlstr.replace(/Yin Pak Mai/g,"米贤柏");
htmlstr=htmlstr.replace(/Yoyo Bin/g,"育彬");
htmlstr=htmlstr.replace(/Yu Kwok Kit Hui/g,"许俞国杰");
htmlstr=htmlstr.replace(/Yui Tong Kung Suen/g,"孙芮唐贡");



//No.68
//青岛海员
htmlstr=htmlstr.replace(/Ren XiaoYao/g,"任逍遥");


//No.69
//六合打击乐 
htmlstr=htmlstr.replace(/Ai SiYu/g,"艾汜羽"); 
htmlstr=htmlstr.replace(/Arisztid Friedrich/g,"阿里斯蒂德·弗里德里希"); 
htmlstr=htmlstr.replace(/Azziz Bakare/g,"阿兹齐兹·巴卡雷"); 
htmlstr=htmlstr.replace(/Borrell Freixa/g,"博雷利·弗雷克萨"); 
htmlstr=htmlstr.replace(/Cai ChaoLong/g,"蔡超龙"); 
htmlstr=htmlstr.replace(/Cai JunChuan/g,"蔡钧川"); 
htmlstr=htmlstr.replace(/Cen YouSu/g,"岑友谡"); 
htmlstr=htmlstr.replace(/Chao KaiHong/g,"晁凯宏"); 
htmlstr=htmlstr.replace(/Cui HongBo/g,"崔鸿博"); 
htmlstr=htmlstr.replace(/Célio Guedes/g,"西里奥·格德斯"); 
htmlstr=htmlstr.replace(/Dai Yu/g,"戴宇"); 
htmlstr=htmlstr.replace(/David Pellón/g,"大卫·佩翁"); 
htmlstr=htmlstr.replace(/David Puerto/g,"大卫·普埃尔托"); 
htmlstr=htmlstr.replace(/Deng JunBiao/g,"邓军彪");
htmlstr=htmlstr.replace(/Donald Masker/g,"唐纳德·马斯克"); 
htmlstr=htmlstr.replace(/Edoardo Petrai/g,"爱德华多·佩特拉"); 
htmlstr=htmlstr.replace(/Fang YingQuan/g,"方英权"); 
htmlstr=htmlstr.replace(/Feng RongHuan/g,"冯嵘焕"); 
htmlstr=htmlstr.replace(/Gao Yue/g,"高越"); 
htmlstr=htmlstr.replace(/Guo YanChun/g,"郭彦春"); 
htmlstr=htmlstr.replace(/Hayat Ahsan/g,"哈亚特·阿赫桑"); 
htmlstr=htmlstr.replace(/He GuoLi/g,"贺国立"); 
htmlstr=htmlstr.replace(/Hon Hei Cho/g,"楚汉义"); 
htmlstr=htmlstr.replace(/Hong SongYan/g,"洪松岩");
htmlstr=htmlstr.replace(/Huang BingChen/g,"黄秉辰"); 
htmlstr=htmlstr.replace(/Iñaki Martín/g,"伊拿基·马丁");
htmlstr=htmlstr.replace(/Jesús Manuel Ornelas/g,"热苏斯·曼努埃尔·奥尼拉斯"); 
htmlstr=htmlstr.replace(/Ji YaoKun/g,"姬耀坤"); 
htmlstr=htmlstr.replace(/Kong HanWen/g,"孔涵文"); 
htmlstr=htmlstr.replace(/Kong PuLiang/g,"孔璞亮"); 
htmlstr=htmlstr.replace(/Lang YuanAn/g,"郎元庵"); 
htmlstr=htmlstr.replace(/Li JianTing/g,"李坚霆"); 
htmlstr=htmlstr.replace(/Liu Qi/g,"刘琦"); 
htmlstr=htmlstr.replace(/Long MingXuan/g,"龙鸣轩"); 
htmlstr=htmlstr.replace(/Lu XuHao/g,"卢胥昊"); 
htmlstr=htmlstr.replace(/Makis Babesis/g,"玛基斯·巴贝西斯"); 
htmlstr=htmlstr.replace(/Pan ChunMan/g,"潘淳慢"); 
htmlstr=htmlstr.replace(/Pan ShuaiJun/g,"潘率军"); 
htmlstr=htmlstr.replace(/Pasquale Chatelain/g,"帕斯奎尔·沙特兰"); 
htmlstr=htmlstr.replace(/Qian YeCheng/g,"钱业诚"); 
htmlstr=htmlstr.replace(/Rafał Malawski/g,"拉法乌·马拉夫斯基"); 
htmlstr=htmlstr.replace(/Shi LiQin/g,"石励勤"); 
htmlstr=htmlstr.replace(/Shi TanChao/g,"石叹超"); 
htmlstr=htmlstr.replace(/Sun RenHuan/g,"孙仁焕"); 
htmlstr=htmlstr.replace(/Tabib Ahsan/g,"塔毕布·阿赫桑"); 
htmlstr=htmlstr.replace(/Tian Ye/g,"田野"); 
htmlstr=htmlstr.replace(/Tie ZiMeng/g,"铁子猛"); 
htmlstr=htmlstr.replace(/Umar Al Issaoui/g,"欧麦尔·阿勒伊萨乌伊");
htmlstr=htmlstr.replace(/Wan DuXu/g,"宛度诩"); 
htmlstr=htmlstr.replace(/Wang LinTao/g,"王麟韬"); 
htmlstr=htmlstr.replace(/Xiao GuanQi/g,"肖冠麒"); 
htmlstr=htmlstr.replace(/Xuan Nan/g,"宣南"); 
htmlstr=htmlstr.replace(/Xue Bin/g,"薛斌"); 
htmlstr=htmlstr.replace(/Yan ChangBiao/g,"杨昌杓"); 
htmlstr=htmlstr.replace(/Yang WeiZhuang/g,"杨维庄"); 
htmlstr=htmlstr.replace(/Zero Alshomrani/g,"泽罗·阿尔沙姆拉尼"); 
htmlstr=htmlstr.replace(/Zhao JiuZhou/g,"赵九洲"); 
htmlstr=htmlstr.replace(/Zhong RuoFei/g,"钟若飞"); 
htmlstr=htmlstr.replace(/Zhong YueYu/g,"钟跃宇"); 
htmlstr=htmlstr.replace(/Zhou Fei/g,"周飞");
htmlstr=htmlstr.replace(/Zhu HaiPeng/g,"朱海鹏"); 

//No.70
//SC.酒城2019
htmlstr=htmlstr.replace(/Liu XiaoTian/g,"柳笑天");
htmlstr=htmlstr.replace(/Weng ChengZi/g,"翁呈梓");
htmlstr=htmlstr.replace(/Xie ZeQi/g,"谢泽琪");
htmlstr=htmlstr.replace(/Gong LinHu/g,"巩林虎"); 
htmlstr=htmlstr.replace(/Cui LiGuang/g,"崔厉光"); 
htmlstr=htmlstr.replace(/Hou XiaoYu/g,"候小鱼"); 

//No.71
//WuHan.FC
htmlstr=htmlstr.replace(/Lei TianZi/g,"雷天子"); 
htmlstr=htmlstr.replace(/Liu EnLai/g,"刘恩来");

//No.72
//迷弟的小尤文
htmlstr=htmlstr.replace(/Chen Huo/g,"陈霍");
htmlstr=htmlstr.replace(/Cui TongShu/g,"崔彤舒");
htmlstr=htmlstr.replace(/Fabien_Bassett/g,"法比安·巴塞特");
htmlstr=htmlstr.replace(/Giga Katsitadze/g,"吉加·卡奇塔泽");
htmlstr=htmlstr.replace(/Jairo Alberto Vanegas/g," 杰罗·阿尔贝托·瓦内加斯");
htmlstr=htmlstr.replace(/Jiang DiZhou/g,"蒋帝舟");
htmlstr=htmlstr.replace(/Jiao RuiHao/g,"焦瑞豪");
htmlstr=htmlstr.replace(/Ke ShunCheng/g,"柯舜程");
htmlstr=htmlstr.replace(/Michalis Thrileontas/g,"米查利斯·特里隆塔斯");
htmlstr=htmlstr.replace(/Mu ChenJun/g,"沐辰俊");
htmlstr=htmlstr.replace(/Quon De Almeida/g,"昆·德·阿尔梅达");
htmlstr=htmlstr.replace(/Ramaz Natriashvil/g,"拉马兹·纳特里阿什维尔");
htmlstr=htmlstr.replace(/Sang ChaoChe/g,"桑超澈");
htmlstr=htmlstr.replace(/Shi JinYuan/g,"施锦渊");
htmlstr=htmlstr.replace(/Tao ShuaiQi/g,"陶帅奇");
htmlstr=htmlstr.replace(/Wang ZuGuang/g,"王祖光");
htmlstr=htmlstr.replace(/Yang HongHai/g,"杨鸿海");
htmlstr=htmlstr.replace(/You PeiYuan/g,"游裴袁");
htmlstr=htmlstr.replace(/Yuan XiLian/g,"袁熙廉");
htmlstr=htmlstr.replace(/Zakhar Oliynyk/g,"扎哈尔·奥利尼克");

//No.73
//深圳飞鹏
htmlstr=htmlstr.replace(/Emilis Winn/g,"艾米利斯·温恩"); 
htmlstr=htmlstr.replace(/Fritz Taafe/g,"弗里茨·塔菲");
htmlstr=htmlstr.replace(/Jared Chávez/g,"贾里德·查韦斯"); 
htmlstr=htmlstr.replace(/Jian XuFu/g,"建徐福"); 
htmlstr=htmlstr.replace(/Li XiuQuan/g,"李秀全"); 
htmlstr=htmlstr.replace(/Ma JiQin/g,"马吉琴"); 
htmlstr=htmlstr.replace(/Zheng LiJun/g,"郑丽君"); 

//No.74
//旅行者
htmlstr=htmlstr.replace(/Cheng XuanYi/g,"程宣翼");
htmlstr=htmlstr.replace(/Cheng YiDe/g,"成易德");
htmlstr=htmlstr.replace(/Gao HaiDong/g,"高海东");
htmlstr=htmlstr.replace(/Rong Yang/g,"容杨");
htmlstr=htmlstr.replace(/Tao LingPu/g,"陶令普"); 
htmlstr=htmlstr.replace(/Xue Rui/g,"薛瑞");
htmlstr=htmlstr.replace(/Zhao MaoSheng/g,"赵昴升"); 
htmlstr=htmlstr.replace(/Zheng HanTian/g,"郑含天"); 
htmlstr=htmlstr.replace(/Zheng YongBo/g,"郑永波"); 

//No.75
//弑影天下 
htmlstr=htmlstr.replace(/André Müller/g,"安德烈·穆勒"); 
htmlstr=htmlstr.replace(/Bai KeZhi/g,"百克之"); 
htmlstr=htmlstr.replace(/Cai TaoYu/g,"蔡涛宇"); 
htmlstr=htmlstr.replace(/Christophe Houdt/g,"克里斯·多夫豪德");
htmlstr=htmlstr.replace(/Ding CaiMao/g,"丁才貌"); 
htmlstr=htmlstr.replace(/Gu ZhanYin/g,"古展尹"); 
htmlstr=htmlstr.replace(/Guan ChuGe/g,"关楚阁"); 
htmlstr=htmlstr.replace(/Guo XiaoGuang/g,"郭晓光"); 
htmlstr=htmlstr.replace(/Hou JingYang/g,"侯敬杨"); 
htmlstr=htmlstr.replace(/HuYan XiuMiao/g,"呼延秀苗"); 
htmlstr=htmlstr.replace(/Ioan Morosanu/g,"莫罗·萨努"); 
htmlstr=htmlstr.replace(/Ji ZhuZi/g,"姬诛姿");
htmlstr=htmlstr.replace(/Lai YanJun/g,"赖彦均"); 
htmlstr=htmlstr.replace(/Lei ZhanYing/g,"雷展映"); 
htmlstr=htmlstr.replace(/Li YanHan/g,"李炎翰"); 
htmlstr=htmlstr.replace(/Li YinJie/g,"李寅杰"); 
htmlstr=htmlstr.replace(/Liu YunFeng/g,"陆云丰"); 
htmlstr=htmlstr.replace(/Lv XiLian/g,"吕席镰"); 
htmlstr=htmlstr.replace(/Ma YuPeng/g,"马羽鹏"); 
htmlstr=htmlstr.replace(/Man ChunJi/g,"满淳济"); 
htmlstr=htmlstr.replace(/Marvin Wuillemin/g,"马文·维尔曼"); 
htmlstr=htmlstr.replace(/Menashe Cohen/g,"梅纳什·科恩"); 
htmlstr=htmlstr.replace(/Salem Ferrand/g,"塞勒姆·费朗"); 
htmlstr=htmlstr.replace(/SiMa ZhuCheng/g,"司马诸城"); 
htmlstr=htmlstr.replace(/Song LiQiang/g,"宋黎强"); 
htmlstr=htmlstr.replace(/Sun YaoWu/g,"孙姚武"); 
htmlstr=htmlstr.replace(/Tie ChunMan/g,"铁春满"); 
htmlstr=htmlstr.replace(/Wu MinYan/g,"吴名言"); 
htmlstr=htmlstr.replace(/Yao ShunFeng/g,"姚舜烽"); 
htmlstr=htmlstr.replace(/Yu LiDong/g,"于离冬"); 
htmlstr=htmlstr.replace(/Zhao SiJie/g,"赵司捷"); 
htmlstr=htmlstr.replace(/Zhao XueLin/g,"赵学麟"); 
htmlstr=htmlstr.replace(/Zu WeiJia/g,"祖卫骆"); 

//4153649
//No.76
//泉州全城
htmlstr=htmlstr.replace(/Ismo Aho/g,"伊斯莫·阿霍"); 
htmlstr=htmlstr.replace(/He JingYu/g,"何靖宇"); 
htmlstr=htmlstr.replace(/Ding XiaoHao/g,"丁小浩"); 
htmlstr=htmlstr.replace(/Ye YiXun/g,"叶一勋"); 
htmlstr=htmlstr.replace(/Sang YaoHua/g,"桑尧华"); 
htmlstr=htmlstr.replace(/Huang YueYu/g,"黄月宇"); 
htmlstr=htmlstr.replace(/Bao XiaoJun/g,"包小军 "); 
htmlstr=htmlstr.replace(/Xuan JunNan/g,"宣俊楠"); 
htmlstr=htmlstr.replace(/Yang ShaoYi/g,"杨少毅"); 
htmlstr=htmlstr.replace(/You WeiGuo/g,"尤卫国"); 
htmlstr=htmlstr.replace(/You LinHu/g,"尤林虎"); 
htmlstr=htmlstr.replace(/Lv YongTao/g,"吕永涛"); 
htmlstr=htmlstr.replace(/Song NiMa/g,"宋逆麻"); 
htmlstr=htmlstr.replace(/Qiao XiaoRui/g,"乔晓瑞"); 
htmlstr=htmlstr.replace(/Su RuiLong/g,"苏瑞龙"); 
htmlstr=htmlstr.replace(/Li ZhiPing/g,"李志平");

//No.77
//天佑圣西罗
htmlstr=htmlstr.replace(/Bai TieLin/g,"白铁林");
htmlstr=htmlstr.replace(/Cheng XieLin/g,"程燮麟");
htmlstr=htmlstr.replace(/Diao BoYun/g,"刁博云");
htmlstr=htmlstr.replace(/Ding XiaoYao/g,"丁逍遥");
htmlstr=htmlstr.replace(/Gan ChunQuan/g,"甘春泉");
htmlstr=htmlstr.replace(/GongSun Shu/g,"公孙述");
htmlstr=htmlstr.replace(/Gou YangNan/g,"苟阳楠");
htmlstr=htmlstr.replace(/He YongHuai/g,"何咏怀");
htmlstr=htmlstr.replace(/Huang XiaoDong/g,"黄晓东");
htmlstr=htmlstr.replace(/Huo GuangMing/g,"霍光明");
htmlstr=htmlstr.replace(/Jiang Cao/g,"姜草");
htmlstr=htmlstr.replace(/Lan ZeXi/g,"兰泽西");
htmlstr=htmlstr.replace(/Lei KaiMing/g,"雷凯铭");
htmlstr=htmlstr.replace(/Li JiaQian/g,"李嘉乾");
htmlstr=htmlstr.replace(/Mi Cen/g,"米岑");
htmlstr=htmlstr.replace(/Ou RongHeng/g,"区容珩");
htmlstr=htmlstr.replace(/Qin QianShi/g,"秦千石");
htmlstr=htmlstr.replace(/Shang ZeYong/g,"尚泽勇");
htmlstr=htmlstr.replace(/Shen ZhiHuan/g,"沈志欢");
htmlstr=htmlstr.replace(/Shu DanYang/g,"舒丹阳");
htmlstr=htmlstr.replace(/Tao YunXiang/g,"陶云翔");
htmlstr=htmlstr.replace(/Tian ChangHao/g,"田长浩");
htmlstr=htmlstr.replace(/Tian SiCheng/g,"田思成");
htmlstr=htmlstr.replace(/Wan MingYue/g,"万铭岳");
htmlstr=htmlstr.replace(/Wang XiaoPing/g,"王小平");
htmlstr=htmlstr.replace(/Wu ShengQiao/g,"吴胜桥");
htmlstr=htmlstr.replace(/Xiang YangChao/g,"向阳超");
htmlstr=htmlstr.replace(/Xu XianPing/g,"徐宪平");
htmlstr=htmlstr.replace(/You EnHua/g,"尤恩华");
htmlstr=htmlstr.replace(/Zeng GuoSheng/g,"曾国盛");
htmlstr=htmlstr.replace(/Zhang FangXu/g,"张方旭");
htmlstr=htmlstr.replace(/Zhao ShunXin/g,"赵顺新");
htmlstr=htmlstr.replace(/Zhu Han/g,"朱涵");

//No.78
//新疆海星
htmlstr=htmlstr.replace(/Bai TengFei/g,"白腾飞");
htmlstr=htmlstr.replace(/Bi MAZiJun/g,"毕马子君");
htmlstr=htmlstr.replace(/Cao QunLi/g,"曹群立");
htmlstr=htmlstr.replace(/Di ZhangRen/g,"狄长仁");
htmlstr=htmlstr.replace(/Fu WenZhai/g,"傅文宰");
htmlstr=htmlstr.replace(/He YouCai/g,"何有财");
htmlstr=htmlstr.replace(/Hong WeiJian/g,"洪伟坚");
htmlstr=htmlstr.replace(/Ke XueShi/g,"柯学识");
htmlstr=htmlstr.replace(/Lin Jin/g,"林晋");
htmlstr=htmlstr.replace(/Lin LiFu/g,"林立夫");
htmlstr=htmlstr.replace(/Mu ShaoQuan/g,"穆少全");
htmlstr=htmlstr.replace(/Song HaiJian/g,"宋海剑");
htmlstr=htmlstr.replace(/Tao GuiBin/g,"陶贵斌");
htmlstr=htmlstr.replace(/Tu HaiYuan/g,"屠海源");
htmlstr=htmlstr.replace(/Wang XiYan/g,"王析岩");
htmlstr=htmlstr.replace(/Yu YuanJi/g,"于元吉");
htmlstr=htmlstr.replace(/Zheng ZeXuan/g,"郑泽轩");
htmlstr=htmlstr.replace(/Zhu XiaoHu/g,"朱小虎");
htmlstr=htmlstr.replace(/Zhuang TianHao/g,"庄天浩");

//No.79
//福建茗桐
htmlstr=htmlstr.replace(/Ao ZiRan/g,"敖自然");
htmlstr=htmlstr.replace(/Deng MianXin/g,"邓绵信");
htmlstr=htmlstr.replace(/Gao KaiMing/g,"高凯鸣");
htmlstr=htmlstr.replace(/Gong YanBo/g,"龚彦博");
htmlstr=htmlstr.replace(/Guo YaJian/g,"郭亚坚");
htmlstr=htmlstr.replace(/Li JinPeng/g,"李锦鹏");
htmlstr=htmlstr.replace(/Lou LongShuai/g,"楼陇帅");
htmlstr=htmlstr.replace(/Ning Ce/g,"宁策");
htmlstr=htmlstr.replace(/Wang JingDong/g,"王京东");
htmlstr=htmlstr.replace(/Wu HongFei/g,"吴弘飞");
htmlstr=htmlstr.replace(/Xi KaiZhong/g,"习楷中");
htmlstr=htmlstr.replace(/Yang QiTeng/g,"杨启腾");
htmlstr=htmlstr.replace(/Yu YaLong/g,"于雅隆");
htmlstr=htmlstr.replace(/Yu YouPeng/g,"于佑鹏");

//No.80
//皇家南河体育中心
htmlstr=htmlstr.replace(/Bian LiXin/g,"卞立新");
htmlstr=htmlstr.replace(/DuGu SongHai/g,"独孤松海");
htmlstr=htmlstr.replace(/Guan YouLin/g,"关佑霖");
htmlstr=htmlstr.replace(/Hu HanYu/g,"胡翰宇");
htmlstr=htmlstr.replace(/Huang DingFa/g,"黄丁发");
htmlstr=htmlstr.replace(/Lin PengYi/g,"林鹏翼");
htmlstr=htmlstr.replace(/Lu YeCheng/g,"路叶尘");
htmlstr=htmlstr.replace(/Qian HuiChen/g,"乾慧晨");
htmlstr=htmlstr.replace(/She YuHao/g,"佘雨豪");
htmlstr=htmlstr.replace(/Sun HongBo/g,"孙洪波");
htmlstr=htmlstr.replace(/Tan RongJi/g,"谭镕基");
htmlstr=htmlstr.replace(/Tong YiXuan/g,"童宜轩");
htmlstr=htmlstr.replace(/Wu ZeMin/g,"武泽民");
htmlstr=htmlstr.replace(/XianYu ChengDong/g,"鲜于晟栋");
htmlstr=htmlstr.replace(/Zhao LongTeng/g,"赵龙腾");

//3631756
//No.81
//上海上港FC
htmlstr=htmlstr.replace(/Fu XianXiu/g,"付先秀"); 
htmlstr=htmlstr.replace(/He ZhengYang/g,"何正阳"); 
htmlstr=htmlstr.replace(/Jian ChuiChui/g,"简锤锤"); 
htmlstr=htmlstr.replace(/Jian NanHai/g,"简南海"); 
htmlstr=htmlstr.replace(/Jing ShengLong/g,"景胜龙"); 
htmlstr=htmlstr.replace(/Lin JianWei/g,"林建伟"); 
htmlstr=htmlstr.replace(/Ling GuoYu/g,"凌国玉"); 
htmlstr=htmlstr.replace(/Liu ZhiZhi/g,"刘志智"); 
htmlstr=htmlstr.replace(/Meng KuanJi/g,"孟宽吉");
htmlstr=htmlstr.replace(/Mu YuYu/g,"穆玉玉"); 
htmlstr=htmlstr.replace(/Niu Yun/g,"牛云"); 
htmlstr=htmlstr.replace(/Peng ChenHao/g,"彭成浩"); 
htmlstr=htmlstr.replace(/Qiu QiZheng/g,"邱启正"); 
htmlstr=htmlstr.replace(/Rao RuiMing/g,"饶瑞明"); 
htmlstr=htmlstr.replace(/Shi CuiWei/g,"石翠伟"); 
htmlstr=htmlstr.replace(/Shu WenYong/g,"舒文勇"); 
htmlstr=htmlstr.replace(/Tai QingLin/g,"邰庆林"); 
htmlstr=htmlstr.replace(/Wang RaoDong/g,"王饶东"); 
htmlstr=htmlstr.replace(/Yang HuaShao/g,"杨华韶"); 
htmlstr=htmlstr.replace(/Zhuang YongAn/g,"庄永安"); 

//4413770
//No.82
//Team Yell 呐喊队 
htmlstr=htmlstr.replace(/Chen YongZhe/g,"陈勇者"); 
htmlstr=htmlstr.replace(/Fei SenHao/g,"费森毫"); 
htmlstr=htmlstr.replace(/Gao WeiFeng/g,"高微风");
htmlstr=htmlstr.replace(/Gao XiaoHui/g,"郜小辉"); 
htmlstr=htmlstr.replace(/Gu XueQian/g,"古学谦"); 
htmlstr=htmlstr.replace(/Han XiaoXin/g,"韩霄新"); 
htmlstr=htmlstr.replace(/Li TingSheng/g,"李庭圣"); 
htmlstr=htmlstr.replace(/Lin ZhiGang/g,"林志刚"); 
htmlstr=htmlstr.replace(/Liu DaZhu/g,"刘大猪"); 
htmlstr=htmlstr.replace(/Liu XinKai/g,"柳心开"); 
htmlstr=htmlstr.replace(/Long BingJie/g,"龙冰结"); 
htmlstr=htmlstr.replace(/Long HenShui/g,"龙恨水"); 
htmlstr=htmlstr.replace(/Lu LeLe/g,"路乐乐"); 
htmlstr=htmlstr.replace(/Mao QiLong/g,"毛骑龙"); 
htmlstr=htmlstr.replace(/Ou JiaXuan/g,"欧稼轩"); 
htmlstr=htmlstr.replace(/Qi XuHeYue/g,"齐绪鹤月"); 
htmlstr=htmlstr.replace(/Qiang RuiLun/g,"强锐伦"); 
htmlstr=htmlstr.replace(/Shen ZhiQiang/g,"申至强"); 
htmlstr=htmlstr.replace(/Shi KeZhen/g,"石克朕"); 
htmlstr=htmlstr.replace(/Tang ZhiXiong/g,"唐之雄"); 
htmlstr=htmlstr.replace(/Xin Bin/g,"辛斌"); 
htmlstr=htmlstr.replace(/Xu DeXin/g,"徐德馨"); 
htmlstr=htmlstr.replace(/Ye WeiGang/g,"叶为纲"); 
htmlstr=htmlstr.replace(/Ying PeiFu/g,"赢佩甫"); 
htmlstr=htmlstr.replace(/Zhangsun ZhongGuo/g,"长孙重国"); 
htmlstr=htmlstr.replace(/Zhao LiBin/g,"赵礼彬"); 
htmlstr=htmlstr.replace(/Zhao LongJi/g,"赵隆机"); 

//No.83
//长沙二一
htmlstr=htmlstr.replace(/Cao GeZhuo/g,"曹葛卓");
htmlstr=htmlstr.replace(/Chen ZhongYao/g,"陈中尧");
htmlstr=htmlstr.replace(/Cui MuZong/g,"崔穆宗");
htmlstr=htmlstr.replace(/Du Di/g,"杜狄");
htmlstr=htmlstr.replace(/Fan BaoHong/g,"范保宏");
htmlstr=htmlstr.replace(/Han QingLiang/g,"韩庆亮");
htmlstr=htmlstr.replace(/Huang Lijie/g,"黄立杰");
htmlstr=htmlstr.replace(/Jin JiaFeng/g,"金嘉丰");
htmlstr=htmlstr.replace(/Kang TaiZhen/g,"康泰真");
htmlstr=htmlstr.replace(/Le JingGe/g,"乐京格");
htmlstr=htmlstr.replace(/Li PeiGen/g,"李培根");
htmlstr=htmlstr.replace(/Liao GengYang/g,"廖耿阳");
htmlstr=htmlstr.replace(/Nong XiaoKai/g,"农小凯");
htmlstr=htmlstr.replace(/Pan JiaHao/g,"潘家豪");
htmlstr=htmlstr.replace(/She HaiMing/g,"佘海鸣");
htmlstr=htmlstr.replace(/Tang FeiFan/g,"唐非凡");
htmlstr=htmlstr.replace(/Tie RuoFei/g,"铁若飞");
htmlstr=htmlstr.replace(/Tong DeGang/g,"童德刚");
htmlstr=htmlstr.replace(/Xi ChengYan/g,"奚成彦");
htmlstr=htmlstr.replace(/Xu JiYong/g,"许吉勇");
htmlstr=htmlstr.replace(/Xu WeiJian/g,"许伟坚");
htmlstr=htmlstr.replace(/Yang ZhenQiang/g,"杨振强");
htmlstr=htmlstr.replace(/Zhou HaiGuang/g,"周海光");
htmlstr=htmlstr.replace(/Zhou ShiRong/g,"周士荣");
htmlstr=htmlstr.replace(/Zhou YuXi/g,"周禹溪");
htmlstr=htmlstr.replace(/Zhuang ShangKun/g,"庄尚坤");

//No.84
//江西南昌八一
htmlstr=htmlstr.replace(/Cao_HeXuan/g,"曹和旋"); 
htmlstr=htmlstr.replace(/Chen_LuoJia/g,"陈珞珈"); 
htmlstr=htmlstr.replace(/Cui_JiQing/g,"崔吉庆"); 
htmlstr=htmlstr.replace(/Fang_ChaoFan/g,"方超凡"); 
htmlstr=htmlstr.replace(/Fang_XingLiang/g,"方兴亮"); 
htmlstr=htmlstr.replace(/Fei_JiaYou/g,"费家友"); 
htmlstr=htmlstr.replace(/Fei_WenYi/g,"费文艺"); 
htmlstr=htmlstr.replace(/Gu_ZhengDao/g,"顾正道"); 
htmlstr=htmlstr.replace(/Hao_YiFu/g,"郝逸夫"); 
htmlstr=htmlstr.replace(/Huo_JianKai/g,"霍建凯"); 
htmlstr=htmlstr.replace(/Ji_ShangKun/g,"纪尚昆"); 
htmlstr=htmlstr.replace(/Li_ChengZhong/g,"李成忠"); 
htmlstr=htmlstr.replace(/Li_Yunlu/g,"李云鹿"); 
htmlstr=htmlstr.replace(/Liang_SiCheng/g,"梁思成"); 
htmlstr=htmlstr.replace(/Lu_FuKuan/g,"陆福宽"); 
htmlstr=htmlstr.replace(/Lu_HaiYu/g,"陆海云");
htmlstr=htmlstr.replace(/Lu_ZhuCheng/g,"卢竹成"); 
htmlstr=htmlstr.replace(/Luo_HongYe/g,"罗宏业"); 
htmlstr=htmlstr.replace(/Luo_ShiLei/g,"罗石磊"); 
htmlstr=htmlstr.replace(/Meng_YuJian/g,"孟玉建"); 
htmlstr=htmlstr.replace(/Mu_KaiHong/g,"木开宏"); 
htmlstr=htmlstr.replace(/Na_TianTa/g,"纳天塔"); 
htmlstr=htmlstr.replace(/Qi_XueJie/g,"齐雪杰"); 
htmlstr=htmlstr.replace(/Shan_HanTian/g,"单汉天"); 
htmlstr=htmlstr.replace(/Sheng_YiZe/g,"盛一泽"); 
htmlstr=htmlstr.replace(/Shu_ZhaoQian/g,"舒兆钱"); 
htmlstr=htmlstr.replace(/Su_ZiLiang/g,"苏子良"); 
htmlstr=htmlstr.replace(/Tang_DaHeng/g,"唐大亨"); 
htmlstr=htmlstr.replace(/Wang_Xing/g,"王星"); 
htmlstr=htmlstr.replace(/Xin_YiLin/g,"辛立琳"); 
htmlstr=htmlstr.replace(/Xiong_HuaTian/g,"熊华天"); 
htmlstr=htmlstr.replace(/Yin_JinChao/g,"尹劲超"); 
htmlstr=htmlstr.replace(/Yu_MingWen/g,"于明文"); 
htmlstr=htmlstr.replace(/Yu_MingWen/g,"于明文"); 
htmlstr=htmlstr.replace(/Yuan_JinShan/g,"元金山"); 
htmlstr=htmlstr.replace(/ZhangLiang_DongPing/g,"张良东平"); 
htmlstr=htmlstr.replace(/Zhang_SanFeng/g,"张三丰"); 
htmlstr=htmlstr.replace(/Zhang_ZeWen/g,"张泽文"); 
htmlstr=htmlstr.replace(/Zhao_HongYang/g,"赵洪洋"); 
htmlstr=htmlstr.replace(/Zhao_JunRu/g,"赵俊儒"); 
htmlstr=htmlstr.replace(/Zheng_Zun/g,"郑遵"); 
htmlstr=htmlstr.replace(/Zong_HongJie/g,"钟宏杰"); 
htmlstr=htmlstr.replace(/Zou_BaiLiang/g,"邹白亮"); 
htmlstr=htmlstr.replace(/Zou_YunPeng/g,"邹云鹏"); 

//Huracán S.H
//No.85
htmlstr=htmlstr.replace(/Cao ZhenLong/g,"曹振龙"); 
htmlstr=htmlstr.replace(/Deng XinYuan/g,"邓欣远"); 
htmlstr=htmlstr.replace(/Fang GuanJun/g,"方冠君"); 
htmlstr=htmlstr.replace(/Fang TaiZhen/g,"方泰镇");
htmlstr=htmlstr.replace(/Hong LiGuang/g,"洪李广"); 
htmlstr=htmlstr.replace(/Jiang JiaJun/g,"蒋嘉军"); 
htmlstr=htmlstr.replace(/Li YanChun/g,"李延川"); 
htmlstr=htmlstr.replace(/Liang Ming/g,"梁鸣"); 
htmlstr=htmlstr.replace(/Lin ShiLing/g,"林世灵"); 
htmlstr=htmlstr.replace(/Lu XiangXian/g,"卢相贤"); 
htmlstr=htmlstr.replace(/Pan ZhaoHui/g,"潘朝辉"); 
htmlstr=htmlstr.replace(/Pang LiHong/g,"庞力鸿"); 
htmlstr=htmlstr.replace(/Pang YaLong/g,"庞亚龙"); 
htmlstr=htmlstr.replace(/Ping YongPo/g,"平永珀"); 
htmlstr=htmlstr.replace(/Shen ZhiYing/g,"沈止迎"); 
htmlstr=htmlstr.replace(/Shi MuZong/g,"施穆宗"); 
htmlstr=htmlstr.replace(/Shu WenWen/g,"舒雯雯"); 
htmlstr=htmlstr.replace(/Su JianKai/g,"苏建凯"); 
htmlstr=htmlstr.replace(/Wei XiZhi/g,"魏习之"); 
htmlstr=htmlstr.replace(/Wu HuanHuan/g,"吴欢欢"); 
htmlstr=htmlstr.replace(/Xue JiaJun/g,"薛佳俊"); 
htmlstr=htmlstr.replace(/Yan ZiDan/g,"严子丹"); 
htmlstr=htmlstr.replace(/Zhu ShiYun/g,"祝石云"); 

//No.86
//蟹堡王足球俱乐部 
htmlstr=htmlstr.replace(/Chao Xun/g,"晁巽"); 
htmlstr=htmlstr.replace(/DongFang ZiMeng/g,"东方紫梦"); 
htmlstr=htmlstr.replace(/Hong ZhouHong/g,"洪洲泓"); 
htmlstr=htmlstr.replace(/Lu WenYuan/g,"卢文远"); 
htmlstr=htmlstr.replace(/Luan YongLai/g,"栾咏莱"); 
htmlstr=htmlstr.replace(/Mou GaoYang/g,"牟高阳"); 
htmlstr=htmlstr.replace(/Ran BuQing/g,"冉簿清"); 
htmlstr=htmlstr.replace(/Sun ZhuoFan/g,"孙灼帆"); 
htmlstr=htmlstr.replace(/Tang Chi/g,"唐赤"); 
htmlstr=htmlstr.replace(/Xiang LingHuan/g,"项绫幻"); 
htmlstr=htmlstr.replace(/Yang YunTao/g,"杨韵涛"); 
htmlstr=htmlstr.replace(/Zhai CongRui/g,"翟聪叡"); 
htmlstr=htmlstr.replace(/ZhangLiang KaiGe/g,"张梁凯歌"); 
htmlstr=htmlstr.replace(/Zhu Da/g,"朱达"); 

//No.87
//武汉红金龙
htmlstr=htmlstr.replace(/Chen ChengGong/g,"陈成功"); 
htmlstr=htmlstr.replace(/Chu NuoYan/g,"楚诺延"); 
htmlstr=htmlstr.replace(/Deng JunBiao/g,"邓军彪"); 
htmlstr=htmlstr.replace(/Ding NingYuan/g,"丁宁远"); 
htmlstr=htmlstr.replace(/Dong ZeMin/g,"董泽闵"); 
htmlstr=htmlstr.replace(/Guo PengJie/g,"郭鹏杰"); 
htmlstr=htmlstr.replace(/Huo KangWen/g,"霍康文"); 
htmlstr=htmlstr.replace(/Kang XiuQing/g,"康修庆"); 
htmlstr=htmlstr.replace(/Li BoXuan/g,"李博轩"); 
htmlstr=htmlstr.replace(/Li Ren/g,"李仁"); 
htmlstr=htmlstr.replace(/Liang Shuang/g,"梁爽"); 
htmlstr=htmlstr.replace(/Lin YanHuai/g,"林闫怀"); 
htmlstr=htmlstr.replace(/Qiu JinSheng/g,"邱锦盛"); 
htmlstr=htmlstr.replace(/Sun Yong/g,"孙勇"); 
htmlstr=htmlstr.replace(/Tao YuBin/g,"陶育斌"); 
htmlstr=htmlstr.replace(/Xi XiRui/g,"习希瑞"); 
htmlstr=htmlstr.replace(/Xie XiaoXiang/g,"谢晓相"); 
htmlstr=htmlstr.replace(/Ye YuRong/g,"叶玉荣"); 
htmlstr=htmlstr.replace(/Yi ShiLi/g,"伊石理"); 
htmlstr=htmlstr.replace(/Yuan YiMin/g,"袁毅民"); 
htmlstr=htmlstr.replace(/Zhan ChuangYi/g,"詹创一"); 
htmlstr=htmlstr.replace(/Zhao DaWei/g,"赵大卫"); 

//No.88
//西部狂风
htmlstr=htmlstr.replace(/Du Tie/g,"杜铁"); 
htmlstr=htmlstr.replace(/Etzion Dunay/g,"以旬·杜内"); 
htmlstr=htmlstr.replace(/He ZeQiang/g,"贺择强"); 
htmlstr=htmlstr.replace(/Henrich Kolník/g,"亨里希·科尼克"); 
htmlstr=htmlstr.replace(/Ke ZuXian/g,"柯祖贤");
htmlstr=htmlstr.replace(/Lu Shi/g,"陆矢"); 

//No.89
//蹴鞠星期六
htmlstr=htmlstr.replace(/Ai JunQi/g,"艾军旗");
htmlstr=htmlstr.replace(/Ani Prenga/g,"阿尼·普伦加");
htmlstr=htmlstr.replace(/Cai YanTao/g,"蔡颜涛");
htmlstr=htmlstr.replace(/David Kantor/g,"戴维·坎特罗");
htmlstr=htmlstr.replace(/Ding HongZhi/g,"丁洪智");
htmlstr=htmlstr.replace(/Filip Chylewski/g,"菲利普·切列夫斯基");
htmlstr=htmlstr.replace(/Götz Salomon/g,"格策·塞拉蒙");
htmlstr=htmlstr.replace(/Jiang Ang/g,"姜昂");
htmlstr=htmlstr.replace(/Lin ChangQi/g,"林长琦");
htmlstr=htmlstr.replace(/Lin ZhiJian/g,"林志坚");
htmlstr=htmlstr.replace(/Luo HongSheng/g,"罗洪升");
htmlstr=htmlstr.replace(/Mo FuFu/g,"莫弗甫");
htmlstr=htmlstr.replace(/Pan HuiFeng/g,"潘汇丰");
htmlstr=htmlstr.replace(/Pi JiuTao/g,"皮九淘");
htmlstr=htmlstr.replace(/Shang YaoTong/g,"尚耀桐");
htmlstr=htmlstr.replace(/Shi DaiYu/g,"石岱羽");
htmlstr=htmlstr.replace(/Shi HaoJie/g,"石浩杰");
htmlstr=htmlstr.replace(/Sun ZhengTu/g,"孙征途");
htmlstr=htmlstr.replace(/Tian YanFei/g,"田雁飞");
htmlstr=htmlstr.replace(/Xu JunNing/g,"徐俊宁");
htmlstr=htmlstr.replace(/Yan ChengGong/g,"严成功");
htmlstr=htmlstr.replace(/Yang GuanQi/g,"杨冠麒");
htmlstr=htmlstr.replace(/Zhao JunBiao/g,"赵俊杓");
htmlstr=htmlstr.replace(/Zhuang ZuMing/g,"庄祖名");


//FC_B*LD
//No.90
htmlstr=htmlstr.replace(/Adrian Szabłowski/g,"阿德里安 恰布罗夫斯基");
htmlstr=htmlstr.replace(/Ai AnRong/g,"艾安容");
htmlstr=htmlstr.replace(/Ai LeiLei/g,"艾磊磊");
htmlstr=htmlstr.replace(/Bao HongYan/g,"包鸿雁");
htmlstr=htmlstr.replace(/Chen Chou/g,"陈丑");
htmlstr=htmlstr.replace(/Chen HuYi/g,"陈虎翼");
htmlstr=htmlstr.replace(/Chen JiangHua/g,"陈江华");
htmlstr=htmlstr.replace(/Chu ZhengDong/g,"楚正东");
htmlstr=htmlstr.replace(/Cui KeXing/g,"崔可星");
htmlstr=htmlstr.replace(/Deng ZhiGang/g,"邓志刚");
htmlstr=htmlstr.replace(/Ercole Levorato/g,"厄科尔 莱沃拉托");
htmlstr=htmlstr.replace(/Félix Salido/g,"菲利克斯 萨利多");
htmlstr=htmlstr.replace(/Han HongYe/g,"韩宏烨");
htmlstr=htmlstr.replace(/Huang XiaoWei/g,"黄小薇");
htmlstr=htmlstr.replace(/Iraklis Ferentinos/g,"伊拉克里斯 费伦迪诺斯");
htmlstr=htmlstr.replace(/Jakub Štefek/g,"雅库布 斯蒂菲克");
htmlstr=htmlstr.replace(/Lai ShiQiang/g,"赖石墙");
htmlstr=htmlstr.replace(/Lei ZhiYu/g,"雷志宇");
htmlstr=htmlstr.replace(/Leng Ke/g,"冷可");
htmlstr=htmlstr.replace(/Li QiXin/g,"李启信");
htmlstr=htmlstr.replace(/Liang LianCheng/g,"梁连城");
htmlstr=htmlstr.replace(/Liao ZeBin/g,"廖泽斌");
htmlstr=htmlstr.replace(/Lin JianBai/g,"林建白");
htmlstr=htmlstr.replace(/Liu ZiTeng/g,"刘子腾");
htmlstr=htmlstr.replace(/Lv ZhaoXian/g,"吕兆贤");
htmlstr=htmlstr.replace(/Ma ShengRui/g,"马圣瑞");
htmlstr=htmlstr.replace(/Ma YeShan/g,"马也骟");
htmlstr=htmlstr.replace(/Mario Tomiozzo/g,"马里奥 托米奥佐");
htmlstr=htmlstr.replace(/Mo WangSong/g,"莫望嵩");
htmlstr=htmlstr.replace(/Moritz Schmutzer/g,"莫里茨 舒穆策尔");
htmlstr=htmlstr.replace(/Niu YongYi/g,"牛勇毅");
htmlstr=htmlstr.replace(/Pang MaoZhen/g,"庞茂臻");
htmlstr=htmlstr.replace(/Qiao ShuaiQi/g,"乔帅气");
htmlstr=htmlstr.replace(/Qiu Gang/g,"球缸");
htmlstr=htmlstr.replace(/Ritchie Arendse/g,"里奇 阿伦德斯");
htmlstr=htmlstr.replace(/Ross Baines/g,"罗斯 巴恩斯");
htmlstr=htmlstr.replace(/Shang JianSheng/g,"商剑圣");
htmlstr=htmlstr.replace(/Shen FengFeng/g,"沈凤凤");
htmlstr=htmlstr.replace(/Shen QingSheng/g,"沈庆生");
htmlstr=htmlstr.replace(/Shen ShouWu/g,"伸手捂");
htmlstr=htmlstr.replace(/Su KeZhen/g,"苏可臻");
htmlstr=htmlstr.replace(/Su ShangKun/g,"苏尚坤");
htmlstr=htmlstr.replace(/Sun XiaoTian/g,"孙笑天");
htmlstr=htmlstr.replace(/Sun YaoHua/g,"孙耀华");
htmlstr=htmlstr.replace(/Sun ZhongShan/g,"孙中山");
htmlstr=htmlstr.replace(/Tan DeZhong/g,"谭德忠");
htmlstr=htmlstr.replace(/Wang YiHu/g,"旺已糊");
htmlstr=htmlstr.replace(/Wang ZhanPeng/g,"王展鹏");
htmlstr=htmlstr.replace(/Xi JianWen/g,"习建文");
htmlstr=htmlstr.replace(/Xia YongChi/g,"夏永驰");
htmlstr=htmlstr.replace(/Xu LiCheng/g,"许立程");
htmlstr=htmlstr.replace(/Xun XinTing/g,"荀新亭");
htmlstr=htmlstr.replace(/Yitzchak Altman/g,"伊茨恰克 阿尔特曼");
htmlstr=htmlstr.replace(/Yue XiangYang/g,"月向阳");
htmlstr=htmlstr.replace(/Yun QiYuan/g,"云起源");
htmlstr=htmlstr.replace(/Zhang KongMing/g,"张孔明");
htmlstr=htmlstr.replace(/Zheng WenJing/g,"郑文婧");
htmlstr=htmlstr.replace(/Zhou JiaJie/g,"周家杰");
htmlstr=htmlstr.replace(/Zhu JingTian/g,"朱景甜");
htmlstr=htmlstr.replace(/Zu Ji/g,"祖籍");

//No.91
//魔力联
htmlstr=htmlstr.replace(/Chu Yang/g,"楚阳"); 
htmlstr=htmlstr.replace(/Ding YaoZhi/g,"丁遥志"); 
htmlstr=htmlstr.replace(/Fu Lan/g,"弗兰"); 
htmlstr=htmlstr.replace(/He SongYan/g,"何松岩"); 
htmlstr=htmlstr.replace(/Kong LiangPing/g,"孔良平"); 
htmlstr=htmlstr.replace(/Lai ChenMing/g,"赖辰明");
htmlstr=htmlstr.replace(/Lian AnGuo/g,"连安国"); 
htmlstr=htmlstr.replace(/Lin YaHui/g,"林雅辉"); 
htmlstr=htmlstr.replace(/Mu HongCai/g,"沐宏才"); 
htmlstr=htmlstr.replace(/Shi ZhaoZhong/g,"石兆忠"); 
htmlstr=htmlstr.replace(/Sun JingTao/g,"孙景涛"); 
htmlstr=htmlstr.replace(/Sun ShiHao/g,"孙世豪"); 
htmlstr=htmlstr.replace(/Wu YunPeng/g,"吴云鹏"); 
htmlstr=htmlstr.replace(/Wu ZhaoWen/g,"吴兆文"); 
htmlstr=htmlstr.replace(/Yan QiMei/g,"颜齐眉"); 
htmlstr=htmlstr.replace(/Yu TieSheng/g,"于铁胜"); 
htmlstr=htmlstr.replace(/Zhan YiWei/g,"詹一伟"); 
htmlstr=htmlstr.replace(/Zhao TanChao/g,"赵潭超"); 

//No.92
//一江天FC
htmlstr=htmlstr.replace(/He ZhiJie|何志Jie/g,"何志杰");
htmlstr=htmlstr.replace(/Hu WeiMin/g,"胡伟民");
htmlstr=htmlstr.replace(/Zhang DongPing/g,"张东平");
htmlstr=htmlstr.replace(/Liao MingChang/g,"廖明昌");

//No.93
//weare
htmlstr=htmlstr.replace(/Cai XiJie/g,"蔡希杰");
htmlstr=htmlstr.replace(/Chen ChenXiaoTong/g,"陈晓彤");
htmlstr=htmlstr.replace(/Cui LeiLuo/g,"崔雷罗");
htmlstr=htmlstr.replace(/Han RuiLong/g,"韩瑞龙");
htmlstr=htmlstr.replace(/He YanSong/g,"何岩松");
htmlstr=htmlstr.replace(/Hu YuKun/g,"胡云坤");
htmlstr=htmlstr.replace(/Huo XiangXiang/g,"霍香香");
htmlstr=htmlstr.replace(/Ji LinGen/g,"金林根");
htmlstr=htmlstr.replace(/Jin ZiYi/g,"金子一");
htmlstr=htmlstr.replace(/Kang YiZhou/g,"康一周");
htmlstr=htmlstr.replace(/Ke CiFu/g,"柯慈福");
htmlstr=htmlstr.replace(/Long ZhiJiong/g,"龙之囧");
htmlstr=htmlstr.replace(/Lv FengMing/g,"吕凤鸣");
htmlstr=htmlstr.replace(/Mao GuangQi/g,"毛光奇");
htmlstr=htmlstr.replace(/Mo SanFeng/g,"莫三峰");
htmlstr=htmlstr.replace(/Qiao ZeDong/g,"乔泽东");
htmlstr=htmlstr.replace(/Shen WenYi/g,"沈文怡");
htmlstr=htmlstr.replace(/Sun XiangNan/g,"孙翔南");
htmlstr=htmlstr.replace(/Tao YingQuan/g,"陶英全");
htmlstr=htmlstr.replace(/Wan DaCheng/g,"万达城");
htmlstr=htmlstr.replace(/Wan Meng/g,"挽梦");
htmlstr=htmlstr.replace(/Wang YiJie/g,"王一杰");
htmlstr=htmlstr.replace(/Wu TingSheng/g,"吴庭胜");
htmlstr=htmlstr.replace(/Xue KuiAn/g,"薛奎安");
htmlstr=htmlstr.replace(/Ye YiSan/g,"叶一三");
htmlstr=htmlstr.replace(/Yin JiaHao/g,"尹家豪");
htmlstr=htmlstr.replace(/Zhao YongQi/g,"赵永奇");

//No.94
//山东高唐 
htmlstr=htmlstr.replace(/Shan JianQiang/g,"单建强"); 
htmlstr=htmlstr.replace(/Xue MaoRui/g,"薛茂瑞"); 
htmlstr=htmlstr.replace(/Lai JunSheng/g,"赖军胜"); 
htmlstr=htmlstr.replace(/Qiang JunHui/g,"强俊辉"); 
htmlstr=htmlstr.replace(/Bian GuoYu/g,"卞国宇"); 
htmlstr=htmlstr.replace(/Wen LiBin/g,"温立彬"); 
htmlstr=htmlstr.replace(/Cheng An/g,"程安"); 
htmlstr=htmlstr.replace(/Yi LiFu/g,"衣立福"); 
htmlstr=htmlstr.replace(/Fang YangNan/g,"方漾男"); 
htmlstr=htmlstr.replace(/Sang HaiJun/g,"桑海军"); 
htmlstr=htmlstr.replace(/Lang YanCheng/g,"郎岩城"); 
htmlstr=htmlstr.replace(/Li YaKai/g,"黎亚凯"); 
htmlstr=htmlstr.replace(/Tang Ming/g,"唐鸣"); 
htmlstr=htmlstr.replace(/Wu XinTing/g,"武信廷"); 
htmlstr=htmlstr.replace(/Zhao XuFei/g,"赵旭飞"); 
htmlstr=htmlstr.replace(/Xing ZhiLi/g,"邢志笠"); 
htmlstr=htmlstr.replace(/Tang DeCheng/g,"唐德承"); 
htmlstr=htmlstr.replace(/Deng DongLu/g,"邓东陆"); 
htmlstr=htmlstr.replace(/Du HaiYun/g,"杜海云"); 
htmlstr=htmlstr.replace(/Xie HuiPing/g,"谢惠平"); 
htmlstr=htmlstr.replace(/Zhang HongGen/g,"张洪根"); 
htmlstr=htmlstr.replace(/Zhan Chang/g,"展畅"); 
htmlstr=htmlstr.replace(/Li YuSen/g,"李玉森"); 
htmlstr=htmlstr.replace(/Cao ShiMing/g,"曹世明"); 
htmlstr=htmlstr.replace(/She Dong/g,"佘东"); 
htmlstr=htmlstr.replace(/Huo ZhiHuan/g,"霍之焕");

//No.95
//中国中原足球队 
htmlstr=htmlstr.replace(/Cai CaiYue/g,"蔡彩月"); 
htmlstr=htmlstr.replace(/Chen '姚明'YaoMing|Chen YaoMing/g,"陈耀明"); 
htmlstr=htmlstr.replace(/Chu QiHan/g,"楚启汉"); 
htmlstr=htmlstr.replace(/Cui ZhiYu/g,"崔志宇"); 
htmlstr=htmlstr.replace(/Ding TianXiang/g,"丁天祥"); 
htmlstr=htmlstr.replace(/Ding YiGang/g,"丁毅刚"); 
htmlstr=htmlstr.replace(/Fang ShanPing/g,"房山平");
htmlstr=htmlstr.replace(/Gan ShengQiao/g,"甘圣乔");
htmlstr=htmlstr.replace(/Gao TianMing/g,"高天明"); 
htmlstr=htmlstr.replace(/Gao Xi/g,"高熹"); 
htmlstr=htmlstr.replace(/Gao XiaoPeng/g,"高晓鹏");
htmlstr=htmlstr.replace(/Gao YuShuai/g,"高于帅"); 
htmlstr=htmlstr.replace(/He ChuGe/g,"何楚歌"); 
htmlstr=htmlstr.replace(/He HaoChen/g,"何浩辰");
htmlstr=htmlstr.replace(/Hou Cong/g,"侯聪"); 
htmlstr=htmlstr.replace(/Hu ChuGe/g,"胡楚歌");
htmlstr=htmlstr.replace(/Huang PinSu/g,"黄品苏"); 
htmlstr=htmlstr.replace(/Huo ChaoChe/g,"霍超车"); 
htmlstr=htmlstr.replace(/Jin HouLei/g,"金厚磊"); 
htmlstr=htmlstr.replace(/Lan YuHuan/g,"兰宇寰");
htmlstr=htmlstr.replace(/Li YuHuan/g,"黎宇寰"); 
htmlstr=htmlstr.replace(/Li ZiBo/g,"李淄博 ");
htmlstr=htmlstr.replace(/Lin JianBai/g,"林建白"); 
htmlstr=htmlstr.replace(/Liu LinJiang/g,"刘林江");
htmlstr=htmlstr.replace(/Liu SuMeng/g,"刘肃蒙");
htmlstr=htmlstr.replace(/Lu JunLing/g,"陆峻岭");
htmlstr=htmlstr.replace(/Luo BingChen/g,"洛炳琛"); 
htmlstr=htmlstr.replace(/Mao PengFei/g,"毛鹏飞"); 
htmlstr=htmlstr.replace(/Ou WuTao/g,"区武韬");
htmlstr=htmlstr.replace(/Pan YiLin/g,"潘毅麟"); 
htmlstr=htmlstr.replace(/Peng DingFa/g,"彭定发"); 
htmlstr=htmlstr.replace(/Qi Bu/g,"齐布"); 
htmlstr=htmlstr.replace(/Qiu MinBi/g,"邱民毕");
htmlstr=htmlstr.replace(/Rao NingTao/g,"饶宁涛"); 
htmlstr=htmlstr.replace(/Shen Chang/g,"申昌"); 
htmlstr=htmlstr.replace(/Sheng ChaoCe/g,"盛超策"); 
htmlstr=htmlstr.replace(/Song JiaQiang/g,"宋家强"); 
htmlstr=htmlstr.replace(/Song JiangTao/g,"宋江涛"); 
htmlstr=htmlstr.replace(/Su GouSheng/g,"苏狗剩"); 
htmlstr=htmlstr.replace(/Tang MingKai/g,"唐明凯");
htmlstr=htmlstr.replace(/Tang ShuaiShuai/g,"唐帅帅"); 
htmlstr=htmlstr.replace(/Tong RuYu/g,"童如玉"); 
htmlstr=htmlstr.replace(/Wan GanChang/g,"万赣昌");
htmlstr=htmlstr.replace(/Wan GanGang/g,"万敢刚"); 
htmlstr=htmlstr.replace(/Wang GuoYao/g,"王国耀"); 
htmlstr=htmlstr.replace(/Wang HaiBin/g,"王海滨"); 
htmlstr=htmlstr.replace(/Wen HuaJian/g,"温华健"); 
htmlstr=htmlstr.replace(/Wu GuCheng/g,"武孤城"); 
htmlstr=htmlstr.replace(/Xia RuiLong/g,"夏瑞龙"); 
htmlstr=htmlstr.replace(/Xing MingZe/g,"邢明泽"); 
htmlstr=htmlstr.replace(/Xue ChenBo/g,"薛晨博"); 
htmlstr=htmlstr.replace(/Xun DaDi/g,"荀大帝");
htmlstr=htmlstr.replace(/Xun PengFei/g,"荀鹏飞"); 
htmlstr=htmlstr.replace(/Yan Chun/g,"严春"); 
htmlstr=htmlstr.replace(/Ye Xiong/g,"叶雄"); 
htmlstr=htmlstr.replace(/Yi HanLin/g,"伊翰林"); 
htmlstr=htmlstr.replace(/Zhang WangWei/g,"张旺伟"); 
htmlstr=htmlstr.replace(/Zhang XiHua/g,"张西华"); 
htmlstr=htmlstr.replace(/Zhao SuHao/g,"赵肃昊"); 
htmlstr=htmlstr.replace(/Zhao ZiLiang/g,"赵子良");
htmlstr=htmlstr.replace(/Zhou ZhaoShun/g,"周兆顺"); 
htmlstr=htmlstr.replace(/Zhu ChenLong/g,"朱宸龙"); 
htmlstr=htmlstr.replace(/Zhuang GuiShan/g,"庄圭山"); 

//No.96
//梅斯奎恩辣无糖 
htmlstr=htmlstr.replace(/Dong Ya/g,"董崖"); 
htmlstr=htmlstr.replace(/Eugenijus Gimbutas/g,"尤金尼厄斯 金布塔斯"); 
htmlstr=htmlstr.replace(/Han Zhishen/g,"韩芝慎"); 
htmlstr=htmlstr.replace(/Jesús Ivuti/g,"耶稣 伊武帝"); 
htmlstr=htmlstr.replace(/Jørgen Wilhelmsen/g,"乔根 威廉森"); 
htmlstr=htmlstr.replace(/Kardal Suhail/g,"卡达尔 苏海勒"); 
htmlstr=htmlstr.replace(/Mei Xiongxiong/g,"梅熊熊"); 
htmlstr=htmlstr.replace(/Phillip Wright/g,"菲利普 莱特");
htmlstr=htmlstr.replace(/Xiong Yanxiao/g,"雄言笑"); 
htmlstr=htmlstr.replace(/Zhangsun Qianjin/g,"长孙乾瑾"); 

//No.97
//赤旗天下 
htmlstr=htmlstr.replace(/Lu JiYong/g,"陆冀勇"); 
htmlstr=htmlstr.replace(/Lu XiHe/g,"卢西荷"); 
htmlstr=htmlstr.replace(/Ma XueSen/g,"麻雪森"); 
htmlstr=htmlstr.replace(/NanGong YanWei/g,"南宫燕尾"); 
htmlstr=htmlstr.replace(/Qian Tai/g,"钱泰"); 
htmlstr=htmlstr.replace(/Tao YaDong/g,"陶亚东");
htmlstr=htmlstr.replace(/Wang DaZhan/g,"王大战"); 
htmlstr=htmlstr.replace(/Yan ZhenHui/g,"闫振辉"); 
htmlstr=htmlstr.replace(/Yuan DeCheng/g,"元德成"); 
htmlstr=htmlstr.replace(/Zhang YaoYang/g,"张耀扬"); 
htmlstr=htmlstr.replace(/Zhen XueSheng/g,"甄学生"); 
htmlstr=htmlstr.replace(/Zhou YanBo/g,"周颜波"); 
htmlstr=htmlstr.replace(/Zhu KaiXiong/g,"朱恺雄"); 

//No.98
//珞珈山
htmlstr=htmlstr.replace(/Tsotne Kaidarashvili/g,"措特内·凯达拉什维利");
htmlstr=htmlstr.replace(/Xi HaiFan/g,"习海凡");
htmlstr=htmlstr.replace(/Xu RunZhen/g,"许仁贞");
htmlstr=htmlstr.replace(/Zhang SuYi/g,"张素伊");
htmlstr=htmlstr.replace(/Zhao YueYu/g,"赵越雨");
htmlstr=htmlstr.replace(/Zhou SongHai/g,"周颂海");

//No.99
//ChaoZhou.SF_4502633
htmlstr=htmlstr.replace(/Tang ShanLang/g,"唐山狼");

//No.100
//和风细雨楼
htmlstr=htmlstr.replace(/Chen ChengMin/g,"陈诚民");
htmlstr=htmlstr.replace(/Deng ZeBin/g,"邓泽斌");
htmlstr=htmlstr.replace(/Fei QiChao/g,"斐启超");
htmlstr=htmlstr.replace(/Gan TingFeng/g,"甘廷枫");
htmlstr=htmlstr.replace(/Guo HouCheng/g,"郭侯诚");
htmlstr=htmlstr.replace(/Hu XiaoFang/g,"胡小芳");
htmlstr=htmlstr.replace(/Huo LinJiang/g,"霍麟强");
htmlstr=htmlstr.replace(/Ji WenGuang/g,"季文光");
htmlstr=htmlstr.replace(/Li ChunJi /g,"李春基");
htmlstr=htmlstr.replace(/Lin TongXin/g,"林同信");
htmlstr=htmlstr.replace(/Pang XiaoGang/g,"庞晓刚");
htmlstr=htmlstr.replace(/Shi SongYan/g,"石嵩燕");
htmlstr=htmlstr.replace(/Song JingPing/g,"宋镜平");
htmlstr=htmlstr.replace(/Sun LianZhi/g,"孙连志");
htmlstr=htmlstr.replace(/Wang YaoZhi/g,"王耀之");
htmlstr=htmlstr.replace(/Wang ZiYi/g,"王子一");
htmlstr=htmlstr.replace(/Wu TaiYuan/g,"吴泰源");
htmlstr=htmlstr.replace(/Wu YinChen/g,"吴印尘");
htmlstr=htmlstr.replace(/Xiao YiJi/g,"萧一机");
htmlstr=htmlstr.replace(/Xie YanJun/g,"谢燕君");
htmlstr=htmlstr.replace(/Ye QiLong/g,"叶启龙");
htmlstr=htmlstr.replace(/Zhao JiaQin/g,"赵家勤");
htmlstr=htmlstr.replace(/Zhou ShiJun/g,"周士军");

//No.101
//厦门海滨城市_4521237
htmlstr=htmlstr.replace(/Bao ZhongYi/g,"鲍忠义");
htmlstr=htmlstr.replace(/Bu ZuDe/g,"卜祖德");
htmlstr=htmlstr.replace(/Chu WenTong/g,"楚文通");
htmlstr=htmlstr.replace(/Deng RuiFei/g,"邓瑞飞");
htmlstr=htmlstr.replace(/Ding XuSheng/g,"丁旭生");
htmlstr=htmlstr.replace(/Duan Yao/g,"段尧");
htmlstr=htmlstr.replace(/Fei ShengYuan/g,"费盛园");
htmlstr=htmlstr.replace(/He ShuFeng/g,"何书峰");
htmlstr=htmlstr.replace(/Hua ZeDong/g,"华泽东");
htmlstr=htmlstr.replace(/Jiang GuangJie/g,"姜光杰");
htmlstr=htmlstr.replace(/Jing ChuanHua/g,"景传华");
htmlstr=htmlstr.replace(/Lei CunXi/g,"罗存熙");
htmlstr=htmlstr.replace(/Lei NanXing/g,"雷南星");
htmlstr=htmlstr.replace(/Lin YouZhi/g,"林佑智");
htmlstr=htmlstr.replace(/Lin YuShuai/g,"林玉帅");
htmlstr=htmlstr.replace(/Liu GuangNan/g,"刘光南");
htmlstr=htmlstr.replace(/Luo DuXu/g,"洛杜旭");
htmlstr=htmlstr.replace(/Mi XiaoXiang/g,"米晓祥");
htmlstr=htmlstr.replace(/Qian KeCheng/g,"钱克诚");
htmlstr=htmlstr.replace(/Qian ShengLi/g,"钱胜利");
htmlstr=htmlstr.replace(/Qiao Qin/g,"乔钦");
htmlstr=htmlstr.replace(/Qin JianKai/g,"秦建凯");
htmlstr=htmlstr.replace(/Sun BinBin/g,"孙斌斌");
htmlstr=htmlstr.replace(/Sun ZiBo/g,"孙淄博");
htmlstr=htmlstr.replace(/Wen ZeQiang/g,"文泽强");
htmlstr=htmlstr.replace(/Xie YouZhi/g,"谢游之");

//No.102
//Shanghai Purplepink_4530085
htmlstr=htmlstr.replace(/Bao TianLe/g,"鲍添乐");
htmlstr=htmlstr.replace(/Du FeiLong/g,"杜飞龙");
htmlstr=htmlstr.replace(/Ge YiZhe/g,"葛义哲");
htmlstr=htmlstr.replace(/Guo XiaoYong/g,"郭小勇");
htmlstr=htmlstr.replace(/He YiFan/g,"何一帆");
htmlstr=htmlstr.replace(/Hong YuGong/g,"洪与共");
htmlstr=htmlstr.replace(/Hua TaoYu/g,"华陶宇");
htmlstr=htmlstr.replace(/Huo WenChao/g,"霍文超");
htmlstr=htmlstr.replace(/Ji XiaoFei/g,"季小飞");
htmlstr=htmlstr.replace(/Li LongYu/g,"李龙宇");
htmlstr=htmlstr.replace(/Li YiAo/g,"李亦傲");
htmlstr=htmlstr.replace(/Liang ShiYun/g,"梁石陨");
htmlstr=htmlstr.replace(/Pan ShanPing/g,"潘善评");
htmlstr=htmlstr.replace(/Song NanHai/g,"宋南海");
htmlstr=htmlstr.replace(/Sun JingLong/g,"孙景隆");
htmlstr=htmlstr.replace(/Tan XiaoMing/g,"谭晓明");
htmlstr=htmlstr.replace(/Wei RongFa/g,"韦荣发");
htmlstr=htmlstr.replace(/Wei Su/g,"魏速");
htmlstr=htmlstr.replace(/Wu XuJun/g,"吴旭君");
htmlstr=htmlstr.replace(/Xu JiMi/g,"许继弥");
htmlstr=htmlstr.replace(/Xu MingHu/g,"徐明虎");
htmlstr=htmlstr.replace(/Zhang YunGuo/g,"张允国");
htmlstr=htmlstr.replace(/Zhao JiMing/g,"赵继铭");
htmlstr=htmlstr.replace(/Zhen YouSu/g,"甄由素");
htmlstr=htmlstr.replace(/Zhong JunHui/g,"钟俊辉");
htmlstr=htmlstr.replace(/Zhuang SiJian/g,"庄思剑");



//特殊名字
htmlstr=htmlstr.replace(/Liu DeHua/g,"刘德华");
htmlstr=htmlstr.replace(/Qi WuSheng/g,"戚务生");
htmlstr=htmlstr.replace(/Sun Ke/g,"孙可");
htmlstr=htmlstr.replace(/Zhang YiMou/g,"张艺谋");


//NT
htmlstr=htmlstr.replace(/Bei HuanZhen/g,"北焕臻");
htmlstr=htmlstr.replace(/Cheng 'Gerard Piqué' YaKe|Cheng YaKe/g,"程亚柯");
htmlstr=htmlstr.replace(/Gao WenYong/g,"高稳勇");
htmlstr=htmlstr.replace(/Gu YouXun/g,"顾游勋");
htmlstr=htmlstr.replace(/Guan JiangRui/g,"关江瑞");
htmlstr=htmlstr.replace(/Guo '锅盖' HeJing|Guo HeJing/g,"郭和靖");
htmlstr=htmlstr.replace(/He Zhu/g,"何著");
htmlstr=htmlstr.replace(/Huo ZhiLei/g,"霍志磊");
htmlstr=htmlstr.replace(/Kang WeiFei/g,"康韦飞");
htmlstr=htmlstr.replace(/Li Cong/g,"李聪");
htmlstr=htmlstr.replace(/Liu '刘学瑞' XueRui|Liu XueRui/g,"刘学瑞");
htmlstr=htmlstr.replace(/Ou '振兴中华' ZhenHua|Ou ZhenHua/g,"欧振华");
htmlstr=htmlstr.replace(/Song RuiKai/g,"宋瑞凯");
htmlstr=htmlstr.replace(/Sun YueFeng/g,"孙岳峰");
htmlstr=htmlstr.replace(/Tan JinSong/g,"谭劲嵩");
htmlstr=htmlstr.replace(/Tu 'Shi Ke' Fa|Tu Fa/g,"涂珐");
htmlstr=htmlstr.replace(/Wang '王瑞仑' RuiLun|Wang RuiLun/g,"王瑞伦");
htmlstr=htmlstr.replace(/Xu Ya/g,"徐亚");
htmlstr=htmlstr.replace(/Yin '淫威' WeiShen|Yin WeiShen/g,"尹威神");
htmlstr=htmlstr.replace(/Zhang ChangQing/g,"张长卿");
htmlstr=htmlstr.replace(/Zhao '赵四' YanLin|Zhao YanLin/g,"赵炎麟");
htmlstr=htmlstr.replace(/Zheng GaoJun/g,"郑高俊");
htmlstr=htmlstr.replace(/Weng JunTao/g,"翁俊涛");

//二字
htmlstr=htmlstr.replace(/Fan Heng/g,"范衡");
htmlstr=htmlstr.replace(/Guo Kun/g,"郭坤"); 
htmlstr=htmlstr.replace(/Hua Qiang/g,"华强"); 
htmlstr=htmlstr.replace(/Huang Wei/g,"黄威"); 
htmlstr=htmlstr.replace(/Huo Lie/g,"霍烈"); 
htmlstr=htmlstr.replace(/Qian Xi/g,"千禧");
htmlstr=htmlstr.replace(/Ruan Qi/g,"阮奇");
htmlstr=htmlstr.replace(/Wang Guo/g,"王国");
htmlstr=htmlstr.replace(/Zheng Yin/g,"郑印");
htmlstr=htmlstr.replace(/Zhuang Kuo/g,"装阔"); 

document.getElementsByTagName('html')[0].innerHTML=htmlstr;
//////////////////////////////////////////////////////////////////////////////////

function nametip(){
var htmlstr=document.getElementById("tooltip").innerHTML;


//No.1
//北京零点
htmlstr=htmlstr.replace(/Ling MuYuan/g,"凌穆辕");  
htmlstr=htmlstr.replace(/Li JinYu/g,"李金羽");  
htmlstr=htmlstr.replace(/Tang ShanLang/g,"唐山狼");  



//No.2
//义乌创达集团有限公司 
htmlstr=htmlstr.replace(/Wang YanFei/g,"王延飞"); 
htmlstr=htmlstr.replace(/Xie XueZheng/g,"谢学征"); 
htmlstr=htmlstr.replace(/Mo AiMin/g,"莫艾闵");
htmlstr=htmlstr.replace(/Zhu ZhongYou/g,"朱忠友");
htmlstr=htmlstr.replace(/Ye ShuRen/g,"叶庶仁"); 
htmlstr=htmlstr.replace(/Tie JiuZhou/g,"铁久洲");
htmlstr=htmlstr.replace(/Li YiKang/g,"李益康");

//No.3
//太原FC
htmlstr=htmlstr.replace(/Bi Xiao/g,"毕萧");
htmlstr=htmlstr.replace(/Bi ZhongTian/g,"毕中天");
htmlstr=htmlstr.replace(/Cao MiaoRui/g,"曹妙瑞");
htmlstr=htmlstr.replace(/Gao GuangZhong/g,"高光忠");
htmlstr=htmlstr.replace(/Gao XinYue/g,"高欣越");
htmlstr=htmlstr.replace(/Gong ChaoYuan/g,"宫朝原");
htmlstr=htmlstr.replace(/Guan Chun/g,"关淳");
htmlstr=htmlstr.replace(/Guo KangCheng/g,"郭康成");
htmlstr=htmlstr.replace(/Han MingYi/g,"韩明义");
htmlstr=htmlstr.replace(/He ShengYi/g,"何圣依");
htmlstr=htmlstr.replace(/He Zhi/g,"何志");
htmlstr=htmlstr.replace(/Hong DongBing/g,"洪东兵");
htmlstr=htmlstr.replace(/Hong WeiQiang/g,"洪伟强");
htmlstr=htmlstr.replace(/Hu JinPing/g,"胡金平");
htmlstr=htmlstr.replace(/Huang XiaoMing/g,"黄晓明");
htmlstr=htmlstr.replace(/Huang ZhiXuan/g,"黄智炫");
htmlstr=htmlstr.replace(/HuangFu PengHan/g,"皇甫澎瀚");
htmlstr=htmlstr.replace(/Jia DeChao/g,"贾德超");
htmlstr=htmlstr.replace(/Kong ZhenSheng/g,"孔振生");
htmlstr=htmlstr.replace(/Li DeNan|Li '小李飞刀' DeNan/g,"李德南");
htmlstr=htmlstr.replace(/Li FangZhuo/g,"李方卓");
htmlstr=htmlstr.replace(/Li KaiRen/g,"李开仁");
htmlstr=htmlstr.replace(/Li QiXian/g,"李齐贤");
htmlstr=htmlstr.replace(/Li RuiQiang/g,"李瑞强");
htmlstr=htmlstr.replace(/Liang JianChun/g,"梁建春");
htmlstr=htmlstr.replace(/Liang Liang/g,"梁良");
htmlstr=htmlstr.replace(/Liu Lu/g,"刘陆");
htmlstr=htmlstr.replace(/Lu XueFei/g,"陆学飞");
htmlstr=htmlstr.replace(/Ma LiQiang/g,"马立强");
htmlstr=htmlstr.replace(/Ma NingYuan/g,"马宁远");
htmlstr=htmlstr.replace(/Mi SanQiang/g,"米三强");
htmlstr=htmlstr.replace(/Niu XinKai/g,"牛新凯");
htmlstr=htmlstr.replace(/Ou ZhenHua/g,"欧振华");
htmlstr=htmlstr.replace(/Pan FengYi/g,"潘峰怡");
htmlstr=htmlstr.replace(/Qian HaiCheng/g,"钱海澄");
htmlstr=htmlstr.replace(/Qian PengCheng/g,"钱鹏程");
htmlstr=htmlstr.replace(/She JiHua/g,"佘继华");
htmlstr=htmlstr.replace(/Shen RuiLin/g,"沈瑞琳");
htmlstr=htmlstr.replace(/Shi JiangHua/g,"石江华");
htmlstr=htmlstr.replace(/Shi ZhiNing/g,"石志宁");
htmlstr=htmlstr.replace(/Si ZhengPeng/g,"司正鹏");
htmlstr=htmlstr.replace(/Sun Lei/g,"孙磊");
htmlstr=htmlstr.replace(/Wan Qiang/g,"万强");
htmlstr=htmlstr.replace(/Wang TieSheng/g,"王铁生");
htmlstr=htmlstr.replace(/XianYu RunTao/g,"鲜于润涛");
htmlstr=htmlstr.replace(/Xiang QiuMing/g,"项秋明");
htmlstr=htmlstr.replace(/Xie YiFan/g,"谢一凡");
htmlstr=htmlstr.replace(/Xiong JianQiang/g,"熊建强");
htmlstr=htmlstr.replace(/Yan FengSheng/g,"闫丰胜");
htmlstr=htmlstr.replace(/Ye DeNan/g,"叶德楠");
htmlstr=htmlstr.replace(/Yi HaiDong|Yi '一嗨咚' HaiDong/g,"易海东");
htmlstr=htmlstr.replace(/Zhai YueFei/g,"翟跃飞");
htmlstr=htmlstr.replace(/Zhang ChenXi/g,"张晨曦");
htmlstr=htmlstr.replace(/Zhang DaWei/g,"张达维");
htmlstr=htmlstr.replace(/Zhang YuanHang/g,"张远航");
htmlstr=htmlstr.replace(/Zhao BinJia/g,"赵彬嘉");
htmlstr=htmlstr.replace(/Zhao Yong/g,"赵勇");
htmlstr=htmlstr.replace(/Zhen XiangNan/g,"甄向楠");
htmlstr=htmlstr.replace(/Zhou PengZhi/g,"周鹏志");
htmlstr=htmlstr.replace(/Zhou TaoFu/g,"周涛福");
htmlstr=htmlstr.replace(/Zhou Zheng/g,"周正");
htmlstr=htmlstr.replace(/ZhuGe BinYi/g,"诸葛滨懿");
htmlstr=htmlstr.replace(/Zhuang Han/g,"庄寒");
htmlstr=htmlstr.replace(/Zhuang LongYuan/g,"庄龙渊");
htmlstr=htmlstr.replace(/Zu JiangHua/g,"祖江华");

//No.4
//纽约市市委办公室
htmlstr=htmlstr.replace(/Chen ChenYuan/g,"陈尘缘");
htmlstr=htmlstr.replace(/Dai WenXin/g,"戴闻盺");
htmlstr=htmlstr.replace(/Du ZhengYu/g,"杜征宇");
htmlstr=htmlstr.replace(/Fuk Chik Chow/g,"周符继");
htmlstr=htmlstr.replace(/Hu DaWei/g,"胡达维"); 
htmlstr=htmlstr.replace(/Hua BaoLiang/g,"华宝亮");
htmlstr=htmlstr.replace(/Ji MuZong/g,"季木宗"); 
htmlstr=htmlstr.replace(/Kang QuanShun/g,"康权舜"); 
htmlstr=htmlstr.replace(/Li RuiMing/g,"李锐铭");
htmlstr=htmlstr.replace(/Liu Ting/g,"刘挺"); 
htmlstr=htmlstr.replace(/MuRong KeXing/g,"慕容克星"); 
htmlstr=htmlstr.replace(/OuYang LongLong/g,"欧阳龙龙");
htmlstr=htmlstr.replace(/OuYang WenLiang/g,"欧阳文良");
htmlstr=htmlstr.replace(/Pan Shu/g,"潘树");
htmlstr=htmlstr.replace(/Qin MingHao/g,"秦明昊");
htmlstr=htmlstr.replace(/Qiu YunZhou/g,"邱云洲"); 
htmlstr=htmlstr.replace(/Shu ZeYong/g,"舒泽勇");
htmlstr=htmlstr.replace(/Tan XuanYi/g,"谭轩逸");
htmlstr=htmlstr.replace(/Wang Chou/g,"王畴");
htmlstr=htmlstr.replace(/Wu PeiZhao/g,"吴培朝");
htmlstr=htmlstr.replace(/Xun SiDe/g,"荀嗣德");
htmlstr=htmlstr.replace(/Yan JiangRui/g,"闫江瑞"); 
htmlstr=htmlstr.replace(/Yuan XiaoMa/g,"袁小马");
htmlstr=htmlstr.replace(/Zhan JiangRui/g,"詹江睿");
htmlstr=htmlstr.replace(/ZhangLiang ShangKun/g,"张良尚鲲");
htmlstr=htmlstr.replace(/Zhou MinWei/g,"周敏未");


//No.5
//川沙辅川
htmlstr=htmlstr.replace(/Ao JiHai/g,"岙冀海");
htmlstr=htmlstr.replace(/Bai DaShan/g,"白耷善");
htmlstr=htmlstr.replace(/Cai JiaJi/g,"蔡伽季");
htmlstr=htmlstr.replace(/Cai TaiZhen/g,"蔡台臻");
htmlstr=htmlstr.replace(/Cao YunDing/g,"曹耘町");
htmlstr=htmlstr.replace(/Chen ChaoWei/g,"陈朝潍");
htmlstr=htmlstr.replace(/Chen YiZhe/g,"陈益哲");
htmlstr=htmlstr.replace(/Cui Chen/g,"崔郴");
htmlstr=htmlstr.replace(/Du Hai/g,"杜海");
htmlstr=htmlstr.replace(/He YiJie/g,"何益节");
htmlstr=htmlstr.replace(/He YouLin/g,"贺忧临");
htmlstr=htmlstr.replace(/Jiang WeiShen/g,"蒋为慎");
htmlstr=htmlstr.replace(/Liao WeiShen/g,"廖韦深");
htmlstr=htmlstr.replace(/Lv FeiFan/g,"吕霏樊");
htmlstr=htmlstr.replace(/Lv FuCheng/g,"吕辅承");
htmlstr=htmlstr.replace(/Mao YuGong/g,"毛遇躬");
htmlstr=htmlstr.replace(/MuRong JunLi/g,"慕容隽笠");
htmlstr=htmlstr.replace(/Nong AnYi/g,"农安逸");
htmlstr=htmlstr.replace(/Qin XuJun/g,"秦绪均");
htmlstr=htmlstr.replace(/Sang YunLong/g,"桑匀垄");
htmlstr=htmlstr.replace(/Shi ZhiBo/g,"石知博");
htmlstr=htmlstr.replace(/Tan ZhaoHui/g,"谭召辉");
htmlstr=htmlstr.replace(/Xu JiaHe/g,"徐嘉禾");
htmlstr=htmlstr.replace(/Zhang BaiChuan/g,"张伯川");
htmlstr=htmlstr.replace(/Zhong GuoJie/g,"钟虢届");
htmlstr=htmlstr.replace(/Zhu ZuDe/g,"祝祖德");
htmlstr=htmlstr.replace(/Zu Yao KaiWen/g,"祖姚楷闻");

//Bayer 04 Leverkusen 
//No.6
htmlstr=htmlstr.replace(/Anas Nafti/g,"阿纳斯·纳法蒂"); 
htmlstr=htmlstr.replace(/Bai GuoHao/g,"白国豪"); 
htmlstr=htmlstr.replace(/Bu GaiJie/g,"卜垓杰"); 
htmlstr=htmlstr.replace(/Cecyliusz Gotowicki/g,"塞西柳丝·格托维斯基"); 
htmlstr=htmlstr.replace(/Chi HengZhi/g,"迟恒之"); 
htmlstr=htmlstr.replace(/Fan FengChui/g,"樊风吹"); 
htmlstr=htmlstr.replace(/Fang JiaMin/g,"方佳敏"); 
htmlstr=htmlstr.replace(/Fei ZiRan/g,"妃子冉"); 
htmlstr=htmlstr.replace(/Fu WenTao/g,"付文韬"); 
htmlstr=htmlstr.replace(/Hu LiangYu/g,"胡良宇"); 
htmlstr=htmlstr.replace(/Hu XueDong/g,"胡学冬"); 
htmlstr=htmlstr.replace(/Hua ZhongYi/g,"华中一"); 
htmlstr=htmlstr.replace(/Huang WuShuang/g,"皇无双"); 
htmlstr=htmlstr.replace(/Huang ZhuoJun/g,"黄卓君"); 
htmlstr=htmlstr.replace(/Isaac Weijgertze/g,"伊萨克·维嘉格雷泽"); 
htmlstr=htmlstr.replace(/Jae-Sun Mok/g,"孙缄默"); 
htmlstr=htmlstr.replace(/Jia MingHu/g,"贾明虎"); 
htmlstr=htmlstr.replace(/Jian HongJun/g,"建红军"); 
htmlstr=htmlstr.replace(/Kanaan Al Qanawati/g,"卡纳安·埃卡那瓦迪"); 
htmlstr=htmlstr.replace(/Lai RuiLin/g,"莱瑞林"); 
htmlstr=htmlstr.replace(/Li JianFeng/g,"李剑锋"); 
htmlstr=htmlstr.replace(/Lin BeiHai/g,"林北海");
htmlstr=htmlstr.replace(/Lin HaoRan/g,"林浩然"); 
htmlstr=htmlstr.replace(/Lin ShuangBang/g,"林双邦"); 
htmlstr=htmlstr.replace(/Liu JiaXian/g,"柳嘉仙"); 
htmlstr=htmlstr.replace(/Ma ZhongShi/g,"马中士"); 
htmlstr=htmlstr.replace(/Marko Arkko/g,"马尔科·阿珂"); 
htmlstr=htmlstr.replace(/Nie AnRong/g,"聂安荣"); 
htmlstr=htmlstr.replace(/Nong ZiYun/g,"农子云"); 
htmlstr=htmlstr.replace(/Pan YinLong/g,"潘银龙"); 
htmlstr=htmlstr.replace(/Peng YuXi/g,"彭玉玺"); 
htmlstr=htmlstr.replace(/Shang BoXuan/g,"尚博轩"); 
htmlstr=htmlstr.replace(/Shao YanQiu/g,"邵彦丘"); 
htmlstr=htmlstr.replace(/Tan ZiYi/g,"谭子仪"); 
htmlstr=htmlstr.replace(/Tong GouSheng/g,"童狗剩"); 
htmlstr=htmlstr.replace(/Wu YiXin/g,"吴一心"); 
htmlstr=htmlstr.replace(/Yang DengKe/g,"杨登科"); 
htmlstr=htmlstr.replace(/Yang ShaoQiu/g,"杨少秋"); 
htmlstr=htmlstr.replace(/You YuanHang/g,"游远航"); 
htmlstr=htmlstr.replace(/Yu GuoJian/g,"俞国坚"); 
htmlstr=htmlstr.replace(/Yu RongJi/g,"于荣吉"); 
htmlstr=htmlstr.replace(/Zhao YaWen/g,"赵亚文"); 
htmlstr=htmlstr.replace(/Zhi JinJie/g,"智金杰"); 
htmlstr=htmlstr.replace(/Zou ShouCheng/g,"邹守城"); 

//NO.7
//赤龙 
htmlstr=htmlstr.replace(/Cheng '张月鹿' ZeHua|Cheng ZeHua/g,"程泽华"); 
htmlstr=htmlstr.replace(/Fu '弱水旺' WangCai|Fu WangCai/g,"符旺财"); 
htmlstr=htmlstr.replace(/Gao '牛金牛' JunHao|Gao JunHao/g,"高俊豪"); 
htmlstr=htmlstr.replace(/Guo '鬼金羊' BangBin|Guo BangBin/g,"郭邦斌"); 
htmlstr=htmlstr.replace(/He '星日马' HengZhi|He HengZhi/g,"何衡之"); 
htmlstr=htmlstr.replace(/Huang YongFei/g,"黄永飞");
htmlstr=htmlstr.replace(/Ji '亢金龙' YanSheng|Ji YanSheng/g,"季炎升"); 
htmlstr=htmlstr.replace(/Ji '狻猊' BoXiang|Ji BoXiang/g,"纪博翔"); 
htmlstr=htmlstr.replace(/Jin '觜火猴' HanRu|Jin HanRu/g,"金汉茹"); 
htmlstr=htmlstr.replace(/Li '角木蛟' YingLong|Li YingLong/g,"黎应龙");
htmlstr=htmlstr.replace(/Lin '房日兔' SanZhen|Lin SanZhen/g,"林三震"); 
htmlstr=htmlstr.replace(/Mo '翼火蛇' FuSheng|Mo FuSheng/g,"莫福生"); 
htmlstr=htmlstr.replace(/Nan '心月狐' XinYue|Nan XinYue/g,"南歆越");
htmlstr=htmlstr.replace(/Rao '虚日鼠' YaoTong|Rao YaoTong/g,"饶耀彤"); 
htmlstr=htmlstr.replace(/Sang '逆鳞' ZhiXing|Sang ZhiXing/g,"桑之星"); 
htmlstr=htmlstr.replace(/Sha '奎木狼' WenXin|Sha WenXin/g,"沙文欣"); 
htmlstr=htmlstr.replace(/Shi '井木犴' BaoLong|Shi BaoRong/g,"释宝荣"); 
htmlstr=htmlstr.replace(/Shi '圣龙' ShengLong|Shi ShengLong/g,"释圣龙");
htmlstr=htmlstr.replace(/TaiShi '氐土貉' JingRen|TaiShi JingRen/g,"太史靖仁");
htmlstr=htmlstr.replace(/Yu '箕水豹' ZhiWei|Yu ZhiWei/g,"余智威"); 
htmlstr=htmlstr.replace(/Zhong '蒲牢' ZhiXuan|Zhong ZhiXuan/g,"钟智轩");
htmlstr=htmlstr.replace(/Zou '毕月乌' ZheBin|Zou ZheBin/g,"邹哲斌");


//No.8
//艾斯丁学校
htmlstr=htmlstr.replace(/Che XiWang/g,"车希望"); 
htmlstr=htmlstr.replace(/Diao YiJie/g,"刁易杰"); 
htmlstr=htmlstr.replace(/Hong PeiYuan/g,"洪裴元"); 
htmlstr=htmlstr.replace(/Hua ShouWu/g,"华首乌"); 
htmlstr=htmlstr.replace(/Ji YiDa/g,"吉益达"); 
htmlstr=htmlstr.replace(/Ma GuangYu/g,"马光宇"); 
htmlstr=htmlstr.replace(/Qiao GuangYao/g,"乔广姚");
htmlstr=htmlstr.replace(/Qiu ZhengYue/g,"邱震岳"); 
htmlstr=htmlstr.replace(/Wang ChenChen/g,"汪晨晨"); 
htmlstr=htmlstr.replace(/Xiao XinYuan/g,"箫新远"); 
htmlstr=htmlstr.replace(/Yao JingTian/g,"姚惊天"); 
htmlstr=htmlstr.replace(/Zhang JianJun/g,"章建军"); 
htmlstr=htmlstr.replace(/Zhang XiSha/g,"张希沙"); 
htmlstr=htmlstr.replace(/Zhong JiaKang/g,"钟家康"); 
htmlstr=htmlstr.replace(/Zu XuanYi/g,"祖轩逸"); 

//No.9
//梅桥岭FC
htmlstr=htmlstr.replace(/Ao ZhiHua/g,"敖志华"); 
htmlstr=htmlstr.replace(/Arne Van Rossem/g,"阿恩·范·罗斯") 
htmlstr=htmlstr.replace(/Bei HanYun/g,"北汉云"); 
htmlstr=htmlstr.replace(/Bob Sant Biswas/g,"鲍勃·桑特比斯"); 
htmlstr=htmlstr.replace(/Cai XinYi/g,"蔡新一"); 
htmlstr=htmlstr.replace(/Calvino Damasco/g,"卡尔文·大马士革"); 
htmlstr=htmlstr.replace(/Chao HaiYu/g,"晁海虞"); 
htmlstr=htmlstr.replace(/Chen QianShi/g,"陈乾世") 
htmlstr=htmlstr.replace(/Chu Liangde/g,"褚良德"); 
htmlstr=htmlstr.replace(/Chu ZhuZi/g,"楚朱子"); 
htmlstr=htmlstr.replace(/Dang GuoYu/g,"党国玉") 
htmlstr=htmlstr.replace(/Dennis Peeters/g,"丹尼斯·皮特斯"); 
htmlstr=htmlstr.replace(/Eino Ruuskanen/g,"埃诺·卢卡南"); 
htmlstr=htmlstr.replace(/Fei WeiCheng/g,"费卫城"); 
htmlstr=htmlstr.replace(/Gabriel De Beul/g,"加布里埃尔·德·比尔"); 
htmlstr=htmlstr.replace(/Gan ShouZhi/g,"甘守志"); 
htmlstr=htmlstr.replace(/Hadrien Leplat/g,"哈德里恩·莱普拉"); 
htmlstr=htmlstr.replace(/He WenYong/g,"何文勇"); 
htmlstr=htmlstr.replace(/Hong GuoQiang/g,"洪国强"); 
htmlstr=htmlstr.replace(/Hong ShuoCheng/g,"洪硕成"); 
htmlstr=htmlstr.replace(/Hu JunBo/g,"胡俊波"); 
htmlstr=htmlstr.replace(/Hu LiXing/g,"胡立兴"); 
htmlstr=htmlstr.replace(/Hu ZiHe/g,"胡子和"); 
htmlstr=htmlstr.replace(/HuangShu JiaHe/g,"皇叔嘉禾"); 
htmlstr=htmlstr.replace(/Ion Oancea/g,"艾恩·欧安思"); 
htmlstr=htmlstr.replace(/Irakli Makashvili/g,"伊拉克里·玛卡"); 
htmlstr=htmlstr.replace(/Jiao KangWen/g,"焦亢文"); 
htmlstr=htmlstr.replace(/Kang XuePeng/g,"康学鹏"); 
htmlstr=htmlstr.replace(/Kang YaLong/g,"康亚龙"); 
htmlstr=htmlstr.replace(/Kedar Alshomrani/g,"凯达尔·阿尔索拉尼"); 
htmlstr=htmlstr.replace(/Kong ZhiXing/g,"孔智星"); 
htmlstr=htmlstr.replace(/Li BingJie/g,"李冰杰"); 
htmlstr=htmlstr.replace(/Li BoHan/g,"李博涵"); 
htmlstr=htmlstr.replace(/Li JinWei/g,"李金伟"); 
htmlstr=htmlstr.replace(/Liang JiBin/g,"梁纪斌"); 
htmlstr=htmlstr.replace(/Lin YanMing/g,"林彦明"); 
htmlstr=htmlstr.replace(/Lin ZhaoTian/g,"林昭天"); 
htmlstr=htmlstr.replace(/Liu ShangKun/g,"刘尚坤"); 
htmlstr=htmlstr.replace(/Lu WenAn/g,"卢文安"); 
htmlstr=htmlstr.replace(/Lv Ye/g,"吕爷"); 
htmlstr=htmlstr.replace(/Mao FengFeng/g,"毛凤凤"); 
htmlstr=htmlstr.replace(/Niu LianZhi/g,"牛连志"); 
htmlstr=htmlstr.replace(/Peng XuHao/g,"彭旭豪"); 
htmlstr=htmlstr.replace(/Qiao Bei/g,"乔北"); 
htmlstr=htmlstr.replace(/Rukia Naganuma/g,"露琪亚·长沼"); 
htmlstr=htmlstr.replace(/Shi GuoQing/g,"石国庆"); 
htmlstr=htmlstr.replace(/Shi XianLu/g,"石仙陆"); 
htmlstr=htmlstr.replace(/Shu YueWu/g,"舒跃武"); 
htmlstr=htmlstr.replace(/Si ChenYe/g,"斯陈爷"); 
htmlstr=htmlstr.replace(/Song FengFeng/g,"宋丰丰"); 
htmlstr=htmlstr.replace(/Sun GuangRi/g,"孙广日"); 
htmlstr=htmlstr.replace(/Wang YunDing/g,"王赟定"); 
htmlstr=htmlstr.replace(/Wang ZeYong/g,"王泽勇"); 
htmlstr=htmlstr.replace(/Wei ShiZhuang/g,"魏世庄"); 
htmlstr=htmlstr.replace(/Wei YiHu/g,"魏一虎"); 
htmlstr=htmlstr.replace(/Wu QiPeng/g,"武齐鹏"); 
htmlstr=htmlstr.replace(/Wu XuChu/g,"吴旭初"); 
htmlstr=htmlstr.replace(/Xian LuCao/g,"仙露草"); 
htmlstr=htmlstr.replace(/Xie YanWei/g,"谢严伟"); 
htmlstr=htmlstr.replace(/Xu HongGang/g,"徐洪刚"); 
htmlstr=htmlstr.replace(/Xu ShengRui/g,"徐晟锐");
htmlstr=htmlstr.replace(/Xu Xiao/g,"徐骁"); 
htmlstr=htmlstr.replace(/Xue YangYang/g,"薛洋洋"); 
htmlstr=htmlstr.replace(/Yani Chonov/g,"亚尼·科诺夫"); 
htmlstr=htmlstr.replace(/Ye JiKuan/g,"叶季宽"); 
htmlstr=htmlstr.replace(/Ye YuXi/g,"叶禹锡"); 
htmlstr=htmlstr.replace(/Yi WeiTing/g,"易伟霆"); 
htmlstr=htmlstr.replace(/Youssef Flores/g,"尤瑟夫·弗洛雷斯"); 
htmlstr=htmlstr.replace(/Yu LongXiang/g,"于龙翔"); 
htmlstr=htmlstr.replace(/Yuan AnNie/g,"袁安聂"); 
htmlstr=htmlstr.replace(/Yuan QingHe/g,"袁清河"); 
htmlstr=htmlstr.replace(/Yue YuJing/g,"岳玉京"); 
htmlstr=htmlstr.replace(/Zhangsun BangWei/g,"长孙邦威"); 
htmlstr=htmlstr.replace(/Zhao XiHe/g,"赵锡禾"); 
htmlstr=htmlstr.replace(/Zhong HeXuan/g,"钟贺轩"); 
htmlstr=htmlstr.replace(/Zhu Qun/g,"朱群"); 
htmlstr=htmlstr.replace(/Zhu YaDong/g,"朱亚东"); 
htmlstr=htmlstr.replace(/Zhuang LingPu/g,"庄灵浦"); 
htmlstr=htmlstr.replace(/Zou YiTai/g,"邹伊泰"); 

//No.10
//俄城雷霆
htmlstr=htmlstr.replace(/Ai JiaMin/g,"艾嘉敏"); 
htmlstr=htmlstr.replace(/Bao QiPeng/g,"包祁鹏"); 
htmlstr=htmlstr.replace(/Cai '鑫豪' XinHao|Cai XinHao/g,"偲鑫豪"); 
htmlstr=htmlstr.replace(/Cao YuMo/g,"曹宇墨"); 
htmlstr=htmlstr.replace(/Chi FeiQin/g,"赤飞禽"); 
htmlstr=htmlstr.replace(/Da '国王' GuangNan|Da GuangNan/g,"达光南"); 
htmlstr=htmlstr.replace(/Da GuangNan/g,"达光楠"); 
htmlstr=htmlstr.replace(/Deng MingHu/g,"邓明虎"); 
htmlstr=htmlstr.replace(/Ding JunSheng/g,"丁俊生"); 
htmlstr=htmlstr.replace(/Ding YouSu/g,"丁游溯"); 
htmlstr=htmlstr.replace(/Dong JunTao/g,"董峻涛");
htmlstr=htmlstr.replace(/DongFang HaiMing/g,"东方海明"); 
htmlstr=htmlstr.replace(/Fan HongXuan/g,"范鸿轩"); 
htmlstr=htmlstr.replace(/Fan LuoGen/g,"范罗艮"); 
htmlstr=htmlstr.replace(/Fei WenZhuo/g,"斐文卓"); 
htmlstr=htmlstr.replace(/Gao HongBing/g,"高鸿秉");
htmlstr=htmlstr.replace(/Hao HuXiang/g,"郝湖湘"); 
htmlstr=htmlstr.replace(/Hao Run/g,"郝润"); 
htmlstr=htmlstr.replace(/Bai '黑澤明' ZeMin|Bai ZeMin/g,"黑泽民"); 
htmlstr=htmlstr.replace(/Hua Chou/g,"花丑"); 
htmlstr=htmlstr.replace(/Hua YeCheng/g,"花烨成"); 
htmlstr=htmlstr.replace(/Huang DeKai/g,"黄德凯"); 
htmlstr=htmlstr.replace(/Ji YiShan/g,"季一山"); 
htmlstr=htmlstr.replace(/Jian JuJi/g,"简巨基"); 
htmlstr=htmlstr.replace(/Jin ZiHang/g,"金子航"); 
htmlstr=htmlstr.replace(/Li FengChui/g,"李丰炊"); 
htmlstr=htmlstr.replace(/Li GuangMing/g,"李广明");
htmlstr=htmlstr.replace(/Meng '门长明' ChangMin|Meng ChangMin/g,"孟昶闵"); 
htmlstr=htmlstr.replace(/Niu PengYi/g,"牛彭毅"); 
htmlstr=htmlstr.replace(/Pan LiQiang/g,"潘礼强"); 
htmlstr=htmlstr.replace(/Peng Tie/g,"彭铁");
htmlstr=htmlstr.replace(/Qian SuZheng/g,"钱肃正"); 
htmlstr=htmlstr.replace(/Qiu ZhuoXi/g,"邱卓溪"); 
htmlstr=htmlstr.replace(/Rao LingFu/g,"饶令符");
htmlstr=htmlstr.replace(/Shi ZhiHao/g,"时志豪"); 
htmlstr=htmlstr.replace(/Shu Xia/g,"舒夏"); 
htmlstr=htmlstr.replace(/Si KaiWen/g,"司凯文"); 
htmlstr=htmlstr.replace(/Sun SanQiang/g,"隼三强"); 
htmlstr=htmlstr.replace(/Tian ZhiPing/g,"田志平");
htmlstr=htmlstr.replace(/Wang HaiYu/g,"王海宇"); 
htmlstr=htmlstr.replace(/Wang Hang/g,"王航");
htmlstr=htmlstr.replace(/Wei '喂！星辰' XinChen|Wei XinChen/g,"魏心辰"); 
htmlstr=htmlstr.replace(/Wei ZeZhou/g,"魏泽州"); 
htmlstr=htmlstr.replace(/Xiong DengKe/g,"熊登科");
htmlstr=htmlstr.replace(/Yu QianShi/g,"于乾释");
htmlstr=htmlstr.replace(/Zhang ZiHan/g,"张梓涵"); 
htmlstr=htmlstr.replace(/Zhao DeRong/g,"赵德荣");
htmlstr=htmlstr.replace(/Zhao JieXian/g,"赵杰宪"); 
htmlstr=htmlstr.replace(/Zhao YunJie/g,"杜云杰");
htmlstr=htmlstr.replace(/Zhen HanYun/g,"甄汉云");
htmlstr=htmlstr.replace(/Zheng XiuQuan/g,"郑秀全"); 
htmlstr=htmlstr.replace(/Zhong JianFu/g,"钟健孚"); 
htmlstr=htmlstr.replace(/Zhou LongTeng/g,"周龙腾"); 
htmlstr=htmlstr.replace(/Zhou YongWang/g,"周永王"); 

//No.11
//唐风
htmlstr=htmlstr.replace(/Cai ZhiFei/g,"蔡志飞");
htmlstr=htmlstr.replace(/Cui Hui/g,"崔晖");
htmlstr=htmlstr.replace(/Dang ZhiYong/g,"党志勇");
htmlstr=htmlstr.replace(/Du MingWen/g,"杜明文");
htmlstr=htmlstr.replace(/Dávid Patkó/g,"达维德·保特科"); 
htmlstr=htmlstr.replace(/Fan YiHu/g,"范一虎");
htmlstr=htmlstr.replace(/Fu Dong/g,"傅东");	
htmlstr=htmlstr.replace(/Gabriele Mazzucchelli/g,"加布里埃勒·马祖凯利");
htmlstr=htmlstr.replace(/Gong RongSheng/g,"宫荣升");
htmlstr=htmlstr.replace(/Guan JinTao/g,"关锦涛");
htmlstr=htmlstr.replace(/Guo YongHao/g,"郭永好");
htmlstr=htmlstr.replace(/Han DaPing/g,"韩大平");
htmlstr=htmlstr.replace(/Hua SuZheng/g,"华苏征");
htmlstr=htmlstr.replace(/Huang HanLiang/g,"黄汉良");
htmlstr=htmlstr.replace(/Huang XiangNan/g,"黄翔南");
htmlstr=htmlstr.replace(/Huo Zhou/g,"霍舟");
htmlstr=htmlstr.replace(/Jan Geluk/g,"扬格鲁克");
htmlstr=htmlstr.replace(/Jian You/g,"简友");
htmlstr=htmlstr.replace(/Jin XuFen/g,"金许分");
htmlstr=htmlstr.replace(/Ke YaKe/g,"柯亚科");
htmlstr=htmlstr.replace(/Lai KaiBin/g,"赖楷斌");
htmlstr=htmlstr.replace(/Li DongJian/g,"李冬健");
htmlstr=htmlstr.replace(/Li LiRong/g,"李立荣");
htmlstr=htmlstr.replace(/Lian Ting/g,"廉挺");
htmlstr=htmlstr.replace(/Liang HaiLiang/g,"梁海亮");
htmlstr=htmlstr.replace(/Liang MingYan/g,"梁茗砚");
htmlstr=htmlstr.replace(/Lin ChengJun/g,"林承君");
htmlstr=htmlstr.replace(/Lin JianYong/g,"林建勇");
htmlstr=htmlstr.replace(/Lu HaiLiang/g,"卢海亮");
htmlstr=htmlstr.replace(/Ma ChengJian/g,"马成建");
htmlstr=htmlstr.replace(/Mao ShiLin/g,"毛时林");
htmlstr=htmlstr.replace(/Peng ShunKai/g,"彭顺凯"); 
htmlstr=htmlstr.replace(/Qin HuiJun/g,"秦晖钧");
htmlstr=htmlstr.replace(/Qin YouAn/g,"秦友安");
htmlstr=htmlstr.replace(/Ran ZhuoYi/g,"冉卓易");
htmlstr=htmlstr.replace(/Shu Jia/g,"舒佳");
htmlstr=htmlstr.replace(/Shuji Otsuka/g,"大津贺崇时");
htmlstr=htmlstr.replace(/Sun ChaoCe/g,"孙晁策");
htmlstr=htmlstr.replace(/Tan HuXiang/g,"谭浒翔");
htmlstr=htmlstr.replace(/Wang GuangMin/g,"王光闵"); 
htmlstr=htmlstr.replace(/Wang JiMi/g,"王吉米");
htmlstr=htmlstr.replace(/Wang KangWen/g,"王亢文");
htmlstr=htmlstr.replace(/Wang SongYan/g,"王松岩");
htmlstr=htmlstr.replace(/Wen Yong/g,"温勇");
htmlstr=htmlstr.replace(/Xing KeWei/g,"刑克伟");
htmlstr=htmlstr.replace(/Xu LiJi/g,"徐里继");
htmlstr=htmlstr.replace(/Yu DongLong/g,"于东龙");
htmlstr=htmlstr.replace(/Yun JinYuan/g,"云津源");
htmlstr=htmlstr.replace(/Zhang WenChou/g,"张文丑");
htmlstr=htmlstr.replace(/Zheng Pu/g,"郑普");
htmlstr=htmlstr.replace(/Zhou ChengHao/g,"周成好");
htmlstr=htmlstr.replace(/Zhou XinHao/g,"周心昊");
htmlstr=htmlstr.replace(/Zhu ZeXuan/g,"朱泽轩");
htmlstr=htmlstr.replace(/Zhuang WeiGuo/g,"庄卫国");
htmlstr=htmlstr.replace(/Zhuang ZhuCheng/g,"庄诸成");
htmlstr=htmlstr.replace(/Zu ChenJun/g,"祖晨钧");


//FC.北京布丁 
//No.12
htmlstr=htmlstr.replace(/Cao HongWu/g,"曹洪武"); 
htmlstr=htmlstr.replace(/He DongYa/g,"何东亚"); 
htmlstr=htmlstr.replace(/Jia YueBo/g,"贾越波"); 
htmlstr=htmlstr.replace(/Jin ZiXuan/g,"金子轩"); 
htmlstr=htmlstr.replace(/Mu ZiJie/g,"穆子杰"); 
htmlstr=htmlstr.replace(/Qian ChengZhong/g,"钱承中"); 
htmlstr=htmlstr.replace(/Qiu Huo/g,"丘豁");
htmlstr=htmlstr.replace(/Qiu WeiJun/g,"丘伟军"); 
htmlstr=htmlstr.replace(/Wei Miao/g,"维淼"); 
htmlstr=htmlstr.replace(/Xiong JingHua/g,"熊京华"); 
htmlstr=htmlstr.replace(/Xiong JingHua/g,"熊京华"); 
htmlstr=htmlstr.replace(/Xu HengZhi/g,"徐恒智"); 
htmlstr=htmlstr.replace(/Xue ZhaoJun/g,"薛昭君"); 
htmlstr=htmlstr.replace(/Ye Gan/g,"叶敢"); 
htmlstr=htmlstr.replace(/Zhang ZhongYou/g,"张忠友"); 

//No.13
//重庆麻辣火锅
htmlstr=htmlstr.replace(/Akmal Gaspar/g,"阿克马尔·加斯珀");
htmlstr=htmlstr.replace(/Cai Liang/g,"蔡凉");
htmlstr=htmlstr.replace(/Cao YuanYuan/g,"曹渊源"); 
htmlstr=htmlstr.replace(/Cen ChunJi/g,"岑春季"); 
htmlstr=htmlstr.replace(/Cheng Ying/g,"承影"); 
htmlstr=htmlstr.replace(/Cui SongYan/g,"崔松烟");
htmlstr=htmlstr.replace(/Dibya Ramvani/g,"迪比亚·拉姆瓦尼");
htmlstr=htmlstr.replace(/Dong Zu/g,"冬祖");
htmlstr=htmlstr.replace(/Eliseo Garcia/g,"埃利塞奥·加西亚");
htmlstr=htmlstr.replace(/Feng FengXin/g,"冯封心"); 
htmlstr=htmlstr.replace(/Gan ZeQi/g,"甘泽奇");
htmlstr=htmlstr.replace(/Gao ShiLei/g,"高石磊");
htmlstr=htmlstr.replace(/Gao WenBo/g,"高稳波");
htmlstr=htmlstr.replace(/Ge XiangTao/g,"葛祥韬");
htmlstr=htmlstr.replace(/Guo JingGe/g,"郭惊歌");
htmlstr=htmlstr.replace(/Ha TanChao/g,"哈谭超"); 
htmlstr=htmlstr.replace(/Han HongLi/g,"韩弘历"); 
htmlstr=htmlstr.replace(/Huang ShengLi/g,"黄胜利"); 
htmlstr=htmlstr.replace(/Hubert Gębura/g,"休伯特·乔布拉");
htmlstr=htmlstr.replace(/Jia MingChang/g,"贾铭昶"); 
htmlstr=htmlstr.replace(/Jiao JianWen/g,"焦建文");
htmlstr=htmlstr.replace(/Kang ChengDa/g,"康承达");
htmlstr=htmlstr.replace(/Li Dun/g,"李盾"); 
htmlstr=htmlstr.replace(/Li YaJian/g,"黎亚坚"); 
htmlstr=htmlstr.replace(/Li ZiXin/g,"李子鑫");
htmlstr=htmlstr.replace(/Liang ChangLin/g,"梁长麟");
htmlstr=htmlstr.replace(/Liang XuGang/g,"梁旭刚"); 
htmlstr=htmlstr.replace(/Lin XiJun/g,"林西军");
htmlstr=htmlstr.replace(/Lin ZhenYang/g,"林振阳");
htmlstr=htmlstr.replace(/Liu BoQiang/g,"柳柏强");
htmlstr=htmlstr.replace(/Lu DeXin/g,"卢德兴");
htmlstr=htmlstr.replace(/Lu LingTing/g,"卢凌霆"); 
htmlstr=htmlstr.replace(/Lu ZhangYi/g,"卢长义"); 
htmlstr=htmlstr.replace(/Mao Xiang/g,"毛翔"); 
htmlstr=htmlstr.replace(/Mu ShiJie/g,"穆世杰"); 
htmlstr=htmlstr.replace(/Ou HaiJian/g,"欧海建"); 
htmlstr=htmlstr.replace(/Ou Peng/g,"欧鹏");  
htmlstr=htmlstr.replace(/Pan YongQi/g,"潘永奇"); 
htmlstr=htmlstr.replace(/Pan ZeXi/g,"潘泽西");
htmlstr=htmlstr.replace(/Qu ShaoQuan/g,"曲绍泉"); 
htmlstr=htmlstr.replace(/Shan HaiYang/g,"山海阳");
htmlstr=htmlstr.replace(/Shi GuangHu/g,"石光虎"); 
htmlstr=htmlstr.replace(/Shi JieXian/g,"史杰贤"); 
htmlstr=htmlstr.replace(/Shi YanHan/g,"史炎寒"); 
htmlstr=htmlstr.replace(/Shu Donghua/g,"舒栋华"); 
htmlstr=htmlstr.replace(/Somanshu Ilyas/g,"苏曼殊·伊利亚斯"); 
htmlstr=htmlstr.replace(/Tian FengTao/g,"田奉韬"); 
htmlstr=htmlstr.replace(/Tupuri Achu/g,"图布里·阿苏");
htmlstr=htmlstr.replace(/Vasile Blanaru/g,"瓦西里·布勒纳鲁"); 
htmlstr=htmlstr.replace(/Wang ChangRui/g,"王长瑞"); 
htmlstr=htmlstr.replace(/Xie XianPing/g,"谢仙屏"); 
htmlstr=htmlstr.replace(/Xie XueMing/g,"谢学铭");
htmlstr=htmlstr.replace(/Xu JunChen/g,"徐俊辰");
htmlstr=htmlstr.replace(/You BeiHai/g,"游北海"); 
htmlstr=htmlstr.replace(/Zhang HanWen/g,"张瀚文");
htmlstr=htmlstr.replace(/Zhang KeLiang/g,"张克良");
htmlstr=htmlstr.replace(/Zhang ShengYuan/g,"张圣元"); 
htmlstr=htmlstr.replace(/Zheng LinHu/g,"郑麟虎");
htmlstr=htmlstr.replace(/Zhu YunChuan/g,"朱云川");


//No.14
//范迪克
htmlstr=htmlstr.replace(/Bo XiangFu/g,"薄湘福");
htmlstr=htmlstr.replace(/Cai DongPeng/g,"蔡冬鹏"); 
htmlstr=htmlstr.replace(/Cui ChaoYuan/g,"崔超远"); 
htmlstr=htmlstr.replace(/Ding HongCai/g,"丁宏才"); 
htmlstr=htmlstr.replace(/Du YiBin/g,"杜一斌"); 
htmlstr=htmlstr.replace(/Hu Ju/g,"胡菊"); 
htmlstr=htmlstr.replace(/Huang BingJie/g,"黄秉杰"); 
htmlstr=htmlstr.replace(/Lai ZhenDong/g,"赖振东"); 
htmlstr=htmlstr.replace(/Ling MuYuan/g,"凌沐源"); 
htmlstr=htmlstr.replace(/Pan ShunFeng/g,"潘顺峰"); 
htmlstr=htmlstr.replace(/Peng TianHong/g,"彭天鸿"); 
htmlstr=htmlstr.replace(/Qu XueYou/g,"曲学友"); 
htmlstr=htmlstr.replace(/Ren Tai/g,"任泰"); 
htmlstr=htmlstr.replace(/Shao Shang/g,"邵商"); 
htmlstr=htmlstr.replace(/She BuBai/g,"佘步柏"); 
htmlstr=htmlstr.replace(/Shi HeJing/g,"石河晶"); 
htmlstr=htmlstr.replace(/Tan JinXiang/g,"谭晋翔"); 
htmlstr=htmlstr.replace(/Wu LinFeng/g,"吴林峰"); 
htmlstr=htmlstr.replace(/Wu YongCheng/g,"吴勇成"); 
htmlstr=htmlstr.replace(/Xu Kuo/g,"徐括"); 
htmlstr=htmlstr.replace(/Ye BingQuang/g,"叶炳权"); 
htmlstr=htmlstr.replace(/Yi GuangHu/g,"易广虎"); 
htmlstr=htmlstr.replace(/Yuan BoYan/g,"苑博言"); 
htmlstr=htmlstr.replace(/Zhai YanHuai/g,"翟延槐"); 


//No.15
//河北华夏幸福
htmlstr=htmlstr.replace(/Chang ShiJu/g,"常世驹"); 
htmlstr=htmlstr.replace(/Chen BaiLin/g,"陈百林"); 
htmlstr=htmlstr.replace(/Dong ZhaoZhong/g,"董兆中"); 
htmlstr=htmlstr.replace(/Frank Allison/g,"弗兰克·阿里森"); 
htmlstr=htmlstr.replace(/Hao XiangJie/g,"郝相杰"); 
htmlstr=htmlstr.replace(/Ji MingJun/g,"姬明俊"); 
htmlstr=htmlstr.replace(/Jiang HaoYuan/g,"姜浩源"); 
htmlstr=htmlstr.replace(/Jonatan Acosta/g,"乔纳丹·阿科斯塔"); 
htmlstr=htmlstr.replace(/Ke Fa/g,"柯发"); 
htmlstr=htmlstr.replace(/Lin ShiAn/g,"林世安"); 
htmlstr=htmlstr.replace(/Luo RongJi/g,"罗荣基"); 
htmlstr=htmlstr.replace(/Oleg Trefiolov/g,"奥雷格·特雷费奥罗夫"); 
htmlstr=htmlstr.replace(/Otello Crescenzo/g,"奥特罗·卡雷斯科恩佐"); 
htmlstr=htmlstr.replace(/Pang JiSun/g,"庞吉顺"); 
htmlstr=htmlstr.replace(/Pravoslav Jakubko/g,"普拉沃斯拉夫·雅库布科");
htmlstr=htmlstr.replace(/Shao DaWei/g,"邵大伟"); 
htmlstr=htmlstr.replace(/Sheng WuBa/g,"盛无霸"); 
htmlstr=htmlstr.replace(/Shui XiaoHui/g,"水小辉");
htmlstr=htmlstr.replace(/Sun ZhiJiong/g,"孙志炯"); 
htmlstr=htmlstr.replace(/Tai ChunBin/g,"邰春斌"); 
htmlstr=htmlstr.replace(/Vadim Chernekov/g,"瓦蒂姆·切尔尼科夫"); 
htmlstr=htmlstr.replace(/Xin BoWei/g,"辛博伟"); 
htmlstr=htmlstr.replace(/Xu LeYuan/g,"徐乐元"); 
htmlstr=htmlstr.replace(/Zhong YaLong/g,"钟亚龙"); 
htmlstr=htmlstr.replace(/Zhou HaiHang/g,"周海航"); 

//No.16
//龙子湖竞技
htmlstr=htmlstr.replace(/An JinXi/g,"安进喜");
htmlstr=htmlstr.replace(/Bu Rui/g,"步瑞");
htmlstr=htmlstr.replace(/Cai TingYao/g,"蔡亭尧");
htmlstr=htmlstr.replace(/Cai WeiChao/g,"蔡伟超");
htmlstr=htmlstr.replace(/Chen ZiYuan/g,"陈子元");
htmlstr=htmlstr.replace(/Du ZhouZhe/g,"杜周哲");
htmlstr=htmlstr.replace(/Duan BuBai/g,"段不败");
htmlstr=htmlstr.replace(/Gan QuanZhang/g,"甘全章");
htmlstr=htmlstr.replace(/Geng LongLong/g,"耿龙龙");
htmlstr=htmlstr.replace(/Guan JianFeng/g,"关剑锋");
htmlstr=htmlstr.replace(/Gui LongXiang/g,"桂龙翔");
htmlstr=htmlstr.replace(/Guo JiangHua/g,"郭江华");
htmlstr=htmlstr.replace(/Han ZiXuan/g,"韩子轩");
htmlstr=htmlstr.replace(/He JunPeng/g,"何俊鹏");
htmlstr=htmlstr.replace(/Hu DeGang/g,"胡德刚");
htmlstr=htmlstr.replace(/Hua XuanDe/g,"华玄德");
htmlstr=htmlstr.replace(/Lei ZhiZhao/g,"雷志昭");
htmlstr=htmlstr.replace(/Leng XiRui/g,"冷希瑞");
htmlstr=htmlstr.replace(/Liang JingHao/g,"梁景皓");
htmlstr=htmlstr.replace(/Lin HongGang/g,"林宏刚");
htmlstr=htmlstr.replace(/Lin RuiQi/g,"林瑞琪");
htmlstr=htmlstr.replace(/Lu JingWen/g,"卢靖文");
htmlstr=htmlstr.replace(/Mu YaoYang/g,"穆耀阳");
htmlstr=htmlstr.replace(/Ning Ce/g,"宁策");
htmlstr=htmlstr.replace(/Nong Ke/g,"农科");
htmlstr=htmlstr.replace(/Peng WenCheng/g,"彭文成");
htmlstr=htmlstr.replace(/Peng ZiXin/g,"彭子鑫");
htmlstr=htmlstr.replace(/Qin ZiMo/g,"秦子墨");
htmlstr=htmlstr.replace(/Ran JinJian/g,"冉金健");
htmlstr=htmlstr.replace(/Rao ChengYe/g,"饶成业");
htmlstr=htmlstr.replace(/Tan XiangMin/g,"谭湘闵");
htmlstr=htmlstr.replace(/Tang JinXi/g,"唐进喜");
htmlstr=htmlstr.replace(/TuoBa HongLi/g,"拓跋弘历");
htmlstr=htmlstr.replace(/Xin ZiMing/g,"辛子明");
htmlstr=htmlstr.replace(/Xu ChaoYuan/g,"徐超元");
htmlstr=htmlstr.replace(/Xu XiaoFeng/g,"徐晓峰");
htmlstr=htmlstr.replace(/Yao ZiJie/g,"姚子杰");
htmlstr=htmlstr.replace(/Ye ChunJie/g,"叶春杰");
htmlstr=htmlstr.replace(/Ye WenJun/g,"叶文俊");
htmlstr=htmlstr.replace(/Yin MinWei/g,"尹敏伟");
htmlstr=htmlstr.replace(/Zhang RenJie/g,"张仁杰");
htmlstr=htmlstr.replace(/Zhou YeXuan/g,"周叶轩");
htmlstr=htmlstr.replace(/Zhu WeiFei/g,"朱伟飞");

//No.17
//公馆FC
htmlstr=htmlstr.replace(/Hou LeLe/g,"侯乐乐");
htmlstr=htmlstr.replace(/Li Chi/g,"利齿");
htmlstr=htmlstr.replace(/Luo ZhiYu/g,"罗志宇");
htmlstr=htmlstr.replace(/Xu YaZhao/g,"徐亚昭");
htmlstr=htmlstr.replace(/Yue ShaoHua/g,"岳少滑");
htmlstr=htmlstr.replace(/Zhuo TingYan/g,"卓挺严");


//No.18
//青岛教师联队 
htmlstr=htmlstr.replace(/Cai KaiZe/g,"蔡开泽"); 
htmlstr=htmlstr.replace(/Dai Kun/g,"戴琨"); 
htmlstr=htmlstr.replace(/Fan HaoWen/g,"范浩文"); 
htmlstr=htmlstr.replace(/Feng DaLei/g,"冯大雷"); 
htmlstr=htmlstr.replace(/Gao Tie/g,"高铁"); 
htmlstr=htmlstr.replace(/Hong DaZhan/g,"洪大展"); 
htmlstr=htmlstr.replace(/Jiang GuoQiang/g,"姜国强"); 
htmlstr=htmlstr.replace(/Lv ZhuoJun/g,"吕卓君"); 
htmlstr=htmlstr.replace(/Ma KunPeng/g,"马坤鹏"); 
htmlstr=htmlstr.replace(/Mao WeiJie/g,"毛伟杰"); 
htmlstr=htmlstr.replace(/Peng ShiLin/g,"彭世林"); 
htmlstr=htmlstr.replace(/Pi YuQing/g,"皮玉清"); 
htmlstr=htmlstr.replace(/Qian Biao/g,"钱彪"); 
htmlstr=htmlstr.replace(/Shi ShangZhe/g,"石尚哲"); 
htmlstr=htmlstr.replace(/Tao HongLi/g,"陶宏历"); 
htmlstr=htmlstr.replace(/Xi YanKai/g,"席延凯"); 
htmlstr=htmlstr.replace(/Xia YaZhao/g,"夏雅照"); 
htmlstr=htmlstr.replace(/Xian He/g,"贤鹤"); 
htmlstr=htmlstr.replace(/Xue Jia/g,"薛佳"); 
htmlstr=htmlstr.replace(/You ZeDong/g,"尤泽东"); 
htmlstr=htmlstr.replace(/Zhang Ju/g,"张举"); 
htmlstr=htmlstr.replace(/Zhi JunRu/g,"智俊如"); 
htmlstr=htmlstr.replace(/Zhou YuShuai/g,"周玉帅"); 
htmlstr=htmlstr.replace(/Zhu XuanWu/g,"朱玄武"); 
htmlstr=htmlstr.replace(/Zu YunDing/g,"祖云定"); 

//AKB48
//No.19
htmlstr=htmlstr.replace(/Bai RuoFei/g,"白若飞");
htmlstr=htmlstr.replace(/Bai ShiJu/g,"白世居"); 
htmlstr=htmlstr.replace(/Cai JinShu/g,"蔡金书");
htmlstr=htmlstr.replace(/Chao XuChu/g,"晁许初");
htmlstr=htmlstr.replace(/Chen GuoSheng/g,"陈国胜"); 
htmlstr=htmlstr.replace(/Chen JiXiang/g,"陈吉祥"); 
htmlstr=htmlstr.replace(/Cheng LeLe/g,"程乐乐"); 
htmlstr=htmlstr.replace(/Deng HongGen/g,"邓红根");
htmlstr=htmlstr.replace(/Deng WangSong/g,"邓王松");
htmlstr=htmlstr.replace(/Ding YuanHang/g,"丁远航"); 
htmlstr=htmlstr.replace(/Dong JiaJian/g,"董嘉健");
htmlstr=htmlstr.replace(/Duan JinPeng/g,"段金鹏"); 
htmlstr=htmlstr.replace(/Fei ZaiYu/g,"斐在雨");
htmlstr=htmlstr.replace(/Fu DaLei/g,"付大雷");
htmlstr=htmlstr.replace(/Gan Ang/g,"甘昂");
htmlstr=htmlstr.replace(/Gao HongYuan/g,"高洪渊"); 
htmlstr=htmlstr.replace(/Gong JiaQian/g,"龚家钱");
htmlstr=htmlstr.replace(/Gou QianShuo/g,"句千硕"); 
htmlstr=htmlstr.replace(/Guo Guan/g,"郭敢");
htmlstr=htmlstr.replace(/Guo YiWen/g,"郭益文");
htmlstr=htmlstr.replace(/Hong JianLei/g,"洪建磊");
htmlstr=htmlstr.replace(/Hua HaiBin/g,"花海滨");
htmlstr=htmlstr.replace(/Hua ZiQian/g,"花子谦"); 
htmlstr=htmlstr.replace(/HuangFu DongHui/g,"皇甫东辉");
htmlstr=htmlstr.replace(/Jian MingFei/g,"简明非"); 
htmlstr=htmlstr.replace(/Jiang HongGang/g,"江鸿刚");
htmlstr=htmlstr.replace(/Jing XinPeng/g,"荆新朋");
htmlstr=htmlstr.replace(/Ke RuiQing/g,"柯瑞清");
htmlstr=htmlstr.replace(/Lei ChenXuan/g,"雷晨轩");
htmlstr=htmlstr.replace(/Lei GaoPeng/g,"雷高鹏"); 
htmlstr=htmlstr.replace(/Li JianGang/g,"李建刚"); 
htmlstr=htmlstr.replace(/Li MingFei/g,"李铭飞"); 
htmlstr=htmlstr.replace(/Li ShiGang/g,"李师刚");
htmlstr=htmlstr.replace(/Li YouAn/g,"李幼安"); 
htmlstr=htmlstr.replace(/Lian XiaoMing/g,"连晓明"); 
htmlstr=htmlstr.replace(/Liang JingPing/g,"梁京平");
htmlstr=htmlstr.replace(/Lin YunSheng/g,"林云升");
htmlstr=htmlstr.replace(/Lin KaiNing/g,"林凯宁"); 
htmlstr=htmlstr.replace(/Liu ShiKai /g,"刘师凯");
htmlstr=htmlstr.replace(/Long SuMin/g,"龙苏民");
htmlstr=htmlstr.replace(/Lu AnYi/g,"卢安义"); 
htmlstr=htmlstr.replace(/Ma RunZhong/g,"马润中");
htmlstr=htmlstr.replace(/Mei YuShuai/g,"梅雨帅");
htmlstr=htmlstr.replace(/Min WenKai/g,"闵闻凯"); 
htmlstr=htmlstr.replace(/Min XiaoQian/g,"闵啸乾"); 
htmlstr=htmlstr.replace(/Pan TanChao/g,"潘谭超"); 
htmlstr=htmlstr.replace(/Peng Ru/g,"朋如");
htmlstr=htmlstr.replace(/Qian Cheng/g,"钱成");
htmlstr=htmlstr.replace(/Qian XiRong/g,"千禧荣"); 
htmlstr=htmlstr.replace(/Qian XueLin/g,"钱雪麟"); 
htmlstr=htmlstr.replace(/Qiang WenJian/g,"强文剑");
htmlstr=htmlstr.replace(/Qiu DianZuo/g,"邱殿座"); 
htmlstr=htmlstr.replace(/Shi PeiZhao/g,"石沛昭"); 
htmlstr=htmlstr.replace(/Shi TianMing/g,"施天鸣"); 
htmlstr=htmlstr.replace(/Shui SanSha/g,"谁三杀");
htmlstr=htmlstr.replace(/Song LiMin/g,"宋李民");
htmlstr=htmlstr.replace(/Tai XueSen/g,"泰学森");
htmlstr=htmlstr.replace(/Tang XiLong/g,"唐希龙");
htmlstr=htmlstr.replace(/Tian XiaoNan/g,"田笑南"); 
htmlstr=htmlstr.replace(/Tie Wei/g,"铁伟");
htmlstr=htmlstr.replace(/Wang Gan/g,"王感"); 
htmlstr=htmlstr.replace(/Wang YueFei/g,"王跃飞"); 
htmlstr=htmlstr.replace(/Wei HongYang/g,"魏宏阳"); 
htmlstr=htmlstr.replace(/Weng ZeHong/g,"翁泽鸿"); 
htmlstr=htmlstr.replace(/Xiao WenJun/g,"萧文君"); 
htmlstr=htmlstr.replace(/Xiao YingJie/g,"肖英杰"); 
htmlstr=htmlstr.replace(/Xu NanXing/g,"许楠星");
htmlstr=htmlstr.replace(/Xu Tao/g,"徐韬"); 
htmlstr=htmlstr.replace(/Xue DeQun/g,"薛德群"); 
htmlstr=htmlstr.replace(/Yan YuanJi/g,"严元吉");
htmlstr=htmlstr.replace(/Yang GuanXi/g,"杨冠希"); 
htmlstr=htmlstr.replace(/Ye Ke/g,"野可");
htmlstr=htmlstr.replace(/Ye ShuFeng/g,"叶庶峰"); 
htmlstr=htmlstr.replace(/Ying RenJie/g,"应人杰");
htmlstr=htmlstr.replace(/Yu ChenJun/g,"余晨军");
htmlstr=htmlstr.replace(/Yu YaDong/g,"于亚东"); 
htmlstr=htmlstr.replace(/Zeng XingLiang/g,"曾兴亮"); 
htmlstr=htmlstr.replace(/Zhai Ming/g,"翟明"); 
htmlstr=htmlstr.replace(/Zhao BiDe/g,"赵璧德");
htmlstr=htmlstr.replace(/Zhao ChenHui/g,"赵辰晖"); 
htmlstr=htmlstr.replace(/Zhao YuDao/g,"赵宇道");
htmlstr=htmlstr.replace(/Zhao YunDao/g,"赵云到"); 
htmlstr=htmlstr.replace(/Zhen NingTao/g,"贞宁涛");
htmlstr=htmlstr.replace(/Zheng HanYu/g,"郑涵余");
htmlstr=htmlstr.replace(/Zheng XiJie/g,"郑希杰");
htmlstr=htmlstr.replace(/Zheng YunQi/g,"郑允奇"); 
htmlstr=htmlstr.replace(/Zhong ZhiYi/g,"钟志毅"); 
htmlstr=htmlstr.replace(/Zhou HuiKang/g,"周惠康"); 
htmlstr=htmlstr.replace(/Zhou ZiYao/g,"周自姚");
htmlstr=htmlstr.replace(/Zhu DeLun/g,"朱德伦");
htmlstr=htmlstr.replace(/Zhu YunLong/g,"朱云龙");

//No.20
//飞翔鸟
htmlstr=htmlstr.replace(/Bian LiQin/g,"边立勤");
htmlstr=htmlstr.replace(/Che HongZhi/g,"车鸿志");
htmlstr=htmlstr.replace(/Chen Dun/g,"陈盾");
htmlstr=htmlstr.replace(/Cui JunJie/g,"崔俊杰");
htmlstr=htmlstr.replace(/Du ZhenZhong/g,"杜震忠");
htmlstr=htmlstr.replace(/Fu JiaoShou/g,"伏叫兽");
htmlstr=htmlstr.replace(/Guo XiRui/g,"郭喜瑞");
htmlstr=htmlstr.replace(/Jian MuSheng/g,"简沐笙");
htmlstr=htmlstr.replace(/Lai PengQiang/g,"赖鹏强");
htmlstr=htmlstr.replace(/Li XiaoPing/g,"李小平");
htmlstr=htmlstr.replace(/Li YuXi/g,"李玉溪");
htmlstr=htmlstr.replace(/Liang GuoPin/g,"梁国品");
htmlstr=htmlstr.replace(/Liao YuHao/g,"廖禹豪");
htmlstr=htmlstr.replace(/Liu XueJun/g,"刘学军");
htmlstr=htmlstr.replace(/Mao RongZe/g,"毛荣泽");
htmlstr=htmlstr.replace(/Meng XiaoMa/g,"孟小马");
htmlstr=htmlstr.replace(/Niu XiaoFu/g,"牛小福");
htmlstr=htmlstr.replace(/Qiao YiDa/g,"乔益达");
htmlstr=htmlstr.replace(/She BangWei/g,"佘邦威");
htmlstr=htmlstr.replace(/Shu HuaiDe/g,"舒怀德"); 
htmlstr=htmlstr.replace(/Song GuoNing/g,"宋国宁");
htmlstr=htmlstr.replace(/Wang MingZe/g,"王明泽");
htmlstr=htmlstr.replace(/Wang YaoDong/g,"王耀东");
htmlstr=htmlstr.replace(/Ye LiMing/g,"夜里明");
htmlstr=htmlstr.replace(/Zhong ChiMing/g,"钟驰明");
htmlstr=htmlstr.replace(/Zhou JinQian/g,"周金钱");
htmlstr=htmlstr.replace(/Zhou LeiLei/g,"周雷雷");
htmlstr=htmlstr.replace(/Zhou LinKai/g,"周林楷");

//No.21
//喜洋洋
htmlstr=htmlstr.replace(/Bao RuiHua/g,"包瑞华");
htmlstr=htmlstr.replace(/Bao ShiJie/g,"保时捷");
htmlstr=htmlstr.replace(/Cheng ChangFeng/g,"程常锋");
htmlstr=htmlstr.replace(/Du WeiJie/g,"杜韦杰");
htmlstr=htmlstr.replace(/Gao MingGang/g,"高明刚");
htmlstr=htmlstr.replace(/GongSun AiMin/g,"公孙艾闵");
htmlstr=htmlstr.replace(/He WenChao/g,"何文超");
htmlstr=htmlstr.replace(/Jiang ZhiMing/g,"江智明");
htmlstr=htmlstr.replace(/Kang ChaoBo/g,"康朝博");
htmlstr=htmlstr.replace(/Li XiaoHu/g,"李小虎");
htmlstr=htmlstr.replace(/Lu GuoJie/g,"陆国杰");
htmlstr=htmlstr.replace(/Mu YiHu/g,"穆一虎");
htmlstr=htmlstr.replace(/Shu Qi/g,"舒淇");
htmlstr=htmlstr.replace(/Song Huo/g,"怂货");
htmlstr=htmlstr.replace(/Tang YouXun/g,"唐佑逊");
htmlstr=htmlstr.replace(/Zhan JinTong/g,"战金童");
htmlstr=htmlstr.replace(/Zhang LinPeng/g,"张琳芃");

//No.22
//悠悠小仙姑
htmlstr=htmlstr.replace(/Fu WenWei/g,"符文卫");
htmlstr=htmlstr.replace(/Guo HuWei/g,"郭虎威");
htmlstr=htmlstr.replace(/Qiu QiPeng/g,"裘奇蓬");

//No.23
//Super-inter
htmlstr=htmlstr.replace(/Chu XiongWei/g,"楚雄伟");
htmlstr=htmlstr.replace(/Liang ShuSheng/g,"梁舒声");
htmlstr=htmlstr.replace(/Ou BoQiang/g,"欧博强");
htmlstr=htmlstr.replace(/Wang BaoRen/g,"王宝仁");
htmlstr=htmlstr.replace(/Wu XiRui/g,"吴溪睿");
htmlstr=htmlstr.replace(/Xie XuanQi/g,"谢炫七");
htmlstr=htmlstr.replace(/Yue ChangQing/g,"岳长青");
htmlstr=htmlstr.replace(/Yun YuanHang/g,"云源航");
htmlstr=htmlstr.replace(/Zhang BingJie/g,"张兵杰");
htmlstr=htmlstr.replace(/Zhang ShouCheng/g,"张守诚");
htmlstr=htmlstr.replace(/ZhuGe WeiSheng/g,"诸葛伟胜");

//Blood Raiders  
//ID：4187485
//No.24 
htmlstr=htmlstr.replace(/Bian ChenGuang/g,"卞晨光");
htmlstr=htmlstr.replace(/Chu JinSong/g,"楚晋松");
htmlstr=htmlstr.replace(/Du XinMing/g,"杜心明");
htmlstr=htmlstr.replace(/Fu FeiFei/g,"傅非飞");
htmlstr=htmlstr.replace(/Gao HaoRan/g,"高浩然");
htmlstr=htmlstr.replace(/Hao MinBo/g,"郝珉博");
htmlstr=htmlstr.replace(/Huang DiFan/g,"黄狄凡");
htmlstr=htmlstr.replace(/Ji LuoGen/g,"季罗根");
htmlstr=htmlstr.replace(/Ke JinQing/g,"柯晋卿");
htmlstr=htmlstr.replace(/Li ShiLei/g,"黎世磊");
htmlstr=htmlstr.replace(/Long YuWei/g,"龙禹威");
htmlstr=htmlstr.replace(/Lu NingYuan/g,"陆宁远");
htmlstr=htmlstr.replace(/Mao HongGang/g,"毛洪刚");
htmlstr=htmlstr.replace(/Niu ChengRui/g,"牛承瑞");
htmlstr=htmlstr.replace(/Pang FengFeng/g,"庞丰锋");
htmlstr=htmlstr.replace(/Qiu DaYu/g,"邱大鱼"); 
htmlstr=htmlstr.replace(/Qu HongXuan/g,"曲鸿轩");
htmlstr=htmlstr.replace(/Ran ZhuoXi/g,"冉卓溪");
htmlstr=htmlstr.replace(/Tan GuoYao/g,"谭国耀");
htmlstr=htmlstr.replace(/Wu Bing/g,"武冰");
htmlstr=htmlstr.replace(/Xi HongPing/g,"奚洪平");
htmlstr=htmlstr.replace(/Xu KaiRen/g,"徐凯仁");
htmlstr=htmlstr.replace(/Xuan GuangXin/g,"轩光信");
htmlstr=htmlstr.replace(/Yan ShouWu/g,"严寿武");
htmlstr=htmlstr.replace(/Yan ZiZhou/g,"燕子洲");
htmlstr=htmlstr.replace(/Yu ZhiZhi/g,"于致志");
htmlstr=htmlstr.replace(/Zhang ChuiChui/g,"张吹炊");
htmlstr=htmlstr.replace(/Zhong YingHui/g,"钟颍辉");

//No.25
//蝎子足球-潘公子
//ID：2748735

htmlstr=htmlstr.replace(/Cao '艹欲宫' YuGong|Cao YuGong/g,"曹御恭");
htmlstr=htmlstr.replace(/Christoffer 'C罗' Fuglesang|Christoffer Fuglesang/g,"Christoffer Fuglesang");
htmlstr=htmlstr.replace(/Fang '放羊羊' YangYang|Fang YangYang/g,"方洋洋");
htmlstr=htmlstr.replace(/Gavin '拉姆塞' Gascoigne|Gavin Gascoigne/g,"Gavin Gascoigne");
htmlstr=htmlstr.replace(/Luo '罗桂山' GuiShan|Luo GuiShan/g,"罗桂山");
htmlstr=htmlstr.replace(/Pei '伞队' Wei|Pei Wei/g,"裴威");
htmlstr=htmlstr.replace(/Ruaridh '达格利什' Dunwoodie|Ruaridh Dunwoodie/g,"Ruaridh Dunwoodie");
htmlstr=htmlstr.replace(/Sulkhan '萨内' Dadesheli|Sulkhan Dadesheli/g,"Sulkhan Dadesheli");
htmlstr=htmlstr.replace(/Thomas '托马斯' Svan|Thomas Svan/g,"Thomas Svan");
htmlstr=htmlstr.replace(/Wang '王贱凯' JianKai|Wang JianKai/g,"王健凯");
htmlstr=htmlstr.replace(/Yu '梅克斯' YueHan|Yu YueHan/g,"于越涵");
htmlstr=htmlstr.replace(/Yu '梅克斯' YueHan|Yu YueHan/g,"于越涵");
htmlstr=htmlstr.replace(/Zheng '潇洒哥' XuWei|Zheng XuWei/g,"郑旭威");
htmlstr=htmlstr.replace(/Zhuo '神舟' ShenZhou|Zhuo ShenZhou/g,"卓神舟");

//ID：4202000
//No.26
//梅麓星空
htmlstr=htmlstr.replace(/Cao MingYue/g,"曹明乐");
htmlstr=htmlstr.replace(/Cui ChuGui/g,"崔楚贵");
htmlstr=htmlstr.replace(/Dai PeiPei/g,"戴培培");
htmlstr=htmlstr.replace(/Di ZhiLin/g,"狄志林");
htmlstr=htmlstr.replace(/DongFang DaYu/g,"东方大宇");
htmlstr=htmlstr.replace(/Ge ZhenMing/g,"葛振明");
htmlstr=htmlstr.replace(/Guo RongJiang/g,"郭荣江");
htmlstr=htmlstr.replace(/Hou YunChang/g,"侯云长");
htmlstr=htmlstr.replace(/Ji HongBing/g,"纪宏秉");
htmlstr=htmlstr.replace(/Jian YinJie/g,"简尹杰");
htmlstr=htmlstr.replace(/Jiang KaiQin/g,"蒋凯勤");
htmlstr=htmlstr.replace(/Lang ShiZhang/g,"郎仕璋");
htmlstr=htmlstr.replace(/Li HuiSheng/g,"李辉胜");
htmlstr=htmlstr.replace(/Liu GaoYang/g,"刘高扬");
htmlstr=htmlstr.replace(/Lu XiaoHan/g,"鹿小晗");
htmlstr=htmlstr.replace(/Luo YongZhen/g,"罗永真");
htmlstr=htmlstr.replace(/Ma YanCheng/g,"马彦成");
htmlstr=htmlstr.replace(/Mu ShiJie/g,"穆世杰");
htmlstr=htmlstr.replace(/Rao GongShao/g,"饶功韶");
htmlstr=htmlstr.replace(/Ruan HuiFeng/g,"阮慧峰");
htmlstr=htmlstr.replace(/Shi ChenYi/g,"石晨义");
htmlstr=htmlstr.replace(/Tang HanChao/g,"唐汉超");
htmlstr=htmlstr.replace(/Tian RongKai/g,"田荣凯");
htmlstr=htmlstr.replace(/Tong FengMing/g,"佟凤鸣");
htmlstr=htmlstr.replace(/Tsang Tsolin/g,"臧卓林");
htmlstr=htmlstr.replace(/Wang ZheHao/g,"王哲昊");
htmlstr=htmlstr.replace(/Xu MingQuan/g,"许明权");
htmlstr=htmlstr.replace(/Yang ZuDe/g,"杨祖德");
htmlstr=htmlstr.replace(/Ye ZenKai/g,"叶㻸恺");
htmlstr=htmlstr.replace(/Yu Hunghui/g,"于洪辉");
htmlstr=htmlstr.replace(/Zhong RongKai/g,"钟镕锴");
htmlstr=htmlstr.replace(/Zhou YuanSheng/g,"周远生");
htmlstr=htmlstr.replace(/ZhuGe HongGang/g,"诸葛洪刚");

//No.27
//福建中天FC
//ID:
htmlstr=htmlstr.replace(/Dai YiHu/g,"戴伊虎");
htmlstr=htmlstr.replace(/Du ShiZhao/g,"杜石昭");
htmlstr=htmlstr.replace(/Fei JingRen/g,"费景仁");
htmlstr=htmlstr.replace(/Fu XiangXian/g,"傅祥贤");
htmlstr=htmlstr.replace(/Gong ShiKai/g,"龚世凯"); 
htmlstr=htmlstr.replace(/Hong DaYu/g,"洪大羽");
htmlstr=htmlstr.replace(/Jian YingJie/g,"简英杰");
htmlstr=htmlstr.replace(/Jiang JiaQiang/g,"蒋嘉强");
htmlstr=htmlstr.replace(/Jiang YiFeng/g,"江逸风"); 
htmlstr=htmlstr.replace(/Li ZhiNing/g,"李志宁"); 
htmlstr=htmlstr.replace(/Lv GuangLin/g,"吕广林");
htmlstr=htmlstr.replace(/Ma JiongWen/g,"马炅文");
htmlstr=htmlstr.replace(/Shi YaTao/g,"石亚涛");
htmlstr=htmlstr.replace(/Tan DongYa/g,"谭东亚");
htmlstr=htmlstr.replace(/Wan ZaiYu/g,"万载羽");
htmlstr=htmlstr.replace(/Weng YuJie/g,"翁羽杰");
htmlstr=htmlstr.replace(/Wu SuZheng/g,"吴苏正"); 
htmlstr=htmlstr.replace(/Xie JianJun/g,"谢剑钧"); 
htmlstr=htmlstr.replace(/Ye EnHua/g,"叶恩华"); 
htmlstr=htmlstr.replace(/Ye Qi/g,"叶齐");
htmlstr=htmlstr.replace(/Ying ChangLe/g,"赢长乐");
htmlstr=htmlstr.replace(/Zeng TengLong/g,"曾腾龙");
htmlstr=htmlstr.replace(/Zhang QiongZhong/g,"章琼忠");
htmlstr=htmlstr.replace(/Zhao ZhiKang/g,"赵志康"); 
htmlstr=htmlstr.replace(/Zhi XingYan/g,"智兴岩"); 
htmlstr=htmlstr.replace(/Zhu YunLong/g,"朱云龙");
htmlstr=htmlstr.replace(/Zong DaMing/g,"宗达名");
htmlstr=htmlstr.replace(/Zou JiuZhang/g,"邹玖章");

//28
//根宝足球训练基地
htmlstr=htmlstr.replace(/An WeiWei/g,"安韦玮");

//No.29
//SnowyTown
htmlstr=htmlstr.replace(/Bu YiGuang/g,"卜一光");
htmlstr=htmlstr.replace(/Chao HouLin/g,"晁后邻");
htmlstr=htmlstr.replace(/Chu LiZe/g,"褚利泽");
htmlstr=htmlstr.replace(/Dong MeiYu/g,"董美玉");
htmlstr=htmlstr.replace(/Du PinQuan/g,"杜品荃");
htmlstr=htmlstr.replace(/Gao Gang/g,"高岗");
htmlstr=htmlstr.replace(/Ge ZhiLu/g,"葛志璐");
htmlstr=htmlstr.replace(/GongSun ZhaoShun/g,"公孙昭顺");
htmlstr=htmlstr.replace(/Gui YunFeng/g,"桂云峰");
htmlstr=htmlstr.replace(/He ZhongYou/g,"贺忠友");
htmlstr=htmlstr.replace(/Hong JianYe/g,"洪建业");
htmlstr=htmlstr.replace(/Hou JiuTao/g,"侯久涛");
htmlstr=htmlstr.replace(/Huo MengGu/g,"霍猛故"); 
htmlstr=htmlstr.replace(/Jia JingYang/g,"贾京阳");
htmlstr=htmlstr.replace(/Jian EnHua/g,"简恩华");
htmlstr=htmlstr.replace(/Lai GuangNan/g,"赖光楠");
htmlstr=htmlstr.replace(/Li BoRui/g,"李柏瑞");
htmlstr=htmlstr.replace(/LiYang De/g,"李阳德");
htmlstr=htmlstr.replace(/Liang ZiHeng/g,"梁子恒");
htmlstr=htmlstr.replace(/Liao XiangTao/g,"廖祥涛");
htmlstr=htmlstr.replace(/Luo YanKai/g,"罗颜开");
htmlstr=htmlstr.replace(/Nong An/g,"农安");
htmlstr=htmlstr.replace(/Ou Cheng/g,"欧城");
htmlstr=htmlstr.replace(/Ou JunNan/g,"欧俊男");
htmlstr=htmlstr.replace(/Qian TingRui/g,"钱庭瑞");
htmlstr=htmlstr.replace(/Qiao Da/g,"乔大");
htmlstr=htmlstr.replace(/Shao HanWen/g,"邵汉文");
htmlstr=htmlstr.replace(/Shen GuangQi/g,"沈光奇");
htmlstr=htmlstr.replace(/Shu GuangZhong/g,"舒光忠");
htmlstr=htmlstr.replace(/Shui ShengYuan/g,"水生源");
htmlstr=htmlstr.replace(/Si ZhaoYao/g,"司照耀");
htmlstr=htmlstr.replace(/Sun ShiDuo/g,"孙士多");
htmlstr=htmlstr.replace(/Tang YongBo/g,"汤勇博");
htmlstr=htmlstr.replace(/Wan JinShan/g,"万金山");
htmlstr=htmlstr.replace(/Wang DongLiang/g,"王栋梁");
htmlstr=htmlstr.replace(/Wang XueRui/g,"王雪芮");
htmlstr=htmlstr.replace(/Wei JiaJu/g,"魏家驹");
htmlstr=htmlstr.replace(/Wu Yue/g,"吴越");
htmlstr=htmlstr.replace(/Xu YongHuai/g,"徐勇怀");
htmlstr=htmlstr.replace(/Yang DongJie/g,"杨东杰");
htmlstr=htmlstr.replace(/Ye XiaoPeng/g,"叶霄鹏");
htmlstr=htmlstr.replace(/You HaiQing/g,"游海清");
htmlstr=htmlstr.replace(/Yu Guang/g,"余光");
htmlstr=htmlstr.replace(/Zhai Xun/g,"翟寻");
htmlstr=htmlstr.replace(/Zhang GengYang/g,"张耿阳");
htmlstr=htmlstr.replace(/Zhang XinJie/g,"张新杰");
htmlstr=htmlstr.replace(/Zhang ZhenYang/g,"张震杨");
htmlstr=htmlstr.replace(/Zhang ZhiNing/g,"张志宁");
htmlstr=htmlstr.replace(/Zou QiChen/g,"邹启晨");
htmlstr=htmlstr.replace(/Zou YingChun/g,"邹迎春");


//No.30 
//蓝调火花 
htmlstr=htmlstr.replace(/Arnold Elder/g,"阿诺德·艾尔德");
htmlstr=htmlstr.replace(/Bu ChangHao/g,"卜昌浩");
htmlstr=htmlstr.replace(/Bu ShengJiong/g,"卜圣炅");
htmlstr=htmlstr.replace(/Chen JinLong/g,"陈金龙"); 
htmlstr=htmlstr.replace(/Cheuk Fei Hau/g,"楚飞花");
htmlstr=htmlstr.replace(/Di HouYong/g,"狄侯勇");
htmlstr=htmlstr.replace(/Fábio Da Silva/g,"法比奥·达·席尔瓦"); 
htmlstr=htmlstr.replace(/Gu ChuLiang/g,"顾楚良"); 
htmlstr=htmlstr.replace(/Gu MinWei/g,"顾明伟");
htmlstr=htmlstr.replace(/Huang Rui/g,"黄瑞"); 
htmlstr=htmlstr.replace(/Huo XiJie/g,"霍希杰"); 
htmlstr=htmlstr.replace(/Jia LuChen/g,"贾璐晨"); 
htmlstr=htmlstr.replace(/Li HongGang/g,"李洪刚"); 
htmlstr=htmlstr.replace(/Lin JunJie/g,"林俊杰"); 
htmlstr=htmlstr.replace(/Lin ShuFeng/g,"林澍风");
htmlstr=htmlstr.replace(/Luo YunDing/g,"罗云鼎"); 
htmlstr=htmlstr.replace(/Meng XiaoTian/g,"孟小天"); 
htmlstr=htmlstr.replace(/Mu ChenSong/g,"慕辰松");
htmlstr=htmlstr.replace(/Pan DaMing/g,"潘达明"); 
htmlstr=htmlstr.replace(/Qu Si/g,"曲肆"); 
htmlstr=htmlstr.replace(/Ren QiuMing/g,"任秋明");
htmlstr=htmlstr.replace(/Shu JiaJie/g,"舒佳杰");
htmlstr=htmlstr.replace(/Song KaiMing/g,"宋凯明"); 
htmlstr=htmlstr.replace(/Su XingHan/g,"苏星瀚");
htmlstr=htmlstr.replace(/Tian YuJing/g,"田玉静"); 
htmlstr=htmlstr.replace(/Tong WuLian/g,"童武莲");
htmlstr=htmlstr.replace(/Xi WenQiang/g,"习文强"); 
htmlstr=htmlstr.replace(/Xun LeiLuo/g,"寻雷落");
htmlstr=htmlstr.replace(/Yan HuiLiang/g,"闫慧良");
htmlstr=htmlstr.replace(/Yang HuiPing/g,"杨慧平"); 
htmlstr=htmlstr.replace(/Yin Shi/g,"隐士");
htmlstr=htmlstr.replace(/Yunis Al Mouataz/g,"尤尼斯·爱·蒙塔斯"); 
htmlstr=htmlstr.replace(/Zhao ZeXiang/g,"赵泽翔");
htmlstr=htmlstr.replace(/Zhong JinYuan/g,"钟金元"); 
htmlstr=htmlstr.replace(/Zhou WuKong/g,"周悟空");

//No.31 
//福州泰然 
htmlstr=htmlstr.replace(/Bian JiaKang/g,"卞加康"); 
htmlstr=htmlstr.replace(/Ding XiaoXin/g,"丁晓昕"); 
htmlstr=htmlstr.replace(/Fei YuanDong/g,"费源东"); 
htmlstr=htmlstr.replace(/Gan ChangQing/g,"甘长青"); 
htmlstr=htmlstr.replace(/Gao ZiTeng/g,"高梓腾"); 
htmlstr=htmlstr.replace(/Geng ShenZhou/g,"耿胜周"); 
htmlstr=htmlstr.replace(/Hua GuiYan/g,"华归雁"); 
htmlstr=htmlstr.replace(/Jia XiaoTian/g,"贾晓天"); 
htmlstr=htmlstr.replace(/Jiao DongDong/g,"胶东东"); 
htmlstr=htmlstr.replace(/Li XingHui/g,"李星辉"); 
htmlstr=htmlstr.replace(/Luo JunLing/g,"洛筠凌"); 
htmlstr=htmlstr.replace(/Peng ZiLong/g,"鹏子龙"); 
htmlstr=htmlstr.replace(/Qi YaoTong/g,"齐遥桐"); 
htmlstr=htmlstr.replace(/Tong TianLe/g,"同天乐"); 
htmlstr=htmlstr.replace(/Tu Bai/g,"涂拜"); 
htmlstr=htmlstr.replace(/Weng GenGen/g,"翁根根"); 
htmlstr=htmlstr.replace(/Xian MeiYan/g,"冼梅雁"); 
htmlstr=htmlstr.replace(/Zhan YueSheng/g,"占越胜"); 
htmlstr=htmlstr.replace(/Zhang WenKai/g,"张文凯"); 
htmlstr=htmlstr.replace(/ZhangLiang XiYan/g,"张梁西彦"); 
htmlstr=htmlstr.replace(/Zhao ZuoLin/g,"赵作霖"); 
htmlstr=htmlstr.replace(/Zheng HengShan/g,"正恒山"); 
htmlstr=htmlstr.replace(/Zheng XiGuang/g,"郑熙广"); 
htmlstr=htmlstr.replace(/Zhou JingRen/g,"周惊人"); 
htmlstr=htmlstr.replace(/Zhou JingRen/g,"周景仁"); 

//No.32 
//福州智衡 
htmlstr=htmlstr.replace(/Chen XueFei/g,"陈雪飞"); 
htmlstr=htmlstr.replace(/Chen YinXian/g,"陈寅现"); 
htmlstr=htmlstr.replace(/Ching-Ying Noh/g,"卢称㑞"); 
htmlstr=htmlstr.replace(/Chu DaLei/g,"楚大磊"); 
htmlstr=htmlstr.replace(/Dai XinLei/g,"戴鑫磊"); 
htmlstr=htmlstr.replace(/Dai ZongXian/g,"戴宗宪"); 
htmlstr=htmlstr.replace(/Dong HaiDong/g,"董海东"); 
htmlstr=htmlstr.replace(/Du XinJie/g,"杜鑫杰"); 
htmlstr=htmlstr.replace(/Fu KeJing/g,"傅柯景"); 
htmlstr=htmlstr.replace(/Gao ZhiGang/g,"高志刚"); 
htmlstr=htmlstr.replace(/Guo QiTeng/g,"郭启腾"); 
htmlstr=htmlstr.replace(/He Rui/g,"何睿"); 
htmlstr=htmlstr.replace(/Hua YingXiong/g,"华英雄"); 
htmlstr=htmlstr.replace(/Izidor Zachar/g,"伊兹多尔·扎查尔"); 
htmlstr=htmlstr.replace(/Liao YuXiang/g,"廖宇翔"); 
htmlstr=htmlstr.replace(/Liang TaoMao/g,"梁涛茂"); 
htmlstr=htmlstr.replace(/Lin ShuBao/g,"林书宝"); 
htmlstr=htmlstr.replace(/Lin ShuoCheng/g,"林烁诚"); 
htmlstr=htmlstr.replace(/Lin YaBin/g,"林亚滨"); 
htmlstr=htmlstr.replace(/Lin YaNing/g,"林亚宁"); 
htmlstr=htmlstr.replace(/Lin ZhiBiao/g,"林志彪"); 
htmlstr=htmlstr.replace(/Luan WeiZhuo/g,"栾伟卓"); 
htmlstr=htmlstr.replace(/Ma LongPing/g,"马隆凭"); 
htmlstr=htmlstr.replace(/Mao JiHai/g,"毛济海"); 
htmlstr=htmlstr.replace(/Mao WeiZhuang/g,"毛炜庄"); 
htmlstr=htmlstr.replace(/Milijan Kadirić/g,"米利扬·卡迪里奇"); 
htmlstr=htmlstr.replace(/Ni HuiLiang/g,"倪辉梁"); 
htmlstr=htmlstr.replace(/Pan ZeDong/g,"潘则冬"); 
htmlstr=htmlstr.replace(/Peng ChuYue/g,"彭楚越"); 
htmlstr=htmlstr.replace(/Petros Mavrias/g,"彼得斯·马夫里亚斯"); 
htmlstr=htmlstr.replace(/Qian ZheXuan/g,"钱哲轩"); 
htmlstr=htmlstr.replace(/Sang LinRui/g,"桑林瑞"); 
htmlstr=htmlstr.replace(/Shen MingYi/g,"沈明义"); 
htmlstr=htmlstr.replace(/Shi ChuSheng/g,"石楚生"); 
htmlstr=htmlstr.replace(/Shi ShiKai/g,"石世凯"); 
htmlstr=htmlstr.replace(/Su MingZe/g,"苏铭泽"); 
htmlstr=htmlstr.replace(/Tan AnRui/g,"谭安睿"); 
htmlstr=htmlstr.replace(/Tang ZeZhou/g,"唐泽洲"); 
htmlstr=htmlstr.replace(/Tu DongJian/g,"涂东健"); 
htmlstr=htmlstr.replace(/Wang DaLei/g,"王大雷"); 
htmlstr=htmlstr.replace(/Wang YaoZu/g,"王耀祖"); 
htmlstr=htmlstr.replace(/Wang YouCai/g,"王幼才"); 
htmlstr=htmlstr.replace(/Wen ShaoGu/g,"文绍古"); 
htmlstr=htmlstr.replace(/Wu ShuoCheng/g,"吴朔程"); 
htmlstr=htmlstr.replace(/Yan Chao/g,"严超"); 
htmlstr=htmlstr.replace(/Ye ChenBo/g,"叶辰波"); 
htmlstr=htmlstr.replace(/You DuXu/g,"尤笃旭"); 
htmlstr=htmlstr.replace(/Yu GuiShan/g,"于桂山"); 
htmlstr=htmlstr.replace(/Yu YongYong/g,"于勇勇"); 
htmlstr=htmlstr.replace(/Zhai WenJing/g,"翟文靖"); 
htmlstr=htmlstr.replace(/Zhao ZhaoJing/g,"赵昭景"); 
htmlstr=htmlstr.replace(/Zhang WenHai/g,"张文海"); 
htmlstr=htmlstr.replace(/Zheng MaoMao/g,"郑茂茂"); 
htmlstr=htmlstr.replace(/Zheng PeiSi/g,"郑佩斯"); 
htmlstr=htmlstr.replace(/Zhong JiBin/g,"钟继斌"); 
htmlstr=htmlstr.replace(/Zhong YiDe/g,"钟毅德"); 
htmlstr=htmlstr.replace(/Zhou Lei/g,"周雷"); 
htmlstr=htmlstr.replace(/Zhou ShiPing/g,"周世平"); 
htmlstr=htmlstr.replace(/Zhu JunBiao/g,"朱骏彪"); 
htmlstr=htmlstr.replace(/Zhu ZhenYu/g,"朱镇宇"); 
htmlstr=htmlstr.replace(/Zhuang XiaoMi/g,"庄晓弥");


//No.33
//青岛黄海
htmlstr=htmlstr.replace(/Shu ShuangBang/g,"舒双邦");
htmlstr=htmlstr.replace(/Xu XiangChuang/g,"徐向闯");
htmlstr=htmlstr.replace(/Musgu Bigo/g,"玛斯古·宾狗");
htmlstr=htmlstr.replace(/Nie ZhuoRan/g,"聂卓然");
htmlstr=htmlstr.replace(/Luan JunSheng/g,"栾俊生");

//No.34
//迷途小球童
htmlstr=htmlstr.replace(/Cao XinZhi/g,"曹馨之"); 
htmlstr=htmlstr.replace(/De'ron Powell/g,"德朗·鲍威尔"); 
htmlstr=htmlstr.replace(/Günther Selinger/g,"甘瑟·塞林格"); 
htmlstr=htmlstr.replace(/Hu YaZhao/g,"胡亚朝"); 
htmlstr=htmlstr.replace(/Li ZeTao/g,"李泽涛"); 
htmlstr=htmlstr.replace(/Lin Shou/g,"林寿"); 
htmlstr=htmlstr.replace(/Liu LiMing/g,"刘利明"); 
htmlstr=htmlstr.replace(/Liu YaoDong/g,"刘耀东"); 
htmlstr=htmlstr.replace(/Lu JiaChen/g,"卢佳辰");
htmlstr=htmlstr.replace(/Luo PengXiang/g,"罗鹏翔"); 
htmlstr=htmlstr.replace(/Mohamed Hamdoud/g,"穆罕默德·哈姆杜德"); 
htmlstr=htmlstr.replace(/Niu ShaoNan/g,"牛少楠"); 
htmlstr=htmlstr.replace(/Paul Banica/g,"保罗·巴尼卡"); 
htmlstr=htmlstr.replace(/Ren ChengDe/g,"任成德"); 
htmlstr=htmlstr.replace(/Shan ZhuoYi/g,"单卓义"); 
htmlstr=htmlstr.replace(/Shi GongQing/g,"石功青"); 
htmlstr=htmlstr.replace(/Shu YiJi/g,"书一击"); 
htmlstr=htmlstr.replace(/Shu YueFeng/g,"舒岳峰"); 
htmlstr=htmlstr.replace(/Tian TaoMao/g,"田涛茂"); 
htmlstr=htmlstr.replace(/Wang ShuXiao/g,"王书晓"); 
htmlstr=htmlstr.replace(/Wen JinHuang/g,"文金黄"); 
htmlstr=htmlstr.replace(/Wu JiangHui/g,"吴江辉"); 
htmlstr=htmlstr.replace(/Zhao ShiKai/g,"赵世开"); 
htmlstr=htmlstr.replace(/Zheng ZhiWei/g,"郑智威"); 
htmlstr=htmlstr.replace(/Zhuang XiaoPing/g,"庄小平"); 
htmlstr=htmlstr.replace(/Zu YuanAn/g,"祖元安"); 

//No.35
//湖南楚灵
htmlstr=htmlstr.replace(/Anatoliy Malkovich/g,"安纳托利·马尔科维奇");
htmlstr=htmlstr.replace(/Cen ZhuoXiang/g,"岑啄祥");
htmlstr=htmlstr.replace(/Fang TaiLan/g,"方泰岚");
htmlstr=htmlstr.replace(/Ge ZhiGuo/g,"葛治国");
htmlstr=htmlstr.replace(/Geng ZhongZhong/g,"耿仲忠");
htmlstr=htmlstr.replace(/Giuseppe Giordan/g,"朱塞佩·乔丹");
htmlstr=htmlstr.replace(/Jiang WeiFei/g,"蒋魏霏");
htmlstr=htmlstr.replace(/Kjell Sunde Strøm/g,"凯尔·森德·斯特罗姆");
htmlstr=htmlstr.replace(/Kong YanQiang/g,"孔彦强");
htmlstr=htmlstr.replace(/Li MingYan/g,"黎明言");
htmlstr=htmlstr.replace(/Li XiaoBin/g,"李晓宾");
htmlstr=htmlstr.replace(/Li YiXiang/g,"李亦襄");
htmlstr=htmlstr.replace(/LiuSu HanYu/g,"刘苏涵予");
htmlstr=htmlstr.replace(/LiuSu ZhengXue/g,"刘苏征月");
htmlstr=htmlstr.replace(/Lou RiHua/g,"娄日华");
htmlstr=htmlstr.replace(/Lu DiDi/g,"陆迪迪");
htmlstr=htmlstr.replace(/Luo SongRong/g,"罗松荣");
htmlstr=htmlstr.replace(/Mu ZhongXun/g,"牧众勋");
htmlstr=htmlstr.replace(/MuRong KaiHong/g,"慕容凯虹");
htmlstr=htmlstr.replace(/Qiao MoYi/g,"乔墨衣");
htmlstr=htmlstr.replace(/Shen NiMa/g,"沈尼玛");
htmlstr=htmlstr.replace(/Sang YiCong/g,"桑义聪");
htmlstr=htmlstr.replace(/Sun JiaHao/g,"孙家豪");
htmlstr=htmlstr.replace(/Wang DaBao/g,"王大宝");
htmlstr=htmlstr.replace(/Wen ZhongQian/g,"闻衷谦");
htmlstr=htmlstr.replace(/Xie YunPeng/g,"谢学鹏");
htmlstr=htmlstr.replace(/Ye XiaoBin/g,"叶筱彬");
htmlstr=htmlstr.replace(/Yu WeiGuo/g,"余卫国");
htmlstr=htmlstr.replace(/Yuan Wei/g,"袁炜");
htmlstr=htmlstr.replace(/Zhong Zhi/g,"钟芷");




//No.36
//Deqing C 

htmlstr=htmlstr.replace(/Lai ZiXiang/g,"莱自香"); 
htmlstr=htmlstr.replace(/Ni ShengJie/g,"尼圣洁"); 
htmlstr=htmlstr.replace(/Zhou JinCheng/g,"周金城");
htmlstr=htmlstr.replace(/Fu ZuYao/g,"富祖瑶"); 

//No.37
//东莞FC
htmlstr=htmlstr.replace(/jiao zhenxun/g,"焦振勋"); 
htmlstr=htmlstr.replace(/Liang LeYuan/g,"梁乐源"); 
htmlstr=htmlstr.replace(/Qian ShouTing/g,"钱寿庭"); 
htmlstr=htmlstr.replace(/Fu WangWang/g,"付旺旺"); 
htmlstr=htmlstr.replace(/Kong BingQuan/g,"孔冰泉"); 
htmlstr=htmlstr.replace(/Zhang BinKai/g,"张冰凯"); 
htmlstr=htmlstr.replace(/Shi JiaHong/g,"石驾洪"); 
htmlstr=htmlstr.replace(/XiMen YanKai/g,"西门闫凯"); 
htmlstr=htmlstr.replace(/Fu Chong/g,"傅翀"); 
htmlstr=htmlstr.replace(/Chen HengShan/g,"陈衡山"); 
htmlstr=htmlstr.replace(/Zhao YiFan/g,"赵一帆"); 
htmlstr=htmlstr.replace(/Zhang HuiJie/g,"张慧杰"); 
htmlstr=htmlstr.replace(/Chao WenYi /g,"晁文毅"); 
htmlstr=htmlstr.replace(/Qiang HanLiang/g,"强寒凉"); 
htmlstr=htmlstr.replace(/Lu GuangYuan/g,"陆光远"); 
htmlstr=htmlstr.replace(/SiMa YiWei/g,"司马亿纬"); 
htmlstr=htmlstr.replace(/Wu ZiBo/g,"吴子博"); 
htmlstr=htmlstr.replace(/Huo ZhiLu/g,"霍志璐"); 
htmlstr=htmlstr.replace(/Ping KongMing/g,"平空明"); 
htmlstr=htmlstr.replace(/Zhang Min/g,"张闵"); 
htmlstr=htmlstr.replace(/Jin YiHan/g,"金易寒"); 
htmlstr=htmlstr.replace(/Qin YingJie/g,"秦应节"); 
htmlstr=htmlstr.replace(/Zheng YongHao/g,"郑永昊"); 
htmlstr=htmlstr.replace(/Lu JinTong/g,"路金童"); 
htmlstr=htmlstr.replace(/Feng YaJian/g,"冯涯间"); 
htmlstr=htmlstr.replace(/Hu DaLei/g,"呼大雷"); 
htmlstr=htmlstr.replace(/Zu Yao YuHao/g,"祖姚宇浩"); 




//No.38 严良贤的私人足球队
htmlstr=htmlstr.replace(/Xie ShengLong/g,"谢申龙"); 
htmlstr=htmlstr.replace(/Lei YuanPei/g,"雷元鹏");

//No.39 
//宁波包子队
htmlstr=htmlstr.replace(/Cai SenXiang/g,"蔡森祥");
htmlstr=htmlstr.replace(/Chi JianHua/g,"迟建华");
htmlstr=htmlstr.replace(/Ding JinSha/g,"丁金杀"); 
htmlstr=htmlstr.replace(/Du KeCheng/g,"杜克成");
htmlstr=htmlstr.replace(/Gu ZhuangFei/g,"古庄飞"); 
htmlstr=htmlstr.replace(/Guo YongQi/g,"郭永奇");
htmlstr=htmlstr.replace(/Huo YuanChao/g,"霍元超");
htmlstr=htmlstr.replace(/Kang BinYi/g,"康秉义");
htmlstr=htmlstr.replace(/Kang GaoJun/g,"康高俊");
htmlstr=htmlstr.replace(/Lan AiMin/g,"兰爱民");
htmlstr=htmlstr.replace(/Lei ZhengDong/g,"雷正东"); 
htmlstr=htmlstr.replace(/Li WenZhai/g,"李文斋");
htmlstr=htmlstr.replace(/Li XinKai/g,"李新凯"); 
htmlstr=htmlstr.replace(/Min HongLve/g,"闵洪略");
htmlstr=htmlstr.replace(/Pang Tai/g,"庞泰");
htmlstr=htmlstr.replace(/Qian KaiHong/g,"钱开宏");
htmlstr=htmlstr.replace(/Qian MingYi/g,"钱明一"); 
htmlstr=htmlstr.replace(/Sheng ChengXuan/g,"盛成轩");
htmlstr=htmlstr.replace(/Sun SanSha/g,"孙三沙");
htmlstr=htmlstr.replace(/Wang JianXin/g,"王建新");
htmlstr=htmlstr.replace(/Wang WenLong/g,"王文龙");
htmlstr=htmlstr.replace(/Wu YaJun/g,"吴亚军");
htmlstr=htmlstr.replace(/XiaHou YaoKun/g,"夏侯耀坤");
htmlstr=htmlstr.replace(/Xie SuYi/g,"谢苏仪");
htmlstr=htmlstr.replace(/Xu HongPing/g,"徐洪平");
htmlstr=htmlstr.replace(/Yang HuWei/g,"杨虎威");
htmlstr=htmlstr.replace(/Zhang HouLei/g,"张厚雷");
htmlstr=htmlstr.replace(/Zhang HuiYu/g,"张辉钰"); 
htmlstr=htmlstr.replace(/Zhang YuChuan/g,"张玉川");
htmlstr=htmlstr.replace(/Zhao ShuaiGang/g,"赵帅刚");
htmlstr=htmlstr.replace(/Zheng XianJi/g,"郑宪基");
htmlstr=htmlstr.replace(/Zhuang BingKai/g,"庄兵凯"); 

//No.40
//重庆山层
htmlstr=htmlstr.replace(/Bu ChenJia/g,"步辰嘉");
htmlstr=htmlstr.replace(/Bu ShiDun/g,"步仕敦");
htmlstr=htmlstr.replace(/Chen YuBin/g,"陈宇斌");
htmlstr=htmlstr.replace(/Chu Han/g,"楚汉");
htmlstr=htmlstr.replace(/Ge HouYong/g,"葛侯勇");
htmlstr=htmlstr.replace(/Han Run/g,"韩润");
htmlstr=htmlstr.replace(/Jin GuangZhong/g,"金光中");
htmlstr=htmlstr.replace(/Liang RuiChen/g,"梁睿宸");
htmlstr=htmlstr.replace(/Liu HaiGuang/g,"柳海光");
htmlstr=htmlstr.replace(/Luo Bei/g,"罗贝");
htmlstr=htmlstr.replace(/Luo GuangXin/g,"罗广欣");
htmlstr=htmlstr.replace(/Mu YuShu/g,"穆钰澍");
htmlstr=htmlstr.replace(/Qiu RuoFei/g,"邱若飞");
htmlstr=htmlstr.replace(/Qiu YuJing/g,"邱玉京");
htmlstr=htmlstr.replace(/Rao QunLi/g,"饶群立");
htmlstr=htmlstr.replace(/Ren YuanJi/g,"任元吉");
htmlstr=htmlstr.replace(/Shi JiZe/g,"石纪泽");
htmlstr=htmlstr.replace(/Shi PengCheng/g,"施鹏程");
htmlstr=htmlstr.replace(/Song JianLei/g,"宋健雷");
htmlstr=htmlstr.replace(/Xue ZhenCheng/g,"薛甄诚");
htmlstr=htmlstr.replace(/Yao JiaZe/g,"姚嘉泽");
htmlstr=htmlstr.replace(/Zhang RuiLin/g,"张瑞麟");
htmlstr=htmlstr.replace(/Zhi WenYuan/g,"治文渊");
htmlstr=htmlstr.replace(/Zhou AiHua/g,"周爱华");

//No.41
//温格
htmlstr=htmlstr.replace(/Ding XinChen/g,"丁歆宸");

//No.42
//北京海王星足球俱乐部
htmlstr=htmlstr.replace(/Bao Song/g,"鲍松");
htmlstr=htmlstr.replace(/Cai WeiChao/g,"蔡韦超");
htmlstr=htmlstr.replace(/Cui WangSong/g,"崔望嵩");
htmlstr=htmlstr.replace(/Fei ShiHao/g,"费世豪");
htmlstr=htmlstr.replace(/Feng YuGang/g,"冯玉刚");
htmlstr=htmlstr.replace(/Guo SuMin/g,"郭苏民");
htmlstr=htmlstr.replace(/He CangLong/g,"贺苍龙");
htmlstr=htmlstr.replace(/Hong XiaoMi/g,"AUOK洪小米");
htmlstr=htmlstr.replace(/Hu ShunCheng/g,"胡顺成");
htmlstr=htmlstr.replace(/Jiang QiTeng/g,"蒋启腾");
htmlstr=htmlstr.replace(/Josip Rudman/g,"桥西普·路德曼");
htmlstr=htmlstr.replace(/Ke YouAn/g,"柯有安");
htmlstr=htmlstr.replace(/Liao TieZhu/g,"廖铁柱");
htmlstr=htmlstr.replace(/Lin JiZe/g,"林吉泽");
htmlstr=htmlstr.replace(/Lin WenJian/g,"林文剑");
htmlstr=htmlstr.replace(/Lin XueLiang/g,"林雪亮");
htmlstr=htmlstr.replace(/Liu CunXi/g,"柳存羲");
htmlstr=htmlstr.replace(/Mao JiaLe/g,"毛家乐");
htmlstr=htmlstr.replace(/Mo CangHai/g,"莫沧海");
htmlstr=htmlstr.replace(/Mo YunPeng/g,"莫芸芃");
htmlstr=htmlstr.replace(/Mu WenZhai/g,"穆文斋");
htmlstr=htmlstr.replace(/NanGong JiaLong/g,"南宫佳龙");
htmlstr=htmlstr.replace(/Nikola Pantev/g,"尼古拉·潘德夫");
htmlstr=htmlstr.replace(/Qiao YiXun/g,"乔易迅");
htmlstr=htmlstr.replace(/Qin HuiLiang/g,"秦辉亮");
htmlstr=htmlstr.replace(/Qiu HuiSheng/g,"邱惠生");
htmlstr=htmlstr.replace(/Qiu ZiLiang/g,"丘子良");
htmlstr=htmlstr.replace(/Shan AnRui/g,"单安瑞");
htmlstr=htmlstr.replace(/Shui XianDong/g,"水贤东");
htmlstr=htmlstr.replace(/Stefanos Stamatelos/g,"斯蒂法诺斯·斯塔马特罗斯");
htmlstr=htmlstr.replace(/Tu Chuanhua/g,"屠传华");
htmlstr=htmlstr.replace(/Wang HouCheng/g,"王后塍");
htmlstr=htmlstr.replace(/Waverly Ackman/g,"韦弗利·阿克曼");
htmlstr=htmlstr.replace(/Xi Qian/g,"奚堑");
htmlstr=htmlstr.replace(/Xia JianShan/g,"夏建山");
htmlstr=htmlstr.replace(/XianYu XiaoKai/g,"鲜于小凯");
htmlstr=htmlstr.replace(/Xu ZhaoZhong/g,"许兆忠");
htmlstr=htmlstr.replace(/Yuan RongJiang/g,"袁荣江");
htmlstr=htmlstr.replace(/Zeng LinFu/g,"曾林甫");
htmlstr=htmlstr.replace(/Zhang MeiYu/g,"张梅羽");
htmlstr=htmlstr.replace(/Zhang SangChao/g,"张桑超");
htmlstr=htmlstr.replace(/Zhang You/g,"张有");
htmlstr=htmlstr.replace(/Zheng ZhuangFei/g,"郑庄飞");
htmlstr=htmlstr.replace(/Zhu YunSheng/g,"朱运生");


//No.43
//ZhengJiang GreenTown
htmlstr=htmlstr.replace(/Cheng ChunJie/g,"程纯杰"); 
htmlstr=htmlstr.replace(/Chu TianYang/g,"楚天扬"); 
htmlstr=htmlstr.replace(/He XueShi/g,"何雪诗"); 
htmlstr=htmlstr.replace(/Kang YaoFa/g,"康耀发"); 
htmlstr=htmlstr.replace(/Ke ChenXiong/g,"柯晨雄"); 
htmlstr=htmlstr.replace(/Lei YuYi/g,"雷玉义"); 
htmlstr=htmlstr.replace(/Li ZhiLi/g,"李志立");
htmlstr=htmlstr.replace(/Lian YuKun/g,"连玉琨"); 
htmlstr=htmlstr.replace(/Lin XuePeng/g,"林学鹏"); 
htmlstr=htmlstr.replace(/Liu XiangLin/g,"刘祥林"); 
htmlstr=htmlstr.replace(/Lv ChengYuan/g,"吕程远"); 
htmlstr=htmlstr.replace(/Niu HaiYuan/g,"牛海源"); 
htmlstr=htmlstr.replace(/Rao XunWei/g,"饶迅维"); 
htmlstr=htmlstr.replace(/Sha RuiZe/g,"沙瑞泽"); 
htmlstr=htmlstr.replace(/ShangGuan JianMing/g,"上官建明"); 
htmlstr=htmlstr.replace(/Song WeiSi/g,"宋伟思"); 
htmlstr=htmlstr.replace(/Tong JianFeng/g,"童剑锋"); 
htmlstr=htmlstr.replace(/Wen XueJun/g,"温学军"); 
htmlstr=htmlstr.replace(/Wu ZhiLei/g,"吴志磊"); 
htmlstr=htmlstr.replace(/Xia AiHua/g,"夏爱华"); 
htmlstr=htmlstr.replace(/Xie JinPing/g,"谢金平"); 
htmlstr=htmlstr.replace(/Yao LeiLei/g,"姚磊磊"); 
htmlstr=htmlstr.replace(/Ye CunWei/g,"叶存伟"); 
htmlstr=htmlstr.replace(/Zhang GeZhuo/g,"张歌卓"); 
htmlstr=htmlstr.replace(/Zhang XueSen/g,"张学森"); 
htmlstr=htmlstr.replace(/Zhang ZhongZhong/g,"张钟中"); 
htmlstr=htmlstr.replace(/Zhen ZongCheng/g,"甄宗成"); 
htmlstr=htmlstr.replace(/Zheng JinJiang/g,"郑锦江"); 
htmlstr=htmlstr.replace(/Zheng WenDe/g,"郑文德"); 
htmlstr=htmlstr.replace(/Zhou KaiZe/g,"周凯泽"); 
htmlstr=htmlstr.replace(/Zhu SanQiang/g,"褚三强"); 

//Chelsea FC
//No.44
htmlstr=htmlstr.replace(/Bai BoYan/g,"白博彦");
htmlstr=htmlstr.replace(/Besik Beraia/g,"贝西克·贝拉亚");
htmlstr=htmlstr.replace(/Drahoslav Špilár/g,"德拉霍斯拉夫·斯皮拉尔");
htmlstr=htmlstr.replace(/Errikos Anargyrou/g,"埃里科斯·安纳吉鲁");
htmlstr=htmlstr.replace(/Federico Vergari/g,"费代里科·维尔加里");
htmlstr=htmlstr.replace(/Gong JiaPeng/g,"龚佳鹏");
htmlstr=htmlstr.replace(/José Marcelo Arévalo/g,"何塞·马塞洛·阿雷瓦洛");
htmlstr=htmlstr.replace(/Joško Penezić/g,"约什科·佩尼西奇");
htmlstr=htmlstr.replace(/Juan Benavente/g,"胡安·贝纳文特");
htmlstr=htmlstr.replace(/Kymani Spain/g,"基曼尼·斯班");
htmlstr=htmlstr.replace(/Li HaoZe/g,"李浩泽");
htmlstr=htmlstr.replace(/Liao HaiYuan/g,"廖海源");
htmlstr=htmlstr.replace(/Mohammed Shawqi/g,"穆罕默德·肖齐");
htmlstr=htmlstr.replace(/Na YingLong/g,"那应龙");
htmlstr=htmlstr.replace(/Shi ChengHao/g,"施成浩");
htmlstr=htmlstr.replace(/Sun YaNan/g,"孙亚楠");
htmlstr=htmlstr.replace(/Tomislav Špoljarić/g,"托米斯拉夫·斯波尔贾里奇");
htmlstr=htmlstr.replace(/Valentin Demenko/g,"瓦伦丁·德门科 ");
htmlstr=htmlstr.replace(/Wang JunChao/g,"王俊超");
htmlstr=htmlstr.replace(/Wu TieZhu/g,"吴铁柱");
htmlstr=htmlstr.replace(/Xiong PinLiang/g,"熊品良");
htmlstr=htmlstr.replace(/Xu HengShui/g,"徐衡水");
htmlstr=htmlstr.replace(/Zeng ChaoQun/g,"曾超群");
htmlstr=htmlstr.replace(/Ying ZiXiang/g,"应子翔");
htmlstr=htmlstr.replace(/Zu TingHuan/g,"祖庭欢");


//No.45
//大连秋叶
htmlstr=htmlstr.replace(/Guo SiDe/g,"郭思德");
htmlstr=htmlstr.replace(/Lian JianChun/g,"连建春");
htmlstr=htmlstr.replace(/Liu YunSheng/g,"刘允升");
htmlstr=htmlstr.replace(/Long RuiZhi/g,"龙瑞芝");
htmlstr=htmlstr.replace(/Mao ZhiAn/g,"毛芝安");
htmlstr=htmlstr.replace(/Qiang GuoQing/g,"强国庆");
htmlstr=htmlstr.replace(/Yun ShengQiao/g,"云盛桥");

//No.46
//厦门蓝狮
htmlstr=htmlstr.replace(/Cai XinYu/g,"蔡新宇");
htmlstr=htmlstr.replace(/Chen ZongCheng/g,"陈总成");
htmlstr=htmlstr.replace(/Cian Rodden/g,"锡安·罗登");
htmlstr=htmlstr.replace(/Dai ShiPeng/g,"戴世鹏");
htmlstr=htmlstr.replace(/Davide Pedrini/g,"戴维·佩德里尼");
htmlstr=htmlstr.replace(/Di HaiGuang/g,"狄海光");
htmlstr=htmlstr.replace(/Guan Shou/g,"关守");
htmlstr=htmlstr.replace(/He GenWei/g,"何根伟");
htmlstr=htmlstr.replace(/Jin KaiLing/g,"金凯灵");
htmlstr=htmlstr.replace(/Lv FengYi/g,"吕冯毅");
htmlstr=htmlstr.replace(/Meng MeiSheng/g,"孟美盛");
htmlstr=htmlstr.replace(/Meng YiQiang/g,"孟义强");
htmlstr=htmlstr.replace(/Pan YingChun/g,"潘迎春");
htmlstr=htmlstr.replace(/Ping ShuYun/g,"平书云");
htmlstr=htmlstr.replace(/Qian GouDan/g,"钱狗蛋");
htmlstr=htmlstr.replace(/Ran XiangLi/g,"冉向里");
htmlstr=htmlstr.replace(/Serafeim Ramfos/g,"拉姆福斯");
htmlstr=htmlstr.replace(/Shota Vasadze/g,"瓦萨泽");
htmlstr=htmlstr.replace(/Shui ZhuoXiang/g,"水卓翔");
htmlstr=htmlstr.replace(/Si TingHuan/g,"司挺欢");
htmlstr=htmlstr.replace(/Vanko Chardakov/g,"范科·查达科夫");
htmlstr=htmlstr.replace(/Wang Wen/g,"王文");
htmlstr=htmlstr.replace(/Wei GuoZheng/g,"魏国政");
htmlstr=htmlstr.replace(/Wu ZePeng/g,"吴泽鹏");
htmlstr=htmlstr.replace(/Xuan JunHua/g,"宣俊华");
htmlstr=htmlstr.replace(/Yang ZhiHao/g,"杨志豪");
htmlstr=htmlstr.replace(/Yao TianYi/g,"姚天一");
htmlstr=htmlstr.replace(/Yue BaiQun/g,"岳柏群");
htmlstr=htmlstr.replace(/Yue YaKai/g,"岳亚凯");

//No.47
//流火弱水
htmlstr=htmlstr.replace(/Cui Can/g,"崔璨");
htmlstr=htmlstr.replace(/Gabriele Bosio/g,"加布里埃尔·博西奥");
htmlstr=htmlstr.replace(/Gheorghe Dolanescu/g,"格奥尔基·多兰斯库");
htmlstr=htmlstr.replace(/Guo RuiZhi/g," 郭锐志");
htmlstr=htmlstr.replace(/Hou FengXin/g,"侯奉新");
htmlstr=htmlstr.replace(/Hou SuZheng/g,"侯肃政");
htmlstr=htmlstr.replace(/Jia ZhaoLin/g,"贾兆麟");
htmlstr=htmlstr.replace(/Lai QiMing/g,"赖启铭");
htmlstr=htmlstr.replace(/Li CongRui/g,"李琮瑞");
htmlstr=htmlstr.replace(/Li PeiZhang/g,"李培章");
htmlstr=htmlstr.replace(/Lu WenAn/g,"卢文安");
htmlstr=htmlstr.replace(/Mo Rong/g,"莫荣");
htmlstr=htmlstr.replace(/Nikolaj Jokanović/g,"尼科拉·约卡诺维奇");
htmlstr=htmlstr.replace(/Niu LinGen/g,"牛霖艮");
htmlstr=htmlstr.replace(/Peng MaoGong/g,"彭茂公");
htmlstr=htmlstr.replace(/Qiu HuWei/g,"邱虎威");
htmlstr=htmlstr.replace(/Shi XueQian/g,"史学谦");
htmlstr=htmlstr.replace(/Vince Moret/g,"文斯·莫雷特");
htmlstr=htmlstr.replace(/Xiong TianYou/g,"熊天佑");
htmlstr=htmlstr.replace(/Yang ZeJia/g,"杨泽嘉");
htmlstr=htmlstr.replace(/Zhai YueLei/g,"翟岳磊");
htmlstr=htmlstr.replace(/Zhuang JunHui/g,"庄君辉");
htmlstr=htmlstr.replace(/Zu Yao XiaoBin/g,"祖尧小斌");

//No.48
//绿帽子FC
htmlstr=htmlstr.replace(/Deng YuGang/g,"邓玉刚"); 
htmlstr=htmlstr.replace(/Ren ChenChen/g,"任晨晨"); 
htmlstr=htmlstr.replace(/Wan JuJi/g,"万巨基");
htmlstr=htmlstr.replace(/Wei YanJun/g,"魏彦军"); 
htmlstr=htmlstr.replace(/Wu YuanQing/g,"吴苑晴"); 
htmlstr=htmlstr.replace(/Zhuang TieLin/g,"庄铁林"); 


//No.49
//成都FC
htmlstr=htmlstr.replace(/Wu ZhuoFan/g,"武周芳"); 
htmlstr=htmlstr.replace(/Zhou YiCong/g,"周义从");
htmlstr=htmlstr.replace(/He ZiChen/g,"何子辰"); 
htmlstr=htmlstr.replace(/Yu JunCheng/g,"雨均城");
htmlstr=htmlstr.replace(/Xiong YingXiong/g,"熊应雄");
htmlstr=htmlstr.replace(/Liu Kang/g,"刘康");
htmlstr=htmlstr.replace(/Dong Long/g,"董龙");
htmlstr=htmlstr.replace(/Wang YiShan/g,"王一山");
htmlstr=htmlstr.replace(/Zhao Han/g,"赵韩");
htmlstr=htmlstr.replace(/Nong Jin/g,"农进");
htmlstr=htmlstr.replace(/Hong ZheQian/g,"洪哲乾");
htmlstr=htmlstr.replace(/Zhang HaiJie/g,"张海杰");

//No.50
//喵喵FC
htmlstr=htmlstr.replace(/Ping PengDong/g,"屏彭栋");
htmlstr=htmlstr.replace(/Wang ShiRong/g,"王仕荣");
htmlstr=htmlstr.replace(/Zhou LinFeng/g,"周林峰");
htmlstr=htmlstr.replace(/Zhu Dao/g,"朱刀");


//No.51
//天淡蓝
htmlstr=htmlstr.replace(/Alvydas Guogas/g,"阿尔维达斯·郭加斯");
htmlstr=htmlstr.replace(/Cai TianWen/g,"蔡天文");
htmlstr=htmlstr.replace(/ChuLi RunFa/g,"樗里润发");
htmlstr=htmlstr.replace(/GongSun RenJie/g,"公孙仁杰");
htmlstr=htmlstr.replace(/Zuo ZhiFei/g,"左挚飞");

//No.52
//纯白
htmlstr=htmlstr.replace(/Cheng JingZe/g,"程景泽");
htmlstr=htmlstr.replace(/DongGuo ZongJi/g,"东郭宗济");
htmlstr=htmlstr.replace(/He YiJi/g,"何伊基");
htmlstr=htmlstr.replace(/Meng Xu/g,"孟旭"); 
htmlstr=htmlstr.replace(/Mo GuangJian/g,"莫广建");
htmlstr=htmlstr.replace(/Ning ZhuoXiang/g,"宁卓祥");
htmlstr=htmlstr.replace(/Wang JingDong/g,"王京东");
htmlstr=htmlstr.replace(/Xiao XueDong/g,"萧学栋");
htmlstr=htmlstr.replace(/Yuan RuiYang/g,"袁瑞阳"); 
htmlstr=htmlstr.replace(/ZhangSun JinZhong/g,"长孙晋忠");
htmlstr=htmlstr.replace(/Zhao PinGuan/g,"赵品冠");
htmlstr=htmlstr.replace(/Zhen XuePeng/g,"甄学鹏");

//No.53
//SHE
htmlstr=htmlstr.replace(/Chi ShiChao/g,"迟诗潮");
htmlstr=htmlstr.replace(/Chi YueYan/g,"迟悦颜");
htmlstr=htmlstr.replace(/Chu DaYou/g,"楚大悠");
htmlstr=htmlstr.replace(/Cui Bu/g,"崔卜");
htmlstr=htmlstr.replace(/Dai PinXian/g,"戴品娴");
htmlstr=htmlstr.replace(/Du WenYan/g,"杜雯妍");
htmlstr=htmlstr.replace(/Fan SuMeng/g,"范苏萌");
htmlstr=htmlstr.replace(/He XuSheng/g,"何絮笙");
htmlstr=htmlstr.replace(/Kang JiQin/g,"康寄琴");
htmlstr=htmlstr.replace(/Li JinFei/g,"李锦霏");
htmlstr=htmlstr.replace(/Li YiTeng/g,"李依藤");
htmlstr=htmlstr.replace(/Luo ChenRui/g,"罗晨蕊");
htmlstr=htmlstr.replace(/Pan WanChun/g,"潘婉纯");
htmlstr=htmlstr.replace(/Qi Cen/g,"祁涔");
htmlstr=htmlstr.replace(/Qiu ChangBiao/g,"秋长飚");
htmlstr=htmlstr.replace(/Shu XiuFu/g,"舒秀芙");
htmlstr=htmlstr.replace(/Sun FengSheng/g,"孙枫笙");
htmlstr=htmlstr.replace(/Sun JiLi/g,"孙霁丽");
htmlstr=htmlstr.replace(/Xiao JuXin/g,"萧鞠昕");
htmlstr=htmlstr.replace(/Xiao ZhaoXian/g,"萧昭娴");
htmlstr=htmlstr.replace(/Yan YiCong/g,"颜伊丛");
htmlstr=htmlstr.replace(/Yang DiZhou/g,"杨笛舟");
htmlstr=htmlstr.replace(/Yang GaoJun/g,"杨高郡");
htmlstr=htmlstr.replace(/Yuan GuoWen/g,"袁果雯");
htmlstr=htmlstr.replace(/Yuan ZhuoFan/g,"袁卓帆");
htmlstr=htmlstr.replace(/Zhai HaiTing/g,"翟海婷");
htmlstr=htmlstr.replace(/Zhang ZhengDong/g,"张筝冬");
htmlstr=htmlstr.replace(/Zhao KeYi/g,"赵珂伊");

//No.54
//重庆云栖
htmlstr=htmlstr.replace(/Abraham Zuffi/g,"亚伯拉罕·祖菲"); 
htmlstr=htmlstr.replace(/Ao YaKe/g,"敖亚可"); 
htmlstr=htmlstr.replace(/Aristos Kougias/g,"阿里斯托·库吉亚斯"); 
htmlstr=htmlstr.replace(/Bei WeiFei/g,"贝伟飞"); 
htmlstr=htmlstr.replace(/Chai MinWei/g,"柴敏伟"); 
htmlstr=htmlstr.replace(/Cheng Ying/g,"程英"); 
htmlstr=htmlstr.replace(/Diao LingHui/g,"刁灵辉"); 
htmlstr=htmlstr.replace(/Dong PeiDong/g,"董培栋"); 
htmlstr=htmlstr.replace(/Du HongLiang/g,"杜洪亮"); 
htmlstr=htmlstr.replace(/Irven Coleman/g,"艾文·科尔曼"); 
htmlstr=htmlstr.replace(/Jonne Jokinen/g,"乔尼·乔金恩"); 
htmlstr=htmlstr.replace(/Li QuanShun/g,"李全顺"); 
htmlstr=htmlstr.replace(/Li ZhongLong/g,"李忠龙"); 
htmlstr=htmlstr.replace(/Lin ZiXiang/g,"林子祥"); 
htmlstr=htmlstr.replace(/Lu Hong/g,"陆宏"); 
htmlstr=htmlstr.replace(/Ma HaoZheng/g,"马浩正"); 
htmlstr=htmlstr.replace(/Pei HuXiang/g,"裴虎翔"); 
htmlstr=htmlstr.replace(/Qiao Zhen/g,"乔真"); 
htmlstr=htmlstr.replace(/Rao XuePeng/g,"饶学鹏"); 
htmlstr=htmlstr.replace(/She ChenBin/g,"佘晨彬"); 
htmlstr=htmlstr.replace(/Shu RongZe/g,"舒荣泽"); 
htmlstr=htmlstr.replace(/Wang JianFeng/g,"王剑锋"); 
htmlstr=htmlstr.replace(/Weng BaiChuan/g,"翁百川"); 
htmlstr=htmlstr.replace(/Xi HongHai/g,"席洪海"); 
htmlstr=htmlstr.replace(/Xu GuanHong/g,"徐关宏"); 
htmlstr=htmlstr.replace(/Yu ChongWen/g,"于崇文"); 
htmlstr=htmlstr.replace(/Zhan YueFei/g,"詹岳飞");
htmlstr=htmlstr.replace(/Zong ZhenXiang/g,"宗振祥"); 
htmlstr=htmlstr.replace(/Zou ZhenDong/g,"邹振东"); 

htmlstr=htmlstr.replace(/Guo TianQi/g,"郭天奇"); 
htmlstr=htmlstr.replace(/Yu WeiJie/g,"于伟杰"); 
htmlstr=htmlstr.replace(/Mu YouHe/g,"穆友河"); 
htmlstr=htmlstr.replace(/Wan ZhongYing/g,"王忠英"); 
htmlstr=htmlstr.replace(/Zhang JianTing/g,"张建亭"); 
htmlstr=htmlstr.replace(/Shu MianXin/g,"舒绵新"); 
htmlstr=htmlstr.replace(/Ye XiYan/g,"叶西岩"); 
htmlstr=htmlstr.replace(/Xu XuanYi/g,"徐轩仪"); 
htmlstr=htmlstr.replace(/Huang ShanGen/g,"黄山根"); 
htmlstr=htmlstr.replace(/Song RenYing/g,"宋仁颖"); 
htmlstr=htmlstr.replace(/An YiJian/g,"安义剑"); 
htmlstr=htmlstr.replace(/Bai HaoRong/g,"白浩荣"); 
htmlstr=htmlstr.replace(/Chu LiangJun/g,"褚良军"); 

//No.55
//陕西长安竞技
htmlstr=htmlstr.replace(/Chen YuGang/g,"陈玉刚"); 
htmlstr=htmlstr.replace(/Cheng Bo/g,"程博"); 
htmlstr=htmlstr.replace(/Dang ShiMin/g,"党世敏"); 
htmlstr=htmlstr.replace(/Dou NingTao/g,"窦宁涛"); 
htmlstr=htmlstr.replace(/Du ShanGen/g,"杜善根"); 
htmlstr=htmlstr.replace(/Fan ZhiHeng/g,"范志恒"); 
htmlstr=htmlstr.replace(/He ZheHao/g,"何哲豪"); 
htmlstr=htmlstr.replace(/Hong XuRi/g,"洪旭日");
htmlstr=htmlstr.replace(/Hua XiaoXin/g,"华晓鑫"); 
htmlstr=htmlstr.replace(/Jiang QiuMing/g,"姜秋明"); 
htmlstr=htmlstr.replace(/Li ZhenDong/g,"李振东"); 
htmlstr=htmlstr.replace(/Lian XiangMin/g,"廉项敏"); 
htmlstr=htmlstr.replace(/Liu XianZhi/g,"刘献志"); 
htmlstr=htmlstr.replace(/Ma ChenXi/g,"马晨曦"); 
htmlstr=htmlstr.replace(/Ping YanSong/g,"平岩松"); 
htmlstr=htmlstr.replace(/Qin QingLin/g,"秦清霖"); 
htmlstr=htmlstr.replace(/Su YiTai/g,"苏毅泰"); 
htmlstr=htmlstr.replace(/Wang JinFei/g,"王锦飞"); 
htmlstr=htmlstr.replace(/Wei YeXuan/g,"韦叶轩"); 
htmlstr=htmlstr.replace(/Wu RuiHao/g,"吴睿皓"); 
htmlstr=htmlstr.replace(/You XiaoPeng/g,"游霄鹏"); 
htmlstr=htmlstr.replace(/Zhai XuHeYue/g,"翟徐和悦"); 
htmlstr=htmlstr.replace(/Zhang JingTian/g,"张景添"); 
htmlstr=htmlstr.replace(/Zhang TianCheng/g,"张天成"); 
htmlstr=htmlstr.replace(/Zhang YuQing/g,"张宇清"); 
htmlstr=htmlstr.replace(/Zhao FeiFan/g,"赵非凡"); 
htmlstr=htmlstr.replace(/Zheng JingLiao/g,"郑景辽"); 
htmlstr=htmlstr.replace(/Zhuang SanSha/g,"庄三沙"); 

//No.56
//醉酒青牛
htmlstr=htmlstr.replace(/Du HongLiang/g,"杜洪亮");
htmlstr=htmlstr.replace(/Fei ZhenDong/g,"费振东");
htmlstr=htmlstr.replace(/He DongJian/g,"何东健");
htmlstr=htmlstr.replace(/Hong KaiGe/g,"洪凯歌");
htmlstr=htmlstr.replace(/Hu Man/g,"胡曼");
htmlstr=htmlstr.replace(/Ji MingJing/g,"姬明镜");
htmlstr=htmlstr.replace(/Jing Ming/g,"荆铭");
htmlstr=htmlstr.replace(/Lei DeChao/g,"雷德超");
htmlstr=htmlstr.replace(/Liang XiangYang/g,"梁向阳");
htmlstr=htmlstr.replace(/Liao HongXuan/g,"廖洪轩");
htmlstr=htmlstr.replace(/Lin ZuXian/g,"林祖贤");
htmlstr=htmlstr.replace(/Ma XuanDe/g,"马宣德");
htmlstr=htmlstr.replace(/Peng RuiHua/g,"彭瑞华");
htmlstr=htmlstr.replace(/Pu ZhengTu/g,"蒲正图");
htmlstr=htmlstr.replace(/Song YanHeng/g,"宋衍蘅");
htmlstr=htmlstr.replace(/Su XinKai/g,"苏新凯");
htmlstr=htmlstr.replace(/Tai ZhiLi/g,"邰智力");
htmlstr=htmlstr.replace(/Xiao LiJun/g,"肖丽君");
htmlstr=htmlstr.replace(/Yu YanQiu/g,"于艳秋");
htmlstr=htmlstr.replace(/Zhai HengCheng/g,"翟恒诚");
htmlstr=htmlstr.replace(/Zhao YueYing/g,"赵月英");
htmlstr=htmlstr.replace(/Zhao ZhongShan/g,"赵中山");
htmlstr=htmlstr.replace(/Zhi HuiChen/g,"跖汇诚");
htmlstr=htmlstr.replace(/Zong WangSong/g,"宗忘松");

//No.57
//釜山航海
htmlstr=htmlstr.replace(/Cheol-Suk Rhee/g,"李哲石");
htmlstr=htmlstr.replace(/Chang-Hyun You/g,"游昌贤");
htmlstr=htmlstr.replace(/Chul-Ho Cha/g,"车哲豪");
htmlstr=htmlstr.replace(/Dae-Ui Kim/g,"金大义");
htmlstr=htmlstr.replace(/Doo-Hyun Cho/g,"赵斗现");
htmlstr=htmlstr.replace(/Doo-Hyung Lee/g,"李斗亨");
htmlstr=htmlstr.replace(/Eun-Sung Yim/g,"尹恩成");
htmlstr=htmlstr.replace(/Geert Wiegmans/g,"盖尔特·威格曼斯");
htmlstr=htmlstr.replace(/Heung-Soo Park/g,"朴兴秀");
htmlstr=htmlstr.replace(/Ho-Jun Lee/g,"李浩俊");
htmlstr=htmlstr.replace(/Hon-Yong Park/g,"朴仁勇");
htmlstr=htmlstr.replace(/Hong-Cheol I/g,"易洪哲");
htmlstr=htmlstr.replace(/Hyang-Soon Lee/g,"李香顺");
htmlstr=htmlstr.replace(/Jae-Soo Son/g,"孙贵寿");
htmlstr=htmlstr.replace(/Jeaki Choi/g,"崔杰基");
htmlstr=htmlstr.replace(/Ji-Sung Chung/g,"郑至诚");
htmlstr=htmlstr.replace(/Ji-Sung Kwon/g,"权智成");
htmlstr=htmlstr.replace(/Ji-Sung Park/g,"朴智成");
htmlstr=htmlstr.replace(/Jin-Kyu Yeo/g,"杨镇圭");
htmlstr=htmlstr.replace(/Jong-Chun Kim/g,"金钟纯");
htmlstr=htmlstr.replace(/Joo-Hyung Lee/g,"李卓雄");
htmlstr=htmlstr.replace(/Joong-Kyung Kim/g,"金钟京");
htmlstr=htmlstr.replace(/Jung-Ho Lee/g,"李正浩");
htmlstr=htmlstr.replace(/Jung-Hyun Lee/g,"李正贤");
htmlstr=htmlstr.replace(/Ki-Bo Park/g,"朴琪甫");
htmlstr=htmlstr.replace(/Kyung-Ho Choi/g,"崔景镐");
htmlstr=htmlstr.replace(/Magor Csanádi/g,"马加尔·萨纳迪");
htmlstr=htmlstr.replace(/Matteo Meneghini/g,"马特奥·蒙内基尼");
htmlstr=htmlstr.replace(/Min-Kwi Cha/g,"车敏贵");
htmlstr=htmlstr.replace(/Mirko Paesano/g,"米尔科·帕萨诺");
htmlstr=htmlstr.replace(/Myung-Bo Choi/g,"崔明博");
htmlstr=htmlstr.replace(/Sa-Vik Lee/g,"李沙伟");
htmlstr=htmlstr.replace(/Sang-Ki Lee/g,"李相基");
htmlstr=htmlstr.replace(/Seung-Hwa Koo/g,"具承华");
htmlstr=htmlstr.replace(/Seung-Mee Cho/g,"赵胜玟");
htmlstr=htmlstr.replace(/So-Young Lee/g,"李素容");
htmlstr=htmlstr.replace(/Stoil Vidov/g,"斯蒂尔·维多夫");
htmlstr=htmlstr.replace(/Sung-Ki Moon/g,"文成基");
htmlstr=htmlstr.replace(/Sung-Kuk Shin/g,"宋成国");
htmlstr=htmlstr.replace(/Sung-Yong Jung/g,"郑成龙");
htmlstr=htmlstr.replace(/Tae-Song Lee/g,"李泰松");
htmlstr=htmlstr.replace(/Yong-Jin You/g,"游永进");
htmlstr=htmlstr.replace(/Yong-Soo Park/g,"朴龙洙");
htmlstr=htmlstr.replace(/Young-A Cho/g,"赵荣阿");
htmlstr=htmlstr.replace(/Young-Kwang Hwang/g,"黄英光");
htmlstr=htmlstr.replace(/Young-Pyo Park/g,"朴英杓");




//No.58
//U.C.kaifeng
htmlstr=htmlstr.replace(/Daniel Kobierski/g,"丹尼尔·科比尔斯基");
htmlstr=htmlstr.replace(/Dea Yanpeng/g,"狄延鹏");
htmlstr=htmlstr.replace(/DuanMu ZhouHong/g,"端木周鸿");
htmlstr=htmlstr.replace(/Guo ZhongLong/g,"郭忠龙");
htmlstr=htmlstr.replace(/He ZhiXuan/g,"何志轩"); 
htmlstr=htmlstr.replace(/Lavrentiy Nebozhuk/g,"拉夫伦蒂·尼博祖克");
htmlstr=htmlstr.replace(/Mohammad Ali Vaghari/g,"穆罕默德•阿里·瓦格哈里");
htmlstr=htmlstr.replace(/Toms Ķesteris/g,"汤姆斯·埃斯特里斯");
htmlstr=htmlstr.replace(/Wang YongHuai/g,"王永怀");
htmlstr=htmlstr.replace(/Zhou Yang/g,"周洋");

//No.59
//魔法少女TeRiRi 
htmlstr=htmlstr.replace(/Bai YuHe/g,"白羽鹤"); 
htmlstr=htmlstr.replace(/Chen BinJie/g,"陈斌杰");
htmlstr=htmlstr.replace(/Chen ZeMin/g,"陈泽民"); 
htmlstr=htmlstr.replace(/Chu XiaoYi/g,"楚晓伊"); 
htmlstr=htmlstr.replace(/Fan ShaGen/g,"范杀亘");
htmlstr=htmlstr.replace(/Feng Jie/g,"冯杰"); 
htmlstr=htmlstr.replace(/Hu TaiLang/g,"胡太郎"); 
htmlstr=htmlstr.replace(/Hua Feng/g,"画风"); 
htmlstr=htmlstr.replace(/Jia MuYao/g,"贾慕遥"); 
htmlstr=htmlstr.replace(/Lei ChengDe/g,"雷承德"); 
htmlstr=htmlstr.replace(/Lei ZeRui/g,"雷泽锐"); 
htmlstr=htmlstr.replace(/Lian HengCheng/g,"连恒成"); 
htmlstr=htmlstr.replace(/Lin BaoShan/g,"林宝山"); 
htmlstr=htmlstr.replace(/Lin ZhiKai/g,"林志凯"); 
htmlstr=htmlstr.replace(/Lin ZiXin/g,"林梓新"); 
htmlstr=htmlstr.replace(/Liu KaiZhong/g,"刘凯钟"); 
htmlstr=htmlstr.replace(/Luo ZhenSheng/g,"罗臻晟");
htmlstr=htmlstr.replace(/Mou YouAn/g,"牟佑安"); 
htmlstr=htmlstr.replace(/Na Tu/g,"那途"); 
htmlstr=htmlstr.replace(/Niu TiXiang/g,"牛题湘"); 
htmlstr=htmlstr.replace(/Qiu DaChui/g,"邱大锤"); 
htmlstr=htmlstr.replace(/She ShiMing/g,"佘室铭"); 
htmlstr=htmlstr.replace(/Shi JingKai/g,"师敬楷"); 
htmlstr=htmlstr.replace(/Song ShuSheng/g,"颂书生"); 
htmlstr=htmlstr.replace(/Tian ShuHao/g,"田书豪"); 
htmlstr=htmlstr.replace(/Wang EnLai/g,"王恩来"); 
htmlstr=htmlstr.replace(/Xiang Fa/g,"向法"); 
htmlstr=htmlstr.replace(/Xue TianRui/g,"薛天睿"); 
htmlstr=htmlstr.replace(/Yan YongKang/g,"颜永康"); 
htmlstr=htmlstr.replace(/Zhan YaJie/g,"詹亚杰"); 
htmlstr=htmlstr.replace(/Zhang JianJun/g,"章剑鋆"); 
htmlstr=htmlstr.replace(/Zhang XueLiang/g,"张学良");
htmlstr=htmlstr.replace(/Zhou ShangYuan/g,"周尚垣"); 
htmlstr=htmlstr.replace(/Zhou TaoTao/g,"周滔涛"); 


//No.60
//自由人
htmlstr=htmlstr.replace(/Ai YanQiu/g,"艾雁秋"); 
htmlstr=htmlstr.replace(/Hua YiDuo/g,"花一朵"); 
htmlstr=htmlstr.replace(/Ou JingXuan/g,"区静轩"); 
htmlstr=htmlstr.replace(/Qu Jin/g,"曲尽"); 
htmlstr=htmlstr.replace(/Shi JiaQian/g,"石嘉乾"); 
htmlstr=htmlstr.replace(/Su YaoZu/g,"苏耀祖"); 
htmlstr=htmlstr.replace(/Su ZePeng/g,"苏泽鹏"); 
htmlstr=htmlstr.replace(/XiaHou BinJia/g,"夏侯宾佳"); 
htmlstr=htmlstr.replace(/Xian XueGen/g,"冼雪根"); 
htmlstr=htmlstr.replace(/Xing TaiLang/g,"幸太郎"); 
htmlstr=htmlstr.replace(/Zhang BenJian/g,"张本舰"); 
htmlstr=htmlstr.replace(/Zhong KeXing/g,"钟恪兴"); 
htmlstr=htmlstr.replace(/Zhong YunHe/g,"中云鹤"); 
htmlstr=htmlstr.replace(/Zhou LiFu/g,"周礼服");

//No.61
//宁夏凤凰涅槃足球俱乐部
//NID:4336460
htmlstr=htmlstr.replace(/Dai XiaoQian/g,"戴晓倩"); 
htmlstr=htmlstr.replace(/Guo He/g,"郭郃"); 
htmlstr=htmlstr.replace(/He XingHan/g,"何兴涵"); 
htmlstr=htmlstr.replace(/Hu WenZhao/g,"胡文钊"); 
htmlstr=htmlstr.replace(/Lang JiaJie/g,"梁佳杰"); 
htmlstr=htmlstr.replace(/Liang AnQi/g,"梁安琪"); 
htmlstr=htmlstr.replace(/Lu LiSan/g,"陆离三"); 
htmlstr=htmlstr.replace(/Mu ZhiFan/g,"穆志帆"); 
htmlstr=htmlstr.replace(/Wang GuanYin/g,"王冠殷"); 
htmlstr=htmlstr.replace(/Wang ShuRen/g,"王树人"); 
htmlstr=htmlstr.replace(/Wang YaoYao/g,"王瑶瑶"); 
htmlstr=htmlstr.replace(/Xi WenMing/g,"席文明"); 
htmlstr=htmlstr.replace(/Xu ZhongShi/g,"徐忠师"); 
htmlstr=htmlstr.replace(/Yan ZhiPing/g,"闫志平"); 
htmlstr=htmlstr.replace(/Yuan WenXiong/g,"袁文雄"); 


//ID:4370110 
//No.62
//昆山FC
htmlstr=htmlstr.replace(/Cai JingChang/g,"蔡靖昶"); 
htmlstr=htmlstr.replace(/Cao QingChang/g,"曹清昌"); 
htmlstr=htmlstr.replace(/Deng ChenXi/g,"邓陈熙"); 
htmlstr=htmlstr.replace(/Gan ChengDong/g,"甘成栋"); 
htmlstr=htmlstr.replace(/Hong ChenYuan/g,"洪辰元"); 
htmlstr=htmlstr.replace(/Jia Cheng/g,"贾诚"); 
htmlstr=htmlstr.replace(/Jiang HaiQuan/g,"江海泉"); 
htmlstr=htmlstr.replace(/Jin RuiZhe/g,"金瑞泽"); 
htmlstr=htmlstr.replace(/Lv BoRui/g,"吕博睿"); 
htmlstr=htmlstr.replace(/Naj AI Garni/g," 加尔尼"); 
htmlstr=htmlstr.replace(/Qian XiaoTian/g,"钱啸天"); 
htmlstr=htmlstr.replace(/Qiu HouYong/g,"邱侯勇"); 
htmlstr=htmlstr.replace(/Shan JunYan/g,"单俊彦"); 
htmlstr=htmlstr.replace(/Shao GuoQiang/g,"邵国强"); 
htmlstr=htmlstr.replace(/Song Gan/g,"宋敢"); 
htmlstr=htmlstr.replace(/SunWuJi/g,"孙武骥"); 
htmlstr=htmlstr.replace(/Tao Tong/g,"陶彤"); 
htmlstr=htmlstr.replace(/Tian ZhiXin/g,"田智鑫"); 
htmlstr=htmlstr.replace(/Wang WeiCheng /g,"王伟成"); 
htmlstr=htmlstr.replace(/Wu Tong/g,"吴桐"); 
htmlstr=htmlstr.replace(/Xi Fan/g,"郗范"); 
htmlstr=htmlstr.replace(/Yan ShengRui/g,"严晟睿"); 
htmlstr=htmlstr.replace(/Yang HaiYu/g,"杨海羽"); 
htmlstr=htmlstr.replace(/Zhen DeMin/g,"甄德旻"); 
htmlstr=htmlstr.replace(/Zhou Li/g,"周礼"); 
htmlstr=htmlstr.replace(/Zhu ChunJie/g,"朱春杰"); 


//No.63
//NID:4357337
//载云旗兮委蛇
htmlstr=htmlstr.replace(/Evandro Bondosog/g,"伊万德罗·博恩多索"); 
htmlstr=htmlstr.replace(/Ge TianHao/g,"葛天豪"); 
htmlstr=htmlstr.replace(/Hillar Kösse/g,"希拉尔·科泽"); 
htmlstr=htmlstr.replace(/Hou JianFu/g,"侯建福"); 
htmlstr=htmlstr.replace(/Hu ShiAn/g,"胡世安"); 
htmlstr=htmlstr.replace(/Huang JianShan/g,"黄建山"); 
htmlstr=htmlstr.replace(/Ning XuFeng/g,"宁旭峰"); 
htmlstr=htmlstr.replace(/Qu WeiZhuo/g,"曲伟卓"); 
htmlstr=htmlstr.replace(/Roan Moreno/g,"罗安·莫雷诺"); 
htmlstr=htmlstr.replace(/Song WeiJian/g,"宋伟健"); 
htmlstr=htmlstr.replace(/Søren Bonnum/g,"索伦·博恩纳姆"); 
htmlstr=htmlstr.replace(/Valentín Moreira/g,"瓦伦汀·莫雷拉"); 
htmlstr=htmlstr.replace(/Xiong Miao/g,"熊苗"); 
htmlstr=htmlstr.replace(/Xue RongJi/g,"薛荣吉"); 
htmlstr=htmlstr.replace(/Yang JianTing/g,"杨建亭"); 
htmlstr=htmlstr.replace(/Yosgart Carrasco/g,"约斯加特·卡拉斯科"); 
htmlstr=htmlstr.replace(/Yu Qingi/g,"余庆"); 
htmlstr=htmlstr.replace(/Zhou YiTai/g,"周一泰"); 

//No.64
//ZID:4357352
//孙笑川258
htmlstr=htmlstr.replace(/Bei JinTao/g,"北京涛"); 
htmlstr=htmlstr.replace(/Bi LiFu/g,"比利弗");
htmlstr=htmlstr.replace(/Cai WenLong/g,"蔡文龙"); 
htmlstr=htmlstr.replace(/Cheng ChangLe/g,"程长乐");
htmlstr=htmlstr.replace(/Dang Gan/g,"党干");
htmlstr=htmlstr.replace(/Gao WenJia/g,"高稳佳");
htmlstr=htmlstr.replace(/Gui Bai/g,"归白");
htmlstr=htmlstr.replace(/Guo YeCheng/g,"郭叶城");
htmlstr=htmlstr.replace(/He FuZe/g,"何福泽");
htmlstr=htmlstr.replace(/He YongLai/g,"何永来");
htmlstr=htmlstr.replace(/Hong DeNan/g,"洪德南");
htmlstr=htmlstr.replace(/HuYan ZhiWei/g,"呼延志伟");
htmlstr=htmlstr.replace(/Huo GuoRong/g,"火锅荣");
htmlstr=htmlstr.replace(/Jia YinChen/g,"贾胤辰");
htmlstr=htmlstr.replace(/Jiang ZhiJian/g,"姜知渐");
htmlstr=htmlstr.replace(/Jing JiaJun/g,"荆嘉俊");
htmlstr=htmlstr.replace(/Lei ZiYuan/g,"雷子远");
htmlstr=htmlstr.replace(/Li TongShu/g,"李同书"); 
htmlstr=htmlstr.replace(/Li XiongWei/g,"李雄玮");
htmlstr=htmlstr.replace(/Liang Tao/g,"梁韬"); 
htmlstr=htmlstr.replace(/Lin DongHui/g,"林东荟");
htmlstr=htmlstr.replace(/Lin YiAo/g,"林一傲");
htmlstr=htmlstr.replace(/Liu ChangJie/g,"柳长杰");
htmlstr=htmlstr.replace(/Liu ChengJian/g,"柳城渐");
htmlstr=htmlstr.replace(/Liu JianLei/g,"柳渐磊");
htmlstr=htmlstr.replace(/Lu XiYa/g,"露西亚");
htmlstr=htmlstr.replace(/Lu XuanCheng/g,"卢轩城");
htmlstr=htmlstr.replace(/Luo Shuo/g,"罗烁");
htmlstr=htmlstr.replace(/Ma ShiHao/g,"马世豪");
htmlstr=htmlstr.replace(/Ma Tian/g,"马天");
htmlstr=htmlstr.replace(/Nong EnLai/g,"农恩来");
htmlstr=htmlstr.replace(/Nong ZongJi/g,"农宗基");
htmlstr=htmlstr.replace(/Ping LiangPing/g,"平梁屏");
htmlstr=htmlstr.replace(/Ren JingLiao/g,"任景聊");
htmlstr=htmlstr.replace(/Ren ZongSheng/g,"任宗盛");
htmlstr=htmlstr.replace(/Sha HanChao/g,"杀涵朝");
htmlstr=htmlstr.replace(/Shi YunTao/g,"时云韬");
htmlstr=htmlstr.replace(/SiMa XiaoLong/g,"司马小龙");
htmlstr=htmlstr.replace(/Tang YiWen/g,"唐亦文");
htmlstr=htmlstr.replace(/Tong YuanChao/g,"童远超");
htmlstr=htmlstr.replace(/Wang ChengGong/g,"旺成功");
htmlstr=htmlstr.replace(/Wang XueMing/g,"旺学明");
htmlstr=htmlstr.replace(/Wei ErWen/g,"维尔文"); 
htmlstr=htmlstr.replace(/Wu GuoHua/g,"伍国华"); 
htmlstr=htmlstr.replace(/Wu ShiKai/g,"武世凯");
htmlstr=htmlstr.replace(/Xia XuWei /g,"夏旭伟");
htmlstr=htmlstr.replace(/Xu JunLing/g,"徐俊凌");
htmlstr=htmlstr.replace(/Xue GuangQi/g,"薛光启");
htmlstr=htmlstr.replace(/Yan TengFei/g,"颜腾飞");
htmlstr=htmlstr.replace(/Ye ZiRui/g,"叶子瑞");
htmlstr=htmlstr.replace(/Yuan YanQin/g,"袁言钦"); 
htmlstr=htmlstr.replace(/Zhan DiFan/g,"战地犯");
htmlstr=htmlstr.replace(/Zhang RongAo/g,"张荣奥");
htmlstr=htmlstr.replace(/Zhao SiJie/g,"赵思杰");
htmlstr=htmlstr.replace(/Zhao ZiXin/g,"赵自信"); 
htmlstr=htmlstr.replace(/Zhou ShangYuan/g,"周尚垣");
htmlstr=htmlstr.replace(/Cai HongChen/g,"蔡鸿辰");
htmlstr=htmlstr.replace(/Hu YaoZong/g,"胡耀宗");
htmlstr=htmlstr.replace(/Pan ShuSheng/g,"潘书生");
htmlstr=htmlstr.replace(/Wu ZhiJian/g,"吴至贱");
htmlstr=htmlstr.replace(/Xu QiDi/g,"徐启迪");


//No.65
//ZID:4370152
//济南泰山
htmlstr=htmlstr.replace(/Antonio Marina/g,"安东尼奥·马里纳");
htmlstr=htmlstr.replace(/Girardo Mangiarotti/g,"吉拉多·曼乔洛蒂"); 
htmlstr=htmlstr.replace(/Gou Tu/g,"苟荼");
htmlstr=htmlstr.replace(/He NiuNiu/g,"何牛牛"); 
htmlstr=htmlstr.replace(/He ZhiAn/g,"何志安"); 
htmlstr=htmlstr.replace(/Huo HuaJun/g,"霍花俊"); 
htmlstr=htmlstr.replace(/Jing XinDe/g,"井新德"); 
htmlstr=htmlstr.replace(/Kang KunPeng/g,"康鲲鹏"); 
htmlstr=htmlstr.replace(/Leng JunPeng/g,"冷峻鹏"); 
htmlstr=htmlstr.replace(/Li AiShan/g,"李爱山"); 
htmlstr=htmlstr.replace(/Liang YanLiang/g,"梁颜亮"); 
htmlstr=htmlstr.replace(/Lin BoYun/g,"林拨云"); 
htmlstr=htmlstr.replace(/Ling WenXiong/g,"凌文兄"); 
htmlstr=htmlstr.replace(/Luo XiaoYong/g,"罗骁勇"); 
htmlstr=htmlstr.replace(/Mi GongQing/g,"糜共青"); 
htmlstr=htmlstr.replace(/Peng HenShui/g,"彭恨水"); 
htmlstr=htmlstr.replace(/Qiao DongLiang/g,"乔栋梁"); 
htmlstr=htmlstr.replace(/Qiu DaoJun/g,"裘道军"); 
htmlstr=htmlstr.replace(/Shu DengKe/g,"束登科"); 
htmlstr=htmlstr.replace(/Tang Hai/g,"唐海"); 
htmlstr=htmlstr.replace(/Wu Tongshu/g,"吴桐树"); 
htmlstr=htmlstr.replace(/Xiao GuoBin/g,"肖国彬"); 
htmlstr=htmlstr.replace(/Xie YanHuai/g,"谢言怀"); 
htmlstr=htmlstr.replace(/Yao ZiJian/g,"姚自健"); 

//No.66
//ZID:4383289
//吉林江密峰 
htmlstr=htmlstr.replace(/Daniel Carmonedo/g,"丹尼尔·卡蒙多"); 
htmlstr=htmlstr.replace(/Ding Bu/g,"丁逋"); 
htmlstr=htmlstr.replace(/Gökdeniz Topa/g,"格德尼兹·托帕"); 
htmlstr=htmlstr.replace(/Hong ShouQi/g,"洪寿启"); 
htmlstr=htmlstr.replace(/Huang MingYan/g,"黄明严"); 
htmlstr=htmlstr.replace(/Leng Fu/g,"冷甫"); 
htmlstr=htmlstr.replace(/Long ZhiJie/g,"龙治杰"); 
htmlstr=htmlstr.replace(/Lu AiHua/g,"卢爱华"); 
htmlstr=htmlstr.replace(/Menderes Kesek/g,"曼德莱斯·克赛科"); 
htmlstr=htmlstr.replace(/Qian ShengRui/g,"钱胜睿"); 
htmlstr=htmlstr.replace(/Xu LingFu/g,"许灵甫"); 
htmlstr=htmlstr.replace(/Xu YuYi/g,"徐语易"); 
htmlstr=htmlstr.replace(/Yue HuWei/g,"岳祜伟"); 
htmlstr=htmlstr.replace(/ZhangLiang Dao/g,"张梁道"); 

//No.67
//香港英华
htmlstr=htmlstr.replace(/Bowen Hau/g,"侯博文");
htmlstr=htmlstr.replace(/Cheung Tsing Muk/g,"穆昌清");
htmlstr=htmlstr.replace(/Chi Doy Sha/g,"沙支顿");
htmlstr=htmlstr.replace(/Ching Lung Wong/g,"黄正龙");
htmlstr=htmlstr.replace(/Cho Yan Cheung/g,"张祖仁");
htmlstr=htmlstr.replace(/Chun Cheung Lee/g,"李俊昌");
htmlstr=htmlstr.replace(/Chun Fai Ho/g,"何俊辉");
htmlstr=htmlstr.replace(/Him Hoi Ng/g,"吴谦凯");
htmlstr=htmlstr.replace(/Ho Kwan Yam/g,"任皓均");
htmlstr=htmlstr.replace(/Ka Fa Tung Fong/g,"方嘉华东");
htmlstr=htmlstr.replace(/Kai Chun Lam/g,"林启俊");
htmlstr=htmlstr.replace(/Kowk Leung Cheng/g,"郑国梁");
htmlstr=htmlstr.replace(/Kwok Sum Chan/g,"陈国森");
htmlstr=htmlstr.replace(/Kwun Chow Koi/g,"瞿管周");
htmlstr=htmlstr.replace(/Lai Fun Kuen/g,"权黎雚");
htmlstr=htmlstr.replace(/Li AoShuang/g,"李傲霜");
htmlstr=htmlstr.replace(/Long Pun Look/g,"陆泷盆");
htmlstr=htmlstr.replace(/Lung Tai Chow/g,"周龙大");
htmlstr=htmlstr.replace(/Mang Tip Chow/g,"周盟帖");
htmlstr=htmlstr.replace(/Min Long Ho/g,"何文郎");
htmlstr=htmlstr.replace(/Nong Fan/g,"农凡");
htmlstr=htmlstr.replace(/On Chio Kung/g,"龚安焦");
htmlstr=htmlstr.replace(/On Ki Lam/g,"林安纪");
htmlstr=htmlstr.replace(/Shai Kwun Lau/g,"刘世管");
htmlstr=htmlstr.replace(/ShangGuan MingLing/g,"上官明凌");
htmlstr=htmlstr.replace(/Siu Yin Yiu/g,"姚肇然");
htmlstr=htmlstr.replace(/Sui Kei Or/g,"柯帅纪");
htmlstr=htmlstr.replace(/Sui Lau/g,"刘帅");
htmlstr=htmlstr.replace(/Tie JingTian/g,"铁景天");
htmlstr=htmlstr.replace(/Tik Hung Ting/g,"丁狄鸿");
htmlstr=htmlstr.replace(/To Ho/g,"何都");
htmlstr=htmlstr.replace(/Tom Yip/g,"叶汤姆");
htmlstr=htmlstr.replace(/Tsz Chung Tsang/g,"曾梓聪");
htmlstr=htmlstr.replace(/Wei Kit Lam/g,"林伟杰");
htmlstr=htmlstr.replace(/Wing Cham Choi/g,"蔡荣湛");
htmlstr=htmlstr.replace(/Wing Kwong Tuen/g,"段永光");
htmlstr=htmlstr.replace(/Yin Pak Mai/g,"米贤柏");
htmlstr=htmlstr.replace(/Yoyo Bin/g,"育彬");
htmlstr=htmlstr.replace(/Yu Kwok Kit Hui/g,"许俞国杰");
htmlstr=htmlstr.replace(/Yui Tong Kung Suen/g,"孙芮唐贡");





//No.68
//青岛海员
htmlstr=htmlstr.replace(/Ren XiaoYao/g,"任逍遥");


//No.69
//六合打击乐 
htmlstr=htmlstr.replace(/Ai SiYu/g,"艾汜羽"); 
htmlstr=htmlstr.replace(/Arisztid Friedrich/g,"阿里斯蒂德·弗里德里希"); 
htmlstr=htmlstr.replace(/Azziz Bakare/g,"阿兹齐兹·巴卡雷"); 
htmlstr=htmlstr.replace(/Borrell Freixa/g,"博雷利·弗雷克萨"); 
htmlstr=htmlstr.replace(/Cai ChaoLong/g,"蔡超龙"); 
htmlstr=htmlstr.replace(/Cai JunChuan/g,"蔡钧川"); 
htmlstr=htmlstr.replace(/Cen YouSu/g,"岑友谡"); 
htmlstr=htmlstr.replace(/Chao KaiHong/g,"晁凯宏"); 
htmlstr=htmlstr.replace(/Cui HongBo/g,"崔鸿博"); 
htmlstr=htmlstr.replace(/Célio Guedes/g,"西里奥·格德斯"); 
htmlstr=htmlstr.replace(/Dai Yu/g,"戴宇"); 
htmlstr=htmlstr.replace(/David Pellón/g,"大卫·佩翁"); 
htmlstr=htmlstr.replace(/David Puerto/g,"大卫·普埃尔托"); 
htmlstr=htmlstr.replace(/Deng JunBiao/g,"邓军彪");
htmlstr=htmlstr.replace(/Donald Masker/g,"唐纳德·马斯克"); 
htmlstr=htmlstr.replace(/Edoardo Petrai/g,"爱德华多·佩特拉"); 
htmlstr=htmlstr.replace(/Fang YingQuan/g,"方英权"); 
htmlstr=htmlstr.replace(/Feng RongHuan/g,"冯嵘焕"); 
htmlstr=htmlstr.replace(/Gao Yue/g,"高越"); 
htmlstr=htmlstr.replace(/Guo YanChun/g,"郭彦春"); 
htmlstr=htmlstr.replace(/Hayat Ahsan/g,"哈亚特·阿赫桑"); 
htmlstr=htmlstr.replace(/He GuoLi/g,"贺国立"); 
htmlstr=htmlstr.replace(/Hon Hei Cho/g,"楚汉义"); 
htmlstr=htmlstr.replace(/Hong SongYan/g,"洪松岩");
htmlstr=htmlstr.replace(/Huang BingChen/g,"黄秉辰"); 
htmlstr=htmlstr.replace(/Iñaki Martín/g,"伊拿基·马丁");
htmlstr=htmlstr.replace(/Jesús Manuel Ornelas/g,"热苏斯·曼努埃尔·奥尼拉斯"); 
htmlstr=htmlstr.replace(/Ji YaoKun/g,"姬耀坤"); 
htmlstr=htmlstr.replace(/Kong HanWen/g,"孔涵文"); 
htmlstr=htmlstr.replace(/Kong PuLiang/g,"孔璞亮"); 
htmlstr=htmlstr.replace(/Lang YuanAn/g,"郎元庵"); 
htmlstr=htmlstr.replace(/Li JianTing/g,"李坚霆"); 
htmlstr=htmlstr.replace(/Liu Qi/g,"刘琦"); 
htmlstr=htmlstr.replace(/Long MingXuan/g,"龙鸣轩"); 
htmlstr=htmlstr.replace(/Lu XuHao/g,"卢胥昊"); 
htmlstr=htmlstr.replace(/Makis Babesis/g,"玛基斯·巴贝西斯"); 
htmlstr=htmlstr.replace(/Pan ChunMan/g,"潘淳慢"); 
htmlstr=htmlstr.replace(/Pan ShuaiJun/g,"潘率军"); 
htmlstr=htmlstr.replace(/Pasquale Chatelain/g,"帕斯奎尔·沙特兰"); 
htmlstr=htmlstr.replace(/Qian YeCheng/g,"钱业诚"); 
htmlstr=htmlstr.replace(/Rafał Malawski/g,"拉法乌·马拉夫斯基"); 
htmlstr=htmlstr.replace(/Shi LiQin/g,"石励勤"); 
htmlstr=htmlstr.replace(/Shi TanChao/g,"石叹超"); 
htmlstr=htmlstr.replace(/Sun RenHuan/g,"孙仁焕"); 
htmlstr=htmlstr.replace(/Tabib Ahsan/g,"塔毕布·阿赫桑"); 
htmlstr=htmlstr.replace(/Tian Ye/g,"田野"); 
htmlstr=htmlstr.replace(/Tie ZiMeng/g,"铁子猛"); 
htmlstr=htmlstr.replace(/Umar Al Issaoui/g,"欧麦尔·阿勒伊萨乌伊");
htmlstr=htmlstr.replace(/Wan DuXu/g,"宛度诩"); 
htmlstr=htmlstr.replace(/Wang LinTao/g,"王麟韬"); 
htmlstr=htmlstr.replace(/Xiao GuanQi/g,"肖冠麒"); 
htmlstr=htmlstr.replace(/Xuan Nan/g,"宣南"); 
htmlstr=htmlstr.replace(/Xue Bin/g,"薛斌"); 
htmlstr=htmlstr.replace(/Yan ChangBiao/g,"杨昌杓"); 
htmlstr=htmlstr.replace(/Yang WeiZhuang/g,"杨维庄"); 
htmlstr=htmlstr.replace(/Zero Alshomrani/g,"泽罗·阿尔沙姆拉尼"); 
htmlstr=htmlstr.replace(/Zhao JiuZhou/g,"赵九洲"); 
htmlstr=htmlstr.replace(/Zhong RuoFei/g,"钟若飞"); 
htmlstr=htmlstr.replace(/Zhong YueYu/g,"钟跃宇"); 
htmlstr=htmlstr.replace(/Zhou Fei/g,"周飞");
htmlstr=htmlstr.replace(/Zhu HaiPeng/g,"朱海鹏"); 

//No.70
//SC.酒城2019
htmlstr=htmlstr.replace(/Liu XiaoTian/g,"柳笑天");
htmlstr=htmlstr.replace(/Weng ChengZi/g,"翁呈梓");
htmlstr=htmlstr.replace(/Xie ZeQi/g,"谢泽琪");
htmlstr=htmlstr.replace(/Gong LinHu/g,"巩林虎"); 
htmlstr=htmlstr.replace(/Cui LiGuang/g,"崔厉光"); 
htmlstr=htmlstr.replace(/Hou XiaoYu/g,"候小鱼"); 

//No.71
//WuHan.FC
htmlstr=htmlstr.replace(/Lei TianZi/g,"雷天子"); 
htmlstr=htmlstr.replace(/Liu EnLai/g,"刘恩来");

//No.72
//迷弟的小尤文
htmlstr=htmlstr.replace(/Chen Huo/g,"陈霍");
htmlstr=htmlstr.replace(/Cui TongShu/g,"崔彤舒");
htmlstr=htmlstr.replace(/Fabien_Bassett/g,"法比安·巴塞特");
htmlstr=htmlstr.replace(/Giga Katsitadze/g,"吉加·卡奇塔泽");
htmlstr=htmlstr.replace(/Jairo Alberto Vanegas/g," 杰罗·阿尔贝托·瓦内加斯");
htmlstr=htmlstr.replace(/Jiang DiZhou/g,"蒋帝舟");
htmlstr=htmlstr.replace(/Jiao RuiHao/g,"焦瑞豪");
htmlstr=htmlstr.replace(/Ke ShunCheng/g,"柯舜程");
htmlstr=htmlstr.replace(/Michalis Thrileontas/g,"米查利斯·特里隆塔斯");
htmlstr=htmlstr.replace(/Mu ChenJun/g,"沐辰俊");
htmlstr=htmlstr.replace(/Quon De Almeida/g,"昆·德·阿尔梅达");
htmlstr=htmlstr.replace(/Ramaz Natriashvil/g,"拉马兹·纳特里阿什维尔");
htmlstr=htmlstr.replace(/Sang ChaoChe/g,"桑超澈");
htmlstr=htmlstr.replace(/Shi JinYuan/g,"施锦渊");
htmlstr=htmlstr.replace(/Tao ShuaiQi/g,"陶帅奇");
htmlstr=htmlstr.replace(/Wang ZuGuang/g,"王祖光");
htmlstr=htmlstr.replace(/Yang HongHai/g,"杨鸿海");
htmlstr=htmlstr.replace(/You PeiYuan/g,"游裴袁");
htmlstr=htmlstr.replace(/Yuan XiLian/g,"袁熙廉");
htmlstr=htmlstr.replace(/Zakhar Oliynyk/g,"扎哈尔·奥利尼克");


//No.73
//深圳飞鹏
htmlstr=htmlstr.replace(/Emilis Winn/g,"艾米利斯·温恩"); 
htmlstr=htmlstr.replace(/Fritz Taafe/g,"弗里茨·塔菲");
htmlstr=htmlstr.replace(/Jared Chávez/g,"贾里德·查韦斯"); 
htmlstr=htmlstr.replace(/Jian XuFu/g,"建徐福"); 
htmlstr=htmlstr.replace(/Li XiuQuan/g,"李秀全"); 
htmlstr=htmlstr.replace(/Ma JiQin/g,"马吉琴"); 
htmlstr=htmlstr.replace(/Zheng LiJun/g,"郑丽君"); 

//No.74
//旅行者
htmlstr=htmlstr.replace(/Cheng XuanYi/g,"程宣翼");
htmlstr=htmlstr.replace(/Cheng YiDe/g,"成易德");
htmlstr=htmlstr.replace(/Gao HaiDong/g,"高海东");
htmlstr=htmlstr.replace(/Rong Yang/g,"容杨");
htmlstr=htmlstr.replace(/Tao LingPu/g,"陶令普"); 
htmlstr=htmlstr.replace(/Xue Rui/g,"薛瑞");
htmlstr=htmlstr.replace(/Zhao MaoSheng/g,"赵昴升"); 
htmlstr=htmlstr.replace(/Zheng HanTian/g,"郑含天"); 
htmlstr=htmlstr.replace(/Zheng YongBo/g,"郑永波"); 

//No.75
//弑影天下 
htmlstr=htmlstr.replace(/André Müller/g,"安德烈·穆勒"); 
htmlstr=htmlstr.replace(/Bai KeZhi/g,"百克之"); 
htmlstr=htmlstr.replace(/Cai TaoYu/g,"蔡涛宇"); 
htmlstr=htmlstr.replace(/Christophe Houdt/g,"克里斯·多夫豪德");
htmlstr=htmlstr.replace(/Ding CaiMao/g,"丁才貌"); 
htmlstr=htmlstr.replace(/Gu ZhanYin/g,"古展尹"); 
htmlstr=htmlstr.replace(/Guan ChuGe/g,"关楚阁"); 
htmlstr=htmlstr.replace(/Guo XiaoGuang/g,"郭晓光"); 
htmlstr=htmlstr.replace(/Hou JingYang/g,"侯敬杨"); 
htmlstr=htmlstr.replace(/HuYan XiuMiao/g,"呼延秀苗"); 
htmlstr=htmlstr.replace(/Ioan Morosanu/g,"莫罗·萨努"); 
htmlstr=htmlstr.replace(/Ji ZhuZi/g,"姬诛姿");
htmlstr=htmlstr.replace(/Lai YanJun/g,"赖彦均"); 
htmlstr=htmlstr.replace(/Lei ZhanYing/g,"雷展映"); 
htmlstr=htmlstr.replace(/Li YanHan/g,"李炎翰"); 
htmlstr=htmlstr.replace(/Li YinJie/g,"李寅杰"); 
htmlstr=htmlstr.replace(/Liu YunFeng/g,"陆云丰"); 
htmlstr=htmlstr.replace(/Lv XiLian/g,"吕席镰"); 
htmlstr=htmlstr.replace(/Ma YuPeng/g,"马羽鹏"); 
htmlstr=htmlstr.replace(/Man ChunJi/g,"满淳济"); 
htmlstr=htmlstr.replace(/Marvin Wuillemin/g,"马文·维尔曼"); 
htmlstr=htmlstr.replace(/Menashe Cohen/g,"梅纳什·科恩"); 
htmlstr=htmlstr.replace(/Salem Ferrand/g,"塞勒姆·费朗"); 
htmlstr=htmlstr.replace(/SiMa ZhuCheng/g,"司马诸城"); 
htmlstr=htmlstr.replace(/Song LiQiang/g,"宋黎强"); 
htmlstr=htmlstr.replace(/Sun YaoWu/g,"孙姚武"); 
htmlstr=htmlstr.replace(/Tie ChunMan/g,"铁春满"); 
htmlstr=htmlstr.replace(/Wu MinYan/g,"吴名言"); 
htmlstr=htmlstr.replace(/Yao ShunFeng/g,"姚舜烽"); 
htmlstr=htmlstr.replace(/Yu LiDong/g,"于离冬"); 
htmlstr=htmlstr.replace(/Zhao SiJie/g,"赵司捷"); 
htmlstr=htmlstr.replace(/Zhao XueLin/g,"赵学麟"); 
htmlstr=htmlstr.replace(/Zu WeiJia/g,"祖卫骆"); 


//4153649
//No.76
//泉州全城
htmlstr=htmlstr.replace(/Ismo Aho/g,"伊斯莫·阿霍"); 
htmlstr=htmlstr.replace(/He JingYu/g,"何靖宇"); 
htmlstr=htmlstr.replace(/Ding XiaoHao/g,"丁小浩"); 
htmlstr=htmlstr.replace(/Ye YiXun/g,"叶一勋"); 
htmlstr=htmlstr.replace(/Sang YaoHua/g,"桑尧华"); 
htmlstr=htmlstr.replace(/Huang YueYu/g,"黄月宇"); 
htmlstr=htmlstr.replace(/Bao XiaoJun/g,"包小军 "); 
htmlstr=htmlstr.replace(/Xuan JunNan/g,"宣俊楠"); 
htmlstr=htmlstr.replace(/Yang ShaoYi/g,"杨少毅"); 
htmlstr=htmlstr.replace(/You WeiGuo/g,"尤卫国"); 
htmlstr=htmlstr.replace(/You LinHu/g,"尤林虎"); 
htmlstr=htmlstr.replace(/Lv YongTao/g,"吕永涛"); 
htmlstr=htmlstr.replace(/Song NiMa/g,"宋逆麻"); 
htmlstr=htmlstr.replace(/Qiao XiaoRui/g,"乔晓瑞"); 
htmlstr=htmlstr.replace(/Su RuiLong/g,"苏瑞龙"); 
htmlstr=htmlstr.replace(/Li ZhiPing/g,"李志平");

//No.77
//天佑圣西罗
htmlstr=htmlstr.replace(/Bai TieLin/g,"白铁林");
htmlstr=htmlstr.replace(/Cheng XieLin/g,"程燮麟");
htmlstr=htmlstr.replace(/Diao BoYun/g,"刁博云");
htmlstr=htmlstr.replace(/Ding XiaoYao/g,"丁逍遥");
htmlstr=htmlstr.replace(/Gan ChunQuan/g,"甘春泉");
htmlstr=htmlstr.replace(/GongSun Shu/g,"公孙述");
htmlstr=htmlstr.replace(/Gou YangNan/g,"苟阳楠");
htmlstr=htmlstr.replace(/He YongHuai/g,"何咏怀");
htmlstr=htmlstr.replace(/Huang XiaoDong/g,"黄晓东");
htmlstr=htmlstr.replace(/Huo GuangMing/g,"霍光明");
htmlstr=htmlstr.replace(/Jiang Cao/g,"姜草");
htmlstr=htmlstr.replace(/Lan ZeXi/g,"兰泽西");
htmlstr=htmlstr.replace(/Lei KaiMing/g,"雷凯铭");
htmlstr=htmlstr.replace(/Li JiaQian/g,"李嘉乾");
htmlstr=htmlstr.replace(/Mi Cen/g,"米岑");
htmlstr=htmlstr.replace(/Ou RongHeng/g,"区容珩");
htmlstr=htmlstr.replace(/Qin QianShi/g,"秦千石");
htmlstr=htmlstr.replace(/Shang ZeYong/g,"尚泽勇");
htmlstr=htmlstr.replace(/Shen ZhiHuan/g,"沈志欢");
htmlstr=htmlstr.replace(/Shu DanYang/g,"舒丹阳");
htmlstr=htmlstr.replace(/Tao YunXiang/g,"陶云翔");
htmlstr=htmlstr.replace(/Tian ChangHao/g,"田长浩");
htmlstr=htmlstr.replace(/Tian SiCheng/g,"田思成");
htmlstr=htmlstr.replace(/Wan MingYue/g,"万铭岳");
htmlstr=htmlstr.replace(/Wang XiaoPing/g,"王小平");
htmlstr=htmlstr.replace(/Wu ShengQiao/g,"吴胜桥");
htmlstr=htmlstr.replace(/Xiang YangChao/g,"向阳超");
htmlstr=htmlstr.replace(/Xu XianPing/g,"徐宪平");
htmlstr=htmlstr.replace(/You EnHua/g,"尤恩华");
htmlstr=htmlstr.replace(/Zeng GuoSheng/g,"曾国盛");
htmlstr=htmlstr.replace(/Zhang FangXu/g,"张方旭");
htmlstr=htmlstr.replace(/Zhao ShunXin/g,"赵顺新");
htmlstr=htmlstr.replace(/Zhu Han/g,"朱涵");


//No.78
//新疆海星
htmlstr=htmlstr.replace(/Bai TengFei/g,"白腾飞");
htmlstr=htmlstr.replace(/Bi MAZiJun/g,"毕马子君");
htmlstr=htmlstr.replace(/Cao QunLi/g,"曹群立");
htmlstr=htmlstr.replace(/Di ZhangRen/g,"狄长仁");
htmlstr=htmlstr.replace(/Fu WenZhai/g,"傅文宰");
htmlstr=htmlstr.replace(/He YouCai/g,"何有财");
htmlstr=htmlstr.replace(/Hong WeiJian/g,"洪伟坚");
htmlstr=htmlstr.replace(/Ke XueShi/g,"柯学识");
htmlstr=htmlstr.replace(/Lin Jin/g,"林晋");
htmlstr=htmlstr.replace(/Lin LiFu/g,"林立夫");
htmlstr=htmlstr.replace(/Mu ShaoQuan/g,"穆少全");
htmlstr=htmlstr.replace(/Song HaiJian/g,"宋海剑");
htmlstr=htmlstr.replace(/Tao GuiBin/g,"陶贵斌");
htmlstr=htmlstr.replace(/Tu HaiYuan/g,"屠海源");
htmlstr=htmlstr.replace(/Wang XiYan/g,"王析岩");
htmlstr=htmlstr.replace(/Yu YuanJi/g,"于元吉");
htmlstr=htmlstr.replace(/Zheng ZeXuan/g,"郑泽轩");
htmlstr=htmlstr.replace(/Zhu XiaoHu/g,"朱小虎");
htmlstr=htmlstr.replace(/Zhuang TianHao/g,"庄天浩");

//No.79
//福建茗桐
htmlstr=htmlstr.replace(/Ao ZiRan/g,"敖自然");
htmlstr=htmlstr.replace(/Deng MianXin/g,"邓绵信");
htmlstr=htmlstr.replace(/Gao KaiMing/g,"高凯鸣");
htmlstr=htmlstr.replace(/Gong YanBo/g,"龚彦博");
htmlstr=htmlstr.replace(/Guo YaJian/g,"郭亚坚");
htmlstr=htmlstr.replace(/Li JinPeng/g,"李锦鹏");
htmlstr=htmlstr.replace(/Lou LongShuai/g,"楼陇帅");
htmlstr=htmlstr.replace(/Ning Ce/g,"宁策");
htmlstr=htmlstr.replace(/Wang JingDong/g,"王京东");
htmlstr=htmlstr.replace(/Wu HongFei/g,"吴弘飞");
htmlstr=htmlstr.replace(/Xi KaiZhong/g,"习楷中");
htmlstr=htmlstr.replace(/Yang QiTeng/g,"杨启腾");
htmlstr=htmlstr.replace(/Yu YaLong/g,"于雅隆");
htmlstr=htmlstr.replace(/Yu YouPeng/g,"于佑鹏");

//No.80
//皇家南河体育中心
htmlstr=htmlstr.replace(/Bian LiXin/g,"卞立新");
htmlstr=htmlstr.replace(/DuGu SongHai/g,"独孤松海");
htmlstr=htmlstr.replace(/Guan YouLin/g,"关佑霖");
htmlstr=htmlstr.replace(/Hu HanYu/g,"胡翰宇");
htmlstr=htmlstr.replace(/Huang DingFa/g,"黄丁发");
htmlstr=htmlstr.replace(/Lin PengYi/g,"林鹏翼");
htmlstr=htmlstr.replace(/Lu YeCheng/g,"路叶尘");
htmlstr=htmlstr.replace(/Qian HuiChen/g,"乾慧晨");
htmlstr=htmlstr.replace(/She YuHao/g,"佘雨豪");
htmlstr=htmlstr.replace(/Sun HongBo/g,"孙洪波");
htmlstr=htmlstr.replace(/Tan RongJi/g,"谭镕基");
htmlstr=htmlstr.replace(/Tong YiXuan/g,"童宜轩");
htmlstr=htmlstr.replace(/Wu ZeMin/g,"武泽民");
htmlstr=htmlstr.replace(/XianYu ChengDong/g,"鲜于晟栋");
htmlstr=htmlstr.replace(/Zhao LongTeng/g,"赵龙腾");

//3631756
//No.81
//上海上港FC
htmlstr=htmlstr.replace(/Fu XianXiu/g,"付先秀"); 
htmlstr=htmlstr.replace(/He ZhengYang/g,"何正阳"); 
htmlstr=htmlstr.replace(/Jian ChuiChui/g,"简锤锤"); 
htmlstr=htmlstr.replace(/Jian NanHai/g,"简南海"); 
htmlstr=htmlstr.replace(/Jing ShengLong/g,"景胜龙"); 
htmlstr=htmlstr.replace(/Lin JianWei/g,"林建伟"); 
htmlstr=htmlstr.replace(/Ling GuoYu/g,"凌国玉"); 
htmlstr=htmlstr.replace(/Liu ZhiZhi/g,"刘志智"); 
htmlstr=htmlstr.replace(/Meng KuanJi/g,"孟宽吉");
htmlstr=htmlstr.replace(/Mu YuYu/g,"穆玉玉"); 
htmlstr=htmlstr.replace(/Niu Yun/g,"牛云"); 
htmlstr=htmlstr.replace(/Peng ChenHao/g,"彭成浩"); 
htmlstr=htmlstr.replace(/Qiu QiZheng/g,"邱启正"); 
htmlstr=htmlstr.replace(/Rao RuiMing/g,"饶瑞明"); 
htmlstr=htmlstr.replace(/Shi CuiWei/g,"石翠伟"); 
htmlstr=htmlstr.replace(/Shu WenYong/g,"舒文勇"); 
htmlstr=htmlstr.replace(/Tai QingLin/g,"邰庆林"); 
htmlstr=htmlstr.replace(/Wang RaoDong/g,"王饶东"); 
htmlstr=htmlstr.replace(/Yang HuaShao/g,"杨华韶"); 
htmlstr=htmlstr.replace(/Zhuang YongAn/g,"庄永安"); 

//4413770
//No.82
//Team Yell 呐喊队 
htmlstr=htmlstr.replace(/Chen YongZhe/g,"陈勇者"); 
htmlstr=htmlstr.replace(/Fei SenHao/g,"费森毫"); 
htmlstr=htmlstr.replace(/Gao WeiFeng/g,"高微风");
htmlstr=htmlstr.replace(/Gao XiaoHui/g,"郜小辉"); 
htmlstr=htmlstr.replace(/Gu XueQian/g,"古学谦"); 
htmlstr=htmlstr.replace(/Han XiaoXin/g,"韩霄新"); 
htmlstr=htmlstr.replace(/Li TingSheng/g,"李庭圣"); 
htmlstr=htmlstr.replace(/Lin ZhiGang/g,"林志刚"); 
htmlstr=htmlstr.replace(/Liu DaZhu/g,"刘大猪"); 
htmlstr=htmlstr.replace(/Liu XinKai/g,"柳心开"); 
htmlstr=htmlstr.replace(/Long BingJie/g,"龙冰结"); 
htmlstr=htmlstr.replace(/Long HenShui/g,"龙恨水"); 
htmlstr=htmlstr.replace(/Lu LeLe/g,"路乐乐"); 
htmlstr=htmlstr.replace(/Mao QiLong/g,"毛骑龙"); 
htmlstr=htmlstr.replace(/Ou JiaXuan/g,"欧稼轩"); 
htmlstr=htmlstr.replace(/Qi XuHeYue/g,"齐绪鹤月"); 
htmlstr=htmlstr.replace(/Qiang RuiLun/g,"强锐伦"); 
htmlstr=htmlstr.replace(/Shen ZhiQiang/g,"申至强"); 
htmlstr=htmlstr.replace(/Shi KeZhen/g,"石克朕"); 
htmlstr=htmlstr.replace(/Tang ZhiXiong/g,"唐之雄"); 
htmlstr=htmlstr.replace(/Xin Bin/g,"辛斌"); 
htmlstr=htmlstr.replace(/Xu DeXin/g,"徐德馨"); 
htmlstr=htmlstr.replace(/Ye WeiGang/g,"叶为纲"); 
htmlstr=htmlstr.replace(/Ying PeiFu/g,"赢佩甫"); 
htmlstr=htmlstr.replace(/Zhangsun ZhongGuo/g,"长孙重国"); 
htmlstr=htmlstr.replace(/Zhao LiBin/g,"赵礼彬"); 
htmlstr=htmlstr.replace(/Zhao LongJi/g,"赵隆机"); 

//No.83
//长沙二一
htmlstr=htmlstr.replace(/Cao GeZhuo/g,"曹葛卓");
htmlstr=htmlstr.replace(/Chen ZhongYao/g,"陈中尧");
htmlstr=htmlstr.replace(/Cui MuZong/g,"崔穆宗");
htmlstr=htmlstr.replace(/Du Di/g,"杜狄");
htmlstr=htmlstr.replace(/Fan BaoHong/g,"范保宏");
htmlstr=htmlstr.replace(/Han QingLiang/g,"韩庆亮");
htmlstr=htmlstr.replace(/Huang Lijie/g,"黄立杰");
htmlstr=htmlstr.replace(/Jin JiaFeng/g,"金嘉丰");
htmlstr=htmlstr.replace(/Kang TaiZhen/g,"康泰真");
htmlstr=htmlstr.replace(/Le JingGe/g,"乐京格");
htmlstr=htmlstr.replace(/Li PeiGen/g,"李培根");
htmlstr=htmlstr.replace(/Liao GengYang/g,"廖耿阳");
htmlstr=htmlstr.replace(/Nong XiaoKai/g,"农小凯");
htmlstr=htmlstr.replace(/Pan JiaHao/g,"潘家豪");
htmlstr=htmlstr.replace(/She HaiMing/g,"佘海鸣");
htmlstr=htmlstr.replace(/Tang FeiFan/g,"唐非凡");
htmlstr=htmlstr.replace(/Tie RuoFei/g,"铁若飞");
htmlstr=htmlstr.replace(/Tong DeGang/g,"童德刚");
htmlstr=htmlstr.replace(/Xi ChengYan/g,"奚成彦");
htmlstr=htmlstr.replace(/Xu JiYong/g,"许吉勇");
htmlstr=htmlstr.replace(/Xu WeiJian/g,"许伟坚");
htmlstr=htmlstr.replace(/Yang ZhenQiang/g,"杨振强");
htmlstr=htmlstr.replace(/Zhou HaiGuang/g,"周海光");
htmlstr=htmlstr.replace(/Zhou ShiRong/g,"周士荣");
htmlstr=htmlstr.replace(/Zhou YuXi/g,"周禹溪");
htmlstr=htmlstr.replace(/Zhuang ShangKun/g,"庄尚坤");

//No.84
//江西南昌八一
htmlstr=htmlstr.replace(/Cao_HeXuan/g,"曹和旋"); 
htmlstr=htmlstr.replace(/Chen_LuoJia/g,"陈珞珈"); 
htmlstr=htmlstr.replace(/Cui_JiQing/g,"崔吉庆"); 
htmlstr=htmlstr.replace(/Fang_ChaoFan/g,"方超凡"); 
htmlstr=htmlstr.replace(/Fang_XingLiang/g,"方兴亮"); 
htmlstr=htmlstr.replace(/Fei_JiaYou/g,"费家友"); 
htmlstr=htmlstr.replace(/Fei_WenYi/g,"费文艺"); 
htmlstr=htmlstr.replace(/Gu_ZhengDao/g,"顾正道"); 
htmlstr=htmlstr.replace(/Hao_YiFu/g,"郝逸夫"); 
htmlstr=htmlstr.replace(/Huo_JianKai/g,"霍建凯"); 
htmlstr=htmlstr.replace(/Ji_ShangKun/g,"纪尚昆"); 
htmlstr=htmlstr.replace(/Li_ChengZhong/g,"李成忠"); 
htmlstr=htmlstr.replace(/Li_Yunlu/g,"李云鹿"); 
htmlstr=htmlstr.replace(/Liang_SiCheng/g,"梁思成"); 
htmlstr=htmlstr.replace(/Lu_FuKuan/g,"陆福宽"); 
htmlstr=htmlstr.replace(/Lu_HaiYu/g,"陆海云");
htmlstr=htmlstr.replace(/Lu_ZhuCheng/g,"卢竹成"); 
htmlstr=htmlstr.replace(/Luo_HongYe/g,"罗宏业"); 
htmlstr=htmlstr.replace(/Luo_ShiLei/g,"罗石磊"); 
htmlstr=htmlstr.replace(/Meng_YuJian/g,"孟玉建"); 
htmlstr=htmlstr.replace(/Mu_KaiHong/g,"木开宏"); 
htmlstr=htmlstr.replace(/Na_TianTa/g,"纳天塔"); 
htmlstr=htmlstr.replace(/Qi_XueJie/g,"齐雪杰"); 
htmlstr=htmlstr.replace(/Shan_HanTian/g,"单汉天"); 
htmlstr=htmlstr.replace(/Sheng_YiZe/g,"盛一泽"); 
htmlstr=htmlstr.replace(/Shu_ZhaoQian/g,"舒兆钱"); 
htmlstr=htmlstr.replace(/Su_ZiLiang/g,"苏子良"); 
htmlstr=htmlstr.replace(/Tang_DaHeng/g,"唐大亨"); 
htmlstr=htmlstr.replace(/Wang_Xing/g,"王星"); 
htmlstr=htmlstr.replace(/Xin_YiLin/g,"辛立琳"); 
htmlstr=htmlstr.replace(/Xiong_HuaTian/g,"熊华天"); 
htmlstr=htmlstr.replace(/Yin_JinChao/g,"尹劲超"); 
htmlstr=htmlstr.replace(/Yu_MingWen/g,"于明文"); 
htmlstr=htmlstr.replace(/Yu_MingWen/g,"于明文"); 
htmlstr=htmlstr.replace(/Yuan_JinShan/g,"元金山"); 
htmlstr=htmlstr.replace(/ZhangLiang_DongPing/g,"张良东平"); 
htmlstr=htmlstr.replace(/Zhang_SanFeng/g,"张三丰"); 
htmlstr=htmlstr.replace(/Zhang_ZeWen/g,"张泽文"); 
htmlstr=htmlstr.replace(/Zhao_HongYang/g,"赵洪洋"); 
htmlstr=htmlstr.replace(/Zhao_JunRu/g,"赵俊儒"); 
htmlstr=htmlstr.replace(/Zheng_Zun/g,"郑遵"); 
htmlstr=htmlstr.replace(/Zong_HongJie/g,"钟宏杰"); 
htmlstr=htmlstr.replace(/Zou_BaiLiang/g,"邹白亮"); 
htmlstr=htmlstr.replace(/Zou_YunPeng/g,"邹云鹏"); 

//Huracán S.H
//No.85
htmlstr=htmlstr.replace(/Cao ZhenLong/g,"曹振龙"); 
htmlstr=htmlstr.replace(/Deng XinYuan/g,"邓欣远"); 
htmlstr=htmlstr.replace(/Fang GuanJun/g,"方冠君"); 
htmlstr=htmlstr.replace(/Fang TaiZhen/g,"方泰镇");
htmlstr=htmlstr.replace(/Hong LiGuang/g,"洪李广"); 
htmlstr=htmlstr.replace(/Jiang JiaJun/g,"蒋嘉军"); 
htmlstr=htmlstr.replace(/Li YanChun/g,"李延川"); 
htmlstr=htmlstr.replace(/Liang Ming/g,"梁鸣"); 
htmlstr=htmlstr.replace(/Lin ShiLing/g,"林世灵"); 
htmlstr=htmlstr.replace(/Lu XiangXian/g,"卢相贤"); 
htmlstr=htmlstr.replace(/Pan ZhaoHui/g,"潘朝辉"); 
htmlstr=htmlstr.replace(/Pang LiHong/g,"庞力鸿"); 
htmlstr=htmlstr.replace(/Pang YaLong/g,"庞亚龙"); 
htmlstr=htmlstr.replace(/Ping YongPo/g,"平永珀"); 
htmlstr=htmlstr.replace(/Shen ZhiYing/g,"沈止迎"); 
htmlstr=htmlstr.replace(/Shi MuZong/g,"施穆宗"); 
htmlstr=htmlstr.replace(/Shu WenWen/g,"舒雯雯"); 
htmlstr=htmlstr.replace(/Su JianKai/g,"苏建凯"); 
htmlstr=htmlstr.replace(/Wei XiZhi/g,"魏习之"); 
htmlstr=htmlstr.replace(/Wu HuanHuan/g,"吴欢欢"); 
htmlstr=htmlstr.replace(/Xue JiaJun/g,"薛佳俊"); 
htmlstr=htmlstr.replace(/Yan ZiDan/g,"严子丹"); 
htmlstr=htmlstr.replace(/Zhu ShiYun/g,"祝石云"); 

//No.86
//蟹堡王足球俱乐部 
htmlstr=htmlstr.replace(/Chao Xun/g,"晁巽"); 
htmlstr=htmlstr.replace(/DongFang ZiMeng/g,"东方紫梦"); 
htmlstr=htmlstr.replace(/Hong ZhouHong/g,"洪洲泓"); 
htmlstr=htmlstr.replace(/Lu WenYuan/g,"卢文远"); 
htmlstr=htmlstr.replace(/Luan YongLai/g,"栾咏莱"); 
htmlstr=htmlstr.replace(/Mou GaoYang/g,"牟高阳"); 
htmlstr=htmlstr.replace(/Ran BuQing/g,"冉簿清"); 
htmlstr=htmlstr.replace(/Sun ZhuoFan/g,"孙灼帆"); 
htmlstr=htmlstr.replace(/Tang Chi/g,"唐赤"); 
htmlstr=htmlstr.replace(/Xiang LingHuan/g,"项绫幻"); 
htmlstr=htmlstr.replace(/Yang YunTao/g,"杨韵涛"); 
htmlstr=htmlstr.replace(/Zhai CongRui/g,"翟聪叡"); 
htmlstr=htmlstr.replace(/ZhangLiang KaiGe/g,"张梁凯歌"); 
htmlstr=htmlstr.replace(/Zhu Da/g,"朱达"); 

//No.87
//武汉红金龙
htmlstr=htmlstr.replace(/Chen ChengGong/g,"陈成功"); 
htmlstr=htmlstr.replace(/Chu NuoYan/g,"楚诺延"); 
htmlstr=htmlstr.replace(/Deng JunBiao/g,"邓军彪"); 
htmlstr=htmlstr.replace(/Ding NingYuan/g,"丁宁远"); 
htmlstr=htmlstr.replace(/Dong ZeMin/g,"董泽闵"); 
htmlstr=htmlstr.replace(/Guo PengJie/g,"郭鹏杰"); 
htmlstr=htmlstr.replace(/Huo KangWen/g,"霍康文"); 
htmlstr=htmlstr.replace(/Kang XiuQing/g,"康修庆"); 
htmlstr=htmlstr.replace(/Li BoXuan/g,"李博轩"); 
htmlstr=htmlstr.replace(/Li Ren/g,"李仁"); 
htmlstr=htmlstr.replace(/Liang Shuang/g,"梁爽"); 
htmlstr=htmlstr.replace(/Lin YanHuai/g,"林闫怀"); 
htmlstr=htmlstr.replace(/Qiu JinSheng/g,"邱锦盛"); 
htmlstr=htmlstr.replace(/Sun Yong/g,"孙勇"); 
htmlstr=htmlstr.replace(/Tao YuBin/g,"陶育斌"); 
htmlstr=htmlstr.replace(/Xi XiRui/g,"习希瑞"); 
htmlstr=htmlstr.replace(/Xie XiaoXiang/g,"谢晓相"); 
htmlstr=htmlstr.replace(/Ye YuRong/g,"叶玉荣"); 
htmlstr=htmlstr.replace(/Yi ShiLi/g,"伊石理"); 
htmlstr=htmlstr.replace(/Yuan YiMin/g,"袁毅民"); 
htmlstr=htmlstr.replace(/Zhan ChuangYi/g,"詹创一"); 
htmlstr=htmlstr.replace(/Zhao DaWei/g,"赵大卫"); 

//No.88
//西部狂风
htmlstr=htmlstr.replace(/Du Tie/g,"杜铁"); 
htmlstr=htmlstr.replace(/Etzion Dunay/g,"以旬·杜内"); 
htmlstr=htmlstr.replace(/He ZeQiang/g,"贺择强"); 
htmlstr=htmlstr.replace(/Henrich Kolník/g,"亨里希·科尼克"); 
htmlstr=htmlstr.replace(/Ke ZuXian/g,"柯祖贤");
htmlstr=htmlstr.replace(/Lu Shi/g,"陆矢"); 

//No.89
//蹴鞠星期六
htmlstr=htmlstr.replace(/Ai JunQi/g,"艾军旗");
htmlstr=htmlstr.replace(/Ani Prenga/g,"阿尼·普伦加");
htmlstr=htmlstr.replace(/Cai YanTao/g,"蔡颜涛");
htmlstr=htmlstr.replace(/David Kantor/g,"戴维·坎特罗");
htmlstr=htmlstr.replace(/Ding HongZhi/g,"丁洪智");
htmlstr=htmlstr.replace(/Filip Chylewski/g,"菲利普·切列夫斯基");
htmlstr=htmlstr.replace(/Götz Salomon/g,"格策·塞拉蒙");
htmlstr=htmlstr.replace(/Jiang Ang/g,"姜昂");
htmlstr=htmlstr.replace(/Lin ChangQi/g,"林长琦");
htmlstr=htmlstr.replace(/Lin ZhiJian/g,"林志坚");
htmlstr=htmlstr.replace(/Luo HongSheng/g,"罗洪升");
htmlstr=htmlstr.replace(/Mo FuFu/g,"莫弗甫");
htmlstr=htmlstr.replace(/Pan HuiFeng/g,"潘汇丰");
htmlstr=htmlstr.replace(/Pi JiuTao/g,"皮九淘");
htmlstr=htmlstr.replace(/Shang YaoTong/g,"尚耀桐");
htmlstr=htmlstr.replace(/Shi DaiYu/g,"石岱羽");
htmlstr=htmlstr.replace(/Shi HaoJie/g,"石浩杰");
htmlstr=htmlstr.replace(/Sun ZhengTu/g,"孙征途");
htmlstr=htmlstr.replace(/Tian YanFei/g,"田雁飞");
htmlstr=htmlstr.replace(/Xu JunNing/g,"徐俊宁");
htmlstr=htmlstr.replace(/Yan ChengGong/g,"严成功");
htmlstr=htmlstr.replace(/Yang GuanQi/g,"杨冠麒");
htmlstr=htmlstr.replace(/Zhao JunBiao/g,"赵俊杓");
htmlstr=htmlstr.replace(/Zhuang ZuMing/g,"庄祖名");

//FC_B*LD
//No.90
htmlstr=htmlstr.replace(/Adrian Szabłowski/g,"阿德里安 恰布罗夫斯基");
htmlstr=htmlstr.replace(/Ai AnRong/g,"艾安容");
htmlstr=htmlstr.replace(/Ai LeiLei/g,"艾磊磊");
htmlstr=htmlstr.replace(/Bao HongYan/g,"包鸿雁");
htmlstr=htmlstr.replace(/Chen Chou/g,"陈丑");
htmlstr=htmlstr.replace(/Chen HuYi/g,"陈虎翼");
htmlstr=htmlstr.replace(/Chen JiangHua/g,"陈江华");
htmlstr=htmlstr.replace(/Chu ZhengDong/g,"楚正东");
htmlstr=htmlstr.replace(/Cui KeXing/g,"崔可星");
htmlstr=htmlstr.replace(/Deng ZhiGang/g,"邓志刚");
htmlstr=htmlstr.replace(/Ercole Levorato/g,"厄科尔 莱沃拉托");
htmlstr=htmlstr.replace(/Félix Salido/g,"菲利克斯 萨利多");
htmlstr=htmlstr.replace(/Han HongYe/g,"韩宏烨");
htmlstr=htmlstr.replace(/Huang XiaoWei/g,"黄小薇");
htmlstr=htmlstr.replace(/Iraklis Ferentinos/g,"伊拉克里斯 费伦迪诺斯");
htmlstr=htmlstr.replace(/Jakub Štefek/g,"雅库布 斯蒂菲克");
htmlstr=htmlstr.replace(/Lai ShiQiang/g,"赖石墙");
htmlstr=htmlstr.replace(/Lei ZhiYu/g,"雷志宇");
htmlstr=htmlstr.replace(/Leng Ke/g,"冷可");
htmlstr=htmlstr.replace(/Li QiXin/g,"李启信");
htmlstr=htmlstr.replace(/Liang LianCheng/g,"梁连城");
htmlstr=htmlstr.replace(/Liao ZeBin/g,"廖泽斌");
htmlstr=htmlstr.replace(/Lin JianBai/g,"林建白");
htmlstr=htmlstr.replace(/Liu ZiTeng/g,"刘子腾");
htmlstr=htmlstr.replace(/Lv ZhaoXian/g,"吕兆贤");
htmlstr=htmlstr.replace(/Ma ShengRui/g,"马圣瑞");
htmlstr=htmlstr.replace(/Ma YeShan/g,"马也骟");
htmlstr=htmlstr.replace(/Mario Tomiozzo/g,"马里奥 托米奥佐");
htmlstr=htmlstr.replace(/Mo WangSong/g,"莫望嵩");
htmlstr=htmlstr.replace(/Moritz Schmutzer/g,"莫里茨 舒穆策尔");
htmlstr=htmlstr.replace(/Niu YongYi/g,"牛勇毅");
htmlstr=htmlstr.replace(/Pang MaoZhen/g,"庞茂臻");
htmlstr=htmlstr.replace(/Qiao ShuaiQi/g,"乔帅气");
htmlstr=htmlstr.replace(/Qiu Gang/g,"球缸");
htmlstr=htmlstr.replace(/Ritchie Arendse/g,"里奇 阿伦德斯");
htmlstr=htmlstr.replace(/Ross Baines/g,"罗斯 巴恩斯");
htmlstr=htmlstr.replace(/Shang JianSheng/g,"商剑圣");
htmlstr=htmlstr.replace(/Shen FengFeng/g,"沈凤凤");
htmlstr=htmlstr.replace(/Shen QingSheng/g,"沈庆生");
htmlstr=htmlstr.replace(/Shen ShouWu/g,"伸手捂");
htmlstr=htmlstr.replace(/Su KeZhen/g,"苏可臻");
htmlstr=htmlstr.replace(/Su ShangKun/g,"苏尚坤");
htmlstr=htmlstr.replace(/Sun XiaoTian/g,"孙笑天");
htmlstr=htmlstr.replace(/Sun YaoHua/g,"孙耀华");
htmlstr=htmlstr.replace(/Sun ZhongShan/g,"孙中山");
htmlstr=htmlstr.replace(/Tan DeZhong/g,"谭德忠");
htmlstr=htmlstr.replace(/Wang YiHu/g,"旺已糊");
htmlstr=htmlstr.replace(/Wang ZhanPeng/g,"王展鹏");
htmlstr=htmlstr.replace(/Xi JianWen/g,"习建文");
htmlstr=htmlstr.replace(/Xia YongChi/g,"夏永驰");
htmlstr=htmlstr.replace(/Xu LiCheng/g,"许立程");
htmlstr=htmlstr.replace(/Xun XinTing/g,"荀新亭");
htmlstr=htmlstr.replace(/Yitzchak Altman/g,"伊茨恰克 阿尔特曼");
htmlstr=htmlstr.replace(/Yue XiangYang/g,"月向阳");
htmlstr=htmlstr.replace(/Yun QiYuan/g,"云起源");
htmlstr=htmlstr.replace(/Zhang KongMing/g,"张孔明");
htmlstr=htmlstr.replace(/Zheng WenJing/g,"郑文婧");
htmlstr=htmlstr.replace(/Zhou JiaJie/g,"周家杰");
htmlstr=htmlstr.replace(/Zhu JingTian/g,"朱景甜");
htmlstr=htmlstr.replace(/Zu Ji/g,"祖籍");

//No.91
//魔力联
htmlstr=htmlstr.replace(/Chu Yang/g,"楚阳"); 
htmlstr=htmlstr.replace(/Ding YaoZhi/g,"丁遥志"); 
htmlstr=htmlstr.replace(/Fu Lan/g,"弗兰"); 
htmlstr=htmlstr.replace(/He SongYan/g,"何松岩"); 
htmlstr=htmlstr.replace(/Kong LiangPing/g,"孔良平"); 
htmlstr=htmlstr.replace(/Lai ChenMing/g,"赖辰明");
htmlstr=htmlstr.replace(/Lian AnGuo/g,"连安国"); 
htmlstr=htmlstr.replace(/Lin YaHui/g,"林雅辉"); 
htmlstr=htmlstr.replace(/Mu HongCai/g,"沐宏才"); 
htmlstr=htmlstr.replace(/Shi ZhaoZhong/g,"石兆忠"); 
htmlstr=htmlstr.replace(/Sun JingTao/g,"孙景涛"); 
htmlstr=htmlstr.replace(/Sun ShiHao/g,"孙世豪"); 
htmlstr=htmlstr.replace(/Wu YunPeng/g,"吴云鹏"); 
htmlstr=htmlstr.replace(/Wu ZhaoWen/g,"吴兆文"); 
htmlstr=htmlstr.replace(/Yan QiMei/g,"颜齐眉"); 
htmlstr=htmlstr.replace(/Yu TieSheng/g,"于铁胜"); 
htmlstr=htmlstr.replace(/Zhan YiWei/g,"詹一伟"); 
htmlstr=htmlstr.replace(/Zhao TanChao/g,"赵潭超"); 

//No.92
//一江天FC
htmlstr=htmlstr.replace(/He ZhiJie|何志Jie/g,"何志杰");
htmlstr=htmlstr.replace(/Hu WeiMin/g,"胡伟民");
htmlstr=htmlstr.replace(/Zhang DongPing/g,"张东平");
htmlstr=htmlstr.replace(/Liao MingChang/g,"廖明昌");

//No.93
//weare
htmlstr=htmlstr.replace(/Cai XiJie/g,"蔡希杰");
htmlstr=htmlstr.replace(/Chen ChenXiaoTong/g,"陈晓彤");
htmlstr=htmlstr.replace(/Cui LeiLuo/g,"崔雷罗");
htmlstr=htmlstr.replace(/Han RuiLong/g,"韩瑞龙");
htmlstr=htmlstr.replace(/He YanSong/g,"何岩松");
htmlstr=htmlstr.replace(/Hu YuKun/g,"胡云坤");
htmlstr=htmlstr.replace(/Huo XiangXiang/g,"霍香香");
htmlstr=htmlstr.replace(/Ji LinGen/g,"金林根");
htmlstr=htmlstr.replace(/Jin ZiYi/g,"金子一");
htmlstr=htmlstr.replace(/Kang YiZhou/g,"康一周");
htmlstr=htmlstr.replace(/Ke CiFu/g,"柯慈福");
htmlstr=htmlstr.replace(/Long ZhiJiong/g,"龙之囧");
htmlstr=htmlstr.replace(/Lv FengMing/g,"吕凤鸣");
htmlstr=htmlstr.replace(/Mao GuangQi/g,"毛光奇");
htmlstr=htmlstr.replace(/Mo SanFeng/g,"莫三峰");
htmlstr=htmlstr.replace(/Qiao ZeDong/g,"乔泽东");
htmlstr=htmlstr.replace(/Shen WenYi/g,"沈文怡");
htmlstr=htmlstr.replace(/Sun XiangNan/g,"孙翔南");
htmlstr=htmlstr.replace(/Tao YingQuan/g,"陶英全");
htmlstr=htmlstr.replace(/Wan DaCheng/g,"万达城");
htmlstr=htmlstr.replace(/Wan Meng/g,"挽梦");
htmlstr=htmlstr.replace(/Wang YiJie/g,"王一杰");
htmlstr=htmlstr.replace(/Wu TingSheng/g,"吴庭胜");
htmlstr=htmlstr.replace(/Xue KuiAn/g,"薛奎安");
htmlstr=htmlstr.replace(/Ye YiSan/g,"叶一三");
htmlstr=htmlstr.replace(/Yin JiaHao/g,"尹家豪");
htmlstr=htmlstr.replace(/Zhao YongQi/g,"赵永奇");

//No.94
//山东高唐 
htmlstr=htmlstr.replace(/Shan JianQiang/g,"单建强"); 
htmlstr=htmlstr.replace(/Xue MaoRui/g,"薛茂瑞"); 
htmlstr=htmlstr.replace(/Lai JunSheng/g,"赖军胜"); 
htmlstr=htmlstr.replace(/Qiang JunHui/g,"强俊辉"); 
htmlstr=htmlstr.replace(/Bian GuoYu/g,"卞国宇"); 
htmlstr=htmlstr.replace(/Wen LiBin/g,"温立彬"); 
htmlstr=htmlstr.replace(/Cheng An/g,"程安"); 
htmlstr=htmlstr.replace(/Yi LiFu/g,"衣立福"); 
htmlstr=htmlstr.replace(/Fang YangNan/g,"方漾男"); 
htmlstr=htmlstr.replace(/Sang HaiJun/g,"桑海军"); 
htmlstr=htmlstr.replace(/Lang YanCheng/g,"郎岩城"); 
htmlstr=htmlstr.replace(/Li YaKai/g,"黎亚凯"); 
htmlstr=htmlstr.replace(/Tang Ming/g,"唐鸣"); 
htmlstr=htmlstr.replace(/Wu XinTing/g,"武信廷"); 
htmlstr=htmlstr.replace(/Zhao XuFei/g,"赵旭飞"); 
htmlstr=htmlstr.replace(/Xing ZhiLi/g,"邢志笠"); 
htmlstr=htmlstr.replace(/Tang DeCheng/g,"唐德承"); 
htmlstr=htmlstr.replace(/Deng DongLu/g,"邓东陆"); 
htmlstr=htmlstr.replace(/Du HaiYun/g,"杜海云"); 
htmlstr=htmlstr.replace(/Xie HuiPing/g,"谢惠平"); 
htmlstr=htmlstr.replace(/Zhang HongGen/g,"张洪根"); 
htmlstr=htmlstr.replace(/Zhan Chang/g,"展畅"); 
htmlstr=htmlstr.replace(/Li YuSen/g,"李玉森"); 
htmlstr=htmlstr.replace(/Cao ShiMing/g,"曹世明"); 
htmlstr=htmlstr.replace(/She Dong/g,"佘东"); 
htmlstr=htmlstr.replace(/Huo ZhiHuan/g,"霍之焕");

//No.95
//中国中原足球队 
htmlstr=htmlstr.replace(/Cai CaiYue/g,"蔡彩月"); 
htmlstr=htmlstr.replace(/Chen '姚明'YaoMing|Chen YaoMing/g,"陈耀明"); 
htmlstr=htmlstr.replace(/Chu QiHan/g,"楚启汉"); 
htmlstr=htmlstr.replace(/Cui ZhiYu/g,"崔志宇"); 
htmlstr=htmlstr.replace(/Ding TianXiang/g,"丁天祥"); 
htmlstr=htmlstr.replace(/Ding YiGang/g,"丁毅刚"); 
htmlstr=htmlstr.replace(/Fang ShanPing/g,"房山平");
htmlstr=htmlstr.replace(/Gan ShengQiao/g,"甘圣乔");
htmlstr=htmlstr.replace(/Gao TianMing/g,"高天明"); 
htmlstr=htmlstr.replace(/Gao Xi/g,"高熹"); 
htmlstr=htmlstr.replace(/Gao XiaoPeng/g,"高晓鹏");
htmlstr=htmlstr.replace(/Gao YuShuai/g,"高于帅"); 
htmlstr=htmlstr.replace(/He ChuGe/g,"何楚歌"); 
htmlstr=htmlstr.replace(/He HaoChen/g,"何浩辰");
htmlstr=htmlstr.replace(/Hou Cong/g,"侯聪"); 
htmlstr=htmlstr.replace(/Hu ChuGe/g,"胡楚歌");
htmlstr=htmlstr.replace(/Huang PinSu/g,"黄品苏"); 
htmlstr=htmlstr.replace(/Huo ChaoChe/g,"霍超车"); 
htmlstr=htmlstr.replace(/Jin HouLei/g,"金厚磊"); 
htmlstr=htmlstr.replace(/Lan YuHuan/g,"兰宇寰");
htmlstr=htmlstr.replace(/Li YuHuan/g,"黎宇寰"); 
htmlstr=htmlstr.replace(/Li ZiBo/g,"李淄博 ");
htmlstr=htmlstr.replace(/Lin JianBai/g,"林建白"); 
htmlstr=htmlstr.replace(/Liu LinJiang/g,"刘林江");
htmlstr=htmlstr.replace(/Liu SuMeng/g,"刘肃蒙");
htmlstr=htmlstr.replace(/Lu JunLing/g,"陆峻岭");
htmlstr=htmlstr.replace(/Luo BingChen/g,"洛炳琛"); 
htmlstr=htmlstr.replace(/Mao PengFei/g,"毛鹏飞"); 
htmlstr=htmlstr.replace(/Ou WuTao/g,"区武韬");
htmlstr=htmlstr.replace(/Pan YiLin/g,"潘毅麟"); 
htmlstr=htmlstr.replace(/Peng DingFa/g,"彭定发"); 
htmlstr=htmlstr.replace(/Qi Bu/g,"齐布"); 
htmlstr=htmlstr.replace(/Qiu MinBi/g,"邱民毕");
htmlstr=htmlstr.replace(/Rao NingTao/g,"饶宁涛"); 
htmlstr=htmlstr.replace(/Shen Chang/g,"申昌"); 
htmlstr=htmlstr.replace(/Sheng ChaoCe/g,"盛超策"); 
htmlstr=htmlstr.replace(/Song JiaQiang/g,"宋家强"); 
htmlstr=htmlstr.replace(/Song JiangTao/g,"宋江涛"); 
htmlstr=htmlstr.replace(/Su GouSheng/g,"苏狗剩"); 
htmlstr=htmlstr.replace(/Tang MingKai/g,"唐明凯");
htmlstr=htmlstr.replace(/Tang ShuaiShuai/g,"唐帅帅"); 
htmlstr=htmlstr.replace(/Tong RuYu/g,"童如玉"); 
htmlstr=htmlstr.replace(/Wan GanChang/g,"万赣昌");
htmlstr=htmlstr.replace(/Wan GanGang/g,"万敢刚"); 
htmlstr=htmlstr.replace(/Wang GuoYao/g,"王国耀"); 
htmlstr=htmlstr.replace(/Wang HaiBin/g,"王海滨"); 
htmlstr=htmlstr.replace(/Wen HuaJian/g,"温华健"); 
htmlstr=htmlstr.replace(/Wu GuCheng/g,"武孤城"); 
htmlstr=htmlstr.replace(/Xia RuiLong/g,"夏瑞龙"); 
htmlstr=htmlstr.replace(/Xing MingZe/g,"邢明泽"); 
htmlstr=htmlstr.replace(/Xue ChenBo/g,"薛晨博"); 
htmlstr=htmlstr.replace(/Xun DaDi/g,"荀大帝");
htmlstr=htmlstr.replace(/Xun PengFei/g,"荀鹏飞"); 
htmlstr=htmlstr.replace(/Yan Chun/g,"严春"); 
htmlstr=htmlstr.replace(/Ye Xiong/g,"叶雄"); 
htmlstr=htmlstr.replace(/Yi HanLin/g,"伊翰林"); 
htmlstr=htmlstr.replace(/Zhang WangWei/g,"张旺伟"); 
htmlstr=htmlstr.replace(/Zhang XiHua/g,"张西华"); 
htmlstr=htmlstr.replace(/Zhao SuHao/g,"赵肃昊"); 
htmlstr=htmlstr.replace(/Zhao ZiLiang/g,"赵子良");
htmlstr=htmlstr.replace(/Zhou ZhaoShun/g,"周兆顺"); 
htmlstr=htmlstr.replace(/Zhu ChenLong/g,"朱宸龙"); 
htmlstr=htmlstr.replace(/Zhuang GuiShan/g,"庄圭山"); 

//No.96
//梅斯奎恩辣无糖 
htmlstr=htmlstr.replace(/Dong Ya/g,"董崖"); 
htmlstr=htmlstr.replace(/Eugenijus Gimbutas/g,"尤金尼厄斯 金布塔斯"); 
htmlstr=htmlstr.replace(/Han ZhiShen/g,"韩芝慎");
htmlstr=htmlstr.replace(/Jesús Ivuti/g,"耶稣 伊武帝"); 
htmlstr=htmlstr.replace(/Jørgen Wilhelmsen/g,"乔根 威廉森"); 
htmlstr=htmlstr.replace(/Kardal Suhail/g,"卡达尔 苏海勒"); 
htmlstr=htmlstr.replace(/Mei XiongXiong/g,"梅熊熊");
htmlstr=htmlstr.replace(/Phillip Wright/g,"菲利普 莱特");
htmlstr=htmlstr.replace(/Xiong YanXiao/g,"雄言笑");
htmlstr=htmlstr.replace(/ZhangSun QianJin/g,"长孙乾瑾");



//No.97
//赤旗天下 
htmlstr=htmlstr.replace(/Lu JiYong/g,"陆冀勇"); 
htmlstr=htmlstr.replace(/Lu XiHe/g,"卢西荷"); 
htmlstr=htmlstr.replace(/Ma XueSen/g,"麻雪森"); 
htmlstr=htmlstr.replace(/NanGong YanWei/g,"南宫燕尾"); 
htmlstr=htmlstr.replace(/Qian Tai/g,"钱泰"); 
htmlstr=htmlstr.replace(/Tao YaDong/g,"陶亚东");
htmlstr=htmlstr.replace(/Wang DaZhan/g,"王大战"); 
htmlstr=htmlstr.replace(/Yan ZhenHui/g,"闫振辉"); 
htmlstr=htmlstr.replace(/Yuan DeCheng/g,"元德成"); 
htmlstr=htmlstr.replace(/Zhang YaoYang/g,"张耀扬"); 
htmlstr=htmlstr.replace(/Zhen XueSheng/g,"甄学生"); 
htmlstr=htmlstr.replace(/Zhou YanBo/g,"周颜波"); 
htmlstr=htmlstr.replace(/Zhu KaiXiong/g,"朱恺雄"); 

//No.98
//珞珈山
htmlstr=htmlstr.replace(/Tsotne Kaidarashvili/g,"措特内·凯达拉什维利");
htmlstr=htmlstr.replace(/Xi HaiFan/g,"习海凡");
htmlstr=htmlstr.replace(/Xu RunZhen/g,"许仁贞");
htmlstr=htmlstr.replace(/Zhang SuYi/g,"张素伊");
htmlstr=htmlstr.replace(/Zhao YueYu/g,"赵越雨");
htmlstr=htmlstr.replace(/Zhou SongHai/g,"周颂海");

//No.99
//ChaoZhou.SF_4502633
htmlstr=htmlstr.replace(/Tang ShanLang/g,"唐山狼");

//No.100
//和风细雨楼
htmlstr=htmlstr.replace(/Chen ChengMin/g,"陈诚民");
htmlstr=htmlstr.replace(/Deng ZeBin/g,"邓泽斌");
htmlstr=htmlstr.replace(/Fei QiChao/g,"斐启超");
htmlstr=htmlstr.replace(/Gan TingFeng/g,"甘廷枫");
htmlstr=htmlstr.replace(/Guo HouCheng/g,"郭侯诚");
htmlstr=htmlstr.replace(/Hu XiaoFang/g,"胡小芳");
htmlstr=htmlstr.replace(/Huo LinJiang/g,"霍麟强");
htmlstr=htmlstr.replace(/Ji WenGuang/g,"季文光");
htmlstr=htmlstr.replace(/Li ChunJi /g,"李春基");
htmlstr=htmlstr.replace(/Lin TongXin/g,"林同信");
htmlstr=htmlstr.replace(/Pang XiaoGang/g,"庞晓刚");
htmlstr=htmlstr.replace(/Shi SongYan/g,"石嵩燕");
htmlstr=htmlstr.replace(/Song JingPing/g,"宋镜平");
htmlstr=htmlstr.replace(/Sun LianZhi/g,"孙连志");
htmlstr=htmlstr.replace(/Wang YaoZhi/g,"王耀之");
htmlstr=htmlstr.replace(/Wang ZiYi/g,"王子一");
htmlstr=htmlstr.replace(/Wu TaiYuan/g,"吴泰源");
htmlstr=htmlstr.replace(/Wu YinChen/g,"吴印尘");
htmlstr=htmlstr.replace(/Xiao YiJi/g,"萧一机");
htmlstr=htmlstr.replace(/Xie YanJun/g,"谢燕君");
htmlstr=htmlstr.replace(/Ye QiLong/g,"叶启龙");
htmlstr=htmlstr.replace(/Zhao JiaQin/g,"赵家勤");
htmlstr=htmlstr.replace(/Zhou ShiJun/g,"周士军");

//No.101
//厦门海滨城市_4521237
htmlstr=htmlstr.replace(/Bao ZhongYi/g,"鲍忠义");
htmlstr=htmlstr.replace(/Bu ZuDe/g,"卜祖德");
htmlstr=htmlstr.replace(/Chu WenTong/g,"楚文通");
htmlstr=htmlstr.replace(/Deng RuiFei/g,"邓瑞飞");
htmlstr=htmlstr.replace(/Ding XuSheng/g,"丁旭生");
htmlstr=htmlstr.replace(/Duan Yao/g,"段尧");
htmlstr=htmlstr.replace(/Fei ShengYuan/g,"费盛园");
htmlstr=htmlstr.replace(/He ShuFeng/g,"何书峰");
htmlstr=htmlstr.replace(/Hua ZeDong/g,"华泽东");
htmlstr=htmlstr.replace(/Jiang GuangJie/g,"姜光杰");
htmlstr=htmlstr.replace(/Jing ChuanHua/g,"景传华");
htmlstr=htmlstr.replace(/Lei CunXi/g,"罗存熙");
htmlstr=htmlstr.replace(/Lei NanXing/g,"雷南星");
htmlstr=htmlstr.replace(/Lin YouZhi/g,"林佑智");
htmlstr=htmlstr.replace(/Lin YuShuai/g,"林玉帅");
htmlstr=htmlstr.replace(/Liu GuangNan/g,"刘光南");
htmlstr=htmlstr.replace(/Luo DuXu/g,"洛杜旭");
htmlstr=htmlstr.replace(/Mi XiaoXiang/g,"米晓祥");
htmlstr=htmlstr.replace(/Qian KeCheng/g,"钱克诚");
htmlstr=htmlstr.replace(/Qian ShengLi/g,"钱胜利");
htmlstr=htmlstr.replace(/Qiao Qin/g,"乔钦");
htmlstr=htmlstr.replace(/Qin JianKai/g,"秦建凯");
htmlstr=htmlstr.replace(/Sun BinBin/g,"孙斌斌");
htmlstr=htmlstr.replace(/Sun ZiBo/g,"孙淄博");
htmlstr=htmlstr.replace(/Wen ZeQiang/g,"文泽强");
htmlstr=htmlstr.replace(/Xie YouZhi/g,"谢游之");

//No.102
//Shanghai Purplepink_4530085
htmlstr=htmlstr.replace(/Bao TianLe/g,"鲍添乐");
htmlstr=htmlstr.replace(/Du FeiLong/g,"杜飞龙");
htmlstr=htmlstr.replace(/Ge YiZhe/g,"葛义哲");
htmlstr=htmlstr.replace(/Guo XiaoYong/g,"郭小勇");
htmlstr=htmlstr.replace(/He YiFan/g,"何一帆");
htmlstr=htmlstr.replace(/Hong YuGong/g,"洪与共");
htmlstr=htmlstr.replace(/Hua TaoYu/g,"华陶宇");
htmlstr=htmlstr.replace(/Huo WenChao/g,"霍文超");
htmlstr=htmlstr.replace(/Ji XiaoFei/g,"季小飞");
htmlstr=htmlstr.replace(/Li LongYu/g,"李龙宇");
htmlstr=htmlstr.replace(/Li YiAo/g,"李亦傲");
htmlstr=htmlstr.replace(/Liang ShiYun/g,"梁石陨");
htmlstr=htmlstr.replace(/Pan ShanPing/g,"潘善评");
htmlstr=htmlstr.replace(/Song NanHai/g,"宋南海");
htmlstr=htmlstr.replace(/Sun JingLong/g,"孙景隆");
htmlstr=htmlstr.replace(/Tan XiaoMing/g,"谭晓明");
htmlstr=htmlstr.replace(/Wei RongFa/g,"韦荣发");
htmlstr=htmlstr.replace(/Wei Su/g,"魏速");
htmlstr=htmlstr.replace(/Wu XuJun/g,"吴旭君");
htmlstr=htmlstr.replace(/Xu JiMi/g,"许继弥");
htmlstr=htmlstr.replace(/Xu MingHu/g,"徐明虎");
htmlstr=htmlstr.replace(/Zhang YunGuo/g,"张允国");
htmlstr=htmlstr.replace(/Zhao JiMing/g,"赵继铭");
htmlstr=htmlstr.replace(/Zhen YouSu/g,"甄由素");
htmlstr=htmlstr.replace(/Zhong JunHui/g,"钟俊辉");
htmlstr=htmlstr.replace(/Zhuang SiJian/g,"庄思剑");


//特殊名字
htmlstr=htmlstr.replace(/Liu DeHua/g,"刘德华");
htmlstr=htmlstr.replace(/Qi WuSheng/g,"戚务生");
htmlstr=htmlstr.replace(/Sun Ke/g,"孙可");
htmlstr=htmlstr.replace(/Zhang YiMou/g,"张艺谋");

//NT
htmlstr=htmlstr.replace(/Bei HuanZhen/g,"北焕臻");
htmlstr=htmlstr.replace(/Cheng 'Gerard Piqué' YaKe|Cheng YaKe/g,"程亚柯");
htmlstr=htmlstr.replace(/Gao WenYong/g,"高稳勇");
htmlstr=htmlstr.replace(/Gu YouXun/g,"顾游勋");
htmlstr=htmlstr.replace(/Guan JiangRui/g,"关江瑞");
htmlstr=htmlstr.replace(/Guo '锅盖' HeJing|Guo HeJing/g,"郭和靖");
htmlstr=htmlstr.replace(/He Zhu/g,"何著");
htmlstr=htmlstr.replace(/Huo ZhiLei/g,"霍志磊");
htmlstr=htmlstr.replace(/Kang WeiFei/g,"康韦飞");
htmlstr=htmlstr.replace(/Li Cong/g,"李聪");
htmlstr=htmlstr.replace(/Liu '刘学瑞' XueRui|Liu XueRui/g,"刘学瑞");
htmlstr=htmlstr.replace(/Ou '振兴中华' ZhenHua|Ou ZhenHua/g,"欧振华");
htmlstr=htmlstr.replace(/Song RuiKai/g,"宋瑞凯");
htmlstr=htmlstr.replace(/Sun YueFeng/g,"孙岳峰");
htmlstr=htmlstr.replace(/Tan JinSong/g,"谭劲嵩");
htmlstr=htmlstr.replace(/Tu 'Shi Ke' Fa|Tu Fa/g,"涂珐");
htmlstr=htmlstr.replace(/Wang '王瑞仑' RuiLun|Wang RuiLun/g,"王瑞伦");
htmlstr=htmlstr.replace(/Xu Ya/g,"徐亚");
htmlstr=htmlstr.replace(/Yin '淫威' WeiShen|Yin WeiShen/g,"尹威神");
htmlstr=htmlstr.replace(/Zhang ChangQing/g,"张长卿");
htmlstr=htmlstr.replace(/Zhao '赵四' YanLin|Zhao YanLin/g,"赵炎麟");
htmlstr=htmlstr.replace(/Zheng GaoJun/g,"郑高俊");
htmlstr=htmlstr.replace(/Weng JunTao/g,"翁俊涛");



//二字

htmlstr=htmlstr.replace(/Fan Heng/g,"范衡");
htmlstr=htmlstr.replace(/Guo Kun/g,"郭坤"); 
htmlstr=htmlstr.replace(/Hua Qiang/g,"华强"); 
htmlstr=htmlstr.replace(/Huang Wei/g,"黄威"); 
htmlstr=htmlstr.replace(/Huo Lie/g,"霍烈"); 
htmlstr=htmlstr.replace(/Qian Xi/g,"千禧");
htmlstr=htmlstr.replace(/Ruan Qi/g,"阮奇");
htmlstr=htmlstr.replace(/Wang Guo/g,"王国");
htmlstr=htmlstr.replace(/Zheng Yin/g,"郑印");
htmlstr=htmlstr.replace(/Zhuang Kuo/g,"装阔"); 

document.getElementById("tooltip").innerHTML=htmlstr;
}
setInterval(nametip,500); //每3秒钟执行一次test()


//alert(document.getElementById("tooltip").innerHTML);