// ==UserScript==
// 远程调用代码 ：  https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js
//  <script src="https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js"></script>
//  <script src="https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js<?php echo "?v=".rand(1,10000);?>"></script>
////组件是小块的，路由本质是一个自定义组件，但主要是一个完整的界面显示，多个组件组合成的（其中组件需要另外载入），路由组件，就不用再单独组件注册，省得再加载一次；
// @name           baidu_gps_tool.js
// @namespace       moe.canfire.flf

// @description     descbaidu_gps_tool.js
// @author          mengzonefire
// @license         MIT
// @match           *
// @version 1.0 

// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/520848/baidu_gps_tooljs.user.js
// @updateURL https://update.greasyfork.org/scripts/520848/baidu_gps_tooljs.meta.js
// ==/UserScript==
  var tool={}
  //根据中文地址，得到经纬度坐标
//https://lbsyun.baidu.com/index.php?title=jspopularGL/guide/geocoding
tool.xGetCoordinate=
function (adress='泰州市'){
  return new Promise((resolve, reject) => {
     var myGeo = new BMapGL.Geocoder();
      myGeo.getPoint(adress, function(point){
       if(point){ resolve(point); }
     })
  })//promise
  }//function
//画线，经纬度坐标数组{lan:,xx}
tool.drawPath=function(map,ptlist,color="green",lineWidth=3){
   // 设置折线颜色// 设置折线宽度
  var polyline = new BMapGL.Polyline(ptlist,{strokeColor:color,  strokeWeight: lineWidth })
   map.addOverlay(polyline)  
}
 tool.drawPicture=function(map,pt= {lng:119.930721,lat:32.462137},imgUrl='http://gips1.baidu.com/it/u=3874647369,3220417986&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280',imgSize=40){
  if(!imgUrl){
// 创建点标记
 var xpoint= new BMapGL.Point(pt.lng, pt.lat);
var mark= new BMapGL.Marker(xpoint);
  }else{
  
  var icon = new BMapGL.Icon(imgUrl, new BMapGL.Size(imgSize,imgSize));
 var xpoint= new BMapGL.Point(pt.lng, pt.lat);
var mark= new BMapGL.Marker3D(xpoint,Math.round(Math.random()) *6000, { size: 50, icon: icon});
   
  }//if
 mark.addEventListener('click', function () {  alert(1) }); // 点标记添加点击事件
// 在地图上添加点标记
map.addOverlay(mark);
 
}
 
/*
//{"pts":[{"lng":116.405835,"lat":39.911877},{"lng":116.405784,"lat":39.913097},{"lng":116.405793,"lat":39.913917},{"lng":116.405813,"lat":39.914116}]}
//给定两个点的经纬度坐标，获取距离，坐标点列表，用时
//result.ptlist,result.distance,result.duration
 
alert( JSON.stringify(res) )
*/
 
tool.xSeachPath2=  function ( pt1={"lng":116.4133836971231,"lat":39.910924547299565},pt2={"lng":117.2080927529767,"lat":39.09110259843554}){
var start=new BMapGL.Point(pt1.lng,pt1.lat);
var end=new BMapGL.Point(pt2.lng,pt2.lat);
  return new Promise((resolve, reject) => {
var driving = new BMapGL.DrivingRoute(map, {renderOptions: {map: map, autoViewport: true},
onSearchComplete: function (results){
          var plan=driving.getResults().getPlan(0);
          var result={};
          result.ptlist=plan.getRoute(0).getPath() ;
          result.time=plan.getDuration(true)
          result.distance=plan.getDistance(true)
 
          // alert(JSON.stringify( result));
          //driving.clearResults();
          resolve(result);
        }
 });
    driving.search(start,end);
  })//promise
  }//function
  
tool.xSeachPath=async  function( site1={adress:'北京市',lng:123,lat:123},site2={adress:'天津市',lng:123,lat:123}  ){
 //有地址，优先用地址
       var pt1={},pt2={};
  if(site1.adress)pt1=await tool.xGetCoordinate(site1.adress);
  else{pt1.lng=site1.lng;pt1.lat=site1.lat;}
  if(site2.adress)pt2=await tool.xGetCoordinate(site2.adress);
    else{pt2.lng=site2.lng;pt2.lat=site2.lat;}
   // alert( JSON.stringify( pt1 ));
   // alert( JSON.stringify( pt2 ));
  return await tool.xSeachPath2(pt1,pt2);
}
tool.createTrackLine=function (map,ptlist=[ {lng:1,lat:2},{lng:1,lat:2},{lng:1,lat:2}],zoomLevel=18,followView=true){
   //地图缩放级别，视角动态跟随
  //城市内缩放18，城市间缩放13,14为好；
 //多个轨迹线时，视角动态跟随，就会互相影响有问题，适合单个轨迹
 
   map.setZoom(zoomLevel); // 设置地图的缩放级别
    //[ {lng:1,lat:2},{lng:1,lat:2},{lng:1,lat:2}]
    var trackPointList= [];
    for (var pt of ptlist ) {
        var trackPoint = new Track.TrackPoint( new BMapGL.Point( pt.lng, pt.lat ) );
        trackPointList.push(trackPoint);
    }
   /////
    var trackView = new Track.View(map,{
        lineLayerOptions: {style: { strokeWeight: 8, strokeLineJoin: 'round',strokeLineCap: 'round' }
        }
    });
 
    var trackLine = new Track.LocalTrack({
        trackPath: trackPointList,
        duration: 60,
        style: {
            sequence: true,
            marginLength: 2,
            arrowColor: '#fff',
            strokeTextureUrl: '//mapopen-pub-jsapi.bj.bcebos.com/jsapiGlgeo/img/down.png',
          //  strokeTextureWidth: 64,
          //  strokeTextureHeight: 32,
          //  traceColor: [27, 142, 236]
        },
      //  linearTexture: [[0, '#f45e0c'], [0.5, '#f6cd0e'], [1, '#2ad61d']],
    });

 
    trackView.addTrackLine(trackLine);
    if(followView) trackView.focusTrack(trackLine);
   //移动点的标记，汽车图片
    var movePoint = new Track.GroundPoint({ point: trackPointList[0].getPoint(),
        style:{
          url: 'https://mapopen-pub-jsapi.bj.bcebos.com/jsapiGlgeo/img/car.png',
            level: 18,
            scale: 1,
            size: new BMapGL.Size(16, 32),
            anchor: new BMapGL.Size(0.5,0.5),
        }
    });
      trackLine.setMovePoint(movePoint);
    return trackLine;
  }///function
tool.tractLineDo=function(trackLine,action=1, desc="1start,2stop,3pause,4resume"){
  if(action==1){
     setTimeout(()=>{trackLine.startAnimation();},3000)
  }
  if(action==2)trackLine.stopAnimation();
  if(action==3)trackLine.pauseAnimation();
  if(action==4)trackLine.resumeAnimation();
 }
 
tool.createMap=function(site={address:'泰州市',pt:{lng:119.930721,lat:32.462137}} ){
 
var map = new BMapGL.Map('container'); // 创建Map实例
if(site.adress)  map.centerAndZoom(site.adress,12); 
else map.centerAndZoom(new BMapGL.Point(site.pt.lng,site.pt.lat),12); // 初始化地图,设置中心点坐标和地图级别
// map.setZoom(12); // 设置地图的缩放级别
map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
 //map.setMapType(BMAP_EARTH_MAP); // 设置地图类型为地球模式
var scaleCtrl = new BMapGL.ScaleControl(); // 添加比例尺控件map.addControl(scaleCtrl);
 var zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件map.addControl(zoomCtrl);
 var cityCtrl = new BMapGL.CityListControl(); // 添加城市列表控件
map.addControl(cityCtrl);var locationControl = new BMapGL.LocationControl(); // 添加定位控件map.addControl(locationControl);
return map;
  }//function

//随机添加一条
tool.addRobot=async function(cities=["泰州市","兴化市","靖江市","姜堰市"]){
  if(!cities)cities = ["南京", "无锡", "徐州", "常州", "苏州", "南通", "连云港", "淮安", "盐城", "扬州", "镇江", "泰州", "宿迁"];
       let citiesCopy =cities;
       let firstCity = citiesCopy.splice(Math.floor(Math.random() * citiesCopy.length), 1)[0];
       let secondCity = citiesCopy.splice(Math.floor(Math.random() * citiesCopy.length), 1)[0];
  
  var  path=await tool.xSeachPath( site1={adress:firstCity,lng:123,lat:123},site2={adress:secondCity,lng:123,lat:123} )
 alert( firstCity+'==>'+secondCity ); console.log(firstCity,secondCity,path.distance,path.time)
      var trackLine=tool.createTrackLine(map,path.ptlist,12,false); tool.tractLineDo(trackLine,1,"1start,2stop,3pause,4resume");
  return
}
