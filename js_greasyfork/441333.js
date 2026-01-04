if (
    host.indexOf("item.taobao") > -1 ||
    host.indexOf("detail.tmall") > -1
) {
    detailTopInit();
}
// 头部推荐初始化
function detailTopInit() {
    let html =
        "<div class='detail-top'>" +
        "<div class='tab-top'>" +
        "<ul>" +
        "<li class='get active'>相似比价</li>" +
        "<li>折上折</li>" +
        "<li>爆品推荐</li>" +
        "<li>历史新低</li>" +
        "<li>9.9包邮</li>" +
        "</ul>" +
        "</div>" +
        "<div class='tab-body'>" +
        "<ul class='zhe'>" +
        "<div class='swiper-container'>" +
        "<div class='swiper-wrapper'>" +
        "</div>" +
        "<div class='swiper-button-prev' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "<div class='swiper-button-next' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "</div>" +
        "</ul>" +
        "<ul class='zhe'>" +
        "<div class='swiper-container'>" +
        "<div class='swiper-wrapper'>" +
        "</div>" +
        "<div class='swiper-button-prev' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "<div class='swiper-button-next' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "</div>" +
        "</ul>" +
        "<ul class='rec'>" +
        "<div class='swiper-container'>" +
        "<div class='swiper-wrapper'>" +
        "</div>" +
        "<div class='swiper-button-prev' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "<div class='swiper-button-next' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "</div>" +
        "</ul>" +
        "<ul class='his'>" +
        "<div class='swiper-container'>" +
        "<div class='swiper-wrapper'>" +
        "</div>" +
        "<div class='swiper-button-prev' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "<div class='swiper-button-next' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "</div>" +
        "</ul>" +
        "<ul class='nine'>" +
        "<div class='swiper-container'>" +
        "<div class='swiper-wrapper'>" +
        "</div>" +
        "<div class='swiper-button-prev' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "<div class='swiper-button-next' style='width:45px;height:100px;color: #f40;margin-top:-50px;background:rgba(0,0,0,0.4)''></div>" +
        "</div>" +
        "</ul>" +
        "</div>" +
        "</div>";
    $("#detail").prepend(html);
    let params = {
        appkey: config.zhetaoke.appkey,
        item_id: id,
        page_size: 20,
    };
    let url =
        "https://api.zhetaoke.com:10001/api/open_item_guess_like.ashx";
    dtd(url, params, addDetailTop, 0);
    topTabClick();
}
// 选项卡点击
function topTabClick() {
    $(".detail-top li").click(function () {
        let index = $(this).index();
        $(".detail-top li").removeClass("active");
        $(this).addClass("active");
        $(".detail-top .tab-body ul").hide();
        $(".detail-top .tab-body ul").eq(index).show();
        if (!$(this).hasClass("get")) {
            if (index === 0) {
                let params = {
                    appkey: config.zhetaoke.appkey,
                    item_id: id,
                    page_size: 20,
                };
                let url =
                    "https://api.zhetaoke.com:10001/api/open_item_guess_like.ashx";
                dtd(url, params, addDetailTop, index);
            } else if (index === 1) {
                let params = {
                    appKey: "5cfe247e623ce",
                    version: "v1.0.0",
                    pageSize: "20",
                    pageId: "1",
                };
                params.sign = makeSign(params);
                let url =
                    "https://openapi.dataoke.com/api/goods/super-discount-goods";
                dtd(url, params, addDetailTop, index);
            } else if (index === 2) {
                let params = {
                    appKey: "5cfe247e623ce",
                    version: "v1.0.0",
                    pageSize: "20",
                    pageId: "1",
                };
                params.sign = makeSign(params);
                let url =
                    "https://openapi.dataoke.com/api/goods/explosive-goods-list";
                dtd(url, params, addDetailTop, index);
            } else if (index === 3) {
                let params = {
                    appKey: "5cfe247e623ce",
                    version: "v1.0.0",
                    pageSize: "20",
                    pageId: "1",
                };
                params.sign = makeSign(params);
                let url =
                    "https://openapi.dataoke.com/api/goods/get-history-low-price-list";
                dtd(url, params, addDetailTop, index);
            } else if (index === 4) {
                let params = {
                    appKey: "5cfe247e623ce",
                    version: "v2.0.0",
                    pageSize: "20",
                    pageId: "1",
                    nineCid: "2",
                };
                params.sign = makeSign(params);
                let url =
                    "https://openapi.dataoke.com/api/goods/nine/op-goods-list";
                dtd(url, params, addDetailTop, index);
            }
        }
        $(this).addClass("get");
    });
}
// 插入HTML
function addDetailTop(res, val) {
    let list = [];
    if (val === 0) {
        list = JSON.parse(res).content;
    } else {
        list = res.data.list;
    }
    list.forEach((item, index) => {
        let itemLink = "";
        let mainPic = "";
        let actualPrice = "";
        let monthSales = "";
        let title = "";
        let coupon = "";
        if (val === 0) {
            itemLink = item.item_url;
            mainPic = item.pict_url;
            actualPrice = item.quanhou_jiage;
            monthSales = item.volume;
            title = item.tao_title;
            coupon = item.coupon_info;
        } else {
            itemLink = item.itemLink;
            mainPic = item.mainPic;
            actualPrice = item.actualPrice;
            monthSales = item.monthSales;
            title = item.title;
            coupon =
                "满" +
                item.couponConditions +
                "元减" +
                item.couponPrice;
        }
        let html =
            "<div class='swiper-slide'>" +
            "<li>" +
            "<a data-val='" +
            val +
            "' href='" +
            itemLink +
            "'target='_blank' >" +
            "<div class='items'>" +
            "<div class='pic'>" +
            "<img src='" +
            mainPic +
            "' alt=''>" +
            "</div>" +
            "<div class='info'>" +
            "<div class='row'>" +
            "<div class='price'>" +
            "<span>￥</span>" +
            "<strong>" +
            actualPrice +
            "</strong>" +
            "</div>" +
            "<div class='deal-cnt'>" +
            monthSales +
            "人付款</div>" +
            "</div>" +
            "<div class='title'>" +
            title +
            "</div>" +
            "</div>" +
            "<div class='top-coupon'>" +
            "<p>" +
            coupon +
            "</p>" +
            "</div>" +
            "</div>" +
            "</a>" +
            "</li>" +
            "</div>";
        $(".detail-top .tab-body ul")
            .eq(val)
            .find(".swiper-wrapper")
            .append(html);
        var mySwiper = new Swiper(".swiper-container", {
            slidesPerView: 5,
            slidesPerGroup: 5,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    });
    $(".detail-top .tab-body li a").click(function () {
        let type = Number($(this).attr("data-val")) + 1;
        $.get("https://api.ergirl.com/tRecType?type=" + type);
    });
}
