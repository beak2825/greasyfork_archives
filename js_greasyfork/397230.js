/* kf帖子阅读器,阅读与编辑kf帖子的类.

 需要给定url进行初始化.
 
 公有变量,方法:
 this.pid:帖子pid
 this.page:页数
 this.floors:楼层表,如[0,1,2,3]
 this.floorContent:楼层内容,关键的量,收集的信息都在这里,一个{},
   key是楼层数,内容有3项:{'author':作者,'text':帖子内容,
   'a':引用帖子的html元素}
 this.show():显示收集内容的情况
 */
class kfReader{
  
  /* 以阅读的帖子的url进行初始化 */
  constructor(url){
    
    this.RECORDS_PER_PAGE = 10; // 每一页的主题数,常量
    
    this.url = url;
    // 从url找出帖子的pid与页数
    var pidAndPage = this._getPidAndPage(url);
    this.pid = pidAndPage['pid'];
    this.page = pidAndPage['page'];
    // 有效楼层表
    this.floors = [];
    for(var i = 0;i < this.RECORDS_PER_PAGE;i++){
      var floor = i+(this.page-1)*this.RECORDS_PER_PAGE; // 楼层
      if (!document.getElementById('floor'+floor)){
        break; // 楼层结束
      }else{
        this.floors.push(floor);
      }
    }      
    // 各层的内容,包括作者,文本,引用的a元素,格式为:
    // {楼层:{'author'(字符串),'text'(字符串), 'a'(html元素)}}
    this.floorContent = {};
    for(var i = 0;i < this.floors.length;i++){
      var floor = this.floors[i]; // 楼层
      this.floorContent[floor] = {}
      this.floorContent[floor]['author'] = this._getAuthor(floor);
      this.floorContent[floor]['text'] = this._getText(floor);
      this.floorContent[floor]['a'] = this._getQuoteA(floor);     
    }
  }
  
  /* 在控制台显示阅读结果 */
  show(){
    var log = console.log;
    log('kfReader本页面阅读结果显示:');
    log('pid =', this.pid);
    log('page =', this.page);
    log('楼层信息:');
    for(var i = 0;i < this.floors.length;i++){
      var floor = this.floors[i];
      log('--- 第'+floor+'楼信息: ---');
      log('作者:', this.floorContent[floor]['author']);
      log('内容前20字:', this.floorContent[floor]['text'].substr(0,20));
      if (this.floorContent[floor]['a']){
        log('是否找到了引用的a标签:', '是');
      }else{
        log('是否找到了引用的a标签:', '否');
      }
    }
  }
  
  /* 获取当前url的pid(帖子唯一标识号码)与页数. */
  _getPidAndPage(url){
    // 指定返回对象,设定默认值
    var result = {'pid':null, 'page':1};
    // 匹配pid
    var pidReg = /\?tid\=(\d+)/;
    var matchPid = url.match(pidReg);
    if (matchPid){
      result['pid'] = matchPid[1];
    }
    // 匹配page
    var pageReg = /&page\=(\d+)/;
    var matchPage = url.match(pageReg);
    if (matchPage){
      result['page'] = parseInt(matchPage[1]);
    }
    // 返回
    return result;
  }
  
  /* 获取第floor层的作者,查找失败返回null */
  _getAuthor(floor){
    var n = floor%10;
    var authorsA = document.getElementsByClassName('readidmsbottom_n');
    if (authorsA.length <= n){return null;}
    return authorsA[n].innerText;
  }
  
  /* 获取第floor层的文本,查找失败返回null */
  _getText(floor){
    // 首先获取楼层标识div,同时测试该楼层是否存在
    var floorFlagDiv = document.getElementById('floor'+floor);
    if (!floorFlagDiv){
      console.log('找不到楼层'+floor);
      return null;
    }
    // 获取文本相关的div,并处理其中文本
    var textDiv = floorFlagDiv.parentElement;
    var textSplit = (textDiv.innerText+" ").split('TOP\n看TA\n回复\n菜单')[1].split('关键词');
    textSplit[0] = textSplit[0].replace(/^\n/, '');
    var text = '';
    if (textSplit.length == 1){
      text = textSplit[0];
    }else{
      for(var i = 0;i < textSplit.length-1;i++){
        if (i > 0){text = text+'关键词';}
        text = text + textSplit[i];
      }
    }
    return text;
  }
  
  /* 查找第floor楼的引用帖子a标签,查找失败返回null */
  _getQuoteA(floor){
    //第floor层
    var div = document.getElementById('floor'+floor);
    if (!div){return null;}
    //查找所有的a,直到内部文本为包含'引用'
    var a = div.getElementsByTagName('a');
    for(var i = 0;i < a.length;i++){
      if(a[i].innerText.indexOf('引用') > -1){
        return a[i];
      }
    }
    return null;
  }
 
}