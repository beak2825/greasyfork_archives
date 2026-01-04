// ==UserScript==
// @name        网购比价领券神器—购物党，不仅自动领券还能额外领取补贴红包，365天历史价格、同款更低价、降价提醒、价格保护，官方持续维护
// @author      购物党
// @name:zh-cn  网购比价领券神器—购物党，不仅自动领券还能额外领取补贴红包，365天历史价格、同款更低价、降价提醒、价格保护，官方持续维护
// @antifeature referral-link 含有购物党官方返利
// @description 自动比较同款商品在淘宝/京东/天猫/亚马逊/当当//等更低价，提供365天历史价格走势查询，不仅可以领隐藏优惠券，无券商品还能领补贴红包，支持全网降价提醒、京东价格保护自动监控，链家二手房和Steam游戏也能比价！
// @description:zh-hk  自动比较同款商品在淘宝/京东/天猫/亚马逊/当当//等更低价，提供365天历史价格走势查询，不仅可以领隐藏优惠券，无券商品还能领补贴红包，支持全网降价提醒、京东价格保护自动监控，链家二手房和Steam游戏也能比价！
// @run-at      document-idle
// @version     4.2.5
// @grant 	   none
// @require     https://cdn.gwdang.com/js/vendor-gwdv2.js?v=3.7
// @include  https://www.hihonor.com/*
// @include  https://www.ymatou.hk/*
// @include  https://www.ymatou.com/*
// @include  http://traveldetail.fliggy.com/*
// @include  https://traveldetail.fliggy.com/*
// @include  http://*.wzhouhui.com/*
// @include  https://*.wzhouhui.com/*
// @include  http://cn.wemakeprice.com/*
// @include  https://cn.wemakeprice.com/*
// @include  http://cn.dod.nl/*
// @include  https://cn.dod.nl/*
// @include  http://*.decathlon.com.cn/*
// @include  https://*.decathlon.com.cn/*
// @include  http://cn.apo.com/*
// @include  https://cn.apo.com/*
// @include  http://*.ansgo.com/*
// @include  https://*.ansgo.com/*
// @include  http://*.perfumesclub.cn/*
// @include  https://*.perfumesclub.cn/*
// @include  http://*.net-a-porter.com/*
// @include  https://*.net-a-porter.com/*
// @include  http://*.kidsroom.cn/*
// @include  https://*.kidsroom.cn/*
// @include  http://cn.getthelabel.com/*
// @include  https://cn.getthelabel.com/*
// @include  http://*.farfetch.cn/*
// @include  https://*.farfetch.cn/*
// @include  http://item.kongfz.com/*
// @include  https://item.kongfz.com/*
// @include  http://book.kongfz.com/*
// @include  https://book.kongfz.com/*
// @include  http://cn.iherb.com/*
// @include  https://cn.iherb.com/*
// @include  http://*.hqhair.com/*
// @include  https://*.hqhair.com/*
// @include  http://*.wl.cn/*
// @include  https://*.wl.cn/*
// @include  http://*.columbia.com/*
// @include  https://*.columbia.com/*
// @include  http://*.columbiasports.cn/*
// @include  https://*.columbiasports.cn/*
// @include  http://*.ehaoyao.com/*
// @include  https://*.ehaoyao.com/*
// @include  http://*.bhphotovideo.com/*
// @include  https://*.bhphotovideo.com/*
// @include  http://*.shoes.com/*
// @include  https://*.shoes.com/*
// @include  http://*.jomashop.com/*
// @include  https://*.jomashop.com/*
// @include  http://cn.pharmacydirect.co.nz/*
// @include  https://cn.pharmacydirect.co.nz/*
// @include  http://*.holland-at-home.com/*
// @include  https://*.holland-at-home.com/*
// @include  http://cn.holland-at-home.com/*
// @include  https://cn.holland-at-home.com/*
// @include  http://*.rei.com/*
// @include  https://*.rei.com/*
// @include  http://item.aomygod.com/*
// @include  https://item.aomygod.com/*
// @include  http://*.huatuoyf.com/*
// @include  https://*.huatuoyf.com/*
// @include  http://*.forever21.com/*
// @include  https://*.forever21.com/*
// @include  http://zh.ashford.com/*
// @include  https://zh.ashford.com/*
// @include  http://*.bestbuy.com/*
// @include  https://*.bestbuy.com/*
// @include  http://*.target.com/*
// @include  https://*.target.com/*
// @include  http://cn.chemistdirect.com.au/*
// @include  https://cn.chemistdirect.com.au/*
// @include  http://*.ba.de/*
// @include  https://*.ba.de/*
// @include  http://m.wandougongzhu.cn/*
// @include  https://m.wandougongzhu.cn/*
// @include  http://cn.feelunique.com/*
// @include  https://cn.feelunique.com/*
// @include  http://shop.dixintong.com/*
// @include  https://shop.dixintong.com/*
// @include  http://cn.pharmacyonline.com.au/*
// @include  https://cn.pharmacyonline.com.au/*
// @include  http://cn.discount-apotheke.de/*
// @include  https://cn.discount-apotheke.de/*
// @include  http://*.carters.com/*
// @include  https://*.carters.com/*
// @include  http://*.katespade.co.uk/*
// @include  https://*.katespade.co.uk/*
// @include  http://*.katespade.cn/*
// @include  https://*.katespade.cn/*
// @include  http://*.beautybay.com/*
// @include  https://*.beautybay.com/*
// @include  http://cn.pharmacy4less.com.au/*
// @include  https://cn.pharmacy4less.com.au/*
// @include  http://*.newegg.com/*
// @include  https://*.newegg.com/*
// @include  http://*.newbalance.com/*
// @include  https://*.newbalance.com/*
// @include  http://*.bodybuilding.com/*
// @include  https://*.bodybuilding.com/*
// @include  http://*.ssnewyork.com/*
// @include  https://*.ssnewyork.com/*
// @include  http://*.wine9.com/*
// @include  https://*.wine9.com/*
// @include  http://*.kohls.com/*
// @include  https://*.kohls.com/*
// @include  http://*.gnc.com/*
// @include  https://*.gnc.com/*
// @include  http://*.qw.cc/*
// @include  https://*.qw.cc/*
// @include  http://*.haiershui.com/*
// @include  https://*.haiershui.com/*
// @include  http://*.ugg.com/*
// @include  https://*.ugg.com/*
// @include  http://*.ugg.cn/*
// @include  https://*.ugg.cn/*
// @include  http://*.yoger.com.cn/*
// @include  https://*.yoger.com.cn/*
// @include  http://*.flyco.com/*
// @include  https://*.flyco.com/*
// @include  http://*.yfdyf.com/*
// @include  https://*.yfdyf.com/*
// @include  http://*.joesnewbalanceoutlet.com/*
// @include  https://*.joesnewbalanceoutlet.com/*
// @include  http://*.jomoo.com.cn/*
// @include  https://*.jomoo.com.cn/*
// @include  http://*.dapu.com/*
// @include  https://*.dapu.com/*
// @include  http://china.coach.com/*
// @include  https://china.coach.com/*
// @include  http://*.shanmai.cn/*
// @include  https://*.shanmai.cn/*
// @include  http://*.fengbuy.com/*
// @include  https://*.fengbuy.com/*
// @include  http://*.t10.com/*
// @include  https://*.t10.com/*
// @include  http://cn.amcal.com.au/*
// @include  https://cn.amcal.com.au/*
// @include  http://cn.babyhaven.com/*
// @include  https://cn.babyhaven.com/*
// @include  http://*.51taouk.com/*
// @include  https://*.51taouk.com/*
// @include  http://*.usashopcn.com/*
// @include  https://*.usashopcn.com/*
// @include  http://*.petit-bateau.us/*
// @include  https://*.petit-bateau.us/*
// @include  http://*.tlcpharmacy.cn.com/*
// @include  https://*.tlcpharmacy.cn.com/*
// @include  http://*.km1818.com/*
// @include  https://*.km1818.com/*
// @include  http://*.bienmanger.cn/*
// @include  https://*.bienmanger.cn/*
// @include  http://*.syshop.com/*
// @include  https://*.syshop.com/*
// @include  http://*.qipaimall.com/*
// @include  https://*.qipaimall.com/*
// @include  http://mall.goumin.com/*
// @include  https://mall.goumin.com/*
// @include  http://*.taohwu.com/*
// @include  https://*.taohwu.com/*
// @include  http://*.xmeise.com/*
// @include  https://*.xmeise.com/*
// @include  http://*.septwolves.cn/*
// @include  https://*.septwolves.cn/*
// @include  http://*.kiehls.com/*
// @include  https://*.kiehls.com/*
// @include  http://*.puzeyf.com/*
// @include  https://*.puzeyf.com/*
// @include  http://*.aizhigu.com.cn/*
// @include  https://*.aizhigu.com.cn/*
// @include  http://*.hecha.cn/*
// @include  https://*.hecha.cn/*
// @include  http://*.zgshoes.com/*
// @include  https://*.zgshoes.com/*
// @include  http://cn.takeya.co.jp/*
// @include  https://cn.takeya.co.jp/*
// @include  http://*.shoprobam.com/*
// @include  https://*.shoprobam.com/*
// @include  http://*.opplestore.com/*
// @include  https://*.opplestore.com/*
// @include  http://*.maichawang.com/*
// @include  https://*.maichawang.com/*
// @include  http://*.bose.com/*
// @include  https://*.bose.com/*
// @include  http://dewaren.com/*
// @include  https://dewaren.com/*
// @include  http://*.winona.cn/*
// @include  https://*.winona.cn/*
// @include  http://*.motorola.com.cn/*
// @include  https://*.motorola.com.cn/*
// @include  http://*.danielwellington.cn/*
// @include  https://*.danielwellington.cn/*
// @include  http://*.danielwellington.com/*
// @include  https://*.danielwellington.com/*
// @include  http://youhui.pinduoduo.com/*
// @include  https://youhui.pinduoduo.com/*
// @include  http://*.yangkeduo.com/*
// @include  https://*.yangkeduo.com/*
// @include  http://*.finishline.com/*
// @include  https://*.finishline.com/*
// @include  http://*.skinstore.com/*
// @include  https://*.skinstore.com/*
// @include  http://item.wjike.com/*
// @include  https://item.wjike.com/*
// @include  http://youpin.mi.com/*
// @include  https://youpin.mi.com/*
// @include  http://*.xiaomiyoupin.com/*
// @include  https://*.xiaomiyoupin.com/*
// @include  http://store.steampowered.com/*
// @include  https://store.steampowered.com/*
// @include  http://*.jialich.cn/*
// @include  https://*.jialich.cn/*
// @include  http://*.tthigo.com/*
// @include  https://*.tthigo.com/*
// @include  http://*.modernavenue.com/*
// @include  https://*.modernavenue.com/*
// @include  http://*.tcl.com/*
// @include  https://*.tcl.com/*
// @include  http://*.bonjourhk.com/*
// @include  https://*.bonjourhk.com/*
// @include  http://m.bonjourhk.com/*
// @include  https://m.bonjourhk.com/*
// @include  http://*.trt.hk/*
// @include  https://*.trt.hk/*
// @include  http://*.forestfood.com/*
// @include  https://*.forestfood.com/*
// @include  http://*.converse.com.cn/*
// @include  https://*.converse.com.cn/*
// @include  http://*.fila.cn/*
// @include  https://*.fila.cn/*
// @include  http://*.levi.com.cn/*
// @include  https://*.levi.com.cn/*
// @include  http://*.levi.com/*
// @include  https://*.levi.com/*
// @include  http://*.hangowa.com/*
// @include  https://*.hangowa.com/*
// @include  http://*.super-in.com/*
// @include  https://*.super-in.com/*
// @include  http://*.ccxpet.com/*
// @include  https://*.ccxpet.com/*
// @include  http://*.360lj.com/*
// @include  https://*.360lj.com/*
// @include  http://*.hysjg.com/*
// @include  https://*.hysjg.com/*
// @include  http://*.0061.com.au/*
// @include  https://*.0061.com.au/*
// @include  http://mall.ecovacs.cn/*
// @include  https://mall.ecovacs.cn/*
// @include  http://mall.littleswan.com/*
// @include  https://mall.littleswan.com/*
// @include  http://*.vitagou.hk/*
// @include  https://*.vitagou.hk/*
// @include  http://*.hpstore.cn/*
// @include  https://*.hpstore.cn/*
// @include  http://*.kkguan.com/*
// @include  https://*.kkguan.com/*
// @include  http://*.mayn.com.cn/*
// @include  https://*.mayn.com.cn/*
// @include  http://*.peikua.com/*
// @include  https://*.peikua.com/*
// @include  http://item.kinhom.com/*
// @include  https://item.kinhom.com/*
// @include  http://*.9drug.com/*
// @include  https://*.9drug.com/*
// @include  http://*.tea7.com/*
// @include  https://*.tea7.com/*
// @include  http://*.01home.com/*
// @include  https://*.01home.com/*
// @include  http://*.aliexpress.com/*
// @include  https://*.aliexpress.com/*
// @include  http://*.easytoys.cn/*
// @include  https://*.easytoys.cn/*
// @include  http://*.kiwistarcare.com/*
// @include  https://*.kiwistarcare.com/*
// @include  http://*.carrefour.cn/*
// @include  https://*.carrefour.cn/*
// @include  http://china.lotte.com/*
// @include  https://china.lotte.com/*
// @include  http://*.ewatches.com/*
// @include  https://*.ewatches.com/*
// @include  http://global.timex.com/*
// @include  https://global.timex.com/*
// @include  http://comfortfirst.com/*
// @include  https://comfortfirst.com/*
// @include  http://*.luolai.cn/*
// @include  https://*.luolai.cn/*
// @include  http://*.youyu.com/*
// @include  https://*.youyu.com/*
// @include  http://*.yoox.cn/*
// @include  https://*.yoox.cn/*
// @include  http://store.yoox.cn/*
// @include  https://store.yoox.cn/*
// @include  http://*.suanjuzi.com/*
// @include  https://*.suanjuzi.com/*
// @include  http://*.yao123.com/*
// @include  https://*.yao123.com/*
// @include  http://item.baobeigezi.com/*
// @include  https://item.baobeigezi.com/*
// @include  http://*.baobeigezi.com/*
// @include  https://*.baobeigezi.com/*
// @include  http://*.opposhop.cn/*
// @include  https://*.opposhop.cn/*
// @include  http://store.oppo.com/*
// @include  https://store.oppo.com/*
// @include  http://*.oppo.com/*
// @include  https://*.oppo.com/*
// @include  http://hd.oppo.com/*
// @include  https://hd.oppo.com/*
// @include  http://mall.to8to.com/*
// @include  https://mall.to8to.com/*
// @include  http://item.yunhou.com/*
// @include  https://item.yunhou.com/*
// @include  http://item.yhd.com/*
// @include  https://item.yhd.com/*
// @include  http://*.haituncun.com/*
// @include  https://*.haituncun.com/*
// @include  http://*.walmart.com/*
// @include  https://*.walmart.com/*
// @include  http://*.vmei.com/*
// @include  https://*.vmei.com/*
// @include  http://*.jgb.cn/*
// @include  https://*.jgb.cn/*
// @include  http://*.51din.com/*
// @include  https://*.51din.com/*
// @include  http://*.aidai.com/*
// @include  https://*.aidai.com/*
// @include  http://shop.boqii.com/*
// @include  https://shop.boqii.com/*
// @include  http://*.spider.com.cn/*
// @include  https://*.spider.com.cn/*
// @include  http://*.jiae.com/*
// @include  https://*.jiae.com/*
// @include  http://*.zazhipu.com/*
// @include  https://*.zazhipu.com/*
// @include  http://*.shop.philips.com.cn/*
// @include  https://*.shop.philips.com.cn/*
// @include  http://tuan.zhongjiu.cn/*
// @include  https://tuan.zhongjiu.cn/*
// @include  http://*.zhongjiu.cn/*
// @include  https://*.zhongjiu.cn/*
// @include  http://*.kaluli.com/*
// @include  https://*.kaluli.com/*
// @include  http://shop.wstx.com/*
// @include  https://shop.wstx.com/*
// @include  http://*.purcotton.com/*
// @include  https://*.purcotton.com/*
// @include  http://shop.juanpi.com/*
// @include  https://shop.juanpi.com/*
// @include  http://*.jinxiang.com/*
// @include  https://*.jinxiang.com/*
// @include  http://*.163.com/*
// @include  https://*.163.com/*
// @include  http://*.guojimami.com/*
// @include  https://*.guojimami.com/*
// @include  http://*.baiyangwang.com/*
// @include  https://*.baiyangwang.com/*
// @include  http://cn.royyoungchemist.com.au/*
// @include  https://cn.royyoungchemist.com.au/*
// @include  http://cn.medihealshop.com/*
// @include  https://cn.medihealshop.com/*
// @include  http://*.medihealshop.com/*
// @include  https://*.medihealshop.com/*
// @include  http://cn.1001pharmacies.com/*
// @include  https://cn.1001pharmacies.com/*
// @include  http://*.lookfantastic.cn/*
// @include  https://*.lookfantastic.cn/*
// @include  http://*.lookfantastic.com/*
// @include  https://*.lookfantastic.com/*
// @include  http://you.163.com/*
// @include  https://you.163.com/*
// @include  http://product.bl.com/*
// @include  https://product.bl.com/*
// @include  http://*.bestinfoods.com/*
// @include  https://*.bestinfoods.com/*
// @include  http://*.muji.net/*
// @include  https://*.muji.net/*
// @include  http://*.easeeyes.com/*
// @include  https://*.easeeyes.com/*
// @include  http://*.lingshi.com/*
// @include  https://*.lingshi.com/*
// @include  http://*.nubia.com/*
// @include  https://*.nubia.com/*
// @include  http://shop.nubia.com/*
// @include  https://shop.nubia.com/*
// @include  http://*.nubia.cn/*
// @include  https://*.nubia.cn/*
// @include  http://*.kzj365.com/*
// @include  https://*.kzj365.com/*
// @include  http://*.kaola.com/*
// @include  https://*.kaola.com/*
// @include  http://*.kaola.com.hk/*
// @include  https://*.kaola.com.hk/*
// @include  http://*.kaola.com.hk/*
// @include  https://*.kaola.com.hk/*
// @include  http://*.ymatou.com/*
// @include  https://*.ymatou.com/*
// @include  http://detail.metao.com/*
// @include  https://detail.metao.com/*
// @include  http://*.coocaa.com/*
// @include  https://*.coocaa.com/*
// @include  http://*.lifevc.com/*
// @include  https://*.lifevc.com/*
// @include  http://*.supuy.com/*
// @include  https://*.supuy.com/*
// @include  http://*.supumall.com/*
// @include  https://*.supumall.com/*
// @include  http://*.mia.com/*
// @include  https://*.mia.com/*
// @include  http://miyabaobei.hk/*
// @include  https://miyabaobei.hk/*
// @include  http://*.miyabaobei.hk/*
// @include  https://*.miyabaobei.hk/*
// @include  http://item.gomehigo.hk/*
// @include  https://item.gomehigo.hk/*
// @include  http://*.wangfujing.com/*
// @include  https://*.wangfujing.com/*
// @include  http://global.gou.com/*
// @include  https://global.gou.com/*
// @include  http://*.gou.com/*
// @include  https://*.gou.com/*
// @include  http://*.ikjtao.com/*
// @include  https://*.ikjtao.com/*
// @include  http://*.bestkeep.cn/*
// @include  https://*.bestkeep.cn/*
// @include  http://*.ule.com/*
// @include  https://*.ule.com/*
// @include  http://shop.philips.com.cn/*
// @include  https://shop.philips.com.cn/*
// @include  http://shop.tcl.com/*
// @include  https://shop.tcl.com/*
// @include  http://mall.tcl.com/*
// @include  https://mall.tcl.com/*
// @include  http://*.e-changhong.com/*
// @include  https://*.e-changhong.com/*
// @include  http://shop.konka.com/*
// @include  https://shop.konka.com/*
// @include  http://shop.hisense.com/*
// @include  https://shop.hisense.com/*
// @include  http://*.hisense.com/*
// @include  https://*.hisense.com/*
// @include  http://*.ineigo.com/*
// @include  https://*.ineigo.com/*
// @include  http://*.skg.com/*
// @include  https://*.skg.com/*
// @include  http://*.oyeah.com/*
// @include  https://*.oyeah.com/*
// @include  http://*.morefood.com/*
// @include  https://*.morefood.com/*
// @include  http://*.zhen.com/*
// @include  https://*.zhen.com/*
// @include  http://shop.vivo.com.cn/*
// @include  https://shop.vivo.com.cn/*
// @include  http://gfive.b2c.eqimingxing.com/*
// @include  https://gfive.b2c.eqimingxing.com/*
// @include  http://*.6pm.com/*
// @include  https://*.6pm.com/*
// @include  http://shop.gionee.com/*
// @include  https://shop.gionee.com/*
// @include  http://z.gionee.com/*
// @include  https://z.gionee.com/*
// @include  http://store.lining.com/*
// @include  https://store.lining.com/*
// @include  http://*.mf910.com/*
// @include  https://*.mf910.com/*
// @include  http://*.k-touch.cn/*
// @include  https://*.k-touch.cn/*
// @include  http://item.grainger.cn/*
// @include  https://item.grainger.cn/*
// @include  http://piao.163.com/*
// @include  https://piao.163.com/*
// @include  http://mall.163.com/*
// @include  https://mall.163.com/*
// @include  http://detail.yao.95095.com/*
// @include  https://detail.yao.95095.com/*
// @include  http://*.ebay.com/*
// @include  https://*.ebay.com/*
// @include  http://*.100yue.com/*
// @include  https://*.100yue.com/*
// @include  http://*.feiniu.com/*
// @include  https://*.feiniu.com/*
// @include  http://*.lemall.com/*
// @include  https://*.lemall.com/*
// @include  http://item.feiniu.com/*
// @include  https://item.feiniu.com/*
// @include  http://*.xgbaby.com/*
// @include  https://*.xgbaby.com/*
// @include  http://*.zuipin.cn/*
// @include  https://*.zuipin.cn/*
// @include  http://item.feifei.cn/*
// @include  https://item.feifei.cn/*
// @include  http://*.feifei.com/*
// @include  https://*.feifei.com/*
// @include  http://guang.com/*
// @include  https://guang.com/*
// @include  http://*.haitaocheng.com/*
// @include  https://*.haitaocheng.com/*
// @include  http://*.rrs.com/*
// @include  https://*.rrs.com/*
// @include  http://*.rrsjk.com/*
// @include  https://*.rrsjk.com/*
// @include  http://shop.ccb.com/*
// @include  https://shop.ccb.com/*
// @include  http://*.meilishuo.com/*
// @include  https://*.meilishuo.com/*
// @include  http://item.meilishuo.com/*
// @include  https://item.meilishuo.com/*
// @include  http://*.mogujie.com/*
// @include  https://*.mogujie.com/*
// @include  http://shop.mogu.com/*
// @include  https://shop.mogu.com/*
// @include  http://shop.mogujie.com/*
// @include  https://shop.mogujie.com/*
// @include  http://shop.coolpad.com/*
// @include  https://shop.coolpad.com/*
// @include  http://shop.coolpad.cn/*
// @include  https://shop.coolpad.cn/*
// @include  http://*.yiguo.com/*
// @include  https://*.yiguo.com/*
// @include  http://item.wanggou.com/*
// @include  https://item.wanggou.com/*
// @include  http://mall.jia.com/*
// @include  https://mall.jia.com/*
// @include  http://*.jiumei.com/*
// @include  https://*.jiumei.com/*
// @include  http://weigou.baidu.com/*
// @include  https://weigou.baidu.com/*
// @include  http://shop.letv.com/*
// @include  https://shop.letv.com/*
// @include  http://*.xiaomi.com/*
// @include  https://*.xiaomi.com/*
// @include  http://item.mi.com/*
// @include  https://item.mi.com/*
// @include  http://*.mi.com/*
// @include  https://*.mi.com/*
// @include  http://*.handu.com/*
// @include  https://*.handu.com/*
// @include  http://*.yummy77.com/*
// @include  https://*.yummy77.com/*
// @include  http://*.fruitday.com/*
// @include  https://*.fruitday.com/*
// @include  http://*.benlai.com/*
// @include  https://*.benlai.com/*
// @include  http://taoshu.com/*
// @include  https://taoshu.com/*
// @include  http://*.meilele.com/*
// @include  https://*.meilele.com/*
// @include  http://*.gjw.com/*
// @include  https://*.gjw.com/*
// @include  http://*.oneplus.com/*
// @include  https://*.oneplus.com/*
// @include  http://store.apple.com/*
// @include  https://store.apple.com/*
// @include  http://*.apple.com/*
// @include  https://*.apple.com/*
// @include  http://*.apple.com.cn/*
// @include  https://*.apple.com.cn/*
// @include  http://*.j1.com/*
// @include  https://*.j1.com/*
// @include  http://miao.j1.com/*
// @include  https://miao.j1.com/*
// @include  http://*.zzl365.com/*
// @include  https://*.zzl365.com/*
// @include  http://mobile.139shop.com/*
// @include  https://mobile.139shop.com/*
// @include  http://139shop.com/*
// @include  https://139shop.com/*
// @include  http://*.yiwugou.com/*
// @include  https://*.yiwugou.com/*
// @include  http://*.zhiwo.com/*
// @include  https://*.zhiwo.com/*
// @include  http://*.miqi.cn/*
// @include  https://*.miqi.cn/*
// @include  http://*.miqi.cn/*
// @include  https://*.miqi.cn/*
// @include  http://*.camel.com.cn/*
// @include  https://*.camel.com.cn/*
// @include  http://*.kuaishubao.com/*
// @include  https://*.kuaishubao.com/*
// @include  http://*.juegg.com/*
// @include  https://*.juegg.com/*
// @include  http://mall.10010.com/*
// @include  https://mall.10010.com/*
// @include  http://*.wowsai.com/*
// @include  https://*.wowsai.com/*
// @include  http://*.tianpin.com/*
// @include  https://*.tianpin.com/*
// @include  http://*.tootoo.cn/*
// @include  https://*.tootoo.cn/*
// @include  http://item.minshengec.com/*
// @include  https://item.minshengec.com/*
// @include  http://*.sfbest.com/*
// @include  https://*.sfbest.com/*
// @include  http://ht.sfbest.hk/*
// @include  https://ht.sfbest.hk/*
// @include  http://shop.lenovo.com.cn/*
// @include  https://shop.lenovo.com.cn/*
// @include  http://*.lenovo.com.cn/*
// @include  https://*.lenovo.com.cn/*
// @include  http://shop.lenovomobile.com/*
// @include  https://shop.lenovomobile.com/*
// @include  http://*.lenovomobile.com/*
// @include  https://*.lenovomobile.com/*
// @include  http://*.lenovo.com.cn/*
// @include  https://*.lenovo.com.cn/*
// @include  http://thinkpad.lenovo.com.cn/*
// @include  https://thinkpad.lenovo.com.cn/*
// @include  http://*.vmall.com/*
// @include  https://*.vmall.com/*
// @include  http://*.ihush.com/*
// @include  https://*.ihush.com/*
// @include  http://*.fclub.cn/*
// @include  https://*.fclub.cn/*
// @include  http://item.yohobuy.com/*
// @include  https://item.yohobuy.com/*
// @include  http://*.yohobuy.com/*
// @include  https://*.yohobuy.com/*
// @include  http://*.fclub.cn/*
// @include  https://*.fclub.cn/*
// @include  http://ju.taobao.com/*
// @include  https://ju.taobao.com/*
// @include  http://*.tmall.com/*
// @include  https://*.tmall.com/*
// @include  http://detail.liangxinyao.com/*
// @include  https://detail.liangxinyao.com/*
// @include  http://world.tmall.com/*
// @include  https://world.tmall.com/*
// @include  http://detail.tmall.hk/*
// @include  https://detail.tmall.hk/*
// @include  http://*.taobao.com/*
// @include  https://*.taobao.com/*
// @include  http://2.taobao.com/*
// @include  https://2.taobao.com/*
// @include  http://ai.taobao.com/*
// @include  https://ai.taobao.com/*
// @include  http://chaoshi.detail.tmall.com/*
// @include  https://chaoshi.detail.tmall.com/*
// @include  http://detail.ju.taobao.com/*
// @include  https://detail.ju.taobao.com/*
// @include  http://*.vipshop.com/*
// @include  https://*.vipshop.com/*
// @include  http://*.vip.com/*
// @include  https://*.vip.com/*
// @include  http://tuan.lefeng.com/*
// @include  https://tuan.lefeng.com/*
// @include  http://*.lefeng.com/*
// @include  https://*.lefeng.com/*
// @include  http://*.jxdyf.com/*
// @include  https://*.jxdyf.com/*
// @include  http://*.jxdyf.com/*
// @include  https://*.jxdyf.com/*
// @include  http://*.tnice.com/*
// @include  https://*.tnice.com/*
// @include  http://auction1.paipai.com/*
// @include  https://auction1.paipai.com/*
// @include  http://item.xinbaigo.com/*
// @include  https://item.xinbaigo.com/*
// @include  http://*.orbis.com.cn/*
// @include  https://*.orbis.com.cn/*
// @include  http://*.sfht.com/*
// @include  https://*.sfht.com/*
// @include  http://*.d1.com.cn/*
// @include  https://*.d1.com.cn/*
// @include  http://*.chazuo.com/*
// @include  https://*.chazuo.com/*
// @include  http://*.u1baby.com/*
// @include  https://*.u1baby.com/*
// @include  http://*.homevv.com/*
// @include  https://*.homevv.com/*
// @include  http://*.paixie.net/*
// @include  https://*.paixie.net/*
// @include  http://tuan.paixie.net/*
// @include  https://tuan.paixie.net/*
// @include  http://faxian.paixie.net/*
// @include  https://faxian.paixie.net/*
// @include  http://*.tao3c.com/*
// @include  https://*.tao3c.com/*
// @include  http://*.zm7.cn/*
// @include  https://*.zm7.cn/*
// @include  http://s.etao.com/*
// @include  https://s.etao.com/*
// @include  http://product.pchouse.com.cn/*
// @include  https://product.pchouse.com.cn/*
// @include  http://buy.daphne.cn/*
// @include  https://buy.daphne.cn/*
// @include  http://*.lucemall.com.cn/*
// @include  https://*.lucemall.com.cn/*
// @include  http://*.easy361.com/*
// @include  https://*.easy361.com/*
// @include  http://item.360hqb.com/*
// @include  https://item.360hqb.com/*
// @include  http://q.360hqb.com/*
// @include  https://q.360hqb.com/*
// @include  http://*.goujiuwang.com/*
// @include  https://*.goujiuwang.com/*
// @include  http://*.huimai365.com/*
// @include  https://*.huimai365.com/*
// @include  http://*.jiuxian.com/*
// @include  https://*.jiuxian.com/*
// @include  http://*.winenice.com/*
// @include  https://*.winenice.com/*
// @include  http://*.yesmywine.com/*
// @include  https://*.yesmywine.com/*
// @include  http://mall.yesmywine.com/*
// @include  https://mall.yesmywine.com/*
// @include  http://*.banggo.com/*
// @include  https://*.banggo.com/*
// @include  http://ploy.banggo.com/*
// @include  https://ploy.banggo.com/*
// @include  http://*.yanyue.cn/*
// @include  https://*.yanyue.cn/*
// @include  http://*.bearbuy.com.cn/*
// @include  https://*.bearbuy.com.cn/*
// @include  http://*.amazon.cn/*
// @include  https://*.amazon.cn/*
// @include  http://*.amazon.com/*
// @include  https://*.amazon.com/*
// @include  http://*.amazon.co.uk/*
// @include  https://*.amazon.co.uk/*
// @include  http://*.amazon.de/*
// @include  https://*.amazon.de/*
// @include  http://*.amazon.co.jp/*
// @include  https://*.amazon.co.jp/*
// @include  http://*.amazon.fr/*
// @include  https://*.amazon.fr/*
// @include  http://*.amazon.ca/*
// @include  https://*.amazon.ca/*
// @include  http://*.amazon.it/*
// @include  https://*.amazon.it/*
// @include  http://*.amazon.es/*
// @include  https://*.amazon.es/*
// @include  http://*.dangdang.com/*
// @include  https://*.dangdang.com/*
// @include  http://*.globaldangdang.hk/*
// @include  https://*.globaldangdang.hk/*
// @include  http://z.jd.com/*
// @include  https://z.jd.com/*
// @include  http://item.jd.com/*
// @include  https://item.jd.com/*
// @include  http://i-item.jd.com/*
// @include  https://i-item.jd.com/*
// @include  http://item.paipai.com/*
// @include  https://item.paipai.com/*
// @include  http://item.yiyaojd.com/*
// @include  https://item.yiyaojd.com/*
// @include  http://item.jkcsjd.com/*
// @include  https://item.jkcsjd.com/*
// @include  http://item.jd.hk/*
// @include  https://item.jd.hk/*
// @include  http://paimai.jd.com/*
// @include  https://paimai.jd.com/*
// @include  http://*.jd.com/*
// @include  https://*.jd.com/*
// @include  http://*.jd.hk/*
// @include  https://*.jd.hk/*
// @include  http://*.360buy.com/*
// @include  https://*.360buy.com/*
// @include  http://re.jd.com/*
// @include  https://re.jd.com/*
// @include  http://auction.jd.com/*
// @include  https://auction.jd.com/*
// @include  http://club.jd.com/*
// @include  https://club.jd.com/*
// @include  http://*.360top.com/*
// @include  https://*.360top.com/*
// @include  http://detail.zol.com.cn/*
// @include  https://detail.zol.com.cn/*
// @include  http://dealer.zol.com.cn/*
// @include  https://dealer.zol.com.cn/*
// @include  http://*.zol.com/*
// @include  https://*.zol.com/*
// @include  http://*.fglady.cn/*
// @include  https://*.fglady.cn/*
// @include  http://*.ouku.com/*
// @include  https://*.ouku.com/*
// @include  http://*.newegg.comn/*
// @include  https://*.newegg.comn/*
// @include  http://zhadan.newegg.cn/*
// @include  https://zhadan.newegg.cn/*
// @include  http://tuan.newegg.cn/*
// @include  https://tuan.newegg.cn/*
// @include  http://product.kimiss.com/*
// @include  https://product.kimiss.com/*
// @include  http://*.redbaby.com.cn/*
// @include  https://*.redbaby.com.cn/*
// @include  http://product.m18.com/*
// @include  https://product.m18.com/*
// @include  http://list.m18.com/*
// @include  https://list.m18.com/*
// @include  http://*.m18.com/*
// @include  https://*.m18.com/*
// @include  http://*.w1.cn/*
// @include  https://*.w1.cn/*
// @include  http://*.ashford.com/*
// @include  https://*.ashford.com/*
// @include  http://*.sephora.cn/*
// @include  https://*.sephora.cn/*
// @include  http://*.lafaso.com/*
// @include  https://*.lafaso.com/*
// @include  http://*.s.cn/*
// @include  https://*.s.cn/*
// @include  http://*.51buy.com/*
// @include  https://*.51buy.com/*
// @include  http://*.51buy.cn/*
// @include  https://*.51buy.cn/*
// @include  http://*.okbuy.com/*
// @include  https://*.okbuy.com/*
// @include  http://*.letao.com/*
// @include  https://*.letao.com/*
// @include  http://*.buy007.com/*
// @include  https://*.buy007.com/*
// @include  http://*.taoxie.com/*
// @include  https://*.taoxie.com/*
// @include  http://ju.suning.com/*
// @include  https://ju.suning.com/*
// @include  http://item.suning.com/*
// @include  https://item.suning.com/*
// @include  http://*.suning.com/*
// @include  https://*.suning.com/*
// @include  http://*.suning.cn/*
// @include  https://*.suning.cn/*
// @include  http://qiang.suning.com/*
// @include  https://qiang.suning.com/*
// @include  http://product.suning.com/*
// @include  https://product.suning.com/*
// @include  http://*.suning.com/*
// @include  https://*.suning.com/*
// @include  http://*.coo8.com/*
// @include  https://*.coo8.com/*
// @include  http://*.lusen.com/*
// @include  https://*.lusen.com/*
// @include  http://*.lusen.com/*
// @include  https://*.lusen.com/*
// @include  http://item.gome.com.cn/*
// @include  https://item.gome.com.cn/*
// @include  http://tao.gome.com.cn/*
// @include  https://tao.gome.com.cn/*
// @include  http://q.gome.com.cn/*
// @include  https://q.gome.com.cn/*
// @include  http://tuan.gome.com.cn/*
// @include  https://tuan.gome.com.cn/*
// @include  http://*.gomehome.com/*
// @include  https://*.gomehome.com/*
// @include  http://*.gome.com.cn/*
// @include  https://*.gome.com.cn/*
// @include  http://*.yhd.com/*
// @include  https://*.yhd.com/*
// @include  http://*.yihaodian.com/*
// @include  https://*.yihaodian.com/*
// @include  http://*.1mall.com/*
// @include  https://*.1mall.com/*
// @include  http://try.yhd.com/*
// @include  https://try.yhd.com/*
// @include  http://*.womai.com/*
// @include  https://*.womai.com/*
// @include  http://*.leyou.com.cn/*
// @include  https://*.leyou.com.cn/*
// @include  http://leleshan.leyou.com.cn/*
// @include  https://leleshan.leyou.com.cn/*
// @include  http://*.shopin.net/*
// @include  https://*.shopin.net/*
// @include  http://*.xiu.com/*
// @include  https://*.xiu.com/*
// @include  http://outlets.xiu.com/*
// @include  https://outlets.xiu.com/*
// @include  http://ferragamo.xiu.com/*
// @include  https://ferragamo.xiu.com/*
// @include  http://tuan.xiu.com/*
// @include  https://tuan.xiu.com/*
// @include  http://item.mbaobao.com/*
// @include  https://item.mbaobao.com/*
// @include  http://*.mbaobao.com/*
// @include  https://*.mbaobao.com/*
// @include  http://item.vjia.com/*
// @include  https://item.vjia.com/*
// @include  http://*.7cv.com/*
// @include  https://*.7cv.com/*
// @include  http://*.qinqinbaby.com/*
// @include  https://*.qinqinbaby.com/*
// @include  http://*.chunshuitang.com/*
// @include  https://*.chunshuitang.com/*
// @include  http://*.x.com.cn/*
// @include  https://*.x.com.cn/*
// @include  http://*.guopi.com/*
// @include  https://*.guopi.com/*
// @include  http://*.no5.com.cn/*
// @include  https://*.no5.com.cn/*
// @include  http://*.sasa.com/*
// @include  https://*.sasa.com/*
// @include  http://*.sasa.com/*
// @include  https://*.sasa.com/*
// @include  http://*.hksasa.cn/*
// @include  https://*.hksasa.cn/*
// @include  http://*.dhc.net.cn/*
// @include  https://*.dhc.net.cn/*
// @include  http://*.9dadao.com/*
// @include  https://*.9dadao.com/*
// @include  http://*.360kxr.com/*
// @include  https://*.360kxr.com/*
// @include  http://*.m6go.com/*
// @include  https://*.m6go.com/*
// @include  http://*.likeface.com/*
// @include  https://*.likeface.com/*
// @include  http://*.qxian.com/*
// @include  https://*.qxian.com/*
// @include  http://*.didamall.com/*
// @include  https://*.didamall.com/*
// @include  http://*.yaodian100.com/*
// @include  https://*.yaodian100.com/*
// @include  http://*.yaofang.cn/*
// @include  https://*.yaofang.cn/*
// @include  http://*.lijiababy.com.cn/*
// @include  https://*.lijiababy.com.cn/*
// @include  http://99read.com/*
// @include  https://99read.com/*
// @include  http://product.china-pub.com/*
// @include  https://product.china-pub.com/*
// @include  http://*.bookschina.com/*
// @include  https://*.bookschina.com/*
// @include  http://*.efeihu.com/*
// @include  https://*.efeihu.com/*
// @include  http://tuan.efeihu.com/*
// @include  https://tuan.efeihu.com/*
// @include  http://*.360mart.com/*
// @include  https://*.360mart.com/*
// @include  http://*.yintai.com/*
// @include  https://*.yintai.com/*
// @include  http://item.yintai.com/*
// @include  https://item.yintai.com/*
// @include  http://*.quwan.com/*
// @include  https://*.quwan.com/*
// @include  http://*.urcosme.com/*
// @include  https://*.urcosme.com/*
// @include  http://*.strawberrynet.com/*
// @include  https://*.strawberrynet.com/*
// @include  http://*.strawberrynet.com/*
// @include  https://*.strawberrynet.com/*
// @include  http://*.luce.com.cn/*
// @include  https://*.luce.com.cn/*
// @include  http://*.k121.com/*
// @include  https://*.k121.com/*
// @include  http://*.happigo.com/*
// @include  https://*.happigo.com/*
// @include  http://mall.happigo.com/*
// @include  https://mall.happigo.com/*
// @include  http://*.gap.cn/*
// @include  https://*.gap.cn/*
// @include  http://*.misslele.com/*
// @include  https://*.misslele.com/*
// @include  http://*.5lux.com/*
// @include  https://*.5lux.com/*
// @include  http://*.5lux.com/*
// @include  https://*.5lux.com/*
// @include  http://*.xiaozhuren.com/*
// @include  https://*.xiaozhuren.com/*
// @include  http://*.all3c.com/*
// @include  https://*.all3c.com/*
// @include  http://*.idaphne.com/*
// @include  https://*.idaphne.com/*
// @include  http://product.pcbaby.com.cn/*
// @include  https://product.pcbaby.com.cn/*
// @include  http://*.binggo.com/*
// @include  https://*.binggo.com/*
// @include  http://*.tiantian.com/*
// @include  https://*.tiantian.com/*
// @include  http://tuan.tiantian.com/*
// @include  https://tuan.tiantian.com/*
// @include  http://*.xiji.com/*
// @include  https://*.xiji.com/*
// @include  http://*.xijie.com/*
// @include  https://*.xijie.com/*
// @include  http://mall.jumei.com/*
// @include  https://mall.jumei.com/*
// @include  http://pop.jumei.com/*
// @include  https://pop.jumei.com/*
// @include  http://*.jumei.com/*
// @include  https://*.jumei.com/*
// @include  http://item.jumei.com/*
// @include  https://item.jumei.com/*
// @include  http://*.jumeiglobal.com/*
// @include  https://*.jumeiglobal.com/*
// @include  http://item.jumeiglobal.com/*
// @include  https://item.jumeiglobal.com/*
// @include  http://buy.caomeipai.com/*
// @include  https://buy.caomeipai.com/*
// @include  http://*.dahuozhan.com/*
// @include  https://*.dahuozhan.com/*
// @include  http://*.dazhe.cn/*
// @include  https://*.dazhe.cn/*
// @include  http://*.huolida.com/*
// @include  https://*.huolida.com/*
// @include  http://*.12dian.com/*
// @include  https://*.12dian.com/*
// @include  http://*.yougou.com/*
// @include  https://*.yougou.com/*
// @include  http://*.yougou.com/*
// @include  https://*.yougou.com/*
// @include  http://*.111.com.cn/*
// @include  https://*.111.com.cn/*
// @include  http://*.daoyao.com/*
// @include  https://*.daoyao.com/*
// @include  http://*.jianke.com/*
// @include  https://*.jianke.com/*
// @include  http://*.360kad.com/*
// @include  https://*.360kad.com/*
// @include  http://*.lbxcn.com/*
// @include  https://*.lbxcn.com/*
// @include  http://book.douban.com/*
// @include  https://book.douban.com/*
// @include  http://dongxi.douban.com/*
// @include  https://dongxi.douban.com/*
// @include  http://product.it168.com/*
// @include  https://product.it168.com/*
// @include  http://product.pconline.com.cn/*
// @include  https://product.pconline.com.cn/*
// @include  http://product.pcpop.com/*
// @include  https://product.pcpop.com/*
// @include  http://cosme.pclady.com.cn/*
// @include  https://cosme.pclady.com.cn/*
// @include  http://brand.yoka.com/*
// @include  https://brand.yoka.com/*
// @include  http://detail.55bbs.com/*
// @include  https://detail.55bbs.com/*
// @include  http://hzp.onlylady.com/*
// @include  https://hzp.onlylady.com/*
// @include  http://*.24dq.com/*
// @include  https://*.24dq.com/*
// @include  http://*.muyingzhijia.com/*
// @include  https://*.muyingzhijia.com/*
// @include  http://item.muyingzhijia.com/*
// @include  https://item.muyingzhijia.com/*
// @include  http://*.houmart.com/*
// @include  https://*.houmart.com/*
// @include  http://*.onlyts.cn/*
// @include  https://*.onlyts.cn/*
// @include  http://*.winxuan.com/*
// @include  https://*.winxuan.com/*
// @include  http://item.winxuan.com/*
// @include  https://item.winxuan.com/*
// @include  http://detail.bookuu.com/*
// @include  https://detail.bookuu.com/*
// @include  http://e.bookuu.com/*
// @include  https://e.bookuu.com/*
// @include  http://wenju.bookuu.com/*
// @include  https://wenju.bookuu.com/*
// @include  http://book.beifabook.com/*
// @include  https://book.beifabook.com/*
// @include  http://product.yesky.com/*
// @include  https://product.yesky.com/*
// @include  http://product.pchome.net/*
// @include  https://product.pchome.net/*
// @include  http://product.enet.com.cn/*
// @include  https://product.enet.com.cn/*
// @include  http://*.ruiyi.com/*
// @include  https://*.ruiyi.com/*
// @include  http://*.ruiyi.cn/*
// @include  https://*.ruiyi.cn/*
// @include  http://*.rayi.com/*
// @include  https://*.rayi.com/*
// @include  http://*.rayi.cn/*
// @include  https://*.rayi.cn/*
// @include  http://*.nop.cn/*
// @include  https://*.nop.cn/*
// @include  http://product.imobile.com.cn/*
// @include  https://product.imobile.com.cn/*
// @include  http://product.cnmo.com/*
// @include  https://product.cnmo.com/*
// @include  http://phone.shouji.com.cn/*
// @include  https://phone.shouji.com.cn/*
// @include  http://product.tompda.com/*
// @include  https://product.tompda.com/*
// @include  http://*.3533.com/*
// @include  https://*.3533.com/*
// @include  http://product.intozgc.com/*
// @include  https://product.intozgc.com/*
// @include  http://product.chinabyte.com/*
// @include  https://product.chinabyte.com/*
// @include  http://app.tech.ifeng.com/*
// @include  https://app.tech.ifeng.com/*
// @include  http://www2.xitek.com/*
// @include  https://www2.xitek.com/*
// @include  http://product.imp3.net/*
// @include  https://product.imp3.net/*
// @include  http://*.menglu.com/*
// @include  https://*.menglu.com/*
// @include  http://*.moonbasa.com/*
// @include  https://*.moonbasa.com/*
// @include  http://*.ing2ing.com/*
// @include  https://*.ing2ing.com/*
// @include  http://*.qjherb.com/*
// @include  https://*.qjherb.com/*
// @include  http://*.korirl.com/*
// @include  https://*.korirl.com/*
// @include  http://*.alaves.com/*
// @include  https://*.alaves.com/*
// @include  http://*.0-100s.com/*
// @include  https://*.0-100s.com/*
// @include  http://*.cherriespie.com/*
// @include  https://*.cherriespie.com/*
// @include  http://*.clafield.com/*
// @include  https://*.clafield.com/*
// @include  http://*.baoyeah.com/*
// @include  https://*.baoyeah.com/*
// @include  http://*.suorang.com/*
// @include  https://*.suorang.com/*
// @include  http://*.monteamor.com/*
// @include  https://*.monteamor.com/*
// @include  http://*.rutisher.com/*
// @include  https://*.rutisher.com/*
// @include  http://*.keede.com/*
// @include  https://*.keede.com/*
// @include  http://*.kede.com/*
// @include  https://*.kede.com/*
// @include  http://*.vancl.com/*
// @include  https://*.vancl.com/*
// @include  http://*.dazhongdianqi.com.cn/*
// @include  https://*.dazhongdianqi.com.cn/*
// @include  http://*.skinstorechina.com/*
// @include  https://*.skinstorechina.com/*
// @include  http://item.buy.qq.com/*
// @include  https://item.buy.qq.com/*
// @include  http://*.zol.com.cn/*
// @include  https://*.zol.com.cn/*
// @include  http://*.pconline.com.cn/*
// @include  https://*.pconline.com.cn/*
// @include  http://*.yesky.com/*
// @include  https://*.yesky.com/*
// @include  http://*.it168.com/*
// @include  https://*.it168.com/*
// @include  http://*.pcpop.com/*
// @include  https://*.pcpop.com/*
// @include  http://*.pchome.net/*
// @include  https://*.pchome.net/*
// @include  http://*.139shop.com/*
// @include  https://*.139shop.com/*
// @include  http://*.milier.com/*
// @include  https://*.milier.com/*
// @include  http://*.sportica.cn/*
// @include  https://*.sportica.cn/*
// @include  http://*.zhenpin.com/*
// @include  https://*.zhenpin.com/*
// @include  http://*.gaojie.com/*
// @include  https://*.gaojie.com/*
// @include  http://*.naruko.com.cn/*
// @include  https://*.naruko.com.cn/*
// @include  http://*.vivian.com/*
// @include  https://*.vivian.com/*
// @include  http://*.vivian.cn/*
// @include  https://*.vivian.cn/*
// @include  http://*.masamaso.com/*
// @include  https://*.masamaso.com/*
// @include  http://*.masamaso.cn/*
// @include  https://*.masamaso.cn/*
// @include  http://*.linkmasa.com/*
// @include  https://*.linkmasa.com/*
// @include  http://*.linkmasa.cn/*
// @include  https://*.linkmasa.cn/*
// @include  http://item.secoo.com/*
// @include  https://item.secoo.com/*
// @include  http://paimai.secoo.com/*
// @include  https://paimai.secoo.com/*
// @include  http://sale.secoo.com/*
// @include  https://sale.secoo.com/*
// @include  http://*.ehaier.com/*
// @include  https://*.ehaier.com/*
// @include  http://qiji.ehaier.com/*
// @include  https://qiji.ehaier.com/*
// @include  http://*.handuyishe.com/*
// @include  https://*.handuyishe.com/*
// @include  http://*.wbiao.cn/*
// @include  https://*.wbiao.cn/*
// @include  http://*.shangpin.com/*
// @include  https://*.shangpin.com/*
// @include  http://*.shangpin.hk/*
// @include  https://*.shangpin.hk/*
// @include  http://*.pba.cn/*
// @include  https://*.pba.cn/*
// @include  http://*.metromall.cn/*
// @include  https://*.metromall.cn/*
// @include  http://*.lizi.com/*
// @include  https://*.lizi.com/*
// @include  http://*.kadang.com/*
// @include  https://*.kadang.com/*
// @include  http://*.aimer.com.cn/*
// @include  https://*.aimer.com.cn/*
// @include  http://*.lamiu.com/*
// @include  https://*.lamiu.com/*
// @include  http://*.esprit.cn/*
// @include  https://*.esprit.cn/*
// @include  http://*.liebo.com/*
// @include  https://*.liebo.com/*
// @include  http://*.wangjiu.com/*
// @include  https://*.wangjiu.com/*
// @include  http://*.xifuquan.com/*
// @include  https://*.xifuquan.com/*
// @include  http://*.189.cn/*
// @include  https://*.189.cn/*
// @include  http://*.hicdma.com/*
// @include  https://*.hicdma.com/*
// @include  http://*.e100.cn/*
// @include  https://*.e100.cn/*
// @include  http://store.samsung.com/*
// @include  https://store.samsung.com/*
// @include  http://store.meizu.com/*
// @include  https://store.meizu.com/*
// @include  http://detail.meizu.com/*
// @include  https://detail.meizu.com/*
// @include  http://b2c.958shop.com/*
// @include  https://b2c.958shop.com/*
// @include  http://*.okhqb.com/*
// @include  https://*.okhqb.com/*
// @include  http://*.ztedevice.com.cn/*
// @include  https://*.ztedevice.com.cn/*
// @include  http://*.daling.com/*
// @include  https://*.daling.com/*
// @include  http://item.showjoy.com/*
// @include  https://item.showjoy.com/*
// @include  http://*.ocj.com.cn/*
// @include  https://*.ocj.com.cn/*
// @include  http://*.ocj.kr/*
// @include  https://*.ocj.kr/*
// @include  http://*.lvyoumall.com/*
// @include  https://*.lvyoumall.com/*
// @include  http://*.kjt.com/*
// @include  https://*.kjt.com/*
// @include  http://store.logitech.com.cn/*
// @include  https://store.logitech.com.cn/*
// @include  http://shop.boohee.com/*
// @include  https://shop.boohee.com/*
// @include  http://*.meici.com/*
// @include  https://*.meici.com/*
// @include  http://*.beibei.com/*
// @include  https://*.beibei.com/*
// @include  http://store.nike.com/*
// @include  https://store.nike.com/*
// @include  http://*.nike.com/*
// @include  https://*.nike.com/*
// @include  http://*.fengqu.com/*
// @include  https://*.fengqu.com/*
// @include  http://*.mei.com/*
// @include  https://*.mei.com/*
// @include  http://*.vsigo.cn/*
// @include  https://*.vsigo.cn/*
// @include  http://*.sundan.com/*
// @include  https://*.sundan.com/*
// @include  http://hd.zazhipu.com/*
// @include  https://hd.zazhipu.com/*
// @include  http://*.microsoftstore.com.cn/*
// @include  https://*.microsoftstore.com.cn/*
// @include  http://*.xgdq.com/*
// @include  https://*.xgdq.com/*
// @include  http://*.xtep.com.cn/*
// @include  https://*.xtep.com.cn/*
// @include  http://*.xtep.com.cn/*
// @include  https://*.xtep.com.cn/*
// @include  http://*.staples.cn/*
// @include  https://*.staples.cn/*
// @include  http://mall.midea.com/*
// @include  https://mall.midea.com/*
// @include  http://*.midea.cn/*
// @include  https://*.midea.cn/*
// @include  http://www1.macys.com/*
// @include  https://www1.macys.com/*
// @include  http://cn.shopbop.com/*
// @include  https://cn.shopbop.com/*
// @include  http://*.hua.com/*
// @include  https://*.hua.com/*
// @include  http://shop.zhe800.com/*
// @include  https://shop.zhe800.com/*
// @include  http://*.cosme.com/*
// @include  https://*.cosme.com/*
// @include  http://*.diapers.com/*
// @include  https://*.diapers.com/*
// @include  http://*.windeln.de/*
// @include  https://*.windeln.de/*
// @include  http://*.windeln.com.cn/*
// @include  https://*.windeln.com.cn/*
// @include  http://*.escentual.com/*
// @include  https://*.escentual.com/*
// @include  http://*.biccamera.com/*
// @include  https://*.biccamera.com/*
// @include  http://*.esteelauder.com/*
// @include  https://*.esteelauder.com/*
// @include  http://*.saksfifthavenue.com/*
// @include  https://*.saksfifthavenue.com/*
// @include  http://*.thewatchery.com/*
// @include  https://*.thewatchery.com/*
// @include  http://item.tuhu.com/*
// @include  https://item.tuhu.com/*
// @include  http://item.tuhu.cn/*
// @include  https://item.tuhu.cn/*
// @include  http://eshop.htc.com/*
// @include  https://eshop.htc.com/*
// @include  http://roseonly.com.cn/*
// @include  https://roseonly.com.cn/*
// @include  http://*.taqu.cn/*
// @include  https://*.taqu.cn/*
// @include  http://shop.jx.189.cn/*
// @include  https://shop.jx.189.cn/*
// @include  http://*.bftv.com/*
// @include  https://*.bftv.com/*
// @include  http://*.axmall.com.au/*
// @include  https://*.axmall.com.au/*
// @include  http://*.lianjia.com/*
// @include  https://*.lianjia.com/*
// @include  http://*.ke.com/*
// @include  https://*.ke.com/*
// @include  http://*.5i5j.com/*
// @include  https://*.5i5j.com/*
// @include  http://*.lovo.cn/*
// @include  https://*.lovo.cn/*
// @include  https://plogin.m.jd.com/*
// @include  https://login.m.taobao.com/*
// @grant        none
// @namespace no
// @downloadURL https://update.greasyfork.org/scripts/436876/%E7%BD%91%E8%B4%AD%E6%AF%94%E4%BB%B7%E9%A2%86%E5%88%B8%E7%A5%9E%E5%99%A8%E2%80%94%E8%B4%AD%E7%89%A9%E5%85%9A%EF%BC%8C%E4%B8%8D%E4%BB%85%E8%87%AA%E5%8A%A8%E9%A2%86%E5%88%B8%E8%BF%98%E8%83%BD%E9%A2%9D%E5%A4%96%E9%A2%86%E5%8F%96%E8%A1%A5%E8%B4%B4%E7%BA%A2%E5%8C%85%EF%BC%8C365%E5%A4%A9%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%81%E5%90%8C%E6%AC%BE%E6%9B%B4%E4%BD%8E%E4%BB%B7%E3%80%81%E9%99%8D%E4%BB%B7%E6%8F%90%E9%86%92%E3%80%81%E4%BB%B7%E6%A0%BC%E4%BF%9D%E6%8A%A4%EF%BC%8C%E5%AE%98%E6%96%B9%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/436876/%E7%BD%91%E8%B4%AD%E6%AF%94%E4%BB%B7%E9%A2%86%E5%88%B8%E7%A5%9E%E5%99%A8%E2%80%94%E8%B4%AD%E7%89%A9%E5%85%9A%EF%BC%8C%E4%B8%8D%E4%BB%85%E8%87%AA%E5%8A%A8%E9%A2%86%E5%88%B8%E8%BF%98%E8%83%BD%E9%A2%9D%E5%A4%96%E9%A2%86%E5%8F%96%E8%A1%A5%E8%B4%B4%E7%BA%A2%E5%8C%85%EF%BC%8C365%E5%A4%A9%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%81%E5%90%8C%E6%AC%BE%E6%9B%B4%E4%BD%8E%E4%BB%B7%E3%80%81%E9%99%8D%E4%BB%B7%E6%8F%90%E9%86%92%E3%80%81%E4%BB%B7%E6%A0%BC%E4%BF%9D%E6%8A%A4%EF%BC%8C%E5%AE%98%E6%96%B9%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 357:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $imports = __webpack_require__(53095);
module.exports = function ($data) {
    'use strict';
    $data = $data || {};
    var $$out = '', $escape = $imports.$escape, extClass = $data.extClass, text = $data.text, qr = $data.qr, qrText = $data.qrText;
    $$out += '<div style="display: inline-flex; position: relative; vertical-align: middle;" class="gwd-middle-tmall ';
    $$out += $escape(extClass);
    $$out += '">\n  <img ';
    $$out += 'src="https://cdn.bijiago.com/images/extensions/activity/tmall-redpack-middle.png"';
    $$out += ' alt="" style="width: 17px; height: 19px;">\n  <span style="font-size: 13px; color: #ff471a; margin-left: 3px; font-weight: 600; font-family: \'Microsoft YaHei\', \'Arial\', \'SimSun\'; white-space: nowrap">';
    $$out += $escape(text);
    $$out += '</span>\n  <div class="gwd-qr-act">\n    <img class="gwd-act-qr-img" loading="lazy" src="';
    $$out += $escape(qr);
    $$out += '" alt="" style="width: 130px; height: 130px; margin-top: 7px">\n    <div style="margin-top: 5px; vertical-align: middle; font-size: 0; height: 14px; line-height: 14px; text-align: center; white-space: nowrap">\n      <span style="font-size: 12px; color: #ff1a78; font-weight: bold; margin-left: 15px">微信扫码</span>\n      <span style="margin-left: 3px; color: #070707; font-size: 12px; transform-origin: center left; transform: scale(0.8333); display: inline-block; white-space: nowrap">';
    $$out += $escape(qrText);
    $$out += '</span>\n    </div>\n  </div>\n</div>\n<style>\n  .gwd-middle-tmall {\n    height: 100%;\n    align-items: center;\n    justify-content: center;\n    justify-items: center;\n    width: 150px!important;\n    white-space: nowrap;\n  }\n\n  .gwd-middle-tmall:hover {\n      background: #fff3eb;\n  }\n\n  .gwd-qr-act {\n    display: none;\n    flex-direction: column;\n    position: absolute;\n    width: 144px;\n    height: 167px;\n    box-sizing: border-box;\n    border: 1px solid #ff471a;\n    background: #fff9f6;\n    top: 37px;\n    left: 50%;\n    align-items: center;\n    margin-left: -72px;\n    z-index: 999;\n  }\n\n  .gwd-middle-tmall:hover .gwd-qr-act {\n    display: flex;\n  }\n</style>\n';
    return $$out;
};

/***/ }),

/***/ 524:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var skuUtil_1 = __webpack_require__(90827);
exports["default"] = {
    data: function () {
        return {
            currentSelect: [],
            options: [],
            products: [],
            show: false,
            notNeedLogin: G.aliSite ? false : G.userLogin,
            limitReached: false,
        };
    },
    methods: {
        open: function () {
            (__webpack_require__(5300).log)('skuViewer', 'popupOpen');
            this.show = true;
            this.notNeedLogin = G.aliSite ? true : G.userLogin;
            if (!this.notNeedLogin) {
                (__webpack_require__(5300).log)('skuViewer', 'notLogin');
            }
            if (!this.options.length) {
                this.load();
            }
        },
        close: function () {
            this.show = false;
        },
        optionClick: function (pidx, oidx) {
            this.$set(this.currentSelect, pidx, oidx);
        },
        setOptions: function (options) {
            this.options = options;
            if (this.options.length > 2) {
                for (var i = 2; i < this.options.length; i++) {
                    this.currentSelect.push(0);
                }
            }
        },
        setProducts: function (products) {
            this.products = products;
        },
        getOptionPrice: function (prop) {
            var _this = this;
            var otherProps = {};
            this.topOptions.forEach(function (option, idx) {
                var selectedOption = option.options[_this.currentSelect[idx]];
                otherProps[option.name] = selectedOption.value;
            });
            var product = (0, skuUtil_1.selectProductBySkuProps)(__assign(__assign({}, prop), otherProps), this.products);
            if (product && product.length) {
                return product[0].price;
            }
            console.log('product not found', prop, this.products);
            return 0;
        },
        getOptionLink: function (prop) {
            var _this = this;
            var otherProps = {};
            this.topOptions.forEach(function (option, idx) {
                var selectedOption = option.options[_this.currentSelect[idx]];
                otherProps[option.name] = selectedOption.value;
            });
            var product = (0, skuUtil_1.selectProductBySkuProps)(__assign(__assign({}, prop), otherProps), this.products);
            if (product && product.length) {
                if (G.aliSite) {
                    return "https://item.taobao.com/item.htm?id=".concat(G.dp.dpId.split('-')[0], "&skuId=").concat(product[0].skuId);
                }
                return "https://item.jd.com/".concat(product[0].skuId, ".html");
            }
            // console.log('product not found', prop, this.products)
            return '';
        },
        secondOptionHasPrice: function (firstOption) {
            var _this = this;
            var optionPrices = this.secondOption.options.map(function (optionB) {
                var _a;
                return _this.getOptionPrice((_a = {}, _a[_this.firstOption.name] = firstOption.value, _a[_this.secondOption.name] = optionB.value, _a));
            });
            return optionPrices.some(function (price) { return price > 0; });
        },
        goLogin: function () {
            var u = encodeURIComponent(location.href);
            location.href = "https://www.gwdang.com/user/login?ext=1&from_url=".concat(u);
        },
        load: function () {
            return __awaiter(this, void 0, void 0, function () {
                var skuProps, productPrice, productPrice, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!G.aliSite) return [3 /*break*/, 2];
                            return [4 /*yield*/, (__webpack_require__(30888).waitForConditionFn)(function () {
                                    return !!G.aliSkuInfo;
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            skuProps = G.site === '360buy' ? (0, skuUtil_1.extractJdSkuProps)() : (0, skuUtil_1.extractAliSkuProps)(G.aliSkuInfo);
                            this.setOptions((0, skuUtil_1.reArangeSkuProps)(skuProps.filter(function (x) { return x.options.length > 1; })));
                            if (!G.aliSite) return [3 /*break*/, 3];
                            productPrice = (0, skuUtil_1.extractAliProductPrice)(G.aliSkuInfo);
                            this.setProducts(productPrice);
                            return [3 /*break*/, 6];
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, (0, skuUtil_1.extractJdProductPrice)()];
                        case 4:
                            productPrice = _a.sent();
                            this.setProducts(productPrice);
                            (__webpack_require__(5300).log)('skuViewer', 'loaded');
                            return [3 /*break*/, 6];
                        case 5:
                            e_1 = _a.sent();
                            console.error('get jd product price error', e_1);
                            if (e_1.message === 'limitReached') {
                                (__webpack_require__(5300).log)('skuViewer', 'limitReached');
                                this.limitReached = true;
                            }
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    },
    computed: {
        topOptions: function () {
            // Return all options except the first two
            if (this.options.length < 3) {
                return [];
            }
            return this.options.slice(2);
        },
        firstOption: function () {
            // Return the first option
            if (this.options.length > 0) {
                return this.options[0];
            }
            return null;
        },
        secondOption: function () {
            // Return the second option
            if (this.options.length > 1) {
                return this.options[1];
            }
            return null;
        }
    }
};


/***/ }),

/***/ 666:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(93503);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("2e0e5b2e", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 863:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ BarTrendInfovue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ BarTrendInfo)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=template&id=803e699c&scoped=true
var BarTrendInfovue_type_template_id_803e699c_scoped_true = __webpack_require__(96367);
;// ./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=template&id=803e699c&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=script&lang=js
var BarTrendInfovue_type_script_lang_js = __webpack_require__(90834);
;// ./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=script&lang=js
 /* harmony default export */ const PriceTrend_BarTrendInfovue_type_script_lang_js = (BarTrendInfovue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=style&index=0&id=803e699c&prod&scoped=true&lang=css
var BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css = __webpack_require__(97995);
var BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=style&index=0&id=803e699c&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const PriceTrend_BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css = ((BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css_default()) && (BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css_default()).locals ? (BarTrendInfovue_type_style_index_0_id_803e699c_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/PriceTrend/BarTrendInfo.vue?vue&type=style&index=0&id=803e699c&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/PriceTrend/BarTrendInfo.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  PriceTrend_BarTrendInfovue_type_script_lang_js,
  BarTrendInfovue_type_template_id_803e699c_scoped_true/* render */.XX,
  BarTrendInfovue_type_template_id_803e699c_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "803e699c",
  null
  
)

/* harmony default export */ const BarTrendInfo = (component.exports);

/***/ }),

/***/ 1123:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwd-img-same-item gwd-inline-column",
    class: {
      "gwd-bjg": _vm.isBjg
    },
    style: {
      "min-height": _vm.minHeight
    },
    attrs: {
      href: _vm.link,
      target: "_blank"
    }
  }, [_c("img", {
    attrs: {
      src: _vm.item.img,
      alt: "",
      onerror: "this.src = 'https://cdn.gwdang.com/plt_web/template/metro/images/dp/loading.png'"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-row",
    staticStyle: {
      "margin-top": "6px",
      "justify-content": "space-between",
      "align-items": "baseline"
    }
  }, [_c("Price", {
    attrs: {
      price: _vm.item.price,
      fontSize: 18,
      unit: _vm.unit
    }
  }), _vm._v(" "), _c("span", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.salesText && _vm.salesText !== "NaN",
      expression: "salesText && salesText !== 'NaN'"
    }],
    staticClass: "gwd-sales"
  }, [_vm._v(_vm._s(_vm.salesText) + _vm._s(_vm.item.dpId.endsWith("-3") || _vm.item.dpId.endsWith("-228") ? _vm.transText("评论") : _vm.transText("已售")))])], 1), _vm._v(" "), _c("div", {
    staticClass: "gwd-title",
    staticStyle: {
      "margin-top": "7px"
    }
  }, [_vm.item.self ? _c("span", {
    staticClass: "gwd-jd-self"
  }, [_vm._v(_vm._s(_vm.transText("自营")))]) : _vm._e(), _vm._v("\n      " + _vm._s(_vm.item.title) + "\n    ")]), _vm._v(" "), _c("div", {
    staticClass: "gwd-item-promos"
  }, _vm._l(_vm.item.promos, function (promo) {
    return _c("span", {
      key: promo.tag + promo.text
    }, [_vm._v(_vm._s(_vm.getPromoText(promo)))]);
  }), 0), _vm._v(" "), _c("span", {
    staticClass: "gwd-shop-name gwd-row gwd-align",
    staticStyle: {
      "min-height": "18px"
    }
  }, [_c("img", {
    staticClass: "gwd-favicon",
    attrs: {
      src: `https://cdn.gwdang.com/images/favicon/${_vm.siteId}.png`,
      alt: ""
    }
  }), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.item.shopName))])])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 1365:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_ts_loader_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(524);
/* harmony import */ var _node_modules_ts_loader_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_ts_loader_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _node_modules_ts_loader_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _node_modules_ts_loader_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_node_modules_ts_loader_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_0___default())); 

/***/ }),

/***/ 1373:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(26910);
__webpack_require__(3362);
const {
  default: MiniSameList
} = __webpack_require__(26787);
const extConsole = __webpack_require__(7129);
module.exports = {
  async init() {
    $('body > #gwd_mini_compare').remove();
    await (__webpack_require__(41761).met)('dpSlist');
    let price = await (__webpack_require__(41761).met)('NowPrice');
    if (G.dp.price && price > G.dp.price) {
      price = G.dp.price;
    }
    let items = G.dp.slist.filter(x => x.url_crc);
    let skuId = (__webpack_require__(60340).getParameterByName)('skuId');
    if (G.site === 'taobao' && window.Hub) {
      let sku = Hub.config.get('sku');
      skuId = sku.skuId;
    }
    if (skuId && G.allowBackgroundRequest) {
      // try {
      //   const tbHighValueSameItems = await require('common/thirdPartyApis/taobaoHighValueUserSameItem').get(G.dp.itemId, skuId)
      //   if (tbHighValueSameItems && tbHighValueSameItems.data && tbHighValueSameItems.data.result) {
      //     const newItems = (tbHighValueSameItems.data.result.filter(item => item.rebate).map(item => {
      //       item.is_tmall = item.shopTag.includes('XXXXXX-16')
      //       item.title = item.itemTitle
      //       item.price = item.zkPrice
      //       item.shop = item.shopName
      //       item.dpId = `${item.itemId}-${item.is_tmall ? '83': '123'}`
      //       return item
      //     }))
      //     items = items.concat(newItems)
      //   }
      // } catch (e) {
      //   console.error(e)
      // }
    }
    (__webpack_require__(41761).setMet)('miniItemList', items);
    const existedShops = [];
    let data = items.map(item => {
      item.site = item.is_tmall ? '83' : '123';
      item.view_price = item.price;
      item.shopName = item.shop;
      if (!item.dpId) {
        item.dpId = `${item.url_crc}-${item.site}`;
      }
      if (!item.soldNum) {
        item.soldNum = item.sales;
      }
      item.url = `${G.tb_server}/extension/qrpage?directLink=1&dp_id=${item.dpId}&title=${encodeURIComponent(item.title)}&price=${item.view_price}&shopName=${encodeURIComponent(item.shopName)}&img=${encodeURIComponent(item.img)}&sellAmount=${encodeURIComponent(item.soldNum)}&union=${G.union}`;
      return item;
    }).filter(item => {
      if (existedShops.includes(item.shopName)) {
        return false;
      }
      if (item.dpId.split('-')[0] === G.dp.dpId.split('-')[0]) {
        return false;
      }
      existedShops.push(item.shopName);
      return true;
    });
    data.sort((a, b) => a.view_price - b.view_price);
    let el = '#gwd_mini_compare';
    // if (G.from_device === 'bijiago' && !$(el).length) {
    //   el = document.createElement('div')
    //   el.style.borderRight = '1px solid #e6e9eb'
    //   $('.bjgext-mini-trend').after(el)
    //   $('.gwd-middle-tmall').remove()
    // }

    // data = [...data, ...data]
    // for (let i = 0; i < 18; i++) {
    //   data.push(data[0])
    // }
    if (G.aliUIVersion !== '0.2.55') {
      await (__webpack_require__(30888).waitForConditionFn)(() => !$('.miniPanel').length);
    }
    let miniBarEl;
    if (data.length) {
      const position = {};
      if (G.aliUIVersion !== '0.2.55') {
        await (__webpack_require__(60340).sleep)(100);
        await (__webpack_require__(30888).waitForConditionFn)(() => $(el).length);
        const bodyOffset = (__webpack_require__(60340).getBodyOffset)(el);

        // 这个仅作为占位，实际悬浮后的组件位于body下面
        let miniBarApp = new Vue({
          el: el,
          render: h => h(MiniSameList, {
            props: {
              data: data,
              pri: parseFloat(price),
              position: {}
            }
          })
        });
        miniBarEl = miniBarApp.$el;
        el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.top = bodyOffset.top + 'px';
        el.style.left = bodyOffset.left + 'px';
        document.body.appendChild(el);
        position.top = bodyOffset.top;
        position.left = bodyOffset.left;
        position.width = bodyOffset.width;
        position.height = bodyOffset.height;
      }
      // await require('common/commonUtil').sleep(100)
      const app = new Vue({
        el: el,
        data() {
          return {
            position: position
          };
        },
        render: h => h(MiniSameList, {
          props: {
            data: data,
            pri: parseFloat(price),
            position: position
          }
        }),
        mounted() {
          // when window resize, update position
          const posReset = () => {
            const bodyOffset = (__webpack_require__(60340).getBodyOffset)(miniBarEl);
            this.position.top = bodyOffset.top;
            this.position.left = bodyOffset.left;
            this.position.width = bodyOffset.width;
            this.position.height = bodyOffset.height;
          };
          window.addEventListener('resize', posReset);
          setTimeout(() => {
            posReset();
          }, 500);
        }
      });
      G.miniCompareApp = app;
    }
  },
  reset() {
    $('#gwd_mini_compare').remove();
    G.miniCompareApp = null;
  }
};

/***/ }),

/***/ 1717:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.show && (!_vm.notNeedLogin || _vm.products.length || _vm.limitReached),
      expression: "show && (!notNeedLogin || products.length || limitReached)"
    }],
    staticClass: "gwd-popup-bg",
    on: {
      click: _vm.close
    }
  }, [_c("div", {
    staticClass: "gwd-popup gwd-column gwd-align",
    on: {
      click: function ($event) {
        $event.stopPropagation();
      }
    }
  }, [_c("img", {
    staticStyle: {
      width: "24px",
      height: "24px",
      position: "absolute",
      right: "24px",
      top: "24px",
      cursor: "pointer"
    },
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/ai/close@2x.png",
      alt: ""
    },
    on: {
      click: _vm.close
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      height: "24px",
      "font-size": "20px",
      color: "#111",
      "font-weight": "bold",
      "margin-top": "22px"
    }
  }, [_vm._v("一键查多款式到手价-购物党比价\n    ")]), _vm._v(" "), _c("div", {
    staticStyle: {
      "margin-top": "8px",
      "font-size": "13px",
      color: "#999"
    }
  }, [_vm._v("价格仅供参考，以平台实际为准")]), _vm._v(" "), _c("hr", {
    staticStyle: {
      width: "100%",
      height: "1px",
      "background-color": "#E6E9EB",
      "margin-top": "18px",
      border: "none"
    }
  }), _vm._v(" "), _vm.notNeedLogin && this.products.length ? _c("div", {
    staticClass: "gwd-column gwd-content"
  }, [_vm._l(_vm.topOptions, function (prop, pidx) {
    return _c("div", {
      key: `opt-${pidx}`,
      staticClass: "gwd-row gwd-select"
    }, [_c("span", {
      staticClass: "gwd-label"
    }, [_vm._v(_vm._s(prop.name) + ":")]), _vm._v(" "), _c("div", {
      staticStyle: {
        flex: "1"
      }
    }, _vm._l(prop.options, function (option, oidx) {
      return _c("div", {
        key: `opt-${pidx}-${oidx}`,
        class: {
          "gwd-select-option": true,
          "gwd-select-option-active": _vm.currentSelect[pidx] === oidx
        },
        on: {
          click: function ($event) {
            return _vm.optionClick(pidx, oidx);
          }
        }
      }, [_vm._v("\n            " + _vm._s(option.value) + "\n          ")]);
    }), 0)]);
  }), _vm._v(" "), _vm._l(_vm.firstOption.options, function (option, idxA) {
    return _vm.firstOption && (_vm.secondOption ? _vm.secondOptionHasPrice(option) : _vm.getOptionPrice({
      [_vm.firstOption.name]: option.value
    })) ? _c(_vm.secondOption ? "div" : "a", {
      key: `p-opt-${idxA}`,
      tag: "component",
      staticClass: "gwd-column",
      class: {
        "gwd-first-option": true,
        "gwd-single": _vm.secondOption
      },
      attrs: {
        href: _vm.getOptionLink({
          [_vm.firstOption.name]: option.value
        }),
        target: "_blank"
      }
    }, [_c("div", {
      staticClass: "gwd-row gwd-align",
      staticStyle: {
        height: "52px"
      }
    }, [option.img ? _c("img", {
      staticClass: "gwd-option-img",
      attrs: {
        src: option.img,
        alt: ""
      }
    }) : _vm._e(), _vm._v(" "), _c("span", {
      staticStyle: {
        "font-size": "16px",
        color: "#333"
      }
    }, [_vm._v(_vm._s(option.value))]), _vm._v(" "), !_vm.secondOption ? [_c("div", {
      staticStyle: {
        flex: "1"
      }
    }), _vm._v(" "), _c("span", {
      staticStyle: {
        "font-weight": "bold",
        "font-size": "18px",
        color: "#e03024",
        "white-space": "nowrap"
      }
    }, [_vm._v("¥" + _vm._s(_vm.getOptionPrice({
      [_vm.firstOption.name]: option.value
    })))])] : _vm._e()], 2), _vm._v(" "), _vm.secondOption ? _c("div", _vm._l(_vm.secondOption.options, function (optionB, idxB) {
      return _vm.getOptionPrice({
        [_vm.firstOption.name]: option.value,
        [_vm.secondOption.name]: optionB.value
      }) ? _c("a", {
        key: `p-opt-${idxA}-${idxB}`,
        staticClass: "gwd-second-option gwd-inline-column gwd-align",
        attrs: {
          href: _vm.getOptionLink({
            [_vm.firstOption.name]: option.value,
            [_vm.secondOption.name]: optionB.value
          }),
          target: "_blank"
        }
      }, [_c("span", {
        staticStyle: {
          color: "#404547",
          "font-size": "14px",
          "line-height": "16px"
        }
      }, [_vm._v(_vm._s(optionB.value))]), _vm._v(" "), _c("span", {
        staticStyle: {
          color: "#e03024",
          "font-size": "16px",
          "margin-top": "6px",
          "line-height": "16px",
          "font-weight": "bold"
        }
      }, [_vm._v("¥" + _vm._s(_vm.getOptionPrice({
        [_vm.firstOption.name]: option.value,
        [_vm.secondOption.name]: optionB.value
      })))])]) : _vm._e();
    }), 0) : _vm._e()]) : _vm._e();
  })], 2) : _vm._e(), _vm._v(" "), !_vm.notNeedLogin ? _c("div", {
    staticClass: "gwd-column gwd-align gwd-login"
  }, [_c("div", {
    staticClass: "gwd-login-box gwd-column gwd-align"
  }, [_c("img", {
    staticStyle: {
      width: "413px",
      height: "219px",
      "margin-top": "20px"
    },
    attrs: {
      src: __webpack_require__(61749),
      alt: ""
    }
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), _c("button", {
    staticClass: "gwd-login-btn",
    on: {
      click: _vm.goLogin
    }
  }, [_vm._v("去登录")])])]) : _vm._e(), _vm._v(" "), _vm.limitReached ? _c("div", {
    staticClass: "gwd-column gwd-align gwd-limit-reached"
  }, [_c("img", {
    style: `width: 198px; height: 198px; margin-top: 75px;`,
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/ai/limitReached@2x.png",
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "16px",
      color: "#404547",
      "line-height": "22px",
      "margin-top": "-20px",
      "margin-bottom": "75px"
    }
  }, [_vm._v("今日次数已用完～明日再来吧")])]) : _vm._e()])]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "22px"
    }
  }, [_c("img", {
    staticStyle: {
      width: "18px",
      height: "18px"
    },
    attrs: {
      src: __webpack_require__(2151),
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "margin-left": "4px",
      color: "#333",
      "font-size": "16px",
      "font-weight": "bold"
    }
  }, [_vm._v("登录解锁多规格到手价，帮助您快速比较")])]);
}];
render._withStripped = true;

/***/ }),

/***/ 2131:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _Price = _interopRequireDefault(__webpack_require__(83007));
const util = __webpack_require__(30888);
var _default = exports.A = {
  components: {
    Price: _Price.default
  },
  props: ['item'],
  data() {
    return {
      isBjg: G.from_device === 'bijiago'
    };
  },
  methods: {
    transText: __webpack_require__(54600),
    getPromoText(promo) {
      if (promo.tag === "coupon" && promo.text.indexOf('减') > -1) {
        return promo.text.split('减')[1] + '元券';
      }
      return promo.text;
    }
  },
  computed: {
    unit() {
      return this.item.dpId.endsWith('-228') ? '$' : '¥';
    },
    link() {
      const isAli = this.item.dpId.endsWith('-83') || this.item.dpId.endsWith('-123');
      if (G.aliSite && isAli) {
        // append title, pic, shop, price
        const dpParams = `&title=${encodeURIComponent(this.item.title)}&img=${encodeURIComponent(this.item.img)}&shopName=${encodeURIComponent(this.item.shopName)}&price=${encodeURIComponent(this.item.price)}&sellAmount=${encodeURIComponent(this.salesText)}`;
        const domain = G.from_device === 'bijiago' ? 'bijiago' : 'gwdang';
        return `https://tb.${domain}.com/extension/qrpage?directLink=1&dp_id=${this.item.dpId}&from=img_search&union=${G.union}&from_device=${G.from_device}&position=extImgSame${dpParams}`;
        // return `https://item.taobao.com/item.htm?id=${this.item.dpId.replace('-83', '').replace('-123', '')}`
      }
      if (isAli) {
        return `${G.u_server}/redirect/tao?id=${this.item.dpId.replace('-83', '').replace('-123', '')}&from=img_search&union=${G.union}&from_device=${G.from_device}`;
      }
      let siteId = this.item.dpId.split('-')[1];
      if (siteId === '3') {
        return `${G.u_server}/redirect/common?dp_id=${this.item.dpId}&from=img_search&s=dm`;
      }
      return `${G.u_server}/union/go/?site_id=${siteId}&target_url=${encodeURIComponent(this.item.url)}&union=gwdang&column=img_search`;
      // if (this.item.dpId.endsWith('-370')) {
      //   return `https://item.taobao.com/item.htm?id=${this.item.dpId.replace('-83', '')}`
      // }
      // return `https://item.jd.com/${this.item.id}.html`
    },
    minHeight() {
      if (this.item.dpId.endsWith('-3')) {
        return '350px';
      }
      return '321px';
    },
    salesText() {
      return util.numberToString(this.item.salesAmount, 1);
    },
    siteId() {
      return this.item.dpId.split('-')[1];
    }
  }
};

/***/ }),

/***/ 3026:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61765);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("0c9213b4", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 3320:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-bjg-app[data-v-0650373c] {\n  width: 180px;\n  height: 122px;\n  background: linear-gradient(133deg, #FFFBF3 0%, #FFFDF2 100%);\n  border-radius: 12px;\n  margin-top: 58px;\n}\n.gwd-bjg-app .gwd-qr-container[data-v-0650373c] {\n  width: 59px;\n  height: 59px;\n  background: white;\n  position: relative;\n  margin-top: 10px;\n}\n", ""]);

// exports


/***/ }),

/***/ 3442:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _MemberCouponMixin = _interopRequireDefault(__webpack_require__(81507));
var _default = exports.A = {
  mixins: [_MemberCouponMixin.default]
};

/***/ }),

/***/ 3651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21094);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("83cdedb2", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 3851:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _ShaiDanPic = _interopRequireDefault(__webpack_require__(56283));
var _default = exports.A = {
  components: {
    ShaiDanPic: _ShaiDanPic.default
  },
  props: ['item'],
  mounted() {},
  computed: {
    displayPrice() {
      return (this.item.price / 100).toFixed(2).replace('.00', '');
    },
    displayDate() {
      return this.item.ptime.split('-').slice(1).join('-').split(' ')[0];
    }
  }
};

/***/ }),

/***/ 3912:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Share)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Share.vue?vue&type=template&id=43260888&scoped=true
var Sharevue_type_template_id_43260888_scoped_true = __webpack_require__(65417);
;// ./src/standard/module/components/Share.vue?vue&type=template&id=43260888&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Share.vue?vue&type=script&lang=js
var Sharevue_type_script_lang_js = __webpack_require__(29280);
;// ./src/standard/module/components/Share.vue?vue&type=script&lang=js
 /* harmony default export */ const components_Sharevue_type_script_lang_js = (Sharevue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Share.vue?vue&type=style&index=0&id=43260888&prod&scoped=true&lang=css
var Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css = __webpack_require__(48073);
var Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Share.vue?vue&type=style&index=0&id=43260888&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const components_Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css = ((Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css_default()) && (Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css_default()).locals ? (Sharevue_type_style_index_0_id_43260888_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/Share.vue?vue&type=style&index=0&id=43260888&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/Share.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_Sharevue_type_script_lang_js,
  Sharevue_type_template_id_43260888_scoped_true/* render */.XX,
  Sharevue_type_template_id_43260888_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "43260888",
  null
  
)

/* harmony default export */ const Share = (component.exports);

/***/ }),

/***/ 4310:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $imports = __webpack_require__(53095);
module.exports = function ($data) {
    'use strict';
    $data = $data || {};
    var $$out = '', $escape = $imports.$escape, link = $data.link, img = $data.img;
    $$out += '<a style="display: inline-flex; position: relative; vertical-align: middle; margin-left: 5px;" class="gwd-top-tmall"\n   target="_blank"\n   title="点击领取"\n   href="';
    $$out += $escape(link);
    $$out += '">\n  <img src="';
    $$out += $escape(img);
    $$out += '" alt="" style="height: 32px">\n</a>\n<style>\n  .gwd-top-tmall {\n    height: 100%;\n    align-items: center;\n  }\n\n  .gwd-qr-act {\n    display: none;\n    flex-direction: column;\n    position: absolute;\n    width: 144px;\n    height: 167px;\n    box-sizing: border-box;\n    border: 1px solid #ff471a;\n    background: #fff9f6;\n    top: 37px;\n    left: 50%;\n    align-items: center;\n    margin-left: -72px;\n  }\n\n  .gwd-top-tmall:hover .gwd-qr-act {\n    display: flex;\n  }\n</style>';
    return $$out;
};

/***/ }),

/***/ 4771:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94320);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("55d43378", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 5267:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = (() => {
  // 某些网站会覆盖掉js的一些方法
  if (G.site === 'keede') {
    __webpack_require__(85213)();
  }
  if (G.site === 'ule' || G.site === 'yesmywine') {
    Array.prototype.filter = function (cb) {
      let temp = [];
      for (let i = 0; i < this.length; i++) {
        if (cb(this[i])) {
          temp.push(this[i]);
        }
      }
      return temp;
    };
  }
  if (G.site === 'suning') {
    setTimeout(() => {
      $('#gwd_mini_compare').on('click', 'a', function (e) {
        let url = $(this).attr('href');
        if (url && url.indexOf('http') > -1) {
          window.open($(this).attr('href'));
          e.preventDefault();
        }
      });
    }, 500);
  }
  if (G.site === '360buy') {
    const selector = '.image-zoom-container.main-img';
    (__webpack_require__(30888).waitForConditionFn)(() => {
      return $(selector).length > 0;
    }).then(() => {
      const el = $(selector)[0];
      function updateZoomState() {
        const pupExist = $(el).find('.zoom-lens').length > 0;
        if (pupExist) {
          $('.gwd-minibar-bg').css('visibility', 'hidden');
        } else {
          $('.gwd-minibar-bg').css('visibility', 'visible');
        }
      }
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          updateZoomState();
        });
      });
      observer.observe(el, {
        attributes: false,
        childList: true,
        subtree: false
      });
    });
  }
  if (G.site === 'wstx') {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      var k;
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = +fromIndex || 0;
      if (Math.abs(n) === Infinity) {
        n = 0;
      }
      if (n >= len) {
        return -1;
      }
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 5631:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ ShaiDanItemvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ ShaiDanItem)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanItem.vue?vue&type=template&id=731c91d4&scoped=true
var ShaiDanItemvue_type_template_id_731c91d4_scoped_true = __webpack_require__(64229);
;// ./src/standard/module/trend/ShaiDanItem.vue?vue&type=template&id=731c91d4&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanItem.vue?vue&type=script&lang=js
var ShaiDanItemvue_type_script_lang_js = __webpack_require__(3851);
;// ./src/standard/module/trend/ShaiDanItem.vue?vue&type=script&lang=js
 /* harmony default export */ const trend_ShaiDanItemvue_type_script_lang_js = (ShaiDanItemvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanItem.vue?vue&type=style&index=0&id=731c91d4&prod&scoped=true&lang=less
var ShaiDanItemvue_type_style_index_0_id_731c91d4_prod_scoped_true_lang_less = __webpack_require__(78579);
;// ./src/standard/module/trend/ShaiDanItem.vue?vue&type=style&index=0&id=731c91d4&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/trend/ShaiDanItem.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  trend_ShaiDanItemvue_type_script_lang_js,
  ShaiDanItemvue_type_template_id_731c91d4_scoped_true/* render */.XX,
  ShaiDanItemvue_type_template_id_731c91d4_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "731c91d4",
  null
  
)

/* harmony default export */ const ShaiDanItem = (component.exports);

/***/ }),

/***/ 6301:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "minibar-btn-box gwd-row gwd-align gwd-jcc",
    staticStyle: {
      display: "inline-flex"
    }
  }, [_c("em", {
    staticClass: "gwd-favor-icon",
    class: {
      "gwd-favored": _vm.checked
    }
  }), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.checked ? "已添加提醒" : "降价提醒"))])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 6695:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-sd-img-tooltip[data-v-ef176d54] {\n  width: 57px;\n  height: 14px;\n  border: 1px solid #ffd6d3;\n  border-radius: 2px;\n  box-sizing: border-box;\n  cursor: pointer;\n  position: relative;\n  line-height: 12px;\n}\n.gwd-sd-img-tooltip .gwd-font11[data-v-ef176d54] {\n  color: #e03024;\n  white-space: nowrap;\n  transform-origin: top center;\n}\n", ""]);

// exports


/***/ }),

/***/ 7053:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


const b2cCompare = __webpack_require__(63368);
const tbCompare2 = __webpack_require__(97353);
const amazonGlobal = __webpack_require__(99495);
const calWidth = __webpack_require__(42869);
const utils = __webpack_require__(30888);
const log = __webpack_require__(35743);
let runDp = {};
const moduleControl = id => {
  log(`track:${id}`);
  switch (id) {
    case 'b2c_compare':
      b2cCompare.renderTopDetail();
      break;
    case 'tb_compare':
      tbCompare2.renderTopDetail2('taobao');
      break;
    case 'tm_compare':
      tbCompare2.renderTopDetail2('tmall');
      break;
    case 'amazon_compare':
      amazonGlobal.renderTopDetail('tmall');
      break;
  }
};
const checkImage = (dom, src) => {
  let image = new Image();
  image.onload = () => {
    $(dom).attr('src', src);
  };
  image.onerror = () => {
    $(dom).attr('src', G.noImg);
  };
  image.src = src;
};
const turnPage = (type, dom, id) => {
  let widthObj = calWidth.init();
  let list = dom.find('.all-products li');
  let totalP = Number(dom.find('.page-num').text());
  let curentP = Number(dom.find('.current-page').text());
  let sNum = widthObj.b2cShowListNum;
  if (id.indexOf('b2c') === -1) {
    sNum = widthObj.showListNum;
  }
  list.hide();
  if (type === 1) {
    if (curentP === totalP) curentP = 0;
    module.exports.loadImg(sNum * curentP, sNum * (curentP + 1), dom.find('.all-products li img'));
    for (let i = sNum * curentP; i < sNum * (curentP + 1); i++) {
      list.eq(i).show();
    }
    curentP++;
  } else {
    if (curentP === 1) curentP = totalP + 1;
    module.exports.loadImg(sNum * (curentP - 2), sNum * (curentP - 1), dom.find('.all-products li img'));
    for (let i = sNum * (curentP - 2); i < sNum * (curentP - 1); i++) {
      list.eq(i).show();
    }
    curentP--;
  }
  dom.find('.current-page').text(curentP);
};
module.exports.loadImg = (start, end, dom) => {
  for (let i = start; i < end; i++) {
    let itemimg = $(dom).eq(i)[0];
    if (!itemimg) return;
    let src = itemimg.getAttribute('data-original');
    let defaultsrc = itemimg.src;
    if (src !== defaultsrc) checkImage(itemimg, src);
  }
};
const autoFixWidth = (reset = true) => {
  let barW = $(window).width();
  if (reset) {
    $('.gwd-hidden').removeClass('gwd-hidden');
  }
  let feedW = $('#gwdang-feed-close').outerWidth();
  let history = $('#gwd_history').outerWidth();
  let searchW = $('.search-mod').outerWidth();
  let lowW = $('#gwd_lowpri').outerWidth();
  let leftW = $('.gwd-topbar-left').outerWidth();
  let logoW = $('.gwd-topbar-logo').outerWidth();
  let promoW = $('#promo_quan_btn').outerWidth();
  let adWidth = $('#gwdang-banner-ad').outerWidth();
  let adWidth2 = $('#gwdang-banner-ad2').outerWidth();
  let shareBtn = $('.shareExt').outerWidth();
  let suggestW = $('.gwdang-suggest').outerWidth();
  //let freeW = barW - (feedW + history + searchW + lowW + leftW + logoW + adWidth + adWidth2 + shareBtn);
  //if (freeW < -1000) return;
  let freeW = $('#gwd-space').outerWidth();
  if ($('#gwd-space').outerWidth() > 10) {
    return;
  }
  let list = ['.shareExt', '.gwdang-suggest', '.search-mod', '#gwd_history', '#gwdang-favor'];
  if (freeW < 5) {
    for (let i = 0; i < list.length; i++) {
      let toCheck = list[i];
      if (!$(toCheck)[0]) continue;
      if (!$(toCheck).hasClass('gwd-hidden')) {
        $(toCheck).addClass('gwd-hidden');
        setTimeout(() => {
          autoFixWidth(false);
        }, 0);
        return;
      }
    }
  }
  if (freeW < 50) {
    $('.shareExt').addClass('gwd-hidden');
    freeW += searchW;
  }
  if (freeW < 50) {
    $('.gwdang-suggest').addClass('gwd-hidden');
    freeW += searchW;
  }
  if (freeW < 50) {
    $('.search-mod').addClass('gwd-hidden');
    freeW += searchW;
  }
  if (freeW < 50) {
    $('#gwd_history').addClass('gwd-hidden');
    freeW += history;
  }
  if (freeW < 50) {
    $('#gwdang-banner-ad2').addClass('gwd-hidden');
    freeW += adWidth2;
  }
  if (freeW < 50) {
    $('#gwd_lowpri').addClass('gwd-hidden');
    $('.gwd-topbar-right').css('min-width', 'auto');
    freeW += lowW;
  }
  if (freeW < 50) {
    $('#promo_quan_btn').addClass('gwd-hidden');
    freeW += promoW;
  }
  if ($('.gwd-topbar-right').outerWidth() === 400) {
    $('.gwd-topbar-right').css('min-width', 'auto');
  }
};
module.exports.autoFixWidth = autoFixWidth;
module.exports.clearRunDp = () => {
  runDp = {};
};
module.exports.listenBar = style => {
  runDp = {};
  let renderSetting;
  if (style === 'top') {
    $(G.dval).on('mouseenter', '.gwdang-tab', function () {
      let id = $(this).attr('id');
      if (!runDp[id] && id !== 'gwdang-trend') {
        runDp[id] = true;
        moduleControl(id);
      } else {
        //$(this).find('.top-bar-detail').show()
        $(document).trigger('renderAgain');
      }
      $(this).addClass('tab-hover');
    });
    $(G.dval).on('mouseleave', '.gwdang-tab', function () {
      let id = $(this).attr('id');
      // 价格走势的展开框因为有特殊情况， 所以不在这里隐藏， 单独添加事件监控
      if (id === 'gwdang-trend') return false;
      //$('.top-bar-detail').hide()
      $(this).removeClass('tab-hover');
    });
    $(G.dval).on('click', '.turn-page a', function () {
      let id = $(this).attr('id');
      let dom = $(this).parent().parent();
      if (id.match(/(?:b2c|taobao|tmall|fuzzy)-prev-page/)) {
        turnPage(-1, dom, id);
      } else if (id.match(/(?:b2c|taobao|tmall|fuzzy)-next-page/)) {
        turnPage(1, dom, id);
      }
    });
    $('.gwd_close').on('click', function () {
      $('#gwdang_main').hide();
      $('#gwdang-mini').show();
      utils.setLocal('fold', '1');
      utils.settings('set_p_fold', 'p_fold', '1');
      $('body').css('padding-top', '0px').removeClass('gwd_unfold');
    });
    $('#gwd_fold_pointer').on('click', function () {
      $('#gwdang_main').show();
      $('#gwdang-mini').hide();
      utils.setLocal('fold', '0');
      utils.settings('set_p_fold', 'p_fold', '0');
      $('body').css('padding-top', '36px').addClass('gwd_unfold');
      autoFixWidth();
    });
  } else {
    $('#bjd_bottom_detail').on('mouseenter', '.btm-tab', function () {
      $(this).find('.gwd-btn-detail').show();
    });
    $('#bjd_bottom_detail').on('mouseleave', '.btm-tab', function () {
      $(this).find('.gwd-btn-detail').hide();
    });
  }
  let resizeT;
  $(window).resize(function () {
    clearTimeout(resizeT);
    // module.exports.clearRunDp()
    resizeT = setTimeout(function () {
      autoFixWidth();
    }, 500);
  });
};

/***/ }),

/***/ 7384:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(79899);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("51e5f48b", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 7804:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
const countryConfig = __webpack_require__(22209);
var _default = exports.A = {
  props: ['data'],
  computed: {
    unit() {
      let r = countryConfig.getSymbol(this.data[0].currency);
      return r[1] + `(${r[0]})`;
    }
  }
};

/***/ }),

/***/ 8488:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ CouponArrowvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ CouponArrow)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CouponArrow.vue?vue&type=template&id=36459586
var CouponArrowvue_type_template_id_36459586 = __webpack_require__(22223);
;// ./src/standard/module/components/CouponArrow.vue?vue&type=template&id=36459586

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CouponArrow.vue?vue&type=script&lang=js
var CouponArrowvue_type_script_lang_js = __webpack_require__(74868);
;// ./src/standard/module/components/CouponArrow.vue?vue&type=script&lang=js
 /* harmony default export */ const components_CouponArrowvue_type_script_lang_js = (CouponArrowvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/CouponArrow.vue





/* normalize component */
;
var component = (0,componentNormalizer/* default */.A)(
  components_CouponArrowvue_type_script_lang_js,
  CouponArrowvue_type_template_id_36459586/* render */.XX,
  CouponArrowvue_type_template_id_36459586/* staticRenderFns */.Yp,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ const CouponArrow = (component.exports);

/***/ }),

/***/ 8762:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
const log = __webpack_require__(35743);
var _default = exports.A = {
  props: ['data', 'pri', 'position'],
  data() {
    return {
      isBjg: G.from_device === 'bijiago'
    };
  },
  mounted() {
    log('miniCompare:length', this.data.length);
  },
  methods: {
    transText(text) {
      const map = {
        '更低价': '更低價',
        '暂无结果': '暫無結果',
        '其他': '其他',
        '家报价': '家報價'
      };
      if (G.lang === 'zh-tr') {
        return map[text] || text;
      } else {
        return text;
      }
    },
    logLink() {
      log('miniCompare:linkClick');
    },
    logHover() {
      log('miniCompare:hover');
    },
    mouseover() {
      if (this.position.top) {
        $('.gwd-minibar-bg #gwd_mini_compare').addClass('ms-tab-enter');
        if (G.from_device.includes('bijiago')) {
          $('#bjgext_minibar #gwd_mini_compare').addClass('bjg-hover-bg');
        }
      }
    },
    mouseleave() {
      if (this.position.top) {
        $('.gwd-minibar-bg #gwd_mini_compare').removeClass('ms-tab-enter');
        if (G.from_device.includes('bijiago')) {
          $('#bjgext_minibar #gwd_mini_compare').removeClass('bjg-hover-bg');
        }
      }
    }
  },
  computed: {
    style() {
      if (this.position.top) {
        const style = {
          top: this.position.top + 'px',
          left: this.position.left + 'px',
          width: this.position.width + 1 + 'px',
          height: this.position.height + 'px',
          position: 'absolute'
        };
        if (G.from_device.includes('bijiago')) {
          style.background = 'transparent';
          style.borderRight = 'none';
        }
        return style;
      }
      return {};
    }
  }
};

/***/ }),

/***/ 9340:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['price', 'fontSize', 'unit']
};

/***/ }),

/***/ 9765:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ CollectionSettingTopvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ CollectionSettingTop)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingTop.vue?vue&type=template&id=549382c4&scoped=true
var CollectionSettingTopvue_type_template_id_549382c4_scoped_true = __webpack_require__(98522);
;// ./src/standard/module/components/CollectionSettingTop.vue?vue&type=template&id=549382c4&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingTop.vue?vue&type=script&lang=js
var CollectionSettingTopvue_type_script_lang_js = __webpack_require__(12496);
;// ./src/standard/module/components/CollectionSettingTop.vue?vue&type=script&lang=js
 /* harmony default export */ const components_CollectionSettingTopvue_type_script_lang_js = (CollectionSettingTopvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=0&id=549382c4&prod&scoped=true&lang=css
var CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css = __webpack_require__(40584);
var CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=0&id=549382c4&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const components_CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css = ((CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css_default()) && (CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css_default()).locals ? (CollectionSettingTopvue_type_style_index_0_id_549382c4_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=0&id=549382c4&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=1&id=549382c4&prod&scoped=true&lang=less
var CollectionSettingTopvue_type_style_index_1_id_549382c4_prod_scoped_true_lang_less = __webpack_require__(4771);
;// ./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=1&id=549382c4&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=2&id=549382c4&prod&scoped=true&lang=less
var CollectionSettingTopvue_type_style_index_2_id_549382c4_prod_scoped_true_lang_less = __webpack_require__(11418);
;// ./src/standard/module/components/CollectionSettingTop.vue?vue&type=style&index=2&id=549382c4&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/CollectionSettingTop.vue



;




/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_CollectionSettingTopvue_type_script_lang_js,
  CollectionSettingTopvue_type_template_id_549382c4_scoped_true/* render */.XX,
  CollectionSettingTopvue_type_template_id_549382c4_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "549382c4",
  null
  
)

/* harmony default export */ const CollectionSettingTop = (component.exports);

/***/ }),

/***/ 9856:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-row {\n  display: flex;\n  flex-direction: row;\n}\n.gwd-inline-row {\n  display: inline-flex;\n  flex-direction: row;\n}\n.gwd-column {\n  display: flex;\n  flex-direction: column;\n}\n.gwd-inline-column {\n  display: inline-flex;\n  flex-direction: column;\n}\n.gwd-align {\n  align-content: center;\n  align-items: center;\n}\n.gwd-jcc {\n  justify-content: center;\n}\n.gwd-jic {\n  justify-items: center;\n}\n.gwd-button {\n  outline: none;\n  border: none;\n}\n.bjg-bar-button {\n  font-size: 0;\n}\n.bjg-hover-bg {\n  background: #fffbef;\n}\n.bjg-bar-button:hover {\n  background: #fffbef;\n  cursor: pointer;\n}\n.bjg-bar-button:hover .bjg-window {\n  display: block;\n}\n.mainbar-fold .bjg-bar-button,\n.mainbar-fold #top_coupon_btn,\n.mainbar-fold .rinfo-btn,\n.mainbar-fold .gwd-bottom-tmall {\n  display: none!important;\n}\n.gwd-font12 {\n  font-size: 12px;\n}\n.gwd-font14 {\n  font-size: 14px;\n}\n.gwd-red {\n  color: #ff3532;\n}\n.gwd-red-bg {\n  background: #ff3532;\n}\n.gwd-hui333 {\n  color: #333333;\n}\n.gwd-hui999 {\n  color: #999999;\n}\n.gwd-font10 {\n  font-size: 12px;\n  transform: scale(0.8333);\n  transform-origin: bottom center;\n}\n.gwd-font11 {\n  font-size: 12px;\n  transform: scale(0.91666);\n  transform-origin: bottom center;\n}\n.gwd-font9 {\n  font-size: 12px;\n  transform: scale(0.75);\n  transform-origin: bottom center;\n}\n.gwd-hoverable:hover {\n  background: #edf1f2;\n}\n.right-info > * {\n  border-left: 1px solid #edf1f2;\n}\n.gwd-red-after-visit:hover {\n  color: #e03024 !important;\n}\n.gwd-button:hover {\n  filter: brightness(1.1);\n}\n.gwd-button {\n  padding-top: 1px;\n  padding-bottom: 1px;\n}\n.gwd-button:active {\n  filter: brightness(0.9);\n}\n.gwd-fadeout-5s {\n  opacity: 0;\n  transition: opacity 5s;\n}\n.gwd-scrollbar::-webkit-scrollbar {\n  width: 6px;\n  border-radius: 17px;\n}\n.gwd-scrollbar::-webkit-scrollbar-thumb {\n  border-radius: 17px;\n  background: #999;\n}\n#gwdang_main,\n.gwdang-main,\n.bjgext-detail {\n  font-size: 12px;\n}\n#gwdang_main button,\n.gwdang-main button,\n.bjgext-detail button {\n  text-align: center;\n}\n.gwd-width-100 {\n  width: 100%;\n}\n.gwd-overlay {\n  font-family: \"Microsoft YaHei\", \"Arial\", \"SimSun\", serif;\n  font-size: 0;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 999999999;\n}\n.gwd-font-pfm {\n  font-family: 'PingFangSC-Medium';\n  font-weight: normal!important;\n}\n@font-face {\n  font-family: 'PingFangSC-Medium';\n  src: local('PingFangSC-Medium');\n}\n.gwd-font-pfm {\n  font-family: local('PingFangSC-Medium'), system-ui;\n  font-weight: bold;\n}\n#gwd_minibar svg,\n.gwdang-main svg,\n#bjgext_mb_bg svg,\n#bjgext_mainbar svg {\n  fill: transparent;\n}\n.gwd-common-font {\n  font-family: 'PingFang SC', 'Microsoft YaHei', '\\5FAE\\8F6F\\96C5\\9ED1', 'Hiragino Sans GB', 'WenQuanYi Micro Hei';\n}\n.gwd-hidden {\n  display: none!important;\n}\n.gwd-topbar-right {\n  /*display: flex;*/\n  flex-direction: column;\n  justify-content: flex-end;\n  flex-wrap: nowrap;\n}\n#gwd_setting_div .gwd-hover-helper {\n  content: '';\n  position: absolute;\n  top: -10px;\n  left: 0;\n  right: 0;\n  height: 10px;\n}\n#gwd_setting_div {\n  cursor: pointer;\n  display: none;\n}\n#gwd_setting_div a:hover {\n  color: #48befe !important;\n}\n#gwdang-banner-ad:hover {\n  background: none;\n}\n.gwd-topbar-logo:hover #gwd_setting_div {\n  display: block;\n}\n#gwdang-mini a:hover #gwd_setting_div {\n  display: block;\n}\n#gwdang-main-nav a.gwd_logo {\n  height: 30px!important;\n}\n", ""]);

// exports


/***/ }),

/***/ 10276:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = exports["default"] = {
  props: ['tag', 'coupon'],
  data: () => ({
    dpId: G.dp.dpId
  }),
  methods: {
    addLink(link) {
      return (__webpack_require__(12826).appendTbInfoForUrl)(link);
    }
  },
  computed: {
    couponTypeText() {
      let tag = parseInt(this.tag);
      return ['', '', '会员券', '', '', '', '店铺券'][tag];
    }
  }
};

/***/ }),

/***/ 10635:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", {
    staticClass: "gwd-price"
  }, [_vm.price ? _c("span", {
    staticStyle: {
      "font-size": "14px"
    }
  }, [_vm._v(_vm._s(_vm.unit))]) : _vm._e(), _vm._v(" "), _vm.price ? _c("span", {
    style: {
      "font-size": (_vm.fontSize ? _vm.fontSize : 20) + "px"
    }
  }, [_vm._v(_vm._s(parseFloat(_vm.price).toFixed(2).replace(".00", "")))]) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 10724:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {};

/***/ }),

/***/ 10738:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


let history = __webpack_require__(42288);
let template = __webpack_require__(26133);
const util = __webpack_require__(30888);
const userData = __webpack_require__(74222);
let historySize = 0;
let go_union = __webpack_require__(71363);
const global2 = __webpack_require__(7053);
const siteInfo = __webpack_require__(92834);
let renderBtnBottom = () => {
  let btnHtml = `<a id="${G.extBrand}_history" class="${G.extBrand}-close-module"> <span><em></em>浏览历史</span></a>`;
  let dom = $(`.${G.extBrand}_option_setting`);
  dom.after(template.compile(btnHtml)());
};
let fixtop = () => {
  /*修改了dom结构和css文件，为了不影响本地版本，不能直接修改原有的css属性，只能通过添加类名覆盖之前的属性*/
  $(`#${G.extName}-feed-close`).addClass(`_newbar1`);
  $(`#${G.extName}-main`).addClass(`_newbar2`);
};
let renderBtnTop = () => {
  fixtop();
  let btnHtml = `<div id="gwd_history" class="gwdang-tab">
    <span class="btn-tab-sp">
      <em class="gwd_bg"></em>
      <span class="tab-sp1 blkcolor1">浏览历史</span>
    </span>
  </div>`;
  $(`.search-mod`).after(template.compile(btnHtml)());
  $('#gwd_history').show();
  (__webpack_require__(7053).autoFixWidth)();
};
let renderBtn = () => {
  let perinfo = userData.get('permanent');
  if (perinfo.style == 'top') {
    renderBtnTop();
  } else if (perinfo.style == 'bottom') {
    renderBtnBottom();
  }
};
let historyGot = false;
let renderDetailHtml = (dom, data, height) => {
  let html = __webpack_require__(62853);
  $(dom).append(template.compile(html)({
    'data': data,
    's_server': G.s_server,
    'his_size': historySize,
    extName: G.extName
  }));
};
let renderDetail = (data, height) => {
  let perinfo = userData.get('permanent');
  if (perinfo.style == 'top') {
    renderDetailHtml($(`#gwd_history`), data, height);
  } else if (perinfo.style == `bottom`) {
    renderDetailHtml('#bjd_bottom_detail', data, height);
  }
};
let calHeight = () => {
  if (historySize >= 4) return 343;else {
    return historySize * 75 + (historySize - 1) * 14 + 1;
  }
};
let addUnion = data => {
  var newdata = [];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].url) continue;
    let site = siteInfo.isProductPage(data[i].url);
    let obj = {
      'site_id': data[i].site_id,
      'url': data[i].url,
      'mod': 'history',
      'union': G.union.split('_')[1],
      'dp_id': data[i].dp_id
    };
    data[i].url = go_union.init(obj);
    data[i].currency = (__webpack_require__(22209).getMoneyInfo)(site)[0];
    data[i].site = site;
    newdata.push(data[i]);
  }
  return newdata;
};
let render = data => {
  historyGot = true;
  if (!data || data.length == 0) return;
  data = addUnion(data.slice(0, 10));
  historySize = data.length;
  let height = calHeight();
  renderBtn();
  renderDetail(data, height);
  addEvent(historySize);
};
let addEvent = size => {
  let timer, loadImg, setLeft;
  const ren = () => {
    if (!loadImg) {
      loadImg = true;
      global2.loadImg(0, size, $('#history_detail li .item_img img'));
    }
    if (!setLeft) {
      util.setSimplePagePos($('#gwd_history'), $('#history_detail'), 288);
      setLeft = true;
    }
    $(`#${G.extBrand}_history`).addClass(`history_hover`);
    $(`#history_detail`).show();
  };
  ren();
  $(`#${G.extBrand}_history`).on(`mouseenter`, ren);
  $(`#${G.extBrand}_history`).on('mouseleave', () => {
    timer = setTimeout(() => {
      $(`#${G.extBrand}_history`).removeClass(`history_hover`);
      $(`#history_detail`).hide();
    }, 200);
  });
  $(`#history_detail`).on('mouseenter', () => {
    clearTimeout(timer);
  });
  $(`#history_detail`).on(`mouseleave`, () => {
    $(`#${G.extBrand}_history`).removeClass(`history_hover`);
    $(`#history_detail`).hide();
  });
  $('#history_detail .item_close_btn').on('click', function () {
    let id = $(this).attr('data-id');
    historySize--;
    delHistory($(this).parents('li'), id);
  });
  $('#history_detail .clear_his').on('click', () => {
    clearHistory();
  });
};
let getHistory = () => {
  history.get(render);
};
const clearHistory = () => {
  history.delAll(() => {
    $('.history_detail .history_content ul').empty();
    $('.history_detail .history_content').addClass('no-his-content');
    $('.history_detail .history_content').height(76);
    $('.clear_his').hide();
  });
};
let setHistory = () => {
  /*因为没有抓取屏蔽淘宝天猫*/
  let other_info = userData.get('other_info');
  let dp_id = other_info && other_info.now && other_info.now.dp_id;
  if (G.site != 'taobao' && G.site != 'tmall') history.add(dp_id);
};
let delHistory = (obj, id) => {
  let height = calHeight();
  history.del(id, () => {
    $(obj).remove();
    if (height == 343) return;
    if (historySize === 0) {
      $('.history_detail .history_content').addClass('no-his-content');
      $('.clear_his').hide();
      return;
    }
    $('.history_detail .history_content').height(height);
  });
};
module.exports.init = () => {
  //getHistory()
  $(`#${G.extBrand}_history`).on(`mouseenter`, () => {
    if (!historyGot) {
      getHistory();
    }
  });
  setHistory();
};

/***/ }),

/***/ 10809:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ QuestHintvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ QuestHint)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/QuestHint.vue?vue&type=template&id=1834bd8f&scoped=true
var QuestHintvue_type_template_id_1834bd8f_scoped_true = __webpack_require__(24700);
;// ./src/standard/module/components/QuestHint.vue?vue&type=template&id=1834bd8f&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/QuestHint.vue?vue&type=script&lang=js
var QuestHintvue_type_script_lang_js = __webpack_require__(10724);
;// ./src/standard/module/components/QuestHint.vue?vue&type=script&lang=js
 /* harmony default export */ const components_QuestHintvue_type_script_lang_js = (QuestHintvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/QuestHint.vue?vue&type=style&index=0&id=1834bd8f&prod&scoped=true&lang=less
var QuestHintvue_type_style_index_0_id_1834bd8f_prod_scoped_true_lang_less = __webpack_require__(42012);
;// ./src/standard/module/components/QuestHint.vue?vue&type=style&index=0&id=1834bd8f&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/QuestHint.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_QuestHintvue_type_script_lang_js,
  QuestHintvue_type_template_id_1834bd8f_scoped_true/* render */.XX,
  QuestHintvue_type_template_id_1834bd8f_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "1834bd8f",
  null
  
)

/* harmony default export */ const QuestHint = (component.exports);

/***/ }),

/***/ 11418:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60877);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("1e325817", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 11445:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(80300);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("7a7be5e6", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 11496:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.T = void 0;
__webpack_require__(3362);
var _MemberCouponTop = _interopRequireDefault(__webpack_require__(16112));
var _MemberCouponMini = _interopRequireDefault(__webpack_require__(4104));
var _MemberCouponMiniBjg = _interopRequireDefault(__webpack_require__(73222));
var _MemberCouponBottomBjg = _interopRequireDefault(__webpack_require__(63372));
// 会员券

const getMemberCoupon = async (shopId, userId) => {
  return await (__webpack_require__(49388).rawGet)(`https://alisitecdn.m.taobao.com/minidata/shop/index/downgrade.htm?pathInfo=shop/index2&userId=${userId}&shopId=${shopId}`);
};
const render = () => {
  (__webpack_require__(41761).setMet)('couponLink', {
    content: '发现店铺优惠券，速领',
    url: `https://tb.gwdang.com/extension/qrpage?dp_id=${G.dp.dpId}&tag=2`
  });
  const divTop = document.createElement('div');
  $('.gwd-topbar-left').append(divTop);
  new Vue({
    el: divTop,
    render: h => h(_MemberCouponTop.default, {
      props: {
        tag: 2
      }
    })
  });

  // const divBottom = document.createElement('div');
  // $('#gwd_minibar').after(divBottom);
  new Vue({
    el: '#gwd-coupon-placeholder',
    render: h => h(_MemberCouponMini.default, {
      props: {
        tag: 2
      }
    })
  });
};
const renderBjg = () => {
  new Vue({
    el: '#bjg-coupon-placeholder',
    render: h => h(_MemberCouponMiniBjg.default, {
      props: {
        tag: 8
      }
    })
  });
  let el = document.createElement('DIV');
  $('.bjg-coupon-space').after(el);
  new Vue({
    el: el,
    render: h => h(_MemberCouponBottomBjg.default, {
      props: {
        tag: 8
      }
    })
  });
};

// Define the init function first
const init = () => {
  return new Promise((resolve, reject) => {
    if (!G.aliSite) {
      resolve(false);
    }
    const metaStr = $('meta[name="microscope-data"]').attr('content');
    if (!metaStr) {
      resolve(false);
      return;
    }
    const parsedMetaStr = metaStr.split(';').map(item => {
      const arr = item.split('=');
      return {
        key: arr[0],
        value: arr[1]
      };
    });
    const meta = {};
    parsedMetaStr.forEach(item => {
      meta[item.key.trim()] = item.value;
    });
    getMemberCoupon(meta.shopId, meta.userid).then(res => {
      if (JSON.stringify(res).indexOf('market.m.taobao.com/app/cem-fe/benefit-exchange/benefit-exchange/index.html') > -1) {
        (__webpack_require__(5300).logOnce)('淘宝会员券:展示');
        if (G.from_device === 'bijiago' || G.from_device === 'biyibi') {
          renderBjg();
        } else {
          render();
        }
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

// Export the named function
exports.T = init;

/***/ }),

/***/ 12197:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {
  props: ['data', 'type'],
  data() {
    return {
      rendered: false
    };
  },
  methods: {
    draw() {
      if (this.rendered) return;
      this.rendered = true;
      __webpack_require__(64133)({
        el: this.$refs.plotArea,
        msg: this.data.store[0],
        unit: ' ',
        bg: '#1e1e1e'
      });
    }
  },
  mounted() {
    console.log(this.data);
  },
  computed: {
    priceStatusText() {
      return ['历史最低', '价格下降', '价格平稳', '价格上涨'][this.data.price_status + 2];
    },
    priceTrendIcon() {
      return [`${G.s_server}/images/extensions/newbar/fall@2x.png`, `${G.s_server}/images/extensions/newbar/fall@2x.png`, `${G.s_server}/images/extensions/newbar/stable@2x.png`, `${G.s_server}/images/extensions/newbar/rise@2x.png`][this.data.price_status + 2];
    }
  }
};

/***/ }),

/***/ 12496:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _QuestHint = _interopRequireDefault(__webpack_require__(10809));
var _CollectionSettingMixin = _interopRequireDefault(__webpack_require__(34246));
var _CommonLogin = _interopRequireDefault(__webpack_require__(36664));
var _Switch = _interopRequireDefault(__webpack_require__(99230));
var _PriceInput = _interopRequireDefault(__webpack_require__(84140));
var _default = exports.A = {
  components: {
    CommonLogin: _CommonLogin.default,
    SwitchBtn: _Switch.default,
    QuestHint: _QuestHint.default,
    PriceInput: _PriceInput.default
  },
  mixins: [_CollectionSettingMixin.default]
  // props: ['money', 'price_range', 'lastprice']
};

/***/ }),

/***/ 12591:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-column gwd-align",
    class: {
      "gwd-bjg": _vm.bjg
    },
    staticStyle: {
      flex: "1",
      "padding-top": "172px"
    }
  }, [!_vm.hasPermission && _vm.permissionTextOnly ? [_c("img", {
    staticStyle: {
      width: "151px",
      height: "124px",
      "margin-top": "57px",
      "margin-bottom": "20px"
    },
    attrs: {
      src: __webpack_require__(86427)
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "16px",
      color: "#404547",
      "line-height": "14px"
    }
  }, [_vm._v(_vm._s(_vm.transText("第一次使用时需要先同意授权")))])] : _vm._e(), _vm._v(" "), !_vm.hasPermission && !_vm.permissionTextOnly ? _c("div", {
    staticClass: "gwd-permission-hint",
    staticStyle: {
      color: "121212",
      "font-size": "14px"
    }
  }, [_vm._v(_vm._s(_vm.transText("第一次使用时需要先同意授权")))]) : _vm._e(), _vm._v(" "), !_vm.permissionTextOnly ? [_c("img", {
    staticStyle: {
      width: "150px"
    },
    attrs: {
      src: __webpack_require__(13335),
      alt: ""
    }
  }), _vm._v(" "), _vm.error === "needLogin" ? _c("span", {
    staticStyle: {
      color: "#666666",
      "font-size": "12px",
      "margin-top": "6px"
    }
  }, [_vm._v(_vm._s(_vm.transText("请先访问"))), _c("a", {
    staticStyle: {
      color: "#666666"
    },
    attrs: {
      href: _vm.index(_vm.site),
      target: "_blank"
    }
  }, [_vm._v(_vm._s(_vm.siteMap[_vm.site]) + _vm._s(_vm.transText("首页")))]), _vm._v(_vm._s(_vm.transText("，"))), _c("span", {
    staticStyle: {
      color: "#666666"
    }
  }, [_vm._v(_vm._s(_vm.transText("登录") + _vm.siteMap[_vm.site] + _vm.transText("帐号")))]), _vm._v(_vm._s(_vm.transText("，然后回来重试。")))]) : _vm.errorDetail.includes("FAIL_SYS_USER_VALIDATE") ? _c("span", {
    staticStyle: {
      color: "#666666",
      "font-size": "12px",
      "margin-top": "6px"
    }
  }, [_vm._v(_vm._s(_vm.transText("请先去【"))), _c("a", {
    staticStyle: {
      color: "blue",
      "text-decoration": "underline"
    },
    attrs: {
      href: _vm.verifyLink,
      target: "_blank"
    }
  }, [_vm._v(_vm._s(_vm.transText("淘宝首页")))]), _vm._v(_vm._s(_vm.transText("】，完成一次图片搜同款，并验证滑块后再回来重试。")))]) : _vm.error === "needVisit" ? _c("span", {
    staticStyle: {
      color: "#666666",
      "font-size": "12px",
      "margin-top": "6px"
    }
  }, [_vm._v(_vm._s(_vm.transText("加载失败，请先访问【"))), _c("a", {
    attrs: {
      target: "_blank",
      href: _vm.index(_vm.site)
    }
  }, [_vm._v(_vm._s(_vm.siteMap[_vm.site]) + _vm._s(_vm.transText("首页")))]), _vm._v(_vm._s(_vm.transText("】，再回来重试")))]) : _vm.errorDetail.includes("-FAILSYS::trace") ? _c("span", {
    staticStyle: {
      color: "#666666",
      "font-size": "12px",
      "margin-top": "6px"
    }
  }, [_vm._v("\n      " + _vm._s(_vm.transText("加载失败，")) + _vm._s(_vm.siteMap[_vm.site]) + _vm._s(_vm.transText("接口故障，请稍后再试")) + "\n    ")]) : _vm.errorDetail.includes("-") ? _c("span", {
    staticStyle: {
      color: "#666666",
      "font-size": "12px",
      "margin-top": "6px"
    }
  }, [_vm._v(_vm._s(_vm.transText("请先访问【"))), _c("a", {
    staticStyle: {
      color: "blue",
      "text-decoration": "underline"
    },
    attrs: {
      href: _vm.index(_vm.site),
      target: "_blank"
    }
  }, [_vm._v(_vm._s(_vm.siteMap[_vm.site]) + _vm._s(_vm.transText("首页")))]), _vm._v(_vm._s(_vm.transText("】，重新"))), _c("span", {
    staticStyle: {
      color: "red"
    }
  }, [_vm._v(_vm._s(_vm.transText("登录帐号")))]), _vm._v(_vm._s(_vm.transText("，然后回来重试。")))]) : _c("span", {
    staticStyle: {
      color: "#666666",
      "font-size": "12px",
      "margin-top": "-5px"
    }
  }, [_vm._v(_vm._s(_vm.error) + _vm._s(_vm.transText("，请重试一次")))]), _vm._v(" "), _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "31px"
    }
  }, [_vm.error === "needLogin" ? _c("button", {
    staticClass: "gwd-red",
    on: {
      click: _vm.login
    }
  }, [_vm._v(_vm._s(_vm.transText("去登录")))]) : _vm._e(), _vm._v(" "), _c("button", {
    on: {
      click: _vm.retry
    }
  }, [_vm._v(_vm._s(_vm.transText("再试一次")))])])] : _vm._e()], 2);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 12774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ EpicTrend)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/EpicTrend.vue?vue&type=template&id=acea5bbc&scoped=true
var EpicTrendvue_type_template_id_acea5bbc_scoped_true = __webpack_require__(80585);
;// ./src/standard/module/components/EpicTrend.vue?vue&type=template&id=acea5bbc&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/EpicTrend.vue?vue&type=script&lang=js
var EpicTrendvue_type_script_lang_js = __webpack_require__(12197);
;// ./src/standard/module/components/EpicTrend.vue?vue&type=script&lang=js
 /* harmony default export */ const components_EpicTrendvue_type_script_lang_js = (EpicTrendvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/EpicTrend.vue?vue&type=style&index=0&id=acea5bbc&prod&scoped=true&lang=less
var EpicTrendvue_type_style_index_0_id_acea5bbc_prod_scoped_true_lang_less = __webpack_require__(30077);
;// ./src/standard/module/components/EpicTrend.vue?vue&type=style&index=0&id=acea5bbc&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/EpicTrend.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_EpicTrendvue_type_script_lang_js,
  EpicTrendvue_type_template_id_acea5bbc_scoped_true/* render */.XX,
  EpicTrendvue_type_template_id_acea5bbc_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "acea5bbc",
  null
  
)

/* harmony default export */ const EpicTrend = (component.exports);

/***/ }),

/***/ 12854:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $imports = __webpack_require__(53095);
module.exports = function ($data) {
    'use strict';
    $data = $data || {};
    var $$out = '', $escape = $imports.$escape, link = $data.link, extClass = $data.extClass, text = $data.text;
    $$out += '<a href="';
    $$out += $escape(link);
    $$out += '"\n   target="_blank"\n   title="点击领取"\n   style="display: inline-flex; position: relative; vertical-align: middle;" class="gwd-middle-tmall ';
    $$out += $escape(extClass);
    $$out += '">\n  <img ';
    $$out += 'src="https://cdn.gwdang.com/images/extensions/activity/618-take-middle@2x.png"';
    $$out += ' alt="" style="width: 24px; height: 24px;">\n  <span style="font-size: 12px; color: #ff471a; text-decoration: underline; margin-left: 3px; font-weight: 600; font-family: \'Microsoft YaHei\', \'Arial\', \'SimSun\'">';
    $$out += $escape(text);
    $$out += '</span>\n</a>\n<style>\n  .gwd-middle-tmall {\n    height: 100%;\n    align-items: center;\n    justify-content: center;\n    justify-items: center;\n    width: 150px!important;\n    white-space: nowrap;\n  }\n\n  .gwd-middle-tmall:hover {\n      background: #fff3eb;\n  }\n\n  .gwd-qr-act {\n    display: none;\n    flex-direction: column;\n    position: absolute;\n    width: 144px;\n    height: 167px;\n    box-sizing: border-box;\n    border: 1px solid #ff471a;\n    background: #fff9f6;\n    top: 37px;\n    left: 50%;\n    align-items: center;\n    margin-left: -72px;\n    z-index: 99;\n  }\n\n  .gwd-middle-tmall:hover .gwd-qr-act {\n    display: flex;\n  }\n</style>\n';
    return $$out;
};

/***/ }),

/***/ 13454:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
__webpack_require__(23792);
__webpack_require__(3362);
__webpack_require__(62953);
var _ShaiDanItem = _interopRequireDefault(__webpack_require__(5631));
const extConsole = __webpack_require__(7129);
const commonUtil = __webpack_require__(60340);
const id = (__webpack_require__(60340).getParameterByName)('id');
function extractAliSkuInfo() {
  const aliSkuBase = gwdDetailStorage[id].skuBase;
  const skuList = aliSkuBase.props.map(item => {
    return {
      name: item.name,
      pid: item.pid,
      options: item.values.map(value => ({
        name: value.name,
        img: value.image ? value.image : '',
        vid: value.vid
      }))
    };
  });
  return skuList;
}
function extractAliSkuStr() {
  let selectedSKU = [];
  document.querySelectorAll('.skuItem--uxMLmkRx').forEach(skuItem => {
    let name = skuItem.querySelector('.labelText--PsOAip_9').textContent.trim();
    let selectedOption = skuItem.querySelector('.valueItem--GzWd2LsV.isSelected--YrA6x4Yj .valueItemText--HiKnUqGa');
    if (name && selectedOption) {
      selectedSKU.push(`${name}: ${selectedOption.textContent.trim()}`);
    }
  });
  if (!selectedSKU.length) {
    return extractAliSkuStrV2();
  }
  return selectedSKU.join('; ') + ';';
}
function extractAliSkuStrV2() {
  let selectedSKU = [];

  // 遍历所有 SKU 分类
  document.querySelectorAll('.skuCate').forEach(skuCate => {
    let category = skuCate.querySelector('.skuCateText').textContent.trim().replace('：', ''); // 获取 SKU 分类名称
    let selectedOption = skuCate.querySelector('.skuItem.current .skuValueName'); // 选中的选项

    if (category && selectedOption) {
      selectedSKU.push(`${category}: ${selectedOption.textContent.trim()}`);
    }
  });
  if (!selectedSKU.length) {
    return '';
  }
  return selectedSKU.join('; ') + ';';
}
function extractAliSKUInfoV3() {
  let selectedSKU = [];
  document.querySelectorAll('.skuCate').forEach(skuCate => {
    let category = skuCate.querySelector('.skuCateText').textContent.trim().replace('：', ''); // 获取 SKU 分类名称
    let selectedOption = skuCate.querySelector('.skuItem.current .skuValueName'); // 选中的选项

    if (category && selectedOption) {
      selectedSKU.push(`${category}: ${selectedOption.textContent.trim()}`);
    }
  });
}
function extractJdSkuInfo() {
  let skuData = [];
  document.querySelectorAll('#choose-attrs .p-choose').forEach(attr => {
    let name = attr.getAttribute('data-type');
    let options = [...attr.querySelectorAll('.item')].map(item => ({
      name: item.getAttribute('data-value').trim(),
      img: item.querySelector('img') ? item.querySelector('img').src : '',
      vid: item.getAttribute('data-sku')
    }));
    if (name && options.length) {
      skuData.push({
        name,
        options
      });
    }
  });
  return skuData;
}
function extractJdSkuStr() {
  let selectedSKU = [];
  document.querySelectorAll('#choose-attrs .p-choose').forEach(attr => {
    let name = attr.getAttribute('data-type');
    let selectedOption = attr.querySelector('.item.selected');
    if (name && selectedOption) {
      selectedSKU.push(`${name}: ${selectedOption.getAttribute('data-value').trim()}`);
    }
  });
  return selectedSKU.join('; ') + ';';
}
var _default = exports.A = {
  components: {
    ShaiDanItem: _ShaiDanItem.default
  },
  props: ['dkey', 'price'],
  data() {
    return {
      hasTop: false,
      list: [],
      loaded: false,
      shop: G.dp.shopName,
      title: G.dp.title,
      img: G.dp.img,
      skuId: '',
      skuStr: '',
      skuOptions: '[]',
      skuMap: '[]',
      s_server: 'https://cdn.gwdang.com/images/extensions/shaidan/',
      loading: false
    };
  },
  computed: {
    sdUrl() {
      return `https://www.gwdang.com/v2/shaidan?dkey=${this.dkey}&dp_id=${G.dp.dpId}`;
    }
  },
  methods: {
    async extractPageData() {
      if (location.hostname === 'chaoshi.detail.tmall.com') {
        (__webpack_require__(30888).waitForConditionFn)(() => G.dp.name && G.dp.name !== '商品详情').then(() => {
          G.dp.shopName = '天猫超市';
          this.title = G.dp.name;
          this.img = G.dp.img;
        });
      }
      (__webpack_require__(30888).waitForConditionFn)(() => G.aliSkuInfo).then(() => {
        // this.shop = G.dp.shopName
        // this.title = G.dp.name
        // this.img = G.dp.img
        this.shop = G.aliSkuInfo.seller.shopName || G.aliSkuInfo.seller.sellerNick;
        this.title = G.aliSkuInfo.item.title;
        this.img = G.aliSkuInfo.item.images[0];
        this.skuOptions = JSON.stringify(extractAliSkuInfo());
        this.skuStr = extractAliSkuStr();
        (__webpack_require__(30888).waitForConditionFn)(() => commonUtil.getParameterByName('skuId')).then(() => {
          this.skuId = commonUtil.getParameterByName('skuId');
        });
        const skuBase = gwdDetailStorage[id].skuBase;
        const skuOptions = JSON.parse(this.skuOptions);
        const skuMap = skuBase.skus.map(item => {
          const path = item.propPath;
          const obj = {};
          path.split(';').forEach(p => {
            const [key, value] = p.split(':');
            const option = skuOptions.find(x => x.pid === key);
            if (option) {
              obj[option.name] = option.options.find(x => x.vid === value).name;
            }
          });
          obj.skuId = item.skuId;
          obj.stock = true;
          return obj;
        });
        this.skuMap = JSON.stringify(skuMap);
      });
      if (G.site === '360buy') {
        await (__webpack_require__(30888).waitForConditionFn)(() => document.querySelectorAll('.p-choose').length);
        this.skuOptions = JSON.stringify(extractJdSkuInfo());
        this.skuStr = extractJdSkuStr();
        this.skuId = G.dp.dpId.replace('-3', '');
        this.skuMap = JSON.stringify(pageConfig.product.colorSize);
        this.title = pageConfig.product.name;
      }

      // extConsole.log('extractAliSKUInfo', extractAliSKUInfo());
    },
    async getData() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (G.site === '360buy') {
        await (__webpack_require__(30888).waitForConditionFn)(() => this.skuMap !== '[]');
      }
      if (G.aliSite) {
        const id = (__webpack_require__(60340).getParameterByName)('id');
        const site = G.site === 'taobao' ? 'taobao' : 'tmall';
        (__webpack_require__(71159).tmallDetail)(id, site).then(data => {
          G.aliSkuInfo = data;
        });
      }
      const res = await (__webpack_require__(76904).getShaiDanList)(this.dkey, this.skuMap);
      this.loaded = true;
      this.loading = false;
      if (res.data && res.data.list) {
        this.list = res.data.list;
      }
    },
    open() {
      $('#gwd-sd-submit').click();
    }
  },
  mounted() {
    (__webpack_require__(30888).waitForConditionFn)(() => {
      if (!G.aliSite) {
        return true;
      }
      return window.gwdDetailStorage;
    }).then(() => {
      this.extractPageData();
    });
    (__webpack_require__(41761).met)('lastPointPos').then(() => {
      this.getData();
    });
    (__webpack_require__(41761).met)('hasTop').then(() => {
      this.hasTop = true;
    });
  }
};

/***/ }),

/***/ 14122:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-row gwd-align"
  }, [_c("a", {
    staticClass: "gwd-row gwd-align",
    attrs: {
      href: _vm.addLink(`https://tb.gwdang.com/extension/qrpage?dp_id=${_vm.dpId}&tag=${_vm.tag}&limit=${_vm.coupon.limit}&discount=${_vm.coupon.discount}`),
      title: "点击领取",
      target: "_blank"
    }
  }, [_c("span", {
    staticClass: "gwd-content",
    staticStyle: {
      flex: "1"
    }
  }, [_vm._v("\n      当前商品可领" + _vm._s(_vm.couponTypeText) + " "), _vm.coupon ? [_vm._v("满" + _vm._s(_vm.coupon.limit) + "减" + _vm._s(_vm.coupon.discount))] : _vm._e()], 2), _vm._v(" "), _c("span", {
    staticClass: "gwd-take"
  }, [_vm._v("点击领取")])]), _vm._v(" "), _c("img", {
    attrs: {
      src: __webpack_require__(84607),
      alt: ""
    }
  })]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 14535:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


const TbScrollLink = (__webpack_require__(51390)/* ["default"] */ .A);
module.exports = {
  reset() {
    $('#gwd-tb-mini-coupon').remove();
  },
  add(text, icon, link, mainColor, secondColor, showStampBg, rebate) {
    // console.log('tbScrollLink add', text, icon, link, mainColor, secondColor, showStampBg, rebate)
    if (!G.aliSite) {
      return;
    }
    if ($('#gwd-tb-mini-coupon').length) {
      return;
    }
    // console.log('tbScrollLink appendElement', $('.gwd-minibar-bg').parent())
    const div = document.createElement('div');
    if ($('.sku-scroll-area').length) {
      $('.sku-scroll-area').before(div);
    } else {
      $('.gwd-minibar-bg').after(div);
    }
    // require('common/extConsole').log('tbScrollLink init', text)
    new Vue({
      el: div,
      render: h => h(TbScrollLink, {
        props: {
          text: text,
          icon,
          link: link,
          mainColor,
          secondColor,
          showStampBg,
          rebate
        }
      })
    });
    (__webpack_require__(82110).recoverMiniBar)();
  }
};

/***/ }),

/***/ 15554:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const request = __webpack_require__(49388);
module.exports = {
  async init() {
    await (__webpack_require__(30888).waitForConditionFn)(() => {
      let t = $('[data-component=PurchaseButton] button')[0].innerText;
      return t === '立即购买' || t === '预购';
    });
    const EpicTrend = (__webpack_require__(12774)/* ["default"] */ .A);
    setTimeout(() => {
      let list = $('[data-component=ProductCard]');
      console.log(list);
      let r = list.toArray().map(item => {
        let link = $(item).find('a').attr('href');
        if (!link) {
          link = location.href;
        } else {
          link = 'https://' + location.hostname + link;
        }
        let el = $(item).find('[data-component=ProductCardBottomRowLayout]');
        return {
          mountPoint: el,
          link: link
        };
      });
      console.log(r);
      r.forEach(item => {
        request.get(`${G.server}/extension/price_towards?url=${item.link}&ver=1`, true).then(res => {
          let e = document.createElement('div');
          if (!res.store.length || !res.store[0].all_line.length) {
            return;
          }
          e.classList.add('gwd-tag');
          $(item.mountPoint).after(e);
          new Vue({
            el: e,
            render: h => h(EpicTrend, {
              props: {
                data: res
              }
            })
          });
          // debugger
          $(e).on('DOMNodeRemoved', () => {
            debugger;
          });
        });
      });
      let mountPoint = $('[data-component=PurchaseButton]');
      if (!mountPoint.length) {
        return;
      }
      if ($(mountPoint[0]).parents('[data-component=ProductCard]').length) {
        return;
      }
      // let priceText = $('[data-component=Price]')[0].innerText.replace('US$', '') * 100
      request.get(`${G.server}/extension/price_towards?url=${location.href}&ver=1`, true).then(res => {
        let e = document.createElement('div');
        if (!res.store.length || !res.store[0].all_line.length) {
          return;
        }
        $(mountPoint[0]).after(e);
        new Vue({
          el: e,
          render: h => h(EpicTrend, {
            props: {
              data: res,
              type: 'top'
            }
          })
        });
      });
    }, 2000);
  }
};

/***/ }),

/***/ 16327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


const template = __webpack_require__(26133);
const log = __webpack_require__(35743);
const renderChart = data => {
  renderBtn(data);
  renderDetail();
  let id = 'trend_box';
  $('.min-max-price-lable .max-lab').text(`最高:￥${data.store[0].highest}`);
  $('.min-max-price-lable .min-lab').text(`最低:￥${data.store[0].lowest}`);
  __webpack_require__(64133)({
    el: id,
    msg: data.store[0],
    waterMark: true
  });
};
let priceTle = {
  'pri-t1': "价格上涨",
  'pri-t0': "价格平稳",
  'pri-t-1': "价格下降",
  'pri-t-2': "历史最低"
};
const renderBtn = data => {
  let dom = $('.game_purchase_action:contains("开始游戏")');
  if (dom.length === 0) dom = $('.game_purchase_action:contains("在购物车中")');
  if (dom.length === 0) dom = $('.game_purchase_action:contains("添加至购物车")');
  let status = data.price_status;
  let status_str = 'pri-t' + status;
  let status_tle = priceTle[status_str];
  let html = __webpack_require__(71196);
  let bixbox = dom.eq(0);
  let bigboxwidth = bixbox.width();
  let children = bixbox.children();
  let w = 0;
  for (let i = 0; i < children.length; i++) {
    w += children.eq(i).outerWidth();
  }
  let btnleft = bigboxwidth - w - 5 - 108;
  let imgurls = `${G.s_server}/images/extensions/newbar`;
  if ($('#steam_tremd_btn').length) {
    return;
  }
  dom.eq(0).prepend(template.compile(html)({
    imgurl: imgurls,
    btnleft: btnleft,
    status_tle: status_tle,
    status_str: status_str,
    ext_class: G.from_device.indexOf('bijiago') > -1 ? 'bjgou' : ''
  }));
};
const addEvent = () => {
  let time1;
  $('#steam_tremd_btn').on('mouseenter', function () {
    $('#trenm_trend_detail').show();
    $('#steam_tremd_btn').addClass('_mshover');
    log('steam-trend-track');
  });
  $('#steam_tremd_btn').on('mouseleave', function () {
    time1 = setTimeout(function () {
      $('#trenm_trend_detail').hide();
      $('#steam_tremd_btn').removeClass('_mshover');
    }, 300);
  });
  $('#trenm_trend_detail').on('mouseenter', function () {
    clearTimeout(time1);
  });
  $('#trenm_trend_detail').on('mouseleave', function () {
    $('#trenm_trend_detail').hide();
    $('#steam_tremd_btn').removeClass('_mshover');
  });
};
const renderDetail = () => {
  let html = __webpack_require__(6762);
  let dom = $('#steam_tremd_btn').parents('.game_area_purchase_game:contains("开始游戏")');
  if (dom.length === 0) dom = $('#steam_tremd_btn').parents('.game_area_purchase_game:contains("在购物车中")');
  if (dom.length === 0) dom = $('#steam_tremd_btn').parents('.game_area_purchase_game:contains("添加至购物车")');
  if (dom.length === 0) dom = $('#steam_tremd_btn').parents('.game_area_purchase_game_wrapper:contains("添加至购物车")');
  dom.eq(0).append(template.compile(html)());
  dom.eq(0).addClass('steam_box_tt');
  __webpack_require__(35743)('steam-ad-show');
  $('#steam_ad').click(e => {
    __webpack_require__(35743)('steam-ad-click');
  });
  addEvent();
};
module.exports.init = data => {
  if (!data || data instanceof Array || data.store[0].all_line.length === 0) return;
  renderChart(data);
};

/***/ }),

/***/ 17012:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TopMainBar)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/TopMainBar.vue?vue&type=template&id=2d325947
var TopMainBarvue_type_template_id_2d325947 = __webpack_require__(87529);
;// ./src/standard/module/components/TopMainBar.vue?vue&type=template&id=2d325947

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/TopMainBar.vue?vue&type=script&lang=js
var TopMainBarvue_type_script_lang_js = __webpack_require__(70972);
;// ./src/standard/module/components/TopMainBar.vue?vue&type=script&lang=js
 /* harmony default export */ const components_TopMainBarvue_type_script_lang_js = (TopMainBarvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/TopMainBar.vue?vue&type=style&index=0&id=2d325947&prod&lang=less
var TopMainBarvue_type_style_index_0_id_2d325947_prod_lang_less = __webpack_require__(70923);
;// ./src/standard/module/components/TopMainBar.vue?vue&type=style&index=0&id=2d325947&prod&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/TopMainBar.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_TopMainBarvue_type_script_lang_js,
  TopMainBarvue_type_template_id_2d325947/* render */.XX,
  TopMainBarvue_type_template_id_2d325947/* staticRenderFns */.Yp,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ const TopMainBar = (component.exports);

/***/ }),

/***/ 18158:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
module.exports.init = async mode => {
  await (__webpack_require__(41761).met)('GwdPriceTrendLoaded');
  let className = $('.crumb .item.first').text();
  let allowedList = '家用电器、食品饮料、电脑/办公、母婴、手机通讯、家庭清洁/纸品、数码、个人护理、美妆护肤、医疗、营养保健、厨具、酒类、家装建材、汽车用品、运动户外、生鲜、家纺、服饰内衣、玩具乐器、家居日用、箱包皮具、家具、钟表、鞋靴、宠物生活、礼品、图书、珠宝首饰、文娱、工业品'.split('、').map(x => x.replace('电脑/办公', '电脑、办公'));
  if (allowedList.indexOf(className) > -1) {
    let subClass = $('.crumb .item').text();
    if (className === '手机通讯' && subClass.indexOf('办号卡') > -1) return;
    if (className === '珠宝首饰' && subClass.indexOf('黄金') > -1) return;
    let text = $('.u-jd').text().trim();
    if (!text) {
      text = $('.shopHeader .tag').text().trim();
    }
    await (__webpack_require__(30888).waitForConditionFn)(() => {
      return $('#ns_services').length > 0;
    });
    if (!$('#ns_services').text().includes('价保') && text !== '自营') {
      return;
    }
    render(mode);
  }
};
const render = async mode => {
  return;
  let days = 30;
  if ($('#ns_services').text().includes('天价保')) {
    days = parseInt($('#ns_services').text().match(/(\d+)天价保/)[1]);
  }
  (__webpack_require__(5300).log)('jdPriceProtect:show');
  const GwdPriceProtectMiddle = (__webpack_require__(46430)/* ["default"] */ .A);
  new Vue({
    el: '.gwd-price-protect',
    render: h => h(GwdPriceProtectMiddle, {
      props: {
        mode: mode,
        days: days
      }
    })
  });

  // $('#choose-btns').css('min-width', '800px').append(`
  //   <a target="_blank" id="gwd_protect" style="border: 1px solid #e23a3a; width: 142px; height: 46px; color: #e23a3a; font-size: 18px; display: inline-block; cursor: pointer; text-align: center; line-height: 44px; box-sizing: border-box; font-weight: bold">价保下单</a>`
  // )
  //
  // $('#gwd_protect').click(async (e) => {
  //   e.preventDefault()
  //   let qrApi = await require('common/globalCondition').met('qrApiReady')
  //   if (qrApi.type === 'api') {
  //     let res = await require('common/request').get(qrApi.src + '&protect=' + days)
  //     let qrLink = res.data.qrImgStr
  //     window.open(`https://tb.gwdang.com/extension/qrpage?dp_id=${G.dp.dpId}&days=${days}&alterQrUrl=${encodeURIComponent(qrLink)}`)
  //   }
  // })

  // $('.gwd-price-protect').replaceWith(`
  //
  // `)
  // setTimeout(() => {
  //   $('#gwd-price-protect').click((e) => {
  //     require('common/cnzz').log('jdPriceProtect:click')
  //   })
  // }, 0)
};

/***/ }),

/***/ 18294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const deviceEncode = __webpack_require__(69793);
const userData = __webpack_require__(74222);
const util = __webpack_require__(30888);
const globalCondition = __webpack_require__(41761);
const request = __webpack_require__(49388);
const renderBar = async permanent => {
  let fold = permanent.fold;
  if (gwd_G.from_device === 'default') {
    fold = permanent.top_fold;
  }
  let domName = G.dval.replace('#', '');
  // 工具条上展示小banner AD
  let showAd, showJHS, noCoupon;
  if (G.site.indexOf('360buy') > -1 || G.site == 'zol' || G.site == 'douban') {
    showAd = true;
  }
  if (G.site.indexOf('taobao') > -1 || G.site == 'zol' || G.site == 'douban' || G.site == 'tmall') {
    showJHS = true;
  }
  if (G.site == 'zol' || G.site == 'douban') {
    noCoupon = true;
  }
  let settingUrl;
  if (!permanent.setPage) {
    settingUrl = G.server + '/brwext/setting?from=' + deviceEncode(G.from_device) + '&btype=' + (G.btype ? G.btype : '');
  }
  let feedbackUrl = `https://www.${G.extName}.com/brwext/suggest?refer=` + encodeURIComponent(document.location.href) + '&from_device=' + deviceEncode(G.from_device) + '&btype=' + (G.btype ? G.btype : '');
  const TopMainBar = (__webpack_require__(17012)/* ["default"] */ .A);
  let jdadUrl = "https://search.jd.com/Search?keyword=%E7%99%BE%E4%BA%BF%E8%A1%A5%E8%B4%B4&qrst=1&shop=1&cod=1";
  const el = document.createElement('DIV');
  $('body').append(el);
  new Vue({
    el: el,
    render: h => h(TopMainBar, {
      props: {
        domName: domName,
        s_url: settingUrl,
        f_url: feedbackUrl,
        showAd: showAd,
        jdadUrl: jdadUrl,
        noCoupon: noCoupon,
        showJHS: showJHS,
        fold: fold
      }
    })
  });
  $('.top-bar-setting').on('click', () => {
    util.openTab();
  });
  if (fold !== '1') {
    $('body').css('padding-top', '36px').addClass('gwd_unfold');
  }
  __webpack_require__(99545)();

  // 分享插件
  (__webpack_require__(55326).init)();
  if (showAd) {
    let config = await request.rawGet('https://cdn.gwdang.com/js/configs/activity.json');
    let c = config.jdActivity;
    const t = new Date();
    let jdadImg = 'https://cdn.bijiago.com/images/extensions/ad1111/bijiago_go.png';
    if (t < new Date(c.end) && t > new Date(c.start)) {
      jdadUrl = c.top.link;
      jdadImg = c.top.img;
      $('#gwdang-banner-ad').attr('href', jdadUrl);
      $('#gwdang-banner-ad img:eq(0)').attr('src', jdadImg);
      $('#gwdang-banner-ad img:eq(0)').css('height', '32px');
      $('#gwdang-banner-ad img:eq(1)').css('display', 'none');
    }
  }
  return new Promise(resolve => resolve());
};
module.exports.init = async () => {
  let permanent = userData.get('permanent');
  if (location.hostname.indexOf('smzdm.com') > -1) {
    return;
  }
  // 获取配置信息 比如插件是否折叠
  await renderBar(permanent);
  let count = 0;
  let t = setInterval(function () {
    // 加载完成之后 做一个自动适配  避免屏幕宽度不够出现错位现象
    (__webpack_require__(7053).autoFixWidth)();
    window.fixWidth = (__webpack_require__(7053).autoFixWidth);
    count++;
    if (count > 5) {
      clearInterval(t);
    }
  }, 1000);
};

/***/ }),

/***/ 19175:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(99174);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("fa078684", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 19268:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


//添加基本的参数配置和函数
__webpack_require__(71617);
G.extend({
  crc64: true,
  union: "union_gwdang",
  show_tip: 1,
  show_wishlist: 1,
  show_guess: 1,
  show_mainbar: 1,
  show_promo: 1,
  set_force: false,
  default_style: 'top',
  ut: '&trans=1',
  from_device: 'default',
  extBrand: 'gwd',
  extName: 'gwdang',
  go_union: 'http://u.gwdang.com/union/go',
  p_id: '',
  is_open: 0,
  position: 0,
  style: '',
  notice: 0,
  first: 0,
  fold: 0,
  p_fold: 0,
  pop_share: 1,
  email: '',
  subsite_id: '',
  force: [],
  on_building: true,
  built_counter: 0,
  collectionChanged: true,
  gwd_browser_type: 1,
  gwd_cnzz: location.protocol + '//s11.cnzz.com/z_stat.php?id=1256793290&web_id=1256793290',
  is_site_page: null,
  href: window.location ? window.location.href : '',
  collectInfo: {
    dp_id: "",
    title: "",
    site_id: 0,
    url: "",
    img: "",
    price: "",
    comment: ""
  },
  now_dp_id: '',
  where_buy_dps: '',
  width: document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth : document.body.clientWidth,
  timer: null,
  timer2: null,
  timer3: null,
  timer4: null,
  timer5: null,
  //fix suning
  timer5_mutex: true,
  //mutex
  height: 0,
  scrollTop: 0,
  page_size: 6,
  page_size_mini: 4,
  page_now: {
    b2c: 1,
    taobao: 1,
    tmall: 1,
    also_buy: 1,
    promotion: 1,
    b2c_fuzzy: 1
  },
  page_total: {
    b2c: 1,
    taobao: 1,
    tmall: 1,
    also_buy: 1,
    promotion: 1,
    b2c_fuzzy: 1
  },
  total_num: {
    b2c: 6,
    taobao: 6,
    tmall: 6,
    also_buy: 6,
    promotion: 6,
    b2c_fuzzy: 6
  },
  module_name: ["b2c", "taobao", "tmall", "also_buy", "promotion", "b2c_fuzzy"],
  dpIsBook: false,
  hiddenFavorButton: false,
  save_tbres_data: null,
  save_promo_len: 0,
  save_price_trend_data: null,
  save_promo_data: null,
  topResizeTimer: null,
  bottomResizeTimer: null
});
var ua = navigator.userAgent;
if (ua.indexOf('Firefox') > -1) {
  G.gwd_cnzz = '';
}

/***/ }),

/***/ 19449:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-inline-row gwd-price-input gwd-align"
  }, [_c("span", [_vm._v(_vm._s(_vm.currency))]), _vm._v(" "), _c("input", {
    attrs: {
      type: "text",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.value
    },
    on: {
      keypress: _vm.numberInputHandler,
      input: function ($event) {
        return _vm.$emit("input", $event.target.value);
      }
    }
  })]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 19778:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(26910);
let request = __webpack_require__(49388);
let communicate = __webpack_require__(79560);
let buildTaobaoUrl = __webpack_require__(77342);
let globalData, callbacks;
let hasrun = false;
let timeOUT = 2500;
let getuniqPid = id => {
  if (id == '') return;
  let url = `${G.server}/extension?ac=getuniqpid&nid=${id}`;
  request.get(url).done(data => {
    if (data && data.uniqid) {
      sendPid(id, data.uniqid);
    } else {
      requestTaobaoImgSearch();
    }
  });
};
let sendPid = (id, pid) => {
  let info = {
    'nid': id,
    'uniqid': pid
  };
  communicate.trigger({
    'type': 'getTaobaouniq',
    'info': JSON.stringify(info)
  });
  communicate.on(data => {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data.type == 'getTaobaouniq') {
      let text = $('#gwd_uniq_info').text();
      if (text != '') editData(text);
    }
  });
};
let sortData = data => {
  if (!data.sort) return;
  data = data.sort((value1, value2) => {
    if (Number(value1.price) > Number(value2.price)) return 1;else if (Number(value1.price) == Number(value2.price)) return 0;else return -1;
  });
  return data;
};
let editData = txt => {
  try {
    let data = JSON.parse(txt);
    data = data.mods.recitem.data.items;
    let taobaoarr = [],
      tmallarr = [];
    if (!data) return;
    for (let i = 0, len = data.length; i < len; i++) {
      let item = {};
      let feeDesc = data[i].view_fee == '0.00' ? '包邮' : '';
      item.nick = data[i].nick;
      item.num_iid = data[i].nid;
      item.title = data[i].title;
      item.price = data[i].view_price;
      item.item_location = data[i].item_loc;
      item.store_name = data[i].nick + feeDesc;
      item.pic_url = 'http:' + data[i].pic_url;
      item.volume = data[i].view_sales.replace('人付款', '');
      item.same_style = true;
      let obj = {
        'source': 'same_style',
        'img_url': 'http:' + data[i].pic_url,
        'title': data[i].title,
        'price': data[i].view_price,
        'shop_name': data[i].nick + feeDesc,
        'sales': data[i].view_sales.replace('人付款', ''),
        'id': data[i].nid,
        'url': 'https:' + data[i].detail_url,
        'discuss': data[i].comment_count,
        'istaobao': data[i].detail_url.indexOf('detail.tmall.com') > -1 ? '0' : '1',
        'dp_id': data[i].nid + '-' + (data[i].detail_url.indexOf('detail.tmall.com') > -1 ? '83' : '123'),
        'site_id': data[i].detail_url.indexOf('detail.tmall.com') > -1 ? '83' : '123'
      };
      item.url = buildTaobaoUrl(obj);
      if (data[i].detail_url.indexOf('detail.tmall.com') > -1) {
        tmallarr.push(item);
      } else {
        taobaoarr.push(item);
      }
    }
    taobaoarr = sortData(taobaoarr);
    tmallarr = sortData(tmallarr);
    globalData = {
      'taobao': taobaoarr,
      'tmall': tmallarr
    };
    if (callbacks && !hasrun) {
      callbacks(globalData);
      hasrun = true;
    }
  } catch (e) {}
};
let requestTaobaoImgSearch = () => {
  /*taobao root_id 筛选需要做图片检索的分类*/
  let rootIdArr = ["50510002", "50012029", "50013864", "50011397", "50010404", "1625", "50006842", "50006843", "16", "50011740", "50011699", "50008165", "50008163", "30", "50020857", "50020808", "50013886", "50022517", "122852001", "21", "50468001", "122950001", "50007216"];
  let root_id = G.dp.root_id;
  if (root_id && rootIdArr.indexOf(root_id) > -1) {
    (__webpack_require__(80339).uniqPidGetImg)(data => {
      if (callbacks) {
        callbacks(data);
        hasrun = true;
      } else {
        globalData = data;
      }
    });
    timeOUT = 6000;
  } else {
    timeOUT = 1;
  }
};
let getNid = () => {
  if (location.host.indexOf('taobao') > -1 || location.host.indexOf('tmall') > -1) {
    let id = location.href.match(/[?&]id=([0-9]+)/);
    if (id && id.length) {
      id = id[1];
      getuniqPid(id);
    }
  }
};
module.exports.init = () => {
  /*淘宝价格走势*/
  if (G.site.indexOf('taobao') > -1 || G.site.indexOf('tmall') > -1) {
    communicate.trigger({
      type: 'get_etao_info'
    });
  }
  if (G.site == 'taobao' || G.site == 'tmall') getNid();
};
module.exports.getTaobaouniqData = callback => {
  callback(null);
  // if (globalData) {
  //   callback(globalData)
  //   hasrun = true;
  // } else callbacks = callback;
  // setTimeout(() => {
  //   if (callbacks && hasrun === false) {
  //     callbacks(null)
  //     hasrun = true;
  //   }
  // }, timeOUT)
};

/***/ }),

/***/ 20089:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


module.exports = {
  getString(config, key) {
    let u = 'zh';
    if (G.lang) {
      u = G.lang;
    }
    if (G.ss_name === 'pricedog') {
      u = 'zh-tr';
    }
    return config[key][u];
  }
};

/***/ }),

/***/ 20228:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-row[data-v-ea7ea5c4] {\n  display: flex;\n  flex-direction: row;\n}\n.gwd-inline-row[data-v-ea7ea5c4] {\n  display: inline-flex;\n  flex-direction: row;\n}\n.gwd-column[data-v-ea7ea5c4] {\n  display: flex;\n  flex-direction: column;\n}\n.gwd-inline-column[data-v-ea7ea5c4] {\n  display: inline-flex;\n  flex-direction: column;\n}\n.gwd-align[data-v-ea7ea5c4] {\n  align-content: center;\n  align-items: center;\n}\n.gwd-jcc[data-v-ea7ea5c4] {\n  justify-content: center;\n}\n.gwd-jic[data-v-ea7ea5c4] {\n  justify-items: center;\n}\n.gwd-button[data-v-ea7ea5c4] {\n  outline: none;\n  border: none;\n}\n.bjg-bar-button[data-v-ea7ea5c4] {\n  font-size: 0;\n}\n.bjg-hover-bg[data-v-ea7ea5c4] {\n  background: #fffbef;\n}\n.bjg-bar-button[data-v-ea7ea5c4]:hover {\n  background: #fffbef;\n  cursor: pointer;\n}\n.bjg-bar-button:hover .bjg-window[data-v-ea7ea5c4] {\n  display: block;\n}\n.mainbar-fold .bjg-bar-button[data-v-ea7ea5c4],\n.mainbar-fold #top_coupon_btn[data-v-ea7ea5c4],\n.mainbar-fold .rinfo-btn[data-v-ea7ea5c4],\n.mainbar-fold .gwd-bottom-tmall[data-v-ea7ea5c4] {\n  display: none!important;\n}\n.gwd-font12[data-v-ea7ea5c4] {\n  font-size: 12px;\n}\n.gwd-font14[data-v-ea7ea5c4] {\n  font-size: 14px;\n}\n.gwd-red[data-v-ea7ea5c4] {\n  color: #ff3532;\n}\n.gwd-red-bg[data-v-ea7ea5c4] {\n  background: #ff3532;\n}\n.gwd-hui333[data-v-ea7ea5c4] {\n  color: #333333;\n}\n.gwd-hui999[data-v-ea7ea5c4] {\n  color: #999999;\n}\n.gwd-font10[data-v-ea7ea5c4] {\n  font-size: 12px;\n  transform: scale(0.8333);\n  transform-origin: bottom center;\n}\n.gwd-font11[data-v-ea7ea5c4] {\n  font-size: 12px;\n  transform: scale(0.91666);\n  transform-origin: bottom center;\n}\n.gwd-font9[data-v-ea7ea5c4] {\n  font-size: 12px;\n  transform: scale(0.75);\n  transform-origin: bottom center;\n}\n.gwd-hoverable[data-v-ea7ea5c4]:hover {\n  background: #edf1f2;\n}\n.right-info > *[data-v-ea7ea5c4] {\n  border-left: 1px solid #edf1f2;\n}\n.gwd-red-after-visit[data-v-ea7ea5c4]:hover {\n  color: #e03024 !important;\n}\n.gwd-button[data-v-ea7ea5c4]:hover {\n  filter: brightness(1.1);\n}\n.gwd-button[data-v-ea7ea5c4] {\n  padding-top: 1px;\n  padding-bottom: 1px;\n}\n.gwd-button[data-v-ea7ea5c4]:active {\n  filter: brightness(0.9);\n}\n.gwd-fadeout-5s[data-v-ea7ea5c4] {\n  opacity: 0;\n  transition: opacity 5s;\n}\n.gwd-scrollbar[data-v-ea7ea5c4]::-webkit-scrollbar {\n  width: 6px;\n  border-radius: 17px;\n}\n.gwd-scrollbar[data-v-ea7ea5c4]::-webkit-scrollbar-thumb {\n  border-radius: 17px;\n  background: #999;\n}\n#gwdang_main[data-v-ea7ea5c4],\n.gwdang-main[data-v-ea7ea5c4],\n.bjgext-detail[data-v-ea7ea5c4] {\n  font-size: 12px;\n}\n#gwdang_main button[data-v-ea7ea5c4],\n.gwdang-main button[data-v-ea7ea5c4],\n.bjgext-detail button[data-v-ea7ea5c4] {\n  text-align: center;\n}\n.gwd-width-100[data-v-ea7ea5c4] {\n  width: 100%;\n}\n.gwd-overlay[data-v-ea7ea5c4] {\n  font-family: \"Microsoft YaHei\", \"Arial\", \"SimSun\", serif;\n  font-size: 0;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 999999999;\n}\n.gwd-font-pfm[data-v-ea7ea5c4] {\n  font-family: 'PingFangSC-Medium';\n  font-weight: normal!important;\n}\n@font-face {\n  font-family: 'PingFangSC-Medium';\n  src: local('PingFangSC-Medium');\n}\n.gwd-font-pfm[data-v-ea7ea5c4] {\n  font-family: local('PingFangSC-Medium'), system-ui;\n  font-weight: bold;\n}\n#gwd_minibar svg[data-v-ea7ea5c4],\n.gwdang-main svg[data-v-ea7ea5c4],\n#bjgext_mb_bg svg[data-v-ea7ea5c4],\n#bjgext_mainbar svg[data-v-ea7ea5c4] {\n  fill: transparent;\n}\n.gwd-common-font[data-v-ea7ea5c4] {\n  font-family: 'PingFang SC', 'Microsoft YaHei', '\\5FAE\\8F6F\\96C5\\9ED1', 'Hiragino Sans GB', 'WenQuanYi Micro Hei';\n}\n.gwd-switch[data-v-ea7ea5c4] {\n  position: relative;\n  display: inline-block;\n  width: 40px;\n  height: 22px;\n  box-sizing: border-box !important;\n}\n.gwd-switch input[data-v-ea7ea5c4] {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.gwd-switch .gwd-slider[data-v-ea7ea5c4] {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #bfbfbf;\n  border-radius: 16px;\n}\n.gwd-switch .gwd-slider[data-v-ea7ea5c4]::before {\n  position: absolute;\n  content: \"\";\n  height: 18px;\n  width: 18px;\n  left: 2px;\n  bottom: 2px;\n  background-color: white;\n  border-radius: 50%;\n}\n.gwd-switch input:checked + .gwd-slider[data-v-ea7ea5c4] {\n  background-color: #48befe;\n}\n.gwd-switch input:checked + .gwd-slider[data-v-ea7ea5c4]::before {\n  -webkit-transform: translateX(18px);\n  -ms-transform: translateX(18px);\n  transform: translateX(18px);\n}\n.gwd-allow-animation .gwd-slider[data-v-ea7ea5c4],\n.gwd-allow-animation .gwd-slider[data-v-ea7ea5c4]::before {\n  -webkit-transition: 0.2s;\n  transition: 0.2s;\n}\n", ""]);

// exports


/***/ }),

/***/ 20363:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-minibar-bg {\n  font-size: 12px;\n}\n.gwd-mini-placeholder {\n  display: none;\n}\n.gwd-minibar-element {\n  border-left: 1px solid #e8e8e8;\n  border-right: 1px solid #e8e8e8;\n  border-bottom: 1px solid #e8e8e8;\n}\n.gwd-minibar-element:last-of-type {\n  border-bottom: 1px solid #e8e8e8;\n}\n.gwd-collection-mini {\n  display: none;\n  /*display: flex;*/\n  width: 462px;\n  height: 251px;\n  background: white;\n  border-radius: 2px;\n  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e6e9eb;\n  position: absolute;\n  top: 36px;\n  left: -1px;\n  z-index: 30001;\n  box-sizing: border-box;\n  cursor: default;\n  overflow: visible;\n}\n#gwd_mini_remind:hover .gwd-collection-mini {\n  display: flex;\n}\n", ""]);

// exports


/***/ }),

/***/ 20408:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_2_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(50921);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_2_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_2_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ 20669:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let communicate = __webpack_require__(79560);
let globalData, callbacks;
const buildInfo = () => {
  let obj = {
    type: 'json',
    browser: 'chrome',
    ver: '6.1',
    style_show_type: null,
    style_ADID: null,
    currency: null,
    language: 'english',
    r: 0.7196959139817531,
    url: location.href
  };
  let str = `type=${obj.type}&browser=${obj.browser}&ver=${obj.ver}&style_show_type=undefined&style_ADID=undefined&currency=undefined&language=${obj.language}&r=${obj.r}&url=${encodeURIComponent(location.href)}`;
  return str;
};
const getPriceStatusNew = data => {
  var price_status = 0;
  var price_num = data.length;
  let lowest = Math.min.apply(void 0, data);
  var price_last = data[price_num - 1];
  let islowest = false;
  var change_range = 180;
  let time_length = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    var now_price = data[i];
    if (i > 0) {
      time_length += 1;
    }
    if (now_price == 0) {
      continue;
    }
    if (price_last == now_price) {
      if (time_length > 180) {
        break;
      }
      continue;
    } else if (parseFloat(price_last) > parseFloat(now_price) && i >= price_num - change_range - 1) {
      price_status = 1;
      break;
    } else if (parseFloat(price_last) < parseFloat(now_price)) {
      price_status = -1;
      if (price_last === lowest) islowest = true;
      break;
    }
  }
  return {
    price_status: price_status,
    islowest: islowest,
    price_last: price_last
  };
};
const renderData = data => {
  const getDataFromTime = time => {
    for (let i = 0; i < data.length - 1; i++) {
      if (time >= Number(data[i]['time_update']) * 1000 && time < Number(data[i + 1]['time_update']) * 1000) {
        return data[i].price;
      }
    }
    return data[data.length - 1].price;
  };
  const oneHour = 3600000;
  const oneDay = 24 * oneHour;
  let lowestPrice = Number(globalData.lowest_pice.price);
  let highestPrice = lowestPrice;
  let startTime = Number(data[0].time_update) * 1000;
  let startD = new Date(startTime).getDate();
  let startM = new Date(startTime).getMonth();
  let startY = new Date(startTime).getFullYear();
  let allLine = [];
  let now_day = new Date();
  let current_price = data[data.length - 1].price;
  for (let i = 0; i < data.length; i++) {
    if (Number(data[i].price) > highestPrice) highestPrice = Number(data[i].price);
  }
  let price_range = lowestPrice + '-' + highestPrice;
  let start = startTime;
  while (start <= now_day.getTime()) {
    let s = getDataFromTime(start);
    allLine.push(parseFloat(s));
    start += oneDay;
  }
  let result = getPriceStatusNew(allLine);
  let price_status = result.price_status;
  let year_line = null;
  if (allLine.length >= 365) {
    year_line = allLine.slice(allLine.length - 365);
  }
  let month_line = null;
  if (allLine.length >= 31) {
    month_line = allLine.slice(allLine.length - 31);
  }
  let short_day_line = null;
  if (allLine.length >= 6) {
    let dayline = allLine.slice(allLine.length - 6);
    short_day_line = [];
    for (let i = 0; i < dayline.length - 1; i++) {
      let newArr = [];
      for (let n = 0; n < 24; n++) {
        newArr.push(dayline[i]);
      }
      short_day_line = short_day_line.concat(newArr);
    }
    short_day_line.push(dayline[dayline.length - 1]);
  }
  let price_trend = {
    "price_status": price_status,
    "startD": startD,
    "startM": startM,
    "startY": startY,
    "now_day": now_day.getTime(),
    "extra": 'start from another',
    "store": [{
      "current_price": current_price,
      "all_line": allLine,
      "all_line_begin_time": startTime + 8 * oneHour,
      "year_line": year_line,
      "year_line_time": now_day.getTime() - 365 * oneDay,
      "month_line": month_line,
      "month_line_time": now_day.getTime() - 30 * oneDay,
      "short_day_line": short_day_line,
      "short_day_line_begin_time": now_day.getTime() + 8 * oneHour - 5 * oneDay,
      "min_stamp": "0",
      "islowest": 0,
      "name": 'aliexpress',
      "price_range": price_range,
      "promo": [],
      "all_equal_short": false
    }]
  };
  return price_trend;
};
module.exports.init = () => {
  let str = buildInfo();
  communicate.on(data => {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data.type === 'aliexpress') {
      globalData = JSON.parse(data.value);
      if (globalData.price_tracking) {
        globalData.price_tracking = renderData(globalData.price_tracking);
        if (callbacks) callbacks(globalData.price_tracking);
      }
    }
  });
  communicate.trigger({
    type: 'aliexpress',
    url: 'https://plugin.aliprice.com/plugin/chrome_v07.php?' + str
  });
};
module.exports.getTrendData = callback => {
  if (globalData) callback(globalData);else callbacks = callback;
};

/***/ }),

/***/ 20879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(26910);
let request = __webpack_require__(49388);
let template = __webpack_require__(26133);
var specialFilter = __webpack_require__(22480);
let calWidth = __webpack_require__(42869);
const replaceHref = __webpack_require__(26152);
module.exports.init = function (data) {
  if (G.save_tbres_data != null) {
    this.renderTbres(G.save_tbres_data);
    return;
  }
  var $this = this;
  var code_server = '1';
  var msg = data.exact_arr;
  var code = data['code-server'];
  var price = data.now.price * 100;
  if (!price) {
    price = G.dp.price * 100;
  }
  if (!code) {
    code = {};
    code_server = '0';
  }
  var sitearr = ['amazon', '6pm', 'ebay'];
  if (sitearr.indexOf(G.site) > -1) {
    price = G.dp.price * 100;
  }
  /*日亚 美亚 德亚 在没有品牌的情况下  不请求淘宝客*/
  if (G.site == 'amazon' && !msg.brand && data.now.site_id !== '1') return;
  G.dp.min_price = parseInt(G.dp.min_price * 100);
  G.dp.max_price = parseInt(G.dp.max_price * 100);
  var url = `${G.server}/brwext/tbres?union=${G.union}&url=${encodeURIComponent(msg.url)}&site=${msg.site}&isbn=${msg.isbn}&keywords=${encodeURIComponent(msg.keywords)}&brand=${encodeURIComponent(msg.brand)}&type=${encodeURIComponent(msg.type)}&price=${price}&class_id=${msg.class_id}&name=${encodeURIComponent(G.dp.name)}&code_brand_id=${code.brand_id}&code_clean_title=${encodeURIComponent(code.clean_title)}&code_code=${encodeURIComponent(code.code)}&code_display_brand=${encodeURIComponent(code.display_brand)}&code_brand=${encodeURIComponent(code.brand)}&code_class_id=${encodeURIComponent(code.class_id)}&code_price=${encodeURIComponent(code.price)}&code_spec=${encodeURIComponent(code.spec)}&code-server=${code_server}`;
  request.get(url).then(mm => {
    if (G.site == 'taobao' || G.site == 'tmall' || G.site == 'ai-taobao') {
      $this.getUniqPid(mm, mm => {
        G.save_tbres_data = mm;
        $this.renderTbres(mm);
      });
    } else {
      $this.getImgSearch(mm, mm => {
        G.save_tbres_data = mm;
        $this.renderTbres(mm);
      });
    }
  }).fail(() => {
    if (G.style == 'right') {
      $('#plt-tmall-block').hide();
      $('#plt-taobao-block').hide();
    }
  });
};
module.exports.renderTbres = function (mm) {
  (__webpack_require__(49042).init)(mm.tmall.product, 'tmall');
  (__webpack_require__(49042).init)(mm.taobao.product, 'taobao');
  mm.tmall = specialFilter.tb(mm.tmall);
  mm.taobao = specialFilter.tb(mm.taobao);
  if (G.style == 'top') {
    this.show_taobao_products_top(mm);
    G.fixWidth();
  }
};
module.exports.show_taobao_products_top = function (data) {
  //tmall
  //  from_self 如果为true 说明是用的我们自己的数据， 这个时候销量就是全部的销量 需要改一下。
  debugger;
  let widthObj = calWidth.init();
  var sale_tle = "最近销量";
  if (data.from_self === true) sale_tle = "总销量";
  if (G.lang === 'en') {
    sale_tle = 'Sales: ';
  }
  let tmhtml = __webpack_require__(82059);
  if (typeof data.tmall.min_price != 'undefined' && data.tmall.min_price !== null) {
    if (data.search.is_exact == 0 && G.site.indexOf('taobao') >= 0) {
      var html = $(`#${G.extName}-tmall-dp`).html();
      html = html.replace(/\u5929\u732b/ig, `天猫相似款`);
      $(`#${G.extName}-tmall-dp`).html(html);
    }
    replaceHref.init('tmall', data.tmall.product, '&column=b2c');
    $(`#${G.extName}-tmall-dp .gwd-price`).html(`&yen;` + data.tmall.min_price);
    $(`#${G.extName}-tmall-dp`).show();
    $(`#${G.extName}-tmall-dp-detail`).append(template.compile(tmhtml)({
      data: data.tmall.product,
      s_server: G.s_server,
      width: widthObj.turnpW,
      link: data.tmall.more_link,
      sale_tle: sale_tle,
      allProductW: widthObj.allProductW
    }));
    $('#tmall-prev-page').click(function () {
      G.change_page('tmall', -1);
    });
    $('#tmall-next-page').click(function () {
      G.change_page('tmall', 1);
    });
  }

  //taobao
  if (typeof data.taobao.min_price != 'undefined' && data.taobao.min_price !== null) {
    if (data.search.is_exact == 0 && G.site.indexOf('taobao') >= 0) {
      var html = $(`#${G.extName}-taobao-dp`).html();
      html = html.replace(/\u6dd8\u5b9d/ig, `淘宝相似款`);
      $(`#${G.extName}-taobao-dp`).html(html);
    }
    let tbhtml = __webpack_require__(81376);
    replaceHref.init('taobao', data.taobao.product, '&column=b2c');
    $(`#${G.extName}-taobao-dp .gwd-price`).html('&yen;' + data.taobao.min_price);
    $(`#${G.extName}-taobao-dp`).show();
    $(`#${G.extName}-taobao-dp-detail`).append(template.compile(tbhtml)({
      data: data.taobao.product,
      s_server: G.s_server,
      width: widthObj.turnpW,
      link: data.taobao.more_link,
      allProductW: widthObj.allProductW
    }));
    $('#taobao-prev-page').click(function () {
      G.change_page('taobao', -1);
    });
    $('#taobao-next-page').click(function () {
      G.change_page('taobao', 1);
    });
  }

  /*if (data.search.keywords == '') {
      data.search.keywords = G.dp.name;
  }*/
  if (G.site === 'vipshop') {
    $(`#${G.extName}-search-product`).val(G.dp.cat_name || G.save_dp_query.now.coreword);
  } else {
    if (data.search.keywords == `` && G.dp.isbn != ``) {
      $(`#${G.extName}-search-product`).val(G.dp.isbn);
    }
    if (data.search.keywords != ``) {
      $(`#${G.extName}-search-product`).val(data.search.keywords);
    }
  }
  G.init_item_list('tmall');
  G.set_item_args('tmall');
  G.set_page_args('tmall');
  G.load_image('tmall', 0, G.page_size);
  G.init_item_list('taobao');
  G.set_item_args('taobao');
  G.set_page_args('taobao');
  G.load_image('taobao', 0, G.page_size);
};
module.exports.getImgSearch = function (msg, callback) {
  let buildTaobaoUrl = __webpack_require__(77342);
  msg = buildTaobaoUrl.buildCommon(msg);
  if (G.btype == 'luyou') {
    callback(msg);
    return;
  }
  let dataShare = __webpack_require__(34810);
  let brandId = dataShare.get('dp_data') && dataShare.get('dp_data')['exact_arr']['brand_id'];
  if (G.site == '360buy' && brandId && (!msg.taobao.sort || !msg.tmall.sort)) {
    // 在京东有brand 有比价结果的情况下， 不走图片检索
    callback(msg);
    return;
  }
  (__webpack_require__(80339).init)(data => {
    if (data) {
      if (msg.tmall.sort) msg.tmall = {};
      if (data.tmall.length > 0) {
        msg.tmall.min_price = data.tmall[0].price;
        msg.tmall.max_price = data.tmall[data.tmall.length - 1].price;
        msg.tmall.store = data.tmall;
        msg.tmall.product = data.tmall;
      }
      if (data.taobao.length > 0) {
        msg.taobao.product = data.taobao;
        msg.taobao.store = data.taobao;
        msg.taobao.min_price = data.taobao[0].price;
        msg.taobao.max_price = data.taobao[data.taobao.length - 1].price;
      }
      if (!msg.tmall.more_link) msg.tmall.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      if (!msg.taobao.more_link) msg.taobao.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      callback(msg);
    } else {
      callback(msg);
    }
  });
};
module.exports.getUniqPid = function (msg, callback) {
  let buildTaobaoUrl = __webpack_require__(77342);
  msg = buildTaobaoUrl.buildCommon(msg);
  if (G.btype == 'luyou') {
    callback(msg);
    return;
  }
  (__webpack_require__(19778).getTaobaouniqData)(data => {
    if (data) {
      if (msg.tmall.sort) msg.tmall = {};
      if (data.tmall.length > 0) {
        msg.tmall.min_price = data.tmall[0].price;
        msg.tmall.max_price = data.tmall[data.tmall.length - 1].price;
        msg.tmall.store = data.tmall;
        msg.tmall.product = data.tmall;
      }
      if (data.taobao.length > 0) {
        msg.taobao.product = data.taobao;
        msg.taobao.store = data.taobao;
        msg.taobao.min_price = data.taobao[0].price;
        msg.taobao.max_price = data.taobao[data.taobao.length - 1].price;
      }
      if (!msg.tmall.more_link) msg.tmall.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      if (!msg.taobao.more_link) msg.taobao.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      callback(msg);
    } else {
      callback(msg);
    }
  });
};

/***/ }),

/***/ 21094:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "a[data-v-12202de2] {\n  color: #ff4449;\n}\nbutton[data-v-12202de2] {\n  width: 94px;\n  height: 32px;\n  border-radius: 29px;\n  opacity: 1;\n  border: 1px solid rgba(64, 69, 81, 0.3);\n  background-color: transparent;\n  font-size: 14px;\n  text-align: center;\n  color: #666666;\n  cursor: pointer;\n  margin-left: 28px;\n  margin-right: 28px;\n}\n.gwd-red[data-v-12202de2] {\n  border: 1px solid #ff4449;\n  color: #ff4449;\n}\n.gwd-permission-hint[data-v-12202de2] {\n  width: 303px;\n  height: 36px;\n  line-height: 36px;\n  text-align: center;\n  background: #fff9ed;\n  font-size: 13px;\n  color: #ff9706;\n  margin-top: -50px;\n  margin-bottom: 57px;\n  border-radius: 8px;\n}\n.gwd-bjg .gwd-red[data-v-12202de2] {\n  border: 1px solid #ff9706;\n  color: #ff9706;\n}\n", ""]);

// exports


/***/ }),

/***/ 21323:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {
  props: ['data', 'domclass', 'aliSite']
};

/***/ }),

/***/ 22223:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("svg", {
    attrs: {
      width: "48px",
      height: "24px",
      viewBox: "0 0 48 24",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink"
    }
  }, [_c("g", {
    attrs: {
      id: "Page-1",
      stroke: "none",
      "stroke-width": "1",
      fill: "none",
      "fill-rule": "evenodd"
    }
  }, [_c("g", {
    attrs: {
      id: "店铺券-点击",
      transform: "translate(-1135.000000, -340.000000)"
    }
  }, [_c("g", {
    attrs: {
      id: "箭头3",
      transform: "translate(1135.000000, 340.000000)"
    }
  }, [_c("g", {
    attrs: {
      id: "编组-2",
      opacity: "0.900000036",
      transform: "translate(24.000000, 0.000000)"
    }
  }, [_c("g", {
    attrs: {
      id: "编组"
    }
  }, [_c("rect", {
    attrs: {
      id: "矩形",
      "fill-opacity": "0.01",
      fill: "#FFFFFF",
      "fill-rule": "nonzero",
      x: "0",
      y: "0",
      width: "24",
      height: "24"
    }
  }), _vm._v(" "), _c("polyline", {
    attrs: {
      id: "路径",
      stroke: _vm.color,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      points: "9.5 6 15.5 12 9.5 18"
    }
  })])]), _vm._v(" "), _c("g", {
    attrs: {
      id: "编组-2备份",
      opacity: "0.5",
      transform: "translate(12.000000, 0.000000)"
    }
  }, [_c("g", {
    attrs: {
      id: "编组",
      opacity: "0.900000036"
    }
  }, [_c("rect", {
    attrs: {
      id: "矩形",
      "fill-opacity": "0.01",
      fill: "#FFFFFF",
      "fill-rule": "nonzero",
      x: "0",
      y: "0",
      width: "24",
      height: "24"
    }
  }), _vm._v(" "), _c("polyline", {
    attrs: {
      id: "路径",
      stroke: _vm.color,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      points: "9.5 6 15.5 12 9.5 18"
    }
  })])]), _vm._v(" "), _c("g", {
    attrs: {
      id: "编组-2备份-2",
      opacity: "0.200000003"
    }
  }, [_c("g", {
    attrs: {
      id: "编组",
      opacity: "0.900000036"
    }
  }, [_c("rect", {
    attrs: {
      id: "矩形",
      "fill-opacity": "0.01",
      fill: "#FFFFFF",
      "fill-rule": "nonzero",
      x: "0",
      y: "0",
      width: "24",
      height: "24"
    }
  }), _vm._v(" "), _c("polyline", {
    attrs: {
      id: "路径",
      stroke: _vm.color,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      points: "9.5 6 15.5 12 9.5 18"
    }
  })])])])])])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 22932:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XX: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_3_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_template_id_40244662_scoped_true__WEBPACK_IMPORTED_MODULE_0__.XX),
/* harmony export */   Yp: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_3_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_template_id_40244662_scoped_true__WEBPACK_IMPORTED_MODULE_0__.Yp)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_3_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_3_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_template_id_40244662_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1717);


/***/ }),

/***/ 23107:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const userData = __webpack_require__(74222);
const template = __webpack_require__(26133);
const userCenter = __webpack_require__(76904);
const request = __webpack_require__(49388);
const log = __webpack_require__(35743);
const cnzz = __webpack_require__(5300);
const utils = __webpack_require__(30888);
const price_remind = __webpack_require__(57031);
let globalFavor = {},
  reqCallbacks = [],
  hasReq;
const getRemindStyle = async callback => {
  if (G.remindInfo) {
    callback(G.remindInfo);
    return;
  }
  if (hasReq) {
    reqCallbacks.push(callback);
    return;
  }
  hasReq = true;
  // let dp_id = G.now_dp_id;
  // if (dp_id.indexOf('-') === -1) {
  //   dp_id = dp_id + '-' + G.site_id;
  // }
  let dp_id = G.dp.itemId;
  await (__webpack_require__(41761).met)('collectionDetailAllowed');
  userCenter.detail(dp_id).then(res => {
    setTimeout(() => {
      if ($('#gwd_mini_remind').is(':hover')) {
        onHoverContent();
      }
    });
    if (!res.data) {
      callback({});
      G.remindInfo = {};
      if (reqCallbacks.length > 0) {
        for (let i = 0; i < reqCallbacks.length; i++) {
          reqCallbacks[i]({});
        }
      }
      return;
    } else {
      let msg = {
        remind_price: res.data.notifier.threshold,
        is_collected: res.data.id,
        has_remind_type: res.data.notifier.type,
        remind_type: res.data.notifier.type,
        notify_site: res.data.notifier.site
      };
      G.remindInfo = msg;
      console.log('remindInfo got');
      callback(msg);
      if (reqCallbacks.length > 0) {
        for (let i = 0; i < reqCallbacks.length; i++) {
          reqCallbacks[i](msg);
        }
      }
    }
  });
  // callback(G.productChecked)
  // let url = `${G.c_server}/api/remind_setting?action=get&email=${G.email}&dp_id=${dp_id}`;
  // request.get(url).done((msg) => {
  //   G.remindInfo = msg;
  //   if (msg.remind_price) {
  //     msg.remind_price = msg.remind_price / 100
  //   }
  //   callback(msg)
  //   if (reqCallbacks.length > 0) {
  //     for (let i = 0; i < reqCallbacks.length; i++) {
  //       reqCallbacks[i](msg)
  //     }
  //   }
  // })
};
const check_favor = async id => {
  // debugger
  if (!G.userLogin || !id) return;
  // let url = `${G.c_server}/brwext/check_collected?email=${G.email}&dp_id=${id}`
  // request.get(url).done((data) => {
  await (__webpack_require__(41761).met)('checked_data_got');
  if (G.productChecked && G.productChecked.collected) {
    $('#gwd_mini_remind .minibar-btn-box span').text('已添加提醒');
    $('#gwd_mini_remind .minibar-btn-box em').addClass('favored');
    $('#topfavor_detail .topf-head .sp-col').text('收藏成功').addClass('collected');
    $('#ht_favor').text('收藏成功').addClass('collected');
  }
  // })
};
const loginAfterRender = () => {
  $('.bjd-login-box, .login-content').hide();
  $('.gwd-common-login').hide();
  $('.bjd-jiangjia-re').show();
  check_favor(G.now_dp_id);
  (__webpack_require__(57031).renderAgain)();
  getRemindStyle(msg => {
    if (msg) {
      globalFavor.is_collected = msg.is_collected;
      if (msg.has_remind_type) {
        $(`.select-item`).removeClass('selected');
        $('#bjd_minifavor_content').addClass('bjd_choosed');
        $('#favor_box').addClass('favor_choosed');
        $(`.jj-style .select-item[data-type="${msg.remind_type}"]`).addClass('selected');
        $('.gwd-del-collection').css('display', 'block');
      } else {
        $('.jj-style .select-item[data-type="1"]').addClass('selected');
      }
      //msg.notify_site = msg.notify_site;
      $(`.jj-remind .select-item[data-type="${msg.notify_site}"]`).addClass('selected');
      if (msg.remind_price) $(`.jj-remind .select-item[data-type="${msg.notify_site}"]`).parent().find('input').val(msg.remind_price);
      $('.jj-style .re-mail').val(G.email);
    }
  });
  $('#gwd-topText').css('display', 'none');
  $('.gwd-not-login').removeClass('gwd-not-login');
  $(`#plotArea_${G.from_device}`).removeClass('gwd-blurLayer');
};
$('body').on('gwd-login-complete', c => {
  let e = c.originalEvent;
  console.log(e);
  // G.email = e.detail.uid;
  // G.userLogin = true;
  utils.setLocal('email', e.detail.uid);
  loginAfterRender();
});
const userLogin = () => {};
let hasLoginRender;
const onHoverContent = () => {
  price_remind.getQRcode();
  if (G.userLogin && !hasLoginRender) {
    loginAfterRender();
    hasLoginRender = true;
  }
  $(`#gwd_mini_remind`).addClass('mshover');
  $(`#gwd_mini_remind em`).addClass('collect_hover');
  $('html').addClass('bjd-favor-show');
  $('#bjd_minifavor_content').show();
};
const miniFavorEvent = () => {
  let forbidHide;
  let msStyle = 'click';
  if (G.userLogin) msStyle = 'mouseenter';
  $('.remindHint').hide();
  $(`#gwd_mini_remind`).on(msStyle, () => {
    onHoverContent();
  }).on('mouseleave', e => {
    if (forbidHide) return;
    setTimeout(() => {
      $(`#gwd_mini_remind`).removeClass('mshover');
      $(`#gwd_mini_remind em`).removeClass('collect_hover');
      $('html').removeClass('bjd-favor-show');
      $('#bjd_minifavor_content').hide();
    }, 200);
  });

  // $('#bjd_minifavor_content').on('mouseenter', () => {
  //   clearTimeout(mTime1);
  //   clearTimeout(mTime2);
  // })
  // $('#bjd_minifavor_content').on('mouseleave', (e) => {
  //   if (forbidHide) return;
  //   mTime2 = setTimeout(function() {
  //     $(`#gwd_mini_remind`).removeClass('mshover')
  //     $(`#gwd_mini_remind em`).removeClass('collect_hover')
  //     $('html').removeClass('bjd-favor-show')
  //     $('#bjd_minifavor_content').hide()
  //   }, 200)
  // })
  $('#bjd_minifavor_content input').on('focus', function () {
    forbidHide = true;
    setTimeout(function () {
      forbidHide = false;
    }, 300);
  });
  $('.jiangjia-left .select-item').on('click', function () {
    $(this).parent().parent().find('.select-item').removeClass('selected');
    $(this).addClass('selected');
  });
  $('#edit_re_style').on('click', () => {
    $('#bjd_minifavor_content').removeClass('bjd_choosed');
  });
  $('#loginClickBtn').on('click', () => {
    let userN = $('#bjd_minifavor_content .username').val();
    let psd = $('#bjd_minifavor_content .password').val();
    if (userN && psd) {
      price_remind.loginRenderTop();
      userLogin(userN, psd);
    } else {
      $('#login_remind_tle').css('display', 'block').fadeOut(5000);
      return;
    }
  });
  $('#subbtn').on('click', () => {
    let ischoosed = $('#bjd_minifavor_content').hasClass('bjd_choosed');
    if (!ischoosed) {
      let remind_email;
      let remind_type = $('.jj-style .select-item.selected').attr('data-type');
      if (remind_type === '1') {
        remind_email = $('.jj-style .re-mail').val();
        if (!remind_email) {
          $('#error_remind_tle').text('请输入正确的邮箱地址').css('display', 'block').fadeOut(5000);
          return;
        }
      }
    }
    let dom = $('.jj-remind .select-item.selected');
    let notify_site = dom.attr('data-type');
    let price = dom.parent().find('input').val();
    if (price === '') {
      $('#error_remind_tle').text('请输入商品期望价格').css('display', 'block').fadeOut(5000);
      return;
    } else if (Number(price) <= 0 || !price.match(/(?:^\d+$|^\d+\.\d{1,2}$)/)) {
      $('#error_remind_tle').text('请输入正确格式的价格').css('display', 'block').fadeOut(5000);
      return;
    } else if (globalFavor.nowprice && Number(price) > globalFavor.nowprice) {
      $('#error_remind_tle').text('价格不能高于当前商品价格').css('display', 'block').fadeOut(5000);
      return;
    }
    log('mini-favor-detail-btn-click');
    cnzz.log('mini-favor-detail-btn-click');
    /*notify_site => 0 全网 1 当前网站*/
    add_favor(notify_site, price);
    // $('#bjd_minifavor_content').hide().addClass('bjd_choosed')
  });
  $('.jj-remind-logo').on('click', () => {
    log('allsite-lowpri-click');
    cnzz.log('allsite-lowpri-click');
  });
  $('.gwd-del-collection').on('click', () => {
    delFavor();
  });
};
const setNotifyPrice = (notify_site, notify_price) => {
  let allAddClass = (selector, className) => {
    $(selector).each(function () {
      $(this).addClass(className);
    });
  };
  let allVal = (selector, value) => {
    $(selector).each(function () {
      $(this).val(value);
    });
  };
  G.collectionChanged = true;
  // $(`#${G.extBrand}_add_favor`).text('收藏成功').show().fadeout(2000);
  /*收起价格走势*/
  // $(`#${G.extName}-trend-detail`).hide()
  $('.remindHint').show().fadeOut(2000);
  //设置嵌入页面的内容同步变化
  $(`#gwd_mini_remind .minibar-btn-box span`).text(`已添加提醒`);
  $('#gwd_mini_remind .minibar-btn-box em').addClass('favored');
  $('.remind-item.current-selected').removeClass('current-selected');
  $('.remind-item .select-item').removeClass('selected');
  let n = parseInt(notify_site);
  if (n) {
    allAddClass('.remind-item-snd', 'current-selected');
    allAddClass('.remind-item-snd .select-item', 'selected');
    allVal('.remind-item-snd input', notify_price);
  } else {
    allAddClass('.remind-item-fst', 'current-selected');
    allAddClass('.remind-item-fst .select-item', 'selected');
    allVal('.remind-item-fst input', notify_price);
  }
};
const delFavor = () => {
  userCenter.delete().then(res => {
    if (res.code !== 1) return;
    $('.remind-item.current-selected').removeClass('current-selected');
    $('#gwd_mini_remind .minibar-btn-box em').removeClass('favored');
    $(`#gwd_mini_remind .minibar-btn-box span`).text(`降价提醒`);
    $('.gwd-del-collection').css('display', 'none');
    G.remindInfo = {};
    userCenter.clearCurrent();
  });
};
const add_favor = (notify_site, notify_price) => {
  notify_site = notify_site || '';
  notify_price = notify_price || '';
  let dp_id = globalFavor['dp_query'].dp.dp_id;
  let site_id = globalFavor['dp_query'].dp.site_id;
  let dp = globalFavor['dp_query'].dp;
  let price = G.dp.oldPrice;
  let title = G.dp.name || $('title').html();
  $(`#${G.extBrand}_add_favor`).text('正在收藏');
  if (price == "" || price <= 0) {
    var nprice = G.price;
    price = nprice;
  }
  let is_collected = '0';
  if (globalFavor.is_collected) {
    is_collected = '1';
  }
  if (G.site_id == '83' || G.site_id === '123') dp.dp_id = dp.dp_id + '-' + G.site_id;
  (__webpack_require__(76904).add)(notify_price, notify_site).then(msg => {
    $(`#${G.extBrand}_add_favor`).text('收藏该商品');
    if (msg.code === 100 || msg.code <= 0) {
      $(`#${G.extBrand}_add_favor`).hide();
      $(`#${G.extBrand}_favor_item_list`).empty().hide();
      //$('#${G.extBrand}_favor_num').text(' N')
      $(`#${G.extBrand}-favor-detail .${G.extBrand}-login-info`).show();
    } else if (msg.code === 1) {
      setNotifyPrice(notify_site, notify_price);
      if (!msg.data) {
        G.remindInfo.remind_price = notify_price;
        G.remindInfo.notify_site = notify_site;
      } else {
        let data = {
          remind_price: msg.data.notifier.threshold,
          is_collected: msg.data.id,
          has_remind_type: msg.data.notifier.type,
          remind_type: msg.data.notifier.type,
          notify_site: msg.data.notifier.site
        };
        G.remindInfo = data;
        $('.gwd-del-collection').css('display', 'block');
      }

      // 更新本地收藏存储
      // utils.addFavorCheck()
    } else if (msg.code === 2) {
      $(`#gwd_mini_remind .minibar-btn-box span`).text(`已添加提醒`);
      $('#gwd_mini_remind .minibar-btn-box em').addClass('favored');
    }
  }).catch(() => {
    $(`#${G.extBrand}_add_favor`).text('收藏商品');
  });
};
let updateTimes = 0;
const updatePrice = async () => {
  if (globalFavor.nowprice) return;
  if (updateTimes > 5) return;
  updateTimes++;
  const nowPrice = await (__webpack_require__(41761).met)('NowPrice');
  if (nowPrice && nowPrice > 0 && Number($('.jj-remind .remind-item-snd input').val())) {
    globalFavor.nowprice = nowPrice;
    if (!globalFavor.allprice) {
      globalFavor.allprice = nowPrice;
      $('.jj-remind .remind-item input').val(nowPrice);
    }
    $('.jj-remind .remind-item-snd input').val(nowPrice);
  }
};
module.exports.init = async () => {
  await (__webpack_require__(41761).met)('dp_query_set');
  await (__webpack_require__(41761).met)('GwdDpIdGot');
  let dp_query = userData.get('dp_query');
  let other_info = userData.get('other_info');
  globalFavor['other_info'] = other_info;
  globalFavor['dp_query'] = dp_query;
  let minidom = `#gwd_mini_remind`;
  let choosed, remind_type, lowestUrl;
  let emailvalue = G.email;
  if (!other_info.now.dp_id) return;
  let url = encodeURIComponent(location.href);
  //let nowprice = other_info['code-server'] && other_info['code-server'].price || G.dp.price;
  let nowprice = await (__webpack_require__(41761).met)('NowPrice');
  if (G.aliSite && G.dp.price) nowprice = G.dp.price;
  let allprice = dp_query.b2c.min_price || nowprice;
  if (!allprice) allprice = nowprice;
  nowprice = Number(nowprice.toString().replace(',', ''));
  allprice = Number(allprice.toString().replace(',', ''));
  if (dp_query.b2c.product && dp_query.b2c.product.length !== 0) {
    lowestUrl = dp_query.b2c.product[0].url;
    log('allsite-lowpri-show');
    cnzz.log('allsite-lowpri-show');
  }
  // else if (dp_query.b2c.store && dp_query.b2c.store.length !== 0) {
  //   lowestUrl = dp_query.b2c.store[0].product[0].url;
  //   log('allsite-lowpri-show');
  //   cnzz.log('allsite-lowpri-show')
  // }
  globalFavor.nowprice = nowprice;
  if (G.userLogin) {
    setTimeout(() => {
      $('#gwdang-trend').hover(() => {
        (__webpack_require__(41761).setMet)('collectionDetailAllowed');
      });
    }, 0);
  }
  let html = __webpack_require__(78180);
  await (__webpack_require__(30888).waitForConditionFn)(() => {
    return $(`#mini_price_history`).length;
  });
  if (G.userLogin) {
    check_favor(other_info.now.dp_id);
    setTimeout(() => {
      $('#gwd_mini_remind').hover(() => {
        (__webpack_require__(41761).setMet)('collectionDetailAllowed');
      });
    }, 0);
    getRemindStyle(msg => {
      if (msg.has_remind_type) {
        choosed = true;
      }
      if (msg.is_collected) {
        globalFavor.is_collected = msg.is_collected;
        if (parseInt(msg.notify_site) === 1) nowprice = msg.remind_price;else allprice = msg.remind_price;
      }
      if (!allprice) allprice = nowprice;
      globalFavor.notify_site = msg.notify_site;
      globalFavor.allprice = allprice;
      remind_type = msg.remind_type || '0';
      // if (G.email.indexOf(`${G.extName}.com`) > -1)
      //   emailvalue = '';
      if (G.userLogin) {
        G.email = 1;
      }
      let config = (__webpack_require__(22209).getMoneyInfo)(G.logsite);
      let currency = '元';
      if (config) {
        currency = config[1];
      }
      let dom = template.compile(html)({
        choosed: choosed,
        email: G.email,
        emailvalue: emailvalue,
        url: url,
        lowestUrl: lowestUrl,
        notify_site: globalFavor.notify_site,
        nowprice: nowprice,
        allprice: allprice,
        remind_type: remind_type,
        extName: G.extName,
        currency: currency
      });
      if (globalFavor.notify_site === undefined) {
        setTimeout(() => {
          $('.remind-item-snd .select-item').addClass('selected');
        }, 1000);
      }
      $(minidom).append(dom);
      check_favor(other_info.now.dp_id);
      miniFavorEvent();
    });
  } else {
    let dom = template.compile(html)({
      choosed: choosed,
      email: G.userLogin,
      emailvalue: emailvalue,
      url: url,
      lowestUrl: lowestUrl,
      notify_site: globalFavor.notify_site,
      nowprice: nowprice,
      allprice: allprice,
      remind_type: remind_type,
      extName: G.extName
    });
    $(minidom).append(dom);
    miniFavorEvent();
    const CommonLogin = (__webpack_require__(36664)["default"]);
    new Vue({
      el: '#gwd-login-mini',
      render: h => h(CommonLogin, {
        props: {
          position: 'gwd-mini',
          showAlterLogin: true,
          alterLoginPosition: 'row'
        }
      })
    });
  }
  // let dom = template.compile(html)({
  //   choosed: choosed,
  //   email: '',
  //   emailvalue: '',
  //   url: url,
  //   lowestUrl: lowestUrl,
  //   notify_site: G.remindInfo.remind_type,
  //   nowprice: nowprice,
  //   allprice: allprice,
  //   remind_type: remind_type,
  //   extName: G.extName
  // })
  // $(minidom).append(dom)
  // miniFavorEvent()
  updatePrice();
};
module.exports.getRemindStyle = getRemindStyle;
module.exports.add_favor = add_favor;
module.exports.setNotifyPrice = setNotifyPrice;

/***/ }),

/***/ 23641:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3320);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("4c22e37f", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 23752:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


let communicate = __webpack_require__(79560);
module.exports.ready = () => {
  let arr = ['www.amazon.com', 'www.amazon.de', 'www.amazon.co.jp'];
  if (arr.indexOf(location.host) == -1) return;
  let info = {
    'name': G.dp.name || '',
    'price': G.dp.oldPrice || '0'
  };
  communicate.trigger({
    type: 'getAmazonPriceTrend',
    'info': JSON.stringify(info)
  });
};

/***/ }),

/***/ 23807:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwd-member-coupon-top gwd-member-coupon",
    attrs: {
      href: _vm.link,
      target: "_blank",
      title: "点击领取"
    }
  }, [_c("span", {
    staticStyle: {
      color: "white",
      "margin-left": "5px"
    }
  }, [_vm._v(_vm._s(_vm.getText("当前商品可领会员券")))]), _vm._v(" "), _c("span", {
    staticStyle: {
      color: "white",
      "margin-left": "9px",
      "margin-right": "9px"
    }
  }, [_vm._v(_vm._s(_vm.getText("立即领取")))]), _vm._v(" "), _vm.qr ? _c("div", {
    staticClass: "gwd-qr-container"
  }, [_c("img", {
    staticStyle: {
      "margin-top": "7px",
      width: "120px",
      height: "120px"
    },
    attrs: {
      src: _vm.qr,
      alt: ""
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      "margin-top": "4px",
      "text-align": "center"
    }
  }, [_c("span", {
    staticStyle: {
      "font-weight": "bold",
      color: "#ff6132",
      "font-size": "14px"
    }
  }, [_vm._v(_vm._s(_vm.getText("手淘扫码")))]), _vm._v(" "), _c("span", {
    staticStyle: {
      "margin-left": "4px",
      color: "#333333",
      "font-size": "12px"
    }
  }, [_vm._v(_vm._s(_vm.getText("联系客服领取")))])])]) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 23891:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
var __WEBPACK_AMD_DEFINE_RESULT__;

__webpack_require__(3362);
!(__WEBPACK_AMD_DEFINE_RESULT__ = (() => {
  let originPrice = 0;
  let originPricePattern = {
    '360buy': '#page_maprice',
    'suning': ['del.small-price', 'del', '#itemPrice>del'],
    'amazon': ['.digital-list-price>td>.a-text-strike', '.a-span12.a-color-secondary.a-size-base', '.a-text-strike'],
    'yougou': 'del:eq(0)',
    'dangdang': ['.price_m:eq(0)', '.d15_price_info .price_pc .price_m'],
    'vipshop': '.J-mPrice',
    'keede': '.message_price_kd',
    'feiniu': 'del.fn-rmb-num:eq(0)',
    'kaola': '#js_marketPrice',
    '111': 'del',
    'jiuxian': 'del',
    'yintai': '.mk-num',
    'beibei': '.strike[op-value="originPrice"]',
    'bookschina': 'td:eq(19)',
    'tmall': ['.tb-rmb-num', '.tm-tagPrice-panel .tm-price', '.tm-price-panel .tm-price'],
    'taobao': '#J_StrPrice>em.tb-rmb-num',
    'taobao-95095': '.tm-price-panel .tm-price:eq(0)',
    'lefeng': '.marketPrice-s'
  };

  //let all_equal_short = false;

  let patternUsed = '';
  if (originPricePattern[G.site] != undefined) {
    let pattern = originPricePattern[G.site];
    if (pattern instanceof Array) {
      pattern.forEach(i => {
        let element = $(i);
        let len = $(i).toArray().length;
        if (len > 1) {
          element = $(i + `:eq(${len - 1})`);
        }
        if (originPrice) return;
        if (!element || !element.text()) return;
        let priceText = element.text();
        if (priceText.trim) {
          priceText = priceText.trim();
        }
        let price = parseFloat(priceText.replace(',', '').replace('￥', '').replace('¥', '').replace('$', '').replace(',', ''));
        originPrice = price;
        patternUsed = i;
      });
    } else {
      let element = $(pattern);
      if (element && element.text().length > 0) {
        let priceText = element.text();
        if (priceText.trim) {
          priceText = priceText.trim();
        }
        let price = parseFloat(priceText.replace(',', '').replace('￥', '').replace('¥', '').replace(',', ''));
        //
        originPrice = price;
        patternUsed = pattern;
      }
    }
  }

  // tmall.hk
  if (location.host === 'detail.tmall.hk') {
    originPrice = $('span.tm-price:eq(0)').text();
    let unitText = $('em.tm-yen:eq(0)').text();
    if (unitText === '₩' || unitText === 'NT$' || $('span.tm-price:eq(0)').css('text-decoration') && $('span.tm-price:eq(0)').css('text-decoration').indexOf('line-through') === -1) {
      originPrice = null;
    }
    let try2 = $('.wrtoriginprice .tm-price').text();
    if (try2) {
      originPrice = try2;
    }
  }

  // 淘宝需特殊处理
  let jstrprice = $('#J_StrPrice').text() && $('#J_StrPrice').css('text-decoration').toString().indexOf('line-through') === -1;
  if ((G.site === 'taobao' || G.site === 'tmall' || G.site === 'taobao-95095') && (jstrprice || G.site === 'tmall' && $('#J_StrPriceModBox').css('display') === 'none')) {
    if (patternUsed === '.tm-price-panel .tm-price' || patternUsed === '#J_StrPrice>em.tb-rmb-num') {
      originPrice = null;
    }
  }
  if (G.site === 'taobao' || G.site === 'tmall' || G.site === 'taobao-95095') {
    let e = $(patternUsed);
    if (e.css('text-decoration') && e.css('text-decoration').toString().indexOf('line-through') === -1) {
      if (G.site === 'taobao') {
        if (e.parent().css('text-decoration').toString().indexOf('line-through') === -1) {
          originPrice = null;
        }
      } else {
        originPrice = null;
      }
    }
  }
  if (G.site === 'bookschina') {
    let s = $('td').toArray().map(i => i.innerText);
    let pos = s.indexOf('定    价：');
    originPrice = s[pos + 1];
  }
  let type = null;
  if (location.host === 'www.amazon.co.jp') {
    type = 'JPY';
  }
  originPrice = __webpack_require__(86421)(originPrice, type);
  originPrice = parseFloat(originPrice);
  return originPrice;
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 24139:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(94634);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("6aaaa7e6", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 24197:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const template = __webpack_require__(26133);
const request = __webpack_require__(49388);
let log = __webpack_require__(35743);
let cnzz = __webpack_require__(5300);
const userData = __webpack_require__(74222);
const store = __webpack_require__(92771);
const {
  default: MiniBarCollectionButton
} = __webpack_require__(43642);
var country = 'us';
var timer, timer2;
var HOST;
var htX, htY, mouseDownX;
var sizeDict = {
  '米': 3000,
  '厘米': 30,
  '毫米': 3,
  '英尺': 914.4,
  '英寸': 76.2,
  '码': 2743.2,
  '尺': 1000,
  '寸': 100,
  '分': 10,
  '厘': 1
};
let clothesDict = {
  'shangyi': {
    'us': {
      'man': ['us_man_sz.jpg', 'us_man_sz2.jpg'],
      'woman': ['us_woman_sz.jpg', 'us_woman_sz2.jpg']
    },
    'uk': {
      'man': ['uk_man_sz.jpg', 'uk_man_sz2.jpg'],
      'woman': ['uk_woman_sz.jpg', 'uk_woman_sz2.jpg']
    },
    'jp': {
      'man': ['jp_man_sz.jpg', 'jp_man_sz2.jpg'],
      'woman': ['jp_woman_sz.jpg', 'jp_woman_sz2.jpg']
    }
  },
  'xiazhuang': {
    'us': {
      'man': ['us_man_xz.jpg', 'us_man_xz2.jpg'],
      'woman': ['us_woman_xz.jpg', 'us_woman_xz2.jpg']
    },
    'uk': {
      'man': ['uk_man_xz.jpg', 'uk_man_xz2.jpg'],
      'woman': ['uk_woman_xz.jpg', 'uk_woman_xz2.jpg']
    },
    'jp': {
      'man': ['jp_man_xz.jpg', 'jp_man_xz2.jpg'],
      'woman': ['jp_woman_xz.jpg', 'jp_woman_xz2.png']
    }
  },
  'kidscloth': {
    'us': ['us_kids.jpg', 'us_kids2_0.jpg', 'us_kids2_4.jpg'],
    'uk': ['uk_kids.jpg', 'uk_kids2_0.jpg', 'uk_kids2_4.jpg'],
    'jp': ['jp_kids.jpg', 'jp_kids2_4.jpg', 'jp_kids2_4.jpg']
  },
  'shoes': {
    'man': ['woman_shoes_1.jpg', 'man_shoes2.jpg'],
    'woman': ['woman_shoes_1.jpg', 'woman_shoes2.jpg'],
    'kids': ['kids_shoes.jpg', 'kids_shoes2_0.jpg', 'kids_shoes2_4.jpg']
  }
};
let sitePattern = {
  'www.amazon.com': {
    'coun': 'us',
    'dom': ['#corePriceDisplay_desktop_feature_div', '#price_feature_div', '#unifiedPrice_feature_div', '#tmmSwatches'],
    'position': 'after'
  },
  'www.amazon.co.jp': {
    'coun': 'jp',
    'dom': ['#corePriceDisplay_desktop_feature_div', '#price_feature_div', '#unifiedPrice_feature_div'],
    'position': 'after'
  },
  'www.amazon.fr': {
    'coun': 'fr',
    'dom': ['#corePriceDisplay_desktop_feature_div', '#price_feature_div', '#unifiedPrice_feature_div'],
    'position': 'after'
  },
  'www.amazon.de': {
    'coun': 'uk',
    'dom': ['#corePriceDisplay_desktop_feature_div', '#price_feature_div', '#unifiedPrice_feature_div'],
    'position': 'after'
  },
  'www.amazon.co.uk': {
    'coun': 'uk',
    'dom': ['#corePriceDisplay_desktop_feature_div', '#price_feature_div', '#unifiedPrice_feature_div'],
    'position': 'after'
  },
  'www.amazon.ca': {
    'coun': 'uk',
    'dom': ['#corePriceDisplay_desktop_feature_div', '#price_feature_div', '#unifiedPrice_feature_div'],
    'position': 'after'
  },
  'www.6pm.com': {
    'coun': 'us',
    'dom': ['.mGIQz', '#itemInformation'],
    'position': 'before'
  }
};
const insertSize = (headimg, itemimg) => {
  /*插入尺码帮助内容*/
  var Html = `<img src="http://s1.${G.extName}.com/images/extensions/{{imgurl}}">`;
  $('.size_s').empty().append(template.compile(Html)({
    'imgurl': headimg
  }));
  $('.size_item_img').empty().append(template.compile(Html)({
    'imgurl': itemimg
  }));
};
const calDetailPos = () => {
  let wWeight = ($(window).width() - 595) / 2;
  let wHeight = ($(window).height() - 420) / 2;
  return {
    'posx': wWeight,
    'posy': wHeight
  };
};
const render_size_detail = () => {
  let html = __webpack_require__(59641);
  $('body').append(template.compile(html)({
    pos: calDetailPos()
  }));
};
const getClothes = (t, c) => {
  switch (t) {
    case '男装':
      return clothesDict['shangyi'][c]['man'];
    case '女装':
      return clothesDict['shangyi'][c]['woman'];
    case '童装':
      return clothesDict['kidscloth'][c];
    case '男鞋':
      return clothesDict['shoes']['man'];
    case '女鞋':
      return clothesDict['shoes']['woman'];
    case '童鞋':
      return clothesDict['shoes']['kids'];
  }
};
const addSizeEvent = () => {
  /*添加尺码部分事件*/
  $('.closebar').on('click', function () {
    $(this).parent().hide();
  });
  $('.clothes_nav li').on('click', function () {
    $('.clothes_nav li').removeClass('select');
    $(this).addClass('select');
    var txt = $(this).text();
    var c = getClothes(txt, country);
    if (txt.indexOf('鞋') > -1) {
      $('.unit_cm').css('display', 'none');
      $('.unit_mm').css('display', 'inline-block');
      $('#size_detail .detail_left span').hide();
      $('.cloth_icon').css('display', 'inline-block');
      $('#size_detail .shoes').css('display', 'inline-block');
      if (txt.indexOf('男鞋') > -1) {
        $('.cloth_icon').attr('class', '').addClass('cloth_icon ht_shoes man_foot');
        $('.detail_left .shoes').text(txt);
      } else if (txt.indexOf('女鞋') > -1) {
        $('.cloth_icon').attr('class', '').addClass('cloth_icon ht_shoes woman_foot');
        $('.detail_left .shoes').text(txt);
      } else {
        $('#size_detail .shoes').hide();
        $('.cloth_icon').css('display', 'inline-block');
        $('.tongxie').css('display', 'inline-block');
        $('.tongxie0').addClass('size_hover');
        $('.tongxie4').removeClass('size_hover');
        $('.cloth_icon').attr('class', '').addClass('cloth_icon ht_shoes kids_foot');
      }
    } else if (txt.indexOf('童装') > -1) {
      $('.unit_mm').css('display', 'none');
      $('.unit_cm').css('display', 'inline-block');
      $('#size_detail .detail_left span').hide();
      $('#size_detail .tongzhuang').css('display', 'inline-block');
      $('.cloth_icon').css('display', 'inline-block');
      $('.cloth_icon').attr('class', '').addClass('cloth_icon kid0');
      $('.tongzhuang0').addClass('size_hover');
      $('.tongzhuang4').removeClass('size_hover');
    } else if (txt.indexOf('男装') > -1) {
      $('.unit_mm').css('display', 'none');
      $('.unit_cm').css('display', 'inline-block');
      $('#size_detail .detail_left span').hide();
      $('.cloth_icon').css('display', 'inline-block');
      $('#size_detail .shangyi').show();
      $('#size_detail .xiazhuang').show();
      $('.xiazhuang').removeClass('size_hover');
      $('.shangyi').addClass('size_hover');
      $('.cloth_icon').attr('class', '').addClass('cloth_icon manshangzhuang');
    } else {
      $('.unit_mm').css('display', 'none');
      $('.unit_cm').css('display', 'inline-block');
      $('#size_detail .detail_left span').hide();
      $('.cloth_icon').css('display', 'inline-block');
      $('#size_detail .shangyi').show();
      $('#size_detail .xiazhuang').show();
      $('.xiazhuang').removeClass('size_hover');
      $('.shangyi').addClass('size_hover');
      if (txt.indexOf('男装') > -1) $('.cloth_icon').attr('class', '').addClass('cloth_icon manshangzhuang');else $('.cloth_icon').attr('class', '').addClass('cloth_icon womanshangzhuang');
    }
    insertSize(c[0], c[1]);
  });
  $('.shangyi').on('click', function () {
    if ($(this).attr('class').indexOf('size_hover') > -1) return;
    var txt = $('.clothes_nav li[class="select"]').text();
    if (txt == "童装") return;
    if (txt == "男装") {
      $('.cloth_icon').attr('class', '').addClass('cloth_icon manshangzhuang');
    }
    if (txt == "女装") {
      $('.cloth_icon').attr('class', '').addClass('cloth_icon womanshangzhuang');
    }
    var c = getClothes(txt, country);
    insertSize(c[0], c[1]);
    $(this).addClass('size_hover');
    $('.xiazhuang').removeClass('size_hover');
  });
  $('.xiazhuang').on('click', function () {
    if ($(this).attr('class').indexOf('size_hover') > -1) return;
    var txt = $('.clothes_nav li[class="select"]').text();
    if (txt == "童装") return;
    if (txt == "男装") {
      var c = clothesDict['xiazhuang'][country]['man'];
      insertSize(c[0], c[1]);
      $('.cloth_icon').attr('class', '').addClass('cloth_icon manxiazhuang');
    }
    if (txt == "女装") {
      var c = clothesDict['xiazhuang'][country]['woman'];
      insertSize(c[0], c[1]);
      $('.cloth_icon').attr('class', '').addClass('cloth_icon womanxiazhuang');
    }
    $(this).addClass('size_hover');
    $('.shangyi').removeClass('size_hover');
  });
  $('.tongzhuang0').on('click', function () {
    var c = getClothes('童装', country);
    insertSize(c[0], c[1]);
    $(this).addClass('size_hover');
    $('.tongzhuang4').removeClass('size_hover');
    $('.cloth_icon').attr('class', '').addClass('cloth_icon kid0');
  });
  $('.tongzhuang4').on('click', function () {
    var c = getClothes('童装', country);
    insertSize(c[0], c[2]);
    $(this).addClass('size_hover');
    $('.tongzhuang0').removeClass('size_hover');
    $('.cloth_icon').attr('class', '').addClass('cloth_icon kid4');
  });
  $('.tongxie0').on('click', function () {
    var c = getClothes('童鞋', country);
    insertSize(c[0], c[1]);
    $(this).addClass('size_hover');
    $('.tongxie4').removeClass('size_hover');
  });
  $('.tongxie4').on('click', function () {
    var c = getClothes('童鞋', country);
    insertSize(c[0], c[2]);
    $(this).addClass('size_hover');
    $('.tongxie0').removeClass('size_hover');
  });

  /*尺寸转换*/
  $('.size_help').on('click', function () {
    $('#size_detail').show();
    log('click:haitao:size_help');
    cnzz.log('点击尺码帮助');
  });
  $('.size_xiala').on('mouseenter', function () {
    $(this).next('.size_xialabox').show();
    $(this).addClass('msHover');
  });
  $('.size_xiala').on('mouseleave', function () {
    var that = this;
    timer = setTimeout(function () {
      $(that).next('.size_xialabox').hide();
      $(that).removeClass('msHover');
    }, 100);
  });
  $('.size_xialabox').on('mouseenter', function () {
    clearTimeout(timer);
  });
  $('.size_xialabox').on('mouseleave', function () {
    $(this).hide();
  });
  $('.size_xialabox a').on('click', function () {
    var txt = $(this).text();
    var c = $(this).parent().attr('data-size');
    $('.' + c).val(txt);
    $(this).parent().hide();
    conversionSize();
  });
  $('#first_size').on('keyup', function () {
    conversionSize();
  });
};
const conversionSize = () => {
  /*尺码转换*/
  var first = $('.first_xiala').val();
  var second = $('.second_xiala').val();
  var num = $('#first_size').val();
  if (num) num = Number(num);
  var n1 = sizeDict[first];
  var n2 = sizeDict[second];
  var n3 = num * n1 / n2;
  if (n3.toString().indexOf('.') > -1) n3 = n3.toFixed(2);
  $('#second_size').val(n3);
};
const getCountry = () => {
  /*获取页面所属地区*/
  var host = location.host;
  for (var pattern in sitePattern) {
    if (pattern == host) {
      country = sitePattern[pattern]['coun'];
      HOST = pattern;
    }
  }
};
const getContainer = () => {
  let host = location.host;
  let patterns = sitePattern[host];
  if (!patterns) return false;
  return new Promise(async resolve => {
    let found = false,
      testTimes = 0;
    while (!found && testTimes < 10) {
      let dom = patterns.dom.find(dom => $(dom).length > 0);
      if (dom) {
        found = true;
        console.log('dom found', dom);
        resolve(dom);
      } else {
        testTimes++;
        console.log('waiting for dom', testTimes);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  });
  // for (let i = 0; i < patterns.dom.length; i++) {
  //   if ($(patterns.dom[i]).length > 0) {
  //     return patterns.dom[i];
  //   }
  // }
  // return false;
};
const addCommonEvent = () => {
  let href = location.href;
  $('#gwd_website_icon').on('click', e => {
    e.preventDefault();
    (__webpack_require__(30888).openTab)();
  });
  $('#gwd_minibar').on('click', function (e) {
    if ($(e.target).hasClass('sizehelp') || $(e.target).parent().hasClass('sizehelp')) {
      $('#size_detail').show();
    }
  });
  $('#ht_favor').on('click', function () {
    if (!G.email) {
      window.location.href = G.c_server + "/user/login?from_url=" + encodeURIComponent(href);
    } else {
      (__webpack_require__(24753).addFavor)(function () {
        window.location.href = G.c_server + "/user/login?from_url=" + encodeURIComponent(href);
      });
    }
  });
  $('.gwd-minibar-bg').on('mouseenter', '.minibar-tab', function () {
    $('#gwd_minibar').addClass('ms_enter');
    $(this).addClass('ms-tab-enter');
    var id = $(this).attr('id');
    $('#' + id + '_detail').show();
    if (id === "mini_price_history") {
      log("minitrend-show");
      (__webpack_require__(75957).calLineHeight)();
    }
  });
  $('.gwd-minibar-bg').on('mouseleave', '.minibar-tab', function () {
    $('#gwd_minibar').removeClass('ms_enter');
    $(this).removeClass('ms-tab-enter');
    $(this).removeClass('ms-tab-enter');
    var id = $(this).attr('id');
    $('body').removeClass('gwd-trend-hover-p');
    $('#' + id + '_detail').hide();
  });
};
const renderMini = dom => {
  $('body').addClass('ht_site');
  let host = location.host;
  let html = __webpack_require__(92433);
  let t = template.compile(html)({});
  switch (sitePattern[host]['position']) {
    case 'before':
      $(dom).before(t);
      break;
    case 'after':
      $(dom).after(t);
      break;
  }
  addCommonEvent();
  const store = (__webpack_require__(92771).getStore)();
  new Vue({
    el: '#gwd_mini_remind .minibar-btn-box',
    store,
    render: h => h(MiniBarCollectionButton)
  });
};
function baidufanyi(t, callback) {
  /*百度翻译接口*/
  var url = location.protocol + `//browser.${G.extName}.com/extension?ac=fanyi&string=` + t;
  request.get(url).done(function (data) {
    if (data.trans_result && !data.error_code) {
      var trans = [];
      for (var i = 0; i < data.trans_result.length; i++) {
        trans.push(data.trans_result[i].dst);
      }
      callback(trans);
    } else {
      callback([t]);
    }
  });
}
function requestFanyi(t, callback) {
  /*请求翻译接口*/
  baidufanyi(t, callback);
  log('request:haitao:fanyi');
  cnzz.log('请求划词翻译');
}
function insertFanyi(data) {
  /*插入翻译内容*/
  data = data.join('');
  $('.ht_fanyi').remove();
  var html = '<div class="ht_fanyi" style="top:{{hty}};left:{{htx}}"><span id="ht_top"></span>{{data}}</div>';
  var t = template.compile(html)({
    data: data,
    'htx': calPosition() + 'px',
    'hty': htY + 'px'
  });
  $('body').append(t);
  addFanyiEvent();
}
function calPosition() {
  /*计算插入位置*/
  var pos = 0;
  if (htX > mouseDownX) pos = htX - (htX - mouseDownX) / 2 - 65;else pos = htX + (mouseDownX - htX) / 2 - 65;
  return pos;
}
function editTxt(t) {
  requestFanyi(t, insertFanyi);
}
function addFanyiEvent() {
  $('.ht_fanyi').siblings().on('click', function () {
    $('.ht_fanyi').remove();
  });
}
function getSelect() {
  $('body').on('mousedown', function (e) {
    clearTimeout(timer2);
    mouseDownX = e.pageX;
  });
  $('body').on('mouseup', function (e) {
    timer2 = setTimeout(function () {
      var txt = '';
      htX = e.pageX;
      htY = e.pageY + 20;
      if (window.getSelection) {
        txt = window.getSelection().toString();
      } else if (document.selection) {
        txt = document.selection.createRange().text;
      }
      if (txt == '') return;else editTxt(txt);
    }, 100);
  });
}
function isZiying() {
  if (HOST == 'www.6pm.com') return 'ziying';
  if ($('#merchant-info').length > 0) {
    if (HOST == 'www.amazon.com') {
      if ($('#merchant-info').text().indexOf('sold by Amazon') > -1) return 'ziying';else return 'sanfang';
    }
    if (HOST == 'www.amazon.co.jp') {
      if ($('#merchant-info').text().indexOf('jp が販売') > -1) return 'ziying';else return 'sanfang';
    }
    if (HOST == 'www.amazon.de') {
      if ($('#merchant-info').text().indexOf('Verkauf und Versand durch Amazon') > -1) return 'ziying';else if ($('#merchant-info').text().indexOf('Dispatched from and sold by Amazon') > -1) return 'ziying';else return 'sanfang';
    }
  } else return 'sanfang';
}
module.exports.init = async () => {
  let permanent = userData.get('permanent');
  // if (permanent.sethaitao === "0") return;
  __webpack_require__(55535);
  let pattern = await getContainer();
  getCountry();
  if (!pattern) return;
  renderMini(pattern);
  getSelect();
  render_size_detail();
  try {
    insertSize(clothesDict['shangyi'][country]['man'][0], clothesDict['shangyi'][country]['man'][1]);
    addSizeEvent();
  } catch (e) {
    console.error(e);
  }
  setTimeout(function () {
    // check_favor()
  }, 1000);
};
module.exports.getHtInfo = () => {
  let obj = {};
  obj.HOST = HOST;
  obj.protype = isZiying();
  return obj;
};

/***/ }),

/***/ 24403:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-new-jd #mini_price_history::after {\n  position: absolute;\n  content: '';\n  background: transparent;\n  width: 137px;\n  left: 49px;\n  bottom: -3px;\n  height: 6px;\n}\n.gwd-minibar-bg {\n  font: 12px/1.5 tahoma, arial, 'Hiragino Sans GB', '\\5B8B\\4F53', sans-serif;\n  transform: matrix(1, 0, 0, 1, 0, 0);\n  left: 0;\n  z-index: 9999;\n}\n.gwd-minibar-bg em {\n  font-weight: normal;\n}\n.gwd-minibar-bg.gwd-npcitem-jdhk {\n  z-index: 9;\n  width: 462px;\n}\n", ""]);

// exports


/***/ }),

/***/ 24700:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-quest"
  }, [_c("div", {
    staticClass: "gwd-hint-text"
  }, [_c("span", {
    staticClass: "gwd-hint-2x"
  }, [_vm._t("default")], 2)])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 24753:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const template = __webpack_require__(26133);
const request = __webpack_require__(49388);
const globalCondition = __webpack_require__(41761);
const userData = __webpack_require__(74222);
const golbal2 = __webpack_require__(7053);
const util = __webpack_require__(30888);
const miniFavor = __webpack_require__(23107);
const userCenter = __webpack_require__(76904);
const siteInfo = __webpack_require__(92834);
let permanent, oinfo;
var siteidArr = ['228', '266', '246', '229', '365', '366', '1', '238', '230'];
const showListPrice = (price, dp_id, originUrl) => {
  let pattern = dp_id.split('-');
  let siteId = pattern[pattern.length - 1];
  if (price < 0) return '暂时缺货';else {
    if (siteidArr.indexOf(siteId) > -1) {
      let site = siteInfo.isProductPage(originUrl);
      let cur = (__webpack_require__(22209).getMoneyInfo)(site)[0];
      return cur + price.toString().replace(',', '');
    } else {
      return '¥' + price.toString().replace(',', '');
    }
  }
};
const addEvent = () => {
  $('#topfavor_detail').on('click', '.item_close_btn', function () {
    let id = $(this).attr('data-id');
    delFavor(id);
  });
  $('.favor-list a').on('click', function () {
    console.log($(this));
    if ($(this).attr('data-id')) {
      delFavor($(this).attr('data-id'));
      return false;
    }
    if (!$(this).attr('href')) {
      return false;
    }
    window.open($(this).attr('href'));
    return false;
  });
};
const delFavor = id => {
  id = id.trim();
  oinfo = userData.get('other_info');
  // let url = `${G.c_server}/collect/aj_del?dp_id=${id}`;
  // request.get(url).done((data) => {
  if (id === oinfo.id) {
    store.dispatch('priceRemind/cancel').then(() => {
      $('#topfavor_detail .sp-del').show().fadeOut(3000);
      getFavor(renderList);
    });
  } else {
    userCenter.delete(id).then(data => {
      // -1  失败  1 处理成功   100 未登录
      if (data.code === 1) {
        // if (id == oinfo.now.dp_id) {
        //   $('#topfavor_detail .topf-head .sp-col').text('收藏商品').removeClass('collected')
        // }
        $('#topfavor_detail .sp-del').show().fadeOut(3000);
        getFavor(renderList);
      }
    });
  }
};
const addFavor = callback => {
  const store = (__webpack_require__(92771).getStore)();
  let pagedp = G.dp;
  let dp = oinfo.now;
  store.dispatch('priceRemind/submit', {
    notifySite: '',
    price: '',
    mode: ''
  }).then(res => {
    // getFavor(renderList)
    // $('#topfavor_detail .topf-head .sp-col').text('收藏成功').addClass('collected')
  });
  // userCenter.add('', '').then(data => {
  //   if (Number(data.code) === 1 || data.error_code === '1') {
  //     getFavor(renderList)
  //     $('#topfavor_detail .topf-head .sp-col').text('收藏成功').addClass('collected')
  //     $('#ht_favor').text('收藏成功').addClass('collected')
  //     $(`#gwd_mini_remind .minibar-btn-box span`).text(`已添加提醒`);
  //     $('#gwd_mini_remind .minibar-btn-box em').addClass('favored')
  //
  //     if (data.data) {
  //       G.remindInfo = {
  //         remind_price: data.data.notifier.threshold,
  //         is_collected: data.data.id,
  //         has_remind_type: data.data.notifier.type,
  //         remind_type: data.data.notifier.type,
  //         notify_site: data.data.notifier.site
  //       };
  //
  //       miniFavor.setNotifyPrice(data.data.notifier.site, data.data.notifier.threshold)
  //     }
  //
  //     // 更新本地收藏存储
  //     // util.addFavorCheck()
  //   } else if (data.code === '2') {
  //     $('#topfavor_detail .topf-head .sp-col').text('收藏过了').addClass('collected')
  //     $('#ht_favor').text('收藏过了').addClass('collected')
  //     $(`#gwd_mini_remind .minibar-btn-box span`).text(`已添加提醒`);
  //     $('#gwd_mini_remind .minibar-btn-box em').addClass('favored')
  //   } else if (data.code === 100) {
  //     if (callback) callback()
  //   } else {
  //
  //   }
  // })
};
const renderList = data => {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  let datasize = data.products.length;
  for (let i = 0; i < datasize; i++) {
    let siteId = data.products[i].dp_id.split('-')[1];
    data.products[i].site_id = siteId;
    data.products[i].newPrice = showListPrice(data.products[i].now_price, data.products[i].dp_id, data.products[i].origin_url);
  }
  let html = __webpack_require__(56865);
  $('#topfavor_detail .favor-list').empty().append(template.compile(html)({
    data: data.products,
    imgLoad: G.imgLoad,
    s_server: G.s_server
  }));
  $('.see-all-favor em').text(data.cnt);
  $('.see-all-favor').attr('href', `https://www.gwdang.com/mine/collection`);
  addEvent();
  golbal2.loadImg(0, datasize, $('#topfavor_detail li .item_img img'));
  if (!$('#topfavor_detail').hasClass('islogin')) $('#topfavor_detail').addClass('islogin');
};
const getFavor = callback => {
  userCenter.getList('default', 1, 3).then(res => {
    let data = res;
    if (!data.data.list) {
      callback({
        products: [],
        cnt: 0
      });
      return;
    }
    callback({
      products: data.data.list.map(item => {
        item.now_price = item.price.last;
        return item;
      }),
      cnt: data.data.cnt
    });
  });
};
const userLogin = (u, p, callback) => {
  $.ajax({
    type: "post",
    url: `https://www.${G.extName}.com/user/aj_login`,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    data: {
      email: u,
      password: p,
      t: "check",
      host: location.protocol + '//' + location.host
    },
    success: function (data) {
      callback(data);
      (__webpack_require__(57031).renderAgain)();
    }
  });
};
const addDetailEvent = () => {
  let stime, isRender, setLeft;
  $('#topfavor_detail .topf-head span').on('click', function () {
    addFavor();
  });
  $('#topfavor_detail .login_click').on('click', function () {
    let username = $('#topfavor_detail .username').val();
    let psd = $('#topfavor_detail .password').val();
    if (!username || !psd) {
      $('#topfavor_detail .login_remind').show().fadeOut(5000);
      return;
    }
    userLogin(username, psd, function (data) {
      if (data === '1') {
        G.email = username;
        getFavor(renderList);
      } else {
        $('#topfavor_detail .login_remind').show().fadeOut(5000);
      }
    });
  });
  $('body').on('gwd-login-complete', e => {
    console.log('fired');
    getFavor(renderList);
  });
  $('#gwdang-favor').on('mouseenter', function () {
    if (G.userLogin && !isRender) {
      isRender = true;
      $('#topfavor_detail').addClass('islogin');
      getFavor(renderList);
    }
    if (permanent.style === 'bottom') {
      setLeft = true;
      util.setSimplePagePos($('#gwdang-favor'), $('#topfavor_detail'), 279);
    }
    $('#topfavor_detail').show();
    $(this).addClass('msHover');
  });
  $('#gwdang-favor').on('mouseleave', function () {
    let that = this;
    stime = setTimeout(function () {
      $('#topfavor_detail').hide();
      $(that).removeClass('msHover');
    }, 100);
  });
  $('#topfavor_detail').on('mouseenter', function () {
    clearTimeout(stime);
  });
  $('#topfavor_detail').on('mouseleave', function () {
    $('#topfavor_detail').hide();
    $('#gwdang-favor').removeClass('msHover');
  });
};
const renderDetail = dp_id => {
  const store = (__webpack_require__(92771).getStore)();
  let hidebtn;
  let dom = '#gwdang_main';
  let style = 'top:37px;';
  if (permanent.style === 'bottom') {
    dom = '#bjd_bottom_detail';
    style = 'bottom: 60px;right: 40px;';
  }

  // 改商品没有抓取数据的时候   不能收藏商品
  if (!dp_id || dp_id.match(/^0-\d+$/)) {
    hidebtn = true;
  }
  let imgHost = G.imgHost;
  if (G.from_device === 'firefox') {
    imgHost = G.localImg;
  }
  let homeU = `https://www.gwdang.com/user/wechat_oauth/?pl=9&op=login&from_url=${encodeURIComponent(location.href)}`;
  homeU = encodeURIComponent(homeU);
  let wxUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=wx34006c141f9daa3a&response_type=code&scope=snsapi_login&state=2ced970d5b97680e95670a48d1102611&redirect_uri=${homeU}`;
  let html = __webpack_require__(31584);
  $(dom).append(template.compile(html)({
    email: G.email,
    userLogin: G.userLogin,
    hidebtn: hidebtn,
    imgHost: imgHost,
    wxUrl: wxUrl,
    pageurl: encodeURIComponent(location.href),
    style: style
  }));
  const CommonLogin = (__webpack_require__(36664)["default"]);
  new Vue({
    el: '#gwd-login-favor',
    render: h => h(CommonLogin, {
      props: {
        position: 'gwd-favor',
        showAlterLogin: true,
        alterLoginPosition: 'column'
      }
    })
  });
  addDetailEvent(permanent);
  const setCollectedStatus = newVal => {
    (__webpack_require__(7129).log)('watch triggered', newVal);
    if (newVal) {
      // 已收藏
      $('#topfavor_detail .topf-head .sp-col').text('收藏成功').addClass('collected');
    } else {
      // 未收藏
      $('#topfavor_detail .topf-head .sp-col').text('收藏商品').removeClass('collected');
    }
  };
  setCollectedStatus(store.state.priceRemind.collected);
  store.watch(state => {
    return state.priceRemind.collected;
  }, setCollectedStatus);
};
module.exports.init = async () => {
  await (__webpack_require__(41761).met)('GwdDpIdGot');
  permanent = userData.get('permanent');
  oinfo = userData.get('other_info');
  renderDetail(oinfo.now.dp_id);
};
module.exports.addFavor = addFavor;

/***/ }),

/***/ 25728:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(90937);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("78bdec26", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 25807:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ JdRankList)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/JdRankList.vue?vue&type=template&id=51dc1e02&scoped=true
var JdRankListvue_type_template_id_51dc1e02_scoped_true = __webpack_require__(28582);
;// ./src/standard/module/components/JdRankList.vue?vue&type=template&id=51dc1e02&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/JdRankList.vue?vue&type=script&lang=js
var JdRankListvue_type_script_lang_js = __webpack_require__(77049);
;// ./src/standard/module/components/JdRankList.vue?vue&type=script&lang=js
 /* harmony default export */ const components_JdRankListvue_type_script_lang_js = (JdRankListvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/JdRankList.vue?vue&type=style&index=0&id=51dc1e02&prod&scoped=true&lang=less
var JdRankListvue_type_style_index_0_id_51dc1e02_prod_scoped_true_lang_less = __webpack_require__(40834);
;// ./src/standard/module/components/JdRankList.vue?vue&type=style&index=0&id=51dc1e02&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/JdRankList.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_JdRankListvue_type_script_lang_js,
  JdRankListvue_type_template_id_51dc1e02_scoped_true/* render */.XX,
  JdRankListvue_type_template_id_51dc1e02_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "51dc1e02",
  null
  
)

/* harmony default export */ const JdRankList = (component.exports);

/***/ }),

/***/ 26418:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-row[data-v-0e3edad3] {\n  display: flex;\n  flex-direction: row;\n}\n.gwd-inline-row[data-v-0e3edad3] {\n  display: inline-flex;\n  flex-direction: row;\n}\n.gwd-column[data-v-0e3edad3] {\n  display: flex;\n  flex-direction: column;\n}\n.gwd-inline-column[data-v-0e3edad3] {\n  display: inline-flex;\n  flex-direction: column;\n}\n.gwd-align[data-v-0e3edad3] {\n  align-content: center;\n  align-items: center;\n}\n.gwd-jcc[data-v-0e3edad3] {\n  justify-content: center;\n}\n.gwd-jic[data-v-0e3edad3] {\n  justify-items: center;\n}\n.gwd-button[data-v-0e3edad3] {\n  outline: none;\n  border: none;\n}\n.bjg-bar-button[data-v-0e3edad3] {\n  font-size: 0;\n}\n.bjg-hover-bg[data-v-0e3edad3] {\n  background: #fffbef;\n}\n.bjg-bar-button[data-v-0e3edad3]:hover {\n  background: #fffbef;\n  cursor: pointer;\n}\n.bjg-bar-button:hover .bjg-window[data-v-0e3edad3] {\n  display: block;\n}\n.mainbar-fold .bjg-bar-button[data-v-0e3edad3],\n.mainbar-fold #top_coupon_btn[data-v-0e3edad3],\n.mainbar-fold .rinfo-btn[data-v-0e3edad3],\n.mainbar-fold .gwd-bottom-tmall[data-v-0e3edad3] {\n  display: none!important;\n}\n.gwd-font12[data-v-0e3edad3] {\n  font-size: 12px;\n}\n.gwd-font14[data-v-0e3edad3] {\n  font-size: 14px;\n}\n.gwd-red[data-v-0e3edad3] {\n  color: #ff3532;\n}\n.gwd-red-bg[data-v-0e3edad3] {\n  background: #ff3532;\n}\n.gwd-hui333[data-v-0e3edad3] {\n  color: #333333;\n}\n.gwd-hui999[data-v-0e3edad3] {\n  color: #999999;\n}\n.gwd-font10[data-v-0e3edad3] {\n  font-size: 12px;\n  transform: scale(0.8333);\n  transform-origin: bottom center;\n}\n.gwd-font11[data-v-0e3edad3] {\n  font-size: 12px;\n  transform: scale(0.91666);\n  transform-origin: bottom center;\n}\n.gwd-font9[data-v-0e3edad3] {\n  font-size: 12px;\n  transform: scale(0.75);\n  transform-origin: bottom center;\n}\n.gwd-hoverable[data-v-0e3edad3]:hover {\n  background: #edf1f2;\n}\n.right-info > *[data-v-0e3edad3] {\n  border-left: 1px solid #edf1f2;\n}\n.gwd-red-after-visit[data-v-0e3edad3]:hover {\n  color: #e03024 !important;\n}\n.gwd-button[data-v-0e3edad3]:hover {\n  filter: brightness(1.1);\n}\n.gwd-button[data-v-0e3edad3] {\n  padding-top: 1px;\n  padding-bottom: 1px;\n}\n.gwd-button[data-v-0e3edad3]:active {\n  filter: brightness(0.9);\n}\n.gwd-fadeout-5s[data-v-0e3edad3] {\n  opacity: 0;\n  transition: opacity 5s;\n}\n.gwd-scrollbar[data-v-0e3edad3]::-webkit-scrollbar {\n  width: 6px;\n  border-radius: 17px;\n}\n.gwd-scrollbar[data-v-0e3edad3]::-webkit-scrollbar-thumb {\n  border-radius: 17px;\n  background: #999;\n}\n#gwdang_main[data-v-0e3edad3],\n.gwdang-main[data-v-0e3edad3],\n.bjgext-detail[data-v-0e3edad3] {\n  font-size: 12px;\n}\n#gwdang_main button[data-v-0e3edad3],\n.gwdang-main button[data-v-0e3edad3],\n.bjgext-detail button[data-v-0e3edad3] {\n  text-align: center;\n}\n.gwd-width-100[data-v-0e3edad3] {\n  width: 100%;\n}\n.gwd-overlay[data-v-0e3edad3] {\n  font-family: \"Microsoft YaHei\", \"Arial\", \"SimSun\", serif;\n  font-size: 0;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 999999999;\n}\n.gwd-font-pfm[data-v-0e3edad3] {\n  font-family: 'PingFangSC-Medium';\n  font-weight: normal!important;\n}\n@font-face {\n  font-family: 'PingFangSC-Medium';\n  src: local('PingFangSC-Medium');\n}\n.gwd-font-pfm[data-v-0e3edad3] {\n  font-family: local('PingFangSC-Medium'), system-ui;\n  font-weight: bold;\n}\n#gwd_minibar svg[data-v-0e3edad3],\n.gwdang-main svg[data-v-0e3edad3],\n#bjgext_mb_bg svg[data-v-0e3edad3],\n#bjgext_mainbar svg[data-v-0e3edad3] {\n  fill: transparent;\n}\n.gwd-common-font[data-v-0e3edad3] {\n  font-family: 'PingFang SC', 'Microsoft YaHei', '\\5FAE\\8F6F\\96C5\\9ED1', 'Hiragino Sans GB', 'WenQuanYi Micro Hei';\n}\n.gwd-btn-submit[data-v-0e3edad3] {\n  border: none;\n  outline: none;\n  background: #48befe;\n  width: 128px;\n  height: 32px;\n  font-size: 14px;\n  color: white;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.gwd-btn-del[data-v-0e3edad3] {\n  width: 60px;\n  height: 20px;\n  border-radius: 2px 2px 2px 2px;\n  opacity: 1;\n  border: 1px solid #E6E9EB;\n  color: #404547;\n  background: white;\n  position: relative;\n  box-sizing: border-box;\n}\n.gwd-btn-del[data-v-0e3edad3]:hover {\n  filter: brightness(1.05);\n  cursor: pointer;\n}\n.gwd-btn-del[data-v-0e3edad3]::before {\n  content: '';\n  position: absolute;\n  top: -1px;\n  left: -1px;\n  right: -1px;\n  bottom: -1px;\n  z-index: -1;\n  background: #e6e9eb;\n}\n.gwd-collection-detail[data-v-0e3edad3] {\n  font-family: 'Microsoft Yahei', tahoma, arial, 'Hiragino Sans GB', sans-serif;\n}\n.gwd-collection-detail .gwd-vline[data-v-0e3edad3] {\n  width: 0;\n  height: 197px;\n  border-right: 1px dashed #e6e9eb;\n  margin-left: 13px;\n  margin-right: 15px;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option[data-v-0e3edad3] {\n  height: 24px;\n  white-space: nowrap;\n  position: relative;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option span[data-v-0e3edad3] {\n  color: #404547;\n  font-size: 13px;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option span.gwd-currency[data-v-0e3edad3] {\n  color: #48befe;\n  font-size: 16px;\n  position: absolute;\n  left: 82px;\n  top: 13px;\n  transform: translateY(-50%);\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option .gwd-remind-current[data-v-0e3edad3] {\n  margin-left: 8px;\n  width: 57px;\n}\n.gwd-remind-error-text[data-v-0e3edad3] {\n  color: #d80001;\n  position: absolute;\n  bottom: 61px;\n  left: 0;\n  right: 0;\n  text-align: center;\n}\n.gwd-remind-hint-text[data-v-0e3edad3] {\n  color: #48befe;\n  position: absolute;\n  bottom: 61px;\n  left: 0;\n  right: 0;\n  text-align: center;\n}\n.gwd-btn-del[data-v-0e3edad3] {\n  margin-right: 114px;\n  padding-left: 0;\n  padding-right: 0;\n}\n.gwd-btn-del span[data-v-0e3edad3] {\n  position: relative;\n  top: -1px;\n}\n.gwd-collection-detail[data-v-0e3edad3] {\n  padding: 16px;\n  padding-bottom: 0;\n}\n.gwd-collection-detail .gwd-container[data-v-0e3edad3] {\n  width: 305px;\n  height: 56px;\n  justify-content: center;\n  min-width: 319px;\n  border-radius: 4px;\n  background: #f8fcfe;\n  padding-left: 12px;\n  padding-right: 12px;\n  box-sizing: border-box;\n}\n.gwd-collection-detail .gwd-remind-error-text[data-v-0e3edad3] {\n  bottom: 44px;\n}\n.gwd-collection-detail .gwd-remind-hint-text[data-v-0e3edad3] {\n  bottom: 44px;\n}\n", ""]);

// exports


/***/ }),

/***/ 26431:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
__webpack_require__(3362);
const request = __webpack_require__(49388);
const extConsole = __webpack_require__(7129);
const fillPriceAndPromo = async list => {
  const dpIds = list.map(item => item.dpId).join(',');
  const priceInfos = (await request.post(`${G.server}/extension/ProductFilter?scene=img `, {
    dp_ids: dpIds
  }, true)).list;
  extConsole.log('priceInfos', priceInfos);
  return list.map(item => {
    const itemDpId = item.dpId.replace('-123', '-83');
    if (!item.price) {
      item.price = priceInfos[itemDpId] ? priceInfos[itemDpId].pri / 100 : '';
    }
    item.promos = priceInfos[itemDpId] && priceInfos[itemDpId].promo && priceInfos[itemDpId].promo.promo_list || [];
    return item;
  }).filter(x => x.price);
};
var _default = exports["default"] = fillPriceAndPromo;

/***/ }),

/***/ 26787:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ MiniSameListvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ MiniSameList)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniSameList.vue?vue&type=template&id=5aa6bd38&scoped=true
var MiniSameListvue_type_template_id_5aa6bd38_scoped_true = __webpack_require__(38752);
;// ./src/standard/module/components/MiniSameList.vue?vue&type=template&id=5aa6bd38&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniSameList.vue?vue&type=script&lang=js
var MiniSameListvue_type_script_lang_js = __webpack_require__(8762);
;// ./src/standard/module/components/MiniSameList.vue?vue&type=script&lang=js
 /* harmony default export */ const components_MiniSameListvue_type_script_lang_js = (MiniSameListvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniSameList.vue?vue&type=style&index=0&id=5aa6bd38&prod&scoped=true&lang=less
var MiniSameListvue_type_style_index_0_id_5aa6bd38_prod_scoped_true_lang_less = __webpack_require__(49122);
;// ./src/standard/module/components/MiniSameList.vue?vue&type=style&index=0&id=5aa6bd38&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniSameList.vue?vue&type=style&index=1&id=5aa6bd38&prod&scoped=true&lang=css
var MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css = __webpack_require__(50627);
var MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniSameList.vue?vue&type=style&index=1&id=5aa6bd38&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const components_MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css = ((MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css_default()) && (MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css_default()).locals ? (MiniSameListvue_type_style_index_1_id_5aa6bd38_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/MiniSameList.vue?vue&type=style&index=1&id=5aa6bd38&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniSameList.vue?vue&type=style&index=2&id=5aa6bd38&prod&scoped=true&lang=less
var MiniSameListvue_type_style_index_2_id_5aa6bd38_prod_scoped_true_lang_less = __webpack_require__(90664);
;// ./src/standard/module/components/MiniSameList.vue?vue&type=style&index=2&id=5aa6bd38&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/MiniSameList.vue



;




/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_MiniSameListvue_type_script_lang_js,
  MiniSameListvue_type_template_id_5aa6bd38_scoped_true/* render */.XX,
  MiniSameListvue_type_template_id_5aa6bd38_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "5aa6bd38",
  null
  
)

/* harmony default export */ const MiniSameList = (component.exports);

/***/ }),

/***/ 26814:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ MiniBar)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBar.vue?vue&type=template&id=c45398e6
var MiniBarvue_type_template_id_c45398e6 = __webpack_require__(28264);
;// ./src/standard/module/components/MiniBar.vue?vue&type=template&id=c45398e6

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBar.vue?vue&type=script&lang=js
var MiniBarvue_type_script_lang_js = __webpack_require__(66477);
;// ./src/standard/module/components/MiniBar.vue?vue&type=script&lang=js
 /* harmony default export */ const components_MiniBarvue_type_script_lang_js = (MiniBarvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBar.vue?vue&type=style&index=0&id=c45398e6&prod&lang=less
var MiniBarvue_type_style_index_0_id_c45398e6_prod_lang_less = __webpack_require__(38469);
;// ./src/standard/module/components/MiniBar.vue?vue&type=style&index=0&id=c45398e6&prod&lang=less

// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBar.vue?vue&type=style&index=1&id=c45398e6&prod&lang=less
var MiniBarvue_type_style_index_1_id_c45398e6_prod_lang_less = __webpack_require__(57422);
;// ./src/standard/module/components/MiniBar.vue?vue&type=style&index=1&id=c45398e6&prod&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/MiniBar.vue



;



/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_MiniBarvue_type_script_lang_js,
  MiniBarvue_type_template_id_c45398e6/* render */.XX,
  MiniBarvue_type_template_id_c45398e6/* staticRenderFns */.Yp,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ const MiniBar = (component.exports);

/***/ }),

/***/ 26902:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];
/* provided dependency */ var Highcharts = __webpack_require__(58174);
var __WEBPACK_AMD_DEFINE_RESULT__;

__webpack_require__(3362);
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  const extConsole = __webpack_require__(7129);
  if (['smzdm'].indexOf(G.site) > -1) {
    return;
  }

  /* TODO
  支持常用网站列表 支持定时查找 鼠标滚动查找
  浏览器兼容性检测
  */
  var exports = {};
  var $ = __webpack_require__(10333);
  const lang = __webpack_require__(20089);
  const langCfg = __webpack_require__(38276);
  var template = __webpack_require__(26133);
  var siteinfo = __webpack_require__(92834);
  const userData = __webpack_require__(74222);
  const countryConfig = __webpack_require__(22209);
  var parseprice = __webpack_require__(86421);
  const util = __webpack_require__(30888);
  var viewPriceTip = __webpack_require__(61517);
  if (G.lang == 'zh-tr') {
    viewPriceTip = __webpack_require__(12301);
  }
  var pageInfo = G.pageInfo;
  var smallTip, smallTip2;
  var tipDetail;
  var time, nowTipDom;
  var nowUrl,
    newId,
    nowPrice = 0;
  var tipResult = {};
  var blacklist = [/shangpin\.com/, /cfe\.m\.jd\.com/, /1688\.com/, /plogin\.m\.jd\.com/];
  let moneyInfo;
  let priceTle = {
    'pri-t1': lang.getString(langCfg, 'priceUp'),
    'pri-t0': lang.getString(langCfg, 'priceStable'),
    'pri-t-1': lang.getString(langCfg, 'priceDecrease'),
    'pri-t-2': lang.getString(langCfg, 'priceLowest')
  };
  let request = __webpack_require__(49388);
  function block() {
    var r = false;
    for (var i = blacklist.length - 1; i >= 0; i--) {
      r = blacklist[i].test(location.href);
      if (r) return r;
    }
    ;
  }

  //获取元素和页面顶部的距离
  var getTop = function (e) {
    var offset = e.offsetTop;
    if (e.offsetParent != null) offset += getTop(e.offsetParent);
    if (e.className.includes('mainPicAndDesc--')) {
      return offset - 16;
    }
    return offset;
  };

  //获取元素和页面左侧的距离
  var getLeft = function (e) {
    var offset = e.offsetLeft;
    if (e.offsetParent != null) offset += getLeft(e.offsetParent);
    if (G.aliSite && e.className.includes('search-content-col')) {
      return offset + 8;
    }
    return offset;
  };
  // const getWidth = (e) => {
  //   let w = $(e).width()
  //   if (!w)
  //     return getWidth(e.parentElement)
  //   return w;
  // }
  const getListPrice = () => {
    // 获取列表页鼠标所在当前商品价格
    let price = '0';
    switch (G.site) {
      case "360buy":
        price = $(nowTipDom).parent().parent().find('.p-price strong i').eq(0).text();
        if (!price) {
          price = nowPrice;
        }
        if (!price) {
          price = $(nowTipDom).parents('li').find('.p-price i').eq(0).text();
        }
        if (!price) {
          price = $(nowTipDom).parents('li').find('.more2_info_price_txt').eq(0).text();
        }
        break;
      case "suning":
        price = $(nowTipDom).parent().parent().parent().find('.res-info .price-box .def-price').eq(0).text();
        break;
      case "taobao":
        price = $(nowTipDom).parents('.search-content-col').find('[class^=innerPriceWrapper--]').text();
        if (!price) {
          price = $(nowTipDom).parents('.tb-pick-content-item').find('.price-value').eq(0).text();
        }
        break;
      case "tmall":
        price = $(nowTipDom).parent().parent().find('.productPrice>em').eq(0).text();
        break;
      case "amazon":
        price = $(nowTipDom).parent().parent().parent().parent().find('.a-spacing-mini span.s-price').eq(0).text();
        break;
      case "gome":
        price = $(nowTipDom).parent().parent().find('.item-price-info .item-price .price').eq(0).text();
        break;
      case "dangdang":
        price = $(nowTipDom).parent().find('.price .price_n').eq(0).text();
        break;
      case "vipshop":
        price = $(nowTipDom).parent().parent().parent().parent().find('.special-price .title').eq(0).text();
        if (!price) {
          price = $(nowTipDom).parent().parent().parent().parent().find('.goods-price-info .price').eq(0).text();
        }
        break;
      default:
        price = '0';
    }
    price = price.toString().replace(/[,￥¥]+/g, '');
    return price;
  };
  // 没有价格走势数据时候的伪造虚拟点
  const noTrendAddTrendData = data => {
    let site_name;
    let price = getListPrice();
    if (price === '0') return data;
    let date = util.getTimeNumber(new Date().getTime() - 86400000 * 179, "5");
    let date2 = util.getTimeNumber(new Date().getTime(), "5");
    let arr = [];
    date = new Date(date).getTime();
    date2 = new Date(date2).getTime();
    arr.push([date, Number(price)]);
    arr.push([date2, Number(price)]);
    site_name = data.site_name;
    let noTrendObj = {
      current_price: price,
      data: arr,
      max_price: price,
      min_price: price,
      min_stamp: date2 / 1000,
      name: site_name,
      start: date,
      price_status: 0
    };
    data.trend.store = [noTrendObj];
    data.taobaoNoTrend = true;
    data.start = date;
    return data;
  };
  let inited = false;
  exports.init = function () {
    if (inited) return;
    if (!inited) {
      inited = true;
    }
    // 获取价格符号
    moneyInfo = countryConfig.getMoneyInfo(G.logsite);
    let b = G.extBrand;
    if (G.from_device !== 'bijiago' && G.from_device !== 'biyibi') {
      let permanent = userData.get('permanent');
      if (permanent.setTip === '0') return;
    } else {
      b = 'bjgou';
    }
    if (block()) return;
    if (pageInfo.type === 1) {
      $('body').append(`<a id ="${b}_price_tip" class="${G.from_device}-ext" src="javascript:void(0)" target="_self">
          <div class="tip_btn_box">
            <em></em>
            <span>${G.lang === 'zh-tr' ? '比價' : '比价'}</span>
          </div>
          <div id="${b}_price_tip_detail"></div>
        </a>`);
      smallTip = $(`#${b}_price_tip`);
      smallTip2 = $(`#${b}_price_tip .tip_btn_box`);
      tipDetail = $(`#${b}_price_tip_detail`);
    }
    bindDpEvent();

    // if (location.hostname.includes('s.taobao.com')) {
    //   $('body').append(`
    //     <style> #mainsrp-header.m-header-fixed { display: block !important; } </style>
    //   `)
    // }
  };
  function bindDpEvent(area) {
    let isNewTb = false; // 是否是新版淘宝
    if (G.aliSite && $('#search-content-leftWrapper').length) {
      isNewTb = true;
    }
    const dpMouseOver = async function (e) {
      var img = e.target;
      if (G.site === '360buy' && img.tagName !== 'IMG' && $(img).parents('.more2_img')) {
        let elList = $(img).parents('.more2_img').find('img');
        if (elList.length) {
          img = elList[0];
        }
        if (img.tagName !== 'IMG') {
          img = $(e.target).parents('.more2_item').find('.more2_img img')[0];
        }
      }
      if (G.site === '360buy' && $(e.target).parents('.plugin_goodsCardWrapper').length) {
        const skuId = $(e.target).parents('.plugin_goodsCardWrapper').attr('data-sku');
        nowUrl = `https://item.jd.com/${skuId}.html`;
        img = $(e.target).find('img')[0];
      }
      if (img && img.tagName !== 'IMG' && !isNewTb) {
        img = $(img).find('img')[0];
      }
      if (!img) {
        img = $(e.target).parents('.item-link').find('.img-wrapper')[0];
      }
      if (!img) {
        img = $(e.target).parents('[class^=doubleCard--]').find('[class^=mainPicAndDesc--]')[0];
      }
      if (!img) {
        return;
      }
      if (img.parentElement.getAttribute('data-tip')) return false;
      if (img.tagName === 'A' || $(img).parents('.item-link').length || $(img).parents('._wrapper_e2ts5_1').length || img.className.includes('MainPic--mask') || img.className.includes('mainPicAndDesc--') || img.width > 50 && img.height > 50) {
        var parent = img.tagName === 'A' ? img : $(img).parents('a')[0];
        if (!parent) {
          parent = $(img).find('a')[0];
        }
        if (!parent && img) {
          parent = img.parentElement;
        }
        if (parent.href && parent.href.includes('.gwdang.com')) {
          return;
        }
        if (parent.href && parent.href.includes('store.taobao.com')) {
          return;
        }
        if ($(parent).parents('[class^=ShopInfo--shopInfo--]').length) {
          return;
        }
        nowTipDom = parent;
        if (G.site === 'taobao' && parent.tagName === 'A' && /^https?:\/\//.test(parent.href)) {
          let id = parent.getAttribute('data-nid');
          nowPrice = $(parent).parent().parent().parent().next().find('.price strong').text();
          addId(img);
          if (parent.href.match(/(?:item\.taobao\.com|detail\.tmall\.com)/)) {
            nowUrl = parent.href;
          } else {
            if (id) {
              nowUrl = `https://item.taobao.com/item.htm?id=${id}`;
            } else {
              nowUrl = parent.href;
              if (!nowUrl.includes('click.simba.taobao.com')) {
                return;
              }
            }
          }
          // 加载小标签
          let renderTarget = parent;
          let leaveTarget = parent;
          if (G.aliSite) {
            renderTarget = $(parent).parents('.search-content-col')[0];
            if (!renderTarget) {
              renderTarget = $(parent).find('.img-wrapper img')[0];
            }
            leaveTarget = $(e.target).parents('.search-content-col')[0];
            if (!leaveTarget) {
              leaveTarget = renderTarget;
            }
            if (!leaveTarget) {
              extConsole.warn('no leave target');
            }
            nowPrice = $(renderTarget).find('[class^=priceInt--]').text();
          }
          setTimeout(() => {
            renderTip(renderTarget);
            bindDpEvent2(leaveTarget);
          }, 0);
        } else if (isNewTb) {
          let parentEl = $(parent).parents('[class^=Card--doubleCard--]');
          if (!parentEl.length) {
            parentEl = $(parent).parents('[class^=Card--listCard--]');
          }
          if (parentEl.length) {
            nowPrice = parentEl.find('.Card--price').text();
            // let nowId = parentEl.find('.ww-light.ww-small').attr('data-item')
            // nowUrl = `https://item.taobao.com/item.htm?id=${nowId}`
            nowUrl = parentEl.parents('a').attr('href');
            addId(img);
            renderTip(parent);
            bindDpEvent2(parent);
          }
        } else if (parent.tagName === 'A' && /^https?:\/\//.test(parent.href) && siteinfo.isProductPage(parent.href)) {
          addId(img);
          nowUrl = makeUrl(img, parent.href);
          renderTip(parent);
          bindDpEvent2(parent);
          if (G.aliSite) {
            nowPrice = getListPrice();
          }
        } else if (parent.parentElement.tagName === 'A' && /^https?:\/\//.test(parent.parentElement.href) && siteinfo.isProductPage(parent.parentElement.href)) {
          /*amazon.com有一种情况是 a div img 的结构*/
          parent = parent.parentElement;
          addId(img);
          nowUrl = makeUrl(img, parent.href);
          renderTip(parent);
          bindDpEvent2(parent);
          if (G.aliSite) {
            nowPrice = getListPrice();
          }
        } else if ($(parent).parents('.plugin_goodsCardWrapper').length) {
          // 京东新版搜索页
          addId(img);
          renderTip(parent);
          bindDpEvent2(parent);
          const text = $(parent).parents('.plugin_goodsCardWrapper').find('[class^=_price_]').text();
          nowPrice = (__webpack_require__(60340).extractNumberFromText)(text);
        } else if ($(parent).parents('a').length) {
          // console.log('[img] use last a element')
          let a = $(parent).parents('a')[0];
          if (siteinfo.isProductPage(a.href)) {
            parent = a;
            addId(img);
            nowUrl = makeUrl(img, parent.href);
            renderTip(parent);
            bindDpEvent2(parent);
          }
          if (G.aliSite) {
            const priceText = getListPrice();
            nowPrice = (__webpack_require__(60340).extractNumberFromText)(priceText);
          }
        }
      } else {
        extConsole.log('img parent is not a link, exit');
      }
    };
    $('body').on('mouseover', 'img, .pd_pic_wrap', dpMouseOver);
    // $('body').on('mouseover', '[class^=doubleCard--]', dpMouseOver)
    $('body').on('mouseover', '.search-content-col', dpMouseOver);
    $('body').on('mouseover', '[class^=doubleCardWrapper]', dpMouseOver);
    $('body').on('mouseover', '[class^=Card--listCard--]', dpMouseOver);
    $('body').on('mouseover', '.item-link', dpMouseOver);
    $('body').on('mouseover', '.more2_item', dpMouseOver);
    $('body').on('mouseover', '.pic.imglink', dpMouseOver);
    $('body').on('mouseover', '.plugin_goodsCardWrapper', dpMouseOver);
    smallTip2.on('mouseenter', smallTipOnMouseOver);
    smallTip.on('mouseleave', function () {
      tipDetail.hide();
      smallTip.hide();
    });
    tipDetail.on('mouseleave', function () {
      tipDetail.hide();
      smallTip.hide();
    });
  }
  function makeUrl(obj, url) {
    if (G.crc64) {
      return url;
    }
    switch (pageInfo.siteName) {
      case 'suning':
        var productId = $(obj).parents('.wrap').find('input.hidenInfo').attr('datapro').split('||')[0];
        url = "http://www.suning.com/emall/prd_10052_10051_-7_" + productId + "_.html";
        break;
    }
    return url;
  }
  function bindDpEvent2(dom) {
    var $dom = $(dom);
    if ($dom.attr(`${G.extBrand}_tip_bind`)) return;
    $dom.on(`mouseleave`, dpMouseLeave);
    $dom.attr(`${G.extBrand}_tip_bind`, 1);
  }
  function smallTipOnMouseOver() {
    clearTimeout(time);
    smallTip.show();
    render();
  }
  function dpMouseLeave() {
    extConsole.log('dpMouseLeave', Date.now());
    smallTip.hide();
    tipDetail.hide();
  }
  function renderTip(d) {
    extConsole.log('renderTip', Date.now());
    let dom = d;
    if ($(dom).parents('.p-img').length) {
      dom = $(dom).parents('.p-img')[0];
    }
    smallTip.css('left', getLeft(dom));
    smallTip.css('top', getTop(dom));
    smallTip.show().css('display', 'inline-block');
  }
  function addId(obj) {
    var id = '';
    switch (G.site) {
      case 'yihaodian':
        var d = $(obj).parent().attr('id').split('_');
        if (d) d = d[1];
        id = "&id=" + d + '-31';
        break;
    }
    newId = id;
  }

  // function currencyChange(data) {
  //   if (!G.currency || !data) return data;
  //   if (data.store && data.store.length > 0) {
  //     for (var i = 0; i < data.store.length; i++) {
  //       var item = data.store[i];
  //       if (item.price && item.price.match(/\d+/))
  //         data.store[i].price = '¥' + parseprice(item.price);
  //     }
  //   }
  //   if (data.trend && data.trend.store.length > 0) {
  //     for (var j = 0; j < data.trend.store[0].data.length; j++) {
  //       var item2 = data.trend.store[0].data[j];
  //       data.trend.store[0].data[j][1] = parseprice(item2[1]);
  //     }
  //     data.trend.store[0].min_price = parseprice(data.trend.store[0].min_price).toFixed(2);
  //     data.trend.store[0].max_price = parseprice(data.trend.store[0].max_price).toFixed(2);
  //     data.trend.store[0].current_price = parseprice(data.trend.store[0].current_price);
  //   }

  //   return data;
  // }
  const yanzhengma = url => {
    let html = __webpack_require__(97745);
    tipDetail.empty().append(template.compile(html)({
      url: url
    }));
    tipDetail.css('width', 370);
    resetTipDetailPos(tipDetail, smallTip);
  };
  const resetTipDetailPos = (tipDetail, smallTip) => {
    if ($(window).width() - getLeft($(smallTip)[0]) - $(smallTip).width() < 460) {
      tipDetail.css('left', 0 - $(tipDetail).width() - 3 + 'px');
    } else {
      tipDetail.css('left', '67px');
    }
  };
  async function render() {
    tipDetail.html(`<img src="${G.server}/template/aug/images/035.gif" style="margin: 5px;" id="${G.extBrand}_price_tip_loading">`);
    tipDetail.css('width', 50);
    // tipDetail.css('left', getLeft($(smallTip)[0]) + $(smallTip).width())
    // tipDetail.css('top', getTop($(smallTip)[0]))
    tipDetail.show();
    if (!tipResult[nowUrl]) {
      if (nowUrl.includes('click.simba.taobao.com')) {
        if (G.allowBackgroundRequest) {
          const res = await (__webpack_require__(40076).get)('/remoteAddress', {
            url: nowUrl
          });
          nowUrl = res;
        } else {
          const arr = nowTipDom.id.split('_');
          const id = arr[arr.length - 1];
          nowUrl = `https://item.taobao.com/item.htm?id=${id}`;
        }
      }
      let url = `${G.server}/brwext/tip_new?days=180&ver=1&site=${G.site}&price=${nowPrice}&url=${encodeURIComponent(nowUrl)}${newId}`;
      request.getOnce(url).then(msg => {
        try {
          if (msg && msg.now_url) {
            nowUrl = msg.now_url;
          }
          // msg = {
          //   is_ban: true,
          //   action: {
          //   method: 'redirect',
          //   to: 'https://tb.gwdang.com/static_page/activity_scan/imgScan.html?img=jd25618bg.png'
          //   }
          // }
          if (msg.is_ban && msg.action && msg.action.method === 'redirect' && msg.action.to) {
            yanzhengma(msg.action.to);
            return;
          }
          if (msg.trend.store.length === 0) {
            msg = noTrendAddTrendData(msg);
          }
          // msg = currencyChange(msg);         //暂时不转化汇率  使用原始货币  价格走势提示框里面才加人民币提示
          if (!msg || msg.trend.store.length === 0) return renderError();
          if (msg.trend.store[0].current_price == '0.00') return renderError();
          tipResult[nowUrl] = msg;
          render2(msg);
        } catch (e) {}
      }).catch(() => {
        return renderError();
      });
    } else render2(tipResult[nowUrl]);
  }
  function render2(msg) {
    // 处理数据
    processData(msg);
    let nostore;
    if (G.from_device === 'bijiago') {
      msg.store = [];
    }
    console.log('msg.store', msg.store);
    if (!msg.store || msg.store.length === 0) nostore = true;
    let lowestTime = util.getTimeNumber(msg.trend.store[0].min_stamp * 1000);
    tipDetail.removeClass('tip-error-info');
    if (msg.trend.store[0].max_price === msg.trend.store[0].min_price) {
      msg.trend.store[0].nowprice = msg.trend.store[0].min_price;
    }
    //msg.trend.store[0].price_status = require('bjgou/modules/trend').getPriceStatus(msg.trend.store[0].data).price_status
    tipDetail.html(template.compile(viewPriceTip)({
      data: msg,
      new_extension: G.new_extension,
      extName: G.extName,
      isAliSite: G.aliSite,
      nostore: nostore,
      lowestTime: lowestTime,
      extBrand: G.extBrand,
      isGwd: G.from_device !== 'bijiago' && G.from_device !== 'biyibi',
      site: G.site,
      ss_name: G.ss_name
    }));
    const isBjg = G.from_device === 'bijiago';
    if (G.aliSite || nostore) {
      tipDetail.css('width', isBjg && G.site === '360buy' ? 507 : 370);
      if (isBjg && G.site === '360buy') {
        const el = document.createElement('div');
        $('.tip-box-left').after(el);
        new Vue({
          el: el,
          render: h => h((__webpack_require__(50883)/* ["default"] */ .A))
        });
      }
    } else {
      tipDetail.css('width', 460);
    }
    if ($(window).width() - getLeft($(smallTip)[0]) - $(smallTip).width() < 460) {
      tipDetail.css('left', 0 - $(tipDetail).width() - 3 + 'px');
    } else {
      tipDetail.css('left', '67px');
    }
    initMiniTrend(msg.trend, msg.taobaoNoTrend, msg.start);
    bindFavorEvent(msg);
    if (G.aliSite) {
      msg.dp_id = msg.dp_id.replace('-83', '-123');
    }
    if (G.from_device !== 'bijiago' && G.from_device !== 'biyibi') {
      __webpack_require__(51683)(msg.dp_id);
    }
  }
  function bindFavorEvent(data) {
    $(`#${G.extBrand}_price_tip_notify_btn`).on(`click`, function (event) {
      event.preventDefault();
      $(`#${G.extBrand}_notify_error`).hide();
      $(`#${G.extBrand}_price_tip_notify_btn`).text('正在添加......');
      request.get(G.c_server + '/collect/aj_add?' + 'dp_id=' + data.dp_id + '&from=tip').done(msg => {
        if (msg.code == 100 || msg.code <= 0) {
          window.location.href = `http://www.${G.extName}.com/user/login?from_url=` + encodeURIComponent(window.location.href);
        } else if (msg.code == 1) {
          $(`#${G.extBrand}_price_tip_notify_btn`).text(`已添加到收藏夹`).attr(`style`, `float:right;color:#fff;background:#18A0F5;`);
        } else if (msg.code == 2) {
          if ($(`#${G.extBrand}_price_tip_notify_btn`).text() == `正在添加......`) {
            $(`#${G.extBrand}_price_tip_notify_btn`).text(`你已经添加过啦`).attr(`style`, `float:right;color:#fff;background:#18A0F5;`);
          }
        }
      });
    });
  }
  function processData(msg) {
    var new_icon_site_ids = [1, 103, 108, 123, 124, 126, 129, 134, 136, 14, 141, 15, 167, 168, 19, 2, 21, 25, 26, 28, 3, 31, 34, 35, 41, 6, 66, 7, 86, 93, 9];
    var store = msg.store;
    if (store) {
      for (var i = store.length - 1; i >= 0; i--) {
        store[i].icon_url = store[i].icon_url.replace("browser", "s1");
        if (store[i].price.indexOf('￥') > -1) store[i].price = '￥' + Number(store[i].price.replace('￥', '').replace(',', '')).toFixed(2);
        var site_id = /\/(\d+)\.ico/.exec(store[i].icon_url);
        if (site_id) {
          site_id = site_id[1];
          if (!G.IE6 && new_icon_site_ids.indexOf(Number(site_id)) > -1) {
            store[i].icon_url = store[i].icon_url.replace(/\d+\.ico/, site_id + ".png").replace(/browser\./, "s1.");
          }
        }
      }
    }
    let status_str = 'pri-t' + msg.trend.store[0].price_status;
    msg.trend.store[0].status_tle = priceTle[status_str];
    msg.trend.store[0].max_price = Number(msg.trend.store[0].max_price.replace(',', '')).toFixed(2);
    msg.trend.store[0].min_price = Number(msg.trend.store[0].min_price.replace(',', '')).toFixed(2);
  }
  function renderError(data) {
    if (data && data.is_ban) {
      yanzhengma(data.action.to);
    } else {
      tipDetail.html(G.lang === 'zh-tr' ? '<div>抱歉，當前商品暫無價格走勢~</div>' : '<div>抱歉，当前商品暂无价格走势~</div>');
      tipDetail.addClass('tip-error-info');
      tipDetail.css('width', 220);
      tipDetail.show();
    }
  }
  function initMiniTrend(data, taobaoNoTrend, sstart) {
    if (G.site == '360buy') {
      // 京东上的这个影响图表样式
      let p = $('.elevator_fix style');
      p.remove();
    }
    let yAxistext = '';
    if (moneyInfo) {
      yAxistext = moneyInfo[1];
    }
    let maxP = Number(data.store[0].max_price);
    let maxN;
    if (maxP > 5) {
      maxN = parseInt(data.store[0].max_price).toString() || '';
    } else {
      maxN = Number(data.store[0].max_price).toString() || '';
    }
    let maxN2 = yAxistext.length * 2;
    let maxS1 = parseInt(maxN.length * 5.6);
    let maxS2 = parseInt(maxN2 * 5.6);
    let maxS = Math.max(maxS1, maxS2);
    let chartML = maxS + 8 + 8;
    let yAxisY = maxS + 8;
    var trend_div = $(`#gwd_price_tip_trend`);
    var obj = {
      chart: {
        renderTo: `gwd_price_tip_trend`,
        type: 'line',
        backgroundColor: 'transparent',
        marginTop: 10,
        marginLeft: chartML,
        marginRight: 15,
        marginBottom: 27,
        spacing: [0, 0, 0, 0],
        events: {
          load: function () {
            let xinterval = parseInt((this.xAxis[0].dataMax - this.xAxis[0].dataMin) / 3.9) || 1;
            this.xAxis[0].update({
              tickInterval: xinterval
            });
            let lmin, lmax;
            lmin = Math.floor(this.yAxis[0].dataMin);
            lmax = Math.ceil(this.yAxis[0].dataMax);
            let interv2 = Math.pow(10, lmin.toString().length - 2);
            let tkinterv;
            if (this.yAxis[0].dataMax < 1) {
              lmin = this.yAxis[0].dataMin;
              lmax = this.yAxis[0].dataMax;
              tkinterv = 0;
            } else if (this.yAxis[0].dataMin === this.yAxis[0].dataMax) {
              lmin = Math.floor(lmin / interv2) * interv2;
              lmax = lmin * 2;
              lmin = 0;
              tkinterv = parseInt((lmax - lmin) / 2);
            } else {
              lmin = Math.floor(lmin / interv2) * interv2;
              lmax = Math.ceil(lmax / interv2) * interv2;
              if (lmin === lmax) {
                lmin = lmin - 1;
                lmax = lmax + 1;
              }
              tkinterv = parseInt((lmax - lmin) / 4);
              if (lmin + tkinterv < this.yAxis[0].dataMin) {
                lmin = lmin + tkinterv;
              }
            }
            let tkinterv2 = Math.pow(10, tkinterv.toString().length - 1);
            tkinterv = Math.ceil(tkinterv / tkinterv2) * tkinterv2;
            // console.log(lmin, lmax, tkinterv)
            this.yAxis[0].update({
              min: lmin,
              max: lmax,
              tickInterval: tkinterv || 1
            });
          }
        }
      },
      credits: {
        enabled: false
      },
      colors: ['#2f7ed8'],
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        labels: {
          rotation: 0,
          y: 16,
          step: 2,
          style: {
            fontSize: '10px',
            fontFamily: 'Helvetica',
            color: '#9D9D9D'
          },
          align: 'center'
        },
        dateTimeLabelFormats: {
          day: '%m-%e',
          week: '%m-%e',
          month: '%Y/%m',
          year: '%Y/%m'
        },
        tickLength: 0,
        gridLineColor: '#e6e9eb',
        lineColor: '#e6e9eb',
        minorTickLength: 0,
        gridLineWidth: 1
      },
      yAxis: {
        title: {
          text: "",
          rotation: 0,
          y: -20,
          x: -13,
          align: 'high',
          offset: 0,
          style: {
            fontFamily: 'Microsoft YaHei',
            fontSize: '10px',
            color: '#969899'
          }
        },
        labels: {
          align: 'left',
          padding: 4,
          x: -yAxisY,
          y: 3,
          style: {
            fontSize: '10px',
            fontFamily: 'Helvetica',
            color: '#9D9D9D'
          },
          formatter: function () {
            return this.value;
          }
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }],
        gridLineColor: '#e6e9eb',
        lineColor: '#e6e9eb',
        tickPixelInterval: 50
      },
      plotOptions: {
        series: {
          animation: false,
          marker: {
            radius: 2
          },
          enableMouseTracking: true,
          states: {
            hover: {
              enabled: true,
              fillColor: 'rgba(72,190,254,0.25)'
            }
          },
          shadow: false
        }
      },
      tooltip: {
        xDateFormat: '%Y-%m-%d',
        borderColor: "#48BEFE",
        useHTML: true,
        backgroundColor: 'white',
        formatter: function () {
          let x = new Date(this.x);
          let year = x.getFullYear();
          let month = x.getMonth() + 1;
          let day = x.getDate();
          if (month < 10) month = '0' + month.toString();
          if (day < 10) day = '0' + day.toString();
          // let format = data.msg.formatted[this.x.toString()];
          // let disc = format.discount
          // if (disc !== 0)
          //   disc = '-' + disc.toString() + '%';
          if (taobaoNoTrend) {
            let nowDate = new Date();
            if (x.getMonth() !== nowDate.getMonth() || x.getDate() !== nowDate.getDate()) {
              return false;
            }
          }
          let price;
          if (this.y !== 0) price = this.y.toFixed(2);else price = '0';
          let price2 = "";
          if (moneyInfo) {
            price2 = '(¥' + parseprice(price) + ')';
            price = moneyInfo[0] + price;
          }
          let dom = `
                <div style="background: white">
              <div>${year}/${month}/${day}</div>
              <div class="price-tip-item">
                <span class="price-tip-sp1" style="color: ${this.series.color};font-size:12px;font-family:arial;float:none">●</span>
                <span class="price-tip-sp2">${this.series.name}</span>
                <span class="price-tip-sp3" style="font-family:Helvetica">${price}${price2}</span>
              </div>
</div>`;
          return dom;
        }
      },
      legend: {
        enabled: false
      },
      series: []
    };
    obj.series[0] = {
      visible: true,
      name: data.store[0].name,
      pointStart: sstart,
      pointInterval: 86400000 * 179,
      color: "#48BEFE",
      lineWidth: 1,
      marker: {
        enabled: false
      },
      states: {
        enabled: false,
        hover: {
          lineWidth: 1
        }
      },
      data: []
    };
    if (taobaoNoTrend) {
      obj.series[0].dashStyle = "Dash";
    }
    if (data.store[0].data.length > 0) {
      var store = data.store[0];
      var len2 = store.data.length;
      var datas = store.data;
      if (store.min_stamp * 1000 > parseInt(Date.UTC(data.startY, data.startM, data.startD))) {
        obj.series[0].data.push(null);
      }
      if (taobaoNoTrend) {
        for (var j = 0; j < len2; j++) {
          obj.series[0].data.push({
            y: datas[j][1]
          });
        }
      } else {
        obj.series[0].data = data.store[0].data;
      }
    }
    if (taobaoNoTrend) {
      obj.series[0].data[1].marker = {
        enabled: true,
        fillColor: '#5ACFFB',
        radius: 2.5,
        lineWidth: 0,
        symbol: "circle"
      };
      obj.plotOptions.series.states = {
        hover: {
          enabled: false
        }
      };
    }
    if (moneyInfo) {
      obj.yAxis.title.text = moneyInfo[1];
      obj.yAxis.title.y = 104;
      obj.yAxis.title.x = -(chartML - 6 - maxS2);
    }
    if ($('#' + obj.chart.renderTo).length) {
      new Highcharts.Chart(obj);
    }
    trend_div.show();
  }
  return exports;
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 27252:
/***/ ((module) => {

"use strict";


module.exports = function (l) {
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var tmp = "";
  for (var i = 0; i < l; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return tmp;
};

/***/ }),

/***/ 27334:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ Indexvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ Index)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Index.vue?vue&type=template&id=0650373c&scoped=true
var Indexvue_type_template_id_0650373c_scoped_true = __webpack_require__(31900);
;// ./src/standard/module/components/ImgSame/Index.vue?vue&type=template&id=0650373c&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Index.vue?vue&type=script&lang=js
var Indexvue_type_script_lang_js = __webpack_require__(93327);
;// ./src/standard/module/components/ImgSame/Index.vue?vue&type=script&lang=js
 /* harmony default export */ const ImgSame_Indexvue_type_script_lang_js = (Indexvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Index.vue?vue&type=style&index=0&id=0650373c&prod&scoped=true&lang=less
var Indexvue_type_style_index_0_id_0650373c_prod_scoped_true_lang_less = __webpack_require__(49906);
;// ./src/standard/module/components/ImgSame/Index.vue?vue&type=style&index=0&id=0650373c&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Index.vue?vue&type=style&index=1&id=0650373c&prod&scoped=true&lang=less
var Indexvue_type_style_index_1_id_0650373c_prod_scoped_true_lang_less = __webpack_require__(23641);
;// ./src/standard/module/components/ImgSame/Index.vue?vue&type=style&index=1&id=0650373c&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/ImgSame/Index.vue



;



/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  ImgSame_Indexvue_type_script_lang_js,
  Indexvue_type_template_id_0650373c_scoped_true/* render */.XX,
  Indexvue_type_template_id_0650373c_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "0650373c",
  null
  
)

/* harmony default export */ const Index = (component.exports);

/***/ }),

/***/ 27733:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46228);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("616dd7b6", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 28264:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-minibar-bg",
    class: `gwd-minibar-${_vm.site} ${_vm.isNewJd ? "gwd-new-jd" : ""} ${_vm.additionalClass}`,
    style: {
      top: `${_vm.top}`
    }
  }, [_c("div", {
    class: {
      alisite_page: _vm.aliSite
    },
    staticStyle: {
      display: "flex"
    },
    attrs: {
      id: "gwd_minibar"
    }
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "minibar-tab",
    staticStyle: {
      flex: "1"
    },
    attrs: {
      id: "mini_price_history"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "minibar-tab",
    staticStyle: {
      flex: "1"
    },
    attrs: {
      id: "gwd_mini_compare"
    }
  }), _vm._v(" "), _vm.newTime ? _c("div", {
    staticClass: "minibar-tab",
    staticStyle: {
      flex: "1"
    },
    attrs: {
      id: "gwd_mini_seckill"
    }
  }, [_vm._m(1)]) : _c("div", {
    staticClass: "minibar-tab",
    staticStyle: {
      flex: "1"
    },
    attrs: {
      id: "gwd_mini_remind"
    }
  }, [_c("div", {
    staticClass: "minibar-btn-box"
  }), _vm._v(" "), _vm._m(2)])]), _vm._v(" "), _c("div", {
    staticClass: "gwd-mini-placeholder gwd-price-protect"
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-mini-placeholder",
    attrs: {
      id: "gwd-coupon-placeholder"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-mini-placeholder",
    attrs: {
      id: "gwd-dsj-placeholder"
    }
  }), _vm._v(" "), _c("div", {
    attrs: {
      id: "promo_box"
    }
  })]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwd_website",
    attrs: {
      title: "功能设置",
      id: "gwd_website_icon",
      target: "_blank",
      href: "#"
    }
  }, [_c("em", {
    staticClass: "setting-bg website_icon"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "minibar-btn-box"
  }, [_c("em", {}), _vm._v(" "), _c("span", [_vm._v("抢购提醒")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-collection-mini"
  }, [_c("div", {
    staticClass: "gwd-collection-mini-content"
  })]);
}];
render._withStripped = true;

/***/ }),

/***/ 28461:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33376);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("237597ab", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 28582:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-inline-row gwd-align gwd-jd-rank",
    class: _vm.additionalClass,
    style: `margin-top: ${_vm.mt}px`
  }, [_c("img", {
    staticClass: "gwd-icon-rank",
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/jdRanking/icon.svg",
      alt: ""
    }
  }), _vm._v(" "), _vm.additionalClass === "gwd-w217" ? _c("img", {
    staticStyle: {
      "margin-left": "-2px"
    },
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/jdRanking/text.svg",
      alt: ""
    }
  }) : _vm._e(), _vm._v(" "), _vm.additionalClass === "gwd-w210" || _vm.additionalClass === "gwd-w235" ? _c("img", {
    staticStyle: {
      "margin-left": "2px",
      "margin-right": "1px"
    },
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/jdRanking/text-w210.svg",
      alt: ""
    }
  }) : _vm._e(), _vm._v(" "), _c("hr", {
    staticClass: "gwd-vline"
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-rank-list gwd-row gwd-align",
    class: _vm.data.length > 1 ? "gwd-rotate" : "",
    staticStyle: {
      position: "relative"
    }
  }, [_c("a", {
    staticClass: "gwd-row gwd-align gwd-rank-first",
    attrs: {
      title: _vm.data[0].rname,
      href: _vm.data[0].rurl,
      target: "_blank"
    }
  }, [_c("span", {
    staticClass: "gwd-font11"
  }, [_c("span", {
    staticClass: "gwd-mw"
  }, [_vm._v(_vm._s(_vm.data[0].rname))]), _vm.data[0].rank ? _c("span", [_vm._v("第" + _vm._s(_vm.data[0].rank) + "名")]) : _vm._e()])]), _vm._v(" "), _vm.data.length > 1 ? _c("div", {
    staticClass: "gwd-rank-addition"
  }, _vm._l(_vm.addition, function (item) {
    return _c("a", {
      key: item.rurl,
      attrs: {
        title: item.rname,
        href: item.rurl,
        target: "_blank"
      }
    }, [_c("span", {
      staticClass: "gwd-font11 gwd-mw"
    }, [_vm._v(_vm._s(item.rname))])]);
  }), 0) : _vm._e()]), _vm._v(" "), _c("form", {
    staticStyle: {
      display: "none"
    },
    attrs: {
      action: _vm.debugMode ? `https://localdev.gwdang.com:3000/v2/ext/jd_rank` : `https://www.gwdang.com/v2/ext/jd_rank`,
      method: "post",
      target: "_blank"
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.content,
      expression: "content"
    }],
    attrs: {
      type: "hidden",
      name: "products"
    },
    domProps: {
      value: _vm.content
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.content = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search,
      expression: "search"
    }],
    attrs: {
      type: "hidden",
      name: "search"
    },
    domProps: {
      value: _vm.search
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.search = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.rankName,
      expression: "rankName"
    }],
    attrs: {
      type: "hidden",
      name: "rank"
    },
    domProps: {
      value: _vm.rankName
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.rankName = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.from,
      expression: "from"
    }],
    attrs: {
      type: "hidden",
      name: "from"
    },
    domProps: {
      value: _vm.from
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.from = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    staticStyle: {
      display: "inline-block",
      "font-size": "20px",
      color: "#666"
    },
    attrs: {
      type: "submit",
      value: "测试",
      id: `gwd-jdrank-submit-${_vm.id}`
    }
  })])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 29280:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {
  props: ['title', 'priceInfo', 'priceInfoCopy', 'link']
};

/***/ }),

/***/ 30077:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56004);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("f7be3236", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 30241:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Highcharts = __webpack_require__(58174);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
__webpack_require__(72712);
__webpack_require__(26910);
__webpack_require__(3362);
var _DataUpdateMixin = _interopRequireDefault(__webpack_require__(91920));
var _BarTrendInfo = _interopRequireDefault(__webpack_require__(863));
var _jQuery = _interopRequireDefault(__webpack_require__(10333));
var _util = _interopRequireDefault(__webpack_require__(30888));
var _globalCondition = _interopRequireDefault(__webpack_require__(41761));
const timeUtil = __webpack_require__(14396);
const extConsole = __webpack_require__(7129);
let dataPostedIn = null;
const miniChartHeight = 200;
const newTrend = (() => {
  let today = new Date();
  let chart;
  let renderedComponents = {};
  const viewTest = __webpack_require__(73256);
  const parsePrice = __webpack_require__(86421);
  const getMidDay = __webpack_require__(64737);
  const $ = __webpack_require__(10333);
  const template = __webpack_require__(26133);
  const cnzz = __webpack_require__(5300);
  const log = __webpack_require__(35743);
  const util = __webpack_require__(30888);
  const userData = __webpack_require__(74222);
  const countryConfig = __webpack_require__(22209);
  const globalCondition = __webpack_require__(41761);
  let chartBox = `#biggraph_chrome`;
  const oneDay = 3600 * 24 * 1000;
  let needFold = false;
  let foldValue; // 折叠后的原价线Y轴坐标
  let foldChange; // Y轴坐标与实际原价之差
  let coudanSeries;
  let toolTipDom, moneyInfo;
  let discountInfo = {},
    discountInfo2 = {};
  let nopuzzlePpromo,
    lowHighInfoObj = {},
    hideCoudanManage = {};
  let noTbTrend;
  let halfYearExist = false;
  Highcharts.wrap(Highcharts.Tooltip.prototype, 'hide', function (proceed) {
    proceed && proceed.apply && proceed.apply(this);
    this.chart.tooltip.options.onHide && this.chart.tooltip.options.onHide.apply && this.chart.tooltip.options.onHide.apply(this);
  });
  let currentSymbol = {
    folded: 'smallRect',
    extended: 'rect'
  };
  if (G.IE7 || G.IE8) {
    currentSymbol.folded = 'circle';
    currentSymbol.extended = 'circle';
  }
  let currentShowing = 'plotAll';
  let showingCenter = false;

  // 控制商城的显示
  let showingManager = (() => {
    let showList = [];
    return {
      inList: name => showList.indexOf(name) > -1,
      add: name => {
        if (showList.indexOf(name) > -1) {
          return;
        } else {
          showList.push(name);
        }
      },
      remove: name => {
        let pos = showList.indexOf(name);
        if (pos > -1) {
          showList.splice(pos, 1);
        }
      },
      clear: () => {
        showList = [];
      }
    };
  })();

  // 用于为商城分配颜色
  let generateColorForStore = (() => {
    let colorList = {};
    colorList['评论数'] = '#ca60a6';
    let availableColors = ['#5ACFFB', '#eb46eb', '#ffad06', '#21c1db', '#b88ae6', '#b37036', '#b9db0f', '#ffd91c'];
    let i = 0;
    return storeName => {
      if (colorList[storeName]) {
        return colorList[storeName];
      } else {
        if (i < availableColors.length) {
          colorList[storeName] = availableColors[i++];
          return colorList[storeName];
        } else {
          colorList[storeName] = '#' + parseInt(Math.random() * 256 * 256 * 256).toString(16);
          return colorList[storeName];
        }
      }
    };
  })();

  // qrcode log
  const doLog = (() => {
    let hasLogged = false;
    return () => {
      if (!hasLogged) {
        hasLogged = true;
        cnzz.log('trend-qrcode-show');
        log('trend-qrcode-show');
      }
    };
  })();
  const copy = origin => JSON.parse(JSON.stringify(origin));
  let originPrice = 0;
  let showHour = false;
  let store;
  let currentTime;
  let originData;
  let currentLineShowing;
  let plotWidth;
  originPrice = __webpack_require__(23891);

  // 原始的价格数据大多是一天一个数据的,但是如果数据点过少,鼠标滑动时就会有卡顿感,因此绘制走势图时需要增大数据点的数目
  // 填充好数据后，由于走势图上的点是连续的,和原始数据并不一致
  // 例如3天的价格分别为1、2、3,走势图上第一天和第二天之间的数据为1.5,但是实际上并不存在这个价格,鼠标移到该位置时在tooltip中应该显示为1
  // 此函数用于从实际走势图中的位置找到对应的原始价格
  let getNearestPriceFromOriginData = (name, price, position, time) => {
    let store = originData.store.filter(i => i.name === name)[0];
    if (store == undefined) {
      return price;
    }
    let arr = store[currentLineShowing];
    if (!arr) {
      return price;
    }
    if (!store.all_equal_short && currentLineShowing !== 'short_day_line' && time) {
      let firstDay, days;
      switch (currentLineShowing) {
        case 'all_line':
          firstDay = store.all_line_begin_time;
          break;
        case 'half_year_line':
          firstDay = store.half_year_line_time;
          break;
        case 'month_line':
          firstDay = store.month_line_time;
          break;
      }
      // firstDay = new Date(firstDay);
      // firstDay = new Date(firstDay.getYear() + 1900, firstDay.getMonth(), firstDay.getDate());
      // days = time - firstDay.getTime();

      const everyDayPrice = {};
      arr.forEach((i, idx) => {
        everyDayPrice[timeUtil.localeDateString(firstDay + idx * oneDay)] = i;
      });

      // return arr[parseInt(days / oneDay)];
      return everyDayPrice[timeUtil.localeDateString(time)];
    }
    //return arr[diff.indexOf(minVal)];
    let intPos = parseInt(arr.length * position - 1);
    if (intPos < 0) {
      intPos += 1;
    }
    let toSelect;
    if (intPos >= 1) {
      toSelect = [arr[intPos - 1], arr[intPos], arr[intPos + 1]];
    } else {
      toSelect = [arr[intPos], arr[intPos + 1]];
    }
    toSelect = toSelect.filter(x => x !== undefined);
    let diff = toSelect.map(i => Math.abs(i - price));
    let p = diff.indexOf(Math.min.apply(null, diff));
    return toSelect[p];
  };
  let mousePosition = {
    x: 0,
    y: 0
  };
  Highcharts.setOptions({
    global: {
      timezoneOffset: 0
    }
  });

  // Highcharts选项
  let obj = {
    chart: {
      renderTo: `plotArea_chrome`,
      type: 'line',
      animation: false,
      marginRight: 290,
      marginLeft: 70,
      backgroundColor: 'white',
      events: {
        load: function () {
          let firstSeries = this.series[0];
          let pointStart = this.xAxis[0].max - oneDay * 5;
          if (!firstSeries) {
            extConsole.warn('no first series', dataPostedIn);
          }
          if (firstSeries.options.pointStart > pointStart) {
            pointStart = firstSeries.options.pointStart;
          }
          const waterMarkSrc = showingCenter ? 'https://cdn.gwdang.com/images/extensions/logoMarkBigCenter@2x.png' : 'https://cdn.gwdang.com/images/extensions/logoMarkBigTop@2x.png';
          const img = this.renderer.image(waterMarkSrc, '50%', this.xAxis[0].top + 45, showingCenter ? 210 : 300, showingCenter ? 64 : 91);
          img.add();
          if (showingCenter) {
            img.attr({
              transform: 'translate(-80, 0)'
            });
          } else {
            img.attr({
              transform: 'translate(-150, 0)'
            });
          }
          let series = this.series;
          // 让一个外部变量可访问，方便控制显示隐藏
          if (series && series[1] && series[1].name === '凑单到手价') {
            coudanSeries = series[1];
          }
          plotWidth = this.plotWidth;
          let theData = series[0].data;
          // theData.forEach((i) => {
          //   if (i.y !== originPrice) {
          //     originSeriesShouldShow = true;
          //   }
          // });
          let days = 0;
          let chartShowing = showingCenter && G.centerSeries ? G.centerSeries : currentShowing;
          switch (chartShowing) {
            case 'plotYear':
              days = 180;
              break;
            case 'plotMonth':
              days = 30;
              break;
            case 'plot5Day':
              days = 5;
              break;
          }
          if (chartShowing !== 'plotAll') {
            this.xAxis[0].update({
              min: currentTime - days * oneDay,
              max: currentTime
            });
          }
          let currentShowingSeries = series.filter(item => item.visible && item.name !== 'max' && item.name !== 'min');
          if (currentShowingSeries.length === 0) {
            return;
          }
          let arr = currentShowingSeries.map(i => i.options.pointStart).filter(i => i);
          let minStart = Math.min.apply(null, arr);
          if (chartShowing !== 'plotAll') {
            minStart = currentTime - days * oneDay;
          }
          for (let i = 0; i < series.length; i++) {
            if (series[i].data.length) {
              theData = series[i].data;
              break;
            }
          }
          let lastPoint = theData[theData.length - 1];
          this.xAxis[0].update({
            min: minStart,
            max: lastPoint ? lastPoint.x : today.getTime()
          });
          let lmin, lmax;
          lmin = Math.floor(this.yAxis[0].dataMin);
          lmax = Math.ceil(this.yAxis[0].dataMax);
          let interv2 = Math.pow(10, lmin.toString().length - 2);
          let tkinterv;
          if (this.yAxis[0].dataMax < 1) {
            lmin = this.yAxis[0].dataMin;
            lmax = this.yAxis[0].dataMax;
            tkinterv = (lmax - lmin) / 2;
          } else if (this.yAxis[0].dataMin === this.yAxis[0].dataMax) {
            lmin = Math.floor(lmin / interv2) * interv2;
            lmax = lmin * 2;
            lmin = 0;
            tkinterv = parseInt((lmax - lmin) / 2);
          } else {
            lmin = Math.floor(lmin / interv2) * interv2;
            lmax = Math.ceil(lmax / interv2) * interv2;
            tkinterv = parseInt((lmax - lmin) / 5);
          }
          // 调整最大最小值 使曲线看起来分布均匀
          let tkinterv2 = Math.pow(10, parseInt(tkinterv).toString().length - 1);
          if (tkinterv < 1) {
            tkinterv2 = tkinterv;
          }
          tkinterv = Math.ceil(tkinterv / tkinterv2) * tkinterv2;
          this.yAxis[0].update({
            min: lmin,
            max: lmax,
            tickInterval: tkinterv || 1
          });

          // if (this.yAxis.length > 1) {
          //   if (this.yAxis[0].dataMin == this.yAxis[0].dataMax) {
          //     let interv = parseInt(this.yAxis[0].dataMin * 0.2);
          //     if (interv > 100) {
          //       interv = Math.round(interv / 100) * 100
          //     }
          //     this.yAxis[0].update({
          //       min: parseInt(this.yAxis[0].dataMin * 0.5),
          //       max: parseInt(this.yAxis[0].dataMin * 1.5),
          //       tickInterval: interv
          //     });
          //   }
          //   this.yAxis[1].update({
          //     min: this.yAxis[1].dataMin,
          //     max: this.yAxis[1].dataMax,
          //     tickInterval: parseInt(this.yAxis[1].dataMax / 5) || 1
          //   });
          //   this.xAxis[0].update({
          //     min: this.series[1].data[0].category
          //   });
          // }
        }
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: null,
      style: {
        fontWeight: 'bold',
        fontFamily: 'Microsoft YaHei',
        fontSize: 16
      }
    },
    xAxis: {
      offset: 0,
      type: 'datetime',
      dateTimeLabelFormats: {
        minute: '%m/%d',
        hour: '%m/%d',
        day: '%m/%d',
        week: '%m/%d',
        month: '%y/%m'
      },
      crosshair: {
        dashStyle: 'ShortDash',
        snap: false,
        zIndex: 999,
        color: '#444'
      },
      minorGridLineColor: '#dfdfdf',
      labels: {
        rotation: 0,
        y: 30,
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica',
          color: '#969899'
        },
        align: 'center'
      },
      gridLineColor: '#e6e9eb',
      lineColor: '#e6e9eb',
      gridLineWidth: 1,
      tickLength: 0,
      minTickInterval: oneDay,
      startOnTick: false,
      tickPositioner: function () {
        let positions = [];
        let min = this.min;
        let max = this.max;
        let minDate = new Date(min);
        let tick = 0;
        let mode;
        let months = 1;
        if (max - min > 300 * oneDay) {
          let s = new Date(1900 + minDate.getYear(), minDate.getMonth() + 1, 2);
          tick = s.getTime();
          let widthPerMonth = plotWidth / ((max - min) / (30 * oneDay));
          if (!widthPerMonth) return;
          while (months * widthPerMonth < 100) {
            months++;
          }
          mode = 'nmonth';
        } else if (max - min > 64 * oneDay) {
          let s = new Date(1900 + minDate.getYear(), minDate.getMonth() + 1, 2);
          tick = s.getTime();
          mode = 'month';
        } else if (max - min > 10 * oneDay) {
          tick = min;
          mode = 'day';
        } else {
          let s = new Date(1900 + minDate.getYear(), minDate.getMonth(), minDate.getDate() + 1);
          tick = s.getTime();
          mode = 'hour';
        }
        while (tick - 3600000 * 15 <= max) {
          let s;
          let s1;
          positions.push(tick - 3600000 * 15);
          switch (mode) {
            case 'month':
              s = new Date(tick);
              s1 = new Date(1900 + s.getYear(), s.getMonth() + 1, 2);
              tick = s1.getTime();
              break;
            case 'day':
              tick += 5 * oneDay;
              break;
            case 'hour':
              tick += oneDay;
              break;
            case 'nmonth':
              s = new Date(tick);
              s1 = new Date(1900 + s.getYear(), s.getMonth() + months, 2);
              tick = s1.getTime();
              break;
          }
        }
        if (showingCenter) {
          let i = 0;
          while (positions[i] < this.min) i++;
          positions = [positions[i], positions[positions.length - 1]];
        }
        switch (mode) {
          case 'month':
          case 'nmonth':
            positions.info = {
              unitName: 'month',
              higherRanks: {}
            };
            break;
          default:
            positions.info = {
              unitName: 'day',
              higherRanks: {}
            };
        }
        // positions.forEach((i) => {
        //
        // });
        return positions;
      }
    },
    yAxis: {
      offset: 0,
      labels: {
        align: 'right',
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica',
          color: '#969899'
        },
        formatter: function () {
          let valStr;
          if (!needFold || this.value < foldValue) {
            valStr = Highcharts.numberFormat(this.value, 2);
          } else {
            valStr = Highcharts.numberFormat(this.value + foldChange, 2);
          }
          // if (valStr[valStr.length - 1] === '.') {
          //   valStr += '00';
          // }
          valStr = valStr.replace(',', '');
          if (Number(valStr) > 9999) {
            valStr = Number(valStr);
          } else if (Number(valStr) > 10) {
            valStr = parseInt(valStr);
          }
          const min = this.axis.tickPositions[0];
          if (this.axis.tickInterval === 1 && min === parseInt(min)) {
            valStr = valStr.toString().replace('.00', '');
          }
          // let valNum = Number(valStr.replace(/,/g, ''))
          // if (valNum/100000 > 1) {
          //   valStr = valNum/10000 + '万'
          // }
          return valStr;
        }
      },
      align: 'high',
      gridLineColor: '#e6e9eb',
      minorGridLineWidth: 0,
      title: {
        text: null,
        rotation: 0,
        y: -20,
        x: -13,
        align: 'high',
        offset: 0,
        style: {
          fontFamily: 'Microsoft YaHei',
          fontSize: 12,
          color: '#969899'
        }
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        turboThreshold: 0,
        states: {
          hover: {
            enabled: true,
            halo: {
              size: 0
            }
          }
        },
        marker: {
          enabled: false
        },
        dataGrouping: {
          enabled: false
        },
        animation: false
      },
      line: {
        states: {
          hover: {
            enabled: true,
            lineWidth: 1
          }
        }
      }
    },
    tooltip: {
      shadow: false,
      shared: true,
      valueSuffix: '元',
      hideDelay: 0,
      shape: 'square',
      followPointer: false,
      dateTimeLabelFormats: {
        day: '%Y/%m/%e',
        minute: '%Y/%m/%e',
        second: '%Y/%m/%e',
        hour: '%Y/%m/%e %H:%M'
      },
      useHTML: true,
      positioner: function (boxWidth, boxHeight, point) {
        if (point.plotX + boxWidth > this.chart.plotWidth + 12) {
          return {
            x: point.plotX - boxWidth + this.chart.plotLeft,
            y: this.chart.plotHeight / 2 - boxHeight / 2 + 45
          };
        }
        return {
          x: point.plotX + this.chart.plotLeft,
          y: this.chart.plotHeight / 2 - boxHeight / 2 + 45
        };
      },
      onHide: function () {
        renderTooltip('hide');
      },
      formatter: function () {
        let tipObj = {};
        tipObj.x = this.x;
        let x = new Date(this.x);
        let year = x.getFullYear();
        let month = x.getMonth() + 1;
        let day = x.getDate();
        let hour = x.getHours();
        let hasdiscount;
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        // showHour = true;
        let timeStr = `${year}/${month}/${day}` + (showHour ? ` ${hour}:00` : '');
        tipObj.time = timeStr.replace(/\//g, '.');
        let result1 = "";
        let filtered = this.points.sort((a, b) => {
          let s = getNearestPriceFromOriginData(b.series.name, b.y, (b.point.index + 1) / b.series.data.length, b.x - 8 * 3600000) - getNearestPriceFromOriginData(a.series.name, a.y, (a.point.index + 1) / a.series.data.length, b.x - 8 * 3600000);
          return s;
        }).filter(item => {
          if (item.series.name === 'max' || item.series.name === 'min') {
            return false;
          }
          return true;
        });
        if (filtered.length === 0) {
          return false;
        }
        filtered.forEach((i, index) => {
          let showName = i.point.series.name;
          let showPrice = getNearestPriceFromOriginData(showName, i.point.y, (i.point.index + 1) / i.point.series.data.length, i.point.x);
          showPrice = Highcharts.numberFormat(showPrice, 2);
          if (showPrice[showPrice.length - 1] === '.') {
            showPrice += '00';
          }
          if (showName == '页面价') {
            tipObj.pagePrice = showPrice.replace(/,/g, '');
          } else if (showName == '凑单到手价') {
            tipObj.addpro = showPrice.replace(/,/g, '');
          }
          if (showName === "凑单到手价" && i.y === filtered[0].y && i.y === Number(tipObj.pagePrice)) {
            result1 += "";
          } else {
            if (showName === "凑单到手价") hasdiscount = true;
          }
        });
        if (hasdiscount) {
          let promoObj = discountInfo[timeUtil.localeDateString(this.points[0].x)];
          let promotion = promoObj && promoObj["promotion"] || "";
          let quan = promoObj && promoObj["coupon"] && promoObj["coupon"].replace("领券:", "");
          let promoStr = "";
          if (quan) {
            if (quan.match(/\d+-\d+/)) {
              let quanarr = quan.split('-');
              promoStr += `券:&nbsp;满${quanarr[0]}减${quanarr[1]}` + ' ';
            } else {
              promoStr += `券:&nbsp;${quan}` + ' ';
            }
          }
          if (promotion) {
            promoStr += `促:&nbsp;${promotion}`;
          }
          tipObj.promo1 = promoStr;
        }
        if (noTbTrend) {
          (__webpack_require__(7129).log)('noTbTrend');
          let time = util.getTimeNumber(new Date().getTime(), '5');
          // 不用highchart默认的tooltip  使用自定义的
          if (timeStr === time) {
            (__webpack_require__(7129).log)('noTbTrend A');
            renderTooltip(null, tipObj);
          } else {
            (__webpack_require__(7129).log)('noTbTrend B');
            renderTooltip('hide');
          }
        } else {
          renderTooltip(null, tipObj);
        }
      },
      backgroundColor: 'rgba(255,255,255,0.94)',
      borderColor: '#d5d5d5',
      borderWidth: 1,
      style: {
        padding: 0
      }
    },
    series: []
  };
  if (G.IE7 || G.IE8) {
    obj.tooltip.style = {
      width: '400px'
    };
  }
  let getEarlistDay = store => {
    if (!store.length) {
      return false;
    }
    if (store.length === 1) {
      return store[0].all_line_begin_time;
    }
    return store.reduce((prev, next) => {
      if (typeof prev == 'number') {
        return Math.min(prev, next.all_line_begin_time);
      } else {
        return Math.min(prev.all_line_begin_time, next.all_line_begin_time);
      }
    });
  };
  let seriesList = {
    plotAll: [],
    plotYear: [],
    plotMonth: [],
    plot5Day: [],
    plotSpecial: [],
    days180: []
  };
  let setXAxisMinInterval = x => {
    obj.xAxis.minTickInterval = x;
  };
  let qrlogged = false;
  let lastShow = Date.now();
  let showSeries = (series, isCenter = false, obj, minibar) => {
    extConsole.log('showSeries', series, isCenter, obj, minibar);
    let t = Date.now();
    if (t - lastShow < 100) {
      return;
    }
    lastShow = t;
    if (!seriesList[series] || !seriesList[series].length) {
      let k = Object.keys(seriesList).filter(x => seriesList[x].length);
      series = k[0];
    }
    extConsole.log('loginLayer showSeries', series, isCenter, obj, minibar);
    extConsole.log('loginLayer hide');
    extConsole.log('loginLayer dpid', G.dp.dpId);
    $('#gwd-topText').hide();
    $('.gwd-blurLayer').removeClass('gwd-blurLayer');
    let series2 = series;
    showingCenter = isCenter;
    if (hideCoudanManage && hideCoudanManage[series]) {
      $('#mini_price_history_detail_btn').addClass('no-review');
      $('.discount-price-re').hide();
      $('#bar_trend_legend_btn').addClass('no-review');
    } else if (hideCoudanManage) {
      $('#mini_price_history_detail_btn').removeClass('no-review');
      $('.discount-price-re').show();
      $('#bar_trend_legend_btn').removeClass('no-review');
    }
    if (series === 'center') {
      series = 'plotAll';
    }
    if (series !== 'days180') {
      // 加载概况 最高最低等信息
      renderBarTrendInfo(series, isCenter);
    }
    obj.series = seriesList[series];
    if (series === 'days180') series = 'plotYear';
    $('.floatButtons>a').removeClass('activePlot');
    $('.floatButtons>#' + series).addClass('activePlot');
    //new Highcharts.Chart(obj);
    let theSeries = seriesList[series2];
    if (series === 'plot5Day') {
      setXAxisMinInterval(oneDay);
      showHour = true;
      currentLineShowing = 'short_day_line';
    } else {
      showHour = false;
    }
    if (series === 'plotMonth') {
      setXAxisMinInterval(5 * oneDay);
      currentLineShowing = 'month_line';
    }
    $('.gwd-not-login').removeClass('gwd-not-login');
    if (isCenter) {
      obj.chart.marginBottom = 23;
    }
    if (series === 'plotAll') {
      let dayLength = Math.max.apply(null, theSeries.map(i => i.data.length));
      if (!G.email) {
        // $('.max-min-priinfo').addClass('gwd-not-login')
        $('.barTrendInfoBox').addClass('gwd-not-login');
      } else {
        $('.gwd-not-login').removeClass('gwd-not-login');
      }

      //在非淘宝天猫网站上，如果全部的时间超过180天，需要登陆
      if (store[0].half_year_line) {
        halfYearExist = true;
      }
      if (halfYearExist) {
        if (theSeries[0].pointStart < new Date().getTime() - 180 * 24 * 3600000 && !G.userLogin) {
          extConsole.log('loginLayer show', isCenter, series2, theSeries[0]);
          $('#gwd-topText').show();
          if ((__webpack_require__(4873).getChromeVersion)() < 53) {
            $('#gwd-topText').css('background', 'white');
          }
          const LoginBox = (__webpack_require__(36664)["default"]);
          new Vue({
            el: '#gwd-trend-login',
            render: h => h(LoginBox)
          });
          $(`#plotArea_chrome`).addClass('gwd-blurLayer');
        }
      }
      if (dayLength > 30) {
        setXAxisMinInterval(30 * oneDay);
      } else if (dayLength > 5) {
        setXAxisMinInterval(5 * oneDay);
      } else {
        setXAxisMinInterval(oneDay);
      }
      currentLineShowing = 'all_line';
      if (store[0].all_equal_short || store[0].all_line.length < 5 && store.length == 1) {
        currentLineShowing = 'short_day_line';
        showHour = true;
        if (store[0].all_line.length < 5 && store.length == 1) {
          obj.series[0].pointStart = today.getTime() + 8 * 3600000 - (store[0].all_line.length - 1) * oneDay;
        }
      }
    }
    if (series === 'plotYear') {
      setXAxisMinInterval(30 * oneDay);
      currentLineShowing = 'half_year_line';
    }
    if (isCenter) {
      //currentShowing = 'center';
    } else {
      currentShowing = series;
    }
    chart = new Highcharts.Chart(obj);
    window.gwd_chart = chart;
    if (isCenter) {
      let s = chart.series[0].data;
      let lastPoint = s[s.length - 1];
      if (chart.series.length > 1) {
        s = chart.series[1].data;
        if (s[s.length - 1].plotX === lastPoint.plotX && s[s.length - 1].plotY !== lastPoint.plotY) {
          lastPoint = s[s.length - 1];
        }
      }
      (__webpack_require__(7129).log)(lastPoint);
      if (lastPoint.y) {
        globalCondition.setMet('lastPointPos', lastPoint);
      }
    }
  };
  let enablePlot = plotName => {
    $('.floatButtons>' + plotName).removeClass('bjd-hidden');
  };
  let doBind = () => {
    $('.floatButtons').on('click', 'a', e => {
      let isCenter = false;
      if ($(e.target).parents('#mini_price_history_detail').length) {
        G.centerSeries = e.target.id;
        isCenter = true;
      }
      showSeries(e.target.id, isCenter, util.deepCopy(obj));
    });
  };
  const doMainBind = () => {
    let hidecoudanBar;
    $('#bar_trend_legend_btn').on('click', e => {
      let id = $(e.target).attr('data-id');
      if (!id) id = $(e.target).parent().attr('data-id');
      if (id === 'plotSpecial') {
        if (!hidecoudanBar) {
          hidecoudanBar = true;
          coudanSeries.hide();
          $('#bar_trend_legend_btn').addClass('hideserires');
        } else {
          coudanSeries.show();
          hidecoudanBar = false;
          $('#bar_trend_legend_btn').removeClass('hideserires');
        }
      }
    });
  };
  const doMiniBind = () => {
    let hidecoudan;
    $('#mini_price_history_detail_btn').on('click', e => {
      let id = $(e.target).attr('data-id');
      if (!id) id = $(e.target).parent().attr('data-id');
      if (id === 'plotSpecial') {
        if (!hidecoudan) {
          hidecoudan = true;
          coudanSeries.hide();
          $('#mini_price_history_detail_btn').addClass('hideserires');
        } else {
          coudanSeries.show();
          hidecoudan = false;
          $('#mini_price_history_detail_btn').removeClass('hideserires');
        }
      }
    });
  };
  let resetData = i => {
    return {
      y: i,
      marker: {
        enabled: false
      }
    };
  };
  // 加载价格走势最高最低信息

  const BarTrendInfo = (__webpack_require__(863)["default"]);
  let barTrendComp = null;
  let miniTrendComp = null;
  const renderBarTrendInfo = (series, isCenter) => {
    let showcoudan;
    let obj1 = lowHighInfoObj[series + '0'];
    if (!obj1) {
      obj1 = Object.keys(lowHighInfoObj)[0];
      obj1 = lowHighInfoObj[obj1];
    }
    if (typeof obj1.lowestDate === 'number') obj1.lowestDate = util.getTimeNumber(obj1.lowestDate);
    let obj2 = lowHighInfoObj[series + '1'];
    if (obj2) {
      if (obj2.Plowest < obj1.Plowest) showcoudan = true;
      if (typeof obj2.lowestDate === 'number') obj2.lowestDate = util.getTimeNumber(obj2.lowestDate);
      if (moneyInfo) {
        obj2.display_nowprice = obj2.nowprice ? moneyInfo[0] + obj2.nowprice : obj2.nowprice;
        obj2.display_Phighest = obj2.Phighest ? moneyInfo[0] + obj2.Phighest : obj2.Phighest;
        obj2.display_Plowest = obj2.Plowest ? moneyInfo[0] + obj2.Plowest : obj2.Plowest;
      } else {
        obj2.display_nowprice = '¥' + obj2.nowprice;
        obj2.display_Phighest = '¥' + obj2.Phighest;
        obj2.display_Plowest = '¥' + obj2.Plowest;
      }
    }
    if (moneyInfo) {
      obj1.display_nowprice = obj1.nowprice ? moneyInfo[0] + obj1.nowprice : obj1.nowprice;
      obj1.display_Phighest = obj1.Phighest ? moneyInfo[0] + obj1.Phighest : obj1.Phighest;
      obj1.display_Plowest = obj1.Plowest ? moneyInfo[0] + obj1.Plowest : obj1.Plowest;
    } else {
      obj1.display_nowprice = '¥' + obj1.nowprice;
      obj1.display_Phighest = '¥' + obj1.Phighest;
      obj1.display_Plowest = '¥' + obj1.Plowest;
    }
    let lowtle = `最低(单&nbsp;&nbsp;&nbsp;件):`;
    // if (G.aliSite) {
    //   lowtle = `最低:`;
    // } else if (!hideCoudanManage || !obj2) {
    //   lowtle = `最低(单件):`;
    // }
    let oinfo = userData.get('other_info');
    let dp_id = oinfo && oinfo.now && oinfo.now.dp_id;
    let promoUrl;
    if (dp_id) {
      promoUrl = `https://www.gwdang.com/trend/${dp_id}.html?static=true`;
    }
    if (obj1 && obj2 && obj1.Plowest === obj2.Plowest && obj1.lowestDate === obj2.lowestDate) {
      obj2 = null;
    }
    if (!G.h_nopuzzle_promo) {
      promoUrl = null;
    }
    let data = {
      d1: obj1,
      d2: obj2,
      aliSite: G.aliSite,
      promoUrl: promoUrl,
      lowtle: lowtle,
      showcoudan: showcoudan
    };
    if (isCenter) {
      const trendInfoList = [];
      const d1 = data.d1,
        d2 = obj2;
      const formatDate = dateStr => {
        // (2024.06.10) => 2024-06-10
        return dateStr.replace(/\./g, '-').replace(')', '').replace('(', '');
      };
      if (d1.nowprice) {
        trendInfoList.push({
          text: '现价: ' + d1.display_nowprice,
          color: '#3fc0c0'
        });
      } else {
        trendInfoList.push({
          text: '最高: ' + d1.display_Phighest,
          color: '#e4393c'
        });
        trendInfoList.push({
          text: `最低(单件):` + ' ' + d1.display_Plowest,
          color: '#35bd68',
          date: formatDate(d1.lowestDate)
        });
      }
      if (d2) {
        trendInfoList.push({
          text: '最低(多件): ' + d2.display_Plowest,
          color: '#e89607',
          date: formatDate(d2.lowestDate)
        });
      }
      miniTrendComp.trendInfoList = trendInfoList;
    }
    if (!$('.barTrendInfoBox').length) {
      let el = document.createElement('DIV');
      $('#gwdang-pri-trend-chart').append(el);
      barTrendComp = new Vue({
        el: el,
        data: data,
        render: function (h) {
          return h(BarTrendInfo, {
            props: {
              d1: this.d1,
              d2: this.d2,
              aliSite: this.aliSite,
              promoUrl: this.promoUrl,
              lowtle: this.lowtle,
              showcoudan: this.showcoudan
            }
          });
        }
      });
    } else {
      Object.keys(data).forEach(key => {
        barTrendComp[key] = data[key];
      });
    }
    window.barTrendComp = barTrendComp;
    globalCondition.setMet('promoUrl', promoUrl);
    setTimeout(function () {
      // 为了上下对齐， 需要手动计算一次上面的距离给下面
      let ppiW = $('#gwdang-trend-detail .opi-sp1').outerWidth() + $('#gwdang-trend-detail .opi-sp2').outerWidth();
      $('#gwdang-trend-detail .ppi-sp1').width(Math.ceil(ppiW) + 2);
    }, 100);
  };
  const getLowestDate2 = (ki, data) => {
    let store = data.store[ki];
    if (ki === 1) {
      let origin_st = data.store[0].all_line;
      if (store.all_line.join("") === origin_st.join("")) {
        return;
      }
    }
    getLowestDate('plotAll', ki, store.all_line, store.all_equal_short, store.all_line_begin_time, data.promo);
    if (store.half_year_line && store.half_year_line.length > 0) {
      if (ki === 1) {
        let origin_st = data.store[0].half_year_line;
        if (store.half_year_line.join("") === origin_st.join("")) {
          return;
        }
      }
      getLowestDate('plotYear', ki, store.half_year_line, store.all_equal_short, store.half_year_line_time, data.promo);
    }
    let newStsize = store.all_line.length;
    if (newStsize > 180) {
      newStsize = store.all_line.length;
      let newSt = store.all_line.slice(newStsize - 180);
      if (ki === 1) {
        let origin_st = data.store[0].all_line.slice(newStsize - 180);
        if (newSt.join("") === origin_st.join("")) {
          return;
        }
      }
      let pointStart = store.all_line_begin_time + 86400000 * (newStsize - 180);
      getLowestDate('days180', ki, newSt, store.all_equal_short, pointStart, data.promo);
    } else {
      if (ki === 1) {
        let origin_st = data.store[0].all_line;
        if (store.all_line.join("") === origin_st.join("")) {
          return;
        }
      }
      getLowestDate('days180', ki, store.all_line, store.all_equal_short, store.all_line_begin_time, data.promo);
    }
    if (store.month_line && store.month_line.length > 0) {
      if (ki === 1) {
        let origin_st = data.store[0].month_line;
        if (store.month_line.join("") === origin_st.join("")) {
          return;
        }
      }
      getLowestDate('plotMonth', ki, store.month_line, store.all_equal_short, store.month_line_time, data.promo);
    }
  };
  const getLowestDate = (id, ki, newSt, all_equal_short, pointStart, promo) => {
    // 计算最低最高点 以及最低点对应的时间
    id = id + ki.toString();
    lowHighInfoObj[id] = {};
    let Plowest, Phighest;
    let lowestDate;
    let lowestPromo, lowestPromoPprice, lowestCoupon;
    Plowest = Math.min.apply(Math, newSt);
    Phighest = Math.max.apply(Math, newSt);
    let low_index = newSt.lastIndexOf(Plowest);
    let low_index2 = low_index;
    let point_interval = 86400000;
    if (all_equal_short) point_interval = 3600000;
    lowestDate = pointStart + point_interval * low_index;
    if (ki == 1) {
      for (let k = low_index2; k > 0; k--) {
        if (newSt[k] === newSt[low_index2]) {
          // let str = (pointStart + point_interval * (k) - 3600000 * 8).toString()
          let str = timeUtil.localeDateString(pointStart + point_interval * k);
          if (Number(discountInfo2[str] && discountInfo2[str].price) == Plowest) {
            lowestDate = Number(str) + 3600000 * 8;
            break;
          }
        }
      }
      for (let i = 0; i < promo.length; i++) {
        // 获取最低点对应的促销活动
        if (promo[i].time * 1000 === lowestDate - 3600000 * 8) {
          lowestPromo = promo[i].msg.promotion;
          lowestCoupon = promo[i].msg.coupon && promo[i].msg.coupon.replace("领券:", "");
          lowestPromoPprice = (promo[i].ori_price / 100).toFixed(2);
        }
      }
    }
    lowHighInfoObj[id].lowestDate = lowestDate;
    lowHighInfoObj[id].Plowest = Number(Plowest).toFixed(2);
    lowHighInfoObj[id].Phighest = Number(Phighest).toFixed(2);
    if (lowHighInfoObj[id].Phighest === lowHighInfoObj[id].Plowest) {
      lowHighInfoObj[id].nowprice = lowHighInfoObj[id].Plowest;
    }
    if (lowestPromo || lowestCoupon) {
      let str = '';
      str += '页面价' + lowestPromoPprice + '&nbsp;&nbsp;';
      if (lowestCoupon) {
        if (lowestCoupon.match(/\d+-\d+/)) {
          let quanarr = lowestCoupon.split('-');
          str += `券: 满${quanarr[0]}减${quanarr[1]}` + '&nbsp;';
        } else {
          str += `券: ${lowestCoupon}` + ' ';
        }
      }
      if (lowestPromo) str = str + '促: ' + lowestPromo.replace(/，/g, ',');
      lowHighInfoObj[id].lowestPromo = str;
      lowHighInfoObj[id].lowestPromoPprice = lowestPromoPprice;
    }
  };
  let pageLow = {};
  // 在走势图上加label标签
  const addSeriesDataLabels = (data, nopuzzle_promo, key) => {
    let addpromo;
    if (data.name === '页面价' && nopuzzle_promo) {
      addpromo = true;
    }
    let obj = {
      enabled: true,
      borderColor: '#f2f2f2',
      borderWidth: 1,
      padding: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      shadow: false,
      borderRadius: 2,
      style: {
        fontWeight: 'normal',
        fontFamily: 'Helvetica',
        fontSize: '13px'
      },
      y: -3,
      formatter: function () {
        return '¥' + this.y.toString().replace(',', '');
      }
    };
    let list = data.data;
    let lowestIndex = 0;
    let highestIndex = 0;
    let low = list[0].y || 9999999;
    let high = list[0].y || 0;
    let allNull = true;
    for (let i = 0; i < list.length; i++) {
      if (i != 0 && i != list.length - 1 && list[i].y) {
        allNull = false;
      }
      if (addpromo) {
        for (let j = 0; j < nopuzzle_promo.length; j++) {
          if (data.pointStart + data.pointInterval * i - 3600000 * 19 === nopuzzle_promo[j].time * 1000) {
            if (nopuzzle_promo[j].showCircle) {
              list[i].marker = {
                enabled: true,
                fillColor: '#fff',
                lineColor: '#5ACFFB',
                radius: 2.5,
                lineWidth: 1,
                symbol: "circle"
              };
            }
          }
        }
      }
      if (list[i].y && list[i].y >= high) {
        high = list[i].y;
        highestIndex = i;
      }
      if (list[i].y && list[i].y <= low) {
        low = list[i].y;
        lowestIndex = i;
      }
    }
    if (data.name === '页面价') {
      pageLow[key] = list[lowestIndex].y;
    }
    if (allNull && data.name === '凑单到手价' && hideCoudanManage) {
      hideCoudanManage[key] = true;
      return;
    }
    if ((!list[lowestIndex - 1] || list[lowestIndex - 1].y === null) && (!list[lowestIndex + 1] || list[lowestIndex + 1].y === null)) {
      return;
    }
    if (data.name === '凑单到手价' && pageLow[key] === list[lowestIndex].y) {
      return;
    }
    if (highestIndex === lowestIndex) {
      obj.color = '#3FC0F0';
      // list[highestIndex].dataLabels = obj;
    } else {
      obj.color = '#E4393C';
      if (data.name === '页面价') {
        // list[highestIndex].dataLabels = obj;
        list[highestIndex].marker = {
          enabled: true,
          fillColor: 'rgba(228,57,60,1)',
          lineColor: 'rgba(228,57,60,0.3233)',
          radius: 2.5,
          lineWidth: 4,
          symbol: "circle"
        };
      }
      let obj2 = JSON.parse(JSON.stringify(obj));
      obj2.color = '#35BD68';
      let fillColor = 'rgba(53,189,104,1)';
      let lineColor = 'rgba(53,189,104,0.3233)';
      if (data.name === '凑单到手价') {
        obj2.color = '#FFC06D';
        fillColor = 'rgba(255,166,0,1)';
        lineColor = 'rgba(255,166,0,0.3233)';
      }
      // list[lowestIndex].dataLabels = obj2;
      list[lowestIndex].marker = {
        enabled: true,
        fillColor: fillColor,
        lineColor: lineColor,
        radius: 2.5,
        lineWidth: 4,
        symbol: "circle"
      };
    }
    if (noTbTrend) {
      list[list.length - 1].marker = {
        enabled: true,
        fillColor: '#5ACFFB',
        radius: 2.5,
        lineWidth: 0,
        symbol: "circle"
      };
    }
  };
  const TooltipView = (__webpack_require__(82350)/* ["default"] */ .A);
  const TooltipViewBar = (__webpack_require__(66614)/* ["default"] */ .A);
  const renderTooltip = (ishide, data) => {
    if (ishide) {
      $(toolTipDom).hide();
      return;
    }
    $(toolTipDom).show();
    if (data.addpro === data.pagePrice) data.addpro = null;
    if (nopuzzlePpromo) {
      for (let i = 0; i < nopuzzlePpromo.length; i++) {
        //if (data.x - 3600000 * 19 === nopuzzlePpromo[i].time * 1000) {
        if ((__webpack_require__(14396).isSameDay)(data.x, nopuzzlePpromo[i].time * 1000)) {
          let str = '';
          if (nopuzzlePpromo[i].msg.coupon) {
            let coupon = nopuzzlePpromo[i].msg.coupon;
            if (coupon.match(/\d+-\d+/)) {
              let quanarr = coupon.split('-');
              str += `券:&nbsp;满${quanarr[0]}减${quanarr[1]}` + ' ';
            } else {
              str += `券:&nbsp;${coupon}` + ' ';
            }
          }
          if (nopuzzlePpromo[i].msg.promotion) {
            str = str + '促:&nbsp;' + nopuzzlePpromo[i].msg.promotion + '  ';
          }
          data.directpro = (nopuzzlePpromo[i].price / 100).toFixed(2);
          data.promo2 = str;
          data.pagePrice = (nopuzzlePpromo[i].ori_price / 100).toFixed(2);
        }
      }
    }
    let html = __webpack_require__(37484);
    if (toolTipDom !== '#big_tooltip') {
      html = __webpack_require__(90987);
    }
    let domclass = '';
    if (data.directpro) domclass += 'directpro ';
    if (data.addpro) domclass += 'addpro ';
    if (data.addpro || data.directpro) {
      $(toolTipDom).addClass('bigheight');
    } else {
      $(toolTipDom).removeClass('bigheight');
    }
    if (moneyInfo) {
      let np = parsePrice(data.pagePrice, moneyInfo[2]);
      data.pagePrice = moneyInfo[0] + data.pagePrice + `(¥${np})`;
    } else {
      data.pagePrice = '¥' + data.pagePrice;
    }
    if (!renderedComponents[toolTipDom]) {
      let el = document.createElement('DIV');
      $(toolTipDom).empty().append(el);
      renderedComponents[toolTipDom] = new Vue({
        data: {
          data: data,
          domclass: domclass,
          aliSite: false
        },
        el: el,
        mixins: [_DataUpdateMixin.default],
        render: function (h) {
          return h(toolTipDom !== '#big_tooltip' ? TooltipViewBar : TooltipView, {
            props: {
              data: this.data,
              domclass: this.domclass,
              aliSite: this.aliSite
            }
          });
        }
      });
    } else {
      renderedComponents[toolTipDom].updateData({
        data: data,
        domclass: domclass,
        aliSite: false
      });
    }
  };
  // 两条线相同点部分去掉 避免重叠造成颜色污染
  const sliceData = data => {
    for (let pattern in data) {
      if (data[pattern].length && data[pattern].length > 1 && data[pattern][1].name === "凑单到手价") {
        let size = data[pattern][0].data.length;
        for (let i = 2; i < size; i++) {
          let a1 = data[pattern][0].data;
          let a2 = data[pattern][1].data;
          if (a1[i].y === a2[i].y && a1[i - 1].y === a2[i - 1].y && (a1[i - 2].y === a2[i - 2].y || a2[i - 2].y === null)) {
            a2[i - 1].y = null;
          }
        }
      }
    }
  };
  let hasBind = false;
  const exports = {
    init: async (data, currentPage = 'dpPage', target = false, plotLinesHideStatus = false) => {
      // 评论走势
      //renderReviewData(data)
      dataPostedIn = JSON.parse(JSON.stringify(data));
      lowHighInfoObj = {};
      $('#biggraph_chrome').remove();
      if ($('#plotArea_chrome').length) {
        $('.bjd-newtrend-dev').remove();
        $('#plotArea_chrome').remove();
        $('#gwd-topText').remove();
      }
      currentShowing = 'plotAll';
      renderedComponents = {};
      noTbTrend = false;
      seriesList = {
        plotAll: [],
        plotYear: [],
        plotMonth: [],
        plot5Day: [],
        plotSpecial: [],
        days180: []
      };
      originPrice = 0;
      let renderMiniTrendInfo;
      // 加载货币配置 获取当前网站货币符号
      moneyInfo = countryConfig.getMoneyInfo(G.logsite);
      if (moneyInfo[2] === 'CNY') moneyInfo = null;
      if (data.taobaoNoTrend) noTbTrend = true;
      if (data.store && data.store[0] && data.store[0].all_line.length === 0) return;
      $('body').append(`<div id="biggraph_chrome" style="position: absolute;left: -1000000px; top: -100000px;background: white;overflow: visible"></div>`);
      $(chartBox).append(viewTest);
      let biggraphState = '';
      doBind();
      if (target) {
        $(target).append($(chartBox));
      }

      // 顶部
      let time = 0;
      if (!hasBind) {
        $(`#${G.extName}-trend`).hover(() => {
          if (Date.now() - time < 1000) {
            return;
          }
          toolTipDom = '#big_tooltip_top';
          obj.chart.marginRight = 30;
          obj.chart.marginBottom = 23;
          obj.chart.marginTop = 4;
          obj.xAxis.labels.y = 22;
          if (moneyInfo) {
            obj.yAxis.title.text = moneyInfo[1];
            obj.yAxis.title.y = 176;
          }
          let num = parseInt(lowHighInfoObj['plotAll0'].Phighest).toString().length;
          obj.chart.marginLeft = 29 + 9 + parseInt(num * 6.8);
          obj.yAxis.labels.x = -9;
          obj.yAxis.title.x = -(9 + parseInt(num * 6.8) - 24);
          $(chartBox).css({
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
          });
          // if (biggraphState === 'trend') return;
          let chartArea = $(`#${G.extName}-pri-trend-chart`);
          chartArea.append($(chartBox));
          biggraphState = 'trend';
          $('.floatButtons').show();
          $('#bjd-qrcode-trend').show();
          if ($('#bjd-qrcode-trend').length) {
            doLog();
          }
          $(chartBox).css({
            visibility: 'hidden'
          });
          window.setTimeout(() => {
            let width1 = $('.floatButtons').width();
            (__webpack_require__(7129).log)('float button width', width1);
            $('#bar_trend_legend_btn').css('right', width1 + 50 + 'px');
            showSeries(currentShowing, false, util.deepCopy(obj));
            let width = $(`#${G.extName}-pri-trend-chart`).width();
            chart.setSize(width, 182);
            plotWidth = chart.plotWidth;
            chart.axes[0].update(obj.xAxis);
            $(chartBox).css({
              visibility: 'visible'
            });
            doMainBind();
          }, 0);
        });
      }
      const renderMiniTrend = detail => {
        toolTipDom = '#big_tooltip';
        let lowest_obj = lowHighInfoObj['days1800'];
        let lowest_obj2, lowestDate, lowestDate2;
        if (data.store[1] && data.store[1].name === '凑单到手价') {
          lowest_obj2 = lowHighInfoObj['days1801'];
          lowestDate2 = lowest_obj2 && lowest_obj2.lowestDate;
          lowestDate2 = lowestDate2 && util.getTimeNumber(lowestDate2);
        }
        lowestDate = lowest_obj.lowestDate;
        if (G.aliSite && data.lowestTime) lowestDate = new Date(data.lowestTime).getTime();
        // lowestDate = lowestDate - 3600000 * 8;

        lowestDate = util.getTimeNumber(lowestDate);
        if (!renderMiniTrendInfo) {
          let oinfo = userData.get('other_info');
          let dp_id = oinfo && oinfo.now && oinfo.now.dp_id;
          let promoUrl;
          if (dp_id) {
            promoUrl = `https://www.gwdang.com/trend/${dp_id}.html?static=true`;
          }
          let infohtml = __webpack_require__(41623);
          let lowtle = `最低(单件):`;
          // if (G.aliSite) {
          //   lowtle = `最低:`;
          // } else if (!hideCoudanManage || !lowestDate2) {
          //   lowtle = `最低(单件):`;
          // }
          if (lowest_obj && lowest_obj2 && lowest_obj.Plowest === lowest_obj2.Plowest && lowest_obj.lowestDate === lowest_obj2.lowestDate) {
            lowest_obj2 = null;
          }
          if (!G.h_nopuzzle_promo) {
            promoUrl = null;
          }
          // if ($('.orign-pri-info').length) {
          //   $('.orign-pri-info').remove();
          // }
          if ($('.mini-share-product').length) {
            $('.mini-share-product').remove();
            $('#mini-share-btn').remove();
          }

          // $('.max-min-priinfo').empty().append(template.compile(infohtml)({
          //   lowtle: lowtle,
          //   aliSite: G.aliSite,
          //   lowest_obj: lowest_obj,
          //   lowestDate: lowestDate,
          //   lowestDate2: lowestDate2,
          //   promoUrl: promoUrl,
          //   lowest_obj2: lowest_obj2,
          //   currency: moneyInfo ? moneyInfo[0]: '¥'
          // }))

          const trendInfoList = [];
          const currency = moneyInfo ? moneyInfo[0] : '¥';
          const formatDate = date => date.replace('(', '').replace(')', '').replace(/\./g, '-');
          if (lowest_obj.nowprice) {
            trendInfoList.push({
              text: '现价: ' + currency + lowest_obj.nowprice,
              color: '#3fc0c0'
            });
          } else {
            trendInfoList.push({
              text: '最高: ' + currency + lowest_obj.Phighest,
              color: '#e4393c'
            });
            trendInfoList.push({
              text: lowtle + ' ' + currency + lowest_obj.Plowest,
              color: '#35bd68',
              date: formatDate(lowestDate)
            });
          }
          if (lowest_obj2 && lowestDate2) {
            trendInfoList.push({
              text: '最低(多件): ' + currency + lowest_obj2.Plowest,
              color: '#e89607',
              date: formatDate(lowestDate2)
            });
          }
          const infoEl = document.createElement('DIV');
          $('.max-min-priinfo').empty().append(infoEl);
          const MiniTrendInfoBar = (__webpack_require__(78803)/* ["default"] */ .A);
          miniTrendComp = new Vue({
            el: infoEl,
            data() {
              return {
                trendInfoList: trendInfoList
              };
            },
            render: function (h) {
              return h(MiniTrendInfoBar, {
                props: {
                  trendInfoList: this.trendInfoList
                }
              });
            }
          });
          window.gwdMiniTrendComp = miniTrendComp;
          const tipEl = document.createElement('DIV');
          $('.max-min-priinfo').append(tipEl);
          const PriceTip = (__webpack_require__(69779)/* ["default"] */ .A);
          new Vue({
            el: tipEl,
            render: h => h(PriceTip, {
              props: {
                currency
              }
            })
          });
          globalCondition.setMet('promoUrl', promoUrl);

          // 分享商品
          // require('shareProduct').init(data.price_status)
          if (!lowest_obj2) {
            $('#mini_price_history').removeClass('coudanpri');
          }
          setTimeout(function () {
            let ppiW = $('.opi-sp1').outerWidth() + $('.opi-sp2').outerWidth();
            $('.promo-pri-info .ppi-sp1').width(Math.ceil(ppiW) + 2);
          }, 100);
          renderMiniTrendInfo = true;
        }
        if (moneyInfo) {
          $('#mini_price_history .ht-mm-max').text(moneyInfo[0] + lowest_obj.Phighest);
          $('#mini_price_history .ht-mm-min').text(moneyInfo[0] + lowest_obj.Plowest);
          $('#big_tooltip').addClass('ht_tip');
        }
        obj.title.x = 0;
        obj.chart.marginRight = 16;
        obj.chart.marginTop = 5;
        obj.yAxis.title.text = null;
        obj.xAxis.labels.y = 20;
        obj.xAxis.labels.x = -2;
        obj.yAxis.title.y = -26;
        if (moneyInfo) {
          obj.chart.marginTop = 4;
          let num = parseInt(lowest_obj.Phighest).toString().length;
          obj.chart.marginRight = 2;
          obj.chart.marginLeft = Math.ceil(num * 6.8 + 11);
          obj.chart.marginBottom = 24;
          // obj.yAxis.labels.x = -Math.ceil(num * 6.8 + 11);
          obj.yAxis.labels.x = -14;
          obj.yAxis.title.x = -(Math.ceil(num * 6.8 + 11) - 24); //25 title长度
          obj.yAxis.title.text = moneyInfo[1];
          // obj.yAxis.title.y = 162;
          obj.yAxis.title.y = -12;
        } else {
          let num = parseInt(lowest_obj.Phighest).toString().length;
          obj.chart.marginLeft = 16 + 14 + parseInt(num * 6.8);
          obj.yAxis.labels.x = -14;
        }
        if (lowest_obj.Phighest < 1) {
          obj.chart.marginLeft = 16 + 14 + parseInt(4 * 6.8);
        }
        if (G.site === 'amazon') {
          obj.chart.marginLeft = 50;
        }
        // $('.floatButtons').hide();
        $('#bjd-qrcode-trend').hide();
        // yhd.com
        $('#detailPromotion').css({
          zIndex: 0
        });
        $(chartBox).css({
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        });
        if (biggraphState === 'btn') return;
        $(detail).append($(chartBox));
        doMiniBind();
        biggraphState = 'btn';
        $(chartBox).css({
          visibility: 'hidden'
        });
        window.setTimeout(() => {
          originPrice = 0;
          // if (data.store[0].all_line.length > 31 && !data.store[0].all_equal_short) {
          //   showSeries('plotMonth', true);
          // } else {
          //   showSeries('plotAll', true);
          // }
          let toShow = 'days180';
          if (store[0].all_line.length < 180) {
            toShow = currentShowing;
          }
          if (store[0].half_year_line) {
            halfYearExist = true;
          }
          if (G.centerSeries) {
            toShow = G.centerSeries;
          }
          showSeries(toShow, true, util.deepCopy(obj), true);
          let width1 = $(`#bdext_mini_trendbox`).width();
          let height1 = miniChartHeight;
          if (!width1) {
            width1 = 460;
          }
          if (G.site == 'amazon') {
            width1 = 450;
          }
          const shaidanAvailable = G.shaidanAvailable;
          if (shaidanAvailable) {
            width1 = 460;
          } else {
            width1 = 690;
            $('#mini_price_history_detail_chart').css('width', '690px');
            $('.mini_price_history_detail_wrapper').css('width', '676px');
            $('#mini_price_history_detail_btn').css('width', '690px');
            $('#big_tooltip').css('width', '690px');
          }
          if (width1 && width1 > 0) {
            chart.setSize(width1, height1, false);
          }
          $(chartBox).css({
            visibility: 'visible'
          });
        }, 25);
      };
      if (true) {
        (__webpack_require__(30888).waitForConditionFn)(() => {
          return $(`#mini_price_history`).length;
        }).then(() => {
          $(`#mini_price_history`).hover(() => {
            if (window.gwdTrendReAdjust) {
              window.gwdTrendReAdjust();
            }
            let doms = '#mini_price_history_detail_chart';
            // if (G.site == 'amazon' || G.site == '6pm') {
            //   doms = '#mini_ht_detail_chart'
            // }
            $('body').addClass('gwd-trend-hover-p');
            if (window.gwdMiniFixSwitcher) {
              window.gwdMiniFixSwitcher.replaceToFixed();
            }
            renderMiniTrend(doms);
            setTimeout(() => {
              if (window.gwdTrendFixed) {
                return;
              }
              if (!(__webpack_require__(60340).isNewJd)()) {
                return;
              }
              window.gwdTrendFixed = true;
            }, 0);
          });

          // yhd.com
          $(`#mini_price_history_detail`).mouseleave(() => {
            $('#detailPromotion').css({
              zIndex: 15
            });
          });
        });
      }

      // 底部
      $(`#gwd-trend`).hover(() => {
        // obj.yAxis.title.text = foreignTitle
        if (biggraphState === `gwd`) return;
        obj.chart.marginRight = 60;
        obj.chart.marginBottom = 23;
        obj.chart.marginTop = 4;
        obj.xAxis.labels.y = 22;
        $(chartBox).css({
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        });
        $(`#gwd-trend-chart`).append($(chartBox));
        biggraphState = `gwd`;
        $(chartBox).css({
          visibility: 'hidden'
        });
        window.setTimeout(() => {
          showSeries(currentShowing, false, util.deepCopy(obj));
          chart.reflow();
          $(chartBox).css({
            visibility: 'visible'
          });
          $(`#gwd-trend-chart`).show();
          doMainBind();
        }, 0);
        $('.floatButtons').show();
        $('#bjd-qrcode-trend').show();
        if ($('#bjd-qrcode-trend').length) {
          doLog();
        }
        $('#bjd-qrcode-trend').css('bottom', '9px');
      });
      $(`#plotArea_chrome`).css({
        maxWidth: document.body.clientWidth - 280 + 'px'
      });
      $(`#plotArea_chrome`).mousemove(e => {
        mousePosition.x = e.pageX;
        mousePosition.y = e.pageY;
      });
      $(`#plotArea_chrome`).click(function () {
        return false;
      });
      hasBind = true;
      if (data) {
        store = data.store;
        getLowestDate2(0, data);
        if (data.store[1] && data.store[1].name === "凑单到手价" && data.promo) {
          // 如果有凑单到手价同时有对应的促销活动   把促销活动信息给一个全局变量方便取用
          for (let i = 0; i < data.promo.length; i++) {
            let datestr = timeUtil.localeDateString(data.promo[i].time * 1000);
            discountInfo[datestr] = data.promo[i].msg;
            discountInfo2[datestr] = {
              price: data.promo[i].price,
              info: data.promo[i].msg.promotion
            };
          }
          // 计算最低最高价和时间
          getLowestDate2(1, data);
          $(".discount-price-re").show();
          // $('#mini_price_history').addClass('coudanpri')
          $('#bar_trend_legend_btn').removeClass('no-review');
          (__webpack_require__(30888).waitForConditionFn)(() => $(`#mini_price_history_detail_btn`).length).then(() => {
            $('#mini_price_history_detail_btn').removeClass('no-review');
          });
          extConsole.log('trend: has review');
        } else {
          hideCoudanManage = null;
          $('#bar_trend_legend_btn').addClass('no-review');
          (__webpack_require__(30888).waitForConditionFn)(() => $(`#mini_price_history_detail_btn`).length).then(() => {
            $('#mini_price_history_detail_btn').addClass('no-review');
          });
          extConsole.log('trend: no review');
        }
        if (data.nopuzzle_promo) {
          G.h_nopuzzle_promo = true;
        }
        // if (G.aliSite) {
        //   $('#bar_trend_legend_btn').remove()
        //   $('#mini_price_history_detail_btn').addClass('aliSite')
        // }
        originData = data;
        let earlistDay = Math.min(data.store[0] && data.store[0].all_line_begin_time, getEarlistDay(store));
        let currentDay = data.now_day;
        currentTime = data.now_day;
        let seriesConfig = [{
          plot: 'plotAll',
          start: 'all_line_begin_time',
          minDay: 0.1,
          data: 'all_line'
        }, {
          plot: 'plotMonth',
          start: 'month_line_time',
          minDay: 30,
          data: 'month_line'
        }, {
          plot: 'plotYear',
          start: 'half_year_line_time',
          minDay: 0.1,
          data: 'half_year_line'
        }, {
          plot: 'days180',
          start: 'all_line_begin_time',
          minDay: 0.1,
          data: 'all_line'
        }];
        enablePlot('#plotAll');
        // if (store[0].name.indexOf('(当前)') === -1) {
        //   store[0].name += '(当前)';
        // }
        store[0].name = "页面价";
        let storeLimit = 18;
        if (currentPage === 'zhidemai') {
          storeLimit = 1;
        }
        if (currentPage === 'priceHistory') {
          storeLimit = 20;
        }
        let allDays = parseInt((currentDay - earlistDay) / oneDay);
        for (let i = 0; i < Math.min(store.length, storeLimit); i++) {
          if (store[i].all_line.length === 0) continue;
          // if (store[i].promo && store[i].promo.length > 0) {
          //   promotionData[store[i].name] = store[i].promo[0].desc;
          // }
          if (store[i].all_equal_short && store.length !== 1) {
            store[i].all_line = [];
            for (let j = 0; j < store[i].short_day_line.length; j += 24) {
              store[i].all_line.push(store[i].short_day_line[j]);
            }
            store[i].all_line_begin_time = data.now_day - 5 * oneDay;
            store[i].all_equal_short = false;
          }
          for (let k = 0; k < seriesConfig.length; k++) {
            let j = seriesConfig[k];
            if (getMidDay(currentDay) - getMidDay(earlistDay) >= j.minDay * oneDay) {
              if (!store[i][j.data]) {
                continue;
              }
              if (j.start !== 'short_day_line_begin_time') {
                //store[i][j.start] = getMidDay(store[i][j.start]);
              }
              if (store[i].all_equal_short && j.start === 'all_line_begin_time') {
                //store[i][j.start] = store[i].short_day_line_begin_time;
              }
              enablePlot('#' + j.plot);
              let newSeries = {
                color: generateColorForStore(store[i].name),
                name: store[i].name,
                pointStart: store[i][j.start],
                pointInterval: oneDay,
                legendIndex: 1,
                connectNulls: false,
                lineWidth: 1,
                zIndex: 500 - i * 500 - 1,
                marker: {
                  //symbol: 'rect',
                  symbol: currentSymbol.extended,
                  states: {
                    hover: {
                      enabled: false
                    }
                  }
                },
                states: {
                  hover: {
                    enabled: false,
                    halo: {
                      size: 0
                    }
                  }
                },
                data: store[i][j.data]
              };
              if (store[i].name === '凑单到手价') {
                newSeries.color = "#FFC06D";
              }
              if (noTbTrend) {
                newSeries.dashStyle = "Dash";
              }
              if (j.plot === 'plot5Day') {
                //newSeries.pointStart -= 5*oneDay;
                newSeries.pointInterval = 3600000;
                if (newSeries.pointInterval * newSeries.data.length + newSeries.pointStart > currentTime) {
                  currentTime = newSeries.pointInterval * newSeries.data.length + newSeries.pointStart;
                }
              }
              if (j.plot === 'plotAll' && newSeries.data.length < 30) {
                newSeries.pointInterval = oneDay;
                setXAxisMinInterval(oneDay);
              }
              if ((j.plot === 'plotAll' || j.plot === 'days180') && store[i].all_equal_short) {
                if (i === 0) {
                  newSeries.pointInterval = 3600000;
                  //all_equal_short = true;
                } else {
                  let s = new Date(newSeries.pointStart);
                  let s2 = new Date(s.getYear() + 1900, s.getMonth(), s.getDate(), 8);
                  newSeries.pointStart = s2.getTime();
                  newSeries.pointInterval = oneDay;
                  let tmpData = [];
                  for (let i = 0; i < newSeries.data.length; i += 24) {
                    tmpData.push(newSeries.data[i]);
                  }
                  newSeries.data = tmpData;
                }
              }
              // 增大点的密度,使移动平滑
              newSeries.addPointTimes = 1;
              while (newSeries.data && newSeries.data.length < 100) {
                if (j.plot === 'plotAll') {
                  break;
                }
                let newData = [];
                for (let k = 0; k < newSeries.data.length; k++) {
                  newData.push(newSeries.data[k]);
                  if (k + 1 === newSeries.data.length) break;
                  newData.push(newSeries.data[k]);
                }
                newSeries.data = newData;
                newSeries.pointInterval = newSeries.pointInterval / 2;
                newSeries.addPointTimes = newSeries.addPointTimes * 2;
              }
              newSeries.data = newSeries.data ? newSeries.data.map(resetData) : null;
              if (newSeries.data != null) {
                seriesList[j.plot].push(newSeries);
              }
              // require('common/extConsole').log('newSeries data', JSON.parse(JSON.stringify(newSeries.data)));
            }
          }
        }
        if (seriesList['plotAll'].length === 1) {
          let series = seriesList['plotAll'][0];
          series.data = series.data.map(i => i.y);
          while (series.data.length < 100) {
            let newData = [];
            for (let k = 0; k < series.data.length; k++) {
              newData.push(series.data[k]);
              if (k + 1 === series.data.length) break;
              newData.push(series.data[k]);
            }
            series.data = newData;
            series.pointInterval = series.pointInterval / 2;
          }
          series.data = series.data.map(i => {
            return {
              y: i,
              marker: {
                enabled: false
              }
            };
          });
        }
        // 和原始数据重合的点 去掉
        // sliceData(seriesList)
        if (!store[0].all_equal_short) {
          $('#plotAll').html(`全部${store[0].all_line.length}天`);
          if (store[0].all_line.length > 180) {
            currentShowing = 'plotYear';
          }
        } else {
          allDays++;
          $('#plotAll').html(`全部(${allDays}天)`);
        }
        showingManager.clear();
        // 默认显示原始价格和当前商品
        if (originPrice && currentPage !== 'zhidemai') {
          showingManager.add('当前商城原始价格');
        }
        showingManager.add(store[0].name);

        // data copy start
        let mergeSeries = (a, b) => {
          let bList = b.map(item => item.name);
          return a.map(item => {
            if (bList.indexOf(item.name) === -1) {
              return item;
            } else {
              let toMerge = b.filter(j => j.name === item.name)[0];
              let tmp = copy(item);
              tmp.data = toMerge.data;
              tmp.pointStart = toMerge.pointStart;
              tmp.pointInterval = toMerge.pointInterval;
              return tmp;
            }
          });
        };
        let fillSeries = seriesList => {
          let pointIntervalList = seriesList.map(i => i.pointInterval);
          let minInterval = Math.min.apply(null, pointIntervalList);
          seriesList.forEach(series => {
            while (series.pointInterval > minInterval) {
              let newData = [];
              for (let i = 0; i < series.data.length; i++) {
                newData.push(series.data[i]);
                if (i + 1 === series.data.length) break;
                let newPoint = {
                  marker: series.data[i].marker,
                  y: (series.data[i + 1].y + series.data[i].y) / 2
                };
                newData.push(newPoint);
              }
              series.pointInterval = series.pointInterval / 2;
              series.data = newData;
            }
          });
        };
        ['plotMonth', 'plotYear'].forEach(i => {
          if (!$(`#${i}`).hasClass('bjd-hidden')) {
            let allSeries = seriesList['plotAll'];
            let thisSeries = seriesList[i];
            let toAdd = mergeSeries(allSeries, thisSeries);
            seriesList[i] = toAdd;
            fillSeries(seriesList[i]);
          }
        });
        fillSeries(seriesList['plotAll']);
        let days180_size = seriesList['days180'][0] && seriesList['days180'][0].data.length;
        if (days180_size && days180_size > 180) {
          for (let k = 0; k < seriesList['days180'].length; k++) {
            seriesList['days180'][k].data.splice(0, days180_size - 180);
            seriesList['days180'][k]['pointStart'] = seriesList['days180'][k]['pointStart'] + seriesList['days180'][k]['pointInterval'] * (days180_size - 180);
          }
        }
        for (let spattern in seriesList) {
          if (seriesList[spattern].length) {
            for (let di = 0; di < seriesList[spattern].length; di++) {
              addSeriesDataLabels(seriesList[spattern][di], data.nopuzzle_promo, spattern);
              nopuzzlePpromo = data.nopuzzle_promo;
            }
          }
        }

        // showSeries('plotAll', false, util.deepCopy(obj));
        //chart.reflow();
      }
      ;
    },
    resetBind: () => {
      hasBind = false;
    }
  };
  return exports;
})();
var _default = exports["default"] = newTrend;

/***/ }),

/***/ 30391:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.data.time ? _c("div", [_c("div", {
    staticClass: "prifontf tip-time"
  }, [_vm._v(_vm._s(_vm.data.time))]), _vm._v(" "), _c("div", {
    staticClass: "pri-right-info",
    class: _vm.domclass
  }, [_vm.data.pagePrice && _vm.domclass === "" ? _c("div", {
    staticClass: "tip-item tip-pagepri tip-pagepri2"
  }, [_c("em"), _vm._v(" "), !_vm.aliSite ? [_c("span", {
    staticClass: "tip-item-sp1",
    staticStyle: {
      width: "120px"
    }
  }, [_vm._v("到手价(单件) / 页面价")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")])] : _vm._e(), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v(_vm._s(_vm.data.pagePrice))])], 2) : _vm.data.pagePrice ? _c("div", {
    staticClass: "tip-item tip-pagepri"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp1"
  }, [_vm._v("页面价")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v(_vm._s(_vm.data.pagePrice))])]) : _vm._e(), _vm._v(" "), _vm.data.directpro ? _c("div", {
    staticClass: "tip-item tip-directpro"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp1"
  }, [_vm._v("到手价(单件)")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v("¥" + _vm._s(_vm.data.directpro))]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp4",
    domProps: {
      innerHTML: _vm._s(_vm.data.promo2)
    }
  })]) : _vm._e(), _vm._v(" "), _vm.data.addpro ? _c("div", {
    staticClass: "tip-item tip-addpro"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp1"
  }, [_vm._v("到手价(多件)")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v("¥" + _vm._s(_vm.data.addpro))]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp4",
    domProps: {
      innerHTML: _vm._s(_vm.data.promo1)
    }
  })]) : _vm._e()])]) : _vm._e();
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 30888:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(3362);
const communicate = __webpack_require__(79560);
const deviceEncode = __webpack_require__(69793);
module.exports.retry = (wait, cb, times, time) => {
  //@param function wait 等待的条件
  //@param function cb 条件满足后做的操作
  //@param number times  尝试的次数
  //@param number time  每次等待的时间
  var _times = 0;
  function _try() {
    if (_times >= times) return;
    if (wait()) cb();else {
      _times++;
      setTimeout(_try, time);
    }
  }
  _try();
};
module.exports.settings = (op, key, value) => {
  let request = __webpack_require__(49388);
  request.get(G.server + '/brwext/permanent_id?' + `version=2&op=${op}&${key}=${value}`).done(msg => {
    G[key] = value;
  });
};
module.exports.setLocal = (key, value) => {
  communicate.trigger({
    'type': 'setStorage',
    'key': key,
    'value': value
  });
};
module.exports.openTab = () => {
  if (!G.allowBackgroundRequest) {
    window.open(G.server + '/brwext/setting?from=' + deviceEncode(G.from_device) + '&btype=' + (G.btype ? G.btype : ''));
  }
  communicate.trigger({
    'type': 'opentab'
  });
};
// module.exports.addFavorCheck = () => {
//   communicate.trigger({
//     'type': 'addFavorCheck'
//   })
// }

module.exports.getTimeNumber = (time, type) => {
  // 1: xxxx-xx-xx 2.xx-xx 3.xx.xx 4. xxxx.xx.xx
  let dateObj = new Date(time);
  let y = dateObj.getFullYear();
  let m = dateObj.getMonth() + 1;
  let d = dateObj.getDate();
  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  let str = ``;
  switch (type) {
    case "1":
      str = `${y}-${m}-${d}`;
      break;
    case "2":
      str = `${m}-${d}`;
      break;
    case "3":
      str = `${m}.${d}`;
      break;
    case "4":
      str = `${y}.${m}.${d}`;
      break;
    case "5":
      str = `${y}/${m}/${d}`;
      break;
    default:
      str = `(${y}.${m}.${d})`;
  }
  return str;
};

/**
 * 数组去重
 * @param array
 */
module.exports.arrayUnique = array => {
  let newArray = [];
  array.forEach(item => {
    if (newArray.indexOf(item) === -1) {
      newArray.push(item);
    }
  });
  return newArray;
};
module.exports.setSimplePagePos = (dom, detail, detailW) => {
  let mainW = $(window).width();
  let left = dom.offset().left;
  let domw = dom.outerWidth();
  let dleft = left + domw - detailW - 2;
  if (dleft < 0) dleft = 0;
  if (dleft + detailW > mainW) dleft = mainW - detailW - 2;
  detail.css('left', dleft + 'px');
};
module.exports.deepCopy = obj => {
  return $.extend(true, {}, obj);
};
module.exports.stringToNumber = text => {
  if (!text) {
    return 0;
  }
  let x = parseInt(text);
  if (text.includes('万')) {
    x = x * 10000;
  }
  return x;
};
module.exports.numberToString = (number, digit = 2) => {
  if (typeof number === 'string' && number.includes('万')) {
    return number;
  }
  let x = parseInt(number);
  if (x > 10000) {
    x = x / 10000;
    x = x.toFixed(digit).replace('.' + '0'.repeat(digit), '') + '万';
  }
  return x;
};
module.exports.waitForConditionFn = (conditionFn, checkInterval = 300, maxTryTimes = 0) => {
  return new Promise(resolve => {
    if (conditionFn()) {
      resolve(true);
      return;
    }
    let tryTimes = 0;
    let t = setInterval(() => {
      if (conditionFn()) {
        resolve(true);
        clearInterval(t);
      }
      tryTimes++;
      if (maxTryTimes && tryTimes > maxTryTimes) {
        clearInterval(t);
      }
    }, checkInterval);
  });
};

/***/ }),

/***/ 31378:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {
  components: {},
  data() {
    return {
      text: '',
      max: !G.shaidanAvailable
    };
  },
  mounted() {
    (__webpack_require__(41761).met)('priceTipText').then(text => {
      this.text = text;
    });
  }
};

/***/ }),

/***/ 31900:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.show,
      expression: "show"
    }],
    ref: "overlay",
    staticClass: "gwd-overlay",
    class: {
      "gwd-overlay-bottom": _vm.style === "bottom",
      "gwd-1688": _vm.is1688,
      "gwd-bjg": _vm.isBjg,
      "gwd-xhs": _vm.xhs
    },
    on: {
      click: _vm.overlayClick
    }
  }, [_c("div", {
    staticClass: "gwd-app-window gwd-row",
    class: {
      "gwd-expanded": _vm.expanded,
      "gwd-1688": _vm.is1688
    }
  }, [_c("a", {
    staticClass: "gwd-window-close",
    attrs: {
      href: "#"
    },
    on: {
      click: function ($event) {
        $event.preventDefault();
        return _vm.close();
      }
    }
  }, [_c("img", {
    attrs: {
      src: __webpack_require__(94985),
      alt: ""
    }
  })]), _vm._v(" "), _c("a", {
    staticClass: "gwd-window-expand gwd-row gwd-align gwd-jcc",
    attrs: {
      href: "#"
    },
    on: {
      click: function ($event) {
        $event.preventDefault();
        _vm.expanded = !_vm.expanded;
      }
    }
  }, [_c("img", {
    attrs: {
      src: __webpack_require__(77734),
      alt: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "gwd-window-left gwd-column gwd-align",
    staticStyle: {
      "overflow-y": "auto"
    }
  }, [_c("img", {
    staticClass: "gwd-same-logo",
    staticStyle: {
      width: "89px",
      height: "18px",
      "margin-top": "16px"
    },
    attrs: {
      src: _vm.logo,
      alt: ""
    }
  }), _vm._v(" "), _c("img", {
    staticStyle: {
      "max-width": "180px",
      height: "180px",
      "border-radius": "8px",
      "margin-top": "16px"
    },
    attrs: {
      src: _vm.img,
      alt: "",
      "object-fit": "cover"
    }
  }), _vm._v(" "), _vm.price ? _c("Price", {
    staticStyle: {
      "margin-top": "8px"
    },
    attrs: {
      price: _vm.price,
      unit: _vm.unit
    }
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "gwd-column gwd-align",
    staticStyle: {
      "margin-top": "29px"
    }
  }, _vm._l(_vm.sites, function (item) {
    return _c("a", {
      key: item,
      staticClass: "gwd-site-select",
      class: {
        "gwd-active": _vm.currentViewing === item
      },
      attrs: {
        href: "#"
      },
      on: {
        click: function ($event) {
          $event.preventDefault();
          _vm.currentViewing = item;
        }
      }
    }, [_vm._v(_vm._s(_vm.getSiteName(item)))]);
  }), 0), _vm._v(" "), _c("hr", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentSiteResult && _vm.currentSiteResult.list.length,
      expression: "currentSiteResult && currentSiteResult.list.length"
    }],
    staticStyle: {
      "margin-top": "40px"
    }
  }), _vm._v(" "), _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.currentSiteResult && _vm.currentSiteResult.list.length,
      expression: "currentSiteResult && currentSiteResult.list.length"
    }],
    staticClass: "gwd-sort gwd-column",
    staticStyle: {
      "margin-top": "56px",
      "padding-left": "32px"
    }
  }, [_c("span", {
    staticStyle: {
      "margin-left": "8px"
    }
  }, [_vm._v(_vm._s(_vm.transText("排序")))]), _vm._v(" "), _vm._l(_vm.sortOptions, function (item) {
    return _c("a", {
      key: item,
      staticClass: "gwd-sort-item",
      class: {
        "gwd-active": _vm.currentSort === item
      },
      attrs: {
        href: "#"
      },
      on: {
        click: function ($event) {
          $event.preventDefault();
          _vm.currentSort = item;
        }
      }
    }, [_vm._v(_vm._s(_vm.getSortName(item)))]);
  })], 2), _vm._v(" "), _vm.isBjg ? _c("div", {
    staticClass: "gwd-bjg-app gwd-column gwd-align"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("div", {
    staticStyle: {
      "margin-top": "4px",
      "line-height": "14px",
      color: "#5d3b01",
      "font-size": "12px"
    }
  }, [_vm._v("手机上也能自动找同款！")])]) : _vm._e()], 1), _vm._v(" "), _c("div", {
    staticClass: "gwd-window-right",
    staticStyle: {
      flex: "1"
    }
  }, [_vm.currentSiteResult.status === _vm.SiteStatus.loading ? _c("div", {
    staticStyle: {
      "font-size": "20px",
      "text-align": "center",
      flex: "1",
      "padding-top": "300px",
      color: "#a1a1a1"
    }
  }, [_vm._v("Loading...")]) : _vm._e(), _vm._v(" "), [_vm.SiteStatus.error, _vm.SiteStatus.needLogin, _vm.SiteStatus.needVisit].includes(_vm.currentSiteResult.status) ? _c("Error", {
    attrs: {
      site: _vm.currentViewing,
      permissionTextOnly: _vm.permissionTextOnly,
      hasPermission: _vm.hasPermission,
      siteMap: _vm.siteMap,
      error: _vm.currentSiteResult.status,
      errorDetail: _vm.currentSiteResult.statusDetail
    },
    on: {
      retry: function ($event) {
        return _vm.doSearch(_vm.currentViewing);
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.currentSiteResult.list.length ? _c("div", {
    ref: "list",
    staticClass: "gwd-list gwd-scrollbar",
    style: `overflow-y: ${_vm.firefox ? "scroll" : "overlay"};`
  }, _vm._l(_vm.sortedList, function (item) {
    return _c("ProductItem", {
      key: item.dpId,
      attrs: {
        item: item
      }
    });
  }), 1) : _vm._e()], 1)])]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-qr-container gwd-column gwd-align"
  }, [_c("img", {
    staticStyle: {
      width: "59px",
      height: "59px"
    },
    attrs: {
      src: "https://cdn.bijiago.com/images/extensions/bijiago/qrcode-app.png",
      alt: ""
    }
  }), _vm._v(" "), _c("img", {
    staticStyle: {
      width: "12px",
      height: "12px",
      "margin-top": "-34px"
    },
    attrs: {
      src: "https://cdn.bijiago.com/images/extensions/bijiago/bjgRoundLogo@2x.png",
      alt: ""
    }
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "5px"
    }
  }, [_c("img", {
    staticStyle: {
      width: "22px",
      height: "19px"
    },
    attrs: {
      src: "https://cdn.bijiago.com/images/extensions/bijiago/color-logo-22x19@2x.png",
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "margin-left": "2px",
      "font-size": "15px",
      color: "#5d3b01",
      "font-weight": "bold"
    }
  }, [_vm._v("比价狗APP")])]);
}];
render._withStripped = true;

/***/ }),

/***/ 32546:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6695);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("12797050", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 33376:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-qr-container[data-v-295049ea] {\n  display: none;\n  position: absolute;\n  right: 0px;\n  width: 153px;\n  height: 156px;\n  background: #FFF6F4;\n  border: 1px solid #FF6132;\n  flex-direction: column;\n  z-index: 9;\n  bottom: 28px;\n  align-items: center;\n}\n.mainbar-fold .gwd-member-coupon-top[data-v-295049ea] {\n  display: none;\n}\n.gwd-member-coupon-top[data-v-295049ea] {\n  height: 28px;\n  background: linear-gradient(to right, #f28936, #ff351e);\n  position: relative;\n  background-size: cover;\n  display: inline-flex;\n  align-items: center;\n  margin-top: 2px;\n  cursor: pointer;\n  border-radius: 2px;\n  margin-right: 5px;\n}\n.gwd-member-coupon-top .gwd-qr-container[data-v-295049ea] {\n  display: none;\n  position: absolute;\n}\n.gwd-member-coupon-top[data-v-295049ea]::before,\n.gwd-member-coupon-top[data-v-295049ea]::after {\n  content: '';\n  position: absolute;\n  left: 115px;\n  width: 4px;\n  height: 4px;\n  background: white;\n  border-radius: 2px;\n  top: -2px;\n}\n.gwd-member-coupon-top[data-v-295049ea]::after {\n  top: unset;\n  bottom: -2px;\n}\n.gwd-member-coupon-top[data-v-295049ea]:hover {\n  text-decoration: none;\n}\n.gwd-member-coupon-top:hover .gwd-qr-container[data-v-295049ea] {\n  display: flex;\n}\n", ""]);

// exports


/***/ }),

/***/ 33835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['img', 'x', 'y', 'tipmode'],
  data() {
    return {
      imgWidth: 0,
      imgHeight: 0,
      over: false,
      maxWidth: 600
    };
  },
  methods: {
    onMouseOver() {
      this.over = true;
    },
    onMouseLeave() {
      this.over = false;
    }
  },
  computed: {
    style() {
      const imgWidth = this.imgWidth > this.maxWidth ? this.maxWidth : this.imgWidth;
      const imgHeight = this.imgHeight * imgWidth / this.imgWidth;
      const left = this.mode === 'landscape' ? this.x - imgWidth / 2 - 8 + 29 : this.x - imgWidth - 26 - 8;
      const top = this.mode === 'landscape' ? this.y - imgHeight - 26 - 6 : this.y - imgHeight / 2 - 8 + 7;
      return {
        left: left + 'px',
        top: top + 'px',
        'pointer-events': this.tipmode === 'tooltip' ? 'none' : ''
        // visibility: this.tipmode === 'tooltip' ? 'visible' : 'hidden',
      };
    },
    mode() {
      return this.imgWidth > this.imgHeight ? 'landscape' : 'portrait';
    }
  },
  mounted() {}
};

/***/ }),

/***/ 34192:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".bjg-coupon-white[data-v-4df286a2] {\n  color: #ffffff;\n}\n.bjgou-subsidy-bar[data-v-4df286a2] {\n  cursor: pointer;\n  margin-top: 5px;\n  width: 442px;\n  height: 67px;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  background: url(https://cdn.bijiago.com/images/extensions/bijiago/bigCoupon@2x.png);\n  box-sizing: border-box !important;\n  background-size: contain;\n}\n.bjgou-subsidy-bar .qrcode[data-v-4df286a2] {\n  display: none;\n  position: absolute;\n  top: 70px;\n  right: -15px;\n  width: 148px;\n  height: 156px;\n  background: #FFF6F4;\n  border: 1px solid #FF6132;\n  z-index: 9;\n}\n.bjgou-subsidy-bar .bjg-bold[data-v-4df286a2] {\n  font-size: 13px;\n  font-weight: bold;\n  color: #ff2d53;\n}\n.bjgou-subsidy-bar .bjg-take[data-v-4df286a2] {\n  min-width: 87px;\n  height: 22px;\n  border-radius: 11px;\n  border: 1px solid #FF2D53;\n  position: relative;\n  display: flex;\n  cursor: pointer;\n}\n.bjgou-subsidy-bar .bjg-take span[data-v-4df286a2] {\n  font-size: 12px;\n  text-align: center;\n  line-height: 22px;\n}\n.bjgou-subsidy-bar .bjg-take .taker[data-v-4df286a2] {\n  color: white;\n  width: 36px;\n  height: 24px;\n  line-height: 24px;\n  background: linear-gradient(90deg, #FF3A62 0%, #FF665B 100%);\n  border-radius: 11px;\n  display: inline-block;\n}\n.bjgou-subsidy-bar[data-v-4df286a2]:hover {\n  text-decoration: none;\n}\n.bjgou-subsidy-bar:hover .qrcode[data-v-4df286a2] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n", ""]);

// exports


/***/ }),

/***/ 34246:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _vuex = __webpack_require__(95353);
let currencyConfig = (__webpack_require__(22209).getMoneyInfo)(G.logsite);
var _default = exports["default"] = {
  props: ['haitao'],
  computed: (0, _vuex.mapState)({
    priceRemind: state => state.priceRemind,
    user: state => state.user,
    trend: state => state.priceTrend
  }),
  data() {
    return {
      allPrice: '',
      currentPrice: '',
      notifySite: '',
      mode: 0,
      currency: currencyConfig ? currencyConfig[0] : '¥',
      settedNotifySite: null,
      errorText: '',
      errorFadeClass: false,
      hintText: '',
      hintFadeClass: false,
      allowAnimation: true,
      loaded: false,
      mPromo: true
    };
  },
  methods: {
    performUpdate() {
      this.allPrice = this.$store.state.priceRemind.allPrice;
      this.currentPrice = this.$store.state.priceRemind.currentPrice;
      this.notifySite = this.$store.state.priceRemind.notifySite;
      this.mode = this.$store.state.priceRemind.mode;
      this.mPromo = this.$store.state.priceRemind.notifierMPromo;
      this.settedNotifySite = this.$store.state.priceRemind.settedNotifySite;
      this.allowAnimation = false;
      setTimeout(() => {
        if (this.$store.state.priceRemind.hovered || !this.$store.state.priceRemind.collected) {
          this.allowAnimation = true;
        }
      }, 1000);
    },
    showError(text) {
      this.errorFadeClass = false;
      this.errorText = text;
      setTimeout(() => {
        this.errorFadeClass = true;
      }, 200);
    },
    showHint(text) {
      this.hintFadeClass = false;
      this.hintText = text;
      setTimeout(() => {
        this.hintFadeClass = true;
      }, 200);
    },
    cancel() {
      this.$store.dispatch('priceRemind/cancel');
    },
    submit() {
      let price;
      if (this.notifySite === 0) {
        price = this.allPrice;
      } else if (this.notifySite === 1) {
        price = this.currentPrice;
      }
      if (price === '') {
        this.showError('请输入商品期望价格');
        return;
      }
      if (price <= 0) {
        this.showError('请输入正确格式的价格');
        return;
      }
      if (price.toString().indexOf('.') > -1) {
        let after = price.toString().split('.')[1];
        if (after && after.length > 2) {
          this.showError('请输入正确格式的价格');
          return;
        }
      }
      if (this.$store.state.priceRemind.nowPrice && price > this.$store.state.priceRemind.nowPrice) {
        this.showError('价格不能高于当前商品价格');
        return;
      }
      this.$store.dispatch('priceRemind/submit', {
        notifySite: this.notifySite,
        price: price,
        mode: this.mode,
        notifyMPromo: this.mPromo
      }).then(r => {
        this.showHint(r);
        (__webpack_require__(7129).log)('resolve ', r);
      }).catch(r => {
        this.showError('提交失败,' + r);
        (__webpack_require__(7129).log)('reject ', r);
      });
    }
  },
  mounted() {
    (__webpack_require__(7129).log)('store', this.$store);
    this.$nextTick(() => {
      this.performUpdate();
    });
    this.$store.subscribe(mutation => {
      if (mutation.type === 'priceRemind/updateRemindSettings') {
        this.$nextTick(() => {
          this.performUpdate();
        });
      }
    });
  }
};

/***/ }),

/***/ 35161:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(3362);
const template = __webpack_require__(26133);
const calWidth = __webpack_require__(42869);
// const replaceHref = require('common/replaceHref')
const cnzz = __webpack_require__(5300);
const log = __webpack_require__(35743);
let pInfo = {},
  proInfo = {};
let widthInfo, allink_tb, allink_tm;
let skipEventAdd = false;
const addEvent = () => {
  $('.compare-list').off();
  $('.main-compare .tright, .main-compare .tleft').off();
  $('.compare-box').off();
  $('.main-compare .tright').on('click', function () {
    if (pInfo.nowpage + 1 === pInfo.pages) {
      return;
    }
    pInfo.nowpage++;
    $('.compare-list>li').hide();
    for (let i = pInfo.pageNum * pInfo.nowpage; i < pInfo.pageNum * (pInfo.nowpage + 1); i++) {
      $('.compare-list>li').eq(i).show();
    }
  });
  $('.main-compare .tleft').on('click', function () {
    if (pInfo.nowpage === 0) {
      return;
    }
    pInfo.nowpage--;
    $('.compare-list>li').hide();
    for (let i = pInfo.pageNum * pInfo.nowpage; i < pInfo.pageNum * (pInfo.nowpage + 1); i++) {
      $('.compare-list>li').eq(i).show();
    }
  });
  $('.compare-list').on('mouseenter', 'li', function (e) {
    $('.compare-list>li').removeClass('bar-item-hover');
    let id = $(this).attr('data-id');
    if ($(this).find('.btcom-detail').length > 0) {
      $(this).find('.btcom-detail').show();
    } else {
      if (id) {
        renderDetail(id, $(this));
      }
    }
    $(this).addClass('bar-item-hover');
  });
  if (G.site === 'suning') {
    $('.compare-list').on('click', 'a', function (e) {
      if ($(this).attr('href')) {
        window.open($(this).attr('href'));
        e.preventDefault();
      }
    });
  }
  $('.compare-list').on('mouseleave', 'li', function (e) {
    let that = this;
    $(that).removeClass('bar-item-hover');
    $(that).find('.btcom-detail').hide();
  });
  $('.compare-box').on('click', function (e) {
    if (skipEventAdd) {
      return;
    }
    if ($(e.target).hasClass('turnleft')) {
      runTurnPage($(e.target), -1);
    } else if ($(e.target).hasClass('turnright')) {
      runTurnPage($(e.target), 1);
    } else {
      let url = '';
      if (e.target.nodeName === 'A') {
        url = e.target.href;
      } else if (e.target.parentNode.nodeName === 'A') {
        url = e.target.parentNode.href;
      } else if (e.target.parentNode.parentNode.nodeName === 'A') {
        url = e.target.parentNode.parentNode.href;
      }
      if (url.indexOf('uland.taobao.com/coupon') > -1) {
        cnzz.log('click:dpcoupon');
        log('click:dpcoupon');
      }
    }
  });
};
const runTurnPage = (dom, type) => {
  let parentDom = $(dom).parent().parent();
  let lists = parentDom.find('.all-products .btcom-list li');
  let size = lists.length;
  let curpg = Number(parentDom.find('.bjd-pages .current-page').text());
  let totalp = Number(parentDom.find('.bjd-pages .page-num').text());
  parentDom.find('.all-products .btcom-list li').hide();
  if (type === 1) curpg++;else if (type === -1) curpg--;
  if (curpg === 0) curpg = totalp;
  if (curpg === totalp + 1) curpg = 1;
  let end = curpg * widthInfo.showListNum > size ? size : curpg * widthInfo.showListNum;
  for (let i = (curpg - 1) * widthInfo.showListNum; i < end; i++) {
    lists.eq(i).show();
    let img = lists.eq(i).find('.com-item-img img');
    replaceSrc(img);
  }
  parentDom.find('.bjd-pages .current-page').text(curpg);
};
const replaceSrc = img => {
  let src = img.attr('data-src');
  if (!src) return;
  let imgObj = new Image();
  imgObj.onload = function () {
    if (imgObj.complete == true) {
      $(img).attr('src', src).attr('data-src', null);
    }
  };
  imgObj.onerror = function (e) {
    let obj = $(img)[0];
    if (!$(img)[0]) return;
    obj.src = `${G.s_server}/images/extensions/newbar/no_img.png`;
    obj.setAttribute("data-src", `${G.s_server}/images/extensions/newbar/no_img.png`);
  };
  imgObj.src = src;
};
const editData = (data, tb, tbsite) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].price) {
      data[i].price = Number(data[i].price.toString().replace(',', '')).toFixed(2);
    }
    if (!data[i].img_url) data[i].img_url = data[i].pic_url;
    if (tbsite) {
      data[i].nick2 = data[i].item_location;
    }
    if (!data[i].site_name) data[i].site_name = data[i].nick2 || data[i].nick;
    if (tb && data[i].img_url.match(/_\d+x\d+/)) {
      let match = data[i].img_url.match(/_(\d+)x\d+/);
      if (match) {
        match = Number(match[1]);
        if (match > 200) {
          data[i].img_url = data[i].img_url + '_100x100';
        }
      }
    } else if (tb) {
      data[i].img_url = data[i].img_url + '_100x100';
    }
  }
  return data;
};
const renderDetail = async (id, container) => {
  let len = proInfo[id].length;
  let showpages;
  let detailW;
  if (len > widthInfo.showListNum) {
    showpages = true;
    detailW = $(window).width();
  } else {
    detailW = len * 268;
  }
  let sale_tle, allink;
  if (id === 'tmcompare' || id === 'tbcompare') {
    sale_tle = "最近销量";
    if (proInfo[id].from_self === true) sale_tle = "总销量";
  }
  if (id === 'tmcompare') allink = allink_tm;else if (id === 'tbcompare') allink = allink_tb;
  let pages = Math.ceil(len / widthInfo.showListNum);
  console.log('coupon ready got', proInfo);
  if (id === 'tmcompare' || id === 'tbcompare') {
    // await Promise.race([require('common/globalCondition').met('bottomCouponReady-' + id), require('common/commonUtil').sleep(600)])
  }
  console.log('done', proInfo);
  let html = __webpack_require__(52361);
  let dom = template.compile(html)({
    data: proInfo[id],
    sale_tle: sale_tle,
    showpages: showpages,
    prowidth: widthInfo.allProductW,
    turnpW: widthInfo.turnpW,
    detailW: detailW,
    link: allink,
    id: id,
    pages: pages
  });
  $(container).append(dom);
  for (let i = 0; i < Math.min(widthInfo.showListNum, len); i++) {
    let img = $(container).find('.btcom-detail li .com-item-img img').eq(i);
    replaceSrc(img);
  }
  if (!showpages) {
    setSimplePagePos(len, container);
  }
};
const renderCompareBar = data => {
  if (G.site.indexOf('taobao') > -1 || G.site.indexOf('tmall') > -1) {
    return;
  }
  if (!data.store || !data.store[0] || data.store[0].product.length === 0) return;
  let turnpage = (13 + 18 + 20) * 2;
  let comArr = [];
  let totalSize = data.store.length;
  let freeW = calWidth.calBottomBar();
  pInfo.pageNum = parseInt((freeW - turnpage) / 104);
  pInfo.mbarItemShowNum = totalSize > pInfo.pageNum ? pInfo.pageNum : totalSize;
  if (pInfo.pageNum <= 0) pInfo.pageNum = 1;
  for (let i = 0; i < data.store.length; i++) {
    comArr.push(data.store[i].product[0]);
    proInfo[data.store[i].product[0].dp_id] = editData(data.store[i].product);
  }
  let lens = $('.compare-list li').length;
  pInfo.pages = Math.ceil((totalSize + lens) / pInfo.pageNum);
  let html = __webpack_require__(63860);
  let views = template.compile(html)({
    data: comArr,
    pageNum: pInfo.pageNum
  });
  $('.compare-list').prepend(views);
  pInfo.nowpage = 0;
  pInfo.totalSize = totalSize;
  $('.compare-box').css('width', pInfo.mbarItemShowNum * 102 + 'px');
  if (pInfo.pages === 1) {
    $('.mbar-turnpage').hide();
  } else {
    $('.mbar-turnpage').show();
  }
  addEvent();
};
const setSimplePagePos = (size, dom) => {
  let mainW = $(window).width();
  let left = dom.offset().left;
  let domw = dom.outerWidth();
  let detail = dom.find('.btcom-detail');
  let width = 268 * size + 2;
  let dleft = left + domw / 2 - width / 2;
  if (dleft < 0) dleft = 0;
  if (dleft + width > mainW) dleft = mainW - width - 2;
  detail.css('left', dleft + 'px');
};
const exchangeData = data => {
  if (!data.product || data.product && data.product.length === 0) return data;
  let b2c = [],
    obj = {};
  for (let i = 0; i < data.product.length; i++) {
    if (!data.product[i].site_name2) {
      data.product[i].site_name2 = data.product[i].site_name;
    }
    if (!obj[data.product[i].site_name2]) {
      obj[data.product[i].site_name2] = {
        product: [data.product[i]]
      };
    } else {
      obj[data.product[i].site_name2]['product'].push(data.product[i]);
    }
  }
  for (let pattern in obj) {
    if (pattern) {
      b2c.push(obj[pattern]);
    }
  }
  return {
    store: b2c
  };
};
const renderTbCompare = data => {
  let html = __webpack_require__(63860);
  let insNum = 0;
  if (data.tmall && data.tmall.product) {
    let obj = {
      dp_id: 'tmcompare',
      site_name: '天猫商城',
      price: data.tmall.min_price
    };
    // if (!G.aliSite && G.from_device !== '360')
    //   replaceHref.init('tmall', data.tmall.product, '&column=b2c')
    proInfo['tmcompare'] = editData(data.tmall.product, true);
    let dom = $('.compare-list>li').eq(5);
    if (dom.length === 0) dom = $('.compare-list>li:last-child');
    if (dom.length === 0) {
      $('.compare-list').append(template.compile(html)({
        data: [obj]
      }));
    } else {
      dom.after(template.compile(html)({
        data: [obj]
      }));
    }
    insNum++;
  }
  if (data.taobao && data.taobao.product) {
    let obj = {
      dp_id: 'tbcompare',
      site_name: '淘宝',
      price: data.taobao.min_price
    };
    // if (!G.aliSite && G.from_device !== '360')
    //   replaceHref.init('taobao', data.taobao.product, '&column=b2c')
    proInfo['tbcompare'] = editData(data.taobao.product, true, true);
    $('.compare-list').append(template.compile(html)({
      data: [obj]
    }));
    insNum++;
  }
  pInfo.totalSize = pInfo.totalSize + insNum;
  let pages = Math.ceil(pInfo.totalSize / pInfo.pageNum);
  if (pInfo.pages === 1 || !pInfo.pages) {
    if (pages > 1) {
      $('.mbar-turnpage.tright').show();
      pInfo.pages = pages;
    }
    pInfo.mbarItemShowNum = pInfo.totalSize > pInfo.pageNum ? pInfo.pageNum : pInfo.totalSize;
    $('.compare-box').css('width', pInfo.mbarItemShowNum * 102 + 'px');
    $('.mbar-turnpage').hide();
  } else {
    pInfo.pages = pages;
  }
  addEvent();
};
module.exports.renderBt = (data, skipEvent = false) => {
  if (!(data.taobao instanceof Array) && data.taobao.more_link) allink_tb = data.taobao.more_link;
  if (!(data.tmall instanceof Array) && data.tmall.more_link) allink_tm = data.tmall.more_link;
  if (!widthInfo) widthInfo = calWidth.init();
  if (skipEvent) {
    skipEventAdd = true;
  }
  renderTbCompare(data);
  if (G.from_device !== '360') {
    (__webpack_require__(49042).init)(data.tmall.product, 'tmall', true, data.tmall.min_price);
    (__webpack_require__(49042).init)(data.taobao.product, 'taobao', true, data.taobao.min_price);
  }
};
module.exports.init = data => {
  if (data.b2c && data.b2c.store) {
    renderCompareBar(data.b2c);
  } else if (data.b2c_fuzzy) {
    data.b2c2 = exchangeData(data.b2c_fuzzy);
    renderCompareBar(data.b2c2);
  }
  widthInfo = calWidth.init();
};

/***/ }),

/***/ 35203:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54208);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("d40ad512", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 35372:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ LongCoupon)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/LongCoupon.vue?vue&type=template&id=6f5d34be&scoped=true
var LongCouponvue_type_template_id_6f5d34be_scoped_true = __webpack_require__(14122);
;// ./src/standard/module/components/LongCoupon.vue?vue&type=template&id=6f5d34be&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/LongCoupon.vue?vue&type=script&lang=js
var LongCouponvue_type_script_lang_js = __webpack_require__(56857);
;// ./src/standard/module/components/LongCoupon.vue?vue&type=script&lang=js
 /* harmony default export */ const components_LongCouponvue_type_script_lang_js = (LongCouponvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/LongCoupon.vue?vue&type=style&index=0&id=6f5d34be&prod&scoped=true&lang=less
var LongCouponvue_type_style_index_0_id_6f5d34be_prod_scoped_true_lang_less = __webpack_require__(58998);
;// ./src/standard/module/components/LongCoupon.vue?vue&type=style&index=0&id=6f5d34be&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/LongCoupon.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_LongCouponvue_type_script_lang_js,
  LongCouponvue_type_template_id_6f5d34be_scoped_true/* render */.XX,
  LongCouponvue_type_template_id_6f5d34be_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "6f5d34be",
  null
  
)

/* harmony default export */ const LongCoupon = (component.exports);

/***/ }),

/***/ 35418:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


const template = __webpack_require__(26133);
const request = __webpack_require__(49388);
const userData = __webpack_require__(74222);
const renderBtn = () => {
  let t = `<div id="review_btn" class="gwdang-tab">
    <span class="btn-tab-sp">
      <em class="gwd_bg"></em>
      <span class="tab-sp1 blkcolor1">口碑</span>
    </span>
  </div>`;
  $(`.gwd-topbar-left`).append(t);
  $('#review_btn').css('display', 'block');
};
const addEvent = () => {
  let choosed, time;
  $('#review_btn').on('mouseenter', function () {
    if (!choosed) {
      let cls = $('.review-good').attr('data-d');
      $('.' + cls).show();
    }
    let left = $(this).offset().left;
    $('#review_detail').css('left', left + 'px');
    $('#review_detail').show();
    $(this).addClass('msenter');
    if ($(window).width() - ($(`#review_detail`).offset().left + $(`#review_detail`).outerWidth() + 2) < 0) {
      $(`#review_detail`).css(`right`, '0px').css('left', 'auto');
    }
  });
  $('#review_btn').on('mouseleave', function () {
    let that = this;
    time = setTimeout(function () {
      $('#review_detail').hide();
      $(that).removeClass('msenter');
    }, 200);
  });
  $('#review_detail').on('mouseenter', function () {
    clearTimeout(time);
  });
  $('#review_detail').on('mouseleave', function () {
    $('#review_detail').hide();
    $('#review_btn').removeClass('msenter');
  });
  $('#review_detail .review-tab').on('click', function () {
    choosed = true;
    let cls = $(this).attr('data-d');
    $('#review_detail .review-tab').removeClass('selected');
    $(this).addClass('selected');
    $('.review-right>div').hide();
    $('.' + cls).show();
  });
};
const addUrls = data => {
  let other_info = userData.get('other_info');
  let dpid = other_info && other_info.now.dp_id;
  if (!dpid) return data;
  if (data.bad && data.bad.length > 0) {
    for (let i = 0; i < data.bad.length; i++) {
      let href = `${G.c_server}/crc64/dp${dpid}/reviews/?rword=${encodeURIComponent(data.bad[i].label)}&ext=1&rtype=2`;
      data.bad[i].url = href;
    }
  }
  if (data.good && data.good.length > 0) {
    for (let i = 0; i < data.good.length; i++) {
      let href = `${G.c_server}/crc64/dp${dpid}/reviews/?rword=${encodeURIComponent(data.good[i].label)}&ext=1&rtype=1`;
      data.good[i].url = href;
    }
  }
  return data;
};
const getInfo = callback => {
  let href = encodeURIComponent(location.href);
  let url = `${G.server}/extension/review?url=${href}`;
  request.get(url).done(function (data) {
    if (data && !(data instanceof Array)) {
      callback(data);
      // if (callback2)
      //   callback2(data)
      // else
      //   globalData = data;
    }
  });
};
const renderReview = data => {
  data.goodbox = 'review-r-good';
  data.badbox = 'review-r-bad';
  if (!data.good) data.goodbox = 'review-r-noinfo';
  if (!data.bad) data.badbox = 'review-r-noinfo';
  let html = __webpack_require__(87772);
  data = addUrls(data);
  let dom = template.compile(html)({
    data: data,
    s_server: G.s_server
  });
  $(`.gwd-topbar-left`).append(dom);
  addEvent();
};

// module.exports.getReviewTrend = (callback) => {
//   if (globalData) callback(globalData)
//   else callback2 = callback
// }

module.exports.init = data => {
  getInfo(function (data) {
    if (data.reviews.length === 0) {
      (__webpack_require__(41761).setMet)('no_reviews');
      return;
    }
    renderBtn();
    renderReview(data.reviews);
  });
};

/***/ }),

/***/ 35999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $imports = __webpack_require__(53095);
module.exports = function ($data) {
    'use strict';
    $data = $data || {};
    var $$out = '', $escape = $imports.$escape, extClass = $data.extClass, img = $data.img, qr = $data.qr;
    $$out += '<div style="display: inline-flex; position: relative; vertical-align: middle; margin-left: 5px; width: auto" class="gwd-bottom-tmall ';
    $$out += $escape(extClass);
    $$out += '">\n  <img src="';
    $$out += $escape(img);
    $$out += '" alt="" style="height: 44px">\n  <div class="gwd-qr-act-bottom" style="margin-left: -74px;">\n    <img class="gwd-act-qr-img" loading="lazy" src="';
    $$out += $escape(qr);
    $$out += '" alt="" style="width: 130px; height: 130px; margin-top: 7px">\n    <span style="margin-top: 5px; vertical-align: middle; font-size: 0; height: 14px; line-height: 14px;">\n      <span style="font-size: 14px; color: #ff1a78; font-weight: bold">微信扫码</span>\n      <span style="margin-left: 3px; color: #070707; font-size: 12px; transform-origin: center center; transform: scale(0.9166)">领红包</span>\n    </span>\n  </div>\n</div>\n<style>\n  .gwd-bottom-tmall {\n    height: 100%;\n    align-items: center;\n  }\n\n  .gwd-qr-act-bottom {\n    display: none;\n    flex-direction: column;\n    position: absolute;\n    width: 144px;\n    height: 167px;\n    box-sizing: border-box;\n    border: 1px solid #ff471a;\n    background: #fff9f6;\n    bottom: 62px;\n    left: 50%;\n    align-items: center;\n    margin-left: -72px;\n  }\n\n  .gwd-qr-act-bottom span {\n    width: initial;\n    margin: 0;\n  }\n\n  .gwd-bottom-tmall:hover .gwd-qr-act-bottom {\n    display: flex;\n  }\n</style>';
    return $$out;
};

/***/ }),

/***/ 36408:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ Stampvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ Stamp)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Widgets/Stamp.vue?vue&type=template&id=2701b8ba&scoped=true
var Stampvue_type_template_id_2701b8ba_scoped_true = __webpack_require__(47053);
;// ./src/standard/module/components/Widgets/Stamp.vue?vue&type=template&id=2701b8ba&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Widgets/Stamp.vue?vue&type=script&lang=js
var Stampvue_type_script_lang_js = __webpack_require__(39302);
;// ./src/standard/module/components/Widgets/Stamp.vue?vue&type=script&lang=js
 /* harmony default export */ const Widgets_Stampvue_type_script_lang_js = (Stampvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Widgets/Stamp.vue?vue&type=style&index=0&id=2701b8ba&prod&scoped=true&lang=less
var Stampvue_type_style_index_0_id_2701b8ba_prod_scoped_true_lang_less = __webpack_require__(75591);
;// ./src/standard/module/components/Widgets/Stamp.vue?vue&type=style&index=0&id=2701b8ba&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/Widgets/Stamp.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  Widgets_Stampvue_type_script_lang_js,
  Stampvue_type_template_id_2701b8ba_scoped_true/* render */.XX,
  Stampvue_type_template_id_2701b8ba_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "2701b8ba",
  null
  
)

/* harmony default export */ const Stamp = (component.exports);

/***/ }),

/***/ 36703:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


const request = __webpack_require__(49388);
const userData = __webpack_require__(74222);
const template = __webpack_require__(26133);
const cnzz = __webpack_require__(5300);
const log = __webpack_require__(35743);
const getPromoInfo = callback => {
  let other_info = userData.get('other_info');
  let class_id = other_info['code-server'] && other_info['code-server'].class_id || '00000000';
  let dp_id = other_info.now.dp_id;
  let title = encodeURIComponent(G.dp.name);
  let href = encodeURIComponent(location.href);
  let sbrand = encodeURIComponent(other_info.exact_arr.sbrand);
  let keyword = encodeURIComponent(other_info.now.coreword);
  let url = `${G.server}/brwext/promo_brand?pg=1&ps=30&order=0&class_id=${class_id}&dp_id=${dp_id}&title=${title}&url=${href}&sbrand=${sbrand}&keyword=${keyword}`;
  request.get(url).done(data => {
    if (data && data.length !== 0) {
      callback(data);
    }
  });
};
const render = data => {
  if (data.products.length === 0) {
    return;
  }
  ;
  let html = __webpack_require__(20744);
  /* 1：减  2：返  3：赠9:手机  10：惠  11多买多减 */
  var promokey = {
    '1': '促',
    '2': '折',
    '3': '赠',
    '4': '减',
    '5': '赠',
    '6': '返'
  };
  data.products = data.products.slice(0, 4);
  if (data.products.length < 4) {
    return;
  }
  for (let i = 0; i < data.products.length; i++) {
    if (promokey[data.products[i].promo_type]) data.products[i].promokeys = promokey[data.products[i].promo_type];else
      //if (data.products[i].promo_type != 7)   7是特殊优惠 先按促显示
      data.products[i].promokeys = '促';
  }
  $('#promo_box').append(template.compile(html)({
    data: data.products
  }));
  $('#promo_box').css('display', 'block');
  cnzz.log('track:mini:promo');
  log('track:mini:promo');
  $('#promo_box').on('click', 'a', function (e) {
    cnzz.log('click:mini:promo');
    log('click:mini:promo');
    if (G.site === 'suning' && $(this).attr('href')) {
      window.open($(this).attr('href'));
      e.preventDefault();
    }
  });
};
module.exports.init = () => {
  let permanent = userData.get('permanent');
  if (permanent.setShowPromo === '0' || permanent.setShowPromo === 0) {
    return;
  }
  ;
  if (G.site === '360buy-re') return;
  getPromoInfo(render);
};

/***/ }),

/***/ 37272:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(23792);
__webpack_require__(3362);
__webpack_require__(62953);
const request = __webpack_require__(49388);
const siteInfo = __webpack_require__(92834);
const globalCondition = __webpack_require__(41761);
let cachedRes = {};
let t = 0;
const checkFirstGiftMoney = id => {
  let el = $(`li[data-sku=${id}] .cashGift`);
  if (!el.length) {
    el = $(`div[data-sku=${id}] ._tags_hzhkm_2`);
  }
  if (!el.length) {
    el = $(`.more2_item[id=${id}] .more2_tail_tag`);
  }
  if (el.length) {
    if (el.text().indexOf('首购礼金') > -1) {
      // 首购礼金A元
      const reg = /首购礼金([0-9]+)元/;
      const m = el.text().match(reg);
      return {
        type: 'firstGiftMoney',
        coupon: m[1],
        click_url: `${G.tb_server}/extension/qrpage?tag=qr-ext_search_link&dp_id=${id}-3&extLink=1`
      };
    }
  }
  return false;
};
const process = async list => {
  $('i[data-tips=京东自营，品质保障]').parents('li').addClass('gwd-self');
  const lang = G.lang === 'zh-tr' ? '&lang=zh-tr' : '';
  let result = await request.post(G.server + '/extension/CouponMulti?union=' + G.union + lang, {
    ids: list.join(','),
    site_id: 3
  }, true, false);
  list.forEach(id => {
    if (!result[id]) {
      result[id] = checkFirstGiftMoney(id);
    }
  });
  render(result);
  cachedRes = {
    ...result,
    ...cachedRes
  };
};
let mode = 'searchPage';
const render = result => {
  if (!result) return;
  Object.keys(result).map(key => {
    if (result[key]) {
      let d = result[key];
      if ($(`li[data-sku=${key}] .p-img .search_coupon_tip`).length) {
        return;
      }
      if ($(`a[data-sku=${key}] .search_coupon_tip`).length) {
        return;
      }
      if ($(`.plugin_goodsCardWrapper[data-sku=${key}] .search_coupon_tip`).length) {
        return;
      }
      $(`li[data-sku=${key}]`).addClass('gwd-has-coupon');
      $(`.plugin_goodsCardWrapper[data-sku=${key}]`).addClass('gwd-has-coupon');
      let txt1 = `当前商品点击领券立减${d.coupon}元`,
        txt2 = `￥${d.coupon} 优惠券`;
      if (G.lang === 'zh-tr') {
        txt1 = `當前商品點擊領券立減${d.coupon}元`;
        txt2 = `￥${d.coupon} 優惠券`;
      }
      if (d.type && d.type === 'firstGiftMoney') {
        txt1 = `当前商品领取礼金立减${d.coupon}元`;
        txt2 = `￥${d.coupon} 首购礼金`;
      }
      globalCondition.setMet(`gwd-pricetip-data-${key}`, {
        type: d.type ? d.type : 'coupon',
        coupon: d.coupon,
        link: d.click_url
      });
      if (mode === 'promoPage') {
        $(`a[data-sku=${key}]:eq(0)`).css('position', 'relative').append(`
          <a href="${d.click_url}" class="search_coupon_tip" title="${txt1}" style="position: absolute; cursor:pointer; line-height: 23px; top: 0; right: 0; width: unset; min-width: 92px" target="_blank">${txt2}</a>
        `);
      } else if (mode === 'more2') {
        $(`li[id=${key}]`).append(`
          <a href="${d.click_url}" class="search_coupon_tip" title="${txt1}" style="position: absolute; cursor:pointer; line-height: 23px; top: 0; right: 0" target="_blank">${txt2}</a>
        `);
      } else if (mode === 'search2025') {
        $(`.plugin_goodsCardWrapper[data-sku=${key}]`).append(`
          <a href="${d.click_url}" class="search_coupon_tip" title="${txt1}" style="position: absolute; white-space: nowrap; cursor:pointer; line-height: 23px; top: 0; right: 20px; z-index: 9" target="_blank">${txt2}</a>
        `);
      } else {
        $(`li[data-sku=${key}] .p-img`).append(`
          <a href="${d.click_url}" class="search_coupon_tip" title="${txt1}" style="position: absolute; cursor:pointer; line-height: 23px; top: 0; right: 0" target="_blank">${txt2}</a>
        `);
      }
    } else {
      globalCondition.setMet(`gwd-pricetip-data-${key}`, {
        type: 'none'
      });
    }
  });
};
module.exports.init = async () => {
  const excludeHosts = ['order.jd.com', 'club.jd.com'];
  if (excludeHosts.includes(location.hostname)) {
    return;
  }
  // let list = $('ul.gl-warp li.gl-item').toArray().map(item => item.dataset.sku)
  // if (list.length) {
  //   process(list)
  // }
  let list = [];
  let url = location.href;
  let dom = $('#J_main')[0];
  if (!dom) {
    dom = $('.babel-app')[0];
    mode = 'promoPage';
    $('body').on('click', '.search_coupon_tip', e => {
      e.preventDefault();
      e.stopPropagation();
      window.open(e.target.href);
    });
  }
  if (!dom) dom = document.body;
  let modding = false;
  if ($('#J_app').length) {
    mode = 'more2';
    await (__webpack_require__(30888).waitForConditionFn)(() => $('#feedContent0').length);
    dom = $('#feedContent0')[0];
  }
  if ($('#main_search_conter').length) {
    dom = $('._wrapper_f6icl_11')[0];
    mode = 'search2025';
  }
  const check = function (e) {
    if (modding) return;
    modding = true;
    let newList = $('ul.gl-warp li.gl-item').toArray().map(item => item.dataset.sku);
    if (!newList.length) {
      newList = $('.pd_common').toArray().filter(x => !x.dataset.sku).map(item => {
        if (item.attributes.jsonparams) {
          let p = JSON.parse(item.attributes.jsonparams.value);
          $(item).attr('data-sku', p.sku);
          return p.sku;
        }
        return false;
      }).filter(x => x);
    }
    if (!newList.length) {
      newList = $('a img').toArray().map(x => {
        let a = $(x).parents('a');
        return {
          el: a,
          href: a.attr('href')
        };
      }).filter(x => {
        if (x.el.attr('data-sku')) return false;
        if (siteInfo.isProductPage('https:' + x.href)) {
          const sku = x.href.replace(/[^\d]*/g, '');
          x.el.attr('data-sku', sku);
          x.sku = sku;
          return true;
        }
        return false;
      }).map(x => x.sku);
    }
    if (!newList.length) {
      newList = $('.more2_item_good').toArray().map(x => {
        let a = $(x);
        return a.attr('id');
      }).filter(x => x);
    }
    if (!newList.length) {
      newList = $('.plugin_goodsCardWrapper').toArray().map(x => {
        let a = $(x);
        return a.attr('data-sku');
      }).filter(x => x);
      newList = [...new Set(newList)];
    }
    modding = false;
    newList = newList.filter(x => {
      return list.indexOf(x) === -1;
    });
    if (newList.length > 0) {
      console.log(newList);
      process(newList);
      list = list.concat(newList);
    } else if (location.href !== url) {
      setTimeout(() => {
        render(cachedRes);
      }, 1000);
    }
    url = location.href;
  };
  check();
  const onChangeFunc = (__webpack_require__(60340).debounce)(check, mode === 'more2' ? 0 : 300);
  const observer = new MutationObserver(onChangeFunc);
  observer.observe(dom, {
    childList: true,
    subtree: true
  });
};

/***/ }),

/***/ 37757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51366);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("469cb0bc", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 37953:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_1_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39360);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_1_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_1_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ 38276:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"priceUp":{"zh":"价格上涨","en":"Price Increases","zh-tr":"價格上漲"},"priceStable":{"zh":"价格平稳","en":"Keep Stable","zh-tr":"價格平穩"},"priceDecrease":{"zh":"价格下降","en":"Price Declining","zh-tr":"價格下降"},"priceLowest":{"zh":"历史最低价","en":"Lowest Price","zh-tr":"歷史最低價"},"lowestSingleWithSpace":{"zh":"最低(单&nbsp;&nbsp;&nbsp;件):","en":"Lowest Price(single):","zh-tr":"最低(單&nbsp;&nbsp;&nbsp;件):"},"lowestSingle":{"zh":"最低(单件):","en":"Lowest(single):","zh-tr":"最低(單件):"},"lowest":{"zh":"最低:","en":"Lowest:","zh-tr":"最低:"},"textCurrent":{"zh":"现价","en":"Current","zh-tr":"現價"},"textHigh":{"zh":"最高","en":"Highest","zh-tr":"最高"},"textLow":{"zh":"最低","en":"Lowest","zh-tr":"最低"},"day":{"zh":"天","en":" days","zh-tr":"天"},"all":{"zh":"全部","en":"All","zh-tr":"全部"},"single":{"zh":"单&nbsp;&nbsp;&nbsp;件","en":"Single","zh-tr":"單&nbsp;&nbsp;&nbsp;件"},"combine":{"zh":"多&nbsp;&nbsp;&nbsp;件","en":"Combined","zh-tr":"多&nbsp;&nbsp;&nbsp;件"},"pagePrice":{"zh":"页面价","en":"Price","zh-tr":"頁面價"},"onHandPrice":{"zh":"到手价(单件)","en":"Promotion Price","zh-tr":"到手價(單件)"},"combinePrice":{"zh":"到手价(多件)","en":"Combined Price","zh-tr":"到手價(多件)"}}');

/***/ }),

/***/ 38469:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(72524);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("31c72026", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 38752:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "minibar-tab",
    class: {
      bjg: _vm.isBjg,
      "gwd-fake-tr": _vm.position.top
    },
    staticStyle: {
      flex: "1",
      display: "inline-block"
    },
    style: _vm.style,
    attrs: {
      id: "gwd_mini_compare"
    },
    on: {
      mouseover: _vm.mouseover,
      mouseleave: _vm.mouseleave,
      "~hover": function ($event) {
        return _vm.logHover.apply(null, arguments);
      }
    }
  }, [!_vm.position.top ? _c("div", {
    staticClass: "minibar-btn-box"
  }, [_c("em", {
    staticClass: "setting-bg mini-compare-icon"
  }), _vm._v(" "), _vm.data.length && _vm.data[0].view_price < _vm.pri ? _c("span", {
    staticStyle: {
      float: "none"
    }
  }, [_vm._v(_vm._s(_vm.transText("更低价")) + ":¥" + _vm._s(_vm.data[0].view_price))]) : _vm.data.length === 0 ? _c("span", {
    staticStyle: {
      float: "none"
    }
  }, [_vm._v(_vm._s(_vm.transText("暂无结果")))]) : _c("span", {
    staticStyle: {
      float: "none"
    }
  }, [_vm._v(_vm._s(_vm.transText("其他")) + _vm._s(_vm.data.length) + _vm._s(_vm.transText("家报价")))])]) : _vm._e(), _vm._v(" "), _vm.position.top ? _c("div") : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "minibar-detail",
    attrs: {
      id: "gwd_mini_compare_detail"
    }
  }, [_c("ul", _vm._l(_vm.data, function (item) {
    return _c("li", {
      key: item.nid
    }, [_c("a", {
      attrs: {
        href: item.url,
        target: "_blank"
      },
      on: {
        click: function ($event) {
          return _vm.logLink();
        }
      }
    }, [_c("img", {
      attrs: {
        src: `https://cdn.gwdang.com/images/favicon/${item.site}.png`
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "m-item-sitename"
    }, [_vm._v(_vm._s(item.shopName))]), _vm._v(" "), _c("span", {
      staticClass: "m-item-price prifontf"
    }, [_vm._v("¥" + _vm._s(item.view_price))])])]);
  }), 0)])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 38946:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
// 京东礼金

const request = __webpack_require__(49388);
const globalCondition = __webpack_require__(41761);
const getGiftMoney = async () => {
  let config = await (__webpack_require__(41761).met)('GwdConfig');
  if (config.allowJdGiftMoney) {
    let payload = {
      rebate: 1,
      dp_id: G.dp.itemId
    };
    if (config.allowDuomai) {
      try {
        let duomaiData = await (__webpack_require__(41761).met)('duomaiData');
        if (duomaiData.commission_rate && duomaiData.price) {
          payload.rate = (parseFloat(duomaiData.commission_rate) * 100).toFixed(2);
          payload.price = duomaiData.price * (location.href.indexOf('debugExt') > -1 ? 10000 : 1);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    let params = Object.keys(payload).map(k => `${k}=${encodeURIComponent(payload[k])}`).join('&');
    let res = await request.get(`${G.server}/extension/Coupon?${params}`);
    return res;
  }
  return null;
};
module.exports.getGiftMoney = getGiftMoney;
module.exports.init = async () => {
  //if (navigator.userAgent.toLowerCase().indexOf('metasr') === -1) return
  if (G.site !== '360buy') return;
  if (G.forbidGiftMoney) {
    globalCondition.setMet('noOtherGiftMoney');
    (__webpack_require__(18158).init)('qr');
    return;
  }
  await (__webpack_require__(30888).waitForConditionFn)(() => $('#summary-tips').length > 0);
  if ($('#summary-tips').text().indexOf('不可使用东券') > -1 || $('#summary-tips').text().indexOf('不可使用京券、东券') > -1) {
    globalCondition.setMet('noOtherGiftMoney');
    (__webpack_require__(18158).init)('qr');
    return;
  }
  if ($('#pingou-banner .activity-type strong').text().indexOf('预售') > -1) {
    globalCondition.setMet('noOtherGiftMoney');
    (__webpack_require__(18158).init)('qr');
    return;
  }
  const res = await getGiftMoney();
  if (res && res.rebate && res.rebate >= 1) {
    (__webpack_require__(5300).log)('jdGiftMoney:show');
    if (res._jump === 'qrcode') {
      (__webpack_require__(5300).log)('jdGiftMoney:needScanQr');
      (__webpack_require__(5300).log)('jdGiftMoney:-needScanQr');
    } else if (res._jump === 'link') {
      (__webpack_require__(5300).log)('jdGiftMoney:needClickLink');
    }
    const GiftMoney = (__webpack_require__(44666)/* ["default"] */ .A);
    $('#gwd-coupon-placeholder').replaceWith('<div id="gwd-giftmoney"></div>');
    new Vue({
      el: '#gwd-giftmoney',
      render: h => h(GiftMoney, {
        props: {
          value: res.rebate,
          qr: res._jump === 'qrcode',
          url: res.url,
          tag: res._tag
        }
      })
    });
    if (res.jump !== 'qrcode') {
      (__webpack_require__(41761).setMet)('couponLink', {
        content: '发现' + res.rebate + '元红包，速领',
        url: res.url
      });
      (__webpack_require__(2636).add)('店铺红包', res.rebate, res.url);
    }
    $('#gwdang-banner-ad').remove();
    const GiftMoneyTop = (__webpack_require__(61915)/* ["default"] */ .A);
    $('.gwd-topbar-left').append(`<div id="gwd-giftmoney-top"></div>`);
    new Vue({
      el: '#gwd-giftmoney-top',
      render: h => h(GiftMoneyTop, {
        props: {
          value: res.rebate,
          qr: res._jump === 'qrcode',
          url: res.url,
          tag: res._tag
        }
      })
    });
    //require('standard/module/jdPriceProtect').init('redpack')
  } else {
    globalCondition.setMet('noOtherGiftMoney');
    (__webpack_require__(18158).init)('qr');
  }
};

/***/ }),

/***/ 39102:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-content[data-v-40244662] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px;\n  width: 100%;\n  box-sizing: border-box;\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.gwd-content[data-v-40244662]::-webkit-scrollbar {\n  display: none;\n}\n.gwd-content .gwd-select[data-v-40244662] {\n  margin-bottom: 8px;\n}\n.gwd-content .gwd-label[data-v-40244662] {\n  font-size: 14px;\n  font-weight: bold;\n  color: #404547;\n  margin-right: 8px;\n  margin-top: 5px;\n}\n.gwd-content .gwd-select-option[data-v-40244662] {\n  margin-right: 12px;\n  margin-bottom: 12px;\n  display: inline-block;\n  height: 32px;\n  line-height: 32px;\n  padding: 0 16px;\n  background: #f7f7f7;\n  font-size: 14px;\n  color: #404547;\n  border-radius: 4px;\n  cursor: pointer;\n  border: 1px solid #f7f7f7;\n}\n.gwd-content .gwd-select-option.gwd-select-option-active[data-v-40244662] {\n  background: #fff1f1;\n  color: #e03024;\n  border: 1px solid #e03024;\n}\n.gwd-content .gwd-first-option[data-v-40244662] {\n  padding: 12px;\n  box-sizing: border-box;\n  background: #fafafa;\n  border-radius: 8px;\n  margin-bottom: 12px;\n}\n.gwd-content .gwd-first-option .gwd-option-img[data-v-40244662] {\n  width: 52px;\n  height: 52px;\n  border-radius: 4px;\n  border: 1px solid #e6e9eb;\n  margin-right: 12px;\n}\n.gwd-content .gwd-second-option[data-v-40244662] {\n  height: 54px;\n  justify-content: center;\n  border: 1px solid #e6e9eb;\n  background: #fff;\n  border-radius: 4px;\n  padding: 0 12px;\n  margin-right: 12px;\n  margin-top: 12px;\n}\n", ""]);

// exports


/***/ }),

/***/ 39277:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(3362);
let appended = false;
module.exports.init = css => {
  let imgurl;
  try {
    if (!navigator.userAgent.includes('Chrome')) {
      css = `${G.s_server}/css/brwext/${css}`;
      imgurl = `${G.s_server}/css/brwext/images.css`;
    } else if (G.localHost && G.from_device !== 'default') {
      css = `${G.localHost}css/${css}`;
      imgurl = `${G.localHost}css/images.css`;
    } else if (chrome && chrome.extension && (G.from_device === 'chrome' || G.from_device === '2345')) {
      css = `css/${css}`;
      css = chrome.extension.getURL(css);
      imgurl = chrome.extension.getURL(`css/images.css`);
    } else {
      css = `${G.s_server}/css/brwext/${css}`;
      imgurl = `${G.s_server}/css/brwext/images.css`;
    }
  } catch (e) {
    css = `${G.s_server}/css/brwext/${css}`;
    imgurl = `${G.s_server}/css/brwext/images.css`;
  }

  // $(`body`).append(`<link type="text/css" href="${css}" rel="stylesheet" />`);
  // $(`body`).append(`<link type="text/css" href="${imgurl}?v=${G.version}" rel="stylesheet" />`);
  return new Promise(resolve => {
    if (appended) {
      resolve();
      return;
    }
    let link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = css;
    let imgLink = document.createElement('link');
    imgLink.type = 'text/css';
    imgLink.rel = 'stylesheet';
    imgLink.href = `${imgurl}?v=${G.version}`;
    link.onload = () => {
      appended = true;
      resolve();
    };
    document.body.appendChild(link);
    document.body.appendChild(imgLink);
  });
};

/***/ }),

/***/ 39302:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['value']
};

/***/ }),

/***/ 39360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63459);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("5d29e196", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 39591:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


if ("ActiveXObject" in window) {
  G.browser = {
    engine: "trident",
    agent: "msie",
    ver: window.XMLHttpRequest ? document.querySelector ? document.addEventListener ? window.atob ? window.execScript ? 10 : 11 : 9 : 8 : 7 : 6
  };
}
// G.browser.version = G.browser.ver;
// if (G.browser.agent === 'msie')
//   G.browser.msie = true;
// G.IE6 = G.browser.agent == "msie" && G.browser.ver === 6;
// G.IE7 = G.browser.agent == "msie" && G.browser.ver === 7;
// G.IE8 = G.browser.agent == "msie" && G.browser.ver === 8;
// G.IE9 = G.browser.agent == "msie" && G.browser.ver === 9;
// G.IE10 = G.browser.agent == "msie" && G.browser.ver === 10;
// G.IE11 = G.browser.agent == "msie" && G.browser.ver === 11;

/***/ }),

/***/ 40067:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(3362);
const extConsole = __webpack_require__(7129);
module.exports.init = async data => {
  extConsole.log(data);
  const icon = __webpack_require__(50575);
  if (data && data.link) {
    let dom = `
      <div id="gwd-ingre" class="gwdang-tab gwd-row gwd-align gwd-hoverable" style="line-height: 36px; padding-left: 5px; padding-right: 5px">
        <a href="${data.link}" target="_blank" style="text-decoration: none!important;">
          <img src="${icon}" alt="" style="width: 22px; height: 22px; margin-top: -2px;vertical-align: middle; display: inline-block">
          <span style="margin-left: 5px; font-size: 14px; color: #333333">查看成分表</span>
        </a>
      </div>`;
    extConsole.log($(`#${G.extName}-trend`));
    //await require('common/globalCondition').met('GwdPriceTrendLoaded')
    if ($(`#${G.extName}-trend`).length > 0) $(`#${G.extName}-trend`).after($(dom));else $(`#${G.extName}-main-contents`).append($(dom));
    extConsole.log('showing dom');
    //require('common/mutationObserver').observe($('#gwd-ingre')[0])
    $('#gwd-ingre').css('display', 'flex');
    (__webpack_require__(41761).setMet)('ingreComplete');
  }
};

/***/ }),

/***/ 40452:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
__webpack_require__(3362);
const request = __webpack_require__(49388);
const globalCondition = __webpack_require__(41761);
var _default = exports.A = {
  props: ['mode', 'days'],
  data() {
    return {
      qrLink: '',
      loading: false
    };
  },
  methods: {
    async over() {
      if (this.loading || this.qrLink) return;
      if (this.mode !== 'qr') return;
      this.loading = true;
      let qrApi = await globalCondition.met('qrApiReady');
      if (qrApi.type === 'api') {
        let res = await request.get(qrApi.src + '&protect=' + this.days);
        this.qrLink = res.data.qrImgStr;
      }
    }
  }
};

/***/ }),

/***/ 40473:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
const bgClient = __webpack_require__(40076);
var _default = exports.A = {
  props: ['site', 'siteMap', 'error', 'errorDetail', 'permissionTextOnly', 'hasPermission'],
  data() {
    return {
      verifyLink: G.GwdConfig && G.GwdConfig.tbVerifyLink ? G.GwdConfig.tbImgVerifyLink : 'https://s.taobao.com/search?commend=all&ie=utf8&page=1&preLoadOrigin=https%3A%2F%2Fwww.taobao.com&q=%E7%81%AB%E8%85%BF%E8%82%A0&search_type=item&sourceId=tb.index&spm=a21bo.jianhua%2Fa.search_manual.0&ssid=s5-e&tab=all',
      bjg: G.from_device === 'bijiago'
    };
  },
  methods: {
    transText: __webpack_require__(54600),
    index(site) {
      switch (site) {
        case 'jd':
          return 'https://www.jd.com/';
        case 'tb':
          return 'https://www.taobao.com/';
        case '1688':
          return 'https://www.1688.com/';
      }
      return '';
    },
    login() {
      // switch(this.site) {
      //   case 'jd':
      //     window.open('https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2F')
      //     break;
      //   case 'tb':
      //     window.open('https://login.taobao.com/member/login.jhtml')
      //     break;
      //   case 'pdd':
      //     window.open('https://mobile.yangkeduo.com/login.html')
      //     break;
      // }
      window.open(this.index(this.site));
    },
    retry() {
      this.$emit('retry');
    }
  },
  mounted() {
    (__webpack_require__(41761).met)('GwdConfig').then(config => {
      if (config.tbImgVerifyLink) {
        this.verifyLink = config.tbImgVerifyLink;
      }
    });
  }
};

/***/ }),

/***/ 40584:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\n.gwd-main-login button[data-v-549382c4] {\n  width: 200px!important;\n}\n.gwd-remind-qr:hover #gwd-remind-qrcode_img[data-v-549382c4] {\n  display: block;\n}\n#gwd-remind-qrcode[data-v-549382c4] {\n  /*position: absolute;*/\n  /*bottom: 14px;*/\n  /*right: 14px;*/\n  font-size: 12px;\n  cursor: pointer;\n  -moz-user-select: -moz-none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.favor_choosed #gwd-remind-qrcode[data-v-549382c4] {\n  bottom: 14px;\n  right: 14px;\n  z-index: 99999999;\n}\n#gwd-remind-qrcode_img[data-v-549382c4] {\n  position: absolute;\n  right: 15px;\n  height: 134px;\n  width: 120px;\n  bottom: 29px;\n  display: none;\n  border: 1px solid #e1e1e1;\n  background-color: #fff;\n  box-shadow: 0px 5px 15px 0 rgba(23,25,27,0.15);\n}\n#gwd-remind-qrcode_img img[data-v-549382c4] {\n  width: 100%;\n}\n#gwd-remind-qrcode_img[data-v-549382c4]:before {\n  display: block;\n  content: \"\";\n  height: 0px;\n  width: 0px;\n  border: 8px solid transparent;\n  border-top-color: #999;\n  border-right-width: 7px;\n  border-left-width: 7px;\n  top: 135px;\n  right: 52px;\n  position: absolute;\n}\n#gwd-remind-qrcode_img[data-v-549382c4]:after {\n  display: block;\n  content: \"\";\n  height: 0px;\n  width: 0px;\n  border: 8px solid transparent;\n  border-top-color: #fff;\n  border-right-width: 8px;\n  border-left-width: 8px;\n  top: 134px;\n  right: 51px;\n  position: absolute;\n}\n#gwd-remind-qrcode_img p[data-v-549382c4] {\n  text-align: justify;\n  margin: 0px;\n  padding: 0px 6px;\n  height: 20px;\n  font-size: 12px;\n  color: #8d8d8d;\n  position: relative;\n  white-space: normal;\n  top: -8px;\n}\n#gwd-remind-qrcode_img p[data-v-549382c4]:after{\n  content:\".\";\n  display: inline-block;\n  width:100%;\n  overflow:hidden;\n  height:0;\n}\n", ""]);

// exports


/***/ }),

/***/ 40834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(91909);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("0a4a81ee", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 41672:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


const request = __webpack_require__(49388);
const userData = __webpack_require__(74222);
const priceCheck = __webpack_require__(78878);
const monitor = __webpack_require__(89084);
const inventoryCheck = __webpack_require__(19777);
const tbCompare2 = __webpack_require__(97353);
const log = __webpack_require__(35743);
const communicate = __webpack_require__(79560);
const loadCss = __webpack_require__(39277);
const utils = __webpack_require__(30888);
const globalCondition = __webpack_require__(41761);
__webpack_require__(58531);
let perInfo, percallback, hasReq;
const getPermanInfo = callback => {
  if (perInfo) {
    callback(perInfo);
    return;
  }
  if (hasReq) {
    percallback = callback;
    return;
  }
  hasReq = true;
  let url = `${G.server}/brwext/permanent_id?version=2&default_style=bottom&referrer=${encodeURIComponent(document.referrer)}`;
  request.get(url).then(data => {
    if (data) {
      perInfo = data;
      if (data.email && data.email.indexOf('%') > -1) {
        data.email = decodeURIComponent(data.email);
      }
      G.email = data.email;
      G.show_app = data.show_app;
      G.force = data.force;
      callback(data);
      if (percallback) percallback(data);
    }
  });
};
const editData = (style, data) => {
  if (G.aliSite) return data;
  if (data.b2c && data.b2c.length !== 0) {
    if (style === 'top') {
      let storeLen = data.b2c.store.length;
      for (let i = storeLen - 1; i >= 0; i--) {
        if (data.b2c.store[i].is_third && data.b2c.store[i].shop_name) {
          data.b2c.store[i].site_name2 = data.b2c.store[i].site_name;
          data.b2c.store[i].site_name = data.b2c.store[i].site_name.replace("第三方", "") + '-' + data.b2c.store[i].shop_name;
        }
        data.b2c.store[i].price = (Number(data.b2c.store[i].price) / 100).toFixed(2);
        data.b2c.store[i].price2 = data.b2c.store[i].price;
        if (!data.b2c.store[i].title || !data.b2c.store[i].img_url) {
          data.b2c.store.splice(i, 1);
        }
      }
      data.b2c.store2 = data.b2c.store.slice(0, 6);
      let productLen = data.b2c.product.length;
      for (let i = productLen - 1; i >= 0; i--) {
        if (data.b2c.product[i].is_third && data.b2c.product[i].shop_name) {
          data.b2c.product[i].site_name2 = data.b2c.product[i].site_name;
          data.b2c.product[i].site_name = data.b2c.product[i].site_name.replace("第三方", "") + '-' + data.b2c.product[i].shop_name;
        }
        let pitem = data.b2c.product[i];
        if (pitem.promotions && pitem.fee && pitem.fee.indexOf('缺货') === -1) {
          pitem.promo2 = [];
          pitem.coupon2 = [];
          pitem.yushou2 = [];
          for (let k = 0; k < pitem.promotions.length; k++) {
            if (pitem.promotions[k].type === "promo") {
              if (pitem.promotions[k].tag === '预售') {
                pitem.yushou2.push(pitem.promotions[k].text);
              } else {
                pitem.promo2.push(pitem.promotions[k].text);
              }
            } else {
              pitem.coupon2.push(pitem.promotions[k].text);
            }
          }
          if (pitem.promo2.length === 0) pitem.promo2 = null;
          if (pitem.coupon2.length === 0) pitem.coupon2 = null;
          if (pitem.yushou2.length === 0) pitem.yushou2 = null;
        }
        data.b2c.product[i].price = (Number(data.b2c.product[i].price) / 100).toFixed(2);
        if (!data.b2c.product[i].title || !data.b2c.product[i].img_url) {
          data.b2c.product.splice(i, 1);
        }
      }
      data.b2c.min_price = (Number(data.b2c.min_price) / 100).toFixed(2);
    } else {
      let storeLen = data.b2c.store.length;
      for (let i = storeLen - 1; i >= 0; i--) {
        if (!data.b2c.store[i].product) continue;
        let productiLen = data.b2c.store[i].product.length;
        for (let j = productiLen - 1; j >= 0; j--) {
          if (data.b2c.store[i].product[j].is_third && data.b2c.store[i].product[j].shop_name) {
            data.b2c.store[i].product[j].site_name2 = data.b2c.store[i].product[j].site_name;
            data.b2c.store[i].product[j].site_name = data.b2c.store[i].product[j].site_name.replace("第三方", "") + '-' + data.b2c.store[i].product[j].shop_name;
          }
          data.b2c.store[i].product[j].price = (Number(data.b2c.store[i].product[j].price) / 100).toFixed(2);
          data.b2c.store[i].product[j].l_price = (Number(data.b2c.store[i].product[j].l_price) / 100).toFixed(2);
          let pitem = data.b2c.store[i].product[j];
          if (pitem.promotions && pitem.fee && pitem.fee.indexOf('缺货') === -1) {
            pitem.promo2 = [];
            pitem.coupon2 = [];
            pitem.yushou2 = [];
            for (let k = 0; k < pitem.promotions.length; k++) {
              if (pitem.promotions[k].type === "promo") {
                if (pitem.promotions[k].tag === '预售') {
                  pitem.yushou2.push(pitem.promotions[k].text);
                } else {
                  pitem.promo2.push(pitem.promotions[k].text);
                }
              } else {
                pitem.coupon2.push(pitem.promotions[k].text);
              }
            }
            if (pitem.promo2.length === 0) pitem.promo2 = null;
            if (pitem.coupon2.length === 0) pitem.coupon2 = null;
            if (pitem.yushou2.length === 0) pitem.yushou2 = null;
          }
          if (!data.b2c.store[i].product[j].title || !data.b2c.store[i].product[j].img_url) {
            data.b2c.store[i].product.splice(j, 1);
          }
        }
      }
    }
  } else if (data.b2c_fuzzy && data.b2c_fuzzy.length !== 0) {
    let productLen = data.b2c_fuzzy.product.length;
    for (let i = productLen - 1; i >= 0; i--) {
      if (data.b2c_fuzzy.product[i].is_third && data.b2c_fuzzy.product[i].shop_name) {
        data.b2c_fuzzy.product[i].site_name2 = data.b2c_fuzzy.product[i].site_name;
        data.b2c_fuzzy.product[i].site_name = data.b2c_fuzzy.product[i].site_name.replace("第三方", "") + '-' + data.b2c_fuzzy.product[i].shop_name;
      }
      let pitem = data.b2c_fuzzy.product[i];
      if (pitem.promotions && pitem.fee && pitem.fee.indexOf('缺货') === -1) {
        pitem.promo2 = [];
        pitem.coupon2 = [];
        pitem.yushou2 = [];
        for (let k = 0; k < pitem.promotions.length; k++) {
          if (pitem.promotions[k].type === "promo") {
            if (pitem.promotions[k].tag === '预售') {
              pitem.yushou2.push(pitem.promotions[k].text);
            } else {
              pitem.promo2.push(pitem.promotions[k].text);
            }
          } else {
            pitem.coupon2.push(pitem.promotions[k].text);
          }
        }
        if (pitem.promo2.length === 0) pitem.promo2 = null;
        if (pitem.coupon2.length === 0) pitem.coupon2 = null;
        if (pitem.yushou2.length === 0) pitem.yushou2 = null;
      }
      data.b2c_fuzzy.product[i].price = (Number(data.b2c_fuzzy.product[i].price) / 100).toFixed(2);
      data.b2c_fuzzy.product[i].img_url2 = data.b2c_fuzzy.product[i].img_url && data.b2c_fuzzy.product[i].img_url.replace('s100x100', 's140x140');
      if (!data.b2c_fuzzy.product[i].title || !data.b2c_fuzzy.product[i].img_url) {
        data.b2c_fuzzy.product.splice(i, 1);
      }
    }
    data.b2c_fuzzy.min_price = (Number(data.b2c_fuzzy.min_price) / 100).toFixed(2);
  }
  return data;
};
let times = 0;
const renderMiniFavor = () => {
  times++;
  if (times > 1) {
    console.log('getPermanInfo B');
    getPermanInfo(function () {
      // require('miniFavor').init()
      // require('topFavor').init()
    });
  }
};
const getProductInfo = (style, callback) => {
  console.log('getproductinfo start');
  G.province_id = priceCheck.getSubStationId(G.dp.site);
  var debugData = G.debug ? '&debug=1' : '';
  if (G.noRealPrice) {
    G.dp.price = 0;
  }
  G.dp.inventory = inventoryCheck.init(G.site);
  let url = encodeURIComponent(G.dp.url);
  let name = encodeURIComponent(G.dp.name);
  let keyword = encodeURIComponent(G.dp.keyword);
  let skeyword = encodeURIComponent(G.dp.skeyword);
  let cat_id = typeof G.dp.cat_id != 'undefined' ? G.dp.cat_id : '';
  let pic = typeof G.dp.pic != 'undefined' ? encodeURIComponent(G.dp.pic) : '';
  let cat_name = encodeURIComponent(G.dp.cat_name);
  let brand_string = encodeURIComponent(G.dp.brand_string);
  var dp_interfavce_url = `${G.server}/brwext/dp_query_latest?permanent_id=${G.p_id}&union=${G.union}&url=${url}&site=${G.dp.site}&isbn=${G.dp.isbn}&name=${name}&keyword=${keyword}&skeyword=${skeyword}&id=${G.dp.id}&price=${G.dp.price}&stock=${G.dp.inventory}&province_id=${G.province_id}&subsite_id=${G.subsite_id}&cat_id=${cat_id}&pic=${pic}&userid=${G.dp.userid}&shop_name=${G.dp.shop_name}&shop_addres=${G.dp.shop_addres}&cat_name=${cat_name}&brand_string=${brand_string}${debugData}&style=${style}&ingre=1`;
  var other_info_url = `${G.server}/brwext/prepare?permanent_id=${G.p_id}&union=${G.union}&url=${url}&site=${G.dp.site}&isbn=${G.dp.isbn}&name=${name}&keyword=${keyword}&skeyword=${skeyword}&id=${G.dp.id}&price=${G.dp.price}&stock=${G.dp.inventory}&province_id=${G.province_id}&subsite_id=${G.subsite_id}&cat_id=${cat_id}&pic=${pic}&userid=${G.dp.userid}&shop_name=${G.dp.shop_name}&shop_addres=${G.dp.shop_addres}&cat_name=${cat_name}&brand_string=${brand_string}${debugData}`;
  request.get(dp_interfavce_url).then(data => {
    (__webpack_require__(41761).setMet)('dp_query_latest_complete', data);
    (__webpack_require__(40067).init)(data.ingre);
    G.dp.dpId = data.dp.dp_id;
    data = editData(style, data);
    userData.set('dp_query', data);
    console.log('dp_query set');
    (__webpack_require__(41761).setMet)('dp_query_set');
    renderMiniFavor();
    callback(data);
  }).catch(() => {
    callback(null);
  });
  request.get(other_info_url).done(data => {
    G.dp.dpId = data.now.dp_id;
    if (G.dp && G.dp.dpId) {
      console.log('start checking');
      (__webpack_require__(76904).checked)(G.dp.dpId).then(res => {
        if (res.data && res.data.qr_api) {
          G.qrApi = res.data.qr_api;
        }
        console.log('checked data', res);
        if (res.code === 0 || res.error_code === 1000) {
          /** 用户是否登录 */
          G.userLogin = false;
          utils.setLocal('userLogin', null);
        } else if (res.code !== undefined) {
          /** 商品收藏状态 */
          G.productChecked = res.data;
          console.log('setting product checked');
          G.userLogin = true;
          G.email = 1;
          utils.setLocal('userLogin', true);
          (__webpack_require__(57031).renderAgain)();
          $(document).trigger('checkfavor');
        }
        globalCondition.setMet('userLoginChecked');
        (__webpack_require__(41761).setMet)('checked_data_got');
        // 加载中间部分收藏降价提醒
        // require('standard/module/qrlink').init()
        (__webpack_require__(24753).init)();
        (__webpack_require__(57652)/* .init */ .Ts)();
        $(document).trigger('checkfavor');
      });
    }
    userData.set('other_info', data);
    tbCompare2.init();
    (__webpack_require__(91129).init)(data);
    (__webpack_require__(51332).init)(data);
    (__webpack_require__(36703).init)();
    renderMiniFavor();
    (__webpack_require__(35418).init)();
    (__webpack_require__(10738).init)();
    (__webpack_require__(99495).init)(data.now.dp_id);
    (__webpack_require__(67625).show)(data.exact_arr.isbn, style);
    (__webpack_require__(49917).init)(data.now.dp_id);
    $(document).trigger('minicom');
    (__webpack_require__(41761).setMet)('GwdDpIdGot', data.now.dp_id);
    log(`category:${G.logsite}:${data.now.dp_id}/${data['code-server'].class_id}/`);
    /*eslint-disable */
    if (G.debug && window.console) {
      console.log(data);
    }
    // #if dcm
    if (window.console) {
      window.console.log('keywords:', data.exact_arr.keywords);
      if (data.now.title) window.console.log('title:', data.now.title);
      if (data['code-server']) window.console.log(data['code-server']);
      if (data.now) window.console.log(data.now);
    }
    // #end
    /*eslint-enable */
  }).fail(() => {
    (__webpack_require__(35418).init)();
  });
};
const renderCss = style => {
  $('html').addClass(`gwd_${G.site}`);
  $('html').addClass(`gwd_${style}`);
  $('html').addClass(`${G.from_device}`);
  G.instanceId = parseInt(Math.random() * 10000);
  $('html').attr('data-gwd-id', G.instanceId);
  if (style === 'top') {
    loadCss.init('gwdang-notifier-new6.css');
  } else if (style === 'bottom') {
    loadCss.init('gwdang-notifier-bottom-new6.css');
  }
};
const renderMainBar = style => {
  if (G.site === "steampowered") return;
  if (style === 'top') {
    (__webpack_require__(18294).init)();
  } else if (style === 'bottom') {
    (__webpack_require__(75682).init2)();
  }
};
const getLocalPermanInfo = callback => {
  let runcallback;
  communicate.on(data => {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (data.type === 'browser_setinfo') {
      data = data.value;
      G.allowBackgroundRequest = !!data.allowBackgroundRequest;
      G.canUseLocalLoginCheck = !!data.canUseLocalLoginCheck;
      if (G.allowBackgroundRequest) {
        setTimeout(() => {
          (__webpack_require__(71159).init)();
        }, 3000);
      }
      data.style = data.setStyle || 'top';
      // data.top_fold = data.top_fold || '1';
      // data.bottom_fold = data.bottom_fold || '0';
      if (!runcallback) {
        if (runcallback) return;
        runcallback = true;
        userData.set('permanent', data);
        callback(data);
        // console.log('getPermanentInfo A')
        // getPermanInfo(function(info) {
        //   data.top_fold = data.top_fold || info.p_fold || '0';
        //   data.setWishlist = data.setWishlist || info.show_wishlist || '0';
        //   data.setShowPromo = data.setShowPromo || info.show_promo || '0';
        //   data.bottom_fold = data.bottom_fold || info.p_fold || '0';
        //   if (data.localHost)
        //     G.localHost = data.localHost;
        //   if (data.user_extension_id)
        //     G.userid = data.user_extension_id;
        //   if (data.version)
        //     G.ext_v = data.version;
        //   userData.set('permanent', data)
        //   callback(data)
        //
        // })
      }
    } else if (data.type === 'user_extension_id') {
      G.userid = data.value;
    } else if (data.type === 'get_local_host') {
      G.localHost = data.value;
    } else if (data.type === 'get_local_img') {
      G.localImg = data.value;
      if (G.from_device === 'firefox') {
        G.noImg = data.value + 'default_load_image.png';
        G.imgLoad = data.value + '120.gif';
      }
    }
  });
  setTimeout(function () {
    if (!runcallback) {
      let data = {
        'style': 'bottom'
      };
      console.log('getPermanent C');
      getPermanInfo(function (info) {
        if (runcallback) return;
        data.top_fold = data.top_fold || info.p_fold || '0';
        data.bottom_fold = data.bottom_fold || info.p_fold || '0';
        data.setWishlist = data.setWishlist || info.show_wishlist || '0';
        data.setShowPromo = data.setShowPromo || info.show_promo || '0';
        data.style = info.style || 'top';
        data.setTip = info.show_tip || '1';
        data.sethaitao = info.show_haitao || '1';
        userData.set('permanent', data);
        callback(data);
        runcallback = true;
      });
      // userData.set('permanent', data)
      // callback(data)
      // runcallback = true
    }
  }, 180);
  communicate.trigger({
    'type': 'user_extension_id'
  });
  communicate.trigger({
    'type': 'browser_setinfo'
  });
  communicate.trigger({
    'type': 'get_local_host'
  });
  communicate.trigger({
    'type': 'get_local_img'
  });
};
const renderModule = style => {
  console.log('renderModule start');
  (__webpack_require__(87268)/* .init */ .T)();
  getProductInfo(style, function (data) {
    (__webpack_require__(63368).init)(style, data);
    (__webpack_require__(75772).init)('b2c', data);
    if (data && data.dp) {
      (__webpack_require__(11086).init)(data.dp.dp_id);
    }
    // if (userData.get('other_info')) {
    //   require('./miniBar').renderMiniCom(data)
    // } else {
    //   $(document).on('minicom', function() {
    //     require('./miniBar').renderMiniCom(data)
    //   })
    // }
    if (location.host.indexOf('.jd.com') > -1 || location.host.indexOf('suning') > -1) (__webpack_require__(47552).init2)();else if (location.host.indexOf('taobao') > -1 || location.host.indexOf('tmall') > -1) (__webpack_require__(47552).init)();
    setTimeout(function () {
      (__webpack_require__(79963).init)();
    }, 2500);
    (__webpack_require__(40761).init)();
    (__webpack_require__(79702).init)();
    monitor.init();
  });
};
const backgroundReqReady = () => {
  if (G.site === 'tmall' || G.site === 'taobao-95095' || G.site === 'ai-taobao' || G.site === 'taobao') {
    (__webpack_require__(98324).init2)();
    (__webpack_require__(19778).init)();
  }
  if (location.host.indexOf('amazon') > -1 && location.host !== 'www.amazon.cn') {
    (__webpack_require__(23752).ready)();
  }
  (__webpack_require__(80339).ready)();
  if (G.site === "aliexpress") (__webpack_require__(20669).init)();
};
let urltimes = 0;
const listenUrlChange = () => {
  if (urltimes > 99999) return;
  urltimes++;
  let url = location.href;
  let k = setInterval(function () {
    if (url !== location.href || window.extNeedReload) {
      //location.reload();
      window.gwd_G = false;
      window.extNeedReload = false;
      $('.gwd-minibar-bg').remove();
      $('#gwdang_main').remove();
      $('#bjd_bottom_detail').remove();
      $(G.dval).remove();
      url = location.href;
      let fromDevice = G.from_device;
      G = __webpack_require__(53558);
      (__webpack_require__(18793).clear)();
      if (window.gwdActivity) {
        window.gwdActivity = false;
      }
      if (fromDevice === '360server') {
        __webpack_require__(43246);
      } else {
        __webpack_require__(19268);
      }
      (__webpack_require__(92834).init)();
      if (location.host === 'm.fine3q.com') (__webpack_require__(94226).init)();
      (__webpack_require__(86421).getRate)(() => {
        (__webpack_require__(32752).common)(data => {
          if (data && data.result.address.indexOf('北京') > -1) {
            G.forbidGiftMoney = true;
          }
          (__webpack_require__(12826).get)(() => {
            var cnzz = __webpack_require__(5300);
            if (cnzz) cnzz.init(G.gwd_cnzz);
            (__webpack_require__(41672).init)();
          });
        });
      });
      clearInterval(k);
    }
  }, 200);
};
module.exports.init = () => {
  __webpack_require__(5267);
  window.gwdGlobalCondition = __webpack_require__(41761);
  console.log('start from monkey');
  (__webpack_require__(16180).init)();
  if (G.site === '6pm' || G.site === 'amazon' || G.site === 'lining') {
    setTimeout(listenUrlChange, 2000);
  }
  getLocalPermanInfo(data => {
    (__webpack_require__(41761).met)('GwdConfig').then(res => {
      if (res.html) {
        setTimeout(() => {
          const template = __webpack_require__(26133);
          let html = template.compile(res.html, {
            escape: false
          })();
          $('body').append(html);
        }, 0);
      }
    });
    log("page_view:" + G.logsite);
    renderCss(data.style);
    (__webpack_require__(76928).init)();
    let pInfo = G.pageInfo;
    if (pInfo.type === 1) {
      (__webpack_require__(26902).init)();
      (__webpack_require__(82699).init)();
      if (location.host.indexOf('taobao') > -1 || location.host.indexOf('tmall') > -1) {
        (__webpack_require__(76710).init)();
      }
      if (location.host.indexOf('.jd.com') > -1) {
        (__webpack_require__(37272).init)();
      }
      // if (location.host === 'search.jd.com' || location.host === 'list.jd.com') {
      //   require('standard/module/jdSearchEnhance').init()
      // }
      (__webpack_require__(22485).init)();
      (__webpack_require__(26335).init)();
      getPermanInfo(() => {
        __webpack_require__(92786)();
      });
    } else if (pInfo.type === 2) {
      (__webpack_require__(14535).reset)();
      if (G.site === 'taobao' || G.site === 'tmall') {
        (__webpack_require__(1373).init)();
        // require('standard/module/aliMobilePriceNotifier').init()
      }
      if (G.site === '360buy' || G.aliSite) {
        (__webpack_require__(83783).init)();
      }
      renderMainBar(data.style);
      renderModule(data.style);
      (__webpack_require__(82110).init)();
      (__webpack_require__(7053).listenBar)(data.style);
      backgroundReqReady();
      if (location.host === 'www.amazon.com' || location.host === 'www.amazon.co.jp' || G.site === '6pm') (__webpack_require__(71991).init)();
      log('product_page_visit:' + G.logsite);
      (__webpack_require__(41718).init)();
      (__webpack_require__(307).init)();
    }
    (__webpack_require__(85187).init)();
    (__webpack_require__(37796).init)(pInfo.type);
  });
  window.disable_gwd_privacy = function () {
    communicate.trigger({
      type: 'disable_gwd_privacy'
    });
  };
  window.enable_gwd_privacy = function () {
    communicate.trigger({
      type: 'enable_gwd_privacy'
    });
  };
};

/***/ }),

/***/ 41703:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(82562);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("3e991070", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 41859:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ ShaiDanPicTooltipvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ ShaiDanPicTooltip)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanPicTooltip.vue?vue&type=template&id=b19132fc&scoped=true
var ShaiDanPicTooltipvue_type_template_id_b19132fc_scoped_true = __webpack_require__(64966);
;// ./src/standard/module/trend/ShaiDanPicTooltip.vue?vue&type=template&id=b19132fc&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanPicTooltip.vue?vue&type=script&lang=js
var ShaiDanPicTooltipvue_type_script_lang_js = __webpack_require__(33835);
;// ./src/standard/module/trend/ShaiDanPicTooltip.vue?vue&type=script&lang=js
 /* harmony default export */ const trend_ShaiDanPicTooltipvue_type_script_lang_js = (ShaiDanPicTooltipvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanPicTooltip.vue?vue&type=style&index=0&id=b19132fc&prod&scoped=true&lang=less
var ShaiDanPicTooltipvue_type_style_index_0_id_b19132fc_prod_scoped_true_lang_less = __webpack_require__(63478);
;// ./src/standard/module/trend/ShaiDanPicTooltip.vue?vue&type=style&index=0&id=b19132fc&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/trend/ShaiDanPicTooltip.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  trend_ShaiDanPicTooltipvue_type_script_lang_js,
  ShaiDanPicTooltipvue_type_template_id_b19132fc_scoped_true/* render */.XX,
  ShaiDanPicTooltipvue_type_template_id_b19132fc_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "b19132fc",
  null
  
)

/* harmony default export */ const ShaiDanPicTooltip = (component.exports);

/***/ }),

/***/ 42012:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(65169);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("0c2a229e", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 42077:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\n.tip-item-sp3.prifontf[data-v-7b887b5e] {\n  position: relative;\n  top: 1px;\n}\n", ""]);

// exports


/***/ }),

/***/ 42629:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _vuex = __webpack_require__(95353);
var _default = exports.A = {
  computed: (0, _vuex.mapState)({
    checked: state => state.priceRemind.collected,
    id: state => state.priceRemind.instanceId
  })
};

/***/ }),

/***/ 42670:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-sd-img-tooltip gwd-row gwd-align",
    on: {
      mouseenter: _vm.onMouseOver,
      mousemove: _vm.onMouseOver,
      mouseleave: _vm.onMouseLeave
    }
  }, [_c("span", {
    staticClass: "gwd-font11"
  }, [_vm._v("订单截图")]), _vm._v(" "), _c("img", {
    staticStyle: {
      width: "10px",
      height: "10px",
      "margin-left": "-2px"
    },
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/shaidan/arrow@2x.png",
      alt: ""
    }
  }), _vm._v(" "), _vm.over ? _c("ShaiDanPicTooltip", {
    attrs: {
      tipmode: "cursor",
      img: _vm.img,
      x: _vm.x,
      y: _vm.y
    },
    on: {
      mouseover: function ($event) {
        _vm.overTip = true;
      },
      mouseleave: function ($event) {
        _vm.overTip = false;
      }
    }
  }) : _vm._e(), _vm._v(" "), _c("Teleport", {
    attrs: {
      to: "body"
    }
  }, [_vm.over ? _c("ShaiDanPicTooltip", {
    attrs: {
      img: _vm.img,
      x: _vm.x,
      y: _vm.y,
      tipmode: "tooltip"
    },
    on: {
      mouseover: function ($event) {
        _vm.overTip = true;
      },
      mouseleave: function ($event) {
        _vm.overTip = false;
      }
    }
  }) : _vm._e()], 1)], 1);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 42965:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-sd-popup[data-v-b19132fc] {\n  position: fixed;\n  background: rgba(0, 0, 0, 0.5);\n  z-index: 999999;\n  padding: 8px;\n  border-radius: 8px;\n}\n.gwd-cursor[data-v-b19132fc] {\n  background: transparent;\n}\n.gwd-landscape[data-v-b19132fc]::before {\n  content: '';\n  position: absolute;\n  bottom: -28px;\n  left: 50%;\n  transform: translateX(-50%);\n  border: 14px solid transparent;\n  border-top-color: rgba(0, 0, 0, 0.5);\n}\n.gwd-landscape.gwd-cursor[data-v-b19132fc]::before {\n  border-top-color: transparent;\n}\n.gwd-portrait[data-v-b19132fc]::before {\n  content: '';\n  position: absolute;\n  right: -28px;\n  top: 50%;\n  transform: translateY(-50%);\n  border: 14px solid transparent;\n  border-left-color: rgba(0, 0, 0, 0.5);\n}\n.gwd-portrait.gwd-cursor[data-v-b19132fc]::before {\n  border-left-color: transparent;\n}\n", ""]);

// exports


/***/ }),

/***/ 43246:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


//添加基本的参数配置和函数
__webpack_require__(71617);
G.extend({
  crc64: true,
  union: "union_gwdang",
  show_tip: 1,
  show_wishlist: 1,
  show_guess: 1,
  show_mainbar: 1,
  show_promo: 1,
  set_force: false,
  default_style: 'top',
  ut: '&trans=1',
  from_device: '360server',
  extBrand: 'gwd',
  extName: 'gwdang',
  go_union: 'http://u.gwdang.com/union/go',
  p_id: '',
  is_open: 0,
  position: 0,
  style: '',
  notice: 0,
  first: 0,
  fold: 0,
  p_fold: 0,
  pop_share: 1,
  email: '',
  subsite_id: '',
  force: [],
  on_building: true,
  built_counter: 0,
  collectionChanged: true,
  gwd_browser_type: 1,
  gwd_cnzz: location.protocol + '//s11.cnzz.com/z_stat.php?id=1256793290&web_id=1256793290',
  is_site_page: null,
  href: window.location ? window.location.href : '',
  collectInfo: {
    dp_id: "",
    title: "",
    site_id: 0,
    url: "",
    img: "",
    price: "",
    comment: ""
  },
  now_dp_id: '',
  where_buy_dps: '',
  width: document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth : document.body.clientWidth,
  timer: null,
  timer2: null,
  timer3: null,
  timer4: null,
  timer5: null,
  //fix suning
  timer5_mutex: true,
  //mutex
  height: 0,
  scrollTop: 0,
  page_size: 6,
  page_size_mini: 4,
  page_now: {
    b2c: 1,
    taobao: 1,
    tmall: 1,
    also_buy: 1,
    promotion: 1,
    b2c_fuzzy: 1
  },
  page_total: {
    b2c: 1,
    taobao: 1,
    tmall: 1,
    also_buy: 1,
    promotion: 1,
    b2c_fuzzy: 1
  },
  total_num: {
    b2c: 6,
    taobao: 6,
    tmall: 6,
    also_buy: 6,
    promotion: 6,
    b2c_fuzzy: 6
  },
  module_name: ["b2c", "taobao", "tmall", "also_buy", "promotion", "b2c_fuzzy"],
  dpIsBook: false,
  hiddenFavorButton: false,
  save_tbres_data: null,
  save_promo_len: 0,
  save_price_trend_data: null,
  save_promo_data: null,
  topResizeTimer: null,
  bottomResizeTimer: null
});
var ua = navigator.userAgent;
if (ua.indexOf('Firefox') > -1) {
  G.gwd_cnzz = '';
}

/***/ }),

/***/ 43623:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "a[data-v-0650373c]:hover {\n  text-decoration: none !important;\n}\n.gwd-scrollbar[data-v-0650373c] {\n  height: 100%;\n  z-index: 3;\n  position: relative;\n  overscroll-behavior-y: contain;\n  scrollbar-width: thin;\n}\n.gwd-overlay[data-v-0650373c] {\n  overscroll-behavior-y: contain;\n}\n.gwd-overlay .gwd-1688.gwd-app-window[data-v-0650373c] {\n  top: 0;\n}\n.gwd-overlay .gwd-app-window[data-v-0650373c] {\n  padding: 10px;\n  position: absolute;\n  top: 42px;\n  bottom: 0;\n  left: 0;\n  background: #f4f5f5;\n  width: 735px;\n  border-top-right-radius: 8px;\n  border-bottom-right-radius: 8px;\n  box-sizing: border-box;\n  transition: all 0.3s ease-in-out;\n}\n.gwd-overlay .gwd-app-window .gwd-window-close[data-v-0650373c] {\n  position: absolute;\n  top: 0;\n  right: -32px;\n  width: 24px;\n  height: 24px;\n}\n.gwd-overlay .gwd-app-window .gwd-window-close img[data-v-0650373c] {\n  width: 24px;\n  height: 24px;\n}\n.gwd-overlay .gwd-app-window .gwd-window-expand[data-v-0650373c] {\n  position: absolute;\n  right: -18px;\n  width: 36px;\n  height: 36px;\n  top: 50%;\n  background: #f4f5f5;\n  border-radius: 18px;\n  transform: translateY(-50%);\n}\n.gwd-overlay .gwd-app-window .gwd-window-expand img[data-v-0650373c] {\n  transition: all 0.3s ease;\n  width: 16px;\n  height: 16px;\n  transform: rotate(180deg) translate(-5px);\n}\n.gwd-overlay .gwd-app-window .gwd-window-left[data-v-0650373c] {\n  width: 220px;\n  background: white;\n  border-radius: 8px;\n}\n.gwd-overlay .gwd-app-window.gwd-expanded[data-v-0650373c] {\n  width: 1455px;\n}\n@media (max-width: 1440px) {\n.gwd-overlay .gwd-app-window.gwd-expanded[data-v-0650373c] {\n    width: 1210px;\n}\n}\n.gwd-overlay .gwd-app-window.gwd-expanded .gwd-window-expand img[data-v-0650373c] {\n  transform: rotate(0);\n}\n.gwd-overlay-bottom .gwd-app-window[data-v-0650373c] {\n  top: 0;\n  bottom: 60px;\n}\n.gwd-overlay-bottom.gwd-xhs .gwd-app-window[data-v-0650373c] {\n  bottom: 0;\n}\n.gwd-site-select[data-v-0650373c] {\n  width: 180px;\n  height: 40px;\n  line-height: 40px;\n  text-align: left;\n  border-radius: 8px;\n  font-size: 14px;\n  padding-left: 20px;\n  box-sizing: border-box;\n  color: #3c4c54;\n}\n.gwd-site-select.gwd-active[data-v-0650373c] {\n  background: #48bef3;\n  color: white;\n  text-decoration: none;\n  font-weight: bold;\n}\n.gwd-sort[data-v-0650373c] {\n  width: 100%;\n  box-sizing: border-box;\n  align-items: flex-start;\n}\n.gwd-sort span[data-v-0650373c] {\n  color: #999;\n  font-size: 13px;\n}\n.gwd-sort .gwd-sort-item[data-v-0650373c] {\n  display: inline-block;\n  background: white;\n  color: #3c4c54;\n  font-size: 13px;\n  height: 20px;\n  line-height: 20px;\n  padding-left: 8px;\n  padding-right: 8px;\n  border-radius: 10px;\n  margin-top: 23px;\n}\n.gwd-sort .gwd-sort-item.gwd-active[data-v-0650373c],\n.gwd-sort .gwd-sort-item[data-v-0650373c]:hover {\n  background: rgba(72, 190, 243, 0.1);\n  color: #38b4ee;\n  text-decoration: none;\n}\n.gwd-bjg .gwd-sort .gwd-sort-item.gwd-active[data-v-0650373c],\n.gwd-bjg .gwd-sort .gwd-sort-item[data-v-0650373c]:hover {\n  background: rgba(255, 193, 78, 0.1);\n  color: #ef6c00;\n  text-decoration: none;\n}\n.gwd-bjg .gwd-site-select.gwd-active[data-v-0650373c] {\n  background: #ff9706 !important;\n}\n.gwd-bjg .gwd-same-logo[data-v-0650373c] {\n  filter: hue-rotate(190deg) brightness(1);\n}\n.gwd-bjg .gwd-window-right[data-v-0650373c] {\n  background: white;\n  margin-left: 10px;\n  padding-top: 11px;\n  border-radius: 8px;\n  z-index: 9;\n}\n.gwd-bjg.gwd-overlay .gwd-app-window[data-v-0650373c] {\n  width: 741px;\n}\n.gwd-bjg .gwd-app-window.gwd-expanded[data-v-0650373c] {\n  width: 1455px;\n}\nhr[data-v-0650373c] {\n  width: 172px;\n  border-top: 1px solid #e6e9eb;\n  border-bottom: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 43642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ MiniBarCollectionButtonvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ MiniBarCollectionButton)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBarCollectionButton.vue?vue&type=template&id=d3ad16a8&scoped=true
var MiniBarCollectionButtonvue_type_template_id_d3ad16a8_scoped_true = __webpack_require__(6301);
;// ./src/standard/module/components/MiniBarCollectionButton.vue?vue&type=template&id=d3ad16a8&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBarCollectionButton.vue?vue&type=script&lang=js
var MiniBarCollectionButtonvue_type_script_lang_js = __webpack_require__(42629);
;// ./src/standard/module/components/MiniBarCollectionButton.vue?vue&type=script&lang=js
 /* harmony default export */ const components_MiniBarCollectionButtonvue_type_script_lang_js = (MiniBarCollectionButtonvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/MiniBarCollectionButton.vue?vue&type=style&index=0&id=d3ad16a8&prod&scoped=true&lang=less
var MiniBarCollectionButtonvue_type_style_index_0_id_d3ad16a8_prod_scoped_true_lang_less = __webpack_require__(99937);
;// ./src/standard/module/components/MiniBarCollectionButton.vue?vue&type=style&index=0&id=d3ad16a8&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/MiniBarCollectionButton.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_MiniBarCollectionButtonvue_type_script_lang_js,
  MiniBarCollectionButtonvue_type_template_id_d3ad16a8_scoped_true/* render */.XX,
  MiniBarCollectionButtonvue_type_template_id_d3ad16a8_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "d3ad16a8",
  null
  
)

/* harmony default export */ const MiniBarCollectionButton = (component.exports);

/***/ }),

/***/ 44141:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "#gwd_mini_compare[data-v-5aa6bd38] {\n  width: 155px;\n  cursor: default;\n  text-align: center;\n  font-family: 'Microsoft YaHei', Arial, SimSun !important;\n}\n#gwd_mini_compare[data-v-5aa6bd38]:hover {\n  background-color: #edf1f2;\n}\n#gwd_mini_compare.gwd-fake-tr[data-v-5aa6bd38]:hover {\n  background-color: transparent;\n}\n#gwd_mini_compare.bjg[data-v-5aa6bd38] {\n  border-right: 1px solid #e6e9eb;\n}\n.setting-bg[data-v-5aa6bd38] {\n  background: url('https://cdn.gwdang.com/images/extensions/xbt/new_wishlist_pg5_2.png') no-repeat;\n  width: 18px;\n  height: 18px;\n  vertical-align: middle;\n  float: left;\n  margin-right: 8px;\n  margin-top: 0px;\n}\n.mini-compare-icon[data-v-5aa6bd38] {\n  background-position: -93px -134px;\n}\n.minibar-btn-box[data-v-5aa6bd38] {\n  display: inline-flex;\n  align-items: center;\n  margin: 0 auto;\n  float: none;\n  height: 100%;\n}\n.minibar-btn-box *[data-v-5aa6bd38] {\n  float: left;\n}\n.minibar-btn-box span[data-v-5aa6bd38] {\n  color: #404547;\n  font-size: 13px;\n}\n.minibar-btn-box span em[data-v-5aa6bd38] {\n  font-style: normal;\n  line-height: 36px;\n}\n.minibar-btn-box span .price-em[data-v-5aa6bd38] {\n  margin-left: 2px;\n  line-height: 37px;\n  font-weight: normal;\n}\n#gwd_mini_compare_detail[data-v-5aa6bd38] {\n  display: none;\n}\n#gwd_mini_compare:hover #gwd_mini_compare_detail[data-v-5aa6bd38] {\n  display: block;\n}\n", ""]);

// exports


/***/ }),

/***/ 44900:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _Teleport = _interopRequireDefault(__webpack_require__(6527));
var _ShaiDanPicTooltip = _interopRequireDefault(__webpack_require__(41859));
const scrollFunc = _this => {
  if (_this.over) {
    const rect = _this.$el.getBoundingClientRect();
    _this.x = rect.left;
    _this.y = rect.top;
  }
};
var _default = exports.A = {
  components: {
    ShaiDanPicTooltip: _ShaiDanPicTooltip.default,
    Teleport: _Teleport.default
  },
  props: ['img'],
  data() {
    return {
      over: false,
      overTip: false,
      x: 0,
      y: 0
    };
  },
  methods: {
    onMouseOver() {
      this.over = true;
      const rect = this.$el.getBoundingClientRect();
      this.x = rect.left;
      this.y = rect.top;
    },
    onMouseLeave() {
      this.over = false;
    }
  },
  mounted() {
    document.querySelector('.gwd-sd-list').addEventListener('scroll', () => scrollFunc(this));
    window.addEventListener('scroll', () => scrollFunc(this));
  }
};

/***/ }),

/***/ 45077:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ CollectionSettingMini)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingMini.vue?vue&type=template&id=0e3edad3&scoped=true
var CollectionSettingMinivue_type_template_id_0e3edad3_scoped_true = __webpack_require__(72105);
;// ./src/standard/module/components/CollectionSettingMini.vue?vue&type=template&id=0e3edad3&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingMini.vue?vue&type=script&lang=js
var CollectionSettingMinivue_type_script_lang_js = __webpack_require__(82016);
;// ./src/standard/module/components/CollectionSettingMini.vue?vue&type=script&lang=js
 /* harmony default export */ const components_CollectionSettingMinivue_type_script_lang_js = (CollectionSettingMinivue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CollectionSettingMini.vue?vue&type=style&index=0&id=0e3edad3&prod&scoped=true&lang=less
var CollectionSettingMinivue_type_style_index_0_id_0e3edad3_prod_scoped_true_lang_less = __webpack_require__(56815);
;// ./src/standard/module/components/CollectionSettingMini.vue?vue&type=style&index=0&id=0e3edad3&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/CollectionSettingMini.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_CollectionSettingMinivue_type_script_lang_js,
  CollectionSettingMinivue_type_template_id_0e3edad3_scoped_true/* render */.XX,
  CollectionSettingMinivue_type_template_id_0e3edad3_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "0e3edad3",
  null
  
)

/* harmony default export */ const CollectionSettingMini = (component.exports);

/***/ }),

/***/ 45634:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _MemberCouponMixin = _interopRequireDefault(__webpack_require__(81507));
var _MemberCouponQr = _interopRequireDefault(__webpack_require__(46419));
var _default = exports.A = {
  mixins: [_MemberCouponMixin.default],
  components: {
    MemberCouponQr: _MemberCouponQr.default
  },
  data() {
    return {
      G: G
    };
  }
};

/***/ }),

/***/ 46228:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-row[data-v-c322638e] {\n  display: flex;\n  flex-direction: row;\n}\n.gwd-inline-row[data-v-c322638e] {\n  display: inline-flex;\n  flex-direction: row;\n}\n.gwd-column[data-v-c322638e] {\n  display: flex;\n  flex-direction: column;\n}\n.gwd-inline-column[data-v-c322638e] {\n  display: inline-flex;\n  flex-direction: column;\n}\n.gwd-align[data-v-c322638e] {\n  align-content: center;\n  align-items: center;\n}\n.gwd-jcc[data-v-c322638e] {\n  justify-content: center;\n}\n.gwd-jic[data-v-c322638e] {\n  justify-items: center;\n}\n.gwd-button[data-v-c322638e] {\n  outline: none;\n  border: none;\n}\n.bjg-bar-button[data-v-c322638e] {\n  font-size: 0;\n}\n.bjg-hover-bg[data-v-c322638e] {\n  background: #fffbef;\n}\n.bjg-bar-button[data-v-c322638e]:hover {\n  background: #fffbef;\n  cursor: pointer;\n}\n.bjg-bar-button:hover .bjg-window[data-v-c322638e] {\n  display: block;\n}\n.mainbar-fold .bjg-bar-button[data-v-c322638e],\n.mainbar-fold #top_coupon_btn[data-v-c322638e],\n.mainbar-fold .rinfo-btn[data-v-c322638e],\n.mainbar-fold .gwd-bottom-tmall[data-v-c322638e] {\n  display: none!important;\n}\n.gwd-font12[data-v-c322638e] {\n  font-size: 12px;\n}\n.gwd-font14[data-v-c322638e] {\n  font-size: 14px;\n}\n.gwd-red[data-v-c322638e] {\n  color: #ff3532;\n}\n.gwd-red-bg[data-v-c322638e] {\n  background: #ff3532;\n}\n.gwd-hui333[data-v-c322638e] {\n  color: #333333;\n}\n.gwd-hui999[data-v-c322638e] {\n  color: #999999;\n}\n.gwd-font10[data-v-c322638e] {\n  font-size: 12px;\n  transform: scale(0.8333);\n  transform-origin: bottom center;\n}\n.gwd-font11[data-v-c322638e] {\n  font-size: 12px;\n  transform: scale(0.91666);\n  transform-origin: bottom center;\n}\n.gwd-font9[data-v-c322638e] {\n  font-size: 12px;\n  transform: scale(0.75);\n  transform-origin: bottom center;\n}\n.gwd-hoverable[data-v-c322638e]:hover {\n  background: #edf1f2;\n}\n.right-info > *[data-v-c322638e] {\n  border-left: 1px solid #edf1f2;\n}\n.gwd-red-after-visit[data-v-c322638e]:hover {\n  color: #e03024 !important;\n}\n.gwd-button[data-v-c322638e]:hover {\n  filter: brightness(1.1);\n}\n.gwd-button[data-v-c322638e] {\n  padding-top: 1px;\n  padding-bottom: 1px;\n}\n.gwd-button[data-v-c322638e]:active {\n  filter: brightness(0.9);\n}\n.gwd-fadeout-5s[data-v-c322638e] {\n  opacity: 0;\n  transition: opacity 5s;\n}\n.gwd-scrollbar[data-v-c322638e]::-webkit-scrollbar {\n  width: 6px;\n  border-radius: 17px;\n}\n.gwd-scrollbar[data-v-c322638e]::-webkit-scrollbar-thumb {\n  border-radius: 17px;\n  background: #999;\n}\n#gwdang_main[data-v-c322638e],\n.gwdang-main[data-v-c322638e],\n.bjgext-detail[data-v-c322638e] {\n  font-size: 12px;\n}\n#gwdang_main button[data-v-c322638e],\n.gwdang-main button[data-v-c322638e],\n.bjgext-detail button[data-v-c322638e] {\n  text-align: center;\n}\n.gwd-width-100[data-v-c322638e] {\n  width: 100%;\n}\n.gwd-overlay[data-v-c322638e] {\n  font-family: \"Microsoft YaHei\", \"Arial\", \"SimSun\", serif;\n  font-size: 0;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 999999999;\n}\n.gwd-font-pfm[data-v-c322638e] {\n  font-family: 'PingFangSC-Medium';\n  font-weight: normal!important;\n}\n@font-face {\n  font-family: 'PingFangSC-Medium';\n  src: local('PingFangSC-Medium');\n}\n.gwd-font-pfm[data-v-c322638e] {\n  font-family: local('PingFangSC-Medium'), system-ui;\n  font-weight: bold;\n}\n#gwd_minibar svg[data-v-c322638e],\n.gwdang-main svg[data-v-c322638e],\n#bjgext_mb_bg svg[data-v-c322638e],\n#bjgext_mainbar svg[data-v-c322638e] {\n  fill: transparent;\n}\n.gwd-common-font[data-v-c322638e] {\n  font-family: 'PingFang SC', 'Microsoft YaHei', '\\5FAE\\8F6F\\96C5\\9ED1', 'Hiragino Sans GB', 'WenQuanYi Micro Hei';\n}\n.gwd-price-input[data-v-c322638e] {\n  border: 1px solid #48befe;\n  background: white;\n  height: 30px;\n  line-height: 30px;\n  color: #48befe;\n  font-size: 16px;\n  border-radius: 4px;\n  margin-left: 8px;\n  margin-right: 8px;\n  overflow: hidden;\n}\n.gwd-price-input span[data-v-c322638e] {\n  margin-left: 8px;\n  margin-right: 4px;\n  flex-grow: 0;\n  flex-shrink: 0;\n}\n.gwd-price-input input[data-v-c322638e] {\n  outline: none;\n  border: none;\n  flex: 1;\n  resize: none;\n  color: #48befe;\n  font-size: 16px;\n  margin-right: 5px;\n  flex-basis: 100%;\n  min-width: 0;\n  box-shadow: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 46364:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TipCenter)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=template&id=6fda7d74&scoped=true
var TipCentervue_type_template_id_6fda7d74_scoped_true = __webpack_require__(69759);
;// ./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=template&id=6fda7d74&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=script&lang=js
var TipCentervue_type_script_lang_js = __webpack_require__(64943);
;// ./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=script&lang=js
 /* harmony default export */ const ImgSame_TipCentervue_type_script_lang_js = (TipCentervue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=style&index=0&id=6fda7d74&prod&scoped=true&lang=css
var TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css = __webpack_require__(94842);
var TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=style&index=0&id=6fda7d74&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const ImgSame_TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css = ((TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css_default()) && (TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css_default()).locals ? (TipCentervue_type_style_index_0_id_6fda7d74_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/ImgSame/TipCenter.vue?vue&type=style&index=0&id=6fda7d74&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/ImgSame/TipCenter.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  ImgSame_TipCentervue_type_script_lang_js,
  TipCentervue_type_template_id_6fda7d74_scoped_true/* render */.XX,
  TipCentervue_type_template_id_6fda7d74_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "6fda7d74",
  null
  
)

/* harmony default export */ const TipCenter = (component.exports);

/***/ }),

/***/ 46430:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ GwdPriceProtectMiddle)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/GwdPriceProtectMiddle.vue?vue&type=template&id=2bd1d232&scoped=true
var GwdPriceProtectMiddlevue_type_template_id_2bd1d232_scoped_true = __webpack_require__(82690);
;// ./src/standard/module/components/GwdPriceProtectMiddle.vue?vue&type=template&id=2bd1d232&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/GwdPriceProtectMiddle.vue?vue&type=script&lang=js
var GwdPriceProtectMiddlevue_type_script_lang_js = __webpack_require__(40452);
;// ./src/standard/module/components/GwdPriceProtectMiddle.vue?vue&type=script&lang=js
 /* harmony default export */ const components_GwdPriceProtectMiddlevue_type_script_lang_js = (GwdPriceProtectMiddlevue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/GwdPriceProtectMiddle.vue?vue&type=style&index=0&id=2bd1d232&prod&scoped=true&lang=less
var GwdPriceProtectMiddlevue_type_style_index_0_id_2bd1d232_prod_scoped_true_lang_less = __webpack_require__(61154);
;// ./src/standard/module/components/GwdPriceProtectMiddle.vue?vue&type=style&index=0&id=2bd1d232&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/GwdPriceProtectMiddle.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_GwdPriceProtectMiddlevue_type_script_lang_js,
  GwdPriceProtectMiddlevue_type_template_id_2bd1d232_scoped_true/* render */.XX,
  GwdPriceProtectMiddlevue_type_template_id_2bd1d232_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "2bd1d232",
  null
  
)

/* harmony default export */ const GwdPriceProtectMiddle = (component.exports);

/***/ }),

/***/ 47053:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-stamp-bg gwd-row gwd-align"
  }, [_c("div", {
    staticClass: "gwd-text"
  }, [_vm._v("再送"), _c("br"), _vm._v(_vm._s(_vm.value) + "元红包")])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 48073:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\ndiv.shareExt[data-v-43260888] {\n  display: inline-block;\n  position: relative;\n  /* border-left: none!important; */\n}\n.shareExt .btn-tab-sp em[data-v-43260888] {\n  height: 22px;\n  width: 22px;\n  margin-top: 7px !important;\n  background: url(\"https://cdn.gwdang.com/images/extensions/newbar/sshareext.png\") 0px 0px no-repeat;\n}\n.shareExt:hover .share-detail[data-v-43260888] {\n  display: block;\n}\n.share-detail[data-v-43260888] {\n  width: 300px;\n  /*height:184px;*/\n  height: auto !important;\n  /* left: -47px; */\n  right: -81px;\n  top: 36px;\n  background-color: #fff;\n  border: 1px solid rgba(237, 241, 242, 1);\n  box-shadow: 0px 1px 6px 0px rgba(135, 135, 135, 0.49);\n}\n.share-sp1[data-v-43260888] {\n  float: left;\n  margin-top: 16px;\n  margin-left: 16px;\n  margin-right: 19px;\n  /*height: 20px;*/\n  /*width: 168px;*/\n  line-height: 20px;\n  color: #48BEFE;\n  font-size: 16px;\n}\n.share-sp2[data-v-43260888] {\n  /*float: left;*/\n  display: block;\n  margin-left: 16px;\n  margin-top: 16px;\n  margin-right: 19px;\n  /*width:192px;*/\n  font-size: 12px;\n  line-height: 16px;\n  color: #333333;\n  word-break: break-all;\n}\n.share-sp2 a[data-v-43260888] {\n  text-decoration: underline;\n  color: #333333;\n}\n.share-sp2 a[data-v-43260888]:hover {\n  color: #48befe;\n}\n.share-sp3[data-v-43260888] {\n  width: 116px;\n  height: 34px;\n  background: rgba(72, 190, 254, 1);\n  border-radius: 2px;\n  margin-top: 20px;\n  /*margin-left: 75px;*/\n  font-size: 12px;\n  color: #fff;\n  text-align: center;\n  line-height: 34px;\n  font-weight: bold;\n  cursor: pointer;\n  display: inline-block;\n}\n.gwd-share-title[data-v-43260888] {\n  display: -webkit-box;\n  text-overflow: ellipsis;\n  -webkit-line-clamp: 2;\n  overflow: hidden;\n  -webkit-box-orient: vertical;\n}\n#copy-input[data-v-43260888] {\n  position: fixed;\n  bottom: -1px;\n  right: -1px;\n  float: left;\n  opacity: 0;\n  width: 10px;\n  height: 10px;\n}\n#copy-btn.copyss[data-v-43260888] {\n  background-color: #2FCE98;\n}\n", ""]);

// exports


/***/ }),

/***/ 48836:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "#gwdang-trend:hover {\n  background: #edf1f2;\n}\n#gwdang-trend:hover #gwdang-trend-detail {\n  display: block;\n}\n.gwdang-tab .top-bar-detail {\n  display: none!important;\n}\n.gwdang-tab:hover .top-bar-detail {\n  display: flex!important;\n}\n", ""]);

// exports


/***/ }),

/***/ 49042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(3362);
const getCoupon = __webpack_require__(80791);
const globalCondition = __webpack_require__(41761);
let globalData = {
  tmall: [],
  taobao: []
};
let minPriceObj = {};
let minPriceStatus = {};
let sizeObj = {},
  totalObj = {};
const renderCoupon = (data, type, isBottom) => {
  sizeObj[type]++;
  if (data && data.data && data.data.coupon.coupon_limit !== '1') globalData[type].push(data.data);
  if (sizeObj[type] === totalObj[type]) {
    if (isBottom) {
      renderProdutBt(type, isBottom);
    } else {
      renderProdut(type);
    }
    if (G.aliSite) {
      // 如果是淘宝天猫，当前商品没有优惠券，需要吧比价结果里面有优惠券的商品在中间展示
      // 元旦红包时暂停显示
      // if (new Date() < new Date('2020-01-10T23:59:59')) {
      //   return
      // }
      if (G.runminiCoup === '1') {
        (__webpack_require__(62941).init)(globalData, '.gwd-minibar-bg');
      } else if (!G.runminiCoup) {
        G.runminiCoupon2 = true;
        $(document).on('runminiCoupon2', function () {
          (__webpack_require__(62941).init)(globalData, '.gwd-minibar-bg');
        });
      }
    }
  }
};
const renderProdutBt = (type, bdata) => {
  // 渲染底部优惠券
  let arr = globalData[type];
  for (let i = 0; i < bdata.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (bdata[i] && arr[j] && bdata[i].num_iid == arr[j].reqid) {
        let lastP = (Number(bdata[i].price) - arr[j].coupon.coupon_money).toFixed(2);
        if (Number(lastP) < 0) continue;
        if (Number(lastP) < minPriceObj[type] && lastP > 0) {
          minPriceObj[type] = lastP;
          minPriceStatus[type] = true;
        }
        let coupon_money = arr[j].coupon.coupon_money;
        bdata[i].url = arr[j].click_url2;
        bdata[i].tspan = `<span class="coupon_span">领${coupon_money}元券</span>`;
        bdata[i].ta = `<div class="coupon_price">
                    <span class="coupon_price_span">
                      <span class="cou-pri-sp1">券后价:</span>
                      <span class="cou-pri-sp2 prifontf">¥${lastP}</span>
                      <span class="cou-pri-sp3 prifontf">¥${bdata[i].price}</span>
                    </span>
            </div>`;
        break;
      }
    }
  }
  if (minPriceStatus[type]) {
    if (type === 'taobao') {
      $('.compare-list li[data-id="tbcompare"] .com-item-pri').text('¥' + minPriceObj[type]);
    } else {
      $('.compare-list li[data-id="tmcompare"] .com-item-pri').text('¥' + minPriceObj[type]);
    }
  }
  globalCondition.setMet('bottomCouponReady-' + (type === 'taobao' ? 'tbcompare' : 'tmcompare'));
};
const renderProdut = type => {
  // 渲染顶部优惠券
  let ul = $(`#${type}-item-list li`);
  let len = ul.length;
  let arr = globalData[type];
  for (let i = 0; i < len; i++) {
    let id = ul.eq(i).attr('data-id');
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] && arr[j].reqid == id) {
        if (ul.eq(i).find('.coupon_span').length) {
          console.warn('skipping coupon', ul.eq(i));
          return;
        }
        ul.eq(i).find('.small-img').append($(`<span class="coupon_span">领${arr[j].coupon.coupon_money}元券</span>`));
        ul.eq(i).find('a').attr('href', arr[j].click_url2);
        ul.eq(i).find('a').on('click', e => {
          e.preventDefault();
          let adzone_id = '10003';
          if (G.aliSite) adzone_id = '10004';
          getCoupon.init(id, adzone_id, data => {
            window.open(data.data.click_url2);
          });
        });
        let price = ul.eq(i).find('span.gwd-price').text();
        let lastP = (Number(price.replace(/[¥￥]/g, '')) - arr[j].coupon.coupon_money).toFixed(2);
        if (Number(lastP) < 0) continue;
        if (Number(lastP) < minPriceObj[type]) {
          minPriceObj[type] = lastP;
          minPriceStatus[type] = true;
        }
        ul.eq(i).find('.gwd-price').after($(`<div class="coupon_price">
              <span class="cou-pri-sp1">券后价:</span>
              <span class="cou-pri-sp2 prifontf">¥${lastP}</span>
              <span class="cou-pri-sp3 prifontf">${price}</span>
            </div>`)).remove();
      }
    }
  }
  if (minPriceStatus[type]) {
    if (type == 'taobao') {
      $('#tb_compare .tab-sp2').text('¥' + minPriceObj[type]);
    } else {
      $('#tm_compare .tab-sp2').text('¥' + minPriceObj[type]);
    }
  }
};

// 比价结果部分的优惠券
module.exports.init = async (data, type, isBottom, minpri, direct = false) => {
  // forbidCoupon entry部分给的值  可能会针对特定地区屏蔽
  window.gwd_G.aliCouponNotNeedFix = true;
  if (G.forbidCoupon) return;
  if (!data) return;
  if (!data.length) return;
  minPriceObj[type] = minpri;
  totalObj[type] = data.length;
  sizeObj[type] = 0;
  if (isBottom) isBottom = data;
  let f2 = function (newData) {
    renderCoupon(newData, type, isBottom);
  };
  let adzone_id = '10003';
  if (G.aliSite) adzone_id = '10004';
  G.arrToCheck = data.map(x => x.num_iid);
  $('#tb_compare').hover(function () {
    globalCondition.setMet('aliCouponAllowed');
  });
  $('#tm_compare').hover(function () {
    globalCondition.setMet('aliCouponAllowed');
  });
  $('.compare-box').hover(function () {
    globalCondition.setMet('aliCouponAllowed');
  });
  $('.compare-list li[data-id="tbcompare"]').hover(function () {
    globalCondition.setMet('aliCouponAllowed');
  });
  $('.compare-list li[data-id="tmcompare"]').hover(function () {
    globalCondition.setMet('aliCouponAllowed');
  });
  await globalCondition.met('aliCouponAllowed');
  for (let i = 0; i < data.length; i++) {
    getCoupon.init(data[i].num_iid, adzone_id, f2, direct);
  }
};

/***/ }),

/***/ 49122:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44141);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("05f95d05", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 49906:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43623);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("23dca33e", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 50627:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\n#gwd_mini_compare_detail[data-v-5aa6bd38] {\n  position: absolute;\n  margin: 0px 0 12px 0px;\n  height: auto;\n  width: 278px;\n  top: 36px;\n  left: 50%;\n  margin-left: -139px;\n  background-color: #fff;\n  display: none;\n  z-index: 9999999;\n  border: 1px solid #edf1f2;\n  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.11);\n  /* z-index: 999; */\n}\n#gwd_mini_compare_detail li[data-v-5aa6bd38]:hover {\n  background-color: #edf1f1;\n}\n#gwd_mini_compare_detail li[data-v-5aa6bd38] {\n  height: 40px;\n}\n#gwd_mini_compare_detail li *[data-v-5aa6bd38] {\n  float: left;\n}\n#gwd_mini_compare_detail li a[data-v-5aa6bd38] {\n  display: inline-block;\n  height: 39px;\n  width: 248px;\n  border-bottom: 1px solid #edf1f1;\n  margin-left: 15px;\n}\n#gwd_mini_compare_detail li img[data-v-5aa6bd38] {\n  width: 16px;\n  margin-top: 12px;\n  margin-right: 14px;\n}\n#gwd_mini_compare_detail li .m-item-sitename[data-v-5aa6bd38] {\n  width: 113px;\n  margin-right: 6px;\n  line-height: 40px;\n  height: 40px;\n  font-size: 14px;\n  color: #404547;\n  text-align: left;\n  overflow: hidden;\n}\n#gwd_mini_compare_detail li .m-item-price[data-v-5aa6bd38] {\n  color: #E4393C;\n  font-size: 14px;\n  float: right;\n  line-height: 40px;\n  font-weight: bold;\n}\n#gwd_mini_compare_detail .m-all-link[data-v-5aa6bd38] {\n  color: #969899;\n  text-decoration: none!important;\n  float: right;\n  height: 12px;\n  line-height: 12px;\n  margin-right: 15px;\n  margin-top: 15px;\n  margin-bottom: 15px;\n  font-size: 12px;\n}\n#gwd_mini_compare_detail .m-all-link[data-v-5aa6bd38]:hover {\n  color: #48beff!important;\n}\n.bjg-hover-bg[data-v-5aa6bd38] {\n  background: #fffbef;\n}\n", ""]);

// exports


/***/ }),

/***/ 50883:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ MiniProgramQRTip)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MiniProgramQRTip.vue?vue&type=template&id=59b6b710&scoped=true
var MiniProgramQRTipvue_type_template_id_59b6b710_scoped_true = __webpack_require__(98503);
;// ./src/bjgou/components/MiniProgramQRTip.vue?vue&type=template&id=59b6b710&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MiniProgramQRTip.vue?vue&type=script&lang=js
var MiniProgramQRTipvue_type_script_lang_js = __webpack_require__(59389);
;// ./src/bjgou/components/MiniProgramQRTip.vue?vue&type=script&lang=js
 /* harmony default export */ const components_MiniProgramQRTipvue_type_script_lang_js = (MiniProgramQRTipvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MiniProgramQRTip.vue?vue&type=style&index=0&id=59b6b710&prod&scoped=true&lang=less
var MiniProgramQRTipvue_type_style_index_0_id_59b6b710_prod_scoped_true_lang_less = __webpack_require__(37757);
;// ./src/bjgou/components/MiniProgramQRTip.vue?vue&type=style&index=0&id=59b6b710&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/bjgou/components/MiniProgramQRTip.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_MiniProgramQRTipvue_type_script_lang_js,
  MiniProgramQRTipvue_type_template_id_59b6b710_scoped_true/* render */.XX,
  MiniProgramQRTipvue_type_template_id_59b6b710_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "59b6b710",
  null
  
)

/* harmony default export */ const MiniProgramQRTip = (component.exports);

/***/ }),

/***/ 50921:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39102);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("24592db5", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 51332:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(3362);
const template = __webpack_require__(26133);
const userData = __webpack_require__(74222);
let sitePattern = {
  '京东': {
    site_id: 3,
    pattern: "http://search.jd.com/Search?enc=utf-8&keyword="
  },
  '亚马逊': {
    site_id: 1,
    pattern: "http://www.amazon.cn/s?field-keywords="
  },
  '当当': {
    site_id: 2,
    pattern: "http://search.dangdang.com/?key="
  },
  '苏宁': {
    site_id: 25,
    pattern: "http://search.suning.com/emall/search.do?keyword="
  },
  '淘宝': {
    site_id: 83,
    pattern: "http://s.taobao.com/search?q="
  },
  '国美': {
    site_id: 28,
    pattern: "http://www.gome.com.cn/search?question="
  },
  '一号店': {
    site_id: 31,
    pattern: "http://search.yhd.com/s2/c0-0/k"
  },
  '唯品会': {
    site_id: 129,
    pattern: `https://category.vip.com/suggest.php?keyword=`
  },
  '购物党': {
    'pattern': `https://www.${G.extName}.com/search?from=ext&s_product=`,
    'site_id': 0
  }
};
const replaceUrl = name => {
  let url = '';
  let searchApi = sitePattern[name].pattern;
  let site_id = sitePattern[name].site_id;
  let inputtxt = $('.search-input.blkcolor3').val();
  if (name === '购物党' || name === '唯品会' || name === '苏宁') {
    url = searchApi + encodeURIComponent(inputtxt);
  } else if (name === '当当') {
    url = searchApi + encodeURIComponent(inputtxt) + '&act=input';
  } else {
    url = `${G.u_server2}/union/go/?s_product=${encodeURIComponent(inputtxt)}&target_url=${encodeURIComponent(searchApi + encodeURI(inputtxt))}&site_id=${site_id}`;
  }
  window.open(url);
  //$('.search-submit').attr('href', url)
  //return url;
};
const addEvent = () => {
  let time, show;
  $('.search-tle').on('click', function () {
    if (show) {
      $('.bjd-search-list').hide();
      $('.search-tle em').removeClass('emup');
      $('.search-tle').removeClass('search-select');
      show = false;
    } else {
      show = true;
      $('.bjd-search-list').show();
      $('.search-tle').addClass('search-select');
      $('.search-tle em').addClass('emup');
    }
  });
  $('.bjd-search-list').on('click', function (e) {
    if (e.target.nodeName === 'SPAN') {
      let txt = $(e.target).text();
      let dom = $('.search-tle span');
      let txtold = dom.text();
      dom.text(txt);
      $('.bjd-search-list').hide().append($(`<span>${txtold}</span>`));
      $('.search-tle').removeClass('search-select');
      $('.search-tle em').removeClass('emup');
      show = false;
      $(e.target).remove();
    }
  });
  $('.search-tle, .bjd-search-list').on('mouseenter', function () {
    clearTimeout(time);
  }).on('mouseleave', function () {
    time = setTimeout(function () {
      show = false;
      $('.bjd-search-list').hide();
      $('.search-tle em').removeClass('emup');
      $('.search-tle').removeClass('search-select');
    }, 300);
  });
  $('.search-submit').on('click', function (e) {
    let txt = $('.search-tle span').text();
    replaceUrl(txt);
    e.preventDefault();
    // setTimeout(function() {
    //   $('.search-submit').attr('href', null)
    // }, 200)
  });
  $('.search-tle').on('mouseenter', function () {
    clearTimeout(time);
  });
};
const renderBottom = data => {
  let style = userData.get('permanent').style;
  let keyword = data.exact_arr.keywords.replace(/,/g, ' ');
  if (data.exact_arr.brand && data['code-server'].code) keyword = data.exact_arr.brand + ' ' + data['code-server'].code + ' ' + (data['code-server'].spec || '');
  if (data.exact_arr.isbn) keyword = data.exact_arr.isbn;
  let site_k = '淘宝',
    site_k2 = '唯品会';
  // if (G.site === 'vipshop') {
  //   keyword = data.now.coreword;
  //   site_k = '唯品会'
  //   site_k2 = '淘宝';
  // }

  let html = __webpack_require__(78686);
  if (style === 'top') html = __webpack_require__(45046);
  $('.search-mod').append(template.compile(html)({
    keyword: keyword,
    site_k: site_k,
    site_k2: site_k2
  })).addClass('hasSearch');
  addEvent();
  if (style === 'top') {
    (__webpack_require__(7053).autoFixWidth)();
  }
  function appendCss(cssStr) {
    let s2 = document.createElement('STYLE');
    s2.innerHTML = cssStr;
    document.body.appendChild(s2);
  }
  if (location.href.indexOf('taobao.com') > -1 || location.href.indexOf('tmall.') > -1) {
    $('.bjd-search-list span').toArray().forEach(item => {
      if (item.innerHTML.indexOf('购物党') > -1) {
        $(item).remove();
      }
    });
    appendCss('.bjd-search-list { height: 140px }');
  }
};
module.exports.init = data => {
  // if ($(window).width() < 1150) {
  //   $('.search-mod').hide()
  //   return;
  // }
  renderBottom(data);
};

/***/ }),

/***/ 51366:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".bjg-mini-program-qr[data-v-59b6b710] {\n  width: 136px;\n  height: 100%;\n  position: absolute;\n  right: 0;\n  top: 0;\n  border-left: 1px solid #f3f6f8;\n}\n.bjg-mini-program-qr .bjg-line[data-v-59b6b710] {\n  width: 10px;\n  height: 1px;\n  background: #fcda57;\n  margin-left: 4px;\n  margin-right: 4px;\n}\n", ""]);

// exports


/***/ }),

/***/ 51373:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20228);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("d67349ea", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 51390:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TbScrollLink)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/TbScrollLink.vue?vue&type=template&id=50ed28b8&scoped=true
var TbScrollLinkvue_type_template_id_50ed28b8_scoped_true = __webpack_require__(79902);
;// ./src/standard/module/components/TbScrollLink.vue?vue&type=template&id=50ed28b8&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/TbScrollLink.vue?vue&type=script&lang=js
var TbScrollLinkvue_type_script_lang_js = __webpack_require__(98356);
;// ./src/standard/module/components/TbScrollLink.vue?vue&type=script&lang=js
 /* harmony default export */ const components_TbScrollLinkvue_type_script_lang_js = (TbScrollLinkvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/TbScrollLink.vue?vue&type=style&index=0&id=50ed28b8&prod&scoped=true&lang=less
var TbScrollLinkvue_type_style_index_0_id_50ed28b8_prod_scoped_true_lang_less = __webpack_require__(7384);
;// ./src/standard/module/components/TbScrollLink.vue?vue&type=style&index=0&id=50ed28b8&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/TbScrollLink.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_TbScrollLinkvue_type_script_lang_js,
  TbScrollLinkvue_type_template_id_50ed28b8_scoped_true/* render */.XX,
  TbScrollLinkvue_type_template_id_50ed28b8_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "50ed28b8",
  null
  
)

/* harmony default export */ const TbScrollLink = (component.exports);

/***/ }),

/***/ 53558:
/***/ ((module) => {

"use strict";


// 保存原始值到私有变量
let _userLogin = false;
module.exports = {
  modules: {},
  version: 1765264848308,
  mv3: true,
  sideBarAvailable: true,
  browser: {},
  // debug: /gwdebug/.test(window ? window.location.href: ''),
  extend: function (obj) {
    for (var i in obj) {
      if (i === 'userLogin') {
        // 对 userLogin 使用 setter
        this.userLogin = obj[i];
      } else {
        this[i] = obj[i];
      }
    }
  },
  // 为 userLogin 定义 getter 和 setter
  get userLogin() {
    return _userLogin;
  },
  set userLogin(value) {
    // console.log('拦截到对 userLogin 的修改:', value);
    // 这里可以添加其他逻辑
    _userLogin = value;
  }
};

/***/ }),

/***/ 54208:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-login-box[data-v-40244662] {\n  width: 453px;\n  height: 390px;\n  border-radius: 16px 16px 16px 16px;\n  border: 1px solid #E6E9EB;\n  margin-top: 64px;\n  margin-bottom: 120px;\n}\n.gwd-login-box .gwd-login-btn[data-v-40244662] {\n  width: 365px;\n  height: 42px;\n  background: #FF4449;\n  border-radius: 8px 8px 8px 8px;\n  cursor: pointer;\n  margin-top: 22px;\n  color: #fff;\n  font-size: 14px;\n  border: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 55326:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const template = __webpack_require__(26133);
let log = __webpack_require__(35743);
let cnzz = __webpack_require__(5300);
const globalCondition = __webpack_require__(41761);
const request = __webpack_require__(49388);
module.exports.init = () => {
  render();
};
let link = "";
let dpId = '';
const getLink = () => {
  let payload = {
    dp_id: dpId
  };
  if (G.dp.price) {
    payload.price = G.dp.price;
  }
  $.post(`${G.server}/extension/ShareUrl`, payload).then(res => {
    res = JSON.parse(res);
    if (res.code) {
      link = res.link;
      $('.shareExt').remove();
      render();
    }
  });
};
const render = async () => {
  let priceInfo = '',
    priceInfoCopy = '';
  await globalCondition.met('GwdPriceTrendLoaded');
  dpId = await globalCondition.met(`GwdDpIdGot`);
  if (G.dp.storeInfo && G.dp.storeInfo.length) {
    let store = G.dp.storeInfo[0];
    let current = parseFloat(store.all_line[store.all_line.length - 1]);
    if (!current) {
      current = parseFloat(store.current_price);
    }
    let p = store.all_line.filter(x => x !== current);
    let last = current;
    if (p.length) {
      last = p[p.length - 1];
    }
    //let last = store.last_price / 100;
    let priceTrend = '价格平稳';
    if (current < last) {
      priceTrend = '价格下降';
      if (current === store.lowest) {
        priceTrend = '历史最低';
      }
    } else if (current > last) {
      priceTrend = '价格上涨';
    }
    if (last === current) {
      last = 0;
    }
    let lowestStr = store.lowest ? `，历史最低价￥${store.lowest}` : '';
    let oriStr = last ? ` 原价￥${last}` : '';
    priceInfo = `${priceTrend}${oriStr}，现价￥${parseFloat(current)}${lowestStr}`;
    priceInfoCopy = `${priceTrend}${oriStr}，现价￥${parseFloat(current)}${lowestStr}`;
  }
  const Share = (__webpack_require__(3912)/* ["default"] */ .A);
  const opt = {
    title: G.dp.name.replace(/ /g, '').replace(/\n/g, ''),
    priceInfo: priceInfo,
    priceInfoCopy: priceInfoCopy,
    link: link
  };
  const el = document.createElement('DIV');
  $(el).insertBefore('.gwd-topbar-right .top-bar-setting');
  new Vue({
    el: el,
    render: h => h(Share, {
      props: opt
    })
  });
  addEvent();
};
const addEvent = () => {
  let isshow;
  $('.shareExt').on('mouseenter', () => {
    if (!isshow) {
      isshow = true;
      log("share-ext-show");
      cnzz.log("share-ext-show");
    }
    if (link === '') {
      getLink();
    }
  });
  $('.shareExt').on('mouseleave', () => {
    $('#copy-btn').removeClass('copyss').text('复制去分享');
  });
  $('#copy-btn').on('click', function () {
    var element = $('#copy-input')[0];
    element.select();
    element.setSelectionRange(0, element.value.length);
    window.selectedText = element.value;
    var t = window.document.execCommand("copy");
    if (t) {
      $('#copy-btn').addClass('copyss').text("复制成功！");
      log("share-ext-copy");
      cnzz.log("share-ext-copy");
    }
  });
};

/***/ }),

/***/ 56004:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-epic-bar-container[data-v-acea5bbc] {\n  position: relative;\n  z-index: 2;\n  margin-top: -10px;\n  height: 45px;\n  justify-content: flex-end;\n}\n.gwd-epic-bar-container .gwd-epic-price[data-v-acea5bbc] {\n  width: 262px;\n  height: 32px;\n  background: #007feb;\n  border-radius: 3px;\n  color: white;\n  justify-content: center;\n  margin-right: 32px;\n  position: relative;\n  font-size: 12px;\n  cursor: pointer;\n}\n.gwd-epic-bar-container .gwd-epic-price .gwd-price-trend-panel[data-v-acea5bbc] {\n  position: absolute;\n  width: 400px;\n  height: 260px;\n  background: #1E1E1E;\n  box-shadow: 0px 4px 9px 0px #030303;\n  border-radius: 2px 0px 0px 2px;\n  overflow: hidden;\n  top: 32px;\n  right: 0;\n  z-index: 3;\n  display: none;\n}\n.gwd-epic-bar-container .gwd-epic-price[data-v-acea5bbc]:hover {\n  background: #1e94f8;\n}\n.gwd-epic-bar-container .gwd-epic-price:hover .gwd-price-trend-panel[data-v-acea5bbc] {\n  z-index: 3;\n  display: block;\n}\n.gwd-epic-bar-container .gwd-top-price[data-v-acea5bbc] {\n  margin-top: 18px;\n  justify-content: center;\n  position: relative;\n  z-index: 3;\n}\n.gwd-epic-bar-container .gwd-top-price .gwd-price-text[data-v-acea5bbc] {\n  display: inline-block;\n  min-width: 88px;\n  height: 26px;\n  margin-left: 18px;\n  margin-right: 18px;\n  text-align: center;\n  border-width: 1px;\n  border-style: solid;\n  line-height: 24px;\n}\n.ttip-discount[data-v-acea5bbc] {\n  background: #000000;\n  color: #aaaaaa;\n  width: 110px;\n  height: 52px;\n}\n", ""]);

// exports


/***/ }),

/***/ 56283:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ ShaiDanPicvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ ShaiDanPic)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanPic.vue?vue&type=template&id=ef176d54&scoped=true
var ShaiDanPicvue_type_template_id_ef176d54_scoped_true = __webpack_require__(42670);
;// ./src/standard/module/trend/ShaiDanPic.vue?vue&type=template&id=ef176d54&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanPic.vue?vue&type=script&lang=js
var ShaiDanPicvue_type_script_lang_js = __webpack_require__(44900);
;// ./src/standard/module/trend/ShaiDanPic.vue?vue&type=script&lang=js
 /* harmony default export */ const trend_ShaiDanPicvue_type_script_lang_js = (ShaiDanPicvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDanPic.vue?vue&type=style&index=0&id=ef176d54&prod&scoped=true&lang=less
var ShaiDanPicvue_type_style_index_0_id_ef176d54_prod_scoped_true_lang_less = __webpack_require__(32546);
;// ./src/standard/module/trend/ShaiDanPic.vue?vue&type=style&index=0&id=ef176d54&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/trend/ShaiDanPic.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  trend_ShaiDanPicvue_type_script_lang_js,
  ShaiDanPicvue_type_template_id_ef176d54_scoped_true/* render */.XX,
  ShaiDanPicvue_type_template_id_ef176d54_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "ef176d54",
  null
  
)

/* harmony default export */ const ShaiDanPic = (component.exports);

/***/ }),

/***/ 56815:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26418);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("50626acc", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 56857:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _CouponLinkMixin = _interopRequireDefault(__webpack_require__(10276));
var _default = exports.A = {
  mixins: [_CouponLinkMixin.default]
};

/***/ }),

/***/ 57031:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const html = __webpack_require__(55182);
const template = __webpack_require__(26133);
const miniFavor = __webpack_require__(23107);
const request = __webpack_require__(49388);
const userData = __webpack_require__(74222);
const globalCondition = __webpack_require__(41761);
let globalFavor = {};
let isRender, firstRender;
let QRrendered;
const addLoginBeforeEvent = () => {
  $('#login-remind p').css('color', '#E4393C');
};
const settingRemind = (type, email) => {
  let setting_type = type;
  let setting_email = email || '';
  let url = `${G.c_server}/api/remind_setting?action=set&email=${G.email}&setting_type=${setting_type}&remind_email=${setting_email}`;
  request.get(url);
};
const addRemindEvent = () => {
  let qrcodeShow;
  // $('#favor_box .bar-jiangjia-re .select-item').off('click', addLoginBeforeEvent)
  $('.remindHint').hide();
  $('#favor_box .bar-jiangjia-re .select-item').on('click', function () {
    $(this).parent().parent().find('.select-item').removeClass('selected');
    $(this).addClass('selected');
    if ($(this).hasClass('qrcode-item')) {
      $('#remind_qrcode_img').show();
    } else if ($(this).hasClass('email-item')) {
      $('#remind_qrcode_img').hide();
    }
  });
  $('#bar_subbtn').on('click', function () {
    let ischoosed = $('#favor_box').hasClass('favor_choosed');
    let dom = $('#favor_box .jj-remind .select-item.selected');
    let notify_site = dom.attr('data-type');
    let price = dom.parent().find('input').val();
    const hasDot = price.split('.').length > 1;
    if (!/^[\d\.]+$/.test(price) || price < 0 || hasDot && price.split('.')[1].length > 2 || isNaN(parseFloat(price))) {
      $('.error_remind').text('请输入正确格式的价格').show().fadeOut(2000);
      return;
    }
    if (price > allowedMinPrice) {
      $('.error_remind').text('价格不能高于当前商品价格').show().fadeOut(2000);
      return;
    }
    if (!price || price === '0' || price.match(/[a-zA-Z]/)) {
      $('.error_remind').text('请输入商品期望价格').show().fadeOut(2000);
      return;
    }
    if (!ischoosed) {
      let remind_email;
      let remind_type = $('#favor_box .jj-style .select-item.selected').attr('data-type');
      if (remind_type === '1') {
        remind_email = $('#favor_box .jj-style .re-mail').val();
      }
      settingRemind(remind_type, remind_email);
      $('#favor_box').addClass('favor_choosed');
      $('#edit_remind_style, #remind_qrcode').show();
    }

    /*notify_site => 0 全网 1 当前网站*/
    // $(`#${G.extName}-trend-detail`).hide()
    $('#remind_qrcode_img').hide();
    qrcodeShow = false;
    miniFavor.add_favor(notify_site, price);
  });
  $('#remind_qrcode').on('click', () => {
    QRrendered = $('#remind_qrcode_img img').attr('src');
    if (!qrcodeShow) {
      if (!QRrendered) {
        getQRcode(() => {
          $('#remind_qrcode_img').show();
          qrcodeShow = true;
        });
      } else {
        $('#remind_qrcode_img').show();
        qrcodeShow = true;
      }
    } else {
      $('#remind_qrcode_img').hide();
      qrcodeShow = false;
    }
  });
  $('#edit_remind_style').on('click', () => {
    $('#favor_box').removeClass('favor_choosed');
    $('#edit_remind_style').hide();
  });
};
module.exports.loginRenderTop = () => {
  $('#login-remind').hide();
  addRemindEvent();
};
const addEvent = () => {
  $('#login-remind .go_login_btn').on('click', () => {
    // $('#login-remind p').css('color', '#9b9b9b')
    // $('#login-remind').hide()
    // $('.login-content').show().animate({
    //   right: '0px'
    // }, 500)
    let url = encodeURIComponent(location.href);
    location.href = `https://www.gwdang.com/user/login?ext=1&from_url=${url}`;
  });
  $('body').on('gwd-login-complete', e => {
    G.userLogin = true;
    addRemindEvent();
  });
  $('#loginClickBtnBar').on('click', () => {
    let userN = $('#barusername').val();
    let psd = $('#barpassword').val();
    if (userN && psd) {
      miniFavor.userLogin(userN, psd, function () {
        addRemindEvent();
      });
    } else {
      $('#login_remind_tle, #login_remind_tle_bar').css('display', 'block').fadeOut(5000);
    }
  });
  $('#favor_box').on('mouseenter', function () {
    getQRcode();
  });
  $('#log_back_btn').on('click', function () {
    $('#login-remind').show();
    $('.login-content').animate({
      right: '-292px'
    }, 500, function () {
      $('.login-content').hide();
    });
  });
};
const getQRcode = async (callback, force = false) => {
  await globalCondition.met('userLoginChecked');
  if (QRrendered) {
    $('#remind_qrcode_img img').attr('src', QRrendered);
    $('.qrcode-jj img').attr('src', QRrendered);
    $('.sk-qrcode img').attr('src', QRrendered);
  }
  if ((QRrendered || !G.userLogin) && !force) return;
  let url = `https://www.gwdang.com/collect/get_qrcode/`;
  if (G.qrApi && G.qrApi !== 'default') {
    url = G.qrApi;
  }
  request.rawGet(url, true).then(function (data) {
    QRrendered = data.img_url;
    $('#remind_qrcode_img img').attr('src', data.img_url);
    $('.qrcode-jj img').attr('src', data.img_url);
    $('.sk-qrcode img').attr('src', data.img_url);
    if (callback) {
      callback();
    }
    $('#remind_qrcode').show();
  });
};
module.exports.getQRcode = getQRcode;
let allowedMinPrice = 0;

// 渲染登录下的降价提醒
const renderTop2 = msg => {
  let oinfo = userData.get('other_info');
  if (!oinfo) return;
  let dp_query = userData.get('dp_query');
  let choosed, remind_type, lowestUrl;
  let now = oinfo.now;
  if (!now.dp_id && now.url_crc && now.site_id) {
    now.dp_id = now.url_crc + '-' + now.site_id;
  }
  if (!now.dp_id) return;
  let url = encodeURIComponent(location.href);
  let nowprice = oinfo['code-server'] && oinfo['code-server'].price || G.dp.price;
  allowedMinPrice = nowprice;
  if (G.aliSite) nowprice = G.dp.price;
  if (!allowedMinPrice) {
    allowedMinPrice = globalFavor['nowprice'];
  }
  let allprice = dp_query && dp_query.b2c.min_price || nowprice;
  nowprice = Number(nowprice.toString().replace(',', ''));
  allprice = Number(allprice.toString().replace(',', ''));
  if (dp_query && dp_query.b2c.product && dp_query.b2c.product.length !== 0) {
    lowestUrl = dp_query.b2c.product[0].url;
  }
  if (G.aliSite) {
    lowestUrl = 'javascript:';
  }
  if (msg.has_remind_type) {
    choosed = true;
  }
  if (msg.is_collected) {
    globalFavor.is_collected = msg.is_collected;
    if (parseInt(msg.notify_site) === 1) nowprice = msg.remind_price;else allprice = msg.remind_price;
  }
  nowprice = nowprice || globalFavor['nowprice'];
  allprice = allprice || nowprice;
  globalFavor.notify_site = msg.notify_site;
  remind_type = msg.remind_type || '0';
  let imgHost = G.imgHost;
  if (G.from_device === 'firefox') {
    imgHost = G.localImg;
  }
  let riyuan = "";
  if (location.host === 'www.amazon.co.jp') {
    riyuan = "日元";
  }
  let views = template.compile(html)({
    choosed: choosed,
    islogin: true,
    email: '',
    emailvalue: '',
    url: url,
    aliSite: G.aliSite,
    imgHost: imgHost,
    lowestUrl: lowestUrl,
    notify_site: globalFavor.notify_site,
    nowprice: nowprice,
    allprice: allprice,
    remind_type: remind_type,
    extName: G.extName,
    money: globalFavor['money'],
    riyuan: riyuan,
    lastprice: Number(globalFavor['nowprice']).toFixed(2),
    price_range: globalFavor['price_range']
  });
  if (globalFavor.notify_site === undefined) {
    setTimeout(() => {
      $('.remind-item-snd .select-item').addClass('selected');
    }, 1000);
  }
  $('#favor_box').remove();
  $(globalFavor['dom']).append(views);
  addRemindEvent();
};

// 未登录
const renderTop = async (dom, money) => {
  (__webpack_require__(7129).log)('login remind render top');
  await (__webpack_require__(41761).met)('dp_query_set');
  $('#favor_box').remove();
  let lowestUrl;
  let dp_query = userData.get('dp_query');
  if (dp_query && dp_query.b2c.product) {
    lowestUrl = dp_query.b2c.product[0].url;
  }
  let allprice = dp_query && dp_query.b2c.min_price;
  if (!allprice && dp_query && dp_query.b2c && dp_query.b2c.store) {
    allprice = Math.min.apply(null, dp_query.b2c.store.map(store => {
      return Math.min.apply(null, store.product.map(x => parseFloat(x.price)));
    }));
  }
  let nowprice = await (__webpack_require__(41761).met)('NowPrice');
  if (!allprice) {
    allprice = nowprice;
  }
  allprice = parseFloat(allprice);
  let imgHost = G.imgHost;
  if (G.from_device === 'firefox') {
    imgHost = G.localImg;
  }
  let riyuan = "";
  if (location.host === 'www.amazon.co.jp') {
    riyuan = "日元";
  }
  let url = encodeURIComponent(location.href);
  let view = template.compile(html)({
    email: G.email,
    emailvalue: '',
    lowestUrl: lowestUrl,
    notify_site: '0',
    nowprice: globalFavor['nowprice'],
    allprice: allprice,
    remind_type: '0',
    url: url,
    imgHost: imgHost,
    extName: G.extName,
    money: money,
    riyuan: riyuan,
    aliSite: G.aliSite,
    lastprice: Number(globalFavor['nowprice']).toFixed(2),
    price_range: globalFavor['price_range']
  });
  $(dom).append(view);
  const CommonLogin = (__webpack_require__(36664)["default"]);
  new Vue({
    el: '#gwd-login-remind',
    render: h => h(CommonLogin, {
      props: {
        position: 'gwd-remind',
        showAlterLogin: true,
        alterLoginPosition: 'row'
      }
    })
  });
  addEvent();
  $('#favor_box .bar-jiangjia-re .select-item').on('click', addLoginBeforeEvent);
};
const renderAgain = () => {
  if (!firstRender) return;
  //if (isRender) return;
  isRender = true;
  $('#favor_box').remove();
  // 加载之前需要获取到提醒方式
  (__webpack_require__(23107).getRemindStyle)(renderTop2);
};
module.exports.init = (dom, money, info) => {
  firstRender = true;
  if (!info.store) {
    return;
  }
  globalFavor['nowprice'] = Number(info['store'][0].current_price);
  let price_ranges = info['store'][0].price_range.split('-');
  globalFavor['price_range'] = Number(price_ranges[0]).toFixed(2) + ' ~ ' + Number(price_ranges[1]).toFixed(2);
  globalFavor['dom'] = dom;
  globalFavor['money'] = money;
  if (G.userLogin) {
    // 如果已经登录，让用户触发加载，因为需要请求网站接口
    $(document).on('renderAgain', function () {
      renderAgain();
    });
  } else {
    // if ($('#favor_box').length) {
    //   renderAgain()
    // } else {
    //   renderTop(dom, money)
    // }
    renderTop(dom, money);
  }
};
module.exports.renderAgain = renderAgain;

/***/ }),

/***/ 57422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24403);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("302a2324", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 57478:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-stamp-bg[data-v-2701b8ba] {\n  background: url(https://cdn.gwdang.com/images/extensions/middle-stamp@2x.png) no-repeat;\n  background-size: contain;\n  width: 112px;\n  height: 38px;\n  justify-content: center;\n}\n.gwd-stamp-bg .gwd-text[data-v-2701b8ba] {\n  font-size: 12px;\n  color: #f53867;\n  line-height: 14px;\n  transform: rotate(-17deg);\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),

/***/ 57652:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.mW = exports.Ts = void 0;
__webpack_require__(3362);
var _CollectionSettingTop = _interopRequireDefault(__webpack_require__(9765));
const MiniBarCollectionButton = (__webpack_require__(43642)["default"]);
const CollectionSettingMini = (__webpack_require__(45077)/* ["default"] */ .A);
const init = async () => {
  const store = (__webpack_require__(92771).getStore)();
  // new Vue({
  //   el: '#gwd_mini_remind .minibar-btn-box',
  //   store,
  //   render: h => h(MiniBarCollectionButton)
  // })

  const instanceId = G.instanceId;
  (__webpack_require__(7129).log)('collection setting start with instance id', instanceId);
  (__webpack_require__(30888).waitForConditionFn)(() => $('.gwd-collection-mini-content').length && G.instanceId === instanceId).then(() => {
    (__webpack_require__(7129).log)('collection setting mini render', instanceId);
    new Vue({
      el: '.gwd-collection-mini-content',
      store,
      render: h => h(CollectionSettingMini, {
        props: {
          haitao: (__webpack_require__(49339).isHaitao)()
        }
      })
    });
  });
  (__webpack_require__(30888).waitForConditionFn)(() => $('.gwd-collection-trend-content').length && G.instanceId === instanceId).then(() => {
    (__webpack_require__(7129).log)('collection setting top render', instanceId);
    new Vue({
      el: '.gwd-collection-trend-content',
      store,
      render: h => h(_CollectionSettingTop.default, {
        props: {
          haitao: (__webpack_require__(49339).isHaitao)()
        }
      })
    });
    store.dispatch('priceRemind/init');
    $('#gwdang-trend').hover(() => {
      store.dispatch('priceRemind/hover');
    });
    (__webpack_require__(30888).waitForConditionFn)(() => $('#gwd_mini_remind').length).then(() => {
      $('#gwd_mini_remind').hover(() => {
        store.dispatch('priceRemind/hover');
      });
    });
  });
};
exports.Ts = init;
const setPriceData = (money, data) => {
  const store = (__webpack_require__(92771).getStore)();
  let price_ranges = data['store'][0].price_range.split('-');
  store.commit('priceTrend/setState', {
    money: money,
    nowPrice: Number(data['store'][0].current_price),
    priceRange: Number(price_ranges[0]).toFixed(2) + ' ~ ' + Number(price_ranges[1]).toFixed(2)
  });
};
exports.mW = setPriceData;

/***/ }),

/***/ 58998:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71401);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("1af64a78", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 59235:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(82082);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("7f83bb1a", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 59286:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_0_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35203);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_0_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_viewerWindow_vue_vue_type_style_index_0_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ 59389:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {};

/***/ }),

/***/ 60103:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
var __WEBPACK_AMD_DEFINE_RESULT__;

/*
 * 从底部版移植过来的底部版的天猫淘宝,原来的chrome_old没有独立的顶部版的天猫淘宝模块
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  var $ = __webpack_require__(10333);
  let request = __webpack_require__(49388);
  var specialFilter = __webpack_require__(22480);
  let showTaobaoProducts = __webpack_require__(20879);
  return {
    /**
     * taobao 比价模块
     * 目前仅包括底部版样式
     * @author:mllong(mllong0925@gmail.com)
     * @since:2013-10-22
     * @version:1.0.0
     */
    //初始化，根据数据的类型确定展示什么样式
    init: function (data, style) {
      if (G.saveTbResData != null) {
        this.renderTaobaoUI(G.saveTbResData);
        return;
      }
      var code_server = '1';
      var code = data['code-server'];
      var msg = data.exact_arr;
      var price = data.now.price * 100;
      if (!price) {
        price = G.dp.price * 100;
      }
      if (!code) {
        code = {};
        code_server = '0';
      }
      var sitearr = ['amazon', '6pm', 'ebay'];
      if (sitearr.indexOf(G.site) > -1) {
        price = G.dp.price * 100;
      }
      /*日亚 美亚 德亚 在没有品牌的情况下  不请求淘宝客*/
      if (G.site == 'amazon' && !msg.brand && data.now.site_id !== '1') return;
      var url = `${G.server}/brwext/tbres?union=${G.union}&url=${encodeURIComponent(msg.url)}&site=${msg.site}&isbn=${msg.isbn}&keywords=${encodeURIComponent(msg.keywords)}&brand=${encodeURIComponent(msg.brand)}&type=${encodeURIComponent(msg.type)}&price=${price}&class_id=${msg.class_id}&name=${encodeURIComponent(G.dp.name)}&code_brand_id=${code.brand_id}&code_clean_title=${encodeURIComponent(code.clean_title)}&code_code=${code.code}&code_display_brand=${encodeURIComponent(code.display_brand)}&code_brand=${encodeURIComponent(code.brand)}&code_class_id=${encodeURIComponent(code.class_id)}&code_price=${encodeURIComponent(code.price)}&code_spec=${encodeURIComponent(code.spec)}&code-server=${code_server}`;
      request.get(url).done(mm => {
        if (G.site == 'taobao' || G.site == 'tmall') {
          showTaobaoProducts.getUniqPid(mm, mm => {
            G.saveTbResData = mm;
            // $this.renderTaobaoUI(mm);
            (__webpack_require__(35161).renderBt)(mm);
          });
        } else {
          showTaobaoProducts.getImgSearch(mm, mm => {
            G.saveTbResData = mm;
            // $this.renderTaobaoUI(mm);
            (__webpack_require__(35161).renderBt)(mm);
          });
        }
      });
    },
    //渲染请求淘宝接口后的界面
    renderTaobaoUI: function (mm) {
      var $this = this;
      var perPageMaxNumber = G.getFixedShowProductNum();
      $this.showBottomView("tmall", mm);
      $this.showBottomView("taobao", mm);
      G.setPageArgs(`${G.extBrand}-compare-tmall`, perPageMaxNumber);
      G.setPageArgs(`${G.extBrand}-compare-taobao`, perPageMaxNumber);
      $this.setBottomViewOffset();
      //重新适应宽度
      G.autoFixWidth();
      if (mm.search.keywords == '' && G.dp.isbn != '') {
        $(`.${G.extBrand}-search-input`).val(G.dp.isbn);
      }
      if (mm.search.keywords != ``) {
        $(`.${G.extBrand}-search-input`).val(mm.search.keywords);
      }
      if (G.site === 'vipshop') {
        $(`.${G.extBrand}-search-input`).val(G.dp.cat_name);
      }
      $(window).bind("reDrawTaobaoBanner", function () {
        var perPageMaxNumber = G.getFixedShowProductNum();
        $this.showBottomView("tmall", mm);
        $this.showBottomView("taobao", mm);
        G.setPageArgs(`${G.extBrand}-compare-tmall`, perPageMaxNumber);
        G.setPageArgs(`${G.extBrand}-compare-taobao`, perPageMaxNumber);
        $this.setBottomViewOffset();
      });

      //淘宝天猫异步加载太慢，有可能还没加载出来，所以再这里再屏蔽一次
      if (G.p_fold == 1) {
        $(`.${G.extBrand}-close-module`).hide();
      }
    },
    showBottomView: function (subsite, data) {
      var perPageMaxNumber = G.getFixedShowProductNum();
      var site_name = "";
      if (subsite == 'tmall') {
        site_name = '天猫商城';
      } else if (subsite == 'taobao') {
        site_name = '淘宝网';
      }
      if (data.site) {
        site_name = "同类热卖";
      }
      if (data[subsite] && data[subsite].min_price) {
        if (data[subsite].product.length > 0) {
          var store = specialFilter.tb(data[subsite]);
          if (store instanceof Array) return;
          if (store.product.length === 0) return;
          var dp = store.product[0];
          var len = parseInt(store.product.length);
          var pages = len % perPageMaxNumber == 0 ? parseInt(len / perPageMaxNumber) : parseInt(len / perPageMaxNumber) + 1;
          var li = $('<li>');
          li.append($('<span>', {
            'class': `${G.extBrand}-compare-item`,
            'href': dp.url,
            'target': "_blank"
          }).append($('<p>', {
            'style': "height:10px;display:none;",
            'class': `${G.extBrand}-iszwf`
          }).html('&nbsp')).append($('<p>', {
            'class': `${G.extBrand}-price`
          }).html("&yen;" + store.min_price + (store.max_price != store.min_price ? "~" + store.max_price : ""))).append($('<p>', {
            'class': `${G.extBrand}-store`
          }).text(site_name)).append($('<p>', {
            'style': "height:10px;display:none;",
            'class': `${G.extBrand}-iszwf`
          }).html('&nbsp')));
          var detail = $('<div>', {
            'class': `${G.extBrand}-compare-item-detail re-${G.extBrand}-compare-item-detail ${G.extBrand}-compare-item-detail-fixed`,
            'style': 'display:none;'
          });
          detail.append($('<p>', {
            'class': `${G.extBrand}-compare-item-detail-title ${G.extBrand}-height-auto ${G.extBrand}-compare-item-detail-title-fixed`
          }).append($('<span>', {
            'class': `${G.extBrand}-compare-item-detail-title-desc`
          }).text(site_name + '：不同卖家运费不同')));
          var itemList = $('<ul>', {
            'class': `${G.extBrand}-item-list`
          });
          for (var k = 0; k < len; k++) {
            var item = store.product[k];
            itemList.append($('<li>', {
              'class': `${G.extBrand}-list-item ` + (k % perPageMaxNumber == perPageMaxNumber - 1 || k == len - 1 ? `${G.extBrand}-last` : ""),
              'style': "display: " + (k >= perPageMaxNumber ? "none" : "block")
            }).append($('<a>', {
              'class': `${G.extBrand}-pic`,
              'href': item.url,
              'target': "_blank"
            }).append($('<img>', {
              'src': G.s_server + "/images/dp_default.jpg",
              'data-original': item.pic_url,
              'title': item.title
            }))).append($('<a>', {
              'class': `${G.extBrand}-product-title`,
              'href': item.url,
              'target': "_blank",
              'title': item.title
            }).text(item.title)).append($('<a>', {
              'class': `${G.extBrand}-price`,
              'href': item.url,
              'target': "_blank"
            }).html('&yen;' + item.price)));
          }
          var tb_tm_PageView = $('<div>', {
            'class': `${G.extBrand}-tb-tm-PageView ${G.extBrand}-b2c-PageView-fixed`
          });
          tb_tm_PageView.append($('<p>', {
            'class': `${G.extBrand}-compare-item-detail-title`,
            'style': 'height:auto;'
          }).append($('<span>', {
            'style': 'float:none;padding-left:10px;',
            'class': `${G.extBrand}-compare-item-detail-pages`
          }).append($('<em>', {
            'id': 'page-now-' + subsite,
            'class': 'page-now'
          }).text('1')).append('/').append($('<em>', {
            'id': 'page-total-' + subsite,
            'class': 'page-total'
          }).text('1'))));
          detail.append($("<div>", {
            'class': `${G.extBrand}-compare-prev-page ${G.extBrand}-left`
          }).append($('<div>', {
            'class': `${G.extBrand}-bg page-arrow`
          }))).append(itemList).append($("<div>", {
            'class': `${G.extBrand}-compare-next-page ${G.extBrand}-right`
          }).append($('<div>', {
            'class': `${G.extBrand}-bg page-arrow`
          }))).append(tb_tm_PageView);
          li.append(detail);
          $(`#${G.extBrand}-compare-` + subsite).html("").append(li);
          if (pages == 1) {
            li.find(`.${G.extBrand}-compare-prev-page`).hide();
            li.find(`.${G.extBrand}-compare-next-page`).hide();
            li.find(`.${G.extBrand}-b2c-PageView-fixed`).hide();
            li.attr("pages", 1);
            li.attr("len", len);
            var bannerWidth = len * 200;
            li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css(`width`, bannerWidth + 2);
          } else {
            //contains border
            li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css(`width`, G.width - 2);
          }
          $(`#page-total-` + subsite).text(pages);
        }
        $(`#${G.extBrand}-compare-` + subsite).css("display", "block");
      }

      //添加 noreferrer
      $(`#${G.extBrand}-compare-tmall,#${G.extBrand}-compare-taobao`).each(function () {
        $(this).find(`a.${G.extBrand}-compare-item,a.${G.extBrand}-pic,a.${G.extBrand}-product-title,a.${G.extBrand}-price`).each(function () {
          $(this).attr('rel', 'noreferrer').attr('href', $(this).attr('href') + G.ut);
        });
      });
    },
    setBottomViewOffset: function () {
      $(`#${G.extBrand}-compare-tmall li,#${G.extBrand}-compare-taobao li`).each(function () {
        var menu_li = $(this);
        if (menu_li.attr("pages") == '1') {
          //尽量根据菜单的位置居中，实在不能居中的，就靠右
          var menu_li_left = menu_li.offset().left;
          var menu_li_width = menu_li.width();
          var bannerWidth = parseInt(menu_li.attr("len")) * 200;
          var target_left = menu_li_left - (bannerWidth / 2 - menu_li_width / 2);
          if (target_left < 0) {
            target_left = 0;
          }
          var remainWidth = G.width - target_left;
          if (G.IE6) {
            target_left = menu_li_width / 2 - bannerWidth / 2;
            if (target_left + menu_li_left < 0) {
              target_left = -menu_li_left;
            }
            menu_li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css(`position`, `absolute`).css('left', target_left);
            menu_li.find(`.${G.extBrand}-compare-item-detail-title-fixed`).css('left', 0);
          } else {
            if (bannerWidth < remainWidth) {
              menu_li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css('left', target_left);
              menu_li.find(`.${G.extBrand}-compare-item-detail-title-fixed`).css('left', target_left);
            } else {
              menu_li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css('left', G.width - bannerWidth);
              menu_li.find(`.${G.extBrand}-compare-item-detail-title-fixed`).css('left', G.width - bannerWidth);
            }
          }
        } else {
          //非ie版本的压根不需要调整，这里的ie6版本需要进行调整。
          if (G.IE6) {
            var menu_li_left = menu_li.offset().left;
            var target_left = 0 - menu_li_left;
            menu_li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css(`position`, `absolute`).css('left', target_left);
            menu_li.find(`.${G.extBrand}-compare-item-detail-title-fixed`).css('left', 0);
          }
        }
      });
    }
  };
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 60721:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _viewerWindow_vue_vue_type_template_id_40244662_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22932);
/* harmony import */ var _viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1365);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _viewerWindow_vue_vue_type_style_index_0_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59286);
/* harmony import */ var _viewerWindow_vue_vue_type_style_index_1_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(37953);
/* harmony import */ var _viewerWindow_vue_vue_type_style_index_2_id_40244662_prod_scoped_true_lang_less__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20408);
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(14486);



;




/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A)(
  _viewerWindow_vue_vue_type_script_lang_ts__WEBPACK_IMPORTED_MODULE_1__["default"],
  _viewerWindow_vue_vue_type_template_id_40244662_scoped_true__WEBPACK_IMPORTED_MODULE_0__/* .render */ .XX,
  _viewerWindow_vue_vue_type_template_id_40244662_scoped_true__WEBPACK_IMPORTED_MODULE_0__/* .staticRenderFns */ .Yp,
  false,
  null,
  "40244662",
  null
  
)

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ 60877:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-row[data-v-549382c4] {\n  display: flex;\n  flex-direction: row;\n}\n.gwd-inline-row[data-v-549382c4] {\n  display: inline-flex;\n  flex-direction: row;\n}\n.gwd-column[data-v-549382c4] {\n  display: flex;\n  flex-direction: column;\n}\n.gwd-inline-column[data-v-549382c4] {\n  display: inline-flex;\n  flex-direction: column;\n}\n.gwd-align[data-v-549382c4] {\n  align-content: center;\n  align-items: center;\n}\n.gwd-jcc[data-v-549382c4] {\n  justify-content: center;\n}\n.gwd-jic[data-v-549382c4] {\n  justify-items: center;\n}\n.gwd-button[data-v-549382c4] {\n  outline: none;\n  border: none;\n}\n.bjg-bar-button[data-v-549382c4] {\n  font-size: 0;\n}\n.bjg-hover-bg[data-v-549382c4] {\n  background: #fffbef;\n}\n.bjg-bar-button[data-v-549382c4]:hover {\n  background: #fffbef;\n  cursor: pointer;\n}\n.bjg-bar-button:hover .bjg-window[data-v-549382c4] {\n  display: block;\n}\n.mainbar-fold .bjg-bar-button[data-v-549382c4],\n.mainbar-fold #top_coupon_btn[data-v-549382c4],\n.mainbar-fold .rinfo-btn[data-v-549382c4],\n.mainbar-fold .gwd-bottom-tmall[data-v-549382c4] {\n  display: none!important;\n}\n.gwd-font12[data-v-549382c4] {\n  font-size: 12px;\n}\n.gwd-font14[data-v-549382c4] {\n  font-size: 14px;\n}\n.gwd-red[data-v-549382c4] {\n  color: #ff3532;\n}\n.gwd-red-bg[data-v-549382c4] {\n  background: #ff3532;\n}\n.gwd-hui333[data-v-549382c4] {\n  color: #333333;\n}\n.gwd-hui999[data-v-549382c4] {\n  color: #999999;\n}\n.gwd-font10[data-v-549382c4] {\n  font-size: 12px;\n  transform: scale(0.8333);\n  transform-origin: bottom center;\n}\n.gwd-font11[data-v-549382c4] {\n  font-size: 12px;\n  transform: scale(0.91666);\n  transform-origin: bottom center;\n}\n.gwd-font9[data-v-549382c4] {\n  font-size: 12px;\n  transform: scale(0.75);\n  transform-origin: bottom center;\n}\n.gwd-hoverable[data-v-549382c4]:hover {\n  background: #edf1f2;\n}\n.right-info > *[data-v-549382c4] {\n  border-left: 1px solid #edf1f2;\n}\n.gwd-red-after-visit[data-v-549382c4]:hover {\n  color: #e03024 !important;\n}\n.gwd-button[data-v-549382c4]:hover {\n  filter: brightness(1.1);\n}\n.gwd-button[data-v-549382c4] {\n  padding-top: 1px;\n  padding-bottom: 1px;\n}\n.gwd-button[data-v-549382c4]:active {\n  filter: brightness(0.9);\n}\n.gwd-fadeout-5s[data-v-549382c4] {\n  opacity: 0;\n  transition: opacity 5s;\n}\n.gwd-scrollbar[data-v-549382c4]::-webkit-scrollbar {\n  width: 6px;\n  border-radius: 17px;\n}\n.gwd-scrollbar[data-v-549382c4]::-webkit-scrollbar-thumb {\n  border-radius: 17px;\n  background: #999;\n}\n#gwdang_main[data-v-549382c4],\n.gwdang-main[data-v-549382c4],\n.bjgext-detail[data-v-549382c4] {\n  font-size: 12px;\n}\n#gwdang_main button[data-v-549382c4],\n.gwdang-main button[data-v-549382c4],\n.bjgext-detail button[data-v-549382c4] {\n  text-align: center;\n}\n.gwd-width-100[data-v-549382c4] {\n  width: 100%;\n}\n.gwd-overlay[data-v-549382c4] {\n  font-family: \"Microsoft YaHei\", \"Arial\", \"SimSun\", serif;\n  font-size: 0;\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 999999999;\n}\n.gwd-font-pfm[data-v-549382c4] {\n  font-family: 'PingFangSC-Medium';\n  font-weight: normal!important;\n}\n@font-face {\n  font-family: 'PingFangSC-Medium';\n  src: local('PingFangSC-Medium');\n}\n.gwd-font-pfm[data-v-549382c4] {\n  font-family: local('PingFangSC-Medium'), system-ui;\n  font-weight: bold;\n}\n#gwd_minibar svg[data-v-549382c4],\n.gwdang-main svg[data-v-549382c4],\n#bjgext_mb_bg svg[data-v-549382c4],\n#bjgext_mainbar svg[data-v-549382c4] {\n  fill: transparent;\n}\n.gwd-common-font[data-v-549382c4] {\n  font-family: 'PingFang SC', 'Microsoft YaHei', '\\5FAE\\8F6F\\96C5\\9ED1', 'Hiragino Sans GB', 'WenQuanYi Micro Hei';\n}\n.gwd-btn-submit[data-v-549382c4] {\n  border: none;\n  outline: none;\n  background: #48befe;\n  width: 128px;\n  height: 32px;\n  font-size: 14px;\n  color: white;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.gwd-btn-del[data-v-549382c4] {\n  width: 60px;\n  height: 20px;\n  border-radius: 2px 2px 2px 2px;\n  opacity: 1;\n  border: 1px solid #E6E9EB;\n  color: #404547;\n  background: white;\n  position: relative;\n  box-sizing: border-box;\n}\n.gwd-btn-del[data-v-549382c4]:hover {\n  filter: brightness(1.05);\n  cursor: pointer;\n}\n.gwd-btn-del[data-v-549382c4]::before {\n  content: '';\n  position: absolute;\n  top: -1px;\n  left: -1px;\n  right: -1px;\n  bottom: -1px;\n  z-index: -1;\n  background: #e6e9eb;\n}\n.gwd-collection-detail[data-v-549382c4] {\n  font-family: 'Microsoft Yahei', tahoma, arial, 'Hiragino Sans GB', sans-serif;\n}\n.gwd-collection-detail .gwd-vline[data-v-549382c4] {\n  width: 0;\n  height: 197px;\n  border-right: 1px dashed #e6e9eb;\n  margin-left: 13px;\n  margin-right: 15px;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option[data-v-549382c4] {\n  height: 24px;\n  white-space: nowrap;\n  position: relative;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option span[data-v-549382c4] {\n  color: #404547;\n  font-size: 13px;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option span.gwd-currency[data-v-549382c4] {\n  color: #48befe;\n  font-size: 16px;\n  position: absolute;\n  left: 82px;\n  top: 13px;\n  transform: translateY(-50%);\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option .gwd-remind-current[data-v-549382c4] {\n  margin-left: 8px;\n  width: 57px;\n}\n.gwd-remind-error-text[data-v-549382c4] {\n  color: #d80001;\n  position: absolute;\n  bottom: 61px;\n  left: 0;\n  right: 0;\n  text-align: center;\n}\n.gwd-remind-hint-text[data-v-549382c4] {\n  color: #48befe;\n  position: absolute;\n  bottom: 61px;\n  left: 0;\n  right: 0;\n  text-align: center;\n}\n.gwd-red-price[data-v-549382c4] {\n  color: #d80001;\n}\n.gwd-collection-comp[data-v-549382c4] {\n  border-left: 1px solid #e6e9eb;\n}\n.gwd-collection-detail[data-v-549382c4] {\n  width: 300px;\n  position: relative;\n}\n.gwd-collection-detail .gwd-container[data-v-549382c4] {\n  border-radius: 4px;\n  background: #f8fcfe;\n  padding: 8px;\n  box-sizing: border-box;\n}\n.gwd-collection-detail .gwd-container .gwd-remind-option span.gwd-currency[data-v-549382c4] {\n  left: 82px;\n}\n.gwd-collection-detail.gwd-ht[data-v-549382c4] {\n  width: 335px;\n}\n", ""]);

// exports


/***/ }),

/***/ 61154:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(77707);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("a34428ba", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 61765:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-shaidan[data-v-1ba131f5] {\n  border-radius: 4px 4px 4px 4px;\n  border: 1px solid #E6E9EB;\n  margin-top: 6px;\n  margin-bottom: 6px;\n}\n.gwd-shaidan .gwd-header[data-v-1ba131f5] {\n  height: 38px;\n  background: linear-gradient(to top, #FFFFFF 0%, #F9F9F9 100%);\n  border-bottom: 1px solid #E6E9EB;\n}\n.gwd-shaidan .gwd-sd-list[data-v-1ba131f5] {\n  overflow-y: auto;\n}\n.gwd-shaidan.gwd-has-top[data-v-1ba131f5] {\n  margin-top: 58px;\n}\n", ""]);

// exports


/***/ }),

/***/ 63357:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['value', 'currency'],
  methods: {
    numberInputHandler(e) {
      if (!e.key.match(/[\d.]/)) {
        e.preventDefault();
        return;
      }
      let start = e.target.selectionStart,
        end = e.target.selectionEnd;
      (__webpack_require__(7129).log)(e.target.selectionStart);
      let num = e.target.value.toString();
      if (num.indexOf('.') > -1) {
        let after = num.split('.')[1];
        let before = num.split('.')[0];
        (__webpack_require__(7129).log)(e.target.selectionText);
        if (e.key === '.' || after.length >= 2 && start >= before.length + 1 && end === start) {
          e.preventDefault();
        }
      }
    }
  }
};

/***/ }),

/***/ 63368:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(23792);
__webpack_require__(3362);
__webpack_require__(62953);
const template = __webpack_require__(26133);
const userData = __webpack_require__(74222);
const golbal2 = __webpack_require__(7053);
const calWidth = __webpack_require__(42869);
var fuzzyPage;

// let rateSite = {
//   '228': 'USD',
//   '229': 'JPY',
//   '238': 'USD',
//   '246': 'EUR'
// }
// let priceSite = {
//   '228': '$',
//   '238': '$',
//   '229': '日元',
//   '246': 'EUR'
// }
let globalInfo = {};

// const fixedPrice = (price) => {
//   if (!price) return price;
//   try {
//     let priarr = price.split('.');
//     price = priarr[0].replace(',', '');
//     if (Number(price) > 99999) {
//       price = priarr[0];
//     } else {
//       price = priarr[0] + '.' + priarr[1];
//     }
//   } catch (e) {
//     require('common/log')('b2cCompare:fixedPrice:error')
//     return price;
//   }

//   return price;
// }
// const transRate = (dp) => {
//   if (dp.price_rmb) return dp;
//   let parseprice = require('parseprice');
//   if (!dp.dp_id) return dp;
//   let site_id = dp.dp_id.split('-')[1];
//   let type = site_id && rateSite[site_id];
//   if (!type) return dp;
//   let price2 = parseprice(dp.price, type)
//   let price3 = fixedPrice(dp.price);
//   if (site_id == '229') {
//     dp.price_rmb = price2 + `(${price3}${priceSite[site_id]})`;
//   } else {
//     dp.price_rmb = price2 + `(${priceSite[site_id]}${price3})`;
//   }
//   dp.price = price2;
//   return dp;
// }
// const editData = (data) => {
//   var len = data.store && data.store.length;
//   if (len && len > 0) {
//     for (let i = 0; i < len; i++) {
//       data.store[i].price = (Number(data.store[i].price) / 100).toFixed(2)
//     }
//   }
//   let len2 = data.product.length;
//   if (len)
//     data.store2 = data.store.slice(0, 6);
//   else
//     len = len2;
//   return len;
// }
const renderBtnTop = (price, isFuzzy) => {
  let t = '商城';
  if (isFuzzy) {
    t = '商城相似款';
  }
  let html = __webpack_require__(18112);
  $('#b2c_compare').append(html({
    store_tle: t,
    min_price: price
  })).css("display", "block");
};
const renderTopDetail = async () => {
  let widthObj = calWidth.init();
  let showListNum = widthObj.b2cShowListNum;
  let turnpW = widthObj.b2cTurnpW;
  let productW = widthObj.b2cProductW;
  let dp_query = userData.get('dp_query');
  let html = __webpack_require__(72328);
  if (fuzzyPage) {
    html = __webpack_require__(20028);
    showListNum = widthObj.showListNum;
    turnpW = widthObj.turnpW;
    productW = widthObj.allProductW;
  }
  if (G.site && G.site.indexOf('amazon') > -1) turnpW = turnpW - 1;
  let len = globalInfo['b2c_compare'].product.length;
  let storeLen = globalInfo['b2c_compare'].store && globalInfo['b2c_compare'].store.length;
  let pages = Math.ceil(len / showListNum);
  if (len) {
    await Promise.all(globalInfo['b2c_compare'].product.map(x => new Promise(resolve => {
      if (['8', '83', '123'].indexOf(x.site_id) > -1) {
        (__webpack_require__(80791).init)(x.url_crc, '30001', function (data) {
          console.log('coupon data', data);
          if (data && data.data) {
            let couponVal = data.data.coupon.coupon_money;
            x.promotions = [{
              type: 'coupon',
              text: couponVal + '元券'
            }];
            x.coupon2 = [couponVal + '元券'];
          }
          resolve();
        });
      } else {
        resolve();
      }
    })));
  }
  globalInfo['b2c_compare'].product = globalInfo['b2c_compare'].product.map(item => {
    let s = (__webpack_require__(22209).getMoneyInfo)(item.site_id);
    if (s) {
      item.unit = s[0];
    }
    return item;
  });
  // $('#b2c_compare').append(html({
  //   data: globalInfo['b2c_compare'],
  //   storeLen: storeLen,
  //   pages: pages,
  //   now_dp_id: dp_query.dp.dp_id,
  //   width: turnpW,
  //   imgLoad: G.imgLoad,
  //   productW: productW
  // }))
  const div = document.createElement('div');
  $('#b2c_compare').append(div);
  const TmCompare = (__webpack_require__(83754)/* ["default"] */ .A);
  new Vue({
    el: div,
    mounted() {
      this.$refs.b2c_compare.show = true;
    },
    render: h => h(TmCompare, {
      ref: 'b2c_compare',
      props: {
        data: globalInfo['b2c_compare'].product,
        stores: globalInfo['b2c_compare'].store
      }
    })
  });
  golbal2.loadImg(0, showListNum, $('#b2c-item-list li .small-img img'));
  //$('#b2c_compare').find('.top-bar-detail').show()

  if (G.site === 'suning') {
    $('#b2c_compare').on('click', 'a', function (e) {
      let url = $(this).attr('href');
      if ($(this).find('.coupon_span')) return;
      if (url && url.indexOf('http') > -1) {
        window.open($(this).attr('href'));
        e.preventDefault();
      }
    });
  }
};
const renderTop = data => {
  if (data && data.b2c && !(data.b2c instanceof Array)) {
    globalInfo['b2c_compare'] = data.b2c;
    if (Number(data.b2c.min_price) && data.b2c.store.length > 0 && data.b2c.product.length > 0) renderBtnTop(data.b2c.min_price);
  } else if (data && data.b2c_fuzzy && !(data.b2c_fuzzy instanceof Array) && data.b2c_fuzzy.product.length > 0) {
    globalInfo['b2c_compare'] = data.b2c_fuzzy;
    fuzzyPage = true;
    if (Number(data.b2c_fuzzy.min_price)) renderBtnTop(data.b2c_fuzzy.min_price, true);
  }
};
const renderBottom = data => {
  (__webpack_require__(35161).init)(data);
};
module.exports.init = (style, data) => {
  if (G.aliSite) return;
  // 根据style决定加载顶部还是底部
  if (style === 'top') {
    renderTop(data);
  } else {
    renderBottom(data);
  }
};
module.exports.renderTopDetail = renderTopDetail;

/***/ }),

/***/ 63372:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ MemberCouponBottomBjgvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ MemberCouponBottomBjg)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MemberCouponBottomBjg.vue?vue&type=template&id=295049ea&scoped=true
var MemberCouponBottomBjgvue_type_template_id_295049ea_scoped_true = __webpack_require__(23807);
;// ./src/bjgou/components/MemberCouponBottomBjg.vue?vue&type=template&id=295049ea&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MemberCouponBottomBjg.vue?vue&type=script&lang=js
var MemberCouponBottomBjgvue_type_script_lang_js = __webpack_require__(45634);
;// ./src/bjgou/components/MemberCouponBottomBjg.vue?vue&type=script&lang=js
 /* harmony default export */ const components_MemberCouponBottomBjgvue_type_script_lang_js = (MemberCouponBottomBjgvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MemberCouponBottomBjg.vue?vue&type=style&index=0&id=295049ea&prod&scoped=true&lang=less
var MemberCouponBottomBjgvue_type_style_index_0_id_295049ea_prod_scoped_true_lang_less = __webpack_require__(28461);
;// ./src/bjgou/components/MemberCouponBottomBjg.vue?vue&type=style&index=0&id=295049ea&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/bjgou/components/MemberCouponBottomBjg.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_MemberCouponBottomBjgvue_type_script_lang_js,
  MemberCouponBottomBjgvue_type_template_id_295049ea_scoped_true/* render */.XX,
  MemberCouponBottomBjgvue_type_template_id_295049ea_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "295049ea",
  null
  
)

/* harmony default export */ const MemberCouponBottomBjg = (component.exports);

/***/ }),

/***/ 63459:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-popup-bg[data-v-40244662] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 9999;\n  font-family: PingFangSC-Regular, Microsoft YaHei, sans-serif;\n}\n.gwd-popup[data-v-40244662] {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  min-width: 712px;\n  max-width: 1206px;\n  max-height: min(800px, calc(100vh - 100px));\n  background-color: #fff;\n  border-radius: 20px;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n  z-index: 10000;\n}\n.gwd-popup a[data-v-40244662] {\n  text-decoration: none;\n}\n.gwd-popup a[data-v-40244662]:hover {\n  text-decoration: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 63478:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42965);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("671740e3", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 63779:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48836);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("324a2b04", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 64133:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Highcharts = __webpack_require__(58174);


module.exports = data => {
  let highest = parseInt(data.msg.highest);
  let yAxisTitlex = 10;
  if (highest > 99) yAxisTitlex = 24;
  var obj = {
    chart: {
      renderTo: data.el,
      marginTop: 24,
      marginLeft: 78,
      marginRight: 24,
      backgroundColor: data.bg ? data.bg : "#394653",
      type: 'line',
      events: {
        load: function () {
          this.yAxis[0].update({
            tickInterval: parseInt((this.yAxis[0].dataMax - this.yAxis[0].dataMin) / 4) || 1
          });
          if (data.waterMark) {
            const waterMarkSrc = 'https://cdn.gwdang.com/images/extensions/logoMarkBigCenter@2x.png';
            const img = this.renderer.image(waterMarkSrc, this.chartWidth / 2 - 105, this.chartHeight / 2 - 32, 210, 54);
            img.add();
            img.css({
              opacity: 0.2
            });
          }
          let xinterval = (this.xAxis[0].dataMax - this.xAxis[0].dataMin) / 86400000;
          xinterval = xinterval / 3;
          let tickIntervals;
          if (xinterval > 30) {
            xinterval = parseInt(xinterval / 30) + 1;
            tickIntervals = xinterval * 30 * 86400000;
          } else {
            tickIntervals = xinterval * 86400000;
          }
          if (!data.shortTime) this.xAxis[0].update({
            tickInterval: tickIntervals
          });
        }
      }
    },
    credits: {
      enabled: false
    },
    colors: ['#1e94f8'],
    title: {
      text: data.title || '',
      y: -20,
      style: {
        color: '#92ABC2'
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: "#5f7183"
        }
      },
      dateTimeLabelFormats: {
        day: '%m-%e',
        week: '%m-%e',
        month: '%y/%m',
        year: '%y/%m'
      },
      tickLength: 0,
      lineColor: "#5f7183",
      gridLineWidth: 1,
      gridLineColor: '#516171'
    },
    yAxis: {
      title: {
        text: data.unit ? data.unit : '价格(元)',
        rotation: 0,
        margin: 0,
        y: -72,
        x: yAxisTitlex,
        style: {
          color: "#5f7183"
        }
      },
      labels: {
        style: {
          color: "#5f7183"
        },
        formatter: function () {
          return this.value.toFixed(2);
        }
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }],
      gridLineColor: '#5f7183',
      tickPixelInterval: 50
    },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      shared: true,
      shape: 'square',
      useHTML: true,
      followPointer: false,
      width: 110,
      height: 52,
      borderWidth: G.site === 'epic' ? 0 : 1,
      style: {
        padding: 0
      },
      formatter: function () {
        let x = new Date(this.x);
        let year = x.getFullYear();
        let month = x.getMonth() + 1;
        let day = x.getDate();
        if (month < 10) month = '0' + month.toString();
        if (day < 10) day = '0' + day.toString();
        let datestr = `${year}.${month}.${day}`;
        // let format = data.msg.formatted[this.x.toString()];
        // let disc = format.discount
        // if (disc !== 0)
        //   disc = '-' + disc.toString() + '%';
        let price;
        if (this.y !== 0) price = this.y.toFixed(2);else price = '0';
        let dom = `<div class="ttip-discount">
              <span class="ttip-sp1">${datestr}</span>
              <span class="ttip-sp2">价格: ￥${price}</span>
        </div>`;
        if (G.site === 'epic') {
          dom = `
            <div class="ttip-discount" style="width: 110px; height: 52px; padding-top: 8px; padding-left: 10px;">
              <span class="ttip-sp1" style="display: inline-block; color: #aaaaaa">${datestr}</span><br>
              <span class="ttip-sp2" style="display: inline-block; color: #aaaaaa; margin-top: 4px">价格: $${price}</span>
            </div>
          `;
        }
        return dom;
      },
      backgroundColor: G.site === 'epic' ? '#000000' : 'rgba(20,37,55,0.94)'
    },
    plotOptions: {
      series: {
        marker: {
          radius: 1,
          'stroke-width': 0,
          stroke: '#1e94f8',
          lineColor: null
        },
        shadow: false,
        states: {
          hover: {
            marker: {
              radius: 3,
              'stroke-width': 0,
              stroke: '#1e94f8',
              lineColor: null
            },
            halo: {
              size: 5
            }
          }
        }
      }
    },
    legend: {
      enabled: false,
      borderWidth: 0
    },
    series: []
  };
  if (data.title === undefined) obj.title.style.display = 'none';
  var store = data.msg;
  try {
    obj.series[0] = {
      visible: true,
      name: store.name,
      color: "#61BBEF",
      lineWidth: 2,
      data: []
    };
    obj.series[0].visible = true;
    obj.series[0].pointStart = store.all_line_begin_time + 8 * 3600000;
    obj.series[0].pointInterval = store.all_equal_short ? 3600000 : 3600000 * 24;
    obj.series[0].data = store.all_line;
    // obj.xAxis.floor = store.all_line_begin_time;
    // obj.xAxis.max = store.all_line_begin_time + (obj.series[0].data.length - 1) * 3600000 * 24
    if (obj.series[0].data.length === 1) {
      let k = obj.series[0].data[0];
      //obj.series[0].data.unshift()
    }
    window.chart = new Highcharts.Chart(obj);
  } catch (e) {}
};

/***/ }),

/***/ 64229:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-shaidan-item gwd-column"
  }, [_c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "12px",
      height: "16px"
    }
  }, [_c("img", {
    staticClass: "gwd-avatar",
    attrs: {
      src: _vm.item.avatar,
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "gwd-font11 gwd-nick",
    staticStyle: {
      "margin-left": "4px"
    }
  }, [_vm._v(_vm._s(_vm.item.snick))]), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "gwd-skuinfo gwd-font11",
    attrs: {
      title: _vm.item.sku
    }
  }, [_vm._v(_vm._s(_vm.item.sku))])]), _vm._v(" "), _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "10px",
      height: "14px",
      "margin-bottom": "12px"
    }
  }, [_c("span", {
    staticClass: "gwd-price gwd-font10",
    staticStyle: {
      "margin-top": "2px"
    }
  }, [_vm._v("¥")]), _vm._v(" "), _c("span", {
    staticClass: "gwd-price",
    staticStyle: {
      "margin-left": "-2px"
    }
  }, [_vm._v(_vm._s(_vm.displayPrice))]), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }), _vm._v(" "), _c("ShaiDanPic", {
    staticStyle: {
      "margin-right": "20px"
    },
    attrs: {
      img: _vm.item.pic
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "gwd-date gwd-font10"
  }, [_vm._v(_vm._s(_vm.displayDate))])], 1)]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 64943:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _Index = _interopRequireDefault(__webpack_require__(27334));
var _default = exports.A = {
  props: ['img', 'price'],
  methods: {
    open() {
      if (!window.gwdImgApp) {
        const el = document.createElement('div');
        document.body.appendChild(el);
        window.gwdImgApp = new Vue({
          el,
          render: h => h(_Index.default, {
            props: {
              img: this.img,
              price: this.price
            },
            ref: 'index'
          })
        });
      }
      window.gwdImgApp.$refs.index.open();
    }
  }
};

/***/ }),

/***/ 64966:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.imgWidth,
      expression: "imgWidth"
    }],
    staticClass: "gwd-sd-popup",
    class: `gwd-${_vm.mode} gwd-${_vm.tipmode}`,
    style: _vm.style,
    on: {
      mouseover: _vm.onMouseOver,
      mouseleave: _vm.onMouseLeave
    }
  }, [_c("img", {
    style: {
      "max-width": _vm.maxWidth + "px"
    },
    attrs: {
      src: _vm.img,
      alt: ""
    },
    on: {
      load: function ($event) {
        _vm.imgWidth = $event.target.width;
        _vm.imgHeight = $event.target.height;
      }
    }
  })]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 65169:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-quest[data-v-1834bd8f] {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  position: relative;\n  background: url(" + __webpack_require__(89330) + ");\n  background-size: contain;\n  cursor: pointer;\n  box-sizing: border-box;\n  white-space: normal;\n}\n.gwd-hint-text[data-v-1834bd8f] {\n  display: none;\n  position: absolute;\n  left: 50%;\n  margin-left: -97px;\n  bottom: 31px;\n  width: 194px;\n  height: 77px;\n  text-align: left;\n  box-sizing: border-box !important;\n  border-radius: 2px;\n  z-index: 9;\n  line-height: 16px;\n  color: white;\n  padding: 6px 9px;\n  background: rgba(0, 0, 0, 0.65);\n}\n.gwd-hint-text .gwd-hint-2x[data-v-1834bd8f] {\n  font-size: 22px;\n  width: 356px;\n  transform: scale(0.5);\n  transform-origin: top left;\n  line-height: 32px;\n  display: inline-block;\n}\n.gwd-hint-text[data-v-1834bd8f]::after {\n  content: '';\n  position: absolute;\n  top: 100%;\n  left: 55%;\n  margin-left: -84px;\n  width: 168px;\n  height: 7px;\n  background: url(" + __webpack_require__(87082) + ");\n  background-size: contain;\n}\n.gwd-quest:hover .gwd-hint-text[data-v-1834bd8f] {\n  display: block;\n}\n", ""]);

// exports


/***/ }),

/***/ 65417:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "shareExt gwdang-tab"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "share-detail bjd-product-detail topdetail"
  }, [_c("span", {
    staticClass: "share-sp2 gwd-share-title"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c("div", {
    staticClass: "share-sp2"
  }, [_vm._v("\n      " + _vm._s(_vm.priceInfo) + "\n    ")]), _vm._v(" "), _c("span", {
    staticClass: "share-sp2"
  }, [_vm._v("\n      点击链接查看具体历史价格详情"), _c("a", {
    attrs: {
      href: _vm.link,
      target: "_blank"
    }
  }, [_vm._v(_vm._s(_vm.link))])]), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("textarea", {
    attrs: {
      id: "copy-input",
      type: "",
      name: ""
    }
  }, [_vm._v(_vm._s(_vm.title) + "\n\n      " + _vm._s(_vm.priceInfoCopy) + "\n\n      点击链接查看具体历史价格详情" + _vm._s(_vm.link) + "\n    ")])])]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", {
    staticClass: "btn-tab-sp"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tab-sp1 blkcolor1"
  }, [_vm._v("分享")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c("span", {
    staticClass: "share-sp3 share-btn",
    staticStyle: {
      "margin-bottom": "20px"
    },
    attrs: {
      id: "copy-btn"
    }
  }, [_vm._v("复制去分享")])]);
}];
render._withStripped = true;

/***/ }),

/***/ 65952:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-favor-icon[data-v-d3ad16a8] {\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  background: url(" + __webpack_require__(11499) + ") no-repeat;\n}\n.gwd-favor-icon.gwd-favored[data-v-d3ad16a8] {\n  background: url(" + __webpack_require__(6879) + ") no-repeat;\n}\n.ms-tab-enter .gwd-favor-icon[data-v-d3ad16a8] {\n  background: url(" + __webpack_require__(6879) + ") no-repeat;\n}\n", ""]);

// exports


/***/ }),

/***/ 66477:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _commonUtil = _interopRequireDefault(__webpack_require__(60340));
var _default = exports.A = {
  props: ['newTime', 'aliSite'],
  data() {
    return {
      site: G.site,
      isNewJd: _commonUtil.default.isNewJd(),
      top: 0,
      additionalClass: ''
    };
  },
  methods: {
    resetTop() {
      var _document$querySelect;
      const summaryQuanEl = (_document$querySelect = document.querySelector('.floor-discount')) !== null && _document$querySelect !== void 0 ? _document$querySelect : document.querySelector('#summary-quan');
      if (summaryQuanEl) {
        const rect = summaryQuanEl.getBoundingClientRect();
        const height = rect.height;
        const top = $(summaryQuanEl).css('top');
        // this.top = parseInt(top) + height
        if ($(this.$el).css('position') === 'fixed') {
          // this.top = parseInt(top) + height
        } else {
          this.top = parseInt(top) + height + 'px';
        }
        if ($('.gwd-fake-el')) {
          $('.gwd-fake-el').css('top', parseInt(top) + height + 'px');
        }
      }
    }
  },
  mounted() {
    if (location.href.includes('npcitem.jd.hk')) {
      this.additionalClass = 'gwd-npcitem-jdhk';
    }
    if (_commonUtil.default.isNewJd() || $('#tbpcDetail_SkuPanelRightWrap').length) {
      this.$nextTick(() => {
        this.resetTop();
        window.addEventListener('scroll', this.resetTop);
        window.addEventListener('resize', this.resetTop);
      });
      setTimeout(() => {
        // window.gwdTrendReAdjust = require('common/commonUtil').convertToFixed('.gwd-new-jd')
        window.gwdMiniFixSwitcher = (__webpack_require__(60340).createFixSwitcher)(this.$el);
        if (G.site === '360buy') {
          window.gwdMiniFixSwitcher.replaceToFixed();
          window.addEventListener('resize', () => {
            window.gwdMiniFixSwitcher.restorePosition();
            window.gwdMiniFixSwitcher.replaceToFixed();
          });
        }
      }, 1000);
    } else {
      this.top = 0;
    }
  }
};

/***/ }),

/***/ 66614:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TooltipViewBar)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=template&id=7b887b5e&scoped=true
var TooltipViewBarvue_type_template_id_7b887b5e_scoped_true = __webpack_require__(30391);
;// ./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=template&id=7b887b5e&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=script&lang=js
var TooltipViewBarvue_type_script_lang_js = __webpack_require__(21323);
;// ./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=script&lang=js
 /* harmony default export */ const PriceTrend_TooltipViewBarvue_type_script_lang_js = (TooltipViewBarvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=style&index=0&id=7b887b5e&prod&scoped=true&lang=css
var TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css = __webpack_require__(42077);
var TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=style&index=0&id=7b887b5e&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const PriceTrend_TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css = ((TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css_default()) && (TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css_default()).locals ? (TooltipViewBarvue_type_style_index_0_id_7b887b5e_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/PriceTrend/TooltipViewBar.vue?vue&type=style&index=0&id=7b887b5e&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/PriceTrend/TooltipViewBar.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  PriceTrend_TooltipViewBarvue_type_script_lang_js,
  TooltipViewBarvue_type_template_id_7b887b5e_scoped_true/* render */.XX,
  TooltipViewBarvue_type_template_id_7b887b5e_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "7b887b5e",
  null
  
)

/* harmony default export */ const TooltipViewBar = (component.exports);

/***/ }),

/***/ 66716:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.data.time ? _c("div", [_c("p", {
    staticClass: "prifontf",
    staticStyle: {
      "margin-left": "16px",
      "line-height": "14px",
      "margin-top": "10px",
      "text-align": "left",
      "font-size": "12px"
    }
  }, [_vm._v(_vm._s(_vm.data.time))]), _vm._v(" "), _vm.data.pagePrice && _vm.domclass === "" ? _c("div", {
    staticClass: "tip-item tip-pagepri tip-pagepri2"
  }, [_c("em"), _vm._v(" "), !_vm.aliSite ? [_c("span", {
    staticClass: "tip-item-sp1",
    staticStyle: {
      width: "120px"
    }
  }, [_vm._v("到手价(单件) / 页面价")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")])] : _vm._e(), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v(_vm._s(_vm.data.pagePrice))])], 2) : _vm.data.pagePrice ? _c("div", {
    staticClass: "tip-item tip-pagepri"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp1"
  }, [_vm._v("页面价")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v(_vm._s(_vm.data.pagePrice))])]) : _vm._e(), _vm._v(" "), _vm.data.directpro ? _c("div", {
    staticClass: "tip-item tip-directpro"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp1"
  }, [_vm._v("到手价(单件)")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v("¥" + _vm._s(_vm.data.directpro))]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp4",
    domProps: {
      innerHTML: _vm._s(_vm.data.promo2)
    }
  })]) : _vm._e(), _vm._v(" "), _vm.data.addpro ? _c("div", {
    staticClass: "tip-item tip-addpro"
  }, [_c("em"), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp1"
  }, [_vm._v("到手价(多件)")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp2"
  }, [_vm._v(":")]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp3 prifontf"
  }, [_vm._v("¥" + _vm._s(_vm.data.addpro))]), _vm._v(" "), _c("span", {
    staticClass: "tip-item-sp4",
    domProps: {
      innerHTML: _vm._s(_vm.data.promo1)
    }
  })]) : _vm._e()]) : _vm._e();
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 66738:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-row gwd-trend-info-list",
    class: _vm.classList
  }, [_vm._l(_vm.displayInfoList, function (item, idx) {
    return _c("div", {
      key: idx,
      staticClass: "gwd-column"
    }, [_c("span", {
      staticClass: "gwd-text",
      style: item.color ? `color: ${item.color}; font-weight: bold; font-size: 13px` : ""
    }, [_vm._v(_vm._s(item.text.replace(".00", "")))]), _vm._v(" "), item.date ? _c("span", {
      staticClass: "gwd-date"
    }, [_vm._v(_vm._s(item.date))]) : _vm._e()]);
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-placeholder"
  })], 2);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 67242:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\n.big_tooltip_box .tip-item[data-v-94eef1d2] {\n  display: flex;\n}\n.big_tooltip_box .tip-item-sp4[data-v-94eef1d2] {\n  flex: 1;\n}\n", ""]);

// exports


/***/ }),

/***/ 67298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const request = __webpack_require__(49388);
module.exports.init = async () => {
  const cnzz = __webpack_require__(5300);
  if ($('.bjgou-subsidy-bar').length) {
    return false;
  }
  const request = __webpack_require__(49388);
  let dpId = (__webpack_require__(60340).getParameterByName)('id');
  if (location.hostname.indexOf('tmall') > -1) {
    dpId = dpId + '-83';
  } else {
    dpId = dpId + '-123';
  }
  let payload = {
    rebate: 1,
    dp_id: dpId,
    rate: 0.1
  };
  if (G.dp.price) {
    payload.price = G.dp.price;
  }
  let rebateValue = G.dp.rebate;
  if (!rebateValue) {
    let params = Object.keys(payload).map(k => `${k}=${encodeURIComponent(payload[k])}`).join('&');
    let res = await request.get(`https://browser.gwdang.com/extension/Coupon?${params}`);
    if (!res.rebate) return false;
    rebateValue = res.rebate;
  }
  const GiftMoney = (__webpack_require__(8585)/* ["default"] */ .A);
  $('#gwd-coupon-placeholder').replaceWith('<div id="gwd-giftmoney"></div>');
  if ($('.bjgou-subsidy-bar').length) {
    return false;
  }
  cnzz.logOnce('taobaoGiftMoney:show');
  cnzz.logOnce('taobaoGiftMoney:-show');
  (__webpack_require__(41761).setMet)('couponLink', {
    content: '发现' + rebateValue + '元红包，速领',
    url: (__webpack_require__(12826).appendTbInfoForUrl)(`https://tb.gwdang.com/extension/qrpage?tag=9_chrome&rebate=1&dp_id=${dpId}&discount=${rebateValue}`)
  });
  (__webpack_require__(2636).add)('店铺红包', rebateValue, (__webpack_require__(12826).appendTbInfoForUrl)(`https://tb.gwdang.com/extension/qrpage?tag=9_chrome&rebate=1&dp_id=${dpId}&discount=${rebateValue}`));
  new Vue({
    el: '#gwd-giftmoney',
    render: h => h(GiftMoney, {
      props: {
        value: rebateValue,
        qr: false,
        url: (__webpack_require__(12826).appendTbInfoForUrl)(`https://tb.gwdang.com/extension/qrpage?tag=9_chrome&rebate=1&dp_id=${dpId}&discount=${rebateValue}`),
        id: dpId,
        name: '店铺',
        price: G.dp.price
      }
    })
  });
  const GiftMoneyTop = (__webpack_require__(61915)/* ["default"] */ .A);
  $('.gwd-topbar-left').append(`<div id="gwd-giftmoney-top"></div>`);
  new Vue({
    el: '#gwd-giftmoney-top',
    render: h => h(GiftMoneyTop, {
      props: {
        value: rebateValue,
        qr: false,
        url: (__webpack_require__(12826).appendTbInfoForUrl)(`https://tb.gwdang.com/extension/qrpage?tag=9_chrome&rebate=1&dp_id=${dpId}&discount=${rebateValue}`),
        id: dpId,
        price: G.dp.price,
        name: '购物党'
      }
    })
  });
  if ($('[data-name="buyMobile"]').length) {
    if ($('.gwd-redpack-qr-link').length) {
      return true;
    }
    const link = (__webpack_require__(12826).appendTbInfoForUrl)(`https://tb.gwdang.com/extension/qrpage?tag=9_chrome&rebate=1&dp_id=${dpId}&discount=${rebateValue}`);
    $('.itemQR--L77_c29c').after(`
      <a class="gwd-redpack-qr-link" href="${link}" target="_blank">
        点击领取<img src="https://cdn.gwdang.com/images/extensions/activity/giftMoneyV3@2x.png" style="max-height: 15px">额外${rebateValue}元补贴红包
      </a>`);
  }
  return true;
};
module.exports.clear = () => {
  $('.gwd-redpack-qr-link').remove();
};

/***/ }),

/***/ 67625:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
var __WEBPACK_AMD_DEFINE_RESULT__;

/*
 * 豆瓣模块
 * @version:0.0.1
 * @author:CaoYuaYe(caoyuanye@139.com)
 * @since:2014-05-21
 *
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  var $ = __webpack_require__(10333);
  var exports = {};
  var taobaoCompare = __webpack_require__(60103),
    b2cCompare = __webpack_require__(92704);
  function insertTop(data, isbn) {
    if (!data.rate) {
      return;
    }
    var average = data.rate;
    $(`.gwd-topbar-left`).append($("<a>", {
      'style': 'height:36px',
      'title': '豆瓣评分',
      'id': 'douban-top',
      'class': 'gwdang-tab',
      'target': '_blank',
      'href': `https://book.douban.com/subject/${data.id}/`
    }).append($("<span>", {
      'class': 'douban-icon'
    })).append($("<span>", {
      'style': 'color:#007610'
    }).append(average + "分")));
  }
  function insertBottom(data, isbn) {
    if (!data.rate) {
      return;
    }
    var average = data.rate;
    $(`.${G.extBrand}-favor-module`).eq(0).after($("<div>", {
      'id': `${G.extBrand}-douban`,
      'class': `${G.extBrand}-close-module ${G.extBrand}-desc re-${G.extBrand}-desc`
    }).append($("<a>", {
      'id': 'goto_douban',
      'title': "豆瓣评分",
      'href': 'javascript:'
    }).append($("<div>", {
      'class': `${G.extBrand}and_douban_icon_bottom`
    })).append($("<div>", {
      'class': `${G.extName}_douban_text_bottom`
    }).append(average + "分"))));
    //这两个模块的需要设置一下偏移位置，因为插入的豆瓣占据了一定的空间
    taobaoCompare.setBottomViewOffset();
    b2cCompare.setBottomViewOffset();
  }
  exports.show = function (isbn, type) {
    if (isbn == null || isbn == "") {
      return;
    }
    let request = __webpack_require__(49388);
    let url = `${G.server}/extension/BookRate?isbn=` + isbn;
    request.getPure(url).then(msg => {
      if (type == "top") {
        insertTop(msg, isbn);
      }
      if (type == "bottom") {
        insertBottom(msg, isbn);
      }
    });
  };
  return exports;
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 68463:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("label", {
    staticClass: "gwd-switch",
    class: {
      "gwd-allow-animation": _vm.allowAnimation
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.inputVal,
      expression: "inputVal"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.inputVal) ? _vm._i(_vm.inputVal, null) > -1 : _vm.inputVal
    },
    on: {
      change: function ($event) {
        var $$a = _vm.inputVal,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.inputVal = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.inputVal = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.inputVal = $$c;
        }
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "gwd-slider"
  })]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 68953:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.text ? _c("div", {
    staticClass: "gwd-row gwd-tip",
    style: _vm.max ? "width: 670px" : ""
  }, [_vm._v("\n  " + _vm._s(_vm.text) + "\n  "), _c("span", {
    staticStyle: {
      flex: "1"
    }
  })]) : _vm._e();
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 69759:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwd-row gwd-align gwd-jcc minibar-tab",
    staticStyle: {
      display: "flex",
      flex: "1",
      cursor: "pointer"
    },
    attrs: {
      title: "点击查看结果"
    },
    on: {
      click: _vm.open
    }
  }, [_c("img", {
    staticStyle: {
      width: "24px",
      height: "24px"
    },
    attrs: {
      src: __webpack_require__(64149),
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "13px",
      color: "#404547"
    }
  }, [_vm._v("图片找同款")])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 69779:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ PriceTip)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/PriceTip.vue?vue&type=template&id=500de42c&scoped=true
var PriceTipvue_type_template_id_500de42c_scoped_true = __webpack_require__(68953);
;// ./src/standard/module/trend/PriceTip.vue?vue&type=template&id=500de42c&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/PriceTip.vue?vue&type=script&lang=js
var PriceTipvue_type_script_lang_js = __webpack_require__(31378);
;// ./src/standard/module/trend/PriceTip.vue?vue&type=script&lang=js
 /* harmony default export */ const trend_PriceTipvue_type_script_lang_js = (PriceTipvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/PriceTip.vue?vue&type=style&index=0&id=500de42c&prod&scoped=true&lang=less
var PriceTipvue_type_style_index_0_id_500de42c_prod_scoped_true_lang_less = __webpack_require__(59235);
;// ./src/standard/module/trend/PriceTip.vue?vue&type=style&index=0&id=500de42c&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/trend/PriceTip.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  trend_PriceTipvue_type_script_lang_js,
  PriceTipvue_type_template_id_500de42c_scoped_true/* render */.XX,
  PriceTipvue_type_template_id_500de42c_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "500de42c",
  null
  
)

/* harmony default export */ const PriceTip = (component.exports);

/***/ }),

/***/ 70176:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.loaded ? _c("div", {
    staticClass: "gwd-column gwd-shaidan",
    class: {
      "gwd-has-top": _vm.hasTop
    }
  }, [_c("div", {
    staticClass: "gwd-header gwd-row gwd-align"
  }, [_c("img", {
    staticStyle: {
      width: "47px",
      height: "15px",
      "margin-left": "8px"
    },
    attrs: {
      src: _vm.s_server + "cdj@2x.png",
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "gwd-font-pfm",
    staticStyle: {
      "margin-left": "8px",
      color: "111",
      "font-size": "14px"
    }
  }, [_vm._v(_vm._s(_vm.loaded && _vm.list.length ? "大家" : "你") + "是多少钱入手的？")])]), _vm._v(" "), _vm.loaded && !_vm.list.length ? _c("div", {
    staticClass: "gwd-column gwd-align",
    staticStyle: {
      flex: "1",
      "justify-content": "center"
    }
  }, [_c("img", {
    staticStyle: {
      width: "119px",
      height: "98px"
    },
    attrs: {
      src: _vm.s_server + "empty@2x.png"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "line-height": "14px",
      color: "#404547"
    }
  }, [_vm._v("分享你的成交价，大家一起查底价")])]) : _vm._e(), _vm._v(" "), _vm.loaded && _vm.list.length ? _c("div", {
    staticClass: "gwd-scrollbar gwd-column gwd-sd-list gwd-align",
    staticStyle: {
      flex: "1"
    }
  }, _vm._l(_vm.list, function (item, idx) {
    return _c("ShaiDanItem", {
      key: idx + "-sd",
      attrs: {
        item: item
      }
    });
  }), 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "gwd-column gwd-align",
    style: {
      "margin-bottom": _vm.list.length ? "2px" : "15px"
    }
  }, [_c("img", {
    staticStyle: {
      height: "43px",
      cursor: "pointer"
    },
    attrs: {
      src: _vm.s_server + "bigButton@2x.png",
      alt: ""
    },
    on: {
      click: _vm.open
    }
  }), _vm._v(" "), _c("form", {
    staticStyle: {
      display: "none"
    },
    attrs: {
      action: _vm.sdUrl,
      method: "post",
      target: "_blank",
      "accept-charset": "utf-8"
    }
  }, [_c("input", {
    attrs: {
      type: "hidden",
      name: "price"
    },
    domProps: {
      value: _vm.price
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.shop,
      expression: "shop"
    }],
    attrs: {
      type: "hidden",
      name: "shop"
    },
    domProps: {
      value: _vm.shop
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.shop = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.title,
      expression: "title"
    }],
    attrs: {
      type: "hidden",
      name: "title"
    },
    domProps: {
      value: _vm.title
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.title = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.img,
      expression: "img"
    }],
    attrs: {
      type: "hidden",
      name: "img"
    },
    domProps: {
      value: _vm.img
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.img = $event.target.value;
      }
    }
  }), _vm._v(" "), _vm.skuId ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.skuId,
      expression: "skuId"
    }],
    attrs: {
      type: "hidden",
      name: "sku_id"
    },
    domProps: {
      value: _vm.skuId
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.skuId = $event.target.value;
      }
    }
  }) : _vm._e(), _vm._v(" "), _c("input", {
    attrs: {
      type: "hidden",
      name: "sku_str"
    },
    domProps: {
      value: _vm.skuStr
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.skuOptions,
      expression: "skuOptions"
    }],
    attrs: {
      type: "hidden",
      name: "sku_options"
    },
    domProps: {
      value: _vm.skuOptions
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.skuOptions = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.skuMap,
      expression: "skuMap"
    }],
    attrs: {
      type: "hidden",
      name: "sku_map"
    },
    domProps: {
      value: _vm.skuMap
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.skuMap = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("input", {
    attrs: {
      type: "submit",
      id: "gwd-sd-submit"
    }
  })])])]) : _vm._e();
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 70923:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9856);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("10abab34", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 70972:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {
  props: ['domName', 's_url', 'f_url', 'showAd', 'jdadUrl', 'noCoupon', 'showJHS', 'fold'],
  methods: {
    openTab() {
      (__webpack_require__(30888).openTab)();
    },
    openLink(url) {
      window.open(url);
    }
  }
};

/***/ }),

/***/ 71401:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "a[data-v-6f5d34be] {\n  background: url(" + __webpack_require__(3316) + ");\n  width: 256px;\n  height: 30px;\n}\na span[data-v-6f5d34be] {\n  text-align: center;\n}\na .gwd-content[data-v-6f5d34be] {\n  color: white;\n  font-size: 12px;\n}\na .gwd-take[data-v-6f5d34be] {\n  display: inline-block;\n  font-size: 12px;\n  color: white;\n  width: 70px;\n}\na[data-v-6f5d34be]:hover {\n  text-decoration: none!important;\n}\n", ""]);

// exports


/***/ }),

/***/ 72105:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-row gwd-collection-comp",
    staticStyle: {
      flex: "1"
    }
  }, [_vm.user.login && _vm.allPrice.toString().length ? _c("div", {
    staticClass: "gwd-column gwd-collection-detail",
    staticStyle: {
      flex: "1"
    }
  }, [_c("div", {
    staticClass: "gwd-row",
    staticStyle: {
      height: "20px"
    }
  }, [_c("img", {
    staticStyle: {
      width: "128px",
      height: "18px"
    },
    attrs: {
      src: __webpack_require__(28755),
      alt: ""
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }), _vm._v(" "), _vm.settedNotifySite !== null ? _c("button", {
    staticClass: "gwd-button gwd-btn-del"
  }, [_c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "transform-origin": "center center"
    },
    on: {
      click: function ($event) {
        return _vm.cancel();
      }
    }
  }, [_vm._v("取消提醒")])]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "gwd-row",
    staticStyle: {
      "margin-top": "13px"
    }
  }, [_c("div", {
    staticClass: "gwd-column",
    staticStyle: {
      position: "relative"
    }
  }, [_c("div", {
    staticClass: "gwd-container gwd-column",
    class: {
      "gwd-ht": _vm.haitao
    }
  }, [_c("div", {
    staticClass: "gwd-row gwd-align gwd-remind-option"
  }, [_c("span", [_vm._v("当价格低于")]), _vm._v(" "), _c("PriceInput", {
    staticStyle: {
      flex: "1"
    },
    attrs: {
      currency: _vm.currency
    },
    model: {
      value: _vm.currentPrice,
      callback: function ($$v) {
        _vm.currentPrice = $$v;
      },
      expression: "currentPrice"
    }
  }), _vm._v(" "), _c("span", [_vm._v("时提醒我")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "gwd-container gwd-row gwd-align",
    staticStyle: {
      "margin-top": "8px"
    },
    style: {
      visibility: _vm.priceRemind.showMPromo ? "visible" : "hidden"
    }
  }, [_vm._m(0), _vm._v(" "), _c("SwitchBtn", {
    attrs: {
      allowAnimation: _vm.allowAnimation
    },
    model: {
      value: _vm.mPromo,
      callback: function ($$v) {
        _vm.mPromo = $$v;
      },
      expression: "mPromo"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "line-height": "13px",
      "margin-top": "12px"
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      "margin-top": "12px"
    }
  }, [_c("button", {
    staticClass: "gwd-btn-submit gwd-button",
    on: {
      click: _vm.submit
    }
  }, [_vm._v("提交")])]), _vm._v(" "), _vm.errorText ? _c("div", {
    staticClass: "gwd-remind-error-text",
    class: {
      "gwd-fadeout-5s": _vm.errorFadeClass
    }
  }, [_vm._v("\n          " + _vm._s(_vm.errorText) + "\n        ")]) : _vm._e(), _vm._v(" "), _vm.hintText ? _c("div", {
    staticClass: "gwd-remind-hint-text",
    class: {
      "gwd-fadeout-5s": _vm.hintFadeClass
    }
  }, [_vm._v("\n          " + _vm._s(_vm.hintText) + "\n        ")]) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "gwd-vline"
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-column gwd-align gwd-qr-area",
    staticStyle: {
      width: "84px",
      height: "100%"
    }
  }, [_c("span", {
    staticStyle: {
      "font-size": "13px",
      color: "#404547",
      "line-height": "20px",
      "margin-top": "3px"
    }
  }, [_vm._v("微信提醒")]), _vm._v(" "), _c("img", {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.user.wxQr,
      expression: "user.wxQr"
    }],
    staticStyle: {
      "margin-top": "18px",
      width: "84px",
      height: "84px"
    },
    attrs: {
      src: _vm.user.wxQr,
      alt: ""
    }
  }), _vm._v(" "), _vm._m(1)])])]) : _vm._e(), _vm._v(" "), !_vm.user.login ? _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      flex: "1"
    }
  }, [_c("CommonLogin", {
    staticStyle: {
      flex: "1"
    },
    attrs: {
      position: "gwd-mini",
      "show-alter-login": "true",
      "alter-login-position": "row"
    }
  })], 1) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-column",
    staticStyle: {
      flex: "1",
      "align-items": "flex-start"
    }
  }, [_c("span", {
    staticStyle: {
      color: "#404547",
      "font-size": "13px",
      "line-height": "18px"
    }
  }, [_vm._v("多件优惠时提醒我")]), _vm._v(" "), _c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "transform-origin": "left center",
      color: "#999999",
      "line-height": "14px",
      "margin-top": "4px"
    }
  }, [_vm._v("同一商品，购买多件才能享受优惠")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "margin-top": "12px",
      "line-height": "16px",
      color: "#969899",
      "white-space": "nowrap"
    }
  }, [_vm._v("\n          扫码关注公众号"), _c("br"), _vm._v("商品降价自动提醒\n        ")]);
}];
render._withStripped = true;

/***/ }),

/***/ 72524:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-new-jd {\n  position: sticky;\n  z-index: 101;\n  margin-bottom: 12px;\n}\n.gwd-minibar-bg.gwd-new-jd {\n  position: sticky;\n}\n", ""]);

// exports


/***/ }),

/***/ 73195:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


const template = __webpack_require__(26133);
const deviceEncode = __webpack_require__(69793);
const util = __webpack_require__(30888);
const userData = __webpack_require__(74222);
const addEvent = () => {
  let time1;
  $('#bjd_logo').on('mouseenter', () => {
    $('#nbt_setting').show();
  });
  $('#bjd_logo').on('mouseleave', () => {
    time1 = setTimeout(function () {
      $('#nbt_setting').hide();
    }, 200);
  });
  $('#nbt_setting').on('mouseenter', () => {
    clearTimeout(time1);
  });
  $('#nbt_setting').on('mouseleave', () => {
    $('#nbt_setting').hide();
  });
  $('#nbt_setting .setting-item').on('mouseenter', function () {
    $(this).addClass('setting_hover');
  });
  $('#nbt_setting .setting-item').on('mouseleave', function () {
    $(this).removeClass('setting_hover');
  });
  if (G.allowBackgroundRequest) {
    $('.main-setting').on('click', () => {
      util.openTab();
    });
  }
};
const render = () => {
  let perinfo = userData.get('permanent');
  let href = document.location.href;
  let btype = G.btype ? G.btype : '';
  let settingUrl;
  if (!perinfo.setPage) {
    settingUrl = `${G.server}/brwext/setting?from=${deviceEncode(G.from_device)}&btype=${G.btype ? G.btype : ''}`;
  }
  let html = __webpack_require__(5883);
  $('#bjd_bottom_detail').append(template.compile(html)({
    mainset: `${G.server}/brwext/setting?from=${deviceEncode(G.from_device)}&btype=${btype}`,
    feedback: `${G.c_server}/brwext/suggest?refer=${encodeURIComponent(href)}&from_device=${G.from_device}&btype=${btype}`,
    help: `${G.c_server}/v2/app/questions`,
    settingUrl: settingUrl,
    webpage: `${G.c_server}/`
  }));
  addEvent();
};
module.exports.init = () => {
  render();
};

/***/ }),

/***/ 73222:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ MemberCouponMiniBjgvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ MemberCouponMiniBjg)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MemberCouponMiniBjg.vue?vue&type=template&id=4df286a2&scoped=true
var MemberCouponMiniBjgvue_type_template_id_4df286a2_scoped_true = __webpack_require__(92411);
;// ./src/bjgou/components/MemberCouponMiniBjg.vue?vue&type=template&id=4df286a2&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MemberCouponMiniBjg.vue?vue&type=script&lang=js
var MemberCouponMiniBjgvue_type_script_lang_js = __webpack_require__(3442);
;// ./src/bjgou/components/MemberCouponMiniBjg.vue?vue&type=script&lang=js
 /* harmony default export */ const components_MemberCouponMiniBjgvue_type_script_lang_js = (MemberCouponMiniBjgvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/bjgou/components/MemberCouponMiniBjg.vue?vue&type=style&index=0&id=4df286a2&prod&scoped=true&lang=less
var MemberCouponMiniBjgvue_type_style_index_0_id_4df286a2_prod_scoped_true_lang_less = __webpack_require__(83625);
;// ./src/bjgou/components/MemberCouponMiniBjg.vue?vue&type=style&index=0&id=4df286a2&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/bjgou/components/MemberCouponMiniBjg.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_MemberCouponMiniBjgvue_type_script_lang_js,
  MemberCouponMiniBjgvue_type_template_id_4df286a2_scoped_true/* render */.XX,
  MemberCouponMiniBjgvue_type_template_id_4df286a2_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "4df286a2",
  null
  
)

/* harmony default export */ const MemberCouponMiniBjg = (component.exports);

/***/ }),

/***/ 74787:
/***/ ((module) => {

"use strict";
module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjNweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMjMgMTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjEgKDY3MDQ4KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT7nrq3lpLQ8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iMeaciOS/ruaUuSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuaPkuS7tue6ouWMhSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNDguMDAwMDAwLCAtNTU3LjAwMDAwMCkiIGZpbGw9IiNGRjU2NTIiPgogICAgICAgICAgICA8ZyBpZD0i5YiG57uELTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgyMi4wMDAwMDAsIDU0NS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnrq3lpLQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyNi4wMDAwMDAsIDEyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSLot6/lvoQiIHBvaW50cz0iMTYuNjk4MTYxOCA5LjE0MjU4MjQgMjEuMjgyNTUwMiA1IDE2LjY5ODE2MTggMC44NTc0MTc2MDMgMTcuMzUzMDc0NCAwLjI2NTYyMDExOCAyMi41OTIzNzU0IDUgMTcuMzUzMDc0NCA5LjczNDM3OTg4Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9Iui3r+W+hC1jb3B5IiBvcGFjaXR5PSIwLjgiIHBvaW50cz0iOC40NDE3ODIwOSA5LjE0MjU4MjQgMTMuMDI2MTcwNCA1IDguNDQxNzgyMDkgMC44NTc0MTc2MDMgOS4wOTY2OTQ3MSAwLjI2NTYyMDExOCAxNC4zMzU5OTU3IDUgOS4wOTY2OTQ3MSA5LjczNDM3OTg4Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9Iui3r+W+hC1jb3B5LTIiIG9wYWNpdHk9IjAuNCIgcG9pbnRzPSIwLjE4NTQwMjM3NCA5LjE0MjU4MjQgNC43Njk3OTA3MiA1IDAuMTg1NDAyMzc0IDAuODU3NDE3NjAzIDAuODQwMzE0OTk2IDAuMjY1NjIwMTE4IDYuMDc5NjE1OTcgNSAwLjg0MDMxNDk5NiA5LjczNDM3OTg4Ij48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

/***/ }),

/***/ 74868:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['color']
};

/***/ }),

/***/ 75591:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57478);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("03dfc70a", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 75682:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


const utils = __webpack_require__(30888);
const deviceEncode = __webpack_require__(69793);
// const productMonitor = require('productMonitor')
const userData = __webpack_require__(74222);
// var vipSearch = require('vipSearch')
let template = __webpack_require__(26133);
// let log = require('log')
// let cnzz = require('cnzz')
const renderBottomBar = () => {
  let perinfo = userData.get('permanent');
  let hideClass = '';
  let fold = perinfo.fold;
  if (gwd_G.from_device === 'default') {
    fold = perinfo.top_fold;
  }
  perinfo.fold = fold;
  if (fold === '1') hideClass = 'b-hidden';
  let html = __webpack_require__(22632);
  let refer = encodeURIComponent(document.location.href);
  let feedbackUrl = `https://www.gwdang.com/brwext/suggest?refer=${refer}&from_device=${deviceEncode(G.from_device)}`;
  let settingUrl;
  if (!perinfo.setPage) {
    settingUrl = `${G.server}/brwext/setting?from=${deviceEncode(G.from_device)}&btype=${G.btype ? G.btype : ''}`;
  }
  $('body').append(template.compile(html)({
    hidemod: hideClass,
    settingUrl: settingUrl,
    detailW: $(window).width(),
    f_url: feedbackUrl
  }));
  // if (G.site == 'lenovo') {
  //   if ($('#container_buygroup').length > 0 && $('#container_buygroup').css('position') == 'fixed') {
  //     $('#bjd_bottom_detail').css('bottom', '80px')
  //   }
  // }
};
const addBtBarEvent = () => {
  let perinfo = userData.get('permanent');
  $('#gwdang-trend').on('mouseenter', function () {
    $('#gwdang-trend-detail').css('display', 'flex');
    $('#gwdang-trend-detail .panel-wrap').css('flex', 1);
    $(document).trigger('renderAgain');
    $(this).addClass('mshover');
  });
  $('#gwdang-trend, #gwdang-trend-detail').on('mouseleave', function () {
    // $('#gwdang-trend-detail').hide()
    $(this).removeClass('mshover');
  });
  $('#gwdang-setting').on('click', () => {
    utils.openTab();
  });
  $('.nbt-close-btn').on('click', function () {
    if (perinfo.fold !== '1') {
      $('.close-module').addClass('b-hidden');
      $(this).addClass('b-hidden');
      $('#bjd_bottom_detail').css('width', '94px');
      $('.right-info').css('display', 'none');
      perinfo.fold = '1';
    } else {
      $('.close-module').removeClass('b-hidden');
      $(this).removeClass('b-hidden');
      $('#bjd_bottom_detail').css('width', 'auto');
      $('.right-info').css('display', 'flex');
      perinfo.fold = '0';
    }
    // 用户设置插件之后需要保存
    utils.setLocal('fold', perinfo.fold);
    utils.settings('set_p_fold', 'p_fold', perinfo.fold);
  });
};
module.exports.init2 = data => {
  if (G.IE6 && G.site == 'ccb') {
    return;
  }
  if (G.site === 'smzdm') {
    return;
  }
  // 加载本地插件UI
  renderBottomBar();
  // require('lowestPrice').init(data.now)
  // // require('haoym').init()
  // // require('zhidemai').init(data.now.site_id)
  // require('compare').init(data)
  // require('topFavor').init()
  // 加载底部设置
  (__webpack_require__(73195).init)();
  addBtBarEvent();
  // priceTrend.init(G.where_buy_dps, G.now_dp_id, "bottom");
  // taobaoCompare.init(data, "bottom");
  // wishlist.init(data.share_good, data.now);
  // //加载促销活动
  // promo.addPromo(promo.getPromoData(data));
};

/***/ }),

/***/ 75772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(3362);
const template = __webpack_require__(26133);
const userData = __webpack_require__(74222);
var isShow, totalPages, nowPage;
const renderB2c = data => {
  let linkAll;
  let info = userData.get('other_info');
  if (data.length >= 15) {
    data = data.slice(0, 15);
    linkAll = `https://www.gwdang.com/dp${info.now.dp_id}/where_buy/?from=browser&crc64=1&m=b2c#tabs`;
  } else {
    let s = parseInt(data.length / 3);
    data = data.slice(0, s * 3);
  }
  totalPages = Math.ceil(data.length / 3);
  nowPage = 1;
  renderTab("商城相似款", "mini-b2c-com");
  let html = __webpack_require__(23348);
  let views = template.compile(html)({
    data: data,
    totalPages: totalPages,
    linkAll: linkAll
  });
  $('#gwd_mini_compare').append(views).css('display', 'block');
  addEvent('#gwd_mini_compare ul');
};
let lock, linkhide;
const turnPage = (t, dom) => {
  lock = true;
  let left = Number(dom.css('left').replace('px', ''));
  if (t === '-1') {
    nowPage--;
    if (nowPage === 1) {
      $('.mini-com-foot .mini-com-tleft').hide();
    }
    if (!linkhide) {
      linkhide = true;
      $('.linkAll').hide();
      $('.mini-com-tright').show();
    }
    dom.animate({
      left: left + 450 + 'px'
    }, 500, function () {
      lock = false;
    });
  } else if (t === '1') {
    if (nowPage === totalPages) {
      lock = false;
      return;
    }
    nowPage++;
    if (nowPage === totalPages) {
      $('.linkAll').show();
      linkhide = false;
      $('.mini-com-tright').hide();
    }
    if (nowPage === 2) {
      $('.mini-com-foot .mini-com-tleft').show();
    }
    dom.animate({
      left: left - 450 + 'px'
    }, 500, function () {
      lock = false;
    });
  }
};
const addEvent = id => {
  let uldom = $(id);
  $('.mini-com-foot').on('click', function (e) {
    let type = $(e.target).attr('data-type');
    if (!lock && e.target.nodeName !== 'A') {
      turnPage(type, uldom);
    }
  });
  $('#gwd_mini_compare').on('mouseenter', function () {
    $('.mini-compare-detail').show();
  });
  $('#gwd_mini_compare').on('mouseleave', function () {
    $('.mini-compare-detail').hide();
  });
};
const renderTab = (tle, bclass) => {
  let t = `<div class="minibar-btn-box">
        <em class="setting-bg mini-compare-icon"></em>
        <span >${tle}</span>
      </div>`;
  $('#gwd_mini_compare').append($(t)).show().addClass(bclass);
};
const renderLowest = (data, linkAll) => {
  totalPages = Math.ceil(data.length / 3);
  nowPage = 1;
  renderTab("同类历史低价", "mini-lowest");
  let html = __webpack_require__(30493);
  let views = template.compile(html)({
    data: data,
    linkAll: linkAll,
    totalPages: totalPages,
    ulWidth: 150 * data.length
  });
  $('#gwd_mini_compare').append(views);
  addEvent('#mini_lowest_ul');
};
let renderTime = 0;
const renderNoinfo = () => {
  renderTime++;
  if (renderTime === 2) {
    let bclass = 'no-com-info';
    let t = `<div class="minibar-btn-box">
        <em class="setting-bg mini-compare-icon "></em>
        <span >暂无商城比价</span>
      </div>`;
    $('#gwd_mini_compare').append($(t)).show().addClass(bclass);
  }
};
const readyLowest = data => {
  let info = userData.get('other_info');
  let keyword = encodeURIComponent(info.now.coreword || "");
  let class_id = info['code-server'].class_id || '00000000';
  class_id = class_id.trim();
  let linkAll;
  if (data) {
    if (data.length >= 15) {
      data = data.slice(0, 15);
      linkAll = `https://www.gwdang.com/promotion/price?keyword=${keyword}&ext=1&class_id=${class_id}`;
    } else {
      let s = parseInt(data.length / 3);
      data = data.slice(0, s * 3);
    }
    renderLowest(data, linkAll);
    isShow = true;
  } else {
    renderNoinfo();
  }
};
// 判断b2c lowest 是否执行，因为显示逻辑上优先b2c  接口上lowest有可能领先，需要等待。
let runB2c, runLowest;
module.exports.init = async (type, data) => {
  await (__webpack_require__(41761).met)('dp_query_latest_complete');
  if (isShow) return;
  if (G.aliSite) {
    return;
  } else if (type === 'b2c') {
    runB2c = true;
    if (!data) {
      renderNoinfo();
    } else if (!(data.b2c instanceof Array) && (data.b2c.product || data.b2c.store) && data.b2c.store.length > 0) {
      (__webpack_require__(82110).renderMiniCom)(data);
      isShow = true;
    } else if (!(data.b2c_fuzzy instanceof Array) && data.b2c_fuzzy.product.length > 2 && Number(data.b2c_fuzzy.min_price)) {
      renderB2c(data.b2c_fuzzy.product);
      isShow = true;
    } else if (runLowest) {
      renderNoinfo();
      $(document).trigger('lowestready');
    } else {
      renderNoinfo();
    }
    // if (G.site === 'suning' && !G.isMonkey) {
    //   setTimeout(() => {
    //     $('#gwd_mini_compare').on('click', 'a', function(e) {
    //       let url = $(this).attr('href');
    //       if (url && url.indexOf('http') > -1) {
    //         window.open($(this).attr('href'))
    //         e.preventDefault()
    //       }
    //     })
    //   }, 500)
    // }
  } else if (type === 'lowest') {
    runLowest = true;
    if (!data) {
      renderNoinfo();
    } else if (runB2c) {
      readyLowest(data);
    } else {
      $(document).on('lowestready', function () {
        readyLowest(data);
      });
    }
  }
};

/***/ }),

/***/ 75957:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(26910);
const template = __webpack_require__(26133);
const util = __webpack_require__(30888);
let lowestIndex, showFold;
module.exports.init = (data, nop_data, store, img) => {
  render(data, nop_data, store, img);
};
const editData = (originData, nop_data, store) => {
  if (!originData) return undefined;
  let data = JSON.parse(JSON.stringify(originData));
  let lowestp = store[0].lowest;
  let storesize = store[0].all_line.length;
  if (storesize > 180) {
    let all_line2 = store[0].all_line.slice(storesize - 180);
    lowestp = Math.min.apply(null, all_line2);
  }
  nop_data = nop_data || [];
  let datal = data.length;
  if (!datal) return undefined;
  let lowest = data[datal - 1].price,
    lowIndex = datal - 1;
  for (let i = datal - 1; i >= 0; i--) {
    for (let j = 0; j < nop_data.length; j++) {
      if (data[i].time === nop_data[j].time) {
        if (data[i].price === nop_data[j].price) {
          data[i] = JSON.parse(JSON.stringify(nop_data[j]));
          data[i].isDSJ = true;
        } else {
          data.splice(i + 1, 0, JSON.parse(JSON.stringify(nop_data[j])));
          data[i + 1].isDSJ = true;
        }
      }
    }
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].price <= lowest) {
      lowest = data[i].price;
      lowIndex = i;
    }
    if (data[i].msg.coupon) {
      let str = data[i].msg.coupon;
      if (str.match(/\d+-\d+/)) {
        let arr = str.split('-');
        data[i].coupon = '券: ' + '满' + arr[0] + '减' + arr[1];
      } else {
        data[i].coupon = '券: ' + data[i].msg.coupon;
      }
    }
    if (data[i].msg.promotion) {
      data[i].promotion = '促: ' + data[i].msg.promotion;
    }
    let time = data[i].time * 1000;
    let month = new Date(time).getMonth() + 1;
    let day = new Date(time).getDate();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) day = '0' + day.toString();
    data[i].time2 = month + '-' + day;
    // data[i].price = (data[i].price / 100).toFixed(2)
    // data[i].ori_price = (data[i].ori_price / 100).toFixed(2)
  }
  if (lowest / 100 < lowestp) {
    data[lowIndex].isLowest = true;
  }
  data.sort(function (v1, v2) {
    return v2.time - v1.time;
  });
  let lowIndex2;
  for (let i = 0; i < data.length; i++) {
    if (data[i].isLowest) {
      lowIndex2 = i;
      data[i].mark = "lowest_now";
    }
    if (!lowIndex2 && lowIndex2 !== 0) {
      data[i].mark = "lowest_before";
    } else if (i > lowIndex2) {
      data[i].mark = "lowest_after";
    }
  }
  lowestIndex = lowIndex2;
  let timestr = util.getTimeNumber(new Date().getTime(), '2');
  if (timestr === data[0].time2) {
    data[0].isnowDay = true;
  }
  return data;
};
module.exports.editData = editData;
const addEvent = () => {
  $('.show_fold .fold-bar').on('click', function () {
    $('.history-content').removeClass('show_fold');
    showFold = false;
    calLineHeight();
  });
};
const render = (originData, nop_data, store, img) => {
  let data = editData(originData, nop_data, store);
  if (data.length > 3 && lowestIndex > 1) {
    showFold = true;
  }
  let html = __webpack_require__(12550);
  $('#mini_price_history_detail').append(template.compile(html)({
    data: data,
    showFold: showFold,
    img: img
  }));
  addEvent();
};
const calLineHeight = () => {
  setTimeout(function () {
    let mH = 0;
    let doms = $('.history-content>ul li');
    for (let i = 0; i < doms.length - 1; i++) {
      let h = doms.eq(i).height();
      if (h > 0 && doms.eq(i).is(':visible')) {
        mH = mH + h + 22;
      }
    }
    if (showFold) {
      mH += 32;
    }
    $('.history-line').css('height', mH + 'px');
    let firstH = $('.history-content>ul li').eq(0).outerHeight() + 26;
    $('.show_fold .fold-bar').css('top', firstH + 'px');
  }, 10);
};
module.exports.calLineHeight = calLineHeight;

/***/ }),

/***/ 76710:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(23792);
__webpack_require__(3362);
__webpack_require__(12041);
__webpack_require__(62953);
const getCoupon = __webpack_require__(80791);
const getCouponNew = __webpack_require__(62801);
const request = __webpack_require__(49388);
const cnzz = __webpack_require__(5300);
const log = __webpack_require__(35743);
const util = __webpack_require__(30888);
const extConsole = __webpack_require__(7129);
const mutationObserver = __webpack_require__(41968);
const globalCondition = __webpack_require__(41761);
var globalInfo = {},
  hasReqId = (/* unused pure expression or super */ null && ([]));
let useQrCode;
var domPattern = {
  'tmall1': {
    list: '#J_ItemList>div.product',
    dom: '.productImg-wrap',
    url: 'a.productImg'
  },
  'taobao1': {
    list: '#mainsrp-itemlist .items .item',
    dom: '.pic-box',
    listen: '#mainsrp-itemlist',
    lschild: '.m-itemlist',
    url: 'a.pic-link'
  },
  'taobao11': {
    list: '#listsrp-itemlist div.items .J_ItemListSKUItem',
    dom: '.pic-box',
    listen: '#listsrp-itemlist',
    lschild: '.m-itemlist',
    url: 'a.pic-link'
  },
  'taobao2': {
    list: 'ul li',
    dom: '.x',
    listen: '.m-itemlist',
    url: 'a'
  },
  'taobao3': {
    list: '.module-wrap.J_tb_lazyload .pro-list li',
    dom: '.x',
    listen: '.m-itemlist',
    url: 'a.item'
  },
  'taobao4': {
    list: '#list-itemList ul.items li.item',
    dom: '.J_ItemMainImgWraper',
    listen: '.m-itemlist',
    url: 'a.J_AtpLog'
  },
  'taobao5': {
    list: '.module-wrap.J_tb_lazyload ul.items li',
    dom: '.x',
    listen: '.m-itemlist',
    url: '.shopTitle+a.img_url'
  },
  'taobao6': {
    list: '.m-itemList ul.items li.item',
    dom: 'span.img-inner',
    listen: '#minilist-itemList-1',
    lschild: '.m-itemList',
    url: '.J_ItemLink'
  },
  'taobao7': {
    list: 'ul li',
    dom: '.x',
    listen: '',
    lschild: '',
    url: 'a'
  },
  'taobao8': {
    list: '[class^=Card--doubleCardWrapper--]',
    dom: '[class^=Card--mainPicAndDesc] .imageSwitch--fJ9SrtEb'
  },
  'taobao9': {
    list: '[class^=Card--listCard--]',
    dom: '[class^=MainPic--listMod--]'
  },
  'taobao10': {
    list: '[class^=doubleCard--]',
    dom: '[class^=mainPicAndDesc--] .imageSwitch--fJ9SrtEb',
    parent: 'a'
  },
  'taobaoIndex': {
    list: '.tb-recommend-content-item',
    url: 'a.item-link',
    dom: '.img-wrapper'
  },
  'taobaoIndex1': {
    list: '.tb-pick-content-item',
    url: 'a.item-link',
    dom: '.img-wrapper'
  },
  'tmallSearch': {
    list: '[class^=Content--contentInner] > div',
    dom: '[class^=Card--mainPicAndDesc] .imageSwitch--fJ9SrtEb',
    url: 'a'
  }
};
const getTypes = () => {
  let urlPattern = {
    'list\\.tmall\\.com': 'tmall1',
    's\\.taobao\\.com': 'taobao1',
    'fake\\.taobao\\.com': 'taobao11',
    'www\\.taobao\\.com/market/': 'taobao2',
    'www\\.taobao\\.com/markets/promotion/': 'taobao3',
    'www\\.taobao\\.com/markets/amusement/': 'taobao6',
    'www\\.taobao\\.com/markets/': 'taobao7',
    'list\\.taobao\\.com': 'taobao4',
    'www\\.taobao\\.com': 'taobaoIndex'
  };
  let url = location.href;
  for (let i in urlPattern) {
    if (url.match(new RegExp(i))) {
      return urlPattern[i];
    }
  }
  return 'taobao8';
};
let callbacks, hasreq, urls;
const getPageInfo = (info, callback) => {
  let infoObj = {};
  if (hasreq) {
    callbacks = callback;
    urls = info.click_url;
    return;
  }
  let itemId = info.itemId;
  let obj = {
    itemNumId: itemId
  };
  let url = `https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=${encodeURIComponent(JSON.stringify(obj))}`;
  request.getPure(url).done(function (data) {
    try {
      let item = data.data.item;
      let seller = data.data.seller;
      let item2 = JSON.parse(data.data.apiStack[0].value);
      infoObj.title = item.title;
      infoObj.picUrl = item.images[0];
      infoObj.shopName = seller.shopName;
      infoObj.shopLogo = seller.shopIcon;
      infoObj.shopUrl = seller.shopUrl;
      infoObj.biz30Day = item2.item.sellCount;
      infoObj.discountPrice = (Number(item2.skuCore.sku2info['0'].price.priceMoney) / 100).toFixed(2);
    } catch (e) {
      (__webpack_require__(7129).error)(e);
    }
    if (!infoObj.title) {
      console.log(obj);
      infoObj.title = info.titleGot;
    }
    if (!infoObj.picUrl) {
      infoObj.picUrl = info.imgGot;
    }
    if (!infoObj.discountPrice) {
      infoObj.discountPrice = info.priceGot;
    }
    infoObj.id = itemId;
    infoObj.amount = info.coupon.coupon_money;
    infoObj.effectiveStartTime = info.coupon.start_time;
    infoObj.effectiveEndTime = info.coupon.end_time;
    infoObj.pid = info.pid;
    infoObj.tkl = info.tkl;
    infoObj.tmall = location.host.indexOf('tmall') > -1 ? true : false;
    callback(infoObj, info.click_url);
    if (callbacks) {
      callbacks(infoObj, urls);
    }
  });
};
const QRReloader = __webpack_require__(76855);
const addQRcode = (id, dom) => {
  if (hasReqId.indexOf(id) > -1) return;
  hasReqId.push(id);
  if (!id) return;
  let data = globalInfo[id];
  data.pid = '10002';
  data.itemId = id;
  console.log('dom:', dom);
  data.priceGot = parseInt($(dom).parents('.item').find('.price').text().replace(/ /g, '').replace('¥', ''));
  data.titleGot = $(dom).parents('.item').find('.title').text().replace(/ /g, '').replace(/\n/g, '');
  data.imgGot = $(dom).parents('.item').find('.pic img').attr('src');
  getPageInfo(data, function (newData, url) {
    let id = 'gwd-coupon-' + parseInt(Math.random() * 1000);
    let view = `<div class="minicoupon_detail" id="${id}">
        <img src="xxx">
        <span>微信扫码领券</span>
      </div>`;
    $(dom).append(view);
    QRReloader.init(newData, url, `#${id} > img`, function (newData2) {}, false, false);
  });
};
(__webpack_require__(60340).appendCss)(`
  .search_coupon_tip {
    z-index: 0;
  }`);
const renderCouponTip = (id, parentD, site) => {
  (__webpack_require__(7129).log)('renderCouponTip', id);
  let price = $(parentD).parent().find('.price strong').text();
  if (!price) {
    price = $(parentD).find('[class^=Price--priceInt]').text();
  }
  if (!price) {
    price = $(parentD).find('[class^=priceInt--]').text();
  }
  getCoupon.init(id, '10002', function (data) {
    if (!data) {
      (__webpack_require__(7129).log)('renderCouponTip nodata', id);
      globalCondition.setMet(`gwd-pricetip-data-${id}`, {
        type: 'none'
      });
      return;
    }
    if (!data.data) {
      (__webpack_require__(7129).log)('renderCouponTip nodata', id);
      globalCondition.setMet(`gwd-pricetip-data-${id}`, {
        type: 'none'
      });
      return;
    }
    data = data.data;
    if (data.rebate) {
      extConsole.log('renderCouponTip rebate', id, data.rebate);
      globalCondition.setMet(`gwd-pricetip-data-${id}`, {
        type: 'rebate',
        rebate: data.rebate
      });
      $(parentD).append(`<span class="search_coupon_tip" style="pointer-events: none">${G.lang === 'zh-tr' ? '可以領紅包' : '可以领红包'}</span>`);
      util.waitForConditionFn(() => $(parentD).parent().find('.mainPicAdaptWrapper--V_ayd2hD').length).then(() => {
        $(parentD).parent().find('.mainPicAdaptWrapper--V_ayd2hD').append(`<span class="search_coupon_tip" style="pointer-events: none">${G.lang === 'zh-tr' ? '可以領紅包' : '可以领红包'}</span>`);
      });
      return;
    }
    data.site = site;
    globalInfo[id] = data;
    const domain = G.from_device.includes('bijiago') ? 'bijiago' : 'gwdang';
    let browser = G.browser;
    if (G.from_device.includes('bijiago') || G.from_device.includes('biyibi')) {
      browser = 'chrome';
    }
    const productInfo = {
      title: $(parentD).find('[class^=title--]').text(),
      price: price,
      img: $(parentD).find('img[class^=mainPic--]').attr('src'),
      shopName: $(parentD).find('[class^=shopNameText--]').text(),
      saleAmount: $(parentD).find('[class^=realSales--]').text().replace('人付款', '')
    };
    let link = `${G.tb_server}/extension/qrpage?dp_id=${id}-83&tag=9_${browser}&discount=${data.coupon.coupon_money}&union=${G.union}&title=${encodeURIComponent(productInfo.title)}&price=${productInfo.price}&shopName=${encodeURIComponent(productInfo.shopName)}&img=${encodeURIComponent(productInfo.img)}&sellAmount=${encodeURIComponent(productInfo.saleAmount)}`;
    if (G.lang === 'zh-tr') {
      link += '&lang=zh-tr';
    }
    extConsole.log('renderCouponTip data', id, data);
    globalCondition.setMet(`gwd-pricetip-data-${id}`, {
      type: 'coupon',
      coupon: data.coupon.coupon_money
    });
    let dom = `<a href="${link}" data-id="${id}" title="当前商品点击领券立减${data.coupon.coupon_money}元" class="search_coupon_tip" target="_blank">￥${data.coupon.coupon_money} 优惠券</a>`;
    if (useQrCode) {
      dom = `<a  data-id="${id}" class="search_coupon_tip" style="cursor:default;" target="_blank">￥${data.coupon.coupon_money} 优惠券<a>`;
    }
    if (G.lang === 'zh-tr') {
      dom = dom.replaceAll('优惠券', '優惠券').replaceAll('当前商品点击领券立减', '當前商品點擊領券立減').replaceAll('元', '元');
    }
    const pos = $(parentD).css('position');
    if (pos === 'static') {
      $(parentD).css('position', 'relative');
    }
    $(parentD).append($(dom));
    util.waitForConditionFn(() => $(parentD).parent().find('.mainPicAdaptWrapper--V_ayd2hD').length).then(() => {
      $(parentD).parent().find('.mainPicAdaptWrapper--V_ayd2hD').append($(dom));
    });
  }, true, price);
};
const listenDom = () => {
  let lastCouponCount = 0;
  let timer = setInterval(() => {
    let couponCount = $('.search_coupon_tip').length;
    if (couponCount >= lastCouponCount) {
      lastCouponCount = couponCount;
      return;
    }
    clearInterval(timer);
    window.extNeedReload = true;
  }, 2000);
};
const renderInit = async () => {
  // 获取链接形式 不同页面  列表页不同
  extConsole.log('renderInit');
  let type = getTypes();
  if (!type) return;
  let obj = domPattern[type];
  let list;
  await util.waitForConditionFn(() => {
    list = $(obj['list']);
    if (type === 'taobao1' && list.length === 0) {
      obj = domPattern['taobao11'];
      list = $(obj['list']);
    }
    if (list.length === 0) {
      obj = domPattern['taobao8'];
      list = $(obj['list']);
    }
    if (list.length === 0) {
      obj = domPattern['taobao9'];
      list = $(obj['list']);
    }
    if (list.length === 0) {
      obj = domPattern['taobao10'];
      list = $(obj['list']);
    }
    if (list.length === 0) {
      obj = domPattern['tmallSearch'];
      list = $(obj['list']);
    }
    if (type === 'taobaoIndex' && list.length === 0) {
      obj = domPattern['taobaoIndex1'];
      list = $(obj['list']);
    }
    return list && list.length > 0;
  }, 1000, 10);

  // 对于新版淘宝，给每个商品添加class
  $('[class^=Card--mainPicAndDesc]').addClass('gwd-item').css('position', 'relative');
  $('[class^=MainPic--listMod--]').addClass('gwd-item').css('position', 'relative');
  $('[class^=mainPicAndDesc--]').addClass('gwd-item').css('position', 'relative');

  // 获取商品id
  for (let i = 0; i < list.length; i++) {
    let dom = list.eq(i);
    if (obj['url']) {
      dom = dom.find(obj['url']);
    }
    if (obj['parent']) {
      dom = dom.parents(obj['parent']);
    }
    if ($(dom).attr('gwd-coupon-checked')) continue;
    let id = null;
    let site = 'taobao';
    if (dom.length) {
      let href = dom.attr('href');
      if (!href) continue;
      if (href.indexOf('detail.tmall.com') > -1) site = 'tmall';
      id = href.match(/[?&]id=(\d+)/) && href.match(/[?&]id=(\d+)/)[1];
      if (!id) {
        id = dom.attr('data-nid');
      }
    } else {
      id = list.eq(i).find('.ww-light.ww-small').attr('data-item');
      (__webpack_require__(7129).log)('find new type id', id);
    }
    if (!id) continue;
    let appendDom = list.eq(i).find(obj['dom']);
    if (appendDom.length === 0) appendDom = list.eq(i);
    $(dom).attr('gwd-coupon-checked', 1);
    renderCouponTip(id, appendDom, site);
  }
  if (type.indexOf('taobao') > -1) {
    $(obj['listen']).find(obj['lschild']).attr('c_coupon', '1');
  }
  // $('body').on('click', function(e) {
  //   if ($(e.target).hasClass('search_coupon_tip')) {
  //     cnzz.log('click:searchcoupon')
  //     log('click:searchcoupon')
  //   }
  // })
  // $('body').on('mouseover', function(e) {
  //   if ($(e.target).hasClass('search_coupon_tip')) {
  //     let id = $(e.target).attr('data-id')
  //     if ($(e.target).find('.qr_coupondetail').length === 0 && useQrCode) {
  //       cnzz.log('track:searchcoupon')
  //       log('track:searchcoupon')
  //       addQRcode(id, e.target)
  //     }
  //   }
  // })
};
module.exports.init = () => {
  if (G.forbidCoupon) return;
  // 360浏览器版本不加载优惠券  不然审核不通过
  if (G.from_device === '360') return;
  // useQrCode = true;
  useQrCode = false;
  setTimeout(async function () {
    // 监听dom 有更新， 再一次加载优惠券
    // listenDom()
    await renderInit();
    // if ($('[class^=Card--doubleCard--]').length) {
    //   listenDom()
    // }
    const cb = (__webpack_require__(60340).limit)(renderInit);
    if ((location.href === 'https://www.taobao.com/' || location.href.startsWith('https://www.taobao.com/?')) && ($('.tb-recommend-content').length || $('.tb-pick-feeds-container').length)) {
      if ($('.tb-recommend-content').length) {
        $('.tb-recommend-content')[0].addEventListener('DOMNodeInserted', cb, false);
      }
      if ($('.tb-pick-feeds-container').length) {
        // $('.tb-pick-feeds-container')[0].addEventListener('DOMNodeInserted', cb, false)
        mutationObserver.observe('.tb-pick-feeds-container', (mutations, observer) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              cb();
            }
          }
        }, {
          childList: true,
          subtree: true
        });
      }
    }
    extConsole.log('searchCoupon loop check');
    if (location.href.startsWith('https://s.taobao.com')) {
      await (__webpack_require__(30888).waitForConditionFn)(() => {
        return $('#content_items_wrapper').length;
      });
      mutationObserver.observe('#content_items_wrapper', (mutations, observer) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            // extConsole.log('searchCoupon', 'A child node has been added or removed.');
            cb();
          }
        }
      }, {
        childList: true,
        subtree: true
      });
    }
  }, 1000);
};

/***/ }),

/***/ 77049:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
__webpack_require__(3362);
const commonUtil = __webpack_require__(60340);
var _default = exports.A = {
  props: ['data', 'top', 'additionalClass'],
  data() {
    return {
      mt: 0,
      debugMode: !!window.GwdToolkit,
      // debugMode: false,
      search: $('#key').val(),
      content: '',
      from: location.hostname === 'search.jd.com' || location.hostname === 'list.jd.com' ? '京东搜索结果页' : '商品详情页',
      rankName: '',
      id: parseInt(Math.random() * 10000)
    };
  },
  mounted() {
    if (this.top) {
      this.mt = this.top;
    }
    if (!window.gwdRank) {
      window.gwdRank = this;
    }
  },
  methods: {
    async rankClick(item) {
      if (!location.hostname.includes('.jd.com')) {
        window.open(item.rurl);
      }
      const link = commonUtil.getParameterByName('target_url', item.rurl);
      const contentId = commonUtil.getParameterByName('contentId', link);
      const rankType = commonUtil.getParameterByName('rankType', link);
      const payload = {
        functionId: 'getRankLanding',
        appid: 'JDReactRankingList',
        body: JSON.stringify({
          version: '109',
          rankType: rankType,
          source: 'dacu',
          rankId: contentId,
          extraParam: {},
          fromName: '-100',
          hasVenderRank: '1'
        }),
        clientVersion: '9.4.2',
        client: 'wh5',
        uuid: Date.now() * 1000 + parseInt(Math.random() * 1000),
        area: '1_2802_54747_0'
      };
      const url = (__webpack_require__(49388).buildUrl)(`https://api.m.jd.com/client.action`, payload);
      const res = await (__webpack_require__(49388).requestXHR)(url);
      this.content = JSON.stringify(res.result.products.map(item => {
        item.zyTag = parseInt(item.zyTag);
        return item;
      }));
      this.rankName = item.rname;
      let search = $('#key').val();
      this.search = search ? search : 'fake';
      this.$nextTick(() => {
        $('#gwd-jdrank-submit-' + this.id).click();
      });
    }
  },
  computed: {
    addition() {
      return this.data.length ? this.data.filter((item, idx) => idx > 0) : [];
    }
  }
};

/***/ }),

/***/ 77707:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-qr-scan[data-v-2bd1d232] {\n  width: 64px;\n  height: 22px;\n  background: #FF3532;\n  border-radius: 11px;\n  font-size: 12px;\n  color: white;\n  margin-left: 31px;\n  margin-right: 11px;\n  text-align: center;\n  line-height: 20px;\n  cursor: pointer;\n  position: relative;\n}\n.gwd-price-protect-qr[data-v-2bd1d232] {\n  display: none;\n  position: absolute;\n  box-sizing: border-box;\n  width: 148px;\n  height: 156px;\n  right: 0;\n  top: 36px;\n  border: 1px solid #ff3532;\n  background: #fff7f7;\n  z-index: 99;\n}\n.gwd-price-protect-qr img[data-v-2bd1d232] {\n  margin-top: 7px;\n  width: 120px;\n  height: 120px;\n}\n#gwd-price-protect:hover .gwd-price-protect-qr[data-v-2bd1d232] {\n  display: flex;\n}\n", ""]);

// exports


/***/ }),

/***/ 78579:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(82664);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("32ae82b8", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 78803:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ MiniTrendInfoBar)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/MiniTrendInfoBar.vue?vue&type=template&id=e0ed5136&scoped=true
var MiniTrendInfoBarvue_type_template_id_e0ed5136_scoped_true = __webpack_require__(66738);
;// ./src/standard/module/trend/MiniTrendInfoBar.vue?vue&type=template&id=e0ed5136&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/MiniTrendInfoBar.vue?vue&type=script&lang=js
var MiniTrendInfoBarvue_type_script_lang_js = __webpack_require__(90837);
;// ./src/standard/module/trend/MiniTrendInfoBar.vue?vue&type=script&lang=js
 /* harmony default export */ const trend_MiniTrendInfoBarvue_type_script_lang_js = (MiniTrendInfoBarvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/MiniTrendInfoBar.vue?vue&type=style&index=0&id=e0ed5136&prod&scoped=true&lang=less
var MiniTrendInfoBarvue_type_style_index_0_id_e0ed5136_prod_scoped_true_lang_less = __webpack_require__(25728);
;// ./src/standard/module/trend/MiniTrendInfoBar.vue?vue&type=style&index=0&id=e0ed5136&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/trend/MiniTrendInfoBar.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  trend_MiniTrendInfoBarvue_type_script_lang_js,
  MiniTrendInfoBarvue_type_template_id_e0ed5136_scoped_true/* render */.XX,
  MiniTrendInfoBarvue_type_template_id_e0ed5136_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "e0ed5136",
  null
  
)

/* harmony default export */ const MiniTrendInfoBar = (component.exports);

/***/ }),

/***/ 79696:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20363);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("b698d8de", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 79702:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const timeUtil = __webpack_require__(14396);
const template = __webpack_require__(26133);
const price_remind = __webpack_require__(57031);
const request = __webpack_require__(49388);
const userData = __webpack_require__(74222);
let log = __webpack_require__(35743);
let cnzz = __webpack_require__(5300);
let globalTime,
  retry = 0;
let hasGetTime;
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    //月份 
    "d+": this.getDate(),
    //日 
    "h+": this.getHours(),
    //小时 
    "m+": this.getMinutes(),
    //分 
    "s+": this.getSeconds(),
    //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3),
    //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};

// 最接近的半小时时间
// 12:31 -> 12:30
// 12:29 -> 12:30
Date.prototype.toHalfHourTime = function () {
  const original = this.getTime();
  return new Date(Math.round(original / (30 * 60000)) * (30 * 60000));
};
let userInfo = {};
module.exports.init = async () => {
  // let res = await $.ajax({
  //   url: 'https://www.gwdang.com/user/info',
  //   dataType: 'jsonp',
  //   jsonp: 'callback',
  //   xhrFields: {
  //     withCredentials: true
  //   }
  // })
  getSeckill();
};
const seckillRule = {
  "360buy": [{
    "secDom": "#yuyue-banner",
    "timeType": "t11",
    "secDom2": "#yuyue-banner .activity-type:contains('预约抢购')",
    "secTime": "#yuyue-banner .activity-message .J-time"
  }, {
    "secDom": "#banner-miaosha",
    "timeType": "M月D日H时M分",
    "secDom2": "#banner-miaosha .activity-type:contains('秒杀预告')",
    "secTime": "#banner-miaosha .activity-price strong"
  }, {
    "secDom": "#banner-miaosha",
    "timeType": "t12",
    "secDom2": "#banner-miaosha .activity-type:contains('京东秒杀')",
    "secTime": "#banner-miaosha .activity-message"
  }, {
    "secDom": "#pingou-banner",
    "timeType": "t13",
    "secDom2": "#pingou-banner .activity-type:contains('预售')",
    "secTime": "#pingou-banner .activity-message .J-time"
  }, {
    "secDom": "#banner-shangou .activity-type:contains('京东闪购')",
    //"timeType": "t14",
    "timeType": "t12",
    "secDom2": "#banner-shangou .activity-message:contains('预计')",
    "secTime": "#banner-shangou .activity-message"
  }, {
    // 预售商品，还没开始付定金
    "secDom": "#pingou-banner .activity-message:contains('距预售还需')",
    "timeType": "timeRangeSplitBy`-`",
    "secDom2": "#pingou-process dt:contains('支付定金')",
    "secTime": "#pingou-process .J-presale-time"
  }, {
    // 预售商品，使用尾款时间
    "secDom": "#pingou-process .J-balance-time",
    "timeType": "timeRangeSplitBy`-`",
    "secDom2": "#pingou-process dt:contains('支付尾款')",
    "secTime": "#pingou-process .J-balance-time"
  }, {
    // 预售商品，使用尾款时间
    "secDom": "#yuyue-process .J-step4",
    "timeType": "timeRangeSplitBy`-`",
    "secDom2": "#yuyue-process dt:contains('抢购中')",
    "secTime": "#yuyue-process .J-step4"
  }],
  "taobao-ju": [{
    "secDom": ".buyaction.J_JuSMSRemind",
    "timeType": "t21",
    "secDom2": ".ju-clock.J_juItemTimer>p:contains('开抢')",
    "secTime": ".ju-clock.J_juItemTimer>p"
  }],
  "taobao": [{
    "secDom": "#J_TaoQiangGou",
    "timeType": "t21",
    "secDom2": "#J_TaoQiangGou:contains('开始抢购')",
    "secTime": "#J_TaoQiangGou"
  }],
  "tmall": [{
    "secDom": "#tm-yushou-process-banner",
    "timeType": "t31",
    "secDom2": "#tm-yushou-process-banner .tm-yushou-process-title.tm-ys-title-one-row:contains('天猫预售')",
    "secTime": "#tm-yushou-process-banner .J_step2Time"
  }, {
    "secDom": ".tm-countdown .tb-btn-wait:contains('即将开始')",
    "timeType": "t32",
    "secDom2": ".tm-countdown .tm-countdown-notice:contains('距开售')",
    "secTime": ".tm-countdown .tm-countdown-timer"
  }],
  "suning": [{
    "secDom": "#timePanel",
    "timeType": "t41",
    "secDom2": "#timePanel .djh-title:contains('预定')",
    "secTime": "#timePanel .proinfo-cd"
  }, {
    "secDom": ".snqg-logo",
    "timeType": "M月D日 H时M分",
    "secDom2": ".djh-cd",
    "secTime": "#bigPolyTime"
  }, {
    "secDom": "#buyTime",
    "timeType": "X月X日X时X分X秒",
    "secDom2": ".step-4",
    "secTime": "#buyTime dd:contains('开始')"
  }],
  "xiaomi": [{
    "secDom": ".pro-time.J_proBook",
    "timeType": "t51",
    "secDom2": ".pro-time.J_proBook .pro-time-head:contains('预售')",
    "secTime": ".pro-time.J_proBook .time.J_bookTime"
  }],
  "kaola": [{
    "secDom": ".m-promotionbar",
    "timeType": "t61",
    "secDom2": ".m-promotionbar .prelimit .txt:contains('开抢')",
    "secTime": ".m-promotionbar .prelimit .txt"
  }],
  "dangdang": [{
    "secDom": "#count-down",
    "timeType": "t71",
    "secDom2": "#count-down .J-time-text:contains('尚未开始')",
    "secTime": "#count-down .J-time"
  }],
  "vmall": [{
    "secDom": "#buyProcessIDD",
    "timeType": "t81",
    "secDom2": "#buyProcessIDD ul li:first-child:contains('支付订金')",
    "secTime": "#startDateIDD"
  }]
};
const getSeckillTime = (type, ori_str) => {
  if (ori_str.length < 3) {
    return false;
  }
  let str;
  if (type !== "t81") {
    str = ori_str.replace(/\s/g, "");
  } else {
    str = ori_str;
  }
  let arr, newtime;
  let nowTime;
  let month, d, h, m, ss, ms;
  let year = new Date().getFullYear();
  switch (type) {
    case "X月X日X时X分X秒":
      arr = ori_str.match(/开始：(\d+)月(\d+)日(\d+)时(\d+)分(\d+)秒/);
      if (!arr) return false;
      nowTime = new Date();
      newtime = `${nowTime.getFullYear()}/${arr[1]}/${arr[2]}/${arr[3]}:${arr[4]}`;
      break;
    case `M月D日 H时M分`:
      arr = ori_str.match(/(\d+)月(\d+)日 (\d+):(\d+)/);
      if (!arr) return false;
      nowTime = new Date();
      newtime = `${nowTime.getFullYear()}/${arr[1]}/${arr[2]}/${arr[3]}:${arr[4]}`;
      break;
    case `M月D日H时M分`:
      arr = ori_str.match(/(\d+)月(\d+)日(\d+):(\d+)/);
      if (!arr) return false;
      nowTime = new Date();
      newtime = `${nowTime.getFullYear()}/${arr[1]}/${arr[2]}/${arr[3]}:${arr[4]}`;
      break;
    case "timeRangeSplitBy`-`":
      // eg: 2019-07-0300:00-2019-07-0700:00
      let date = ori_str.split(' ')[0].replace(/-/g, '/');
      newtime = date + '/' + ori_str.split(' ')[1].split('-')[0];
      break;
    case "t11":
      nowTime = new Date().getTime();
      arr = str.match(/(?:(\d+)|)(?:天|日|)(\d+)小时(\d+)分(\d+)秒/);
      if (!arr) return false;
      if ($('#yuyue-banner .activity-message .J-text').text() === '抢购剩余') {
        return false;
      }
      if ($('#pingou-banner .activity-message .J-text').text() === '距预售还需') {
        return false;
      }
      d = arr[1] || 0;
      h = arr[2] || 0;
      m = arr[3] || 0;
      ss = arr[4] || 0;
      ms = d * 86400000 + h * 3600 * 1000 + m * 60 * 1000 + ss * 1000;
      newtime = timeUtil(nowTime + ms, "6");
      break;
    case "t12":
      nowTime = new Date().getTime();
      arr = str.match(/预计([0-9:月日]+)开始/);
      if (!arr) return false;
      let htime = arr[1];
      newtime = timeUtil(nowTime, "5");
      if (htime.indexOf('日') > -1) {
        let month = htime.split('月')[0];
        let day = htime.split('日')[0].split('月')[1];
        newtime = newtime.split('/')[0] + `/${month}/${day}`;
        htime = htime.split('日')[1];
      }
      newtime = newtime + '/' + htime;
      break;
    case "t13":
      nowTime = new Date().getTime();
      arr = str.match(/(?:(\d+)|)(?:天|日|)(\d+)小?时(\d+)分(\d+)秒/);
      if (!arr) return false;
      if ($('.activity-message .J-text').text() === '预售剩余') {
        return false;
      }
      d = arr[1] || 0;
      h = arr[2] || 0;
      m = arr[3] || 0;
      ss = arr[4] || 0;
      ms = d * 86400000 + h * 3600 * 1000 + m * 60 * 1000 + ss * 1000;
      newtime = timeUtil(nowTime + ms, "6");
      break;
    case "t14":
      arr = str.match(/(\d+)月(\d+)日(\d+)\:(\d+)/);
      if (!arr) return false;
      month = Number(arr[1]) || 0;
      if (month < 10) month = "0" + month.toString();
      d = Number(arr[2]) || 0;
      if (d < 10) d = "0" + d.toString();
      h = arr[3] || 0;
      m = arr[4] || 0;
      // ms = month + d * 86400000 + h * 3600 * 1000 + m * 60 * 1000;
      newtime = `${year}/${month}/${d}/${h}:${m}`;
      break;
    case "t21":
      arr = str.match(/(\d+)月(\d+)日(\d+)\:(\d+)/);
      if (!arr) return false;
      month = Number(arr[1]) || 0;
      if (month < 10) month = "0" + month.toString();
      d = Number(arr[2]) || 0;
      if (d < 10) d = "0" + d.toString();
      h = arr[3] || 0;
      m = arr[4] || 0;
      // ms = month + d * 86400000 + h * 3600 * 1000 + m * 60 * 1000;
      newtime = `${year}/${month}/${d}/${h}:${m}`;
      break;
    case "t31":
      arr = ori_str.split("~");
      if (!arr) return false;
      newtime = arr[0].replace(/(?:\.|\s)/g, "/");
      break;
    case "t32":
      nowTime = new Date().getTime();
      arr = str.match(/(?:(\d+)|)(?:天|日|)(\d+)小?时(\d+)分/);
      if (arr && arr.length) {
        d = Number(arr[1]) || 0;
        if (d < 10) d = "0" + d.toString();
        h = arr[2] || 0;
        m = arr[3] || 0;
      } else {
        arr = str.match(/(\d+)分(\d+)秒/);
        d = 0;
        h = 0;
        m = arr[1];
      }
      ms = d * 86400000 + h * 3600 * 1000 + m * 60 * 1000;
      newtime = timeUtil(nowTime + ms, "6");
      break;
    case "t41":
      //苏宁
      nowTime = new Date().getTime();
      arr = str.match(/(?:(\d+)|)(?:天|日|)(\d+)小?时(\d+)分([0-9.]+)秒/);
      if (!arr) return false;
      d = parseInt(arr[1]) || 0;
      h = parseInt(arr[2]) || 0;
      m = parseInt(arr[3]) || 0;
      ss = parseInt(arr[4]) || 0;
      ms = d * 86400000 + h * 3600 * 1000 + m * 60 * 1000 + ss * 1000;
      newtime = timeUtil(nowTime + ms, "6");
      break;
    case "t51":
      nowTime = new Date().getTime();
      arr = str.match(/\s?(?:(\d+)|)\s?(?:天|日|)\s?(\d+)\s?小?时\s?(\d+)\s?分\s?(\d+)\s?秒/);
      if (!arr) return false;
      d = arr[1] || 0;
      h = arr[2] || 0;
      m = arr[3] || 0;
      ss = arr[4] || 0;
      ms = d * 86400000 + h * 3600 * 1000 + m * 60 * 1000 + ss * 1000;
      newtime = timeUtil(nowTime + ms, "6");
      break;
    case "t61":
      //kaola
      arr = str.match(/(\d+)月(\d+)日(\d+)\:(\d+)/);
      if (!arr) return false;
      month = Number(arr[1]) || 0;
      if (month < 10) month = "0" + month.toString();
      d = Number(arr[2]) || 0;
      if (d < 10) d = "0" + d.toString();
      h = arr[3] || 0;
      m = arr[4] || 0;
      // ms = month + d * 86400000 + h * 3600 * 1000 + m * 60 * 1000;
      newtime = `${year}/${month}/${d}/${h}:${m}`;
      break;
    case "t71":
      //dangdang
      nowTime = new Date().getTime();
      arr = str.match(/(?:(\d+)(?:天|日)|)(\d+)时(\d+)分(\d+)秒/);
      if (!arr) return;
      d = arr[1] || 0;
      h = arr[2] || 0;
      m = arr[3] || 0;
      ss = arr[4] || 0;
      ms = d * 86400000 + h * 3600 * 1000 + m * 60 * 1000 + ss * 1000;
      newtime = timeUtil(nowTime + ms, "6");
      break;
    case "t81":
      arr = str.split("~");
      if (!arr) return;
      newtime = arr[1].trim();
      newtime = newtime.replace(/[\s\.]/g, "/");
      break;
  }
  return newtime;
};
const getSeckill = () => {
  let seckillItem = seckillRule[G.site];
  if (!seckillItem) return;
  for (let i = 0; i < seckillItem.length; i++) {
    let sitem = seckillItem[i];
    if ($(sitem["secDom"]).length > 0 && $(sitem["secDom2"]).length > 0) {
      let newtime = getSeckillTime(sitem["timeType"], $(sitem["secTime"]).text());
      if (newtime) {
        globalTime = newtime;
        //console.log('newtime:', newtime)
        let strTime = newtime.split('/');
        let d = new Date(`${strTime[0]}/${strTime[1]}/${strTime[2]} ${strTime[3]}`);
        if (d.getTime() - new Date().getTime() < 300000) {
          continue;
        }
        renderSeckill();
        break;
      }
    }
  }
  if (!globalTime && retry < 5) {
    retry++;
    setTimeout(getSeckill, 500);
  }
};
let needLog = false;
const renderSeckill = async () => {
  let res = await request.get('https://www.gwdang.com/user/info');
  userInfo = res.data;
  let html = __webpack_require__(7583);
  $('#gwd_mini_remind').remove();
  $('#gwd_mini_compare').after(html);
  const CommonLogin = (__webpack_require__(36664)["default"]);
  new Vue({
    el: '#gwd-bjd-login-box',
    render: h => h(CommonLogin, {
      props: {
        position: 'gwd-mini',
        showAlterLogin: true,
        alterLoginPosition: 'row'
      }
    })
  });

  // 获取当前提醒状态
  let dp_query = userData.get('dp_query');
  const currentStatus = await request.get(`${G.c_server}/brwext/remind_intime?opt=get&id=${dp_query.dp.dp_id}`);
  addEvent();
  if (currentStatus.msg === "未收藏" || currentStatus.msg === "用户未登录") {
    log('detected:seckillRemind');
    cnzz.log('抢购提醒', '监测到页面抢购');
    needLog = true;
    SeckillSetState(false);
  } else {
    SeckillSetState(true);
  }
};
let secKillState;
const SeckillSetState = state => {
  secKillState = state;
  if (state) {
    $('.sk-remind-btn').hide();
    if (userInfo.wx == "1") {
      $('.sk-remind-state1').show();
    } else {
      $('.sk-remind-state1').hide();
    }
    $('#gwd_mini_seckill').addClass('seckillSet');
    $('#gwd_mini_seckill .minibar-btn-box>span').text("已设抢购提醒");
    if (needLog) {}
  } else {
    //$('.sk-remind-btn').hide()
  }
};
var socketSet = false;
var showedOnce = false; // 抢购提醒是否展示过一次

const addEvent = () => {
  price_remind.getQRcode();
  window.refQRCode = price_remind.getQRcode;
  $('#gwd_mini_seckill').on('mouseenter', () => {
    if (G.email) {
      $('.seckill-detail').show();
      $('.seckill-detail').css('width', '205px');
      if (!socketSet && userInfo.wx == "0") {
        // 未绑定微信的情况，不显示提醒按钮
        // 同时打开websocket
        log('notBind:seckillRemind');
        cnzz.log('抢购提醒', '未绑定');
        $('.sk-remind-state0').show();
        if (!secKillState) {
          $('.sk-remind-state1').hide();
        }
        $('.sk-remind-btn').hide();
        renderWebsocket();
      }
      if (needLog) {
        if ($('.sk-remind-btn').css('display') !== 'none') {
          if (!showedOnce) {
            log('showButton:seckillRemind');
            cnzz.log('抢购提醒', '显示设置提醒按钮');
          }
        }
      }
      showedOnce = true;
    } else {
      $('.login-detail').show();
    }
  });
  $('#gwd_mini_seckill').on('mouseleave', () => {
    $('.seckill-common-detail').hide();
  });
  $('.sk-remind-btn').on('click', async () => {
    log('click:seckillRemind');
    cnzz.log('抢购提醒', '设置按钮点击');
    let dp = userData.get('dp_query');
    const time = new Date(globalTime).toHalfHourTime().format("yyyy-MM-dd hh:mm:ss");
    //return
    const title = G.dp.name.replace(' ', '');
    const res = await request.get(`${G.c_server}/brwext/remind_intime?opt=add&id=${dp.dp.dp_id}&title=${encodeURIComponent(title)}&stime=${time}&url=${encodeURIComponent(location.href)}`);
    if (res.code === 1 || res.msg === '重复收藏') {
      if (res.code === 1) {
        log('setComplete:seckillRemind');
        cnzz.log('抢购提醒', '设置成功');
      }
      SeckillSetState(true);
    }
  });

  //price_remind.init()
  $('#loginClickBtn').on('click', () => {
    let userN = $('.bjd-login-box .username').val();
    let psd = $('.bjd-login-box .password').val();
    if (userN && psd) {
      price_remind.loginRenderTop();
      (__webpack_require__(23107).userLogin)(userN, psd, function () {
        location.reload();
      });
    } else {
      $('#login_remind_tle').css('display', 'block').fadeOut(5000);
      return;
    }
  });
};
let heartInterval = 0;
const renderWebsocket = () => {
  // $.ajax({
  //     url: 'https://www.gwdang.com/user/info',
  //     xhrFields: {
  //       withCredentials: true
  //     },
  //     //crossDomain: true
  //   })
  var socket = new WebSocket("wss://www.gwdang.com/sck");
  socket.onopen = () => {};
  socket.onmessage = evt => {
    let res = JSON.parse(evt.data);
    if (res.msg == "Bind") {
      userInfo.wx = "1";
      $('.sk-remind-state0').hide();
      if (secKillState) {
        $('.sk-remind-state1').show();
      } else {
        $('.sk-remind-btn').show();
      }
      if (needLog) {
        cnzz.log('抢购提醒', '用户已绑定');
        log('userBindComplete:seckillRemind');
      }
      window.clearInterval(heartInterval);
      socket.close();
    }
  };
  socket.onclose = () => {};
  socket.addEventListener('open', async function (evt) {
    socketSet = true;
    let accountInfo = {
      action: 'bindWechatExt',
      msg: {
        uid: userInfo.uid
      }
    };
    socket.send(JSON.stringify(accountInfo));
    heartInterval = setInterval(() => {
      socket.send('{"ping": "pong"}');
    }, 10000);
  });
};
module.exports.getNewTime = () => {
  hasGetTime = true;
  return globalTime;
};

/***/ }),

/***/ 79899:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "#gwd-tb-mini-coupon[data-v-50ed28b8] {\n  height: 40px;\n  text-decoration: none;\n  border: 1px solid #f0f3f5;\n  border-radius: 4px;\n  padding-right: 12px;\n  box-sizing: border-box;\n  margin-bottom: 10px;\n  display: none;\n  position: relative;\n}\n.miniPanel #gwd-tb-mini-coupon[data-v-50ed28b8] {\n  display: flex;\n}\n.gwd-rnd-btn-click[data-v-50ed28b8] {\n  display: inline-flex;\n  width: 60px;\n  height: 20px;\n  border-radius: 4px;\n  color: white;\n}\n.gwd-coupon-color-bg.gwd-br[data-v-50ed28b8] {\n  right: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 79902:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwd-row gwd-align",
    class: {
      "gwd-butie": _vm.text.includes("补贴") && _vm.mainColor === "#11a14e"
    },
    staticStyle: {
      "margin-right": "18px"
    },
    attrs: {
      title: "点击领取",
      target: "_blank",
      id: "gwd-tb-mini-coupon",
      href: _vm.link
    }
  }, [_vm.showStampBg ? _c("div", {
    staticClass: "gwd-coupon-color-bg gwd-tl"
  }) : _vm._e(), _vm._v(" "), _vm.showStampBg ? _c("div", {
    staticClass: "gwd-coupon-color-bg gwd-br"
  }) : _vm._e(), _vm._v(" "), _c("img", {
    staticStyle: {
      height: "20px",
      "margin-left": "8px",
      "z-index": "1"
    },
    attrs: {
      src: _vm.icon,
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    style: `margin-left: 4px; color: ${_vm.mainColor}; font-size: 14px; position: relative; top: -2px;`,
    domProps: {
      innerHTML: _vm._s(_vm.text)
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }, [_vm.rebate ? _c("Stamp", {
    staticStyle: {
      right: "74px",
      top: "0",
      position: "absolute"
    },
    attrs: {
      value: _vm.rebate
    }
  }) : _vm._e()], 1), _vm._v(" "), _c("span", {
    staticClass: "gwd-rnd-btn-click gwd-row gwd-align gwd-jcc",
    style: `z-index: 1; background: linear-gradient( 180deg, ${_vm.secondColor} 0%, ${_vm.mainColor} 100%);`
  }, [_c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "transform-origin": "center center",
      position: "relative",
      top: "-1px"
    }
  }, [_vm._v("点击领取")])])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 80300:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-price[data-v-deec5212] {\n  color: #ff4449;\n  height: 24px;\n  line-height: 24px;\n  font-weight: 500;\n  font-family: \"PingFang SC-Medium\", \"PingFang SC\";\n}\n", ""]);

// exports


/***/ }),

/***/ 80339:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(26910);
let communicate = __webpack_require__(79560);
let buildTaobaoUrl = __webpack_require__(77342);
let dataShare = __webpack_require__(34810);
let globalData, callbacks;
let hasrun = false;
let timeOUT = 4000;
var trueClassId = false;
let sitearr = ['vipshop', 'mogujie', 'meilishuo', 'amazon', 'yougou', 'yohobuy', '6pm', 'yintai', 'banggo', 'xiu', 'vancl', 'shopbop', 'shopin', 's', 'masamaso', 'secoo', 'mei', 'gap', 'paixie', 'moonbasa', 'meici', 'macys', 'myhabit', 'zhen', 'gilt', 'mbaobao', 'wangfujing', 'letao', 'camel', 'handu', 'mf910', '5lux', 'd1', 'taoxie', 'm18', "thewatchery", "escentual", 'biccamera', 'zhe800', 'yangkeduo'];
if (location.host.indexOf('amazon') > -1 && location.host.indexOf('cn') == -1) timeOUT = 10000;
let editData = data => {
  let taobaoarr = [],
    tmallarr = [],
    guessarr = [];
  try {
    let info = JSON.parse(data);
    let array = info.mods.itemlist.data.collections;
    if (array.length == 0) return;
    if (array.length == 2 && array[0].title == '外观相似宝贝') {
      let similar = array[0].auctions;
      let len = similar.length > 20 ? 20 : similar.length;
      for (let i = 0; i < len; i++) {
        let item = {};
        let feeDesc = similar[i].view_fee == '0.00' ? '包邮' : '';
        item.nick = similar[i].nick;
        item.num_iid = similar[i].nid;
        item.title = similar[i].title;
        item.price = similar[i].view_price;
        item.item_location = similar[i].item_loc;
        item.store_name = similar[i].nick + feeDesc;
        item.pic_url = 'http:' + similar[i].pic_url;
        item.volume = similar[i].view_sales.replace('人付款', '');
        item.type = 'img_search';
        item.price2 = Number(item.price);
        if (G.dp.price && item.price2 * 2 < G.dp.price) continue;
        if (!item.pic_url.match(/jpg_[0-9]+x[0-9]/)) item.pic_url = item.pic_url.replace(/(\.png|\.jpg)/, '$1' + '_100x100.jpg');
        let obj = {
          'source': 'img_search',
          'img_url': 'http:' + similar[i].pic_url,
          'title': similar[i].title,
          'price': similar[i].view_price,
          'shop_name': similar[i].nick + feeDesc,
          'sales': similar[i].view_sales.replace('人付款', ''),
          'id': similar[i].nid,
          'url': 'https:' + similar[i].detail_url,
          'discuss': similar[i].comment_count,
          'istaobao': similar[i].detail_url.indexOf('detail.tmall.com') > -1 ? '0' : '1',
          'dp_id': similar[i].nid + '-' + (similar[i].detail_url.indexOf('detail.tmall.com') > -1) ? '83' : '123',
          'site_id': similar[i].detail_url.indexOf('detail.tmall.com') > -1 ? '83' : '123'
        };
        item.url = buildTaobaoUrl(obj);
        if (similar[i].detail_url.indexOf('detail.tmall.com') > -1) {
          tmallarr.push(item);
        } else {
          taobaoarr.push(item);
        }
      }
    } else if (array.length == 1 && array[0].title == '您可能会喜欢' || array.length == 2 && array[1].title == '您可能会喜欢') {
      let guess = array[array.length - 1].auctions;
      for (let i = 0; i < guess.length; i++) {
        let item = {};
        item.url = 'https:' + guess[i].detail_url;
        item.pic_url = guess[i].pic_url;
        item.title = guess[i].title;
        item.num_iid = guess[i].nid;
        item.price = guess[i].view_price;
        item.volume = guess[i].view_sales;
        item.nick = guess[i].nick;
        item.price2 = Number(item.price);
        if (G.dp.price && item.price2 * 2 < G.dp.price) continue;
        guessarr.push(item);
      }
    }
    taobaoarr = sortData(taobaoarr);
    tmallarr = sortData(tmallarr);
    globalData = {
      'taobao': taobaoarr,
      'tmall': tmallarr,
      'guessfavor': guessarr
    };
    if (callbacks && !hasrun) {
      callbacks(globalData);
      hasrun = true;
    }
  } catch (e) {}
};
let sortData = data => {
  if (!data.sort) return;
  data = data.sort((value1, value2) => {
    if (Number(value1.price) > Number(value2.price)) return 1;else if (Number(value1.price) == Number(value2.price)) return 0;else return -1;
  });
  return data;
};
let getImgSrc = () => {
  let imgsrc = {
    '360buy': '#preview .jqzoom img',
    'gome': '.jqzoom img',
    'suning': '#imgZoom #bigImage',
    'yihaodian': '#J_prodImg',
    'vancl': '#midimg',
    'shopin': '#zoom1 img',
    'secoo': '.jqzoom',
    'mei': '#bigimg',
    'meici': '.zoomPad img',
    'macys': '#mainView_1',
    'taoxie': '#t_PreviewImage img',
    'd1': '.gs_right_spimg img',
    '5lux': '.cloudzoom',
    'mf910': '#op_product_zoom img',
    'handu': '#masterImage',
    'camel': '#img_jqzoom',
    'letao': '#simgouter img',
    'wangfujing': '.zoomPad .lazy-pic',
    'zhen': '#zoom1 .a_max_pic',
    'shopbop': '#productImage',
    'yohobuy': '#img-show',
    'taobao': '#J_ImgBooth',
    'thewatchery': '#detailimage',
    'amazon': '#altImages ul li img',
    'mogujie': '#J_BigImg',
    'escentual': '#zoom1 img',
    'biccamera': '#PROD-CURRENT-IMG',
    'zhe800': '#detail .deteilpic ul li img',
    'vipshop': '#J-mer-ImgReview .zoomPad>img',
    'tmall': '#J_ImgBooth',
    '1688': '#mod-detail-bd .content .box-img img',
    'vip': '#J-mer-ImgReview .zoomPad>img',
    'meilishuo': '#picture .item-pic-origin>img',
    'jumei': '#etalage li>img',
    '6pm': '#detailImage img',
    'banggo': '.mainPicContent',
    'vjia': '#FreshDiv_MainPhoto .sp-bigImg img',
    'yougou': '#pD-bimg',
    'yintai': '#J_Magnifier img',
    'okbuy': '#zoom1 img',
    'lovo': '#jqzoom .zoomPad img',
    'moonbasa': '#largeimg',
    'tonlion': '.good_left .jqzoom',
    'xiu': '#imgPic',
    'lamiu': '#op_product_zoom img',
    'masamaso': '.goods_tp_box .zoomPad img',
    's': '.goods-detail-pic a img',
    'paixie': '#zoom1 img',
    'mbaobao': '#goods-zoom img',
    'm18': '#GoodsImage',
    'gap': '#wrap.all-images-box a img',
    'esprit': '#mainImages .m-pic img',
    'yangkeduo': '#banner .islider-outer .islider-active img'
  };
  if (imgsrc[G.site]) {
    let src = $(imgsrc[G.site]).eq(0).attr('src');
    if (location.host == 'www.amazon.co.jp' && src && src.match(/SR[0-9]+,[0-9]+/)) {
      src = src.replace(/SR([0-9]+)\,([0-9]+)/, 'SR' + '$1' + '0' + ',' + '$2' + '0');
    } else if (location.host.indexOf('amazon') > -1) {
      return false;
    }
    if (src && !src.match(/(?:http:|https:)/) && src.indexOf('//') > -1) src = 'http:' + src;
    if (G.site === 'zhe800') {
      src = src.replace('58x58.jpg', '220x220.jpg');
    }
    if (!src || src.indexOf('base64') > -1) {
      return false;
    }
    return src;
  }
  return false;
};
let readyImg = trueClassId => {
  let src = getImgSrc();
  if (sitearr.indexOf(G.site) > -1 && location.host != 'www.amazon.cn' || location.host.indexOf('1688') > -1 || trueClassId) {
    trueClassId = true; //发了请求都可以等，为true init里面才不会return
    communicate.trigger({
      type: 'getTaobaoImgInfo',
      src: src
    });
    communicate.on(data => {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data.type == 'getTaobaoImgInfo') {
        let text = $('#gwd_img_info').text();
        if (text != '') editData(text);
      }
    });
  }
};
module.exports.ready = () => {
  if (G.site == 'taobao' || G.site == 'tmall' || G.site.indexOf('taobao') > -1) {
    return;
  }
  let dpdata = dataShare.get('dp_data');
  let classId = dpdata && dpdata['now']['class_id'];
  let code = dpdata && dpdata['code-server']['code'];
  if (G.site === 'amazon' && code) return;
  if (classId) classId = classId.slice(0, 2);
  if (G.site === '360buy') {
    let cate_id = G.dp.cat_id;
    if (cate_id) cate_id = cate_id.split('-')[0];
    let cateidArr = ["1620", "1315", "1318", "1672", "1319", "5025", "6144", "15248", "11729"];
    if (cateidArr.indexOf && cateidArr.indexOf(cate_id) > -1) {
      trueClassId = true;
    }
  } else {
    if (classId == "13" || classId == "24" || classId == "1A" || classId == '21') trueClassId = true;
  }
  readyImg(trueClassId);
};
module.exports.uniqPidGetImg = callback => {
  readyImg(true);
  callbacks = callback;
};
module.exports.init = callback => {
  if (!trueClassId && sitearr.indexOf(G.site) == -1) {
    callback(null);
    return;
  }
  if (globalData) {
    callback(globalData);
    hasrun = true;
  } else callbacks = callback;
  setTimeout(() => {
    if (callbacks && hasrun === false) {
      callbacks(null);
      hasrun = true;
    }
  }, timeOUT);
};

/***/ }),

/***/ 80585:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-epic-bar-container gwd-row",
    style: _vm.type === "top" ? "margin-top: 6px;" : ""
  }, [_c("div", {
    staticClass: "gwd-epic-price gwd-row gwd-align",
    style: _vm.type === "top" ? "margin-right: 0px;" : "",
    on: {
      mouseover: _vm.draw
    }
  }, [_vm._v("\n    " + _vm._s(_vm.priceStatusText) + "\n    "), _c("img", {
    staticStyle: {
      "margin-left": "6px",
      transform: "scale(0.5)",
      "transform-origin": "left center"
    },
    attrs: {
      src: _vm.priceTrendIcon,
      alt: ""
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-price-trend-panel"
  }, [_c("div", {
    staticClass: "gwd-top-price gwd-row"
  }, [_c("span", {
    staticClass: "gwd-price-text",
    staticStyle: {
      "border-color": "#ff5627",
      color: "#ff5627"
    }
  }, [_vm._v("最高: $" + _vm._s(parseFloat(_vm.data.store[0].highest).toFixed(2)))]), _vm._v(" "), _c("span", {
    staticClass: "gwd-price-text",
    staticStyle: {
      "border-color": "#9ed81e",
      color: "#9ed81e"
    }
  }, [_vm._v("最低: $" + _vm._s(parseFloat(_vm.data.store[0].lowest).toFixed(2)))])]), _vm._v(" "), _c("span", {
    staticStyle: {
      position: "absolute",
      color: "#777777",
      "font-size": "12px",
      top: "37px",
      left: "28px",
      "z-index": "3"
    }
  }, [_vm._v("价格(US$)")]), _vm._v(" "), _c("div", {
    ref: "plotArea",
    staticStyle: {
      "margin-top": "-1px",
      height: "207px"
    }
  })])])]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 80636:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ ProductItemvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ ProductItem)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/ProductItem.vue?vue&type=template&id=fa024638&scoped=true
var ProductItemvue_type_template_id_fa024638_scoped_true = __webpack_require__(1123);
;// ./src/standard/module/components/ImgSame/ProductItem.vue?vue&type=template&id=fa024638&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/ProductItem.vue?vue&type=script&lang=js
var ProductItemvue_type_script_lang_js = __webpack_require__(2131);
;// ./src/standard/module/components/ImgSame/ProductItem.vue?vue&type=script&lang=js
 /* harmony default export */ const ImgSame_ProductItemvue_type_script_lang_js = (ProductItemvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/ProductItem.vue?vue&type=style&index=0&id=fa024638&prod&scoped=true&lang=less
var ProductItemvue_type_style_index_0_id_fa024638_prod_scoped_true_lang_less = __webpack_require__(24139);
;// ./src/standard/module/components/ImgSame/ProductItem.vue?vue&type=style&index=0&id=fa024638&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/ImgSame/ProductItem.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  ImgSame_ProductItemvue_type_script_lang_js,
  ProductItemvue_type_template_id_fa024638_scoped_true/* render */.XX,
  ProductItemvue_type_template_id_fa024638_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "fa024638",
  null
  
)

/* harmony default export */ const ProductItem = (component.exports);

/***/ }),

/***/ 81518:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      height: "100%",
      "flex-wrap": "nowrap",
      overflow: "hidden"
    }
  }, _vm._l(_vm.data, function (item) {
    return _c("a", {
      key: item.url,
      staticClass: "gwd-amazon-link",
      attrs: {
        href: item.url,
        target: "_blank"
      }
    }, [_vm._v("\n    " + _vm._s(item.title) + "售价" + _vm._s((item.pri / 100).toFixed(2)) + _vm._s(_vm.unit) + "\n  ")]);
  }), 0);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 82016:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _CollectionSettingMixin = _interopRequireDefault(__webpack_require__(34246));
var _CommonLogin = _interopRequireDefault(__webpack_require__(36664));
var _Switch = _interopRequireDefault(__webpack_require__(99230));
var _QuestHint = _interopRequireDefault(__webpack_require__(10809));
var _PriceInput = _interopRequireDefault(__webpack_require__(84140));
var _default = exports.A = {
  mixins: [_CollectionSettingMixin.default],
  components: {
    CommonLogin: _CommonLogin.default,
    SwitchBtn: _Switch.default,
    QuestHint: _QuestHint.default,
    PriceInput: _PriceInput.default
  }
};

/***/ }),

/***/ 82082:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-tip[data-v-500de42c] {\n  margin-left: 12px;\n  margin-right: 12px;\n  box-sizing: border-box;\n  padding-left: 12px;\n  background: #f4fcff;\n  color: #05adec;\n  font-size: 12px;\n  font-weight: bold;\n  text-align: left;\n  height: 30px;\n  line-height: 30px;\n  margin-top: 12px;\n}\n", ""]);

// exports


/***/ }),

/***/ 82110:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const template = __webpack_require__(26133);
const userData = __webpack_require__(74222);
const log = __webpack_require__(35743);
const store = __webpack_require__(92771);
const extConsole = __webpack_require__(7129);
const {
  default: MiniBarCollectionButton
} = __webpack_require__(43642);

//嵌入位置设置
let sitePattern = {
  'ymatou': ['.price-panel'],
  'hihonor': ['.product-price'],
  'amazon': ['#price_feature_div', '#unifiedPrice_feature_div'],
  'vmall': ['.product-info .product-info-list', '.pro-right .pro-meta-area', '.pro-price'],
  'yougou': ['#ygprice_area'],
  'gome': ['.prdprice', '#bargain', '.prd-price-1'],
  'vipshop': ['.pi-price-box'],
  '360buy': ['#sx-discount', '#summary-price', '.summary-price', '#surplus-time', '#product-intro #price'],
  '360buy-book': ['#summary-price'],
  '360buy-re': ['.shop_intro .shop_intro_a'],
  'taobao': ['.tm-fcs-panel', '#J_PromoPrice', '#J_StrPriceModBox', '[class^=MiniHead--miniPanelHead--]', {
    selector: '[class^=PurchasePanel--contentWrap--] > [class^=CouponInfo--couponInfo]',
    position: 'after'
  }, {
    selector: '[class^=Price--root]',
    position: 'after'
  }, '[class^=SecurityPrice--securityPrice]', {
    selector: '[class^=MiniHead--miniPanelHead--]',
    position: 'after'
  }, {
    selector: '[class^=Address--MCDelivery--]',
    position: 'before'
  }],
  'taobao-ju': ['.J_BuySubForm', '[class^=MiniHead--miniPanelHead--]'],
  'taobao-95095': ['.tm-fcs-panel', '#J_PromoPrice', '#J_StrPriceModBox', '[class^=MiniHead--miniPanelHead--]'],
  'tmall': ['.tm-fcs-panel', '#J_PromoPrice', '#J_StrPriceModBox', '[class^=MiniHead--miniPanelHead--]',
  // {
  //   selector: '[class^=CouponInfo--couponInfo]',
  //   position: 'before'
  // },
  {
    selector: '[class^=PurchasePanel--contentWrap--] > [class^=CouponInfo--couponInfo]',
    position: 'after'
  }, {
    selector: '[class^=Price--root]',
    position: 'after'
  }, '[class^=SecurityPrice--securityPrice]', {
    selector: '[class^=MiniHead--miniPanelHead--]',
    position: 'after'
  }, {
    selector: '[class^=Address--MCDelivery--]',
    position: 'before'
  }],
  '51buy': ['.xbase_item:contains("促销价")', '.xbase_item:contains("易迅价")', '#goods_detail_mate .item_icson', '.xbase_row2', '#promotePrice', '#shopprice', '#promotePriceArea'],
  'suning': ['#noPrice', '#_main_price', '#existPrice', '#netPriceBox', '#hasPrice', '#mainPrice', '#priceDom'],
  'dangdang': ['.price_time', '.d15_price_info', '.price_qiang', '.price_info', '.show_info .sale>p', '.sale_box:first'],
  'yihaodian': ['#point_productPrice', '.price_array', '#currentPriceArea'],
  'vancl': ['#pricearea .cuxiaoPrice'],
  'newegg': ['.neweggPrice', '.goods_price_now'],
  'kaola': ['.m-price-wrap .m-price'],
  'lenovo': ['#div_product_dec', '#span_product_name'],
  'microsoftstore': ['.priceAndRank'],
  'bookuu': ['.bc-e5.pd-15'],
  'xiaomi': ['.J_saleWrap.sale-wrap', '.pro-time.J_proSeckill', '.goods-info-head-price', '.pro-time.J_proOrder', '.price-info'],
  "youpin-mi": [".sku-container .price-line"],
  'okbuy': ['.prodPriceLiJ .prodPrice'],
  'banggo': ['.mbshop_detail_baseinfo'],
  'you163': ['.price>.f-clearfix'],
  'colipu': ['.product-price'],
  'nbdeli': ['#pomotion_befor'],
  '3c2p': ['#goodsPrice'],
  'comix': ['.price-panel']
};
const getContainer = () => {
  let site = G.site;
  if (site === '360buy' && (__webpack_require__(60340).isNewJd)()) {
    sitePattern['360buy'].unshift('#summary-quan');
    sitePattern['360buy'].unshift('.floor-discount');
    sitePattern['360buy'].unshift('#sx-discount');
    (__webpack_require__(60340).appendCss)(`
      .itemInfo-wrap .summary-price-wrap { z-index: 4 }
    `);
  }
  let patterns = sitePattern[site];
  if (!patterns || patterns && patterns.length === 0) return false;
  for (let i = 0; i < patterns.length; i++) {
    const selector = patterns[i].selector || patterns[i];
    const position = patterns[i].position || 'after';
    if ($(selector).length > 0) {
      return {
        selector,
        position
      };
    }
  }
  return false;
};
let miniBarBg;
__webpack_require__(79696);
const renderMiniBar = container => {
  (__webpack_require__(7129).log)('render minibar begin', G.instanceId);
  let newTime = (__webpack_require__(79702).getNewTime)();
  if (newTime - new Date().getTime() < 300000) {
    newTime = false;
  }
  // let href = encodeURIComponent(document.location.href);
  // let html = require('art-template-loader!../views/miniBar.html')
  // let setUrl = `${G.server}/brwext/setting?from=${G.from_device}`;
  // let feedbackUrl = `https://www.${G.extName}.com/brwext/suggest?refer=${href}&from_device=${G.from_device}`;
  // let priceContainer = (html)({
  //   'setUrl': setUrl,
  //   'aliSite': G.aliSite,
  //   'feedbackUrl': feedbackUrl,
  //   newTime: false,
  //   minidom: G.wishdom2,
  //   wishdom: G.wishdom
  // })
  const priceContainer = document.createElement('div');
  if (container.position === 'append') {
    $(container.selector).append(priceContainer);
  } else if (container.position === 'before') {
    $(container.selector).eq(0).before(priceContainer);
  } else {
    $(container.selector).eq(0).after(priceContainer);
  }
  const MiniBar = (__webpack_require__(26814)/* ["default"] */ .A);
  new Vue({
    el: priceContainer,
    render: h => h(MiniBar, {
      props: {
        newTime,
        aliSite: G.aliSite
      }
    })
  });
  (__webpack_require__(7129).log)('render minibar end', G.instanceId);
  miniBarBg = $('.gwd-minibar-bg');
};
let times = 0;
const kaolaHkRepair = dom => {
  if (times >= 10) {
    return;
  }
  times++;
  if ($('.m-price-wrap .m-price .currentPrice').text().match(/\d/)) {
    $(dom).eq(0).after($('#kaolaHkRepair>span').next());
    $('#kaolaHkRepair').remove();
    return;
  }
  setTimeout(function () {
    kaolaHkRepair(dom);
  }, 1000);
};
const parsePrice = price => {
  if (parseInt(price) > 999999) {
    return parseInt(price);
  } else {
    return price;
  }
};
const addEvent = () => {
  $('.gwd-minibar-bg').on('mouseenter', '.minibar-tab', function () {
    $('#gwd_minibar').addClass('ms_enter');
    $(this).addClass('ms-tab-enter');
    let id = $(this).attr('id');
    $(`#${id}_detail`).show();
    if (id === "mini_price_history") {
      log("minitrend-show");
      (__webpack_require__(75957).calLineHeight)();
    }
    $('body').addClass('gwd-tab-hover-p');
  });
  $('.gwd-minibar-bg').on('mouseleave', '.minibar-tab', function () {
    $('#gwd_minibar').removeClass('ms_enter');
    $(this).removeClass('ms-tab-enter');
    $(this).removeClass('ms-tab-enter');
    let id = $(this).attr('id');
    $('body').removeClass('gwd-trend-hover-p');
    $('body').removeClass('gwd-tab-hover-p');
    $(`#${id}_detail`).hide();
  });
  $('#mini_price_history').on('mouseleave', () => {
    const whiteList = ['item.jd.com', 'item.jingdonghealth.cn', 'npcitem.jd.hk'];
    if (window.gwdMiniFixSwitcher && !whiteList.includes(location.hostname)) {
      setTimeout(() => {
        window.gwdMiniFixSwitcher.restorePosition();
      }, 0);
    }
  });
  $('#gwd_website_icon').on('click', e => {
    e.preventDefault();
    (__webpack_require__(30888).openTab)();
  });
};
module.exports.renderMiniCom = data => {
  let nowprice;
  try {
    nowprice = userData.get('other_info')['code-server'].price;
  } catch (e) {
    nowprice = G.dp.price;
  }
  if (!nowprice) nowprice = G.dp.price;
  if (G.site.indexOf('taobao') > -1 || G.site.indexOf('tmall') > -1) {
    return;
  }
  let store;
  if (!data.b2c || data.b2c.length === 0) {
    store = [];
  } else {
    store = data.b2c.store;
  }
  let newData = [];
  let storeSize = store.length;
  //这几个网站做了新的图标
  var new_icon_site_ids = [1, 103, 108, 123, 124, 126, 129, 134, 136, 14, 141, 15, 167, 168, 19, 2, 21, 25, 26, 28, 3, 31, 34, 35, 41, 6, 66, 7, 86, 93, 9];
  for (let i = 0; i < store.length && i < 6; i++) {
    let product = store[i].product && store[i].product[0] || store[i];
    let dp_id = product.dp_id || '';
    let site_id = product.site_id;
    if (parseInt(site_id) === 3003) {
      site_id = 3;
    }
    let icon_format = new_icon_site_ids.indexOf(Number(site_id)) > -1 ? '.png' : '.ico';
    if (!site_id) continue;
    product.price = parsePrice(product.price.replace(/,/g, ""));
    product.icourl = `${G.s_server}/images/favicon/${site_id}${icon_format}`;
    newData.push(product);
  }
  let tle = `其他${storeSize}家报价`;
  let bclass = '';
  if (newData.length === 0) {
    tle = `暂无商城比价`;
    bclass = 'no-com-info';
  } else if (newData[0].price < Number(nowprice)) {
    tle = `<em>更低价:</em><em class="prifontf price-em">${newData[0].price}</em>`;
  }
  let t = `<div class="minibar-btn-box">
        <em class="setting-bg mini-compare-icon "></em>
        <span >${tle}</span>
      </div>`;
  $('#gwd_mini_compare').append($(t)).css("display", "block").addClass(bclass);
  if (newData.length > 0) {
    let html = __webpack_require__(93207);
    let allLink = `${G.c_server}/dp${data.dp.dp_id}`;
    let obj = {
      data: newData,
      allLink: allLink,
      storeSize: storeSize
    };
    $('#gwd_mini_compare').append(html(obj));
    userData.set('minicom', obj);
    // if ($('#mini_price_history_detail').length > 0) {
    //   renderTrendCompare(newData, storeSize, allLink)
    // } else {
    //   setTimeout(function() {
    //     renderTrendCompare(newData, storeSize, allLink)
    //   }, 400)
    // }
  } else {
    $('#gwd_mini_compare').off();
  }
};
const renderTrendCompare = (data, storeSize, allLink) => {
  if (G.promoTrendRendered) {
    return;
  }
  let html = __webpack_require__(932);
  $('.app-tuiguang').remove();
  $('#mini_price_history').removeClass('showapp');
  $('#mini_price_history_detail').append(html({
    data: data,
    allLink: allLink,
    storeSize: storeSize
  }));
};
let hasAliCouponInfo = false;
async function recoverMiniBar() {
  if ($('.miniPanel').length) {
    if ($('#gwd-tb-mini-coupon').length) {
      $('#gwd-tb-mini-coupon').insertAfter($(`.${G.aliPrefix}--miniPanelHead--_0b59519`));
    }
    return;
  }

  // 确保.gwd-minibar-bg在.ActiveInfo上方
  const globalConfig = await (__webpack_require__(41761).met)('GwdConfig');
  if (globalConfig && globalConfig.gwdMiniBarRecoverConfig) {
    if (hasAliCouponInfo) {
      await (__webpack_require__(30888).waitForConditionFn)(() => $(`#purchasePanel .${G.aliPrefix}--contentWrap--_3f8d83a > .${G.aliPrefix}--couponInfo--e67905e4`).length);
    }
    const recoverConfig = globalConfig.gwdMiniBarRecoverConfig.aliSite.map(x => {
      if (x.selector) {
        x.selector = x.selector.replace('QJEEHAN8H5', G.aliPrefix);
      }
      return x;
    });
    for (let i = 0; i < recoverConfig.length; i++) {
      const selector = recoverConfig[i].selector;
      const position = recoverConfig[i].position;
      const target = $(selector);
      if (target.length) {
        // console.log('tbScrollLink recoverMiniBar', recoverConfig[i])
        // console.log('tbScrollLink recoverMiniBar env', target[0])
        if (position === 'before') {
          miniBarBg.insertBefore(target);
        } else {
          miniBarBg.insertAfter(target);
        }
        return;
      }
    }
  }
}
module.exports.recoverMiniBar = recoverMiniBar;
module.exports.init = () => {
  (__webpack_require__(7129).log)('minibar init');
  // 获取配置信息， 看是否需要展示中间部分
  let permanent = userData.get('permanent');
  // if (G.forbidMinibar) return;
  if (permanent.setWishlist === '0' || permanent.setWishlist === 0) return;
  if (G.site == 'amazon' || G.site == '6pm') {
    (__webpack_require__(24197).init)();
    return;
  }
  renderCon();
};
let renderDom;
const delaySite = ['kaola'];
const renderCon = async () => {
  // 获取页面上的插入节点
  let instanceId = G.instanceId;
  if (delaySite.indexOf(G.site) > -1) {
    await (__webpack_require__(60340).sleep)(5000);
  }
  const globalConfig = await (__webpack_require__(41761).met)('GwdConfig');
  if (G.aliSite) {
    // const panel = $('#purchasePanel')[0]
    const getPanel = () => globalConfig.aliMobileNotifierConfig.map(i => i.panel).find(item => {
      if ($(item).length) {
        return $(item)[0];
      }
      return false;
    });
    extConsole.log('waiting for panel');
    await (__webpack_require__(30888).waitForConditionFn)(() => getPanel());
    extConsole.log('panel ready');
    const panel = getPanel();
    if (panel) {
      (__webpack_require__(41968).observe)(panel, async mutations => {
        extConsole.log('mutations:', mutations);
        if (globalConfig && globalConfig.gwdMiniBarRecoverConfig) {
          const config = globalConfig.gwdMiniBarRecoverConfig.aliSite;
          await (__webpack_require__(30888).waitForConditionFn)(() => {
            for (let i = 0; i < config.length; i++) {
              const selector = config[i].selector;
              if ($(selector).length) {
                return true;
              }
            }
            return false;
          });
        } else {
          await (__webpack_require__(30888).waitForConditionFn)(() => $('[class^=ActiveInfo--root--]').length || $('[class^=CouponInfo--couponInfo]').length || $('[class^=Price--root]').length);
        }
        // 仅在panel的class发生变化时重新渲染minibar
        recoverMiniBar();
      }, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }
  if (globalConfig && globalConfig.gwdMiniBarPositions) {
    if (G.aliSite) {
      const config = globalConfig.gwdMiniBarPositions.aliSite.map(x => {
        if (x.selector) {
          x.selector = x.selector.replace('QJEEHAN8H5', G.aliPrefix);
        }
        return x;
      });
      sitePattern['taobao'] = config;
      sitePattern['tmall'] = config;
      if ($(`#purchasePanel .${G.aliPrefix}--contentWrap--_3f8d83a > .${G.aliPrefix}--couponInfo--e67905e4`).length) {
        hasAliCouponInfo = true;
      }
    } else {
      if (globalConfig.gwdMiniBarPositions[G.site]) {
        sitePattern[G.site] = globalConfig.gwdMiniBarPositions[G.site];
      }
    }
  }
  let container = getContainer();
  (__webpack_require__(7129).log)('container:', container);
  await (__webpack_require__(30888).waitForConditionFn)(() => {
    if (container) return true;
    container = getContainer();
    return false;
  });
  if (window.gwd_G && window.gwd_G.instanceId !== instanceId) {
    (__webpack_require__(7129).warn)('instanceId不一致，不渲染minibar');
    return;
  }
  renderMiniBar(container);
  const store = (__webpack_require__(92771).getStore)();
  new Vue({
    el: '#gwd_mini_remind .minibar-btn-box',
    store,
    render: h => h(MiniBarCollectionButton)
  });
  addEvent();
  const el = $('.gwd-minibar-bg')[0];
  G.miniBar = el;
  // 网页可能会移除minibar，
  if (el) {
    (__webpack_require__(41968).observe)(el, mutations => {
      mutations.forEach(mutation => {
        if (mutation.removedNodes.length) {
          (__webpack_require__(7129).log)('minibar被移除');
          if (G.instanceId === $('html').attr('data-gwd-id')) {
            recoverMiniBar();
          }
        }
      });
    });
  }
};

/***/ }),

/***/ 82350:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TooltipView)
});

// UNUSED EXPORTS: __esModule

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=template&id=94eef1d2&scoped=true
var TooltipViewvue_type_template_id_94eef1d2_scoped_true = __webpack_require__(66716);
;// ./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=template&id=94eef1d2&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=script&lang=js
var TooltipViewvue_type_script_lang_js = __webpack_require__(97254);
;// ./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=script&lang=js
 /* harmony default export */ const PriceTrend_TooltipViewvue_type_script_lang_js = (TooltipViewvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(85072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(97825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(77659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(55056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(10540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(41113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=style&index=0&id=94eef1d2&prod&scoped=true&lang=css
var TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css = __webpack_require__(67242);
var TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css_default = /*#__PURE__*/__webpack_require__.n(TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css);
;// ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=style&index=0&id=94eef1d2&prod&scoped=true&lang=css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()((TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css_default()), options);




       /* harmony default export */ const PriceTrend_TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css = ((TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css_default()) && (TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css_default()).locals ? (TooltipViewvue_type_style_index_0_id_94eef1d2_prod_scoped_true_lang_css_default()).locals : undefined);

;// ./src/standard/module/components/PriceTrend/TooltipView.vue?vue&type=style&index=0&id=94eef1d2&prod&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/PriceTrend/TooltipView.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  PriceTrend_TooltipViewvue_type_script_lang_js,
  TooltipViewvue_type_template_id_94eef1d2_scoped_true/* render */.XX,
  TooltipViewvue_type_template_id_94eef1d2_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "94eef1d2",
  null
  
)

/* harmony default export */ const TooltipView = (component.exports);

/***/ }),

/***/ 82562:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-coupon-bar[data-v-7803d351] {\n  font-family: \"PingFang SC-Medium\", \"Microsoft YaHei\", \"Arial\", \"SimSun\", serif;\n  font-size: 12px;\n  background: white;\n  position: relative;\n  border: 1px solid #e8e8e8;\n  border-top: none;\n  width: 462px;\n  box-sizing: border-box;\n  height: 38px;\n}\n.gwd-coupon-bar .gwd-round-click[data-v-7803d351] {\n  margin-left: 24px;\n  margin-right: 12px;\n  display: block;\n  width: 68px;\n  height: 20px;\n  text-align: center;\n  border-radius: 4px;\n  color: white;\n  font-weight: bold;\n}\n.gwd-coupon-bar .gwd-take[data-v-7803d351] {\n  margin-right: 12px;\n  width: 74px;\n  height: 20px;\n  font-size: 12px;\n}\n.gwd-coupon-bar .gwd-take span[data-v-7803d351] {\n  flex: 1;\n  text-align: center;\n}\n.gwd-coupon-bar .gwd-qr-hover-window[data-v-7803d351] {\n  width: 136px;\n  height: 160px;\n  background: #fff9f6;\n  position: absolute;\n  box-sizing: border-box;\n  border-width: 1px;\n  border-style: solid;\n  top: 37px;\n  left: 345px;\n  display: none;\n  z-index: 99;\n}\n.gwd-coupon-bar[data-v-7803d351]:hover {\n  text-decoration: none;\n}\n.gwd-coupon-bar:hover .gwd-qr-hover-window[data-v-7803d351] {\n  display: flex;\n}\n", ""]);

// exports


/***/ }),

/***/ 82664:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-shaidan-item[data-v-731c91d4] {\n  width: 205px;\n  height: 64px;\n  border-bottom: 1px dashed #E6E9EB;\n  box-sizing: border-box;\n}\n.gwd-shaidan-item .gwd-avatar[data-v-731c91d4] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n}\n.gwd-shaidan-item .gwd-nick[data-v-731c91d4] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transform-origin: left center;\n}\n.gwd-shaidan-item .gwd-skuinfo[data-v-731c91d4] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transform-origin: right center;\n}\n.gwd-shaidan-item .gwd-price[data-v-731c91d4] {\n  transform-origin: left center;\n  color: #111;\n  font-weight: bold;\n}\n.gwd-shaidan-item .gwd-date[data-v-731c91d4] {\n  color: #999;\n  transform-origin: right center;\n}\n", ""]);

// exports


/***/ }),

/***/ 82690:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-minibar-element",
    staticStyle: {
      height: "36px",
      width: "460px",
      background: "white",
      "align-items": "center",
      display: "flex",
      position: "relative"
    },
    attrs: {
      id: "gwd-price-protect"
    },
    on: {
      mouseover: _vm.over
    }
  }, [_c("img", {
    staticStyle: {
      "margin-left": "11px",
      width: "16px"
    },
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/price-protect@2x.png",
      alt: ""
    }
  }), _vm._v(" "), _vm.mode === "qr" ? _c("span", {
    staticStyle: {
      "margin-left": "10px",
      "font-size": "12px",
      color: "#ff3532",
      "margin-top": "-2px"
    }
  }, [_vm._v("扫码下单，买贵就返差价！")]) : _vm._e(), _vm._v(" "), _vm.mode === "redpack" ? _c("span", {
    staticClass: "gwd-hui999 gwd-font12",
    staticStyle: {
      "margin-left": "10px"
    }
  }, [_vm._v("\n    当前商品支持价格保护，扫码领红包下单后为您添加降价提醒\n  ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }), _vm._v(" "), _vm.mode === "qr" ? _c("img", {
    attrs: {
      src: __webpack_require__(74787),
      alt: ""
    }
  }) : _vm._e(), _vm._v(" "), _vm.mode === "qr" ? _c("span", {
    staticClass: "gwd-qr-scan"
  }, [_vm._v("微信扫码")]) : _vm._e(), _vm._v(" "), _vm.mode === "qr" ? _c("div", {
    staticClass: "gwd-price-protect-qr gwd-column gwd-align"
  }, [_vm.qrLink ? _c("img", {
    attrs: {
      src: _vm.qrLink,
      alt: ""
    }
  }) : _vm._e(), _vm._v(" "), _vm._m(0)]) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", {
    staticClass: "gwd-font12",
    staticStyle: {
      "margin-top": "6px"
    }
  }, [_c("span", {
    staticClass: "gwd-red"
  }, [_vm._v("微信扫码")]), _vm._v(" "), _c("span", {
    staticClass: "gwd-hui333",
    staticStyle: {
      "margin-left": "3px"
    }
  }, [_vm._v("获取价保提醒")])]);
}];
render._withStripped = true;

/***/ }),

/***/ 82699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


const request = __webpack_require__(49388);
const template = __webpack_require__(26133);
const util = __webpack_require__(30888);
const userData = __webpack_require__(74222);
let pagesite,
  urlArr,
  clickTime = {},
  show_ljfqrcode = true;
let ListPattern = {
  'lianjia': {
    list: '.sellListContent li.clear',
    hrefitem: '.info .title a',
    insertdom: '.sellListContent li.clear'
  },
  'maitian': {
    list: '.list_wrap li.clearfix',
    hrefitem: '.list_title h1 a',
    insertdom: '.list_wrap li.clearfix'
  },
  'lianjia2': {
    list: '#js-ershoufangList .m-list>ul>li',
    hrefitem: '.prop-title a',
    insertdom: '#js-ershoufangList .m-list>ul>li'
  },
  'ke': {
    list: '.sellListContent li.clear',
    hrefitem: '.info .title a',
    insertdom: '.sellListContent li.clear'
  },
  'ke2': {
    list: '.sellListContent li.clear',
    hrefitem: '.info .title a',
    insertdom: '.sellListContent li.clear'
  },
  '5i5j': {
    list: '.pListBox .pList>li:has(.listImg)',
    hrefitem: 'a',
    insertdom: '.pListBox .pList>li'
  },
  'centanet': {
    list: '.section-houselists .house-item',
    hrefitem: '.house-title a',
    insertdom: '.section-houselists .house-item'
  },
  'centanet2': {
    list: '.result-lists .house-main .house-item',
    hrefitem: '.house-title a',
    insertdom: '.result-lists .house-main .house-item'
  }
};
let dpPattern = {
  'lianjia': ['.content .price-container', '#topImg+.info>.price'],
  'lianjia2': ['.houseInfo', '.maininfo-price'],
  'ke': ['.content .price-container', '#topImg+.info>.price'],
  'ke2': ['.houseInfo', '.maininfo-price'],
  '5i5j': ['.housesty'],
  'centanet': ['#sidefixedbox .infotop'],
  'centanet2': ['.roombase-infor .roombase-price'],
  "maitian": ['.home_content .hc_left table tr:first-child', '.home_content .home_infos li:first-child']
};
let siteIdPattern = {
  'lianjia': 441,
  '5i5j': 442,
  'ke': 441,
  'maitian': 443,
  'centanet': 511
};
const getHouseCode = () => {
  let type = pageType();
  let housecode;
  if (type == 2) {
    let url = location.href;
    switch (G.site) {
      case 'lianjia':
        housecode = url.match(/\/([a-z0-9A-Z]+)\.html/)[1];
        break;
      case 'ke':
        housecode = url.match(/\/([a-z0-9A-Z]+)\.html/)[1];
        break;
      case 'maitian':
        housecode = url.match(/\/esfxq\/([a-z0-9A-Z]+)/)[1];
        break;
      case '5i5j':
        housecode = url.match(/\/([a-z0-9]+)\.html/)[1];
        break;
      case 'centanet':
        housecode = url.match(/\/([a-z0-9]+)\.html/)[1];
        break;
    }
  } else {
    let urls = urlArr;
    switch (G.site) {
      case 'lianjia':
        housecode = Array.prototype.map.call(urls, function (e) {
          return e.match(/\/([a-z0-9A-Z]+)\.html/)[1];
        }).join(',');
        break;
      case 'ke':
        housecode = Array.prototype.map.call(urls, function (e) {
          return e.match(/\/([a-z0-9A-Z]+)\.html/)[1];
        }).join(',');
        break;
      case 'maitian':
        housecode = Array.prototype.map.call(urls, function (e) {
          return e.match(/\/esfxq\/([a-z0-9A-Z]+)/)[1];
        }).join(',');
        break;
      case '5i5j':
        housecode = Array.prototype.map.call(urls, function (e) {
          return e.match(/\/([a-z0-9]+)\.html/)[1];
        }).join(',');
        break;
      case 'centanet':
        housecode = Array.prototype.map.call(urls, function (e) {
          return e.match(/\/([a-z0-9]+)\.html/)[1];
        }).join(',');
        break;
    }
  }
  return housecode;
};
const existRemind = () => {
  let siteId = siteIdPattern[G.site];
  if (!siteId) return;
  let housecode = getHouseCode();
  let url = `${G.u_house}/api/house_collection?ac=exist&site_id=${siteId}&house_code=${housecode}`;
  request.get(url).done(data => {
    if (data && data.exist) {
      let list = $('.ht-price-remind');
      for (let i = 0; i < list.length; i++) {
        let code = list.eq(i).attr('data-id');
        if (data.exist[code]) {
          list.eq(i).addClass('hasremind');
          list.eq(i).find('span').text('已添加提醒');
          list.eq(i).attr('data-colid', data.exist[code]);
        }
      }
    }
  });
};
const addRemind = (code, callback) => {
  if (clickTime[code] >= 4) {
    return;
  }
  if (!clickTime[code]) {
    clickTime[code] = 1;
  }
  clickTime[code]++;
  let siteId = siteIdPattern[G.site];
  let url = `${G.u_house}/api/house_collection?ac=add&site_id=${siteId}&house_code=${code}&from_url=${encodeURIComponent(location.href)}`;
  request.get(url).done(data => {
    if (data && data.msg === '收藏成功') {
      callback(data);
    } else if (data.msg === '请先登录') {
      location.href = data.loginUrl;
    }
  });
};
const delRemind = (id, callback) => {
  let url = `${G.u_house}/api/house_collection?ac=del&collection_id=${id}`;
  request.get(url).done(data => {
    if (data && data.msg === '删除成功') {
      callback();
    }
  });
};
const addEvent = () => {
  let time, time2;
  $('.ht-trend-desc, #bdext_minibar .bdext-toptabs').on('mouseenter', function () {
    let c = $(this).parent().parent().hasClass('trend-box-1');
    if (c) return;
    let oldsrc = $(this).parent().next().find('.house-trend-img img').attr('src');
    if (!oldsrc) {
      let src = $(this).parent().next().find('.house-trend-img img').attr('data-src');
      $(this).parent().next().find('.house-trend-img img').attr('src', src);
    }
    $(this).addClass('mshover');
    $(this).parent().next().show();
  });
  $('.ht-trend-desc, #bdext_minibar .bdext-toptabs').on('mouseleave', function () {
    let that = this;
    time = setTimeout(function () {
      $(that).parent().next().hide();
      $(that).removeClass('mshover');
    }, 300);
  });
  $('.houset-detail').on('mouseenter', function () {
    clearTimeout(time);
  });
  $('.houset-detail').on('mouseleave', function () {
    $(this).hide();
    $('.ht-trend-desc, #bdext_minibar').removeClass('mshover');
  });
  $('.ht-price-remind').on('click', function () {
    let that = this;
    let txt = $(this).find('span').text();
    let code = $(this).attr('data-id');
    if (txt === '降价提醒') {
      addRemind(code, function (data) {
        $(that).addClass('hasremind');
        $(that).find('span').text('已添加提醒');
        $(that).attr('data-colid', data.collect_id);
      });
    } else {
      let collect_id = $(this).attr('data-colid');
      delRemind(collect_id, function () {
        $(that).attr('data-colid', null);
        $(that).removeClass('hasremind');
        $(that).find('span').text('降价提醒');
      });
    }
  });
  $('.ht-price-remind').on('mouseenter', function () {
    if (userData.get('show_ljfqrcode') == 0 || !show_ljfqrcode) return;
    $(this).parent().parent().find('.ht-wxqrcode').show();
  });
  $('.ht-price-remind').on('mouseleave', function () {
    let that = this;
    time2 = setTimeout(function () {
      $(that).parent().parent().find('.ht-wxqrcode').hide();
    }, 150);
  });
  $('.ht-wxqrcode').on('mouseenter', function () {
    clearTimeout(time2);
  });
  $('.ht-wxqrcode').on('mouseleave', function () {
    $('.ht-wxqrcode').hide();
  });
  $('.ht-wxqrcode .ht-wx-sp3').on('click', function () {
    $('.ht-wxqrcode').hide();
    show_ljfqrcode = false;
    util.settings('set_show_ljfqrcode', 'show_ljfqrcode', '0');
  });
  $('body').on('click', function (e) {
    let dom = $(e.target);
    let communityDom = dom.parent().parent().parent().find('.community-price');
    if (dom.hasClass('house-trend-b')) {
      communityDom.hide();
      dom.parent().find('span').removeClass('trend-choose');
      dom.addClass('trend-choose');
    } else if (dom.hasClass('community-trend-b')) {
      if (communityDom.children().length === 0) {
        renderChart(communityDom, function () {
          dom.parent().find('span').removeClass('trend-choose');
          dom.addClass('trend-choose');
          communityDom.show();
        });
      } else {
        dom.parent().find('span').removeClass('trend-choose');
        dom.addClass('trend-choose');
        communityDom.show();
      }
    }
  });
};
const renderChart = (dom, callback) => {
  let href = dom.attr('data-u');
  let id = dom.attr('id');
  console.log('renderChart called');
  getInfo(href, function (data) {
    console.log('data got');
    __webpack_require__(78310)({
      el: id,
      msg: data
    });
    if (callback && data.community) {
      callback();
    }
  });
};
const renderBtn = data => {
  let html = __webpack_require__(61494);
  let listobj = ListPattern[pagesite];
  let list = $(listobj['list']);
  for (let i = 0; i < list.length; i++) {
    let item = list.eq(i).find(listobj['hrefitem']);
    let href = item.attr('href');
    if (href.indexOf('http') === -1) href = location.protocol + '//' + location.host + href;
    let housecode;
    switch (G.site) {
      case 'lianjia':
        housecode = href.match(/\/([a-z0-9A-Z]+)\.html/)[1];
        break;
      case 'ke':
        housecode = href.match(/\/([a-z0-9A-Z]+)\.html/)[1];
        break;
      case '5i5j':
        housecode = href.match(/\/([a-z0-9]+)\.html/)[1];
        break;
      case 'maitian':
        housecode = href.match(/\/esfxq\/([a-z0-9A-Z]+)/)[1];
        break;
      case 'centanet':
        housecode = href.match(/\/([a-z0-9]+)\.html/)[1];
        break;
    }
    href = encodeURIComponent(href.replace('.ke.', '.lianjia.'));
    if (data.data[href]) {
      list.eq(i).append(template.compile(html)({
        data: data.data[href],
        server: G.server,
        s_server: G.s_server,
        housecode: housecode
      }));
    }
  }
  setTimeout(existRemind, 500);
  addEvent();
};
const renderBtnDp = data => {
  let housecode = getHouseCode();
  let dpdom;
  let dpobj = dpPattern[pagesite];
  for (let i = 0; i < dpobj.length; i++) {
    if ($(dpobj[i]).length > 0) {
      dpdom = dpobj[i];
      break;
    }
  }
  let html = __webpack_require__(61494);
  let href = encodeURIComponent(location.href.replace('.ke.', '.lianjia.'));
  $(dpdom).eq(0).after(template.compile(html)({
    data: data.data[href],
    server: G.server,
    s_server: G.s_server,
    pagetype: 'dppage',
    housecode: housecode
  }));
  addEvent();
  setTimeout(existRemind, 500);
};
const getUrls = type => {
  let obj = ListPattern[pagesite];
  let hrefdom = obj['list'] + ' ' + obj['hrefitem'];
  let host = location.host;
  if (host.indexOf('lianjia') > -1 && type === 2) {
    return location.href;
  } else if (host.indexOf('lianjia') > -1) {
    let arr = Array.prototype.map.call($(hrefdom), function (e) {
      let href = $(e).attr('href');
      return (href.indexOf('http') > -1 ? '' : 'http://' + location.host) + href;
    });
    urlArr = arr;
    return arr.join('||');
  }
  if (host.indexOf('maitian') > -1 && type === 2) {
    return location.href;
  } else if (host.indexOf('maitian') > -1) {
    let arr = Array.prototype.map.call($(hrefdom), function (e) {
      let href = $(e).attr('href');
      return (href.indexOf('http') > -1 ? '' : 'http://' + location.host) + href;
    });
    urlArr = arr;
    return arr.join('||');
  }
  if (host.indexOf('ke') > -1 && type === 2) {
    return location.href;
  } else if (host.indexOf('ke') > -1) {
    let arr = Array.prototype.map.call($(hrefdom), function (e) {
      let href = $(e).attr('href');
      return (href.indexOf('http') > -1 ? '' : 'http://' + location.host) + href;
    });
    urlArr = arr;
    return arr.join('||');
  }
  if (host.indexOf('5i5j') > -1 && type === 2) {
    return location.href;
  } else if (host.indexOf('5i5j') > -1) {
    let arr = Array.prototype.map.call($('.pListBox .pList>li .listTit>a'), function (e) {
      return location.protocol + '//' + location.host + $(e).attr('href');
    });
    urlArr = arr;
    return arr.join('||');
  }
  if (host.indexOf('centanet') > -1 && type === 2) {
    return location.href;
  } else if (host.indexOf('centanet') > -1) {
    let arr = Array.prototype.map.call($(hrefdom), function (e) {
      return location.protocol + '//' + location.host + $(e).attr('href');
    });
    urlArr = arr;
    return arr.join('||');
  }
};
const getInfo = (url, callback) => {
  console.log('getInfo', url);
  request.get(url).done(function (data) {
    callback(data);
  });
};
const pageType = () => {
  let url = location.href;
  let type = 0;
  let site = pagesite;
  switch (site) {
    case 'lianjia':
      if (url.match(/\d+\.html/)) {
        type = 2;
      } else {
        type = 1;
      }
      break;
    case 'maitian':
      if (url.match(/esfxq\/\w+/)) {
        type = 2;
      } else {
        type = 1;
      }
      break;
    case 'lianjia2':
      if (url.match(/\d+\.html/)) {
        type = 2;
      } else {
        type = 1;
      }
      break;
    case '5i5j':
      if (url.match(/(?:exchange|ershoufang)\/\d+\.html/) && $('.big-slide').length > 0) {
        type = 2;
      } else if (url.match(/(?:exchange|ershoufang)/)) {
        type = 1;
      }
      break;
    case 'centanet':
      if (url.match(/ershoufang\/[a-z0-9]+\.html/) && $('#picBox').length > 0) {
        type = 2;
      } else if (url.match(/ershoufang/)) {
        type = 1;
      }
      break;
    case 'centanet2':
      if (url.match(/ershoufang\/[a-z0-9]+\.html/)) {
        type = 2;
      } else if (url.match(/ershoufang/)) {
        type = 1;
      }
      break;
    case 'ke':
      if (url.match(/\d+\.html/)) {
        type = 2;
      } else {
        type = 1;
      }
      break;
  }
  return type;
};
const renderStyle = () => {
  let html = __webpack_require__(56113);
  $('body').append(template.compile(html)({
    s_server: G.s_server,
    extBrand: G.extBrand
  }));
  $('body').addClass('house_' + pagesite);
};
module.exports.init = () => {
  pagesite = G.site;
  if (pagesite != 'lianjia' && pagesite != '5i5j' && pagesite != 'centanet' && pagesite != 'ke' && pagesite != 'maitian') return;
  if (location.host === 'sh.centanet.com') {
    pagesite = 'centanet2';
  }
  let type = pageType();
  let urls = getUrls(type);
  let url = `${G.server}/extension/houseTip?url=${encodeURIComponent(urls)}`;
  if (type === 2) {
    getInfo(url, renderBtnDp);
  } else {
    getInfo(url, renderBtn);
  }
  renderStyle();
};

/***/ }),

/***/ 83007:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ Pricevue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ Price)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Price.vue?vue&type=template&id=deec5212&scoped=true
var Pricevue_type_template_id_deec5212_scoped_true = __webpack_require__(10635);
;// ./src/standard/module/components/ImgSame/Price.vue?vue&type=template&id=deec5212&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Price.vue?vue&type=script&lang=js
var Pricevue_type_script_lang_js = __webpack_require__(9340);
;// ./src/standard/module/components/ImgSame/Price.vue?vue&type=script&lang=js
 /* harmony default export */ const ImgSame_Pricevue_type_script_lang_js = (Pricevue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Price.vue?vue&type=style&index=0&id=deec5212&prod&scoped=true&lang=less
var Pricevue_type_style_index_0_id_deec5212_prod_scoped_true_lang_less = __webpack_require__(11445);
;// ./src/standard/module/components/ImgSame/Price.vue?vue&type=style&index=0&id=deec5212&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/ImgSame/Price.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  ImgSame_Pricevue_type_script_lang_js,
  Pricevue_type_template_id_deec5212_scoped_true/* render */.XX,
  Pricevue_type_template_id_deec5212_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "deec5212",
  null
  
)

/* harmony default export */ const Price = (component.exports);

/***/ }),

/***/ 83556:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $imports = __webpack_require__(53095);
module.exports = function ($data) {
    'use strict';
    $data = $data || {};
    var $$out = '', $escape = $imports.$escape, link = $data.link, extClass = $data.extClass, img = $data.img;
    $$out += '<a href="';
    $$out += $escape(link);
    $$out += '"\n   target="_blank"\n   title="点击领取"\n   style="display: inline-flex; position: relative; vertical-align: middle; margin-left: 5px; width: auto" class="gwd-bottom-tmall ';
    $$out += $escape(extClass);
    $$out += '">\n  <img src="';
    $$out += $escape(img);
    $$out += '" alt="" style="height: 44px">\n</a>\n<style>\n  .gwd-bottom-tmall {\n    height: 100%;\n    align-items: center;\n  }\n\n  .gwd-qr-act-bottom {\n    display: none;\n    flex-direction: column;\n    position: absolute;\n    width: 144px;\n    height: 167px;\n    box-sizing: border-box;\n    border: 1px solid #ff471a;\n    background: #fff9f6;\n    bottom: 62px;\n    left: 50%;\n    align-items: center;\n    margin-left: -72px;\n  }\n\n  .gwd-qr-act-bottom span {\n    width: initial;\n    margin: 0;\n  }\n\n  .gwd-bottom-tmall:hover .gwd-qr-act-bottom {\n    display: flex;\n  }\n</style>';
    return $$out;
};

/***/ }),

/***/ 83625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34192);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("01e623da", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 83783:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.init = void 0;
var vue_1 = __importDefault(__webpack_require__(38279));
var viewerWindow_vue_1 = __importDefault(__webpack_require__(60721));
var skuUtil_1 = __webpack_require__(90827);
var arrow = __webpack_require__(41151);
var redArrow = __webpack_require__(31166);
var init = function () { return __awaiter(void 0, void 0, void 0, function () {
    var el, skuPriceViewer, text, isNewJd, skuInfo, productPrices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                el = document.createElement('div');
                document.body.appendChild(el);
                skuPriceViewer = new vue_1.default({
                    el: el,
                    render: function (h) { return h(viewerWindow_vue_1.default, {
                        ref: 'popup',
                    }); },
                });
                if (!(G.site === '360buy')) return [3 /*break*/, 3];
                if (Object.keys(pageConfig.product.colorSize).length <= 1) {
                    return [2 /*return*/];
                }
                text = '查　　价';
                isNewJd = (__webpack_require__(60340).isNewJd)();
                if (!isNewJd) return [3 /*break*/, 2];
                return [4 /*yield*/, (__webpack_require__(30888).waitForConditionFn)(function () { return $("#choose-attrs").length; })];
            case 1:
                _a.sent();
                text = '查价';
                _a.label = 2;
            case 2:
                $('#choose-attrs').after("\n      <div style=\"margin-top: ".concat(isNewJd ? 0 : 10, "px; margin-bottom: 10px\">\n        <div class=\"dt\">").concat(text, "</div>\n        <div class=\"dd\">\n          <div class=\"gwd-inline-row gwd-align gwd-sku-viewer\" style=\"cursor: pointer\">\n            <span style=\"font-size: 14px; color: #ff0f23;\">\u4E00\u952E\u67E5\u591A\u6B3E\u5F0F\u5230\u624B\u4EF7</span>\n            <img src=\"").concat(redArrow, "\" style=\"width: 16px; height: 16px; margin-left: 2px;\">\n          </div>\n        </div>\n      </div>\n      "));
                $('.gwd-sku-viewer').on('click', function () { return skuPriceViewer.$refs.popup.open(); });
                _a.label = 3;
            case 3:
                if (!G.aliSite) return [3 /*break*/, 6];
                return [4 /*yield*/, (__webpack_require__(30888).waitForConditionFn)(function () { return $("[class^=".concat(G.aliPrefix, "--SkuContent--]")).length || document.querySelector('input[name="x_id"]'); })
                    // await require('standard/module/util').waitForConditionFn(() => G.aliSkuInfo )
                    // const skuInfo = G.aliSkuInfo;
                ];
            case 4:
                _a.sent();
                return [4 /*yield*/, (__webpack_require__(94968).getLocalSku)()];
            case 5:
                skuInfo = _a.sent();
                if (!G.aliSkuInfo) {
                    G.aliSkuInfo = skuInfo;
                }
                if (skuInfo.skuBase.skus.length <= 1) {
                    return [2 /*return*/];
                }
                productPrices = (0, skuUtil_1.extractAliProductPrice)(skuInfo);
                if (productPrices.length <= 1) {
                    return [2 /*return*/];
                }
                if ($("[class^=".concat(G.aliPrefix, "--SkuContent--]")).length) {
                    $("[class^=".concat(G.aliPrefix, "--SkuContent--]")).after("\n        <div class=\"gwd-row\" style=\"align-items: baseline;\">\n          <div class=\"".concat(G.aliPrefix, "--ItemLabel--_7c6a9cd\">\n            <span class=\"").concat(G.aliPrefix, "--labelText--_2ce831b\">\u67E5\u4EF7</span>\n          </div>\n          <div class=\"").concat(G.aliPrefix, "--content--_9d8018e gwd-inline-row gwd-align\">\n            <div class=\"gwd-inline-row gwd-align gwd-sku-viewer\" style=\"cursor: pointer\">\n              <span style=\"font-size: 14px; color: #ff5000;\">\u4E00\u952E\u67E5\u591A\u6B3E\u5F0F\u5230\u624B\u4EF7</span>\n              <img src=\"").concat(arrow, "\" style=\"width: 16px; height: 16px; margin-left: 2px;\">\n            </div>\n          </div>\n        </div>\n      "));
                }
                else if ($('.BuyPattern--m8ZSLAHz').length) {
                    $('.BuyPattern--m8ZSLAHz').before("\n        <div class=\"gwd-row root--uHUOEAcH\" style=\"align-items: baseline;\">\n          <div class=\"ItemLabel--psS1SOyC\">\n            <span class=\"skuCateText f-els-2 pcSkuCateText\">\u67E5\u4EF7:</span>\n          </div>\n          <div class=\"serviceWrapper gwd-inline-row gwd-align\">\n            <div class=\"gwd-inline-row gwd-align gwd-sku-viewer\" style=\"cursor: pointer\">\n              <span style=\"font-size: 14px; color: #ff5000;\">\u4E00\u952E\u67E5\u591A\u6B3E\u5F0F\u5230\u624B\u4EF7</span>\n              <img src=\"".concat(arrow, "\" style=\"width: 16px; height: 16px; margin-left: 2px;\">\n            </div>\n          </div>\n        </div>\n      "));
                }
                else {
                    $('.skuWrapper .service').before("\n        <div class=\"gwd-row\" style=\"align-items: baseline; margin-top: -15px;\">\n          <span class=\"skuCateText pcSkuCateText\">\u67E5\u4EF7:</span>\n          <div class=\"serviceWrapper gwd-inline-row gwd-align\">\n            <div class=\"gwd-inline-row gwd-align gwd-sku-viewer\" style=\"cursor: pointer\">\n              <span style=\"font-size: 14px; color: #ff5000;\">\u4E00\u952E\u67E5\u591A\u6B3E\u5F0F\u5230\u624B\u4EF7</span>\n              <img src=\"".concat(arrow, "\" style=\"width: 16px; height: 16px; margin-left: 2px;\">\n            </div>\n          </div>\n        </div>\n      "));
                }
                $('.gwd-sku-viewer').on('click', function () { return skuPriceViewer.$refs.popup.open(); });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.init = init;


/***/ }),

/***/ 84140:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ PriceInputvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ PriceInput)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Controls/PriceInput.vue?vue&type=template&id=c322638e&scoped=true
var PriceInputvue_type_template_id_c322638e_scoped_true = __webpack_require__(19449);
;// ./src/standard/module/components/Controls/PriceInput.vue?vue&type=template&id=c322638e&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Controls/PriceInput.vue?vue&type=script&lang=js
var PriceInputvue_type_script_lang_js = __webpack_require__(63357);
;// ./src/standard/module/components/Controls/PriceInput.vue?vue&type=script&lang=js
 /* harmony default export */ const Controls_PriceInputvue_type_script_lang_js = (PriceInputvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Controls/PriceInput.vue?vue&type=style&index=0&id=c322638e&prod&scoped=true&lang=less
var PriceInputvue_type_style_index_0_id_c322638e_prod_scoped_true_lang_less = __webpack_require__(27733);
;// ./src/standard/module/components/Controls/PriceInput.vue?vue&type=style&index=0&id=c322638e&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/Controls/PriceInput.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  Controls_PriceInputvue_type_script_lang_js,
  PriceInputvue_type_template_id_c322638e_scoped_true/* render */.XX,
  PriceInputvue_type_template_id_c322638e_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "c322638e",
  null
  
)

/* harmony default export */ const PriceInput = (component.exports);

/***/ }),

/***/ 84509:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c(_vm.type === "link" ? "a" : "div", {
    tag: "component",
    staticClass: "gwd-row gwd-align gwd-coupon-bar",
    class: {
      "gwd-butie": _vm.text.includes("补贴") && _vm.mainColor === "#11a14e"
    },
    attrs: {
      href: _vm.alterHref,
      target: "_blank",
      title: _vm.title ? _vm.title : _vm.type === "link" ? "点击领取" : ""
    },
    on: {
      mouseenter: function ($event) {
        return _vm.over();
      }
    }
  }, [_vm.showStampBg ? _c("div", {
    staticClass: "gwd-coupon-color-bg gwd-tl"
  }) : _vm._e(), _vm._v(" "), _vm.showStampBg ? _c("div", {
    staticClass: "gwd-coupon-color-bg gwd-br"
  }) : _vm._e(), _vm._v(" "), _c("img", {
    staticStyle: {
      "margin-left": "12px",
      "margin-right": "8px",
      "max-height": "20px",
      "z-index": "1"
    },
    attrs: {
      src: _vm.icon,
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    style: `color: ${_vm.mainColor}; font-size: 14px`,
    domProps: {
      innerHTML: _vm._s(_vm.text)
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }, [_vm.rebate ? _c("Stamp", {
    staticStyle: {
      right: "109px",
      top: "0",
      position: "absolute"
    },
    attrs: {
      value: _vm.rebate
    }
  }) : _vm._e()], 1), _vm._v(" "), _vm.type === "link" ? _c("span", {
    staticClass: "gwd-round-click",
    style: `background: linear-gradient(180deg, ${_vm.secondColor} 0%, ${_vm.mainColor} 100%); z-index: 1`
  }, [_vm._v("点击领取")]) : _vm._e(), _vm._v(" "), _vm.type === "qr" ? _c("div", {
    staticClass: "gwd-take gwd-row gwd-align",
    style: `background: url(${_vm.takeBg})`
  }, [_c("span", {
    style: `color: ${_vm.mainColor}`
  }, [_vm._v("￥" + _vm._s(_vm.couponValue))]), _vm._v(" "), _c("span", {
    staticStyle: {
      color: "white"
    }
  }, [_vm._v("领取")])]) : _vm._e(), _vm._v(" "), _vm.type === "qr" ? _c("div", {
    staticClass: "gwd-qr-hover-window gwd-column gwd-align",
    style: `border-color: ${_vm.mainColor}`
  }, [!_vm.error && _vm.actualQr ? _c("img", {
    staticStyle: {
      width: "120px",
      height: "120px",
      "margin-top": "8px"
    },
    attrs: {
      src: _vm.actualQr,
      alt: ""
    }
  }) : _vm._e(), _vm._v(" "), _vm.error ? _c("QRError", {
    on: {
      refresh: _vm.over
    }
  }) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "gwd-row",
    staticStyle: {
      "margin-top": "8px"
    }
  }, [_c("span", {
    style: `color: ${_vm.mainColor}; font-size: 12px;`
  }, [_vm._v("微信扫码")]), _vm._v(" "), _c("span", {
    staticStyle: {
      color: "#070707",
      "font-size": "12px",
      transform: "scale(0.8333)",
      "transform-origin": "center left",
      "margin-top": "1px"
    }
  }, [_vm._v(_vm._s(_vm.qrTitle))])])], 1) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 84593:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ CommonCouponBarMinivue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ CommonCouponBarMini)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CommonCouponBarMini.vue?vue&type=template&id=7803d351&scoped=true
var CommonCouponBarMinivue_type_template_id_7803d351_scoped_true = __webpack_require__(84509);
;// ./src/standard/module/components/CommonCouponBarMini.vue?vue&type=template&id=7803d351&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CommonCouponBarMini.vue?vue&type=script&lang=js
var CommonCouponBarMinivue_type_script_lang_js = __webpack_require__(86696);
;// ./src/standard/module/components/CommonCouponBarMini.vue?vue&type=script&lang=js
 /* harmony default export */ const components_CommonCouponBarMinivue_type_script_lang_js = (CommonCouponBarMinivue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CommonCouponBarMini.vue?vue&type=style&index=0&id=7803d351&prod&scoped=true&lang=less
var CommonCouponBarMinivue_type_style_index_0_id_7803d351_prod_scoped_true_lang_less = __webpack_require__(41703);
;// ./src/standard/module/components/CommonCouponBarMini.vue?vue&type=style&index=0&id=7803d351&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/CommonCouponBarMini.vue?vue&type=style&index=1&id=7803d351&prod&lang=less
var CommonCouponBarMinivue_type_style_index_1_id_7803d351_prod_lang_less = __webpack_require__(19175);
;// ./src/standard/module/components/CommonCouponBarMini.vue?vue&type=style&index=1&id=7803d351&prod&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/CommonCouponBarMini.vue



;



/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_CommonCouponBarMinivue_type_script_lang_js,
  CommonCouponBarMinivue_type_template_id_7803d351_scoped_true/* render */.XX,
  CommonCouponBarMinivue_type_template_id_7803d351_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "7803d351",
  null
  
)

/* harmony default export */ const CommonCouponBarMini = (component.exports);

/***/ }),

/***/ 85187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(3362);
const request = __webpack_require__(49388);
const globalCondition = __webpack_require__(41761);
const JdRankList = (__webpack_require__(25807)/* ["default"] */ .A);
const util = __webpack_require__(60340);
let jdOriginRank = null;
const addLink = async () => {
  const a = document.createElement('A');
  a.innerHTML = `
        <img style="width: 24px; height: 24px; margin-right: 5px;" src="https://cdn.gwdang.com/images/extensions/hand-white@2x.png">
        <img src="https://cdn.gwdang.com/images/extensions/switchToPc.svg">
      `;
  a.id = 'gwd-link';
  a.style.position = 'fixed';
  a.style.width = '258px';
  a.style.height = '43px';
  a.style.background = '#e03024';
  a.style.borderRadius = '4px';
  a.style.top = '40%';
  a.style.left = '70%';
  a.style.zIndex = 9;
  a.classList.add('gwd-row');
  a.classList.add('gwd-align');
  a.style.justifyContent = 'center';
  a.id = 'gwd-link-m';
  let id = location.href.split('product/')[1];
  if (!id) {
    id = await (__webpack_require__(41761).met)('GwdDpIdGot');
    id = id.replace('-3', '.html');
  }
  let now_url = 'https://item.jd.com/' + id;
  a.href = G.u_server + '/union/go?site_id=3&target_url=' + encodeURI(now_url) + '&union=' + G.union + '&column=h5_to_pc';
  document.body.appendChild(a);
};
const dpAddRanking = async dpId => {
  //console.log('add dpId', dpId)
  let aList = $('.crumb-wrap .crumb.fl .item > a').toArray();
  let cat = '';
  if (aList.length) {
    let last = aList[aList.length - 1];
    let lastUrl = last.href;
    cat = util.getParameterByName('cat', lastUrl);
  }
  const res = await request.get(G.server + '/extension/RelatedRank?dp_id=' + dpId + (cat ? `&jcid=${cat}` : ''));
  const e = document.createElement('DIV');
  $('.preview-wrap').append(e);
  let r = [];
  if (res.data) {
    if (res.data.rank_p) {
      r = r.concat(res.data.rank_p);
    }
    if (res.data.rank_c) {
      r = r.concat(res.data.rank_c);
    }
  }
  if (!r.length) {
    let catId = G.dp.cat_id.split('-').join(',');
    r = await request.get(G.server + '/extension/RelatedRank?jcid=' + catId);
    if (r.data) {
      r = r.data.rank_c;
    }
  }
  if (!r.length && jdOriginRank) {
    let link = `https://ranking.m.jd.com/comLandingPage/comLandingPage?contentId=${jdOriginRank.rankId}&rankType=${jdOriginRank.rankTypeInt}&from=gwdang`;
    link = encodeURIComponent(link);
    r = [{
      rname: jdOriginRank.name.split('·')[0],
      site_id: '3',
      s: 1,
      rurl: `${G.u_server}/union/go/?site_id=3&target_url=${link}&union=union_gwdang&column=rank&crc64=1`
    }];
  }
  if (!r.length) {
    return;
  }
  const a = document.createElement('A');
  a.innerHTML = '查看榜单全部商品';
  if (G.lang === 'zh-tr') a.innerHTML = '查看榜單全部商品';
  a.classList.add('gwd-font11');
  a.classList.add('gwd-red-after-visit');
  a.href = r[0].rurl;
  a.target = '_blank';
  a.style.color = '#7d7e80';
  a.style.textDecoration = 'underline';
  a.style.position = 'relative';
  a.style.top = '-3px';
  a.style.display = 'inline-block';
  a.style.marginLeft = '15px';
  // a.addEventListener('click', e => {
  //   e.preventDefault()
  //   window.gwdRank.rankClick(r[0])
  // })
  $('.preview-wrap').append(a);
  new Vue({
    el: e,
    render: h => h(JdRankList, {
      props: {
        data: r.map(item => {
          return item;
        }),
        top: 15,
        additionalClass: 'gwd-w210'
      }
    })
  });
  await (__webpack_require__(60340).sleep)(2000);
  let widthLeft = $('.crumb.fl').css('width'),
    widthRight = $('.contact.fr').css('width'),
    total = $('#crumb-wrap .w').css('width');
  let length = parseInt(total) - parseInt(widthLeft) - parseInt(widthRight);
  if (length < 235) return;
  let e2 = document.createElement('DIV');
  $('.crumb.fl').append(e2);
  new Vue({
    el: e2,
    render: h => h(JdRankList, {
      props: {
        data: r.map(item => {
          return item;
        }),
        top: -3,
        additionalClass: 'gwd-w235'
      }
    })
  });
  // const a2 = document.createElement('A')
  // a2.innerHTML = '查看'
  // a2.classList.add('gwd-font11')
  // a2.classList.add('gwd-red-after-visit')
  // a2.href = r[0].rurl
  // a2.target = '_blank'
  // a2.style.color = '#7d7e80'
  // a2.style.textDecoration = 'underline'
  // a2.style.position = 'relative'
  // a2.style.top = '-3px'
  // a2.style.display = 'inline-block'
  // a2.style.marginLeft = '15px'
  // $('.crumb.fl').append(a2)

  // setTimeout(() => {
  //   let h = $('#crumb-wrap').height()
  //   debugger
  //   if (h > 50) {
  //     a2.remove()
  //   }
  // }, 300)
};
const listPageAddRanking = res => {
  if (!res || !res.data) {
    return;
  }
  setInterval(() => {
    if (!$('.gwd-jd-rank').length) {
      const e = document.createElement('DIV');
      $('#J_selectorPrice').after(e);
      new Vue({
        el: e,
        render: h => h(JdRankList, {
          props: {
            data: res.data.rank_c,
            top: -1,
            additionalClass: 'gwd-w217'
          }
        })
      });
    }
  }, 2000);
};
const searchAddRanking = async () => {
  const word = util.getParameterByName('keyword');
  const res = await request.get(G.server + '/extension/RelatedRank?w=' + word);
  listPageAddRanking(res);
};
const listAddRanking = async () => {
  const word = util.getParameterByName('cat');
  const res = await request.get(G.server + '/extension/RelatedRank?jcid=' + word);
  console.log(res);
  listPageAddRanking(res);
};
module.exports = {
  async init() {
    if (G.site !== '360buy') {
      return;
    }
    if (G.from_device === 'bijiago' || G.from_device === 'biyibi') {
      if (window.gwd_G) {
        return;
      }
    }
    const s = document.createElement('STYLE');
    s.innerHTML = ` .gwd_unfold .fixed { top: initial } `;
    document.body.appendChild(s);
    if (location.href.includes('item.m.jd.com/') || location.href.includes('mitem.jd.hk/product') || location.href.includes('.m.jd.com/product')) {
      addLink();
    }
    if (G.pageInfo.type === 2) {
      await (__webpack_require__(30888).waitForConditionFn)(() => pageConfig.eventTarget, 0);
      // window.pageConfig.eventTarget.addListener('onStockReady', e => {
      //   require('common/extConsole').log('tg', e.stock.data.rankUnited.revertItem)
      //   jdOriginRank = e.stock.data.rankUnited.revertItem
      // })

      let dpId = await globalCondition.met('GwdDpIdGot');
      await globalCondition.met('QRLinkReady');
      dpAddRanking(dpId);
    } else if (location.href.toLowerCase().includes('search.jd.com/search?keyword')) {
      searchAddRanking();
    } else if (location.href.includes('https://list.jd.com/list.html')) {
      listAddRanking();
    }
  }
};

/***/ }),

/***/ 86696:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
__webpack_require__(3362);
var _CouponArrow = _interopRequireDefault(__webpack_require__(8488));
var _QrError = _interopRequireDefault(__webpack_require__(49357));
var _Stamp = _interopRequireDefault(__webpack_require__(36408));
const getQRCode = __webpack_require__(95554);
var _default = exports.A = {
  props: ['type',
  // link, qr,
  'href', 'text', 'icon', 'mainColor', 'secondColor', 'takeBg', 'couponValue', 'qrParams', 'qrTitle', 'qrUrl', 'rebate', 'stamp', 'title'],
  components: {
    CouponArrow: _CouponArrow.default,
    QRError: _QrError.default,
    Stamp: _Stamp.default
  },
  data: () => ({
    loading: false,
    error: false,
    actualQr: '',
    showStampBg: true
  }),
  computed: {
    alterHref() {
      return (__webpack_require__(12826).appendTbInfoForUrl)(this.href);
    }
  },
  mounted() {
    if (G.aliSite) {
      this.addScrollLink();
    }
    if (this.stamp) {
      this.showStampBg = true;
    }
  },
  methods: {
    async addScrollLink() {
      // await require('common/globalCondition').met('butie')
      setTimeout(() => {
        (__webpack_require__(14535).add)(this.text, this.icon, (__webpack_require__(12826).appendTbInfoForUrl)(this.href), this.mainColor, this.secondColor, this.showStampBg, this.rebate);
      }, 300);
    },
    over() {
      this.$emit('over');
      if (this.type !== 'qr' || this.loading) return;
      if (this.qrUrl) {
        this.actualQr = this.qrUrl;
        return;
      }
      this.loading = true;
      getQRCode(this.qrParams, '', res => {
        this.loading = false;
        if (res[0].etag) {
          this.error = true;
        } else {
          this.error = false;
          this.actualQr = res[0].imgSrc;
        }
      });
    }
  }
};

/***/ }),

/***/ 87268:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.T = void 0;
__webpack_require__(3362);
var _AmazonSameLinks = _interopRequireDefault(__webpack_require__(98671));
const template = __webpack_require__(26133);
const userData = __webpack_require__(74222);
const request = __webpack_require__(49388);
const newtrend = __webpack_require__(30241);
const detect = __webpack_require__(3494);
const priceParser = __webpack_require__(5286);
const parse_price = __webpack_require__(86421);
const countryConfig = __webpack_require__(22209);
const util = __webpack_require__(30888);
__webpack_require__(63779);
const getText = selector => {
  if ($(selector).length) {
    return parseFloat($(selector).text().trim());
  }
  return '';
};
const getAliPrice = oriPrice => {
  let price = oriPrice;
  const promoPrice = getText('[class^=Price--extraPrice] span[class^=Price--priceText]');
  const pagePrice = G.dp.ori_price;
  if (pagePrice) price = pagePrice;
  if (promoPrice) price = promoPrice;
  if (isNaN(parseFloat(price))) {
    return oriPrice;
  }
  return parseFloat(price);
};
const oneHour = 3600000;
const oneDay = 24 * oneHour;
let currentCurrency;
let c_width = document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth : document.body.clientWidth;
let isForeignSite;
let priceTle = {
  'pri-t1': "价格上涨",
  'pri-t0': "价格平稳",
  'pri-t-1': "价格下降",
  'pri-t-2': "历史最低"
};
const edit_nopuzzle_promo = data => {
  let time0 = data[0].time;
  let lowest = data[0].price,
    lowIndex = 0;
  let lastloop;
  for (let i = 0; i < data.length; i++) {
    let num = Math.abs(data[i].time - time0) / 86400;
    data[i].time2 = new Date(data[i].time * 1000);
    if (num < 10) {
      if (data[i].price < lowest) {
        lowest = data[i].price;
        lowIndex = i;
      }
    } else {
      lastloop = lowIndex;
      data[lowIndex].showCircle = true;
      lowIndex = i;
      lowest = data[i].price;
      time0 = data[i].time;
    }
  }
  if (lastloop + 1 < lowIndex) {
    data[lowIndex].showCircle = true;
  }
};
const noTrendAddTrendData = data => {
  let host = location.host;
  let site_name;
  if (host.indexOf('taobao') === -1 && host.indexOf('tmall') === -1) {
    if (data.store && data.store[0].name) {
      site_name = data.store[0].name;
      data.store = null;
    } else {
      return data;
    }
  }
  let price = parseFloat(G.dp.price);
  if (G.aliSite) {
    price = getAliPrice(price);
  }
  if (!price) return data;
  let date = util.getTimeNumber(new Date().getTime() - 86400000 * 179, "5");
  let date2 = util.getTimeNumber(new Date().getTime(), "5");
  let arr = [];
  for (let i = 0; i < 180; i++) {
    arr.push(price);
  }
  date = new Date(date).getTime();
  let str = '淘宝';
  if (host.indexOf('tmall') > -1) str = '天猫';
  str = site_name || str;
  let noTrendObj = {
    all_line: arr,
    all_line_begin_time: date,
    first_price: price,
    current_price: price,
    highest: price,
    last_price: price * 100,
    lowest: price,
    lowest_date: new Date(date2).getTime(),
    name: str,
    price_range: `${price}-${price}`,
    price_status: 0
  };
  data.price_status = 0;
  data.store = [noTrendObj];
  data.taobaoNoTrend = true;
  return data;
};
const getCommonInfo = callback => {
  let pageUrl = location.href;
  if (G.site === 'taobao-ju') {
    let id = pageUrl.match(/item_id=(\d+)/)[1];
    pageUrl = `https://detail.tmall.com/item.htm?id=${id}`;
  }
  let url = encodeURIComponent(pageUrl);
  let price = G.dp.price;
  price = parseFloat(price);
  if (price) {
    if (isForeignSite) {
      price = G.dp.oldPrice;
    }
    price = parseInt(parseFloat(price * 100).toFixed(2));
    price = price.toFixed(2);
  } else {
    price = '';
  }
  if (G.aliSite) {
    price = getAliPrice(price);
  }
  getPriceHistoryDataAndRender(url, price, callback);
  if (G.site === 'taobao' || G.site === 'tmall') {
    let origin = window.removeEventListener;
    setTimeout(async () => {
      // eslint-disable
      // let map = {}
      // if (G.site === 'taobao') {
      //   map = Hub.config.get("sku").valItemInfo.skuMap; // eslint-disable-line
      // } else {
      //   let valItemInfo = await require('common/infoCollect/aliSku').getValItemInfo()
      //   map = valItemInfo.skuMap
      // }

      $('li').on('click', e => {
        if (!$(e.target).parents('.tb-key-sku').length) {
          console.log($(e.target).parents('.tb-key-sku'));
          return;
        }
        try {
          setTimeout(() => {
            window.extNeedReload = true;
          }, 0);
        } catch (e) {
          (__webpack_require__(7129).warn)(e);
        }
      });
      // $('li').on('click', function(e) {
      //   //console.log(e)
      //   setTimeout(() => {
      //     let selected = $('.tb-selected').toArray().map(item => $(item).attr('data-value')).join(';')
      //     let skuKey = ';' + selected + ';';
      //     skuKey = skuKey.replace(';;', ';').replace(';;', '');
      //     // console.log('skuKey',skuKey)
      //     // console.log(map)
      //     require('common/globalCondition').clear('lastPointPos')
      //     if (!map[skuKey]) {
      //       getPriceHistoryDataAndRender(encodeURIComponent(location.href), price, callback)
      //       return ;
      //     }
      //     let skuId = map[skuKey].skuId;
      //     //console.log('skuId', skuId)
      //     getPriceHistoryDataAndRender(encodeURIComponent(`https://sku-taobao.com/item.htm?id=${G.dp.itemId.replace('-83', '')}-${skuId}`), null, callback)
      //     //console.log('selected', skuId)
      //   }, 0)
      // })
    }, 0);
  }
};
let reqId = 0;
const getPriceHistoryDataAndRender = (url, price, callback) => {
  reqId++;
  let currentReq = reqId;
  if (url.indexOf('skuId') > -1) {
    let skuId = (__webpack_require__(60340).getParameterByName)('skuId', location.href);
    let dp = (__webpack_require__(60340).getParameterByName)('id', location.href);
    if (dp && skuId) {
      url = `https://sku-taobao.com/item.htm?id=${dp}-${skuId}`;
    }
  } else {
    try {
      let sku = Hub.config.get('sku');
      let skuId = sku.skuId;
      let dp = (__webpack_require__(60340).getParameterByName)('id', location.href);
      if (skuId && dp) {
        url = `https://sku-taobao.com/item.htm?id=${dp}-${skuId}`;
      }
    } catch (e) {
      (__webpack_require__(7129).warn)(e);
    }
  }
  // url = 'http://www.kede.com/candymagic51.html';
  request.get(`${G.server}/extension/price_towards?url=${url}&price=${price}&ver=1`, true).then(data => {
    if (data.itemQr) {
      (__webpack_require__(41761).setMet)('qrApiReady', data.itemQr);
    }
    if (currentReq !== reqId) {
      console.warn(`reqId mismatch ${currentReq}: ${reqId}`);
      return;
    }
    // data = {
    //   is_ban: true,
    //   action: {
    //     method: 'redirect',
    //     to: 'https://www.baidu.com'
    //   }
    // }
    try {
      if (data.is_ban && data.action && data.action.method === 'redirect' && data.action.to) {
        yanzhengma(data.action.to);
        return;
      }
      if (data.amazons && location.hostname.includes('amazon.cn') && !$('.gwd-amazon-link').length) {
        const el = document.createElement('DIV');
        if ($('#gwd-space').length) {
          $('#gwd-space').before(el);
        } else {
          $('.search-mod').before(el);
        }
        let siteName = $('#merchant-info .a-link-normal span').text();
        if (!siteName) {
          siteName = $('#sellerProfileTriggerId').text();
        }
        new Vue({
          el: el,
          render: h => h(_AmazonSameLinks.default, {
            props: {
              data: data.amazons.filter(x => {
                return x.title === siteName;
              })
            }
          })
        });
      }
      if (data.nopuzzle_promo && data.nopuzzle_promo.length > 0) {
        edit_nopuzzle_promo(data.nopuzzle_promo);
      }
      if (data.store && data.store.length > 0 && data.store[0].all_line.length) {
        G.dp.storeInfo = data.store;
        if (data.store[0].mobile_price) {
          G.dp.mobilePrice = data.store[0].mobile_price;
        }
        (__webpack_require__(41761).setMet)('GwdPriceTrendLoaded');
        (__webpack_require__(41761).setMet)('NowPrice', data.store[0].current_price);
        let store = data.store[0];
        let allLine = store.all_line;
        let nowPriceWithPromo = allLine[allLine.length - 1];
        (__webpack_require__(41761).setMet)('NowPriceWithPromo', nowPriceWithPromo);
      } else {
        (__webpack_require__(30888).waitForConditionFn)(() => G.dp.price && !isNaN(parseFloat(G.dp.price))).then(() => {
          if (G.dp.price) {
            if (isNaN(parseFloat(G.dp.price))) {
              return;
            }
            (__webpack_require__(41761).setMet)('NowPrice', G.dp.price);
          }
        });
      }
      if (data.store && data.store[1] && data.store[1].name === "到手价" && data.promo) {
        data.store[1].name = "凑单到手价";
      } else if (data.store) {
        data.store.length = 1;
      }
      if (currentCurrency && data && data.store) {
        data.store[0].currency = currentCurrency;
      }
      if (!data.store || data.store[0].all_line.length === 0) {
        var siteName = G.site;
        let siteId = detect.getSiteId(siteName);
        priceParser.init(siteId, function (price) {
          if (price && price > 0) {
            G.dp.oldPrice = price;
            G.dp.price = price;
          } else if (data.store && data.store.length && data.store[0].last_price) {
            G.dp.price = data.store[0].last_price / 100;
          }
          data = noTrendAddTrendData(data);
          callback(data);
        });
      } else {
        callback(data);
      }
    } catch (e) {
      callback(data);
    }
  });
};

// 一淘数据， 也就是淘宝天猫以前使用的别人的数据  此处是处理数据
const dealWithEtaoData = function (msg, callback) {
  if (!msg) return;
  if (!msg.list) return;
  let islowest, lowest, highest, currentTime, price_trend;
  let listSize = msg.list.length;
  let trenddata = [];
  let startTime = msg.startTime;
  currentTime = new Date(msg.curTime).getTime();
  lowest = highest = msg.list[0].price;
  let lowestTime;
  try {
    for (let i = 0; i < listSize; i++) {
      let item = msg.list[i];
      trenddata.push([new Date(item.time).getTime(), item.price]);
      if (item.price > highest) highest = item.price;
      if (item.price < lowest) {
        lowest = item.price;
      }
      if (i > 0 && lowest == item.price && item.price != msg.list[i - 1].price) {
        lowestTime = item.time;
      }
    }
    trenddata.unshift([new Date(startTime).getTime(), msg.list[0].price]);
    /*补点*/
    for (let i = listSize - 1; i > 0; i--) {
      if (trenddata[i][0] - trenddata[i - 1][0] > 86400000) {
        let itemTrend = [trenddata[i][0] - 86400000, trenddata[i - 1][1]];
        trenddata.splice(i, 0, itemTrend);
      }
    }
    /*判断当前时间是否大于最后一个点，如果大于， 则补最后一个点*/
    let lastData = trenddata[trenddata.length - 1];
    if (lastData[0] < currentTime) {
      let lstprice = lastData[1];
      let pagePrice = getSitePrice(G.site);
      if (currentTime - lastData[0] > 86400000) trenddata.push([currentTime - 86400000, lstprice]);
      if (pagePrice && lstprice != pagePrice) {
        if (pagePrice > highest) highest = pagePrice;
        if (pagePrice < lowest) lowest = pagePrice;
        trenddata.push([currentTime, pagePrice]);
      }
    }
    setTimeout(function () {
      // 修正最后一个点的价格
      let sitePrice = getSitePrice(G.site);
      if (sitePrice) {
        trenddata[trenddata.length - 1][1] = sitePrice;
      }

      //判断价格历史走势
      let result = getPriceStatus(trenddata);
      let price_status = result.price_status;
      let price_last = result.price_last;
      islowest = result.islowest;
      var price_range = lowest + "-" + highest;
      var startD = new Date(msg.startTime).getDate();
      var startM = new Date(msg.startTime).getMonth();
      var startY = new Date(msg.startTime).getFullYear();
      let allLine = [];
      let now_day = new Date();
      let getDataFromTime = time => {
        for (let i = 0; i < trenddata.length - 1; i++) {
          if (time >= trenddata[i][0] && time < trenddata[i + 1][0]) {
            return trenddata[i][1];
          }
        }
        return trenddata[trenddata.length - 1][1];
      };
      let start = trenddata[0][0];
      while (start <= now_day.getTime()) {
        let s = getDataFromTime(start);
        allLine.push(parseFloat(s.toFixed(2)));
        start += oneDay;
      }
      let year_line = null;
      if (allLine.length >= 365) {
        year_line = allLine.slice(allLine.length - 365);
      }
      let month_line = null;
      if (allLine.length >= 31) {
        month_line = allLine.slice(allLine.length - 31);
      }
      let short_day_line = null;
      if (allLine.length >= 6) {
        let dayline = allLine.slice(allLine.length - 6);
        short_day_line = [];
        for (let i = 0; i < dayline.length - 1; i++) {
          let newArr = [];
          for (let n = 0; n < 24; n++) {
            newArr.push(dayline[i]);
          }
          short_day_line = short_day_line.concat(newArr);
        }
        short_day_line.push(dayline[dayline.length - 1]);
      }
      let now_time = new Date();
      price_trend = {
        "price_status": price_status,
        "startD": startD,
        "startM": startM,
        "startY": startY,
        "now_day": now_day.getTime(),
        "startTime": startTime,
        "lowestTime": lowestTime,
        "extra": 'start from another',
        "store": [{
          "current_price": price_last,
          "all_line": allLine,
          "all_line_begin_time": trenddata[0][0] + 8 * oneHour,
          "year_line": year_line,
          "year_line_time": now_day.getTime() - 365 * oneDay,
          "month_line": month_line,
          "month_line_time": now_day.getTime() - 30 * oneDay,
          "short_day_line": short_day_line,
          "short_day_line_begin_time": now_time.getTime() + 8 * oneHour - 5 * oneDay,
          "min_stamp": "0",
          "islowest": islowest,
          "name": G.site === 'tmall' ? '天猫' : '淘宝',
          "price_range": price_range,
          "promo": [],
          "all_equal_short": false
        }]
      };
      callback(price_trend);
    }, 500);
    //return price_trend
  } catch (e) {}
};
const getSitePrice = function (site) {
  var price = '';
  if (site == 'taobao') {
    price = $('#J_PromoPriceNum').text();
    if (price == '' && $('#J_PromoPriceNum').length == 0) {
      price = $('#J_StrPrice .tb-rmb-num').text();
    }
  }
  if (site == 'tmall') {
    if (price == "") {
      price = $('#J_DetailMeta #J_PromoPrice span.tm-price').text();
    }
    if (price == "") {
      price = $('span.tm-price').text();
    }
    if (location.host === 'detail.tmall.hk') {
      price = $('span.tm-price:eq(1)').text();
    }
    if ($(".tb-wrTuan-num").text()) {
      price = $(".tb-wrTuan-num").text();
    }
  }
  if (site == 'taobao-95095') {
    price = $('#J_PromoPrice .tm-price').text();
    if (price == "") {
      price = $('#J_StrPriceModBox .tm-price').text();
    }
  }
  if (site == 'ai-taobao') {
    if (!G.chrome_extension) {
      price = window.pageconfig.promoPrice;
    } else {
      var pageconfig = $('.aitaobao-edetail-header script').text();
      price = /promoPrice":"([\d\.]+)"/.exec(pageconfig);
      if (price) price = price[1];
    }
    if (price == '' || !price) {
      price = $('.price-wrap .price-single .price-promo strong').text();
    }
  }
  if (price.indexOf('-') > -1) {
    price = price.split('-')[0];
  }
  return parse_price(price);
};
var tryTimes = 0;
const getContentFromDiv = fn => {
  if (tryTimes >= 9 && G.site == 'amazon' && location.host.indexOf('cn') != -1) return fn(false);else if (tryTimes >= 6) return fn(false);
  var msg = $(`#${G.extBrand}_myDiv`).text();
  if (msg) fn(msg);else {
    tryTimes++;
    setTimeout(function () {
      getContentFromDiv(fn);
    }, 1000);
  }
};
const getPriceInfo = callback => {
  if (G.site === 'amazon' && location.host != 'www.amazon.cn') {
    isForeignSite = true;
    currentCurrency = 'USD';
    if (location.host == 'www.amazon.co.jp') {
      currentCurrency = 'JPY';
    }
    if (['www.amazon.fr', 'www.amazon.de', 'www.amazon.es', 'www.amazon.nl', 'www.amazon.it'].indexOf(location.host) > -1) {
      currentCurrency = 'EUR';
    }
    if (location.host == 'www.amazon.ca') {
      currentCurrency = 'CAD';
    }
    if (location.host == 'www.amazon.co.uk') currentCurrency = 'GBP';
    getCommonInfo(callback);
  } else if (G.site === 'tmall' || G.site === 'taobao-95095' || G.site === 'ai-taobao' || G.site === 'taobao') {
    // require('common/getTaobaoTrend').getTrend(function(trenddata) {
    //   if (!trenddata || trenddata.nodata === true) {
    //     getCommonInfo(callback);
    //   } else {
    //     dealWithEtaoData(trenddata, function(data) {
    //       if (data) callback(data)
    //       else getCommonInfo(callback);
    //     });
    //   }
    // })

    /*以前因为我们价格走势对淘宝天猫的支持不好 所以使用了别人的数据， 现在基本上都使用了自己的数据， 所以上面也被注释了*/
    setTimeout(() => {
      getCommonInfo(callback);
    }, 200);
    // 避开lint js 检测
    if (false) {}
  } else if (G.site === 'aliexpress') {
    (__webpack_require__(20669).getTrendData)(data => {
      if (data) callback(data);
    });
  } else {
    getCommonInfo(callback);
  }
};
const getPriceStatus = trenddata => {
  // 对于使用第三方数据的， 判断价格走势
  var price_status = 0;
  var price_num = trenddata.length;
  let priceArr = trenddata.map(i => i[1]);
  let lowest = Math.min.apply(void 0, priceArr);
  var price_last = trenddata[price_num - 1][1];
  let islowest = false;
  var change_range = 20;
  let time_length = 0;
  for (var i = price_num - 1; i >= 0; i--) {
    var now_price = trenddata[i][1];
    if (i > 0) {
      time_length += (trenddata[i][0] - trenddata[i - 1][0]) / 86400000;
    }
    if (now_price == 0) {
      continue;
    }
    if (price_last == now_price) {
      if (time_length > 180) {
        break;
      }
      continue;
    } else if (parseFloat(price_last) > parseFloat(now_price) && i >= price_num - change_range - 1) {
      price_status = 1;
      break;
    } else if (parseFloat(price_last) < parseFloat(now_price)) {
      price_status = -1;
      if (price_last === lowest) {
        islowest = true;
        price_status = -2;
      }
      break;
    }
  }
  return {
    price_status: price_status,
    islowest: islowest,
    price_last: price_last
  };
};
let topRendered = false;
const renderBtnTop = data => {
  if (!data.store || data.store[0].all_line.length < 2) return;
  let w1 = c_width - 321;
  let status = data.price_status;
  status = 'pri-t' + status;
  let tle = priceTle[status];
  if (topRendered) {
    $('#gwdang-trend .btn-tab-sp').html(`
      <em class="gwd_bg ${status}"></em>
      <span class="tab-sp1 blkcolor1">${tle}</span>
    `);
    return;
  }
  let t = `<span class="btn-tab-sp">
      <em class="gwd_bg ${status}"></em>
      <span class="tab-sp1 blkcolor1">${tle}</span>
    </span>
    <div id="gwdang-trend-detail" class="gwdang-trend-detail top-bar-detail" style="white-space: nowrap">
      <div id="gwdang-pri-trend-chart" style="flex: 1; height:260px;" class="chart">
        <div id="big_tooltip_top" class="big_tooltip_box"></div>
        <div id="bar_trend_legend_btn" class="legend-btn-box">
          <span class="price-trend-sp pt-sp1 " data-id="days180">
            <em></em>
            <span>到手价(单件)</span>
          </span>
          <span class="review-trend-sp" data-id="plotSpecial">
            <em></em>
            <span>到手价(多件)</span>
          </span>
        </div>
      </div>
      <div class="gwd-collection-trend-content"></div>
    </div>
    `;
  topRendered = true;
  $('#gwdang-trend').append(t).css("display", "block");
  (__webpack_require__(7053).autoFixWidth)();
};
const renderBtnBtm = data => {
  if (!data.store || data.store[0].all_line.length < 2) return;
  let w1 = c_width - 321;
  let status = data.price_status;
  status = 'pri-t' + status;
  let tle = priceTle[status];
  for (let key in priceTle) {
    $('#gwdang-trend .trend-box-dev span').removeClass(key);
    $('#gwdang-trend .trend-box-dev em').removeClass(key);
  }
  $('#gwdang-trend .trend-box-dev span').text(tle).addClass(status);
  $('#gwdang-trend .trend-box-dev em').addClass(status);
  // $('#gwdang-pri-trend-chart').css('width', w1 + 'px')
  $('#gwdang-trend').css("display", "block");
};
const renderMini = async data => {
  await (__webpack_require__(30888).waitForConditionFn)(() => $('#mini_price_history').length);
  let no_price = '',
    settbg = 'setting-bg';
  let status = data.price_status;
  status = 'pri-t' + status;
  let tle = priceTle[status];
  if (!data.store || data.store[0].all_line.length < 2) {
    no_price = 'no-price';
    tle = '暂无价格走势';
    status = '';
    settbg = '';
    $('.gwd-collection-mini').remove();
  }
  if (G.site == 'amazon' || G.site == '6pm') {
    settbg = 'ht-bg';
  }
  let t = `<div class="minibar-btn-box ${no_price}">
        <em class="${settbg} pri-history-icon ${status}"></em>
        <span class="${status}">${tle}</span>
      </div>`;
  if (!data.store || data.store[0].all_line.length < 2) {
    $('#mini_price_history').addClass('no_price').off();
    $('#mini_price_history_detail').remove();
    $('#ht_minitrend_detail').remove();
  }
  $('#mini_price_history').append(t).css("display", "block");
  (__webpack_require__(7129).log)('render mini trend');
};
const yanzhengma = url => {
  (__webpack_require__(5300).log)('验证码', '弹出');
  let permanent = userData.get('permanent');
  if (G.site === 'steampowered' && permanent.setsteam !== '0') {
    renderYanzhengmaSteam(url);
    return;
  }
  let style = userData.get('permanent').style;
  if (style === 'top') {
    renderyanzhengmaTop(url);
  } else if (style === 'bottom') {
    renderyanzhengmaBtm(url);
  }
  renderyanzhengmaMini(url);
  setTimeout(() => {
    $('a.error-sp').on('click', e => {
      e.preventDefault();
      (__webpack_require__(5300).log)('验证码', '点击');
      location.href = url;
    });
  }, 0);
};
const renderYanzhengmaSteam = url => {
  let dom = $('.game_purchase_action:contains("开始游戏")');
  if (dom.length === 0) dom = $('.game_purchase_action:contains("在购物车中")');
  if (dom.length === 0) dom = $('.game_purchase_action:contains("添加至购物车")');
  let html = __webpack_require__(96044);
  let btntxt = `<span class="blkcolor1">访问异常</span>`;
  dom.eq(0).prepend(template.compile(html)({
    url: url
  }));
  dom.eq(0).parents('.game_area_purchase_game_wrapper').css('z-index', '999999');
  dom.eq(0).parents('.game_area_purchase_game').css('z-index', '9999999');
};
const renderyanzhengmaBtm = url => {
  let w1 = c_width - 321;
  let html = __webpack_require__(83357);
  let btntxt = `<span class="blkcolor1">访问异常</span>`;
  $('#gwdang-trend').append($(btntxt));
  $('.trend-box-dev').remove();
  // $('#gwdang-pri-trend-chart').css('width', w1 + 'px')
  $('#gwdang-trend-detail').empty().append(template.compile(html)({
    url: url
  }));
  $('#gwdang-trend').css("display", "block");
};
const renderyanzhengmaTop = url => {
  let html = __webpack_require__(97643);
  let btntxt = `<span class="blkcolor1">访问异常</span>`;
  $('#gwdang-trend').append($(btntxt));
  $('#gwdang-trend').append(template.compile(html)({
    url: url
  })).css('display', 'block');
  $('#gwdang-trend').on('mouseleave', function (e) {
    $('#gwdang-trend').removeClass('tab-hover');
  });
};
const renderyanzhengmaMini = url => {
  // 中间部分访问异常情况
  let html = __webpack_require__(12889);
  let btntxt = `<span class="blkcolor1">访问异常</span>`;
  $('#mini_price_history').append($(btntxt));
  $('#mini_price_history').append(template.compile(html)({
    url: url
  })).css('display', 'block');
};
const renderMiniDetail = async data => {
  // 加载中间展开部分
  await (__webpack_require__(30888).waitForConditionFn)(() => $('#mini_price_history').length);
  let dpdata = userData.get('dp_query');
  // if (G.site == 'amazon' || G.site == '6pm') return;
  let showapp = false;
  if (!G.forbidCoupon) {
    showapp = true;
  }
  if (G.IE7 || G.IE8 || G.IE9 || G.IE10 || G.IE11) {
    showapp = false;
  }
  if (dpdata && dpdata.b2c && !(dpdata.b2c instanceof Array)) {
    showapp = false;
  }
  if (G.aliSite) {
    showapp = false;
  }
  let html = __webpack_require__(725);
  $('#mini_price_history').append(html({
    showapp: showapp
  }));
  const TrendSideLine = (__webpack_require__(32606)/* ["default"] */ .A);
  let promoCopy = data.nopuzzle_promo ? JSON.parse(JSON.stringify(data.nopuzzle_promo)) : '';
  let storeCopy = data.store ? JSON.parse(JSON.stringify(data.store)) : '';
  let promoData = (__webpack_require__(75957).editData)(data.promo, promoCopy, storeCopy);
  data.promoShow = promoData;
  if (G.aliSite || G.site === '360buy') {
    $('#mini_price_history_detail').css('width', '690px');
  } else {
    // $('#mini_price_history_detail').css('width', '460px')
    $('#mini_price_history_detail').css('width', '690px');
  }
  if (true) {
    window.rightPromo = new Vue({
      el: '#gwd-mini-promo-history',
      render: h => h(TrendSideLine, {
        props: {
          promoHistory: data
        }
      })
    });
  }
  if (showapp) {
    $('#mini_price_history').addClass('showapp');
  }
  setTimeout(function () {
    if (!$('#mini_price_history').is(':visible')) {
      $('#mini_price_history').show();
    }
  }, 100);
};
const renderBtn = async data => {
  //$('#gwdang-trend').html('')
  let style = userData.get('permanent').style;
  if (style === 'top') {
    renderBtnTop(data);
  } else if (style === 'bottom') {
    renderBtnBtm(data);
  }
  $('#mini_price_history').html('');
  renderMini(data);
  if (!data.store || data.store[0].all_line.length < 2) return;
  renderMiniDetail(data);
  // const MiniTrendBox = require('./trend/MiniTrendBox.vue').default;
  // await require('standard/module/util').waitForConditionFn(() =>
  //   $('#mini_price_history').length)
  // const el = document.createElement('DIV')
  // $('#mini_price_history').append(el)
  // new Vue({
  //   el: el,
  //   render: h => h(MiniTrendBox, {
  //     props: {
  //       trendData: data
  //     }
  //   })
  // })

  $('#gwdang-trend').on('mouseleave', function (e) {
    setTimeout(function () {
      let arrs = $(e.target).parents();
      for (let i = 0; i < arrs.length; i++) {
        let id = $(arrs[i]).attr('id');
        if (id === 'favor_box') {
          return;
        }
      }
      //$('#gwdang-trend-detail').hide()
      $('#gwdang-trend').removeClass('tab-hover');
    }, 150);
  });
};
const renderRemind = data => {
  var money = '&yen;';
  let site = G.logsite;
  let moneyInfo = countryConfig.getMoneyInfo(site);
  if (moneyInfo) money = moneyInfo[0];
  setTimeout(async function () {
    await (__webpack_require__(41761).met)('PriceRemindSetted');
    (__webpack_require__(57652)/* .setPriceData */ .mW)(money, data);
    //require('./price_remind').init(`#gwdang-trend-detail`, money, data)
  }, 400);
};
const addPriceStatus = data => {
  if (data.price_status === -1 && data.store.length > 0) {
    let lastPrice = data.store[0].last_price / 100;
    let lowestP = data.store[0].lowest;
    if (lastPrice === lowestP) {
      data.price_status = -2;
    }
  }
  if (!data.now_day) {
    data.now_day = Date.now();
  }
  return data;
};
const init = async () => {
  G.shaidanAvailable = false;
  topRendered = false;
  (__webpack_require__(30241)["default"]).resetBind();
  if (G.site === 'epic') {
    (__webpack_require__(15554).init)();
    return;
  }

  // 获取价格走势数据
  await (__webpack_require__(60340).sleep)(1000);
  let urlBeforeRequest = location.href;
  window.gwd_trend_request_id = Date.now();
  let d = window.gwd_trend_request_id;
  getPriceInfo(async data => {
    if (d !== window.gwd_trend_request_id) {
      return;
    }
    if (location.href !== urlBeforeRequest) {
      if (G.aliSite) {
        let oldId = (__webpack_require__(60340).getParameterByName)('id', urlBeforeRequest);
        let currentId = (__webpack_require__(60340).getParameterByName)('id');
        let oldSku = (__webpack_require__(60340).getParameterByName)('skuId', urlBeforeRequest);
        let currentSku = (__webpack_require__(60340).getParameterByName)('skuId');
        (__webpack_require__(7129).log)('situation 1');
        if (oldId !== currentId || oldSku !== currentSku) {
          (__webpack_require__(7129).warn)('url mismatch tb', {
            old: urlBeforeRequest,
            current: location.href
          });
          if (oldSku) {
            return;
          }
        }
      } else {
        (__webpack_require__(7129).warn)('url mismatch 2', {
          old: urlBeforeRequest,
          current: location.href
        });
        return;
      }
    }
    if (G.site === 'steampowered') {
      // 如果当前页面是steam网站 就加载steam价格走势
      let permanent = userData.get('permanent');
      if (permanent && permanent.setsteam !== '0') {
        (__webpack_require__(16327).init)(data);
      }
      return;
    }
    // 判断是否是历史最低价
    data = addPriceStatus(data);
    // 加载价格走势标签
    renderBtn(data);
    // 加载价格走势里面的降价提醒
    renderRemind(data);
    // renderDetail()
    let dpId = await (__webpack_require__(41761).met)('GwdDpIdGot');
    if (!data.store || data.store[0].all_line.length < 2) return;
    $(`#biggraph_${G.from_device}`).remove();
    (__webpack_require__(7129).log)(data.store);
    (__webpack_require__(30241)["default"]).init(data, 'dpPage', false, {
      top: false,
      middle: false,
      bottom: false,
      baidu: false
    });
    //let img = await require('common/request').get(`${G.server}/extension/QrCode?tag=PromoDetail&dp_id=${dpId}`)
    if (data.promo && data.promo.length > 0) {
      //$('#trend_com_detail').remove();
      //G.promoTrendRendered = true
      //$('.app-tuiguang').remove()
      //$('#mini_price_history').removeClass('showapp')
      //require('./promoHistory').init(data.promo, data.nopuzzle_promo, data.store, '')
    }
  });
};
exports.T = init;

/***/ }),

/***/ 87529:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticStyle: {
      display: "block !important",
      "z-index": "9999999999 !important"
    },
    attrs: {
      id: _vm.domName
    }
  }, [_c("div", {
    staticClass: "gwdang-main",
    style: `display: ${_vm.fold === "1" ? "none" : "flex"};`,
    attrs: {
      id: "gwdang_main"
    }
  }, [_c("div", {
    staticClass: "gwd-topbar-logo"
  }, [_c("em", {
    staticClass: "gwd_bg"
  }), _vm._v(" "), _c("div", {
    attrs: {
      id: "gwd_setting_div"
    }
  }, [_c("div", {
    staticClass: "gwd-hover-helper"
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd_setting_item gwd_setting_item_fst"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_function_setting"
  }), _vm._v(" "), _c("a", {
    on: {
      click: function ($event) {
        return _vm.openTab();
      }
    }
  }, [_vm._v("功能设置")])]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2)])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _vm.showAd ? _c("a", {
    staticStyle: {
      "line-height": "0"
    },
    attrs: {
      id: "gwdang-banner-ad",
      title: "点击领取",
      target: "_blank",
      href: _vm.jdadUrl
    }
  }, [_c("img", {
    staticStyle: {
      height: "32px"
    },
    attrs: {
      src: "https://cdn.gwdang.com/images/extensions/ad1111/gwdang_go.png"
    }
  })]) : _vm._e(), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    },
    attrs: {
      id: "gwd-space"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-topbar-right"
  }, [_c("div", {
    staticClass: "search-mod"
  }), _vm._v(" "), _c("div", {
    staticClass: "feedback-close",
    attrs: {
      id: "gwdang-feed-close"
    }
  }, [_vm._m(4), _vm._v(" "), _c("a", {
    staticClass: "gwdang-suggest",
    attrs: {
      href: _vm.f_url,
      id: "gwdang-suggest",
      target: "_blank",
      title: "提建议或吐槽遇到的问题"
    }
  }, [_c("em", {
    staticClass: "gwd_bg"
  }), _vm._v(" "), _c("span", {
    staticClass: "blkcolor1"
  }, [_vm._v("反馈")])]), _vm._v(" "), _c("a", {
    staticClass: "top-bar-setting",
    attrs: {
      href: _vm.s_url,
      target: _vm.s_url ? "_blank" : "",
      title: "功能设置"
    }
  }, [_c("em", {
    staticClass: "gwd_bg"
  })]), _vm._v(" "), _vm._m(5)])])]), _vm._v(" "), _c("div", {
    staticClass: "gwdang-mini",
    style: `display: ${_vm.fold === "1" ? "block" : "none"}`,
    attrs: {
      id: "gwdang-mini"
    }
  }, [_c("div", {
    staticClass: "gwdang-nav main",
    attrs: {
      id: "gwdang-main-nav"
    }
  }, [_c("a", {
    staticClass: "gwd_logo gwd_bg",
    attrs: {
      href: "#"
    },
    on: {
      click: function ($event) {
        $event.preventDefault();
      }
    }
  }, [_c("div", {
    attrs: {
      id: "gwd_setting_div"
    }
  }, [_c("div", {
    staticClass: "gwd-hover-helper"
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd_setting_item gwd_setting_item_fst"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_function_setting"
  }), _vm._v(" "), _c("a", {
    on: {
      click: function ($event) {
        return _vm.openTab();
      }
    }
  }, [_vm._v("功能设置")])]), _vm._v(" "), _c("div", {
    staticClass: "gwd_setting_item"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_opinion_feedback"
  }), _vm._v(" "), _c("a", {
    attrs: {
      target: "_blank"
    },
    on: {
      click: function ($event) {
        return _vm.openLink("https://www.gwdang.com/brwext/suggest");
      }
    }
  }, [_vm._v("意见反馈")])]), _vm._v(" "), _c("div", {
    staticClass: "gwd_setting_item"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_use_help"
  }), _vm._v(" "), _c("a", {
    attrs: {
      target: "_blank"
    },
    on: {
      click: function ($event) {
        return _vm.openLink("https://www.gwdang.com/v2/app/questions");
      }
    }
  }, [_vm._v("使用帮助")])]), _vm._v(" "), _c("div", {
    staticClass: "gwd_setting_item"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_homepage"
  }), _vm._v(" "), _c("a", {
    attrs: {
      target: "_blank"
    },
    on: {
      click: function ($event) {
        return _vm.openLink("https://www.gwdang.com/");
      }
    }
  }, [_vm._v("购物党首页")])])])]), _vm._v(" "), _c("a", {
    staticClass: "unfold_pointer gwd_bg",
    attrs: {
      href: "javascript:",
      title: "点击展开",
      id: "gwd_fold_pointer"
    }
  })])])]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd_setting_item"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_opinion_feedback"
  }), _vm._v(" "), _c("a", {
    attrs: {
      href: "https://www.gwdang.com/brwext/suggest",
      target: "_blank"
    }
  }, [_vm._v("意见反馈")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd_setting_item"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_use_help"
  }), _vm._v(" "), _c("a", {
    attrs: {
      href: "https://www.gwdang.com/v2/app/questions",
      target: "_blank"
    }
  }, [_vm._v("使用帮助")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd_setting_item"
  }, [_c("div", {
    staticClass: "gwd_bg gwd_homepage"
  }), _vm._v(" "), _c("a", {
    attrs: {
      href: "https://www.gwdang.com/",
      target: "_blank"
    }
  }, [_vm._v("购物党首页")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-topbar-left"
  }, [_c("div", {
    staticClass: "gwdang-tab",
    attrs: {
      id: "amazon_compare"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwdang-tab",
    attrs: {
      id: "b2c_compare"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwdang-tab",
    attrs: {
      id: "tb_compare"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwdang-tab",
    attrs: {
      id: "tm_compare"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwdang-tab",
    attrs: {
      id: "gwdang-trend"
    }
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwdang-icon favor",
    attrs: {
      href: "javascript:",
      id: "gwdang-favor",
      title: "我的收藏夹",
      target: "_self"
    }
  }, [_c("em", {
    staticClass: "hasColor gwd_bg"
  }), _vm._v(" "), _c("span", {
    staticClass: "blkcolor1 favortle",
    attrs: {
      title: "收藏并获得降价提醒"
    }
  }, [_vm._v("我的收藏夹")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "gwd_close",
    attrs: {
      href: "javascript:",
      target: "_self",
      title: "关闭购物党"
    }
  }, [_c("em", {
    staticClass: "gwd_bg"
  })]);
}];
render._withStripped = true;

/***/ }),

/***/ 89084:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);
var __WEBPACK_AMD_DEFINE_RESULT__;

/*
 * 监控模块，负责监控库存和价格，上报给服务器,需要依赖 库存监控模块 和价格监控模块
 * @version:0.0.1
 * @author:caoyuanye
 * @since:2014-07-30
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  let request = __webpack_require__(49388);
  let priceParser = __webpack_require__(5286);
  const detect = __webpack_require__(3494);
  const userData = __webpack_require__(74222);
  var priceCheck = __webpack_require__(78878),
    inventoryCheck = __webpack_require__(19777);
  return {
    timeOut: 5,
    //监控的最长时间,秒计算
    timer: null,
    //查询库存的计时器
    sendTimer: null,
    //发送计时器，用来确保获取dp_id
    inventory: null,
    //监控到的库存
    price: null,
    //监控到的价格
    specialSendFlag: false,
    //如果是天猫淘宝，就不抓取库存直接运行
    hasRun: false,
    init: function () {
      if (this.hasRun) {
        return;
      }
      this.hasRun = true;
      var $this = this;
      $this._setPrice(() => {
        $this._setInventory();
        $this._trySendMonitorData();
      });
    },
    _trySendMonitorData: function () {
      var $this = this;
      var trySendTime = 0;
      $this.sendTimer = setInterval(function () {
        ++trySendTime;
        if (trySendTime > $this.timeOut || G.save_dp_query != null) {
          let other_info = userData.get('other_info');
          var dp_id = other_info && other_info.now && other_info.now.dp_id;
          $this._sendMonitorData(dp_id);
          clearInterval($this.sendTimer);
        }
      }, 1000);
    },
    //发送监控到的库存和价格趋势，如果没有抓取到，就把库存默认设定成-2,价格默认设定成0
    _sendMonitorData: function (dp_id) {
      var $this = this;
      let spPage = (__webpack_require__(79963).specialFilter)();
      if (spPage) return;
      if ($this.inventory == null) {
        $this.inventory = "-2";
      }
      if ($this.price == null) {
        $this.price = "0";
      }
      let payload = {
        site: G.site,
        subsite_id: G.subsite_id,
        dp_id: dp_id,
        province_id: G.province_id,
        url: encodeURIComponent(G.dp.url),
        price: $this.price,
        stock: $this.inventory,
        rawurl: encodeURIComponent(window.location.href)
      };
      if (G.priceTextCollectedFromPage) {
        payload.price_text = G.priceTextCollectedFromPage;
      }
      const url = request.makeUrl(G.server, '/brwext/monitor', payload);
      request.get(url);
    },
    _setPrice: function (callback) {
      var that = this;
      var siteName = G.site;
      let siteId = detect.getSiteId(siteName);
      if (!siteId) siteId = 9999;
      priceParser.init(siteId, function (price) {
        if (price && price > 0) {
          that.price = price;
          G.dp.oldPrice = price;
        } else {
          that.price = G.dp.price;
        }
        if (!that.price) that.price = priceCheck.getOnlinePrice(siteName);
        if (siteName == 'taobao' && that.price != '0') {
          that.specialSendFlag = true;
        }
        if (siteName == '360buy') {
          // 京东的定金不发
          if ($(".itemInfo-wrap:contains('定　　金')").length) {
            return;
          }
        }
        if (callback) {
          callback();
        }
      });
    },
    _setInventory: function () {
      this.inventory = inventoryCheck.init(G.site);
    }
  };
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 90084:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ Errorvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ Error)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Error.vue?vue&type=template&id=12202de2&scoped=true
var Errorvue_type_template_id_12202de2_scoped_true = __webpack_require__(12591);
;// ./src/standard/module/components/ImgSame/Error.vue?vue&type=template&id=12202de2&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Error.vue?vue&type=script&lang=js
var Errorvue_type_script_lang_js = __webpack_require__(40473);
;// ./src/standard/module/components/ImgSame/Error.vue?vue&type=script&lang=js
 /* harmony default export */ const ImgSame_Errorvue_type_script_lang_js = (Errorvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/ImgSame/Error.vue?vue&type=style&index=0&id=12202de2&prod&scoped=true&lang=less
var Errorvue_type_style_index_0_id_12202de2_prod_scoped_true_lang_less = __webpack_require__(3651);
;// ./src/standard/module/components/ImgSame/Error.vue?vue&type=style&index=0&id=12202de2&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/ImgSame/Error.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  ImgSame_Errorvue_type_script_lang_js,
  Errorvue_type_template_id_12202de2_scoped_true/* render */.XX,
  Errorvue_type_template_id_12202de2_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "12202de2",
  null
  
)

/* harmony default export */ const Error = (component.exports);

/***/ }),

/***/ 90664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(95131);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("b50c777a", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 90827:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.selectProductBySkuProps = exports.extractJdProductPrice = exports.getJdProductPrice = exports.extractAliProductPrice = exports.reArangeSkuProps = exports.extractAliSkuProps = exports.extractJdSkuProps = void 0;
var request = __webpack_require__(49388);
var extractJdSkuProps = function () {
    var skuProps = [];
    // Find all choose-attr elements
    var chooseAttrs = document.querySelectorAll('#choose-attrs [id^="choose-attr-"]');
    chooseAttrs.forEach(function (attrEl) {
        // Get the property name from the dt element
        var dtEl = attrEl.querySelector('.dt');
        if (!dtEl)
            return;
        // Extract property name, removing "选择" prefix if present
        var name = attrEl.getAttribute('data-type') || '';
        // name = name.replace(/^选择/, '').trim();
        // Get all options from item elements
        var options = Array.from(attrEl.querySelectorAll('.item')).map(function (itemEl) {
            var value = itemEl.getAttribute('data-value') || '';
            // Check for image
            var imgEl = itemEl.querySelector('img');
            var img = imgEl ? imgEl.getAttribute('src').replace('s28x28', 's114x114') || undefined : undefined;
            return { value: value, img: img };
        });
        // Add to skuProps if options exist
        if (options.length > 0) {
            skuProps.push({ name: name, options: options });
        }
    });
    return skuProps;
};
exports.extractJdSkuProps = extractJdSkuProps;
var extractAliSkuProps = function (skuInfo) {
    var _a;
    if (!((_a = skuInfo === null || skuInfo === void 0 ? void 0 : skuInfo.skuBase) === null || _a === void 0 ? void 0 : _a.props)) {
        return [];
    }
    return skuInfo.skuBase.props.map(function (prop) {
        var name = prop.name;
        var options = prop.values.map(function (value) {
            var option = {
                value: value.name,
                img: undefined
            };
            // Check for image in the value object
            if (value.image) {
                option.img = value.image;
            }
            return option;
        });
        return { name: name, options: options };
    });
};
exports.extractAliSkuProps = extractAliSkuProps;
var reArangeSkuProps = function (skuProps) {
    // Create two arrays: one for props with images, one without
    var propsWithImages = skuProps.filter(function (prop) {
        return prop.options.some(function (option) { return option.img; });
    });
    var propsWithoutImages = skuProps.filter(function (prop) {
        return !prop.options.some(function (option) { return option.img; });
    });
    // Combine arrays to put image props first while preserving original order within each group
    return __spreadArray(__spreadArray([], propsWithImages, true), propsWithoutImages, true);
};
exports.reArangeSkuProps = reArangeSkuProps;
var extractAliProductPrice = function (skuInfo) {
    var _a, _b;
    // Check if the necessary data exists
    if (!((_a = skuInfo === null || skuInfo === void 0 ? void 0 : skuInfo.skuBase) === null || _a === void 0 ? void 0 : _a.skus) || !((_b = skuInfo === null || skuInfo === void 0 ? void 0 : skuInfo.skuCore) === null || _b === void 0 ? void 0 : _b.sku2info)) {
        return [];
    }
    var products = [];
    // Create a map of pid to prop name for easier lookup
    var pidToPropName = {};
    // Create a map of vid to value name for easier lookup
    var vidToValueName = {};
    // Populate the maps
    if (skuInfo.skuBase.props) {
        for (var _i = 0, _c = skuInfo.skuBase.props; _i < _c.length; _i++) {
            var prop = _c[_i];
            pidToPropName[prop.pid] = prop.name;
            for (var _d = 0, _e = prop.values; _d < _e.length; _d++) {
                var value = _e[_d];
                vidToValueName[value.vid] = value.name;
            }
        }
    }
    // Process each sku
    for (var _f = 0, _g = skuInfo.skuBase.skus; _f < _g.length; _f++) {
        var sku = _g[_f];
        var skuId = sku.skuId;
        var skuInfo2 = skuInfo.skuCore.sku2info[skuId];
        // Skip if price info doesn't exist
        if (!skuInfo2 || !skuInfo2.price) {
            console.warn("[alisku] Missing price info for skuId ".concat(skuId), skuInfo2);
            continue;
        }
        // Extract price as number
        var price = parseFloat(skuInfo2.price.priceMoney) / 100; // Convert from cents to yuan/dollars
        if (skuInfo2.subPrice) {
            // If there's a subPrice, use it instead
            price = parseFloat(skuInfo2.subPrice.priceText);
        }
        // Parse propPath to get properties
        var props = {};
        if (sku.propPath) {
            var propPairs = sku.propPath.split(';');
            for (var _h = 0, propPairs_1 = propPairs; _h < propPairs_1.length; _h++) {
                var pair = propPairs_1[_h];
                var _j = pair.split(':'), pid = _j[0], vid = _j[1];
                if (pid && vid && pidToPropName[pid] && vidToValueName[vid]) {
                    props[pidToPropName[pid]] = vidToValueName[vid];
                }
            }
        }
        products.push({
            props: props,
            price: price,
            skuId: skuId
        });
    }
    return products;
};
exports.extractAliProductPrice = extractAliProductPrice;
var getJdProductPrice = function (skuIdList) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request.post("".concat(G.server, "/extension/ProductFilter?scene=skulist"), {
                    dp_ids: skuIdList.map(function (x) { return x + '-3'; }).join(','),
                    dp_id: pageConfig.product.skuid + '-3'
                }, true)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
exports.getJdProductPrice = getJdProductPrice;
var extractJdProductPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    var jdColorSize, skuIdList, response, products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jdColorSize = pageConfig.product.colorSize;
                skuIdList = jdColorSize.map(function (item) { return item.skuId; });
                return [4 /*yield*/, (0, exports.getJdProductPrice)(skuIdList)];
            case 1:
                response = _a.sent();
                console.log('jd product sku price response', response);
                if (!response) {
                    return [2 /*return*/, []];
                }
                if (response.error_msg === 'Limited') {
                    throw new Error('limitReached');
                }
                products = [];
                // Process each color-size variant
                jdColorSize.forEach(function (item) {
                    var _a, _b;
                    // Extract properties, excluding skuId and stock
                    var props = {};
                    for (var key in item) {
                        if (key !== 'skuId' && key !== 'stock' && typeof item[key] === 'string') {
                            props[key] = item[key];
                        }
                    }
                    // Get price from response
                    var dpId = "".concat(item.skuId, "-3");
                    var price = 0;
                    if (response.list && response.list[dpId]) {
                        // Check if there's a promotional price
                        if ((_a = response.list[dpId].promo) === null || _a === void 0 ? void 0 : _a.current_price) {
                            price = parseFloat(response.list[dpId].promo.current_price);
                        }
                        // Otherwise use the regular price
                        else if (response.list[dpId].pri) {
                            price = parseFloat(response.list[dpId].pri) / 100;
                        }
                    }
                    if (pageConfig.product.skuid.toString() === item.skuId.toString()) {
                        if (pageConfig.product.fPrice) {
                            price = parseFloat(pageConfig.product.fPrice);
                        }
                        else if (pageConfig.product.jp) {
                            price = parseFloat(pageConfig.product.jp);
                        }
                        else if ((_b = pageConfig.product.pinGouInfo) === null || _b === void 0 ? void 0 : _b.bp) {
                            price = parseFloat(pageConfig.product.pinGouInfo.bp);
                        }
                    }
                    products.push({
                        props: props,
                        price: price,
                        skuId: item.skuId.toString()
                    });
                });
                return [2 /*return*/, products];
        }
    });
}); };
exports.extractJdProductPrice = extractJdProductPrice;
var selectProductBySkuProps = function (skuProps, products) {
    return products.filter(function (product) {
        for (var key in skuProps) {
            if (product.props[key] !== skuProps[key]) {
                return false;
            }
        }
        return true;
    });
};
exports.selectProductBySkuProps = selectProductBySkuProps;


/***/ }),

/***/ 90834:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['d1', 'd2', 'aliSite', 'promoUrl', 'lowtle', 'showcoudan']
};

/***/ }),

/***/ 90837:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
__webpack_require__(23792);
__webpack_require__(62953);
var _default = exports.A = {
  props: ['trendInfoList'],
  data() {
    return {
      promo: []
    };
  },
  mounted() {
    (__webpack_require__(41761).met)('showingPromo').then(promo => {
      if (G.currency) {
        return;
      }
      this.promo = promo.map(item => ({
        text: (item.dateStr === '06-18' ? '618' : '双11') + item.type + ': ¥' + item.price,
        date: item.date
      }));
      this.$nextTick(() => {
        const rightPos = this.$el.querySelector('.gwd-placeholder').offsetLeft;
        // console.log('rightPos', rightPos, this.displayInfoList)
        if (rightPos > 470) {
          (__webpack_require__(41761).setMet)('hasTop');
        }
      });
    });
  },
  computed: {
    displayText() {
      return this.displayInfoList.map(item => item.text.replace('.00', '')).join('');
    },
    displayInfoList() {
      const list = [...this.trendInfoList, ...this.promo];
      if (list.length > 4) {
        (__webpack_require__(41761).setMet)('hasTop');
      }
      return list;
    },
    classList() {
      return {
        'gwd-mini': this.displayInfoList.length < 3,
        'gwd-big': this.displayInfoList.length > 4 || this.displayText.length > 50
      };
    }
  },
  watch: {
    displayText(newVal) {
      const realLen = newVal.replace(/[\d.]/g, '').length + Math.ceil(newVal.replace(/[^\d.]/g, '').length / 1.5);
      if (realLen > 43) {
        // require('common/globalCondition').setMet('hasTop')
      }
    }
  }
};

/***/ }),

/***/ 90937:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-trend-info-list[data-v-e0ed5136] {\n  margin-top: -3px;\n  padding-left: 12px;\n  padding-right: 12px;\n  box-sizing: border-box;\n  background-color: white;\n  width: auto;\n}\n.gwd-trend-info-list .gwd-column[data-v-e0ed5136] {\n  align-items: flex-start;\n  margin-right: 20px;\n}\n.gwd-trend-info-list .gwd-column[data-v-e0ed5136]:last-child {\n  margin-right: 0;\n}\n.gwd-trend-info-list .gwd-text[data-v-e0ed5136] {\n  font-size: 12px;\n  line-height: 20px;\n  color: #404547;\n  white-space: nowrap;\n}\n.gwd-trend-info-list .gwd-date[data-v-e0ed5136] {\n  font-size: 12px;\n  line-height: 14px;\n  color: #999;\n  transform: scale(0.9166);\n  transform-origin: center left;\n}\n", ""]);

// exports


/***/ }),

/***/ 91129:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);


__webpack_require__(3362);
const template = __webpack_require__(26133);
const promoQuanDetail = __webpack_require__(4314);
const gwdAd = __webpack_require__(51131);
const request = __webpack_require__(49388);
const detect = __webpack_require__(3494);
const userData = __webpack_require__(74222);
let style;
const addEm = data => {
  for (let i = 0; i < data.length; i++) {
    data[i].puretle = data[i].title;
    data[i].title = data[i].title.replace(/\b([0-9.]+)\b/g, '<em>$1</em>');
  }
  return data;
};
const addEvent = () => {
  let timer;
  let btn = $('#promo_quan_btn'),
    addC = "",
    detail = $('#promo_quan_detail');
  if (style == 'bottom') {
    btn = $(`#${G.extBrand}-hui`);
    addC = `${G.extBrand}-compare-item-hover`;
  }
  btn.on('mouseenter', () => {
    detail.show();
    btn.addClass('msHover');
    btn.find('a').addClass(addC);
    let left = btn.offset().left - 1;
    if (detail.width() + left > $(window).width()) {
      detail.css('right', '0px');
    } else {
      detail.css('left', parseInt(left) + 'px');
    }
  });
  btn.on('mouseleave', () => {
    timer = setTimeout(() => {
      detail.hide();
      btn.removeClass('msHover');
      btn.find('a').removeClass(addC);
    }, 100);
  });
  detail.on('mouseenter', () => {
    clearTimeout(timer);
  });
  detail.on('mouseleave', () => {
    detail.hide();
    btn.removeClass('msHover');
    btn.find('a').removeClass(addC);
  });
};
const renderDetailTop = (dom, data, now) => {
  if (!now) now = {
    site_name: data.site_name
  };
  let promo_site = now.site_name || data.site_name;
  let quan_site = now.site_name || data.site_name;
  let promo_url = data.promotion.url;
  let quan_url = data.quan && data.quan.url;
  if (!data.promotion.site_has_promo) {
    promo_site = "全网最新";
  }
  if (data.promotion.promos.length == 1) {
    promo_url = data.promotion.promos[0].url;
  }
  if (data.quan && !data.quan.site_has_quan) {
    quan_site = "全网最受关注";
  }
  let showingPromos = addEm(data.promotion.promos.slice(0, 4));
  let showingQuans = addEm(data.quan && data.quan.quans && data.quan.quans.slice(0, 4) || []);
  if (!showingQuans.length && !showingPromos.length) {
    return;
  }
  $(dom).append(template.compile(promoQuanDetail)({
    promo_site: promo_site,
    quan_site: quan_site,
    promos: showingPromos,
    promo_url: promo_url,
    quans: showingQuans,
    quan_url: quan_url,
    s_server: G.s_server,
    new_extension: G.new_extension,
    style: style
  }));
  addEvent();
};
const renderDetail = (now, data) => {
  if (style == 'top') renderDetailTop(`.gwd-topbar-left`, data, now);else if (style == 'bottom') renderDetailTop(G.dval, data, now);
};
const renderAd = data => {
  if (!data) return;
  if (data.promo.length === 0) return;
  let size = 1;
  if (data.promo.length === 1) size = 0;
  let promo = data.promo[size];
  let html = __webpack_require__(91638);
  $('.detail_right').append(template.compile(html)({
    item: promo
  }));
  $('.detail_right').show();
};
const renderBtnTop = () => {
  let dom = `<div id="promo_quan_btn" class="gwdang-tab">
    <span class="btn-tab-sp">
      <em class="gwd-bg"></em>
      <span class="tab-sp1 blkcolor1">促销优惠券</span>
    </span>
  </div>`;
  if ($(`.gwd-topbar-left`).length > 0) {
    $(`.gwd-topbar-left`).append($(dom));
  } else {
    $(`#${G.extName}-main-contents`).append($(dom));
  }
  $('#promo_quan_btn').show();
  (__webpack_require__(7053).autoFixWidth)();
};
const renderBtnBottom = () => {};
const renderBtn = () => {
  if (style == 'top') renderBtnTop();else if (style == 'bottom') renderBtnBottom();
};
const getPromoInfo = (obj, callback) => {
  let url = `${G.server}/extension?ac=promotion&site_id=${obj.site_id}&class_id=${obj.class_id}&style=${style}`;
  request.get(url).done(data => {
    if (data) {
      callback(data);
    }
  });
};

// const renderZol = (obj, data) => {
//   gwdAd.init({
//     class_id: obj.class_id,
//     keyword: obj.keyword
//   }, (msg) => {
//     if (msg.promo.length > 0) {
//       msg.promo[0].puretle = msg.promo[0].title;
//       data.promotion.promos = msg.promo.concat(data.promotion.promos);
//     }
//     let html = require('art-template-loader!../views/zolpromo.html')
//     $('.wrapper .breadcrumb').eq(0).after(template.compile(html)({
//       data: data.promotion.promos.slice(0, 3)
//     }))
//   })

// }

module.exports.renderSearch = () => {
  if (G.site.indexOf('taobao') > -1 || G.site.indexOf('tmall') > -1 || G.site == '1688') {
    $(`#${G.extBrand}-hui`).hide();
    return;
  }
  let siteId = detect.getSiteId(G.site);
  if (!siteId) return;
  let obj = {};
  obj.site_id = siteId;
  getPromoInfo(obj, msg => {
    renderDetail(null, msg);
  });
};
module.exports.init = async data => {
  let d = await (__webpack_require__(41761).met)('dp_query_latest_complete');
  if (d.ingre) {
    await (__webpack_require__(41761).met)('no_reviews');
    await (__webpack_require__(41761).met)('ingreComplete');
  }
  if (G.site.indexOf('taobao') > -1 || G.site.indexOf('tmall') > -1 || G.site == '1688') {
    $(`#${G.extBrand}-hui`).hide();
    return;
  }
  style = userData.get('permanent').style;
  let code_info = data['code-server'];
  let cate = code_info && code_info.class_id;
  let keyword = data.now.coreword;
  let siteId = data.now.site_id;
  if (siteId === '0') siteId = detect.getSiteId(G.site);
  let obj = {};
  obj.keyword = keyword;
  obj.site_id = siteId;
  obj.class_id = data.now.class_id;
  obj.brand_id = data.exact_arr.brand_id;
  getPromoInfo(obj, msg => {
    if (!msg.promotion.site_has_promo && !msg.quan.site_has_quan) {
      return;
    }
    renderBtn();
    renderDetail(data.now, msg);
    // if (G.site === 'zol') {
    //   renderZol(obj, msg)
    // }
    gwdAd.init({
      class_id: cate,
      keyword: keyword
    }, renderAd);
  });
};

/***/ }),

/***/ 91547:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ ShaiDanvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ ShaiDan)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDan.vue?vue&type=template&id=1ba131f5&scoped=true
var ShaiDanvue_type_template_id_1ba131f5_scoped_true = __webpack_require__(70176);
;// ./src/standard/module/trend/ShaiDan.vue?vue&type=template&id=1ba131f5&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDan.vue?vue&type=script&lang=js
var ShaiDanvue_type_script_lang_js = __webpack_require__(13454);
;// ./src/standard/module/trend/ShaiDan.vue?vue&type=script&lang=js
 /* harmony default export */ const trend_ShaiDanvue_type_script_lang_js = (ShaiDanvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/trend/ShaiDan.vue?vue&type=style&index=0&id=1ba131f5&prod&scoped=true&lang=less
var ShaiDanvue_type_style_index_0_id_1ba131f5_prod_scoped_true_lang_less = __webpack_require__(3026);
;// ./src/standard/module/trend/ShaiDan.vue?vue&type=style&index=0&id=1ba131f5&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/trend/ShaiDan.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  trend_ShaiDanvue_type_script_lang_js,
  ShaiDanvue_type_template_id_1ba131f5_scoped_true/* render */.XX,
  ShaiDanvue_type_template_id_1ba131f5_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "1ba131f5",
  null
  
)

/* harmony default export */ const ShaiDan = (component.exports);

/***/ }),

/***/ 91604:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
var _default = exports.A = {
  props: ['value', 'allowAnimation'],
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};

/***/ }),

/***/ 91909:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-jd-rank[data-v-51dc1e02] {\n  width: 232px;\n  height: 32px;\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/ranklistBg.svg);\n}\n.gwd-jd-rank .gwd-icon-rank[data-v-51dc1e02] {\n  width: 15px;\n  height: 15px;\n  margin-left: 5px;\n}\n.gwd-jd-rank .gwd-vline[data-v-51dc1e02] {\n  display: block;\n  width: 1px;\n  height: 10px;\n  background: #000000;\n  margin-left: 0px;\n  border: 0;\n}\n.gwd-jd-rank .gwd-rank-list[data-v-51dc1e02] {\n  flex: 1;\n  height: 100%;\n}\n.gwd-jd-rank .gwd-rank-list a[data-v-51dc1e02] {\n  padding-left: 7px;\n  flex: 1;\n}\n.gwd-jd-rank .gwd-rank-list a span[data-v-51dc1e02] {\n  display: inline-block;\n  transform-origin: left center;\n  color: #111111;\n  white-space: nowrap;\n  overflow: hidden;\n  vertical-align: middle;\n  text-overflow: ellipsis;\n}\n.gwd-jd-rank .gwd-rank-list a span.gwd-mw[data-v-51dc1e02] {\n  max-width: 130px;\n}\n.gwd-jd-rank .gwd-rank-list a:hover span[data-v-51dc1e02] {\n  color: #e03024;\n  font-weight: bold;\n}\n.gwd-jd-rank .gwd-rank-list .gwd-rank-first span[data-v-51dc1e02] {\n  color: #e03024;\n}\n.gwd-jd-rank .gwd-rank-list .gwd-rank-addition[data-v-51dc1e02] {\n  display: none;\n  position: absolute;\n  right: 0;\n  width: 153px;\n  top: 100%;\n  border: 1px solid #ffeded;\n  overflow: hidden;\n  background: white;\n  z-index: 9;\n}\n.gwd-jd-rank .gwd-rank-list .gwd-rank-addition a[data-v-51dc1e02] {\n  height: 25px;\n  line-height: 25px;\n  display: inline-block;\n  width: 100%;\n  vertical-align: middle;\n  border-bottom: 1px solid #f1f1f1;\n}\n.gwd-jd-rank .gwd-rank-list .gwd-rank-addition a[data-v-51dc1e02]:last-of-type {\n  border-bottom: none;\n}\n.gwd-jd-rank .gwd-rank-list:hover .gwd-rank-addition[data-v-51dc1e02] {\n  display: block;\n}\n.gwd-jd-rank .gwd-rank-list[data-v-51dc1e02]::after {\n  content: '';\n  position: absolute;\n  width: 16px;\n  height: 16px;\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/arrow-right-default.svg);\n  right: 3px;\n  top: 5px;\n  pointer-events: none;\n}\n.gwd-jd-rank .gwd-rank-list.gwd-rotate[data-v-51dc1e02]::after {\n  transform: rotate(90deg);\n}\n.gwd-jd-rank .gwd-rank-list.gwd-rotate[data-v-51dc1e02]:hover::after {\n  transform: rotate(270deg);\n}\n.gwd-jd-rank .gwd-rank-list[data-v-51dc1e02]:hover::after {\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/arrow-right-hilighted.svg);\n}\n.gwd-w217[data-v-51dc1e02] {\n  width: 217px;\n  height: 26px;\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/w217.svg);\n}\n.gwd-w210[data-v-51dc1e02],\n.gwd-w235[data-v-51dc1e02] {\n  width: 210px;\n  height: 30px;\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/w210.svg);\n}\n.gwd-w210 .gwd-rank-list .gwd-rank-addition[data-v-51dc1e02],\n.gwd-w235 .gwd-rank-list .gwd-rank-addition[data-v-51dc1e02] {\n  width: 140px;\n}\n.gwd-w210 .gwd-rank-list[data-v-51dc1e02]::after,\n.gwd-w235 .gwd-rank-list[data-v-51dc1e02]::after {\n  top: 7px;\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/arrow-right-default-gray.svg);\n}\n.gwd-w210 .gwd-rank-list a span[data-v-51dc1e02],\n.gwd-w235 .gwd-rank-list a span[data-v-51dc1e02] {\n  color: #555555;\n}\n.gwd-w210 .gwd-rank-list a span span.gwd-mw[data-v-51dc1e02],\n.gwd-w235 .gwd-rank-list a span span.gwd-mw[data-v-51dc1e02] {\n  max-width: 80px;\n}\n.gwd-w210 .gwd-font11[data-v-51dc1e02],\n.gwd-w235 .gwd-font11[data-v-51dc1e02] {\n  transform: scale(1);\n}\n.gwd-w235[data-v-51dc1e02] {\n  width: 235px;\n  height: 23px;\n  background: url(https://cdn.gwdang.com/images/extensions/jdRanking/w235.svg);\n}\n.gwd-w235 .gwd-rank-list a[data-v-51dc1e02] {\n  padding-left: 12px;\n}\n.gwd-w235 .gwd-rank-list a span span.gwd-mw[data-v-51dc1e02] {\n  max-width: 95px;\n}\n.gwd-w235 .gwd-rank-list .gwd-rank-addition[data-v-51dc1e02] {\n  width: 165px;\n}\n.gwd-w235 .gwd-rank-list[data-v-51dc1e02]::after {\n  right: 6px;\n  top: 3px;\n}\n", ""]);

// exports


/***/ }),

/***/ 92411:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("a", {
    staticClass: "bjgou-subsidy-bar bjgou-component",
    attrs: {
      href: _vm.link,
      target: "_blank",
      title: "点击领取"
    }
  }, [_c("span", {
    staticClass: "bjg-coupon-white",
    staticStyle: {
      "font-size": "18px",
      "font-weight": "bold",
      "margin-left": "75px",
      "margin-top": "6px"
    }
  }, [_vm._v(_vm._s(_vm.getText("当前商品可领会员券")))]), _vm._v(" "), _c("div", {
    staticStyle: {
      flex: "1"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "bjg-coupon-white",
    staticStyle: {
      "font-size": "18px",
      "font-weight": "bold",
      "margin-right": "22px"
    }
  }, [_vm._v(_vm._s(_vm.getText("立即领取")))]), _vm._v(" "), _vm.qr ? _c("div", {
    staticClass: "qrcode"
  }, [_c("img", {
    staticStyle: {
      "margin-top": "7px",
      width: "120px",
      height: "120px"
    },
    attrs: {
      src: _vm.qr,
      alt: ""
    }
  }), _vm._v(" "), _c("div", {
    staticStyle: {
      "margin-top": "4px",
      "text-align": "center"
    }
  }, [_c("span", {
    staticStyle: {
      "font-weight": "bold",
      color: "#ff6132",
      "font-size": "14px"
    }
  }, [_vm._v(_vm._s(_vm.getText("手淘扫码")))]), _vm._v(" "), _c("span", {
    staticStyle: {
      "margin-left": "4px",
      color: "#333333",
      "font-size": "12px"
    }
  }, [_vm._v(_vm._s(_vm.getText("联系客服领取")))])])]) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 92704:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
var __WEBPACK_AMD_DEFINE_RESULT__;

/**
 * b2c 比价模块
 * 包括普通的样式和模糊搜索的样式
 * @author:mllong(mllong0925@gmail.com)
 * @since:2013-07-24
 * @version:1.0.0
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  var $ = __webpack_require__(10333);
  var exports = {};
  var template = __webpack_require__(26133);
  var viewB2cStore = __webpack_require__(72328);
  var specialFilter = __webpack_require__(22480);
  var calWidth = __webpack_require__(42869);
  let rateSite = {
    '228': 'USD',
    '229': 'JPY',
    '238': 'USD',
    '246': 'EUR'
  };
  let priceSite = {
    '228': '$',
    '238': '$',
    '229': '日元',
    '246': 'EUR'
  };
  let fixedPrice = price => {
    if (!price) return price;
    try {
      let priarr = price.split('.');
      price = priarr[0].replace(',', '');
      if (Number(price) > 99999) {
        price = priarr[0];
      } else {
        price = priarr[0] + '.' + priarr[1];
      }
    } catch (e) {
      __webpack_require__(35743)('b2cCompare:fixedPrice:error');
      return price;
    }
    return price;
  };
  let transRate = dp => {
    if (dp.price_rmb) return dp;
    let parseprice = __webpack_require__(86421);
    if (!dp.dp_id) return dp;
    let site_id = dp.dp_id.split('-')[1];
    let type = site_id && rateSite[site_id];
    if (!type) return dp;
    let price2 = parseprice(dp.price, type);
    let price3 = fixedPrice(dp.price);
    if (site_id == '229') {
      dp.price_rmb = price2 + `(${price3}${priceSite[site_id]})`;
    } else {
      dp.price_rmb = price2 + `(${priceSite[site_id]}${price3})`;
    }
    dp.price = price2;
    return dp;
  };
  function showExactView(data) {
    let widthObj = calWidth.init();
    data.b2c.product = specialFilter(data.b2c.product);
    if (data.b2c.product.length === 0) return;
    data.b2c.product[0] = transRate(data.b2c.product[0]);
    data.b2c.min_price = data.b2c.product[0].price.replace(',', '');
    //var dp_ids = '0-0';//统计当前有售的商家编号们
    //顶栏商城比价模块
    let b2cdom = `<a href="javascript:" id="${G.extName}-b2c-dp" class="${G.extName}-tab" >
                  <span class="b2c-icon"></span>
                  <span class="b2c-store-n">商城</span>
                  <span class="lowest ${G.extBrand}-price">&yen;${data.b2c.min_price}</span>
                </a>`;
    $(`#${G.extName}-main-contents`).append(b2cdom);
    function editData() {
      var len = data.b2c.store.length;
      for (var i = 0; i < data.b2c.store.length; i++) {
        data.b2c.store[i].price = data.b2c.store[i].price.replace(',', '');
        if (data.b2c.store[i].promo.length > 3) {
          data.b2c.store[i].promo2 = data.b2c.store[i].promo.slice(0, 3);
        }
      }
      data.b2c.store2 = data.b2c.store.slice(0, 6);
      return len;
    }
    for (var i = 0; i < data.b2c.product.length; i++) {
      var dp = data.b2c.product[i];
      dp = transRate(dp);
      //添加商品的促销活动信息
      dp.promo = editPromoIcon(dp.promo);
      if (dp.promo && dp.promo.length > 0) {
        dp.promodom = '';
        for (var p = 0, plen = dp.promo.length; p < 3 && p < plen; p++) {
          var pinfo = dp.promo[p];
          if (pinfo.hasSame) continue;
          dp.promodom += `<span  title="${pinfo.hasSameTitle ? pinfo.hasSameTitle : pinfo.desc}" class="promo_icon promo_icon_${pinfo.type}"></span>`;
        }
      }
    }
    //商城比价模块详情模块
    var len = editData();
    $(`#${G.extName}-main`).append(viewB2cStore({
      data: data,
      len: len,
      extName: G.extName,
      width: widthObj.b2cTurnpW,
      productW: widthObj.b2cProductW
    }));
    $(`#${G.extName}-b2c-dp-detail li img.store`).on('error', function () {
      if (!G.new_extension) $(this).attr('src', G.c_server + '/favicon.ico');
    });
    $('#b2c-prev-page').click(function () {
      G.change_page('b2c', -1);
    });
    $('#b2c-next-page').click(function () {
      G.change_page('b2c', 1);
    });
  }
  function showFuzzyView(data) {
    let widthObj = calWidth.init();
    data.b2c_fuzzy.product = specialFilter(data.b2c_fuzzy.product);
    if (data.b2c_fuzzy.product.length === 0) return;
    data.b2c_fuzzy.product[0] = transRate(data.b2c_fuzzy.product[0]);
    data.b2c_fuzzy.min_price = data.b2c_fuzzy.product[0].price;
    let fuzzdom = `<a href="javascript:" id="${G.extName}-b2c_fuzzy-dp" class="${G.extName}-tab">
                    <span class="b2c-icon gwd_bg"></span>
                    <span class="b2c-store-n">商城相似款</span>
                    <span class="lowest ${G.extBrand}-price">&yen;${data.b2c_fuzzy.min_price}</span>
                  </a>`;
    $(`#${G.extName}-main-contents`).append(fuzzdom);
    for (var i = 0; i < data.b2c_fuzzy.product.length; i++) {
      var dp = data.b2c_fuzzy.product[i];
      dp = transRate(dp);
      //添加商品的促销活动信息
      dp.promo = editPromoIcon(dp.promo);
      if (dp.promo && dp.promo.length > 0) {
        dp.promodom = '';
        for (var p = 0, plen = dp.promo.length; p < 3 && p < plen; p++) {
          var pinfo = dp.promo[p];
          if (pinfo.hasSame) continue;
          dp.promodom += `<span title="${pinfo.hasSameTitle ? pinfo.hasSameTitle : pinfo.desc}" class="promo_icon promo_icon_${pinfo.type}"></span>`;
        }
      }
    }
    let fuzzyDetail = __webpack_require__(20028);
    $(`#${G.extName}-main`).append(fuzzyDetail({
      data: data.b2c_fuzzy.product,
      s_server: G.s_server,
      width: widthObj.turnpW,
      productW: widthObj.allProductW
    }));
    $('#b2c_fuzzy-prev-page').on('click', function (e) {
      e.preventDefault();
      G.change_page('b2c_fuzzy', -1);
    });
    $('#b2c_fuzzy-next-page').on('click', function (e) {
      e.preventDefault();
      G.change_page('b2c_fuzzy', 1);
    });
    $(`#${G.extName}-b2c_fuzzy-dp-detail`).append('<div class="panel-shadow"></div>');
  }
  function showBottomExactView(data) {
    let b2c = data.b2c;
    if (data.b2c2) b2c = data.b2c2;
    var perPageMaxNumber = G.getFixedShowProductNum();
    if (b2c.store.length > 0) {
      //G.where_buy_dps = data.where_buy_dp_ids || '';\
      $(`#${G.extBrand}-compare`).html("");
      try {
        for (var i = 0; i < b2c.store.length; i++) {
          var store = b2c.store[i];
          var dp = store.product[0];
          dp = transRate(dp);
          var len = parseInt(store.product.length);
          var pages = len % perPageMaxNumber == 0 ? parseInt(len / perPageMaxNumber) : parseInt(len / perPageMaxNumber) + 1;
          var li = $('<li>');
          li.append($('<span>', {
            'class': `${G.extBrand}-compare-item`,
            'href': dp.url,
            'target': `_blank`
          }).append($('<p>', {
            'class': `${G.extBrand}-price`
          }).html(`&yen;` + dp.price)).append($('<p>', {
            'class': `${G.extBrand}-store`
          }).text(dp.site_name)));
          var detail = $('<div>', {
            'class': `${G.extBrand}-compare-item-detail re-${G.extBrand}-compare-item-detail ${G.extBrand}-compare-item-detail-fixed`,
            'style': 'display:none;'
          });
          detail.append($('<p>', {
            'class': `${G.extBrand}-compare-item-detail-title ${G.extBrand}-height-auto ${G.extBrand}-compare-item-detail-title-fixed`
          }).append($('<span>', {
            'class': `${G.extBrand}-compare-item-detail-title-desc`
          }).text(dp.site_name + '：' + store.fee)));
          var itemList = $('<ul>', {
            'class': `${G.extBrand}-item-list`
          });
          for (var k = 0; k < len; k++) {
            var item = store.product[k];
            item = transRate(item);
            if (item.site_name.indexOf('微信端') > -1 || item.site_name.indexOf('移动端') > -1) item.isOtherClient = true;
            var rev_cnt = item.rev_cnt ? item.rev_cnt : 0;
            //添加商品的促销活动信息
            var promoHtml = '';
            item.promo = editPromoIcon(item.promo);
            if (item.promo && item.promo.length > 0) {
              for (var p = 0, plen = item.promo.length; p < perPageMaxNumber && p < plen; p++) {
                if (item.promo[p].hasSame) continue;
                let desc = item.promo[p].hasSameTitle ? item.promo[p].hasSameTitle : item.promo[p].desc;
                promoHtml += `<span class="${G.extBrand}-bg promo_icon promo_icon_${item.promo[p].type}" title="${desc}">&nbsp</span>`;
              }
            }
            itemList.append($('<li>', {
              'class': `${G.extBrand}-list-item ` + (k % perPageMaxNumber == perPageMaxNumber - 1 || k == len - 1 ? `${G.extBrand}-last` : ``),
              'style': "display: " + (k >= perPageMaxNumber ? "none" : "block")
            }).append($('<a>', {
              'class': `${G.extBrand}-pic`,
              'href': item.url,
              'target': `_blank`
            }).append($('<img>', {
              'src': G.s_server + `/images/dp_default.jpg`,
              'data-original': item.img_url,
              'title': item.title
            }))).append($('<a>', {
              'class': `${G.extBrand}-product-title`,
              'href': item.url,
              'target': "_blank",
              'title': item.title
            }).append($('<div>').text(item.title))).append($("<div>").append($('<a>', {
              'class': `${G.extBrand}-price`,
              'href': item.url,
              'target': `_blank`
            }).html('&yen;' + (item.price_rmb ? item.price_rmb : item.price)).append(promoHtml))).append($('<div>', {
              'class': `${G.extBrand}_rev_cnt`
            }).append($('<a>', {
              'class': `${G.extBrand}_product_comment_amount`,
              'href': item.url,
              'target': '_blank',
              'title': item.isOtherClient ? item.site_name : '商品评论数'
            }).append($('<span>').text(item.isOtherClient ? item.site_name : rev_cnt != 0 ? `评论数:` + item.rev_cnt : '')))));
          }
          var b2c_PageView = $('<div>', {
            'class': `${G.extBrand}-b2c-PageView ${G.extBrand}-b2c-PageView-fixed`
          });
          b2c_PageView.append($('<p>', {
            'class': `${G.extBrand}-compare-item-detail-title`,
            'style': 'height:auto;'
          }).append($('<span>', {
            'style': 'float:none;padding-left:10px;',
            'class': `${G.extBrand}-compare-item-detail-pages`
          }).append($('<em>', {
            'id': 'page-now-' + i,
            'class': 'page-now'
          }).text('1')).append('/').append($('<em>', {
            'id': 'page-total-' + i,
            'class': 'page-total'
          }).text('1'))));
          detail.append($("<div>", {
            'class': `${G.extBrand}-compare-prev-page ${G.extBrand}-left`
          }).append($('<div>', {
            'class': `${G.extBrand}-bg page-arrow`
          }))).append(itemList).append($("<div>", {
            'class': `${G.extBrand}-compare-next-page ${G.extBrand}-right`
          }).append($('<div>', {
            'class': `${G.extBrand}-bg page-arrow`
          }))).append(b2c_PageView);
          li.append(detail);
          if (pages == 1) {
            li.find(`.${G.extBrand}-compare-prev-page`).hide();
            li.find(`.${G.extBrand}-compare-next-page`).hide();
            li.find(`.${G.extBrand}-b2c-PageView-fixed`).hide();
            li.attr("pages", 1);
            li.attr("len", len);
            var bannerWidth = len * 200;
            //border
            li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css("width", bannerWidth + 2);
          } else {
            //还要考虑到边框的border，必须减去两个像素
            li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css("width", G.width - 2);
          }
          $(`#${G.extBrand}-compare`).append(li);
          $(`#page-total-${i}`).text(pages);
        }
      } catch (e) {
        if (G.debug) {
          throw e;
        }
      }
    }
    $(`#${G.extBrand}-compare`).show();
  }
  function editPromoIcon(promo) {
    /*把相同的促销活动放一起， 避免显示多个相同图标， 但是不能直接改原来的内容， 会影响其他地方的价格计算*/
    if (!promo || promo && !promo.length) return promo;
    for (let i = 0, len = promo.length; i < len; i++) {
      if (!promo[i]) continue;
      for (let j = 1; j < len; j++) {
        if (!promo[i + j]) continue;
        if (promo[i].type == promo[i + j].type) {
          if (promo[i].hasSame) continue;
          promo[i].hasSameTitle = (promo[i].hasSameTitle ? promo[i].hasSameTitle : promo[i].desc) + ' ' + promo[i + j].desc;
          promo[i + j].hasSame = true;
        }
      }
    }
    return promo;
  }
  //把模糊匹配的b2c转化成正规的b2c商城内容
  function exchangeDataFormat(b2cFuzzy) {
    var b2c = {};
    var fuzzy = b2cFuzzy.product;
    fuzzy = specialFilter(fuzzy);
    for (var fuzzyIndex in fuzzy) {
      if (fuzzy[fuzzyIndex].more == '1') {
        var product = fuzzy[fuzzyIndex].all;
        for (var productIndex in product) {
          var site_name = product[productIndex].site_name;
          if (b2c[site_name] == null) {
            b2c[site_name] = [];
          }
          b2c[site_name].push(product[productIndex]);
        }
      } else {
        var site_name = fuzzy[fuzzyIndex].site_name;
        if (b2c[site_name] == null) {
          b2c[site_name] = [];
        }
        b2c[site_name].push(fuzzy[fuzzyIndex]);
      }
    }
    var returnB2c = {
      'store': []
    };
    for (var b2cIndex in b2c) {
      if (typeof b2c[b2cIndex][0].fee != 'undefined') {
        var store = {
          'product': b2c[b2cIndex],
          'fee': b2c[b2cIndex][0].fee
        };
        returnB2c.store.push(store);
      }
    }
    return returnB2c;
  }

  //初始化，根据数据的类型确定展示什么样式
  exports.init = function (data, type) {
    if (G.site.indexOf('taobao') > -1 || G.site.indexOf('tmall') > -1) {
      return;
    }
    if (type == "bottom") {
      if (data.b2c && data.b2c.min_price) {
        showBottomExactView(data);
        G.setPageArgs(`${G.extBrand}-compare`, G.getFixedShowProductNum());
        this.setBottomViewOffset();
      } else if (data.b2c_fuzzy) {
        var obj = {};
        obj.b2c2 = exchangeDataFormat(data.b2c_fuzzy);
        showBottomExactView(obj);
        G.setPageArgs(`${G.extBrand}-compare`, G.getFixedShowProductNum());
        this.setBottomViewOffset();
        $(`.${G.extBrand}-bi`).addClass(`${G.extBrand}-bi-bg`);
      }
      //小红点提示
      G.circleNotice(data.quan, data.promotion);
    } else {
      if (data.b2c && data.b2c.min_price) {
        showExactView(data);
      } else if (data.b2c_fuzzy) {
        showFuzzyView(data);
      }
    }
  };
  //设定底部版的详情页的偏移位置
  exports.setBottomViewOffset = function () {
    $(`ul.${G.extBrand}-item-list`).each(function () {
      var menu_li = $(this).parent().parent().eq(0);
      if (menu_li.attr("pages") == '1') {
        //尽量根据菜单的位置居中，实在不能居中的，就靠右
        var menu_li_left = menu_li.offset().left;
        var menu_li_width = menu_li.width();
        var bannerWidth = parseInt(menu_li.attr("len")) * 200;
        var target_left = menu_li_left - (bannerWidth / 2 - menu_li_width / 2);
        if (target_left < 0) {
          target_left = 0;
        }
        var remainWidth = G.width - target_left;
        if (bannerWidth < remainWidth) {
          menu_li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css('left', target_left);
          menu_li.find(`.${G.extBrand}-compare-item-detail-title-fixed`).css('left', target_left);
        } else {
          menu_li.children(`div.${G.extBrand}-compare-item-detail-fixed`).css('left', G.width - bannerWidth);
          menu_li.find(`.${G.extBrand}-compare-item-detail-title-fixed`).css('left', G.width - bannerWidth);
        }
      }
    });
  };
  return exports;
}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 92771:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getStore = void 0;
__webpack_require__(3362);
var _vuex = _interopRequireDefault(__webpack_require__(95353));
var _userData = _interopRequireDefault(__webpack_require__(74222));
var _log = _interopRequireDefault(__webpack_require__(35743));
var _cnzz = _interopRequireDefault(__webpack_require__(5300));
var _request = _interopRequireDefault(__webpack_require__(49388));
const userCenter = __webpack_require__(76904);
const extConsole = __webpack_require__(7129);
let inited = false;
let instanceId = null,
  store = null;
const getStore = () => {
  (__webpack_require__(7129).log)('getStore with instanceId', instanceId, 'G.instanceId', G.instanceId, 'G', G);
  if (G.instanceId !== instanceId) {
    instanceId = G.instanceId;
    store = makeStore();
    window.gwdStore = store;
    return store;
  } else {
    window.gwdStore = store;
    return store;
  }
};
exports.getStore = getStore;
const makeStore = () => new _vuex.default.Store({
  modules: {
    user: {
      namespaced: true,
      state: {
        login: false,
        wxQr: ''
      },
      mutations: {
        setLogin(state, login = true) {
          state.login = login;
        },
        setWxQr(state, qr) {
          state.wxQr = qr;
        }
      }
    },
    priceRemind: {
      namespaced: true,
      state: {
        instanceId: G.instanceId,
        mode: 0,
        notifySite: 0,
        // 0 全网商家 1 当前商家
        notifierMPromo: 1,
        // 多件推送 0 不开启 1 开启
        allPrice: 0,
        currentPrice: 0,
        hovered: false,
        collected: false,
        settedNotifySite: null,
        nowPrice: 0,
        showMPromo: false
      },
      mutations: {
        setState(state, payload) {
          Object.keys(payload).forEach(key => {
            state[key] = payload[key];
          });
        },
        updateRemindSettings(state, payload) {
          // if (G.productChecked && G.productChecked.collected) {
          //   debugger
          // }
          Object.keys(payload).forEach(key => {
            state[key] = payload[key];
          });
        }
      },
      actions: {
        async cancel(ctx) {
          return userCenter.delete().then(res => {
            ctx.commit('updateRemindSettings', {
              collected: false,
              settedNotifySite: null
            });
            return new Promise(resolve => resolve());
          });
        },
        async reset(ctx) {},
        async init(ctx) {
          // if (inited) {
          //   return
          // }
          inited = true;
          if (G.userLogin) {
            ctx.commit('user/setLogin', true, {
              root: true
            });
          }
          if (G.userLogin && G.productChecked && G.productChecked.collected) {
            ctx.commit('setState', {
              collected: true
            });
          }
          await (__webpack_require__(41761).met)('dp_query_set');
          let dp_query = _userData.default.get('dp_query');
          let currentPrice = await (__webpack_require__(41761).met)('NowPrice');
          // let single = await Promise.race([
          //   require('common/globalCondition').met('SinglePrice'),
          //   require('common/commonUtil').sleep(1000)
          // ])
          // if (single) {
          //   currentPrice = single
          // }
          if (G.aliSite && G.dp.price) currentPrice = G.dp.price;
          let allPrice = parseFloat(dp_query.b2c.min_price) || currentPrice;
          if (!allPrice || isNaN(allPrice)) allPrice = currentPrice;
          currentPrice = parseFloat(currentPrice.toString().replace(',', ''));
          allPrice = parseFloat(allPrice.toString().replace(',', ''));
          if (dp_query.b2c.product && dp_query.b2c.product.length !== 0) {
            (0, _log.default)('allsite-lowpri-show');
            _cnzz.default.log('allsite-lowpri-show');
          }
          if (!(G.productChecked && G.productChecked.collected)) {
            ctx.commit('updateRemindSettings', {
              allPrice: allPrice,
              currentPrice: currentPrice,
              notifySite: 1,
              nowPrice: currentPrice
            });
            (__webpack_require__(41761).met)('SinglePrice').then(single => {
              ctx.commit('updateRemindSettings', {
                currentPrice: single
              });
            });
          }
          (__webpack_require__(41761).setMet)('PriceRemindSetted');
        },
        async hover(ctx) {
          if (!ctx.state.hovered) {
            if (G.userLogin) {
              let url = `https://www.gwdang.com/collect/get_qrcode/`;
              if (G.qrApi && G.qrApi !== 'default') {
                url = G.qrApi;
              }
              _request.default.rawGet(url, true).then(data => {
                ctx.commit('user/setWxQr', data.img_url, {
                  root: true
                });
              });
              let cat_id = G.dp.cat_id;
              if (cat_id && cat_id.includes('-')) {
                let cats = cat_id.split('-');
                if (cats.length > 3) {
                  cats.pop();
                }
                cat_id = cats.join(',');
              }
              _request.default.get(`${G.server}/extension/ProductFilter?scene=collection&dp_ids=${G.dp.dpId}&one=1&cid=${cat_id}`).then(r => {
                if (r.data && !r.data.is_black_class) {
                  G.showMPromo = true;
                  ctx.commit('setState', {
                    showMPromo: true
                  });
                }
              });
            }
            if (G.userLogin && ctx.state.collected) {
              await (__webpack_require__(41761).met)('GwdDpIdGot');
              userCenter.detail(G.dp.dpId).then(r => {
                extConsole.log('detail', r);
                let payload = {
                  mode: r.data.notifier.mode,
                  notifySite: r.data.notifier.site,
                  settedNotifySite: r.data.notifier.site,
                  notifierMPromo: r.data.notifier.mpromo
                };
                if (payload.notifySite === 1) {
                  payload.currentPrice = r.data.notifier.threshold;
                } else {
                  payload.allPrice = r.data.notifier.threshold;
                }
                // payload.currentPrice = r.data.notifier.threshold
                ctx.commit('updateRemindSettings', payload);
              });
            }
            ctx.commit('setState', {
              hovered: true
            });
          }
        },
        async submit(ctx, payload) {
          return userCenter.add(payload.price, payload.notifySite, payload.mode, payload.notifyMPromo, ctx.state.showMPromo ? 0 : 1).then(r => {
            if (r.error_code && r.error_code === 1000) {
              ctx.commit('user/setLogin', false, {
                root: true
              });
            }
            if (r.code === 100 || r.code <= 0) {
              return new Promise((resolve, reject) => {
                reject(r.msg);
              });
            }
            if (r.code === 1) {
              let mode = payload.mode;
              let site = payload.notifySite;
              if (r.data) {
                mode = r.data.notifier.mode;
                site = r.data.notifier.site;
              }
              let payloadRes = {
                mode: mode,
                notifySite: site,
                settedNotifySite: site,
                collected: true,
                notifierMPromo: payload.notifyMPromo ? 1 : 0
              };
              if (r.data) {
                if (payloadRes.notifySite === 1) {
                  payloadRes.currentPrice = r.data.notifier.threshold;
                } else {
                  payloadRes.allPrice = r.data.notifier.threshold;
                }
              } else {
                if (payloadRes.notifySite === 1) {
                  payloadRes.currentPrice = payload.price;
                } else {
                  payloadRes.allPrice = payload.price;
                }
              }
              ctx.commit('updateRemindSettings', payloadRes);
              return new Promise(resolve => {
                resolve('提交成功');
              });
            }
          });
        }
      }
    },
    priceTrend: {
      namespaced: true,
      state: {
        money: '',
        priceRange: '',
        nowPrice: ''
      },
      mutations: {
        setState(state, payload) {
          Object.keys(payload).forEach(key => {
            state[key] = payload[key];
          });
        }
      }
    }
  }
});

/***/ }),

/***/ 93327:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);


var _interopRequireDefault = __webpack_require__(24994);
Object.defineProperty(exports, "B", ({
  value: true
}));
exports.A = void 0;
__webpack_require__(26910);
__webpack_require__(3362);
var _Price = _interopRequireDefault(__webpack_require__(83007));
var _ProductItem = _interopRequireDefault(__webpack_require__(80636));
var _Error = _interopRequireDefault(__webpack_require__(90084));
const extConsole = __webpack_require__(7129);
const util = __webpack_require__(30888);
const bgClient = __webpack_require__(40076);
const transText = __webpack_require__(54600);
const siteMap = {
  tb: transText('淘宝'),
  jd: transText('京东'),
  pdd: '拼多多',
  1688: '1688',
  amazon: '亚马逊'
};
const sortMap = {
  default: transText('相似度'),
  price: transText('价格从低到高'),
  sales: transText('销量从高到低')
};
const SiteStatus = {
  pending: 'pending',
  finish: 'finish',
  loading: '加载中...',
  empty: transText('暂无同款'),
  error: transText('加载失败'),
  needLogin: 'needLogin',
  needVisit: 'needVisit'
};
const apis = {
  tb: (__webpack_require__(55494)/* ["default"] */ .A),
  jd: __webpack_require__(98153),
  1688: __webpack_require__(81174),
  amazon: __webpack_require__(65275)
};
const makeDefaultStatus = () => ({
  status: SiteStatus.pending,
  list: [],
  statusDetail: ''
});
if (window.gwd_G && window.gwd_G.apiReplace) {
  Object.keys(window.gwd_G.apiReplace).forEach(key => {
    apis[key] = window.gwd_G.apiReplace[key];
  });
}
let showedAlert = false;
var _default = exports.A = {
  components: {
    Price: _Price.default,
    ProductItem: _ProductItem.default,
    Error: _Error.default
  },
  props: ['img', 'price'],
  data: () => ({
    logo: G.lang === 'zh-tr' ? __webpack_require__(26521) : __webpack_require__(40075),
    isBjg: G.from_device === 'bijiago',
    is1688: location.hostname.includes('.1688.com'),
    firefox: navigator.userAgent.indexOf('Firefox') > -1,
    siteMap,
    SiteStatus: SiteStatus,
    show: true,
    xhs: location.hostname.includes('xiaohongshu.com'),
    style: G.from_device === 'bijiago' ? 'bottom' : G.style,
    expanded: false,
    hasPermission: true,
    sites: G.site === '360buy' ? ['jd', 'tb'] : ['tb', 'jd'],
    currentViewing: location.hostname.includes('.1688.com') ? '1688' : G.site === '360buy' ? 'jd' : 'tb',
    permissionTextOnly: false,
    currentSort: 'default',
    sortOptions: ['default', 'price', 'sales'],
    products: {
      tb: makeDefaultStatus(),
      jd: makeDefaultStatus(),
      pdd: makeDefaultStatus(),
      1688: makeDefaultStatus(),
      amazon: makeDefaultStatus()
    }
  }),
  methods: {
    overlayClick(e) {
      if (e.target === this.$refs.overlay) {
        this.close();
      }
    },
    transText(text) {
      return transText(text);
    },
    getSiteName(site) {
      return siteMap[site];
    },
    getSortName(sort) {
      if ((this.currentViewing === 'jd' || this.currentViewing === 'amazon') && sort === 'sales') {
        return transText('评论数从高到低');
      }
      return sortMap[sort];
    },
    close() {
      this.show = false;
      document.body.style.overflow = 'auto';
    },
    open() {
      this.show = true;
      document.body.style.overflow = 'hidden';
    },
    reset() {
      this.products.tb.status = SiteStatus.pending;
      this.products.jd.status = SiteStatus.pending;
      this.products.tb.list = [];
      this.products.jd.list = [];
      this.products.tb.statusDetail = '';
      this.products.jd.statusDetail = '';
    },
    async doSearch(site, canRetry = true) {
      if (this.products[site].status === SiteStatus.loading) {
        return;
      }
      if (!this.img) {
        return;
      }
      if (G.from_device === 'bijiago') {
        const permissionResult = await bgClient.get('/checkPermission');
        extConsole.log('permissionResult', permissionResult);
        if (permissionResult !== 'ok') {
          this.products[site].status = SiteStatus.error;
          this.products[site].statusDetail = '没有权限';
          if (!showedAlert) {
            showedAlert = true;
            this.permissionTextOnly = true;
          }
          this.hasPermission = false;
          bgClient.get('/requestTb').then(permissionResult => {
            this.permissionTextOnly = false;
            if (permissionResult) {
              this.hasPermission = true;
            }
          });
          return;
        }
      }
      this.products[site].status = SiteStatus.loading;
      apis[site].get(this.img).then(res => {
        extConsole.log(res);
        if (res instanceof Array) {
          this.products[site].list = res;
          this.products[site].status = res.length ? SiteStatus.finish : SiteStatus.empty;
        } else if (res === 'needLogin') {
          this.products[site].status = SiteStatus.needLogin;
        } else if (res === 'needVisit') {
          this.products[site].status = SiteStatus.needVisit;
        } else {
          if (canRetry && res.includes('fail-')) {
            setTimeout(() => {
              this.products[site].status = SiteStatus.pending;
              this.doSearch(site, false);
            }, 200);
            return;
          }
          this.products[site].status = SiteStatus.error;
          this.products[site].statusDetail = res;
          console.error('imgSearch', res);
        }
      }).catch(err => {
        extConsole.error('imgSearch', err);
        this.products[site].status = SiteStatus.error;
      });
    }
  },
  computed: {
    unit() {
      return G.site === 'amazon' ? '$' : '¥';
    },
    currentSiteResult() {
      if (!this.products[this.currentViewing]) {
        console.error('imgSearch not found', this.currentViewing);
        console.log(this.products[this.currentViewing]);
        return makeDefaultStatus();
      }
      return this.products[this.currentViewing];
    },
    sortedList() {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = 0;
      });
      return JSON.parse(JSON.stringify(this.currentSiteResult.list)).sort((a, b) => {
        if (this.currentSort === 'default') {
          return 0;
        } else if (this.currentSort === 'price') {
          return parseFloat(a.price) - parseFloat(b.price);
        } else if (this.currentSort === 'sales') {
          return util.stringToNumber(b.salesAmount) - util.stringToNumber(a.salesAmount);
        }
      });
    }
  },
  watch: {
    currentViewing(newVal) {
      extConsole.log('site load start', newVal);
      this.currentSort = 'default';
      if (this.currentSiteResult.status === SiteStatus.pending) {
        this.doSearch(newVal);
      }
    }
  },
  mounted() {
    this.currentViewing = this.is1688 ? '1688' : G.site === '360buy' ? 'jd' : 'tb';
    if (this.is1688) {
      this.sites.unshift('1688');
    }
    if (G.site === 'amazon') {
      this.sites = this.sites.filter(site => site === 'tb');
      this.sites.unshift('1688');
      this.sites.unshift('amazon');
      this.currentViewing = 'amazon';
    }
    this.doSearch(this.currentViewing);
  }
};

/***/ }),

/***/ 93503:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-amazon-link[data-v-cd1584e4] {\n  display: inline-block;\n  outline: none;\n  font-size: 14px;\n  margin-left: 12px;\n  margin-right: 12px;\n  font-family: PingFang SC-Medium, PingFang SC, Microsoft YaHei, serif;\n  font-weight: 500;\n  color: #FFFFFF;\n  line-height: 30px;\n  padding-left: 12px;\n  padding-right: 12px;\n  height: 30px;\n  background: #FE9E0F;\n  border-radius: 34px;\n  opacity: 1;\n  border: 1px solid;\n  white-space: nowrap;\n}\n.gwd-amazon-link[data-v-cd1584e4]:hover {\n  background: #FF8F00;\n  text-decoration: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 94320:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-head-item[data-v-549382c4] {\n  line-height: 14px;\n  height: 14px;\n  width: 100%;\n}\n.gwd-head-item span[data-v-549382c4] {\n  float: left;\n}\n.gwd-head-item[data-v-549382c4]:after {\n  display: block;\n  content: \"\";\n  clear: both;\n}\n.gwd-re-strong[data-v-549382c4] {\n  font-weight: bold;\n}\n", ""]);

// exports


/***/ }),

/***/ 94634:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-jd-self[data-v-fa024638] {\n  display: inline-block;\n  width: 30px;\n  height: 16px;\n  line-height: 16px;\n  text-align: center;\n  border-radius: 2px;\n  background: #ff4449;\n  color: #fff;\n  font-size: 12px;\n  margin-right: 4px;\n}\n.gwd-img-same-item[data-v-fa024638] {\n  transition: all 0.3s;\n  width: 220px;\n  padding: 10px;\n  box-sizing: border-box;\n  background: #ffffff;\n  border-radius: 8px;\n  margin-left: 20px;\n  margin-bottom: 20px;\n}\n.gwd-img-same-item img[data-v-fa024638] {\n  width: 200px;\n  height: 200px;\n  border-radius: 8px;\n}\n.gwd-img-same-item .gwd-sales[data-v-fa024638] {\n  color: #999;\n  font-size: 12px;\n}\n.gwd-img-same-item .gwd-title[data-v-fa024638] {\n  font-size: 14px;\n  color: #3c4c54;\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  word-break: break-all;\n  height: 40px;\n  line-height: 20px;\n}\n.gwd-img-same-item .gwd-shop-name[data-v-fa024638] {\n  color: #999;\n  font-size: 12px;\n  white-space: nowrap;\n}\n.gwd-img-same-item .gwd-shop-name span[data-v-fa024638] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.gwd-img-same-item .gwd-item-promos[data-v-fa024638] {\n  margin-top: 10px;\n  margin-bottom: 12px;\n  height: 16px;\n  overflow: hidden;\n}\n.gwd-img-same-item .gwd-item-promos span[data-v-fa024638] {\n  color: #ff4449;\n  font-size: 12px;\n  display: inline-block;\n  margin-right: 4px;\n  border: 1px solid #ff4449;\n  padding-left: 4px;\n  padding-right: 4px;\n  height: 16px;\n  box-sizing: border-box;\n  line-height: 14px;\n}\n.gwd-img-same-item .gwd-favicon[data-v-fa024638] {\n  width: 13px;\n  height: 13px;\n  border-radius: 100%;\n  margin-right: 4px;\n}\n.gwd-img-same-item[data-v-fa024638]:hover {\n  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);\n}\n.gwd-bjg.gwd-img-same-item[data-v-fa024638] {\n  margin-left: 17px;\n  margin-bottom: 17px;\n  border: 1px solid #e6e9eb;\n}\n", ""]);

// exports


/***/ }),

/***/ 94842:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\na[data-v-6fda7d74] {\n  text-decoration: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 95131:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".bjg .minibar-btn-box span[data-v-5aa6bd38] {\n  color: #6b6761;\n  font-size: 14px;\n}\n.bjg#gwd_mini_compare[data-v-5aa6bd38]:hover {\n  background: #fffbef;\n}\n", ""]);

// exports


/***/ }),

/***/ 95187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $imports = __webpack_require__(53095);
module.exports = function ($data) {
    'use strict';
    $data = $data || {};
    var $$out = '', $escape = $imports.$escape, text = $data.text, qr = $data.qr;
    $$out += '<div target="_blank" class="gwd-middle-act-bar">\n  <img ';
    $$out += 'src="https://cdn.bijiago.com/images/extensions/activity/tmall-redpack-middle.png"';
    $$out += ' style="width: 17px; height: 19px; margin-left: 11px">\n  <span style="font-size: 12px; color: #ff471a; margin-left: 7px; font-weight: bold">';
    $$out += $escape(text);
    $$out += '</span>\n  <div style="flex: 1"></div>\n  <img ';
    $$out += 'src="https://cdn.bijiago.com/images/extensions/activity/arrow.svg"';
    $$out += ' style="width: 26px; height: 10px;">\n  <span class="gwd-take" style="line-height: initial">\n    立即领取\n    <div class="gwd-qr-act-mid" style="margin-left: -84px;">\n      <img class="gwd-act-qr-img" loading="lazy" src="';
    $$out += $escape(qr);
    $$out += '" alt="" style="width: 130px; height: 130px; margin-top: 7px">\n      <span style="margin-top: 5px; vertical-align: middle; font-size: 0; height: 14px; line-height: 14px;">\n        <span style="font-size: 14px; color: #ff471a; font-weight: bold">微信扫码</span>\n        <span style="margin-left: 3px; color: #070707; font-size: 12px; transform-origin: center center; transform: scale(0.9166)">领红包</span>\n      </span>\n    </div>\n  </span>\n</div>\n<style>\n  .gwd-middle-act-bar {\n    width: 462px;\n    height: 34px;\n    box-sizing: border-box;\n    display: flex;\n    align-items: center;\n    border: 1px solid #e6e9eb;\n    background: white;\n    font-size: 0;\n  }\n\n  .gwd-take {\n    display: inline-block;\n    margin-left: 10px;\n    margin-right: 15px;\n    text-align: center;\n    width:70px;\n    height:18px;\n    background:linear-gradient(90deg,rgba(255,42,26,1) 0%,rgba(255,98,31,1) 100%);\n    border-radius:9px;\n    font-size: 12px;\n    color: white;\n    position: relative;\n    cursor: pointer;\n  }\n\n  .gwd-qr-act-mid {\n    display: none;\n    flex-direction: column;\n    position: absolute;\n    width: 144px;\n    height: 167px;\n    box-sizing: border-box;\n    border: 1px solid #ff471a;\n    background: #fff9f6;\n    top: 25px;\n    z-index: 99;\n    /*left: 50%;*/\n    right: -16px;\n    align-items: center;\n    margin-left: -72px;\n  }\n\n  .gwd-qr-act-mid span {\n    width: initial;\n    margin: 0;\n  }\n\n  .gwd-take:hover .gwd-qr-act-mid {\n    display: flex;\n  }\n</style>';
    return $$out;
};

/***/ }),

/***/ 96367:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("table", {
    staticClass: "barTrendInfoBox gwd-mini-table",
    class: {
      showcoudan: _vm.showcoudan
    },
    staticStyle: {
      "margin-left": "30px",
      "margin-top": "12px",
      height: "48px",
      "box-sizing": "border-box",
      width: "unset"
    }
  }, [_c("tr", {
    staticClass: "orign-pri-info"
  }, [_vm.d1.nowprice ? _c("td", [_c("span", {
    staticClass: "opi-sp1 nowpri",
    staticStyle: {
      "margin-left": "10px"
    }
  }, [_vm._v("现价:")]), _vm._v(" "), _c("span", {
    staticClass: "opi-sp2 nowpri"
  }, [_vm._v(_vm._s(_vm.d1.display_nowprice))])]) : [_c("td", {
    staticStyle: {
      "vertical-align": "middle"
    }
  }, [_c("span", {
    staticClass: "opi-sp1"
  }, [_vm._v("最高:")]), _vm._v(" "), _c("span", {
    staticClass: "opi-sp2"
  }, [_vm._v(_vm._s(_vm.d1.display_Phighest))])]), _vm._v(" "), _c("td", {
    staticStyle: {
      "min-width": "400px",
      "vertical-align": "middle"
    }
  }, [_c("span", {
    staticClass: "opi-sp3",
    staticStyle: {
      "margin-left": "10px"
    },
    domProps: {
      innerHTML: _vm._s(_vm.lowtle)
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "opi-sp4"
  }, [_vm._v(_vm._s(_vm.d1.display_Plowest))]), _vm._v(" "), _c("span", {
    staticClass: "opi-sp5"
  }, [_vm._v(_vm._s(_vm.d1.lowestDate))]), _vm._v(" "), !_vm.d2 && !_vm.aliSite && _vm.promoUrl ? _c("a", {
    staticClass: "promo-history-link",
    attrs: {
      href: _vm.promoUrl,
      target: "_blank"
    }
  }, [_vm._v("历史促销明细＞")]) : _vm._e()])]], 2), _vm._v(" "), _vm.d2 ? _c("tr", {
    staticClass: "promo-pri-info",
    staticStyle: {
      height: "auto"
    }
  }, [!_vm.d1.nowprice ? _c("td", {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c("span", {
    staticClass: "ppi-sp1"
  })]) : _vm._e(), _vm._v(" "), _c("td", {
    staticStyle: {
      "min-width": "400px",
      "vertical-align": "middle"
    }
  }, [_c("span", {
    staticClass: "ppi-sp2",
    staticStyle: {
      "margin-left": "10px"
    }
  }, [_vm._v("最低(多   件):")]), _vm._v(" "), _c("span", {
    staticClass: "ppi-sp3"
  }, [_vm._v(_vm._s(_vm.d2.display_Plowest))]), _vm._v(" "), _c("span", {
    staticClass: "ppi-sp4"
  }, [_vm._v(_vm._s(_vm.d2.lowestDate))]), _vm._v(" "), _vm.promoUrl ? _c("a", {
    staticClass: "promo-history-link",
    attrs: {
      href: _vm.promoUrl,
      target: "_blank"
    }
  }, [_vm._v("历史促销明细＞")]) : _vm._e()])]) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [];
render._withStripped = true;

/***/ }),

/***/ 97254:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _default = exports.A = {
  props: ['data', 'domclass', 'aliSite']
};

/***/ }),

/***/ 97353:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var $ = __webpack_require__(10333);
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];


__webpack_require__(26910);
__webpack_require__(3362);
const userData = __webpack_require__(74222);
const request = __webpack_require__(49388);
const calWidth = __webpack_require__(42869);
// const replaceHref = require('common/replaceHref')
const golbal2 = __webpack_require__(7053);
const htmlObj = {
  'taobao': __webpack_require__(81376),
  'tmall': __webpack_require__(82059)
};
var tmData = {};
const renderBtnTop = data => {
  let html = __webpack_require__(18112);
  data.ss = 0;
  if (data.tmall.length !== 0 && data.tmall.product) {
    $('#tm_compare').append(html({
      store_tle: '天猫',
      min_price: data.tmall.min_price
    })).css("display", "block");
    tmData['tmall'] = data.tmall;
    data.ss++;
    data.tmm = true;
    renderTopDetail('tmall');
  }
  if (data.taobao.length !== 0 && data.taobao.product) {
    $('#tb_compare').append(html({
      store_tle: '淘宝',
      min_price: data.taobao.min_price
    })).css("display", "block");
    tmData['taobao'] = data.taobao;
    data.ss++;
    data.tbb = true;
    renderTopDetail('taobao');
  }
  (__webpack_require__(7053).autoFixWidth)();
  userData.set('tbData', data);
  if (G.site === 'suning') {
    $('#tb_compare, #tm_compare').on('click', 'a', function (e) {
      if ($(this).find('.coupon_span')) return;
      let url = $(this).attr('href');
      if (url && url.indexOf('http') > -1) {
        window.open($(this).attr('href'));
        e.preventDefault();
      }
    });
  }
};
const render = data => {
  let permanent = userData.get('permanent');
  if (permanent.style === 'top') {
    renderTop(data);
  } else {
    (__webpack_require__(35161).renderBt)(data);
  }
};
const renderTopDetail = id => {
  let data = tmData[id];
  // if (!G.aliSite && G.from_device !== '360')
  //   replaceHref.init(id, data.product, '&column=b2c')
  let len = data.product.length;
  let str = 'tb';
  if (id === 'tmall') str = 'tm';
  let widthObj = calWidth.init();
  var sale_tle = "最近销量";
  if (data.from_self === true) sale_tle = "总销量";
  let html = htmlObj[id];
  let pages = Math.ceil(len / widthObj.showListNum);
  const el = document.createElement('div');
  $(`#${str}_compare`).append(el);
  const TmCompare = (__webpack_require__(83754)/* ["default"] */ .A);
  new Vue({
    el: el,
    render: h => h(TmCompare, {
      props: {
        data: data.product,
        s_server: G.s_server,
        width: widthObj.turnpW,
        link: data.more_link,
        pages: pages,
        imgLoad: G.imgLoad,
        sale_tle: sale_tle,
        allProductW: widthObj.allProductW
      }
    }),
    mounted() {
      // this.$nextTick(() => {
      //   golbal2.loadImg(0, widthObj.showListNum, $(`#${str}_compare li .small-img img`))
      // })
    }
  });
  // $(`#${str}_compare`).append((html)({
  //   data: data.product,
  //   s_server: G.s_server,
  //   width: widthObj.turnpW,
  //   link: data.more_link,
  //   pages: pages,
  //   imgLoad: G.imgLoad,
  //   sale_tle: sale_tle,
  //   allProductW: widthObj.allProductW
  // }))
  if (G.from_device !== '360') (__webpack_require__(49042).init)(data.product, id, false, data.min_price);
  // $(`#gwdang-${id}-dp-detail`).show()
};
const renderTop = data => {
  renderBtnTop(data);
};
const getTmInfo = async callback => {
  await (__webpack_require__(41761).met)('productInfoReady');
  let code_server = '1';
  let other_info = userData.get('other_info');
  let msg = other_info.exact_arr;
  let code = other_info['code-server'];
  let coreword = encodeURIComponent(other_info.now.coreword);
  if (!code) {
    code = {};
    code_server = '0';
  }
  let price = G.dp.price * 100;
  var url = `${G.server}/brwext/tbres?union=${G.union}&url=${encodeURIComponent(msg.url)}&site=${msg.site}&isbn=${msg.isbn}&keywords=${encodeURIComponent(msg.keywords)}&brand=${encodeURIComponent(msg.brand)}&type=${encodeURIComponent(msg.type)}&price=${price}&class_id=${msg.class_id}&name=${encodeURIComponent(G.dp.name)}&code_brand_id=${code.brand_id}&code_clean_title=${encodeURIComponent(code.clean_title)}&code_code=${code.code}&code_display_brand=${encodeURIComponent(code.display_brand)}&code_brand=${encodeURIComponent(code.brand)}&code_class_id=${encodeURIComponent(code.class_id)}&code_price=${encodeURIComponent(code.price)}&code_spec=${encodeURIComponent(code.spec)}&code-server=${code_server}&coreword=${coreword}&catid=${G.dp.cat_id}`;
  request.get(url).then(data => {
    if (data) {
      if (G.site == 'taobao' || G.site == 'tmall') {
        getUniqPid(data, mm => {
          callback(mm);
        });
      } else {
        getImgSearch(data, mm => {
          callback(mm);
        });
      }
    }
  });
};
const getImgSearch = function (msg, callback) {
  let buildTaobaoUrl = __webpack_require__(77342);
  msg = buildTaobaoUrl.buildCommon(msg);
  if (G.btype == 'luyou') {
    callback(msg);
    return;
  }
  let dataShare = __webpack_require__(34810);
  let brandId = dataShare.get('dp_data') && dataShare.get('dp_data')['exact_arr']['brand_id'];
  if (G.site == '360buy' && brandId && (!msg.taobao.sort || !msg.tmall.sort)) {
    // 在京东有brand 有比价结果的情况下， 不走图片检索
    callback(msg);
    return;
  }
  (__webpack_require__(80339).init)(data => {
    if (data) {
      if (msg.tmall.sort) msg.tmall = {};
      if (data.tmall.length > 0) {
        msg.tmall.min_price = data.tmall[0].price;
        msg.tmall.max_price = data.tmall[data.tmall.length - 1].price;
        msg.tmall.store = data.tmall;
        msg.tmall.product = data.tmall;
      }
      if (msg.taobao.sort) msg.taobao = {};
      if (data.taobao.length > 0) {
        msg.taobao.product = data.taobao;
        msg.taobao.store = data.taobao;
        msg.taobao.min_price = data.taobao[0].price;
        msg.taobao.max_price = data.taobao[data.taobao.length - 1].price;
      }
      if (!msg.tmall.more_link) msg.tmall.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      if (!msg.taobao.more_link) msg.taobao.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      callback(msg);
    } else {
      callback(msg);
    }
  });
};
const getUniqPid = function (msg, callback) {
  let buildTaobaoUrl = __webpack_require__(77342);
  msg = buildTaobaoUrl.buildCommon(msg);
  (__webpack_require__(19778).getTaobaouniqData)(data => {
    if (data) {
      if (msg.tmall.sort) {
        msg.tmall = {};
      }
      if (data.tmall.length > 0) {
        msg.tmall.min_price = data.tmall[0].price;
        msg.tmall.max_price = data.tmall[data.tmall.length - 1].price;
        msg.tmall.store = data.tmall;
        msg.tmall.product = data.tmall;
      }
      if (msg.taobao.sort) {
        msg.taobao = {};
      }
      if (data.taobao.length > 0) {
        msg.taobao.product = data.taobao;
        msg.taobao.store = data.taobao;
        msg.taobao.min_price = data.taobao[0].price;
        msg.taobao.max_price = data.taobao[data.taobao.length - 1].price;
      }
      if (!msg.tmall.more_link) msg.tmall.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      if (!msg.taobao.more_link) msg.taobao.more_link = 'https://s.taobao.com/search?q=' + msg.search.keywords + '&pid=' + msg.search.union;
      callback(msg);
    } else {
      callback(msg);
    }
  });
};
module.exports.init = () => {
  getTmInfo(render);
};
module.exports.renderTopDetail2 = function (id) {
  let widthObj = calWidth.init();
  golbal2.loadImg(0, widthObj.showListNum, $(`#${id}-item-list li .small-img img`));
  $(`#gwdang-${id}-dp-detail`).show();
};

/***/ }),

/***/ 97995:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, "\n.gwdang-trend-detail .orign-pri-info[data-v-803e699c] {\n  margin-top: 12px;\n}\n.gwdang-trend-detail .promo-pri-info[data-v-803e699c] {\n  margin-top: 8px;\n}\n#gwdang-trend-detail .opi-sp1[data-v-803e699c], #gwdang-trend-detail .ppi-sp1[data-v-803e699c], #gwdang-trend-detail .ppi-sp2[data-v-803e699c] {\n  margin-left: 0px;\n}\n#gwdang-trend-detail .ppi-sp1+.ppi-sp2[data-v-803e699c], .opi-sp3[data-v-803e699c] {\n  margin-left: 0px;\n}\n#gwdang-trend-detail .promo-history-link[data-v-803e699c] {\n  margin-left: 20px;\n  float: left!important;\n}\n", ""]);

// exports


/***/ }),

/***/ 98356:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = __webpack_require__(24994);
__webpack_unused_export__ = ({
  value: true
});
exports.A = void 0;
var _Stamp = _interopRequireDefault(__webpack_require__(36408));
var _default = exports.A = {
  props: ['link', 'icon', 'mainColor', 'secondColor', 'text', 'showStampBg', 'rebate'],
  components: {
    Stamp: _Stamp.default
  }
};

/***/ }),

/***/ 98503:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm._m(0);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-column gwd-align bjg-mini-program-qr"
  }, [_c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "23px",
      height: "16px"
    }
  }, [_c("div", {
    staticClass: "bjg-line"
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px",
      color: "#999"
    }
  }, [_vm._v("比价狗省钱助手")]), _vm._v(" "), _c("div", {
    staticClass: "bjg-line"
  })]), _vm._v(" "), _c("img", {
    staticStyle: {
      "margin-top": "12px",
      width: "96px",
      height: "96px"
    },
    attrs: {
      src: "https://cdn.bijiago.com/images/extensions/bijiago/qr-miniprogram.jpg",
      alt: ""
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "12px",
      "line-height": "16px",
      height: "16px"
    }
  }, [_c("img", {
    attrs: {
      src: __webpack_require__(97375),
      alt: ""
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px",
      color: "#333",
      "margin-left": "3px",
      "margin-right": "3px"
    }
  }, [_vm._v("微信扫码使用")]), _vm._v(" "), _c("img", {
    staticStyle: {
      transform: "rotate(180deg)"
    },
    attrs: {
      src: __webpack_require__(97375),
      alt: ""
    }
  })]), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px",
      color: "#333",
      "font-weight": "bold",
      "margin-top": "3px",
      "line-height": "16px"
    }
  }, [_vm._v("买京东商品，都省钱")])]);
}];
render._withStripped = true;

/***/ }),

/***/ 98522:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Yp = exports.XX = void 0;
var render = exports.XX = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-column gwd-collection-comp gwd-align",
    style: `width: ${_vm.haitao ? 340 : 330}px; height: 100%; padding: 10px; box-sizing: border-box`
  }, [_c("div", {
    staticClass: "gwd-price-head",
    staticStyle: {
      "font-weight": "bold",
      "font-size": "14px",
      width: "100%"
    }
  }, [_c("div", {
    staticClass: "gwd-head-item now-pri-div"
  }, [_c("span", {
    staticClass: "gwd-re-strong gwd-blkcolor1"
  }, [_vm._v("当前价格：")]), _vm._v(" "), _c("span", {
    staticClass: "gwd-red-price"
  }, [_vm._v(_vm._s(_vm.trend.money) + _vm._s(_vm.trend.nowPrice))])]), _vm._v(" "), _c("div", {
    staticClass: "gwd-head-item his-pri-div",
    staticStyle: {
      "margin-top": "5px"
    }
  }, [_c("span", {
    staticClass: "gwd-re-strong gwd-blkcolor1"
  }, [_vm._v("历史价格：")]), _vm._v(" "), _c("span", {
    staticClass: "gwd-re-price-num gwd-blkcolor1 gwd-prifontf"
  }, [_vm._v(_vm._s(_vm.trend.money) + _vm._s(_vm.trend.priceRange))])])]), _vm._v(" "), _vm.user.login && _vm.settedNotifySite !== null ? _c("div", {
    staticClass: "gwd-row",
    staticStyle: {
      position: "absolute",
      top: "5px",
      left: "0",
      right: "10px"
    }
  }, [_c("div", {
    staticStyle: {
      flex: "1"
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "gwd-button gwd-btn-del"
  }, [_c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "transform-origin": "center center",
      "z-index": "2",
      position: "relative"
    },
    on: {
      click: function ($event) {
        return _vm.cancel();
      }
    }
  }, [_vm._v("取消提醒")])])]) : _vm._e(), _vm._v(" "), _vm.user.login ? _c("div", {
    staticClass: "gwd-column gwd-collection-detail",
    class: {
      "gwd-ht": _vm.haitao
    },
    staticStyle: {
      flex: "1"
    }
  }, [_c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      "margin-top": "13px"
    }
  }, [_c("div", {
    staticClass: "gwd-column",
    staticStyle: {
      flex: "1",
      position: "relative"
    }
  }, [_c("div", {
    staticClass: "gwd-container gwd-column",
    class: {
      "gwd-ht": _vm.haitao
    },
    staticStyle: {
      "justify-content": "space-between"
    }
  }, [_c("div", {
    staticClass: "gwd-row gwd-align gwd-remind-option"
  }, [_c("span", [_vm._v("当价格低于")]), _vm._v(" "), _c("PriceInput", {
    staticStyle: {
      width: "120px"
    },
    attrs: {
      currency: _vm.currency
    },
    model: {
      value: _vm.currentPrice,
      callback: function ($$v) {
        _vm.currentPrice = $$v;
      },
      expression: "currentPrice"
    }
  }), _vm._v(" "), _c("span", [_vm._v("时提醒我")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "gwd-container gwd-row gwd-align",
    staticStyle: {
      "margin-top": "8px"
    },
    style: {
      visibility: _vm.priceRemind.showMPromo ? "visible" : "hidden"
    }
  }, [_vm._m(0), _vm._v(" "), _c("SwitchBtn", {
    attrs: {
      allowAnimation: _vm.allowAnimation
    },
    model: {
      value: _vm.mPromo,
      callback: function ($$v) {
        _vm.mPromo = $$v;
      },
      expression: "mPromo"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticStyle: {
      "margin-top": "47px",
      width: "100%",
      "text-align": "center"
    }
  }, [_c("button", {
    staticClass: "gwd-btn-submit gwd-button",
    on: {
      click: _vm.submit
    }
  }, [_vm._v("提交")])]), _vm._v(" "), _vm.errorText ? _c("div", {
    staticClass: "gwd-remind-error-text",
    class: {
      "gwd-fadeout-5s": _vm.errorFadeClass
    }
  }, [_vm._v("\n        " + _vm._s(_vm.errorText) + "\n      ")]) : _vm._e(), _vm._v(" "), _vm.hintText ? _c("div", {
    staticClass: "gwd-remind-hint-text",
    class: {
      "gwd-fadeout-5s": _vm.hintFadeClass
    }
  }, [_vm._v("\n        " + _vm._s(_vm.hintText) + "\n      ")]) : _vm._e(), _vm._v(" "), _vm.user.wxQr ? _c("div", {
    staticClass: "gwd-remind-qr",
    staticStyle: {
      clear: "both",
      "text-align": "center",
      top: "10px",
      position: "relative"
    }
  }, [_vm._m(1), _vm._v(" "), _c("div", {
    staticStyle: {
      "text-align": "justify"
    },
    attrs: {
      id: "gwd-remind-qrcode_img"
    }
  }, [_c("img", {
    attrs: {
      src: _vm.user.wxQr,
      alt: "二维码"
    }
  }), _vm._v(" "), _c("p", [_vm._v("购物党提醒")])])]) : _vm._e()]) : _vm._e(), _vm._v(" "), !_vm.user.login ? _c("div", {
    staticClass: "gwd-row gwd-align",
    staticStyle: {
      flex: "1",
      width: "100%"
    }
  }, [_c("CommonLogin", {
    staticStyle: {
      flex: "1"
    },
    attrs: {
      position: "gwd-trend-top",
      "show-alter-login": "true",
      "alter-login-position": "row"
    }
  })], 1) : _vm._e()]);
};
var staticRenderFns = exports.Yp = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "gwd-column",
    staticStyle: {
      flex: "1",
      "align-items": "flex-start"
    }
  }, [_c("span", {
    staticStyle: {
      color: "#404547",
      "font-size": "13px",
      "line-height": "18px"
    }
  }, [_vm._v("多件优惠时提醒我")]), _vm._v(" "), _c("span", {
    staticClass: "gwd-font11",
    staticStyle: {
      "transform-origin": "left center",
      color: "#999999",
      "line-height": "14px"
    }
  }, [_vm._v("同一商品，购买多件才能享受优惠")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", {
    staticClass: "gwd-font12"
  }, [_vm._v("为了更好接收降价提醒，请您及时"), _c("span", {
    staticStyle: {
      color: "#48befe"
    },
    attrs: {
      id: "gwd-remind-qrcode",
      "data-spm-anchor-id": "2013.1.0.i5.44ae3fa7NIPzzq"
    }
  }, [_vm._v("扫码绑定微信")])]);
}];
render._withStripped = true;

/***/ }),

/***/ 98671:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ AmazonSameLinksvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ AmazonSameLinks)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/AmazonSameLinks.vue?vue&type=template&id=cd1584e4&scoped=true
var AmazonSameLinksvue_type_template_id_cd1584e4_scoped_true = __webpack_require__(81518);
;// ./src/standard/module/components/AmazonSameLinks.vue?vue&type=template&id=cd1584e4&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/AmazonSameLinks.vue?vue&type=script&lang=js
var AmazonSameLinksvue_type_script_lang_js = __webpack_require__(7804);
;// ./src/standard/module/components/AmazonSameLinks.vue?vue&type=script&lang=js
 /* harmony default export */ const components_AmazonSameLinksvue_type_script_lang_js = (AmazonSameLinksvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/AmazonSameLinks.vue?vue&type=style&index=0&id=cd1584e4&prod&scoped=true&lang=less
var AmazonSameLinksvue_type_style_index_0_id_cd1584e4_prod_scoped_true_lang_less = __webpack_require__(666);
;// ./src/standard/module/components/AmazonSameLinks.vue?vue&type=style&index=0&id=cd1584e4&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/AmazonSameLinks.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  components_AmazonSameLinksvue_type_script_lang_js,
  AmazonSameLinksvue_type_template_id_cd1584e4_scoped_true/* render */.XX,
  AmazonSameLinksvue_type_template_id_cd1584e4_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "cd1584e4",
  null
  
)

/* harmony default export */ const AmazonSameLinks = (component.exports);

/***/ }),

/***/ 99174:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(54765)();
// imports


// module
exports.push([module.id, ".gwd-coupon-color-bg {\n  position: absolute;\n  z-index: 0;\n  background-size: contain;\n}\n.gwd-coupon-color-bg.gwd-tl {\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 28px;\n  background-image: url(https://cdn.gwdang.com/images/extensions/coupon-tl-bg@2x.png);\n}\n.gwd-coupon-color-bg.gwd-br {\n  bottom: 0;\n  right: 49px;\n  width: 46px;\n  height: 23px;\n  background-image: url(https://cdn.gwdang.com/images/extensions/coupon-br-bg@2x.png);\n}\n.gwd-butie .gwd-coupon-color-bg.gwd-tl {\n  background-image: url(https://cdn.gwdang.com/images/extensions/bt-tl-bg@2x.png);\n}\n.gwd-butie .gwd-coupon-color-bg.gwd-br {\n  background-image: url(https://cdn.gwdang.com/images/extensions/bt-br-bg@2x.png);\n}\n", ""]);

// exports


/***/ }),

/***/ 99211:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Vue = __webpack_require__(85471)["Ay"];
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(3362);
__webpack_require__(12041);
(function () {
  'use strict';

  //判断是否为重复加载，如果为重复加载，直接结束脚本
  if (__webpack_require__(84309)) return;
  /*IE在淘宝天猫不出插件*/
  const Vuex = __webpack_require__(95353);
  Vue.use(Vuex);
  var IE = __webpack_require__(81583)();
  if (IE && location.host.match(/(?:taobao|tmall|yao\.95095|1688\.com|aliexpress\.com|ieframe\.dll)/)) return;

  // 京东移动端触摸模拟
  if (location.href.indexOf('plogin.m.jd.com') > -1) {
    (__webpack_require__(52158).init)();
  }
  __webpack_require__(19268);
  (__webpack_require__(76118).init)();
  (__webpack_require__(92834).init)();
  (__webpack_require__(68459).init)();
  (__webpack_require__(49388).rawGet)('https://cdn.gwdang.com/js/configs/gwdang.json?v=4').then(async t => {
    if (G.aliSite) {
      await (__webpack_require__(30888).waitForConditionFn)(() => $('#ice-container > div').length);
      const className = $('#ice-container > div').attr('class');
      const prefix = className.split('--')[0];
      G.aliPrefix = prefix;
    }
    const r = JSON.parse(JSON.stringify(t).replaceAll('QJEEHAN8H5', G.aliPrefix));
    (__webpack_require__(41761).setMet)('GwdConfig', r);
    window.gwd_G = G;
    window.gwd_G.GwdConfig = r;
  });
  var cnzz = __webpack_require__(5300);
  if (cnzz) cnzz.init(G.gwd_cnzz);
  if (location.host === 'm.fine3q.com') (__webpack_require__(94226).init)();
  if (G.pageInfo.type === 0) return;
  //hao123和百度域名全部不加载任何内容
  (__webpack_require__(32043).init)();
  if (__webpack_require__(27207)()) return;
  __webpack_require__(9844);
  __webpack_require__(39591);
  G.logoName = __webpack_require__(27252)(8);
  //检查当前网页是否在插件收录范围内
  if (navigator.userAgent.indexOf('Maxthon') > -1) {
    // if (location.host.indexOf('tmall') > -1 || location.host.indexOf('95095') > -1) {
    //   G.maxthon_tmall = true
    // }
  }
  __webpack_require__(26234);
  __webpack_require__(53357)();
  (__webpack_require__(32752).common)(data => {
    let dictsArr = ['booking', 'elong', 'wbiao', 'agoda', 'hotels', '228', 'roseonly', 'feelunique', "nike", 'kaola', 'vipshop', 'hujiang', '1688', 'opposhop', 'vsigo', 'keede', 'zazhipu', 'banggo', 'discount-apotheke', 'bl', '1hai', 'pharmacydirect', 'flyco', 'takeya', 'xgdq', 'guojimami', 'shoprobam', 'staples', 'boqii', 'mei', 'tuhu', 'hangowa', 'lookfantastic-cn', 'lookfantastic-com', 'iherb', 'shopbop', 'yoox', 'skinstore', 'ctrip', 'koolearn', 'chinaacc', 'youpin-mi', 'opposhop', 'oneplus'];
    let blockCityList = ['北京', '上海', '广州', '深圳', '杭州', '南京'];
    // let blockCityList = ['北京', '上海', '广州', '深圳', '杭州'];
    let blockCity = false;
    blockCityList.forEach(city => {
      if (data && data.result && !(data.result instanceof Array) && data.result.address.indexOf(city) > -1) {
        blockCity = true;
      }
    });
    if (data && data.result && !(data.result instanceof Array) && !blockCity) {
      if (dictsArr.indexOf) {
        if (dictsArr.indexOf(G.site) > -1) {
          G.set_force = true;
        }
      }
      G.forbidAd = true;
    } else if (data && data.result.address.indexOf('南京') == -1) {
      G.forbidAd = true;
    }
    if (data && data.result.address.indexOf('北京') > -1) {
      G.forbidMinibar = true;
      G.forbidGiftMoney = true;
    }
    if (data && data.result && data.result instanceof Array) {
      G.forbidCoupon = true;
    }
    if (data && data.result && !(data.result instanceof Array) && (data.result.address.indexOf('北京') > -1 || data.result.address.indexOf('杭州') > -1)) {
      G.forbidCoupon = true;
    }
    G.isMonkey = true;
    (__webpack_require__(86421).getRate)(() => {
      (__webpack_require__(12826).get)(() => {
        (__webpack_require__(41672).init)();
      });
    });
  });
})();

/***/ }),

/***/ 99230:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  __esModule: () => (/* reexport */ Switchvue_type_script_lang_js/* __esModule */.B),
  "default": () => (/* binding */ Switch)
});

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Controls/Switch.vue?vue&type=template&id=ea7ea5c4&scoped=true
var Switchvue_type_template_id_ea7ea5c4_scoped_true = __webpack_require__(68463);
;// ./src/standard/module/components/Controls/Switch.vue?vue&type=template&id=ea7ea5c4&scoped=true

// EXTERNAL MODULE: ./node_modules/babel-loader/lib/index.js??clonedRuleSet-3.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Controls/Switch.vue?vue&type=script&lang=js
var Switchvue_type_script_lang_js = __webpack_require__(91604);
;// ./src/standard/module/components/Controls/Switch.vue?vue&type=script&lang=js
 /* harmony default export */ const Controls_Switchvue_type_script_lang_js = (Switchvue_type_script_lang_js/* default */.A); 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/less-loader/dist/cjs.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/standard/module/components/Controls/Switch.vue?vue&type=style&index=0&id=ea7ea5c4&prod&scoped=true&lang=less
var Switchvue_type_style_index_0_id_ea7ea5c4_prod_scoped_true_lang_less = __webpack_require__(51373);
;// ./src/standard/module/components/Controls/Switch.vue?vue&type=style&index=0&id=ea7ea5c4&prod&scoped=true&lang=less

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(14486);
;// ./src/standard/module/components/Controls/Switch.vue



;


/* normalize component */

var component = (0,componentNormalizer/* default */.A)(
  Controls_Switchvue_type_script_lang_js,
  Switchvue_type_template_id_ea7ea5c4_scoped_true/* render */.XX,
  Switchvue_type_template_id_ea7ea5c4_scoped_true/* staticRenderFns */.Yp,
  false,
  null,
  "ea7ea5c4",
  null
  
)

/* harmony default export */ const Switch = (component.exports);

/***/ }),

/***/ 99495:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var G = __webpack_require__(53558);
/* provided dependency */ var $ = __webpack_require__(10333);


__webpack_require__(26910);
const request = __webpack_require__(49388);
const parseprice = __webpack_require__(86421);
const template = __webpack_require__(26133);
const userData = __webpack_require__(74222);
const log = __webpack_require__(35743);
const golbal2 = __webpack_require__(7053);
const go_union = __webpack_require__(71363);
let runed;
let amazonName = {
  '1': '中国',
  '228': '美国',
  '229': '日本',
  '246': '德国',
  '266': '英国',
  '365': '法国',
  '366': '加拿大'
};
let amazonCurrency = {
  '228': 'USD',
  '229': 'JPY',
  '246': 'EUR',
  '266': 'GBP',
  '365': 'EUR',
  '366': 'CAD'
};
let amazonMoney = {
  '1': '¥',
  '228': '$',
  '229': '円',
  '246': 'EUR',
  '266': '£',
  '365': 'EUR',
  '366': 'CDN$'
};
let amazonTab = `#${G.extName}-amazon-dp`;
let amazonDetail = `#${G.extName}-amazon-dp-detail`;
const reqInfo = (dp_id, callback) => {
  let url = `${G.server}/extension?ac=amazonGlobal&dp_id=${dp_id}`;
  request.get(url).done(data => {
    if (data && data.length > 0) {
      callback(data);
    }
  });
};
const editData = data => {
  for (let i = 0, len = data.length; i < len; i++) {
    let site_id = data[i].dp_id.split('-')[1];
    if (data[i].nowpage === '1') data[i].siteName = amazonName[site_id] + '亚马逊(当前商城)';else data[i].siteName = amazonName[site_id] + '亚马逊';
    let price = (Number(data[i].pri) / 100).toFixed(2);
    let purePrice = '';
    if (site_id !== "1") {
      let price2 = '';
      if (site_id === '229') price2 = price + amazonMoney[site_id];else price2 = amazonMoney[site_id] + price;
      purePrice = parseprice(price, amazonCurrency[site_id]);
      price = '¥' + purePrice + `(${price2})`;
    } else {
      purePrice = price;
      price = '¥' + price;
    }
    data[i].title = data[i].tle;
    data[i].img_url = data[i].img;
    data[i].site_name = '中国亚马逊';
    data[i].fee = '不同卖家运费不同';
    var obj = {
      'site_id': site_id,
      'url': data[i].url,
      'mod': 'amazon_global',
      'union': G.union.split('_')[1],
      'dp_id': data[i].dp_id
    };
    data[i].url = go_union.init(obj);
    data[i].price = price;
    data[i].purePrice = purePrice;
  }
  data.sort(function (value1, value2) {
    return Number(value1.purePrice) - Number(value2.purePrice);
  });
  return data;
};
const render = data => {
  data = editData(data);
  let permanent = userData.get('permanent');
  if (permanent.style === 'top') {
    renderBtnTop(data[0].pri);
    renderTopDetail(data);
  }
  renderInner(data);
  addEvent();
};
const renderBtnTop = pri => {
  let price = Number(pri) / 100;
  let html = __webpack_require__(18112);
  $('#amazon_compare').append(template.compile(html)({
    store_tle: "亚马逊海外购：",
    min_price: price
  })).show();
};
const addEvent = () => {
  let Time1;
  $(amazonTab).on('mouseenter', () => {
    $(amazonDetail).addClass(`_mshover`);
    $(amazonTab).addClass('_mshover');
    log('track:amazon_global:mshover');
  });
  $(amazonTab).on('mouseleave', () => {
    Time1 = setTimeout(() => {
      $(amazonDetail).removeClass(`_mshover`);
      $(amazonTab).removeClass(`_mshover`);
    }, 200);
  });
  $(amazonDetail).on('mouseenter', () => {
    clearTimeout(Time1);
    $(amazonDetail).addClass('_mshover');
    $(amazonTab).addClass('_mshover');
  });
  $(amazonDetail).on('mouseleave', () => {
    $(amazonDetail).removeClass('_mshover');
    $(amazonTab).removeClass('_mshover');
  });
  $('#amazon_dp-item-list li').on('click', () => {
    log('track:amazon_global:click');
  });
};
const renderTopDetail = data => {
  if (runed) {
    $(`#amazon_compare`).find('.top-compare-detail').show();
    return;
  }
  runed = true;
  let html = __webpack_require__(92557);
  let dom = template.compile(html)({
    data: {
      product: data,
      imgLoad: G.imgLoad
    },
    pages: 1
  });
  $(`#amazon_compare`).append(dom);
  golbal2.loadImg(0, data.length, $(`#amazon-item-list li .small-img img`));
  log('track:amazon_global:track');
};
let times = 0;
const renderInner = data => {
  let product = data[0];
  if (!product) return;
  let html = __webpack_require__(21052);
  let dom = $('#gwd_ht_main .ht_head');
  if (dom.length === 0 && times < 15) {
    times++;
    setTimeout(function () {
      renderInner(data);
    }, 800);
    return;
  }
  let view = template.compile(html)({
    data: product
  });
  dom.append(view);
  $('#amazon_global_box').append(view).show();
  log('track:amazon_global_inner:track');
  $('#amazon_global').on('click', () => {
    log('track:amazon_global_inner:click');
  });
  renderInnerDetail(data);
};
const renderInnerDetail = data => {
  let html = __webpack_require__(39851);
  let dom = template.compile(html)({
    data: data[0]
  });
  // $('#gwd_ht_main .ht_content').append(dom);
  $('#amazon_global_box').append(dom);
  $('#amazon_global').on('mouseenter', () => {
    let dom = $('#globalInnerDetail');
    if (!dom.is(':visible')) {
      $('.content_default').hide();
      dom.show();
    }
  });
  $('#gwd_minibar').addClass('hasglobal');
  $('#globalInnerDetail .content_default_left a').on('click', function () {
    log('track:amazon_global_inner_detail:click');
  });
};
module.exports.renderTopDetail = renderTopDetail;
module.exports.init = dp_id => {
  if (location.host.indexOf('amazon') === -1) return;
  // 暂时屏蔽中国亚马逊 以为只展示中国亚马逊的商品
  if (location.host.indexOf('.cn') > -1) return;
  reqInfo(dp_id, render);
};

/***/ }),

/***/ 99937:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(65952);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(70534)/* ["default"] */ .A)
var update = add("4a472027", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "https://cdn.gwdang.com/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["gwdangJsonp"] = self["gwdangJsonp"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [121], () => (__webpack_require__(99211)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;