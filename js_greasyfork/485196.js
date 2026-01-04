// ==UserScript==
// @name          Amazon采集
// @namespace     https://blog.csdn.net/mukes
// @version       0.0.1
// @description  亚马逊采集
// @author       Fux
// @match        *.amazon.com*dp/*
// @match        *.test.mytool.maykis.cn/*
// @match        *.gather.mytool.maykis.cn/*
// @match        *.walmart.com/ip/*
// @grant        GM_xmlhttpRequest
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/485196/Amazon%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/485196/Amazon%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==
(function() {

//插件登录页面
    function loginInterface(){
    let loginContainer = document.createElement('div');
    loginContainer.id = "sp-ac-container";
    loginContainer.style.position="fixed"
    loginContainer.style.left="70%"
    loginContainer.style.top="20px"
    loginContainer.style['z-index']="999999"
    //loginContainer.style.border="2px solid black"
    //loginContainer.style["border-radius"]="10px"

    loginContainer.innerHTML =`
    <style>
body {
font-family: Arial, sans-serif;
background-color: #f2f2f2;
padding: 20px;
}
.container {
max-width: 400px;
margin: 0 auto;
background-color: #fff;
padding: 20px;
border: 2px solid black;
border-radius: 10px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
h2 {
text-align: center;
}
input[type="text"],
input[type="password"] {
width: 100%;
padding: 10px;
margin-bottom: 10px;
border-radius: 4px;
border: 1px solid #ccc;
}
input[type="submitTest"] {
width: 100%;
padding: 10px;
background-color: #4caf50;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
}
</style>

<div class="container">
<h2>登录插件</h2>
<form>
<input type="text" id="username" placeholder="账号" required>
<input type="password" style="margin-left:0px" id="password" placeholder="密码" required>
<input type="submitTest" style="margin-left:0px;text-align: center;" value="登录" id="loginButtom">
</form>
</div>
    `
    document.body.appendChild(loginContainer);//生成插件悬浮窗

    var loginButton = document.getElementById("loginButtom")
    loginButton.addEventListener("click", loginBottonClick) //监听按钮点击事件

    function loginBottonClick(){
            username = document.getElementById("username").value;
            password = document.getElementById("password").value;
            var loginUrl="https://test.mytool.maykis.cn/ums/oauth/token?username="+username+"&grant_type=password&scope=all&manageCompanyId=2000000001&password="+password+"&auth_type=user"
            var loginData="username="+username+"&grant_type=password&scope=all&manageCompanyId=2000000001&password="+password+"&auth_type=user"
            requestsHtml(loginUrl,loginData);//发起登录请求获取Authorization

    }
    }

//插件功能页面
    function operatingInterface(){
        let operatingContainer = document.createElement('div');
        operatingContainer.id = "operating-container";
        operatingContainer.style.position="fixed"
        operatingContainer.style.left="70%"
        operatingContainer.style.top="20px"
        operatingContainer.style['z-index']="999999"

        operatingContainer.innerHTML =`
<style>

.data-collection-container {
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    border-radius: 10px;
    padding: 10px;
    caret-color: rgba(0,0,0,0);
}

input[type="submitTest"] {

border: none; /* 移除默认的边框 */
height: 40px;
border-radius: 20px; /* 设置左右边框为圆形 */

}
</style>

<div class="data-collection-container"">
<input type="submitTest" id="gatherButtom" value="采集商品" style="cursor: pointer;text-align: center;background-color: blue;color: white;"/>
<input type="submitTest" id="quitButtom" value="退出登录" style="cursor: pointer;margin-left:0px;text-align: center;background-color: #FF8888;margin-top:2px"/>
</div>
    `
    document.body.appendChild(operatingContainer);//生成插件悬浮窗

    var gatherButton = document.getElementById("gatherButtom")//获取采集按钮
    gatherButton.addEventListener("click", gatherButtonClick) //监听按钮采集按钮点击事件


    var quitButton = document.getElementById("quitButtom")//获取退出按钮
    quitButton.addEventListener("click", quitBottonClick) //监听退出按钮点击事件
    function quitBottonClick(){
            console.log("退出登录!");
            localStorage.removeItem("username")//删除username
            localStorage.removeItem("password")//删除password
            localStorage.removeItem("Authorization")//删除Authorization
            document.getElementById("operating-container").remove();//去除功能界面
            loginInterface()//打开登录界面
    }

    }

    //loginInterface()//登录界面
    //operatingInterface()//功能界面

    var headers={
       "Host":"test.mytool.maykis.cn",
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
"Accept":"application/json, text/plain, */*",
"Accept-Language":"zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
"Accept-Encoding":"gzip, deflate, br",
"Authorization":"Basic bWJzOm1ic3NlY3JldA==",
"Access-Control-Allow-Origin":"*",
"vc":"oauth",
"auth":"0",
"Origin":"https://test.mytool.maykis.cn",
"DNT":"1",
"Sec-GPC":"1",
"Connection":"keep-alive",
"Referer":"https://test.mytool.maykis.cn/mbs/",
"Sec-Fetch-Dest":"empty",
"Sec-Fetch-Mode":"cors",
"Sec-Fetch-Site":"same-origin",
"Pragma":"no-cache",
"Cache-Control":"no-cache",
"Content-Length": "0"
   }



//登录请求函数
    function requestsHtml(requestUrl,requestsData){
GM_xmlhttpRequest({
  method: "POST",
  url:requestUrl,
  headers:headers ,
  data:requestsData,
  onload: function(response){
      console.log(response.responseText)
      var resData=JSON.parse(response.responseText)
      if (resData.success==false){
          console.log("登录失败");
          alert(resData.errmsg)
      }else{
          alert("登录成功")
          Authorization="bearer "+JSON.parse(response.responseText).access_token
          localStorage.setItem("username", username);//设置账号
          localStorage.setItem("password", password);//设置密码
          localStorage.setItem("Authorization", Authorization)//设置Authorization
          console.log("登录成功!");
          console.log("username:",username);
          console.log("password:",password);
          console.log(Authorization)
          document.getElementById("sp-ac-container").remove();//去除登录界面
          operatingInterface();//开启功能界面
      }
  },
   onerror: function(response){
      alert("登录失败")
      console.log("请求失败");
    //localStorage.setItem("Authorization", false)//设置Authorization
  }
});
    };

//采集按钮触发
function gatherButtonClick(){
    if (hostUrl=="www.amazon.com"){
    extractAmazonData();
    }else if((hostUrl=="www.walmart.com")){
        alert("暂不支持沃尔玛")
    //extractWalmartData()
    }
}


//采集Amazon提取数据
    function extractAmazonData(){
        setTimeout(function(){
        var pagesource=document.documentElement.outerHTML;
        //console.log(pagesource);//获取网页源码

        var title
        try {
          title=document.getElementById("productTitle").innerHTML; //提取标题
      } catch (e) {
          title="";
      }
        console.log("title:",title);

        var categoryName//提取类目
        try {
          categoryName=document.getElementsByClassName("a-link-normal a-color-tertiary")[1].innerHTML; //提取类目
      } catch (e) {
          categoryName="";
      }
        console.log("categoryName:",categoryName);

        var price //提取价格
        try {
          price=document.getElementById("priceValue").value; //提取价格
          //price=document.getElementsByClassName("a-section a-spacing-none aok-align-center aok-relative")[0].getElementsByClassName("aok-offscreen")[0].innerHTML; //提取价格
      } catch (e) {
          price=0;
      }
        console.log("price:",price);


        //console.log(keyFeaturesList);
        var keyFeatures=new Array();//创建keyFeatures数组
        try {
            var keyFeaturesList=document.getElementById("feature-bullets").getElementsByClassName("a-list-item"); //提取描述
        for(let item of keyFeaturesList) {
            //console.log(item.innerHTML);
            keyFeatures.push(item.innerHTML);
        };
        } catch (e) {
          keyFeatures=[];
      }
        console.log("keyFeatures:",keyFeatures);

        var mainImageUrl//提取主图
        try {
          mainImageUrl=document.getElementById("imgTagWrapperId").getElementsByTagName("img")[0].src; //提取主图
      } catch (e) {
          mainImageUrl="";
      }
        console.log("mainImageUrl:",mainImageUrl);

        var brand//提取品牌
        try {
          brand=document.getElementById("bylineInfo").innerHTML.replaceAll("Brand:",""); //提取品牌
      } catch (e) {
          brand="";
      }
        console.log("brand:",brand);

        var packageWeight=""//提取Item Weight
        var productDimensions=""//提取Product Dimensions
        var bsrRanking=0//提取 Best Sellers Rank
        var sellerRegion=""//提取 Country of Origin
        var uploadTime=0//提取 Date First Available
        var productDetails=[]
        try{
            productDetails=document.getElementById("productDetails_detailBullets_sections1").getElementsByTagName("tr"); //提取productDetails
        }catch (e) {
            productDetails=[];
        }
        for(let item of productDetails){
            if(item.getElementsByClassName("a-color-secondary a-size-base prodDetSectionEntry")[0].innerHTML.includes("Item Weight")){
              packageWeight=item.getElementsByTagName("td")[0].innerHTML;}//提取Item Weight
            else if(item.getElementsByClassName("a-color-secondary a-size-base prodDetSectionEntry")[0].innerHTML.includes("Product Dimensions")){
                productDimensions=item.getElementsByTagName("td")[0].innerHTML;//提取Product Dimensions
               }else if(item.getElementsByClassName("a-color-secondary a-size-base prodDetSectionEntry")[0].innerHTML.includes("Item Display Dimensions")){
                productDimensions=item.getElementsByTagName("td")[0].innerHTML;//提取Product Dimensions
               }else if(item.getElementsByClassName("a-color-secondary a-size-base prodDetSectionEntry")[0].innerHTML.includes("Best Sellers Rank")){
                bsrRanking=item.getElementsByTagName("td")[0].innerHTML.split("#")[1].split(" in")[0].replaceAll(",","");//提取 Best Sellers Rank
               }else if(item.getElementsByClassName("a-color-secondary a-size-base prodDetSectionEntry")[0].innerHTML.includes("Country of Origin")){
                sellerRegion=item.getElementsByTagName("td")[0].innerHTML;//提取 Country of Origin
               }else if(item.getElementsByClassName("a-color-secondary a-size-base prodDetSectionEntry")[0].innerHTML.includes("Date First Available")){
                uploadTime=item.getElementsByTagName("td")[0].innerHTML;//提取 Date First Available
               };
            //console.log(item.innerHTML);
            //keyFeatures.push(item.innerHTML);
        };

       try{
           uploadTime = new Date(uploadTime).getTime();//将时间转化为时间戳
       }catch(e){
       }

       console.log("Item Weight:",packageWeight);
       console.log("Product Dimensions:"+productDimensions);
       console.log("Best Sellers Rank:"+bsrRanking);
       console.log("Country of Origin:"+sellerRegion);
       console.log("Date First Available:"+uploadTime);

       var commodityStar//提取星级
       try {
          commodityStar=document.getElementById("acrPopover").title.split(" out")[0]; //提取星级
      } catch (e) {
          commodityStar=0;
      }
       console.log("commodityStar:"+commodityStar);

       var imgList=new Array();//提取副图
       try{
           var data=JSON.parse(pagesource.match(/'colorImages': \{ 'initial':(.*)\},/)[1]);
           for(let img of data){
              if (img.hiRes === null){
                  imgList.push(img.large);
              }else{
                  imgList.push(img.hiRes)
              };
           };
      }catch (e){
          imgList=[]
      }
       console.log("imgList",imgList);

      var store//提取商品库存
      try {
          store=document.getElementById("availability").getElementsByTagName("span")[0].innerHTML;//提取商品库存
      } catch (e) {
          store="";
      }
      if (store.includes("In")||store.includes("Qty")){
          store="有库存";
      }else if(store.includes("Only")){
          store="少量库存";
      }else if(store.includes("Out")||store.includes("out")||store.includes("Currently unavailable")||store.trim()===""){
          store="无库存";
      }else{
          store="有库存";
      }
      console.log("store:",store);

      var description
      try {
          description=document.getElementById("productDescription").getElementsByTagName("span")[0].innerHTML;//提取商品描述
      } catch (e) {
          description=document.getElementById("aplus_feature_div").innerText;//提取商品描述
      }
      console.log("description:",description);

      //var deliveryMethod=pagesource.match(/>Sold by(.*?)</g)[1];//提取发货方式
      //console.log(deliveryMethod);

      var asin//提取asin
      try {
          asin=pagesource.match(/"currentAsin" : "(.*?)"/)[1];//提取asin
      } catch (e) {
          asin=""
      }
      console.log("asin:",asin);

      var listingUrl=window.location.href//提取商品链接

      var currency//币种
      try{
          currency=pagesource.match(/currency: "(.*?)"/)[0]
      }catch (e){
          try{
              currency=pagesource.match(/currencyCode(.*?),/)[0].replaceAll("currencyCode","").replaceAll(":","").replaceAll("&quot;","").replaceAll(",","")
          }catch (e){
              currency=""
          }
      }
      console.log("currency:",currency)

      var attributes={};//提取规格
      try{
          var asinVariationValues=JSON.parse(pagesource.match(/"dimensionValuesDisplayData" :(.*?\}),/)[1]);//获取多变体属性
          //console.log(asinVariationValues[asin]);
          var keyList=Object.values(JSON.parse(pagesource.match(/"variationDisplayLabels" :(.*?\})/)[1]));//获取规格名

          for (var i = 0; i < keyList.length; i ++) {
          attributes[keyList[i]]=asinVariationValues[asin][i]
          };
      }catch (e) {
          attributes={};
      }
      console.log("attributes:",attributes);


     var deliveryMethod//发货方式
     try{
         deliveryMethod=document.getElementById("merchantInfoFeature_feature_div").getElementsByClassName("a-size-small offer-display-feature-text-message")[0].innerText;
     }catch (e) {
         deliveryMethod=""
     }
     if (deliveryMethod.includes("Amazon")||deliveryMethod.includes("amazon")){
         deliveryMethod="AMZ"
     }else{
         try{
             deliveryMethod=document.getElementById("fulfillerInfoFeature_feature_div").getElementsByClassName("a-size-small offer-display-feature-text-message")[0].innerText;
         }catch (e) {
             deliveryMethod=""
         }
         if (deliveryMethod.includes("Amazon")||deliveryMethod.includes("amazon")){
             deliveryMethod="FBA"
         }else{
             deliveryMethod="FBM"
         }
     }
     console.log("deliveryMethod:",deliveryMethod)

     var freeDeliveryTime//提取免费配送时间
     try{
         freeDeliveryTime=document.getElementById("mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE").getElementsByClassName("a-text-bold")[0].innerText;
     }catch(e){
         freeDeliveryTime=""
     }
     console.log("freeDeliveryTime:",transformDate(freeDeliveryTime))

     var fastestDeliveryTime//提取免费配送时间
     try{
         fastestDeliveryTime=document.getElementById("mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE").getElementsByClassName("a-text-bold")[0].innerText;
     }catch(e){
         fastestDeliveryTime=""
     }
     console.log("fastestDeliveryTime:",transformDate(fastestDeliveryTime))



      //待上传数据
      var listingData={
  "platform":"amazon-us",
  "selectionData": [
    {
      "currency":"USD",
      "web_site_code":"amazon",
      "webSystemListingCode": asin,
      "data": "",
      "deliveryMethod": deliveryMethod,
      "packageWeight": "",
      "description":description,
      "packageWidth": "",
      "remark": "",
        "title": title,
      "keyFeatures":keyFeatures,
      "categoryName": categoryName,
      "tierVariations":attributes,
      "bsrRanking": bsrRanking,
      "price": price,
      "cartPrice": price,
      "variant": 1,
      "productDimensions": productDimensions,
      "packageLength": "",
      "freeDeliveryTime": "",
      "stock": store,
      "mainImageUrl":mainImageUrl,
      "brand": brand,
      "sellersNum": 1,
      "asknum": 0,
      "reviewsNum": 0,
      "productIdentification": "",
      "uploadTime": uploadTime,
      "packageHeight": "",
      "commodityStar": 0,
      "fastestDeliveryTime": fastestDeliveryTime,
      "listingUrl": listingUrl,
      "asin": asin,
      "attributes":JSON.stringify(attributes),
      "imageList":imgList,
      "sellerRegion": sellerRegion
    }
  ]
}
      listingData=JSON.stringify(listingData)
      console.log(listingData)
      postData(listingData)//上传数据

},100);// setTimeout 0.1秒后执行
    }


//采集沃尔玛数据
//采集Amazon提取数据
function extractWalmartData(){
    setTimeout(function(){
        var pagesource=document.documentElement.outerHTML;
        //console.log(pagesource);//获取网页源码
        var nextEl = document.getElementById("__NEXT_DATA__");
        var text = nextEl && nextEl.textContent;
        var listingData;//获取网页源码
        try {
             listingData = JSON.parse(text || "{}")
             } catch (exc) {
             listingData = {}
             }
        console.log(listingData);

        var webSystemListingCode
        var gender
        var deliveryMethod
        var description
        var title
        var keyFeatures=new Array();//提取简要描述
        var categoryName
        var platform
        var tierVariations
        var collectionStoreId
        var sellerurl
        var bsrRanking
        var price
        var productDimensions
        var currency
        var stock
        var mainImageUrl
        var brand
        var itemWeight
        var sellersNum
        var asknum
        var reviewsNum
        var upc
        var uploadTime
        var sellerDisplayName
        var listingUrl
        var asin
        var imgList=new Array();//提取副图
        var categoryId
        var sellerRegion

        //提取标题
        try{
            title=listingData.props.pageProps.initialData.data.product.name
        }catch(e){
            title=""
        }
        console.log("title:",title)

        //提取价格
        try{
            price=listingData.props.pageProps.initialData.data.product.priceInfo.currentPrice.price
        }catch(e){
            price=""
        }
        console.log("price:",price)

        //提取副图
        try{
            for(let img of listingData.props.pageProps.initialData.data.product.imageInfo.allImages){
            imgList.push(img.url);
            };
        }catch(e){
            imgList=[]
        }
        console.log("imgList:",imgList)

        //提取主图
        try{
            mainImageUrl = listingData.props.pageProps.initialData.data.product.imageInfo.thumbnailUrl
        }catch(e){
            try{
                mainImageUrl=imgList[0]
            }catch(e){
                mainImageUrl=""
            }
        }
        console.log("mainImageUrl:",mainImageUrl)

       //提取性别
        if (pagesource.includes("Unisex")){
            gender = "Unisex"
        }else if(pagesource.includes("Female")){
            gender = "Female"
        }else if(pagesource.includes("Male")){
            gender = "Male"
        }else{
            gender = "Unisex"
        }
        console.log("gender:",gender)

         //提取类目
        try{
            categoryName = listingData.props.pageProps.initialData.data.product.category.path[1].name
        }catch(e){
            categoryName=""
        }
        console.log("categoryName:",categoryName)


         //提取评论数
        try{
            reviewsNum = listingData.props.pageProps.initialData.data.product.numberOfReviews
        }catch(e){
            reviewsNum=0
        }
        console.log("reviewsNum:",reviewsNum)


        //提取简要描述
        try{
            for(let item of document.getElementsByClassName("f6 mid-gray lh-title overflow-visible db w_V_DM")){
            keyFeatures.push(item.innerText);
            };
        }catch(e){
            keyFeatures=[]
        }
        console.log("keyFeatures:",keyFeatures)

        //提取简要描述
        try{
            description = listingData.props.pageProps.initialData.data.idml.shortDescription
        }catch(e){
            description=""
        }
        console.log("description:",description)

        var variant//判断是否为多变体
        try{
            if (listingData.props.pageProps.initialData.data.product.variantsMap=={}){
                variant = 1
            }else{
                variant = 2
            }
        }catch(e){
            variant = 1
        }
        console.log("variant:",variant)

        //提取品牌
        try{
            brand=listingData.props.pageProps.initialData.data.contentLayout.modules[1].configs.ad.pageContext.itemContext.brand
        }catch(e){
            try{
                brand=listingData.props.pageProps.initialData.data.contentLayout.modules[1].configs.ad.adsContext.brand
            }catch(e){
                brand=""
            }
        }

        //提取卖家数
        try{
            sellersNum=listingData.props.pageProps.initialData.data.product.additionalOfferCount
        }catch(e){
            sellersNum=1
        }
        console.log("sellersNum:",sellersNum)

        //提取重量，规格
        try{
            for(let specifications of listingData.props.pageProps.initialData.data.idml.specifications){
                if (specifications.name=="Brand" && brand==""){
                    brand = specifications.value
                }else if(specifications.name=="Assembled Product Weight"){
                    itemWeight = specifications.value
                }else if(specifications.name.includes("Product Dimensions")){
                    productDimensions = specifications.value
            }
            };
        }catch(e){
        }
        console.log("brand:",brand)
        console.log("itemWeight:",itemWeight)
        console.log("productDimensions:",productDimensions)

       //提取店铺ID
       try{
           collectionStoreId=listingData.props.pageProps.initialData.data.product.catalogSellerId
       }catch(e){
           collectionStoreId=0
       }
       sellerurl="https://www.walmart.com/seller/"+collectionStoreId
       console.log("collectionStoreId:",collectionStoreId)

       //提取店铺名称
       try{
           sellerDisplayName=listingData.props.pageProps.initialData.data.product.sellerDisplayName
       }catch(e){
           sellerDisplayName=""
       }
       console.log("sellerDisplayName:",sellerDisplayName)

       //提取库存
       try{
           stock=listingData.props.pageProps.initialData.data.product.availabilityStatus
       }catch(e){
           stock=""
       }
       if(stock=="IN_STOCK"||stock=="In stock"){
           stock="有库存"
       }else{
           stock="无库存"
       }
       console.log("stock:",stock)

       //提取asin
       try{
           asin=listingData.props.pageProps.initialData.data.product.usItemId
       }catch(e){
           asin=""
       }
       console.log("asin:",asin)

       //提取库存
       try{
           upc=listingData.props.pageProps.initialData.data.product.upc
       }catch(e){
           upc=""
       }
       console.log("upc:",upc)

       try{
           listingUrl=window.location.href//提取商品链接
       }catch(e){
           listingUrl=null
       }
       console.log(listingUrl)


       var result={
      "webSystemListingCode": asin,
      "data": "",
      "gender": gender,
      "deliveryMethod": "FBM",
      "description": description,
      "remark": "",
      "title": title,
      "keyFeatures": keyFeatures,
      "categoryName": categoryName,
      "platform": "walmart",
      "tierVariations":{},
      "bsrRanking": 0,
      "collectionStoreId": collectionStoreId,
      "sellerurl": sellerurl,
      "price": price,
      "cartPrice": price,
      "variant": variant,
      "productDimensions": productDimensions,
      "currency": "",
      "stock": stock,
      "mainImageUrl": mainImageUrl,
      "brand": brand,
      "itemWeight": itemWeight,
      "sellersNum": sellersNum,
      "asknum": 0,
      "reviewsNum": reviewsNum,
      "upc": upc,
      "uploadTime": 0,
      "webStoreName": sellerDisplayName,
      "sellerDisplayName": sellerDisplayName,
      "listingUrl": listingUrl,
      "asin": asin,
      "imageList": imgList,
      "categoryId": 0,
      "sellerRegion": ""
    }

      var dataListing={
  "platform":"walmart-us",
  "selectionData": [
    result
    ]
    }

      if (variant==2){
          let tempResult=JSON.parse(JSON.stringify(result))
      }


},100);// setTimeout 0.1秒后执行
    }

//上传商品数据
function postData(listingData){
GM_xmlhttpRequest({
  method: "POST",
  url:"https://gather.mytool.maykis.cn/api/gather/saveListing",
  headers:{
"Accept":"application/json, text/plain, */*",
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*",
"Authorization":Authorization,
}
 ,
  data:listingData,
  onload: function(response){
      console.log(response.responseText)
      var resData=JSON.parse(response.responseText)
      if (resData.success==false){
          //console.log("上传失败");
          alert(resData.errmsg)
      }else{
          //alert("上传成功")
          informText("商品数据已上传!")

      }
  },
   onerror: function(response){
      alert("上传失败")
      console.log("上传失败");
    //localStorage.setItem("Authorization", false)//设置Authorization
  }
});
    };



//桌面通知
function informText(text){
// 检查浏览器是否支持此功能
if (!("Notification" in window)) {
    //alert("此浏览器不支持桌面通知");
}
// 检查用户是否已经授权浏览器发送通知
else if (Notification.permission === "granted") {
    // 如果用户已经授权，我们可以创建一个新的通知
    var notification = new Notification(text);
}
// 如果用户尚未授权，则向用户请求权限
else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function (permission) {
        // 如果用户同意，我们可以创建一个新的通知
        if (permission === "granted") {
            var notification = new Notification(text);
        }
    });
}
}

//转化日期
function transformDate(dateText){
    var monthDict={
        'January':'01','February':'02','March':'03','April':'04',
        'May':'05','June':'06','July':'07','August':'08',
        'September':'09','October':'10','November':'11','December':'12',
               }
    try{
        var dataList=dateText.split(", ")[1].split(" ")
        var month=monthDict[dataList[0]]
        var day=dataList[1]
        var year
        let date = new Date();
        let currentMonth = date.getMonth();//获取当前月份
        let currentYear = date.getYear();//获取当前年份
        if( dataList[0]=="January" && currentMonth!=0){
            year=currentYear+1901
        }else{
            year=currentYear+1900
        }
        return year+"-"+month+"-"+day
    }catch(e){
        return ""
    }
}

//插件运行
    var hostUrl=window.location.host
    //只在amazon打开界面
    if (hostUrl=="www.amazon.com"||hostUrl=="www.walmart.com"){
        var username = localStorage.getItem("username");//获取账号
        var password = localStorage.getItem("password");//获取密码
        var Authorization=localStorage.getItem("Authorization")//获取Authorization

    //username = null;//获取账号
    //password = null;//获取账号

    //判断用户名是否存在,不存在则打开登录界面
        if (!username||!password||!Authorization){
            console.log("打开登录界面")
            loginInterface();//打开登录界面
        }else{
            console.log("打开功能界面")
            operatingInterface();//开启功能界面
        };

        console.log("username=",username);
        console.log("password=",password);
        console.log("Authorization:",Authorization)
    }

})(); //(function(){})() 表示该函数立即执行
