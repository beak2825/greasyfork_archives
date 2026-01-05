// ==UserScript==
// @name 			雅虎商品上架信息填充工具箱
// @description		雅虎商品上架信息填充工具，工具需要进入新增商品页面后方能起作用
// @author			极品小猫
// @version			4.0.0.5
// @date			2016.06.07
// @modified		2017.03.29
// @namespace   	https://greasyfork.org/zh-CN/users/3128
// 
// @include     	https://tw.user.mall.yahoo.com/store_admin/view/pdbNewMain*
// @include     	https://tw.user.mall.yahoo.com/store_admin/view/pdbCopyMain*
// @include			https://tw.bid.yahoo.com/partner/merchandise/single_edit*
// @include			https://sms.91app.com/V2/SalePage/NewEdit*
// @require			http://code.jquery.com/jquery-2.1.4.min.js
// @require			http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @icon			https://login.yahoo.com/favicon.ico
// @grant			unsafeWindow
// @grant			GM_addStyle
// @encoding		utf-8
// @run-at			document-idle
// @downloadURL https://update.greasyfork.org/scripts/24080/%E9%9B%85%E8%99%8E%E5%95%86%E5%93%81%E4%B8%8A%E6%9E%B6%E4%BF%A1%E6%81%AF%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/24080/%E9%9B%85%E8%99%8E%E5%95%86%E5%93%81%E4%B8%8A%E6%9E%B6%E4%BF%A1%E6%81%AF%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

var host=location.host;


var Tag=[//关键字库
  /*服裝參數*/
  '無袖','三分袖','五分袖','七分袖','八分袖','公主袖','短袖','長袖','蝙蝠袖','喇叭袖',
  '荷葉邊','花邊','領邊','卷邊',
  '短款','中長款','長款',
  '圓領','立領','V領','方領','翻領','西裝領','半高領',
  '百褶','鏤空','繡花',

  /*功能*/
  '多兜',

  /*服裝類型*/
  '褲子','吊帶褲','哈倫褲','牛仔褲','闊腿褲','鬆緊腰','燈籠褲','長褲','五分褲','七分褲','九分褲',
  '長裙','短褲','連身裙','褲裙','裙褲',
  '上衣','襯衫','T恤',
  '洋裝','背心',
  '外套','風衣','斗篷','披肩','假兩件','燈籠型','連帽',
  '平底鞋',

  /*風格類型*/
  '清新','小清新','民族風','文藝範',
  '休閒','百搭','時尚','甜美','可愛','簡約','卡通','清雅','豔麗','田園','韓版','高雅','性感','神秘','優雅','復古','歐美',
  '半襟','斜襟','露背',
  '純色','白色',

  /*工藝*/'磨砂','針織','抽褶',

  /*材質*/
  '純棉','泡泡棉','全棉','雪紡','蠶絲','蕾絲','拼絲','牛仔','縐紗','絲麻','棉麻','苧麻',
  '帆布','軟牛皮',
  /*紋理圖案*/
  '條紋','細條紋','花紋','抓紋','字母','圖案','補丁','印花','花鳥圖','五角星',
  /*裝飾*/'飾品','吊墜','項鍊','串珠','水鑽','滿鑽','玫瑰鑽','水晶','蝴蝶結','麻繩','編織繩','花朵','玫瑰花','四葉草','手環','亮片','珍珠',

  /*新增未分類*/
  '做舊','破洞','毛邊','文藝','寬鬆','磨白','貼布','顯瘦','高腰','鬆緊帶','水洗','直筒','磨破','撞色','小腳','彈力','捏褶','闊腿','拼接','背帶','吊帶','吊襠','連體','高端','個性','垮襠','修身','微喇','明線','大襠','不對稱拼接','淺色','小直筒','裝飾','褶皺',
  '中長','前長後短','前短後長',
  '套頭','薄款','簡潔','不規則','下擺','小開叉','黑邊','遮臀','脫線','通勤','刺繡','開叉','打磨','清涼款','手繪','雙層','衛衣','淑女','不等邊','前大折','氣質','不規則剪裁','蝙蝠型','防曬','精緻','單肩','斜挎','設計款','流行','誇張','彩色','幸運','通用','圓形','打底','名媛','葉子','高貴','水滴','噴繪','塗鴉','亞麻','印染','柔軟','下垂','前開叉','風格','不規則設計','羽毛','朋克','大氣','立體','金屬','品質','大牌','流蘇','系帶','如意','打折','隨意','娃娃款','細折','幾何形狀','收腰','小格子','圓頭','大口袋','小點','小花','彩襪','清涼','風景畫','工字','後開叉','鬆緊口','平底','排扣','大擺','舒適','交叉帶','波西米亞','宮廷','楓葉','後背',

  '','','','','','','','','','','','','','','','','','','','','','',
  '','','','','','','','','','','','','','','','','','','','','','',
  '','','','','','','','','','','','','','','','','','','','','','',
];

switch(host) {
  case 'sms.91app.com':
    var specTitle=$('[name="title"]');					//商品名称文本框
    var suggestPrice=$('[name="suggestprice"]');		//建议售价
    var price=$('[name="price"]');						//售价
    var cost=$('[name="cost"]');						//成本
    var productDescription=$('[name="productDescription"]');		//商品描述
    var SEOTitle=$('[name="SEOTitle"]');				//SEO 商品名称
    var SEOKeywords=$('[name="SEOKeywords"]');			//SEO 标签
    var productInfo=function(){
      return {
        "ID":$('[name="outerId"]'),	//商品货号
        "qty":$('[name="qty"]'),				//库存数量
        "onceQty":$('[name="onceQty"]')		//单次可售数量
      }
    };
    addInfoMain(specTitle,suggestPrice,price,cost,productDescription,productInfo,SEOTitle,SEOKeywords,{"MainPosition":"right"});
    break;
  case 'tw.user.mall.yahoo.com':
    $('#ypsvspm').hide();		//隱藏金流方式
    $('#ypsvsd').hide();		//隱藏設定金流方式
    $('#ypsvssi div.bd>table>tbody>tr:nth-of-type(1)').hide();		//規格設定→无规格
    $('#ypsvssi tr.noborder').hide();	//規格設定→二個規格
    $('[name="spec_setting"][value="2"]').attr('checked',true);		//选中一个规格

    /*尺码规格填充*/
    $('<div id="addSize" class="border:1px solid #ccc"></div>').appendTo($('.addspec'));

    $('<span>规格名称：</span><input id="addSize_Name" placeholder="规格名称"/>　　<span>尺码：</span><input id="addSize_Size" placeholder="尺码"/><br>').appendTo($('#addSize'));

    $('[name="spec_name"]').val("顏色尺碼");

    $('<input>').attr({'id':'addSize_submit','type':'button','value':'填充资料'}).css({'padding':'5px'}).click(function(){
      var specSetting=$('[name^="specSetting_"]');			//商品规格
      var specLength=specSetting.length;					//商品规格 文本框数量


      var add_Size=$('#addSize_Size').val();			//需要添加的尺码
      var addSize_Name=$('#addSize_Name').val();				//需要添加的颜色
      var addSize_NameArr=addSize_Name.split(/[、\/\,，]/);		//分割颜色的符号
      var sizeTXT=['S','M','L','XL','XXL','XXXL'];

      console.log('颜色数量:',addSize_NameArr.length,'平分格子：',Math.floor(specSetting.length/addSize_NameArr.length));

      for(nameI=0,i=0;nameI<addSize_NameArr.length;nameI++){	//按颜色填充
        max=i+Math.floor(specSetting.length/addSize_NameArr.length);		//跳过已存在的格子，计算最大可填充数

        if(!add_Size) {	//没有尺码参数时
          for(i;i<=nameI;i++){
            if(!specSetting[i].value) {	//只插入没有数据的文本框
              specSetting[i].value=addSize_NameArr[nameI];						//商品规格
              $('[name^="stockAmount_"]')[i].value=10;						//库存量
              $('[name^="stockSafeAmount_"]')[i].value=1;					//安全库存量
              $('[name^="itemSn_"]')[i].value=$('[name="main_num"]').val();	//商品货号
            }
          }
        } else if(/[,\-，、]/.test(add_Size)||add_Size<=5) {		//转换为 M、L、XL、XXL 尺码
          var SizeArr=add_Size.split(/[,\-，、]/);

          if(SizeArr[0]>5||SizeArr[1]>5) {	//尺寸检测
            alert('尺码不符合填充规则，M-XXXL尺码请使用 1-5 的方式来代替');
            return;
          } else if(SizeArr[0]<=5&&!SizeArr[1]){	//如果只输入了一位数，补充另一位数
            SizeArr[1]=SizeArr[0];
          }

          for(size=SizeArr[0],Sizemax=SizeArr[1];i<=max&&i<specSetting.length&&size<=Sizemax;i++,size++){
            //size=最小尺码，Sizemax=最大尺码，i < 已填充的格子数，且 i 小于 最大格子数，且 最小尺寸小于等于最大尺寸，则填充数据
            console.log('size:' + size, 'txt: '+ sizeTXT[size],'max: ' + Sizemax);
            if(!specSetting[i].value) {	//只插入没有数据的文本框
              specSetting[i].value=addSize_NameArr[nameI] + " " + sizeTXT[size];//商品规格
              $('[name^="stockAmount_"]')[i].value=10;						//库存量
              $('[name^="stockSafeAmount_"]')[i].value=1;					//安全库存量
              $('[name^="itemSn_"]')[i].value=$('[name="main_num"]').val();	//商品货号
            }
          }
        } else if(i<max){	//多颜色时，填充后一半的格子
          for(size=add_Size;i<max&&i<specSetting.length;i++,size++){
            console.log(i,max);
            if(!specSetting[i].value) {	//只插入没有数据的文本框
              specSetting[i].value=addSize_NameArr[nameI] + " " + size;//商品规格
              $('[name^="stockAmount_"]')[i].value=10;						//库存量
              $('[name^="stockSafeAmount_"]')[i].value=1;					//安全库存量
              $('[name^="itemSn_"]')[i].value=$('[name="main_num"]').val();	//商品货号
            }
          }
        }
      }
    }).appendTo($('#addSize'));

    $('<input>').attr({'type':'button','value':'清空数据'}).css({'padding':'5px'}).click(function(){
      $('[name^="specSetting_"]').val("");
      $('[name^="stockAmount_"]').val("");
      $('[name^="stockSafeAmount_"]').val("");
      $('[name^="itemSn_"]').val('');
      
    }).appendTo($('#addSize'));


   

    //$('<input>').attr({'type':'button','value':'清自订号'}).css({'padding':'5px'}).click(function(){
   // $('[name^="itemSn_"]').val('');
   //}).appendTo($('#addSize'));








    /* ====== 信息填充框 ====== */
    $('<div>').attr({'id':'addMain'}).css({'position':'fixed','left':'0px','bottom':'0px'}).appendTo($('.bodybg'));
    $('<textarea>').attr({'id':'addContent','placeholder':'商品数据（必须包含全部）'}).css({'width':+$('#yui-main').offset().left+'px','height':'250px','padding':'5px;'}).appendTo($('#addMain'));
    $('<br>').appendTo($('#addMain'));
    $('<button>').attr({'type':'button'}).text('填充数据').click(function(){
      var textArr=$('#addContent').val().match(/.+$/igm);		//取得填充信息
      if(textArr.length==2) {	//只有两行数据时，采用简化方式采集数据
       
        //531883536373/1580/980
        //純棉五分褲-夢想家-春夏新品-休閒寬鬆大兜純色五分吊襠褲-0523
        var objArr=textArr[0].split('/');						//分割商品编号，原价，系价
        $('[name="main_num"]').val(objArr[0]);				//商品货号
        $('[name="market_price"]').val(objArr[1]);			//商品市价
        $('[name="network_price"]').val(objArr[2]);			//网路价
        $('[name="network_price_confirm"]').val(objArr[2]);	//确认网路价
        $('[name="production_name"]').val(textArr[1]);		//商品名称
      } else if(textArr.length==3) {	//只有两行数据时，采用简化方式采集数据

        //531883536373/1580/980
        //純棉五分褲-夢想家-春夏新品-休閒寬鬆大兜純色五分吊襠褲-0523
        var objArr=textArr[0].split('/');						//分割商品编号，原价，系价
        $('[name="main_num"]').val(objArr[0]);				//商品货号
        $('[name="market_price"]').val(objArr[1]);			//商品市价
        $('[name="network_price"]').val(objArr[2]);			//网路价
        $('[name="network_price_confirm"]').val(objArr[2]);	//确认网路价
        $('[name="production_name"]').val(textArr[1]);		//商品名称

        var speceArr=textArr[2].split('/');
        $('#addSize_Name').val(speceArr[0]);			//商品规格填充
        $('#addSize_Size').val(speceArr[1]);			//商品尺码填充
        $('#addSize_submit').click();					//自动填充数据
      } else {
        $('[name="main_num"]').val(textArr[0]);					//商品货号
        $('[name="production_name"]').val(textArr[1]);			//商品名称
        $('[name="market_price"]').val(textArr[2]);				//商品市价
        $('[name="network_price"]').val(textArr[3]);			//网路价
        $('[name="network_price_confirm"]').val(textArr[4]);	//确认网路价
      }
         $('[name^="itemSn_"]').val('');                    //清空自訂貨號
      //商品关键字提取
      var str='';
      for(i=0;i<Tag.length;i++){
        if(textArr[1].search(Tag[i])>0) {
          str=str+" "+Tag[i];
        }
      }
      $('[name="product_brief"]').val(str);				//商品关键字
    }).appendTo($('#addMain'));

    $('<button>').attr({'type':'button'}).text('帮助').click(function(){
      alert('第一行：商品货号\n第二行：商品名称\n 第三行：商品市价 \n 第四行：网路价\n 第五行：确认网络价\n\n===== 商品规格填充说明 =====\n规格支持：, ， 、/ 四个符号作为分隔符，多规格填充，按照可填充的规格数量平均分配，不满足平均分配时不填充不满足部分。\n尺码：尺码按照最小的尺码进行数字递增，多规格则在平均分配的条件下进行独立的数字递增。S-XXXL的尺码，以 0-5代替')
    }).appendTo($('#addMain'));



    /* ====== 日期填充 ====== */
    if($('[name="prodopt"][value="reserve"]')[0]) {
      $('[name="prodopt"][value="reserve"]').attr('checked',true);	//选中预约上架
      $('[name="reserve_start_date"]').val(Dates());			//填充日期
      $('[name="reserve_start_hour"]').val(23);					//填充时间
    }


    break;
  case 'tw.bid.yahoo.com':
    $('#create-specs').attr('chedked',true);		//选中建立商品规格
    $('.specs-new.hidden').removeClass('hidden');	//显示规格内容
    
    $('#hasPromotionPrice').attr('checked',true);	//选中促销价选框
    $('.promo-price-wrap').removeClass('hidden');	//显示促销价
    
    $('.reserved').click();
    $('#reserveShelve').click();					//预约刊登
    $('.shelf-date-wrap').addClass('show');			//显示上架时间
    
    $(document).ready(function(){
      setTimeout(function(){
        //延时5秒后再覆盖信息
        $('#down-search-hour').val(3);					//上架时为 3时
        $('#down-search-minute').val(0);				//上架分为 0分
        $('.calendar-input-wrap.input-calendar').val(Dates(new Date().setDate(new Date().getDate()+1)));	//上架日为本日+1
      },5000);
    });

    
    
    $('.fieldset-ads').css({'display':'none'});		//隐藏行动版广告
    GM_addStyle('/*二维码*/ul.ens.yui3-g{display:none!important;} /*運送、收款方式*/fieldset.promote-wrap .row-wrap{display:none!important;}');
    
    
    /*尺码规格填充*/
    $('<div id="addSize" class="border:1px solid #ccc"></div>').appendTo($('.finish-wrap'));

    $('<span>规格名称：</span><input id="addSize_Name" placeholder="规格名称"/>　　<span>尺码：</span><input id="addSize_Size" placeholder="尺码"/><br>').appendTo($('#addSize'));

    $('[name="spec_name"]').val("顏色尺碼");

    $('<input>').attr({'id':'addSize_submit','type':'button','value':'填充资料'}).css({'padding':'5px'}).click(function(){
      var specSetting=$('[name^="specSetting_"]');			//商品规格
      var specLength=specSetting.length;					//商品规格 文本框数量
      
      var add_Size=$('#addSize_Size').val();					//需要添加的尺码
      var addSize_Name=$('#addSize_Name').val();				//需要添加的颜色
      var addSize_NameArr=addSize_Name.split(/[、\/\,，]/);		//分割颜色的符号
      var sizeTXT=['S','M','L','XL','XXL','XXXL'];
    }).appendTo($('.specs-manage'));
    
    
    
    
    $('<div>').attr({'id':'addMain'}).css({'position':'fixed','left':'0px','bottom':'0px'}).appendTo($('#bd'));
    $('<textarea>').attr({'id':'addContent','placeholder':'商品数据（必须包含全部）'}).css({'width':+$('#bd').offset().left+'px','height':'250px'}).appendTo($('#addMain'));
    $('<br>').appendTo($('#addMain'));
    $('<button>').attr({'type':'button'}).text('填充数据').click(function(){
      var textArr=$('#addContent').val().match(/.+$/igm);


      if(textArr.length==2) {	//只有两行数据时，采用简化方式采集数据
        //531883536373/1580/980
        //純棉五分褲-夢想家-春夏新品-休閒寬鬆大兜純色五分吊襠褲-0523
        var objArr=textArr[0].split('/');					//分割商品编号，原价，系价
        $('[name^="modelNumber"]:not([name^="modelNumber2"])').val(objArr[0]);			//商品货号
        $('[name="itemTitle"]').val(textArr[1]);				//商品名称
        $('[name="salePrice"]').val(objArr[1]);				//商品定价
        $('[name="promoPrice"]').val(objArr[2]);			//商品促销价
        $('[name^="modelQuantity"]').val(10);				//商品数量
      } else {
        $('[name^="modelNumber"]:not([name^="modelNumber2"])').val(objArr[0]);			//商品货号
        $('[name="itemTitle"]').val(textArr[1]);			//商品名称
        $('[name="salePrice"]').val(textArr[2]);			//商品定价
        $('[name="promoPrice"]').val(textArr[3]);			//商品促销价
        $('[name^="modelQuantity"]').val(10);				//商品数量
      }

      var max=0;
      $('[name^="modelQuantity"]').each(function(){
        max+=Number($(this).val());
      });
      $('#totalQuantity').val(max);							//计算总数量隐藏域
      $('.total-number>.qty').text(max);					//显示总数量
    }).appendTo($('#addMain'));

    break;
                
}

function addInfoMain(specTitle,suggestPrice,price,cost,KeyWord,productInfo,SEOTitle,SEOKeyWord,MainSet){
  var body=MainSet.body||$('body');
  var MainWidth=MainSet.MainWidth||250;
  var MainPosition=MainSet.MainPosition||'left';
  /* ====== 信息填充框 ====== */
  $('<div>').attr({'id':'addMain'}).css({'position':'fixed','bottom':'0px','z-index':999}).css(MainPosition,'0px').appendTo(body);
  
  $('<textarea>').attr({'id':'addContent','placeholder':'商品数据（必须包含全部）'}).css({'width':+MainWidth+'px','height':'250px','padding':'5px;'}).appendTo($('#addMain'));
  
  $('<br>').appendTo($('#addMain'));
  
  $('<button>').attr({'type':'button'}).text('填充数据').click(function(){
    var textArr=$('#addContent').val().match(/.+$/igm);		//取得填充信息
    if(textArr.length==2) {	//只有两行数据时，采用简化方式采集数据
      //531883536373/1580/980
      //标题——純棉五分褲-夢想家-春夏新品-休閒寬鬆大兜純色五分吊襠褲-0523
      var objArr=textArr[0].split('/');		//分割商品编号，原价，系价
      console.log(objArr,objArr[0],productInfo);
      	specTitle.val(textArr[1]);			//商品名称，从第二行中提取
      	suggestPrice.val(objArr[1]);		//建议售价
      	price.val(objArr[2]);				//售价
        cost.val(objArr[3]||0)					//成本
        var Info=productInfo();
        Info.ID.val(objArr[0]);		//商品货号
        Info.qty.val(objArr[4]||10);	//库存数量
        Info.onceQty.val(objArr[5]||5);	//单次可售数量
      $('[name="onceQty"]').val(5);
        if(SEOTitle) SEOTitle.val(textArr[1]);			//SEO 商品名称
    }
    //商品关键字提取，从商品名称中自动提取
    var str='';
    for(i=0;i<Tag.length;i++){
      if(textArr[1].search(Tag[i])>0) {
        str=str+" "+Tag[i];
      }
    }
    
      console.log(str);
    KeyWord.val(str);				//商品关键字
    SEOKeyWord.val(str);			//SEO 商品关键字
  }).appendTo($('#addMain'));
}


function Dates(str){
  var sDate=str?new Date(str):new Date();		//获得系统日期
  var sYear=sDate.getFullYear();	//获得年份
  var sMonth=sDate.getMonth()+1;	//获得月份
  sMonth=sMonth<10?'0'+sMonth:sMonth;
  var sDay=sDate.getDate();     	//获得日期
  sDay=sDay<10?'0'+sDay:sDay;
  return sYear+'/'+sMonth+'/'+sDay;
}

    //更新日志
    //4.0.0 【2017.03.29】
    //1、支持 91APP
    
    //0.0.9.5 【2016.10.17】
    //1、雅虎商城不填商品详细货号
    //
    //0.0.9.4 【2016.06.07】
    //1、雅虎商城，支持3行信息填充模式，一键填充所有数据（第三行为商品规格/尺码）
    //2、隐藏无规格的框
    //3、默认选中一个规格
    //
    //v0.0.9.3【2016.06.02】
    //1、雅虎商城，隐藏部分无用的选项
    //2、雅虎商城，修正日期选择和日起填充
    //
    //v0.0.9.2
    //1、雅虎拍卖，修正复制的商品没有勾选商品规格
    //2、时间自动填充
    //
    //v0.0.9.1
    //1、修正商品数量计算提示没有填写数量
    //2、隐藏“隐藏運送、收款方式”，二维码
    //
    //v0.0.9
    //1、商品数据提取支持2行简写模式
    //2、商品编号填写修正