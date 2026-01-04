// ==UserScript==
// @name         63 布局
// @description  63 布局~
// @namespace    https://screeps.com/
// @version      0.0.2
// @author       Jason_2070
// @match        https://screeps.com/*
// @match        http://121.5.170.187/a/*
// @match        http://47.108.81.76/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467310/63%20%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/467310/63%20%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

$(function () {
  setInterval(() => {
      if(!$('section.game').length) return;
      if(!$('section.room').length) return;
      let gameEl = angular.element($('section.game'));
      let roomElem = angular.element($('section.room'));
      let roomScope = roomElem.scope();
      let room = roomScope.Room;

      let canvas = $('canvas.visual2')[0];
      if (!canvas) {
          canvas = createCanvas();
      }
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.save();

      if (!room) return;
      let roomName = room.roomName;

      if (room.cursorPos) Game.flags.storagePos = { pos: { x: room.cursorPos.x, y: room.cursorPos.y, roomName: roomName } };
      else Game.flags.storagePos = null;

      let pa = null;
      let pb = null;
      let pc = null;
      let pm = null;
      room.objects.forEach(e => {
				if (e.type == 'source') {
					if (!pa) pa = { pos: { x: e.x, y: e.y, roomName: roomName } }
					else pb = { pos: { x: e.x, y: e.y, roomName: roomName } }
				}
				if (e.type == 'controller') pc = { pos: { x: e.x, y: e.y, roomName: roomName } }
				if (e.type == 'mineral' && ['O','H','K','U','Z','L','X'].indexOf(e.mineralType) != -1) pm = { pos: { x: e.x, y: e.y, roomName: roomName } }
			});
			if (!pc) return;
			let points = [pc,pm,pa];
			if (pb) points.push(pb);

      let result = window.ManagerPlanner.computeManor(roomName, points);
      if (result.structMap) helpervisual.showRoomStructures(ctx, result.structMap);
      else console.log(result);

      ctx.restore();
  }, 5000);
});

function createCanvas(){
  let roomScope = angular.element($('section.room')).scope();
  let $compile = angular.element($('section.game')).injector().get('$compile');
  let canvas = $('<canvas></canvas>')[0];
  canvas.className = 'visual2';
  canvas.width = 2500;
  canvas.height = 2500;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  $compile($(canvas))(roomScope);
  $('div.pixijs-renderer__stage').append(canvas);
  return canvas;
}

let structuresShape = {
    "spawn": "◎",
    "extension": "ⓔ",
    "link": "◈",
    "road": "•",
    "constructedWall": "▓",
    "rampart": "⊙",
    "storage": "▤",
    "tower": "🔫",
    "observer": "👀",
    "powerSpawn": "❂",
    "extractor": "⇌",
    "terminal": "✡",
    "lab": "☢",
    "container": "□",
    "nuker": "▲",
    "factory": "☭"
}

let structuresColor = {
    "spawn": "cyan",
    "extension": "#0bb118",
    "link": "yellow",
    "road": "#fa6f6f",
    "constructedWall": "#003fff",
    "rampart": "#003fff",
    "storage": "yellow",
    "tower": "cyan",
    "observer": "yellow",
    "powerSpawn": "cyan",
    "extractor": "cyan",
    "terminal": "yellow",
    "lab": "#d500ff",
    "container": "yellow",
    "nuker": "cyan",
    "factory": "yellow"
}

let CONTROLLER_STRUCTURES = {
    "spawn": {0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3},
    "extension": {0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60},
    "link": {1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6},
    "road": {0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
    "constructedWall": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
    "rampart": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
    "storage": {1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1},
    "tower": {1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6},
    "observer": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
    "powerSpawn": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
    "extractor": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
    "terminal": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
    "lab": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10},
    "container": {0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5},
    "nuker": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
    "factory": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1}
}

let helpervisual = {
    // 大概消耗1 CPU！ 慎用！
    showRoomStructures: function (ctx, structMap) {
        let roomStructs = new RoomArray().init()
        structMap["road"].forEach(e => roomStructs.set(e[0], e[1], "road"))
        _.keys(CONTROLLER_STRUCTURES).forEach(struct => {
					if (struct == "road") {
							structMap[struct].forEach(e => {
									roomStructs.forNear((x, y, val) => {
									    if (val == "road" && ((e[0] >= x && e[1] >= y) || (e[0] > x && e[1] < y))) helpervisual.line(ctx, x, y, e[0], e[1], { color: structuresColor[struct] })
									}, e[0], e[1]);
									helpervisual.text(ctx, structuresShape[struct], e[0] + 0.3, e[1] + 0.25, { color: structuresColor[struct], opacity: 0.75, fontSize: 7 })
							})
					} else {
						structMap[struct].forEach(e => helpervisual.text(ctx, structuresShape[struct], e[0], e[1] + 0.25, { color: structuresColor[struct], opacity: 0.75, fontSize: 7 }))
					}
        })
        // for (let x = 0; x < 50; x++) {
        //     for (let y = 0; y < 50; y++) {
        //         if (roomWalkable.get(x,y) == 0) {
        //             helpervisual.text(ctx, 'X', x, y + 0.25, { color: 'white', opacity: 0.75, fontSize: 7 });
        //         }
        //         if (roomWalkable.get(x,y) == 1) {
        //             helpervisual.text(ctx, 'X', x, y + 0.25, { color: 'red', opacity: 0.75, fontSize: 7 });
        //         }
        //         if (roomWalkable.get(x,y) == 2) {
        //             helpervisual.text(ctx, 'X', x, y + 0.25, { color: 'green', opacity: 0.75, fontSize: 7 });
        //         }
        //     }
        // }
    },
		text(ctx, text, x, y, ops) {
			ctx.globalAlpha = ops.opacity;
			ctx.fillStyle = ops.color;
			ctx.font = "50px Arial";
			ctx.fillText(text, x * 50 + 0, y * 50 + 30);
		},
		line(ctx, x1, y1, x2, y2, ops) {
			ctx.strokeStyle = ops.color; /*设置绘制的样式*/
			ctx.lineWidth = 5;/*设置绘制线宽*/
			ctx.beginPath();/*开始绘制*/
			ctx.moveTo(x1 * 50 + 25, y1 * 50 + 25);/*绘制的起始点坐标*/
			ctx.lineTo(x2 * 50 + 25, y2 * 50 + 25);/*绘制的终点坐标*/
			ctx.stroke();/*开始绘制*/
		}
}

class UnionFind {

    constructor(size) {
        this.size = size
    }
    init() {
        if (!this.parent)
            this.parent = new Array(this.size)
        for (let i = 0; i < this.size; i++) {
            this.parent[i] = i;
        }
    }
    find(x) {
        let r = x;
        while (this.parent[r] != r) r = this.parent[r];
        while (this.parent[x] != x) {
            let t = this.parent[x];
            this.parent[x] = r;
            x = t;
        }
        return x;
    }
    union(a, b) {
        a = this.find(a)
        b = this.find(b)
        if (a > b) this.parent[a] = b;
        else if (a != b) this.parent[b] = a;
    }
    same(a, b) {
        return this.find(a) == this.find(b)
    }
}

let NodeCache = []
function NewNode(k, x, y, v) {
    let t
    if (NodeCache.length) {
        t = NodeCache.pop()
    } else {
        t = {}
    }
    t.k = k
    t.x = x
    t.y = y
    t.v = v
    return t
}


function ReclaimNode(node) {
    if (NodeCache.length < 10000)
        NodeCache.push(node)
}

class PriorityQueue {

    constructor() {
        function QueueElement(element, priority) {
            this.element = element
            this.priority = priority
        }
        // 封装属性
        this.items = []

        this.push = (node) => {
            // 1.创建QueueElement对象
            let queueElement = new QueueElement(node, node.k)
            // 2.判断队列是否为空
            if (this.items.length == 0) {
                this.items.push(queueElement)
            } else {
                let added = false
                for (let i = 0; i < this.items.length; i++) {
                    if (queueElement.priority < this.items[i].priority) {
                        this.items.splice(i, 0, queueElement)
                        added = true
                        break
                    }
                }
                if (!added) {
                    this.items.push(queueElement)
                }
            }
        }

        this.pop = () => {
            return this.items.shift().element;
        }

        this.top = () => {
            return this.items[0].element;
        }

        this.whileNoEmpty = (func) => {
            while (!this.isEmpty()) {
                let node = this.pop();
                func(node)
                ReclaimNode(node)
            }
        }

        this.isEmpty = () => {
            return this.items.length == 0;
        }
        this.clear = () => {
            return this.items = [];
        }
        this.size = () => {
            return this.items.length;
        }
    }

    push(node) { }

    top() { return }

    pop() { return }
}

let RoomArray_proto = {
    exec(x, y, val) {
        let tmp = this.arr[x * 50 + y]
        this.set(x, y, val);
        return tmp
    },
    get(x, y) {
        return this.arr[x * 50 + y];
    },
    set(x, y, value) {
        this.arr[x * 50 + y] = value;
    },
    init() {
        if (!this.arr)
            this.arr = new Array(50 * 50)
        for (let i = 0; i < 2500; i++) {
            this.arr[i] = 0;
        }
        return this;
    },
    forEach(func) {
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                func(x, y, this.get(x, y))
            }
        }
    },
    for4Direction(func, x, y, range = 1) {
        for (let e of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let xt = x + e[0]
            let yt = y + e[1]
            if (xt >= 0 && yt >= 0 && xt <= 49 && yt <= 49)
                func(xt, yt, this.get(xt, yt))
        }
    },
    forNear(func, x, y, range = 1) {
        for (let i = -range; i <= range; i++) {
            for (let j = -range; j <= range; j++) {
                let xt = x + i
                let yt = y + j
                if ((i || j) && xt >= 0 && yt >= 0 && xt <= 49 && yt <= 49)
                    func(xt, yt, this.get(xt, yt))
            }
        }
    },
    forBorder(func, range = 1) {
        for (let y = 0; y < 50; y++) {
            func(0, y, this.get(0, y))
            func(49, y, this.get(49, y))
        }
        for (let x = 1; x < 49; x++) {
            func(x, 0, this.get(x, 0))
            func(x, 49, this.get(x, 49))
        }
    },
    initRoomTerrainWalkAble(roomName) {
        let terrain = angular.element($('section.room')).scope().Room.terrain;
        this.forEach((x, y) => this.set(x, y, 1));
        terrain.forEach(e => this.set(e.x, e.y, e.type === 'swamp'? 2 : this.get(e.x, e.y)));
        terrain.forEach(e => this.set(e.x, e.y, e.type === 'wall'? 0 : this.get(e.x, e.y)));
    }
}
class RoomArray {
    constructor() {
        this.__proto__ = RoomArray_proto
    }
}

let minPlaneCnt = 140;

let visited = new RoomArray()
let roomWalkable = new RoomArray()
let nearWall = new RoomArray()
let routeDistance = new RoomArray()
let roomObjectCache = new RoomArray()

let nearWallWithInterpolation = new RoomArray()
let interpolation = new RoomArray()

let queMin = new PriorityQueue(true)
let queMin2 = new PriorityQueue(true)
let startPoint = new PriorityQueue(true)

let unionFind = new UnionFind(50 * 50);

let objects = []

let pro = {
    init(){
        visited = new RoomArray()
        roomWalkable = new RoomArray()
        nearWall = new RoomArray()
        routeDistance = new RoomArray()

        nearWallWithInterpolation= new RoomArray()
        interpolation = new RoomArray()
        roomObjectCache = new RoomArray()

        queMin = new PriorityQueue(true)
        queMin2 = new PriorityQueue(true)
        startPoint = new PriorityQueue(true)

        unionFind = new UnionFind(50*50);


        visited.init()
        nearWall.init()
        routeDistance.init()
        roomWalkable.init()

        nearWallWithInterpolation.init()
        interpolation.init()
        roomObjectCache.init()
        unionFind.init()

        queMin.clear()
        queMin2.clear()
        startPoint.clear()
    },
    /**
     * 防止内存泄漏！！！！
     */
    dismiss (){
        visited = null
        roomWalkable = null
        nearWall = null
        routeDistance = null
        roomObjectCache = null

        nearWallWithInterpolation= null
        interpolation = null

        queMin = null
        queMin2 = null
        startPoint = null

        unionFind = null
        objects= []
    },
    /**
     * 计算区块的最大性能指标 ，性能消耗的大头！
     * 优化不动了
     */
    getBlockPutAbleCnt (roomWalkable,visited,queMin,unionFind,tarRoot,putAbleCacheMap,AllCacheMap){
        if(putAbleCacheMap[tarRoot])return [putAbleCacheMap[tarRoot],AllCacheMap[tarRoot]]
        let roomManor = routeDistance
        roomManor.init()
        roomManor.forEach((x, y, val)=>{if(tarRoot==unionFind.find(x*50+y)){roomManor.set(x,y,1)}})
        roomManor.forEach((x, y, val)=>{
            if(val){
                let manorCnt = 0
                let wallCnt = 0
                roomManor.for4Direction((x1,y1,val1)=>{
                    if(val1)manorCnt+=1
                    if(!roomWalkable.get(x1,y1))wallCnt+=1
                },x,y)
                if(manorCnt==1&&wallCnt == 0)roomManor.set(x,y,0)
            }
        })
        let dfsMoreManor = function (x,y,val){
            if(!val&&roomWalkable.get(x,y)){
                let manorCnt = 0
                let wallCnt = 0
                roomManor.for4Direction((x1,y1,val1)=>{
                    if(val1)manorCnt+=1
                    if(!roomWalkable.get(x1,y1))wallCnt+=1
                },x,y)
                if(manorCnt>=2||manorCnt==1&&wallCnt>=2){
                    roomManor.set(x,y,1)
                    roomManor.for4Direction((x1,y1,val1)=>{
                        dfsMoreManor(x1,y1,val1)
                    },x,y)
                }
            }
        }
        roomManor.forEach((x, y, val)=>{dfsMoreManor(x,y,val)})
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomManor.forNear((x,y,val)=>{
                    roomManor.set(x,y,0)
                },x,y)
                roomManor.set(x,y,0)
            }
        })

        let innerPutAbleList = []
        let AllCacheList = []

        visited.init()

        roomWalkable.forEach((x, y, val)=>{
            if(!roomManor.get(x,y)) {
                queMin.push(NewNode(val?-4:-1,x,y));
            }
        })

        queMin.whileNoEmpty(nd=>{
            let func = function (x,y,val){
                let item = NewNode(nd.k+2,x,y);
                if(!visited.exec(x,y,1)){
                    queMin.push(NewNode(nd.k+1,x,y))
                    if(roomManor.get(x,y)){
                        if(nd.k+1>=0&&val){
                            innerPutAbleList.push(item)
                        }
                        if(val)
                            AllCacheList.push(item)
                    }
                }
            }
            visited.set(nd.x,nd.y,1)
            if(nd.k>=-1)
                roomWalkable.for4Direction(func,nd.x,nd.y)
            else
                roomWalkable.forNear(func,nd.x,nd.y)
        })

        putAbleCacheMap[tarRoot] = innerPutAbleList
        AllCacheMap[tarRoot] = AllCacheList
        return [putAbleCacheMap[tarRoot],AllCacheMap[tarRoot]]
    },
    /**
     * 插值，计算区块的预处理和合并需求
     * @param roomName
     */
    computeBlock (roomName,blocked){

        roomWalkable.initRoomTerrainWalkAble(roomName)

        //计算距离山体要多远
        roomWalkable.forEach((x,y,val)=>{if(!val){queMin.push(NewNode(0,x,y));visited.set(x,y,1)}})
        queMin.whileNoEmpty(nd=>{
            roomWalkable.for4Direction((x,y,val)=>{
                if(!visited.exec(x,y,1)&&val){
                    queMin.push(NewNode(nd.k+1,x,y))
                }
            },nd.x,nd.y)
            nearWall.exec(nd.x,nd.y,nd.k)
        })

        //距离出口一格不能放墙
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomWalkable.forNear((x,y,val)=>{
                    if(val){
                        nearWall.set(x,y,50);
                        queMin.push(NewNode(0,x,y));
                    }
                },x,y)
                queMin.push(NewNode(0,x,y));
                nearWall.set(x,y,50)
            }
        })

        let roomPutAble = routeDistance
        roomPutAble.initRoomTerrainWalkAble(roomName)
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomWalkable.forNear((x,y,val)=>{
                    if(val){
                        roomPutAble.set(x,y,0)
                    }
                },x,y)
                roomPutAble.set(x,y,0)
            }
        })
        // 计算 控制器，矿物的位置
        let getObjectPos =function(x,y,struct){
            let put = false
            let finalX = 0
            let finalY = 0
            roomPutAble.for4Direction((x,y,val)=>{
                if(val&&!put&&!roomObjectCache.get(x,y)){
                    finalX = x
                    finalY = y
                    put = true
                }
            },x,y)
            roomPutAble.forNear((x,y,val)=>{
                if(val&&!put&&!roomObjectCache.get(x,y)){
                    finalX = x
                    finalY = y
                    put = true
                }
            },x,y)
            roomObjectCache.set(finalX,finalY,struct)
            return [finalX,finalY]
        }
        for(let i=0;i<objects.length;i++){
            let pos = objects[i]
            //container 位置
            let p = getObjectPos(pos.x,pos.y,"container")

            // link 位置
            if(i!=1){
                let linkPos = getObjectPos(p[0],p[1],"link")
                roomObjectCache.link = roomObjectCache.link || []
                roomObjectCache.link.push(linkPos) // link controller 然后是  source
            }else{
                roomObjectCache.extractor = [[pos.x,pos.y]]
            }
            roomObjectCache.container = roomObjectCache.container || []
            if(i!=1)roomObjectCache.container.unshift(p) //如果是 mineral 最后一个
            else roomObjectCache.container.push(p)
        }

        //插值，这里用拉普拉斯矩阵，对nearWall 插值 成 nearWallWithInterpolation
        nearWall.forEach((x,y,val)=>{
            let value = -4*val
            nearWall.for4Direction((x,y,val)=>{
                value += val
            },x,y)
            interpolation.set(x,y,value)
            if(value>0)value=0;
            if(val&&roomWalkable.get(x,y))nearWallWithInterpolation.set(x,y,val+value*0.1)
        })

        if(blocked){
            blocked.forEach((x,y,val)=>{
                if(val)nearWallWithInterpolation.set(x,y,0)
            })
        }


        // 计算距离出口多远
        visited.init()
        routeDistance.init()
        queMin.whileNoEmpty(nd=>{
            roomWalkable.forNear((x,y,val)=>{
                if(!visited.exec(x,y,1)&&val){
                    queMin.push(NewNode(nd.k+1,x,y))
                }
            },nd.x,nd.y)
            routeDistance.set(nd.x,nd.y,nd.k)
        })

        // 对距离的格子插入到队列 ，作为分开的顺序
        routeDistance.forEach((x,y,val)=>{
            if(!roomWalkable.get(x,y))return
            if(val)startPoint.push(NewNode(-val,x,y))
        })


        let sizeMap = {}
        let posSeqMap = {}

        // 分块，将地图分成一小块一小块
        visited.init()
        for(let i=0;i<2500;i++){
            if(startPoint.isEmpty())break;
            let cnt = 0
            let nd = startPoint.pop()
            let currentPos = nd.x*50+nd.y
            if(blocked&&blocked.get(nd.x,nd.y)){
                unionFind.union(currentPos,0)
                continue;
            }
            let posSeq = []

            //搜索分块
            let dfsFindDown = function (roomArray,x,y){
                let currentValue = roomArray.get(x,y)
                if(!visited.exec(x,y,1)){
                    roomArray.for4Direction((x1,y1,val)=>{
                        if(val&&(x1==x||y1==y) &&val<currentValue){
                            dfsFindDown(roomArray,x1,y1)
                        }
                    },x,y)
                    let pos = x*50+y
                    if(unionFind.find(pos)&&unionFind.find(currentPos)&&(!blocked||!blocked.get(x,y))){
                        unionFind.union(currentPos,pos)
                        posSeq.push(pos)
                        cnt++
                    }
                    else if(blocked)unionFind.union(pos,0)
                }
            }

            // 跑到最高点
            let dfsFindUp = function (roomArray,x,y){
                let currentValue = roomArray.get(x,y)
                if(!visited.exec(x,y,1)){
                    roomArray.forNear((x1,y1,val)=>{
                        if(val>currentValue&&currentValue<6){ //加了一点优化，小于时分裂更过
                            dfsFindUp(roomArray,x1,y1)
                        }
                        else if(val&&val<currentValue){
                            dfsFindDown(roomArray,x1,y1)
                        }
                    },x,y)
                    let pos = x*50+y
                    if(unionFind.find(pos)&&unionFind.find(currentPos)&&(!blocked||!blocked.get(x,y))){
                        unionFind.union(currentPos,pos)
                        posSeq.push(pos)
                        cnt++
                    }
                    else if(blocked)unionFind.union(pos,0)
                }
            }
            dfsFindUp(nearWallWithInterpolation,nd.x,nd.y)

            //记录每一块的位置和大小 以 并查集的根节点 作为记录点
            if(cnt>0){
                let pos = unionFind.find(currentPos);
                queMin.push(NewNode(cnt,0,0,pos))
                sizeMap[pos] = cnt
                posSeqMap[pos] = posSeq
            }
        }

        // 将出口附近的块删掉
        roomWalkable.forBorder((x,y,val)=>{
            if(val){
                roomWalkable.forNear((x,y,val)=>{
                    if(val){
                        let pos = unionFind.find(x*50+y);
                        if(sizeMap[pos]) delete sizeMap[pos]
                    }
                },x,y)
                let pos = unionFind.find(x*50+y);
                if(sizeMap[pos]) delete sizeMap[pos]
            }
        })
        delete sizeMap[0]

        let putAbleCacheMap = {}
        let allCacheMap = {}
        // let i = 0
        // 合并小块成大块的
        queMin.whileNoEmpty(nd=>{
            let pos = nd.v;
            if(nd.k != sizeMap[pos])return;// 已经被合并了
            // i++;

            visited.init()
            let nearCntMap={}
            let allNearCnt = 0

            //搜索附近的块
            posSeqMap[pos].forEach(e=>{
                let y = e%50;
                let x = ((e-y)/50);//Math.round
                roomWalkable.forNear((x,y,val)=>{
                    if(val&&!visited.exec(x,y,1)){
                        let currentPos = unionFind.find(x*50+y);
                        if(currentPos == pos)return;
                        allNearCnt+=1
                        let currentSize = sizeMap[currentPos];
                        if(currentSize<300){
                            nearCntMap[currentPos]=(nearCntMap[currentPos]||0)+1;
                        }
                    }
                },x,y)
            })

            let targetPos = undefined;
            let nearCnt = 0;
            let maxRatio = 0;

            // 找出合并附近最优的块
            _.keys(nearCntMap).forEach(currentPos=>{
                let currentRatio = nearCntMap[currentPos]/Math.sqrt(Math.min(sizeMap[currentPos],nd.k))//实际/期望
                if( currentRatio == maxRatio ? sizeMap[currentPos]<sizeMap[targetPos]:currentRatio > maxRatio){
                    targetPos = currentPos;
                    maxRatio = currentRatio;
                    nearCnt = nearCntMap[currentPos];
                }
            })
            _.keys(nearCntMap).forEach(currentPos=>{
                if(nearCnt < nearCntMap[currentPos]){
                    targetPos = currentPos;
                    nearCnt = nearCntMap[currentPos];
                }
            })
            let minSize = sizeMap[targetPos];
            let cnt = nd.k+minSize;

            let targetBlockPutAbleCnt = 0
            let ndkBlockPutAbleCnt = 0
            if(minSize>minPlaneCnt)
                targetBlockPutAbleCnt = pro.getBlockPutAbleCnt(roomWalkable,visited,queMin2,unionFind,targetPos,putAbleCacheMap,allCacheMap)[0].length
            if(nd.k>minPlaneCnt)
                ndkBlockPutAbleCnt = pro.getBlockPutAbleCnt(roomWalkable, visited, queMin2, unionFind, nd.v,putAbleCacheMap,allCacheMap)[0].length

            // 合并
            if(targetPos&&Math.max(targetBlockPutAbleCnt,ndkBlockPutAbleCnt)<minPlaneCnt){//&&(maxRatio-Math.sqrt(cnt)/20>=0||(nearRatio>0.7&&nd.k<100))

                unionFind.union(pos,targetPos);
                nd.v = unionFind.find(pos);

                if(pos != nd.v) delete sizeMap[pos];
                else delete sizeMap[targetPos];

                nd.k = cnt;
                sizeMap[nd.v] = cnt;
                posSeqMap[nd.v] = posSeqMap[targetPos].concat(posSeqMap[pos])
                delete putAbleCacheMap[nd.v]
                delete putAbleCacheMap[targetPos]
                if(pos != nd.v) delete posSeqMap[pos];
                else delete posSeqMap[targetPos];
                queMin.push(NewNode(nd.k,nd.x,nd.y,nd.v));
            }

        })

        return [unionFind,sizeMap,roomWalkable,nearWall,putAbleCacheMap,allCacheMap]

    },
    /**
     * 计算 分布图
     * 计算建筑的位置
     * @param roomName,
     * @param points [flagController,flagMineral,flagSourceA,flagSourceB]
     * @return result { roomName:roomName,storagePos:{x,y},labPos:{x,y},structMap:{ "rampart" : [[x1,y1],[x2,y2] ...] ...} }
     */
    computeManor (roomName,points,blocked){
        pro.init()
        for(let p of points){
            if(p.pos&&p.pos.roomName==roomName)objects.push(p.pos)
        }
        let blockArray = pro.computeBlock(roomName,blocked)
        let unionFind = blockArray[0]
        let sizeMap = blockArray[1]
        let wallMap = {}
        let roomWalkable = blockArray[2]
        let nearWall = blockArray[3]
        let putAbleCacheMap = blockArray[4]
        let allCacheMap = blockArray[5]

        let roomManor = interpolation
        let roomStructs = nearWallWithInterpolation


        roomManor.init()
        roomStructs.init()

        nearWall.init()

        queMin.clear()

        let finalPos = undefined;
        let wallCnt = 1e9;
        let putAbleList = []
        let innerPutAbleList = []

        let centerX = undefined;
        let centerY = undefined;
        _.keys(sizeMap).forEach(pos=>{

            pro.getBlockPutAbleCnt(roomWalkable, visited, queMin, unionFind, pos,putAbleCacheMap,allCacheMap)
            let currentPutAbleList = putAbleCacheMap[pos]
            let allList = allCacheMap[pos]
            if(currentPutAbleList.length<minPlaneCnt)return
            if(Game.flags.storagePos&&!currentPutAbleList.find(e => e.x == Game.flags.storagePos.pos.x && e.y == Game.flags.storagePos.pos.y)) return;

            wallMap[pos] = []

            visited.init()
            roomWalkable.forBorder((x,y,val)=>{if(val){queMin.push(NewNode(0,x,y));visited.set(x,y,1)}})

            let roomManor = routeDistance //当前的Manor
            roomManor.init()
            allList.forEach(e=>{
                roomManor.set(e.x,e.y,1)
            })

            queMin.whileNoEmpty(nd=>{
                if(!roomManor.get(nd.x,nd.y))
                roomWalkable.forNear((x,y,val)=>{
                    if(!visited.exec(x,y,1)&&val){
                        if(!roomManor.get(x,y))
                            queMin.push(NewNode(nd.k+1,x,y))
                        else{
                            wallMap[pos].push(NewNode(0,x,y))
                        }
                    }
                },nd.x,nd.y)
            })

            let currentInnerPutAbleList = currentPutAbleList

            let maxDist = 0;
            let filter2 = currentInnerPutAbleList.filter(e=>e.k>2);
            if (filter2.length < 30) {
                filter2.forEach(a=>{
                    filter2.forEach(b=>{
                        maxDist = Math.max(maxDist,Math.abs(a.x-b.x)+Math.abs(a.y-b.y))
                    })
                })
            }

            let currentWallCnt = wallMap[pos].length;
            if(minPlaneCnt<currentPutAbleList.length&&wallCnt>currentWallCnt&&(currentInnerPutAbleList.filter(e=>e.k>1).length>30||maxDist>5)){
                putAbleList = currentPutAbleList
                innerPutAbleList = currentInnerPutAbleList
                wallCnt = currentWallCnt
                finalPos = pos
                if(Game.flags.storagePos){
                    centerX = Game.flags.storagePos.pos.x
                    centerY = Game.flags.storagePos.pos.y
                }else {
                    centerX = currentPutAbleList.map(e=>e.x).reduce((a,b)=>a+b)/currentPutAbleList.length;
                    centerY = currentPutAbleList.map(e=>e.y).reduce((a,b)=>a+b)/currentPutAbleList.length;
                }
            }
        })

        if(!putAbleCacheMap[finalPos])
            return '布局失败'

        let walls = wallMap[finalPos]


        roomManor.init()
        allCacheMap[finalPos].forEach(e=>{
            roomManor.set(e.x,e.y,-1)
        })
        innerPutAbleList.forEach(e=>{
            roomManor.set(e.x,e.y,e.k)
        })

        let storageX = 0
        let storageY = 0
        let storageDistance = 100

        innerPutAbleList.filter(e=>e.k>2).forEach(e=>{
            let x =e.x
            let y =e.y
            let detX= centerX-x
            let detY= centerY-y
            let distance = Math.sqrt(detX*detX+detY*detY)
            if(storageDistance>distance){
                storageDistance = distance
                storageX = x
                storageY = y
            }
        })


        if(Game.flags.storagePos){
            storageX = Game.flags.storagePos.pos.x;
            storageY = Game.flags.storagePos.pos.y;
        }

        let labX = 0
        let labY = 0
        let labDistance = 1e5

        roomManor.forEach((x,y,val)=>{
            if(val>=2){
                let distance = Math.sqrt(Math.pow(storageX-x-1.5,2)+Math.pow(storageY-y-1.5,2))
                if(labDistance<=distance) return;
                let checkCnt = 0;
                let check=function (x,y){
                    if(roomManor.get(x,y)>0&&Math.abs(x-storageX)+Math.abs(y-storageY)>2){
                        checkCnt+=1;
                    }
                }
                for(let i=0;i<4;i++)
                    for(let j=0;j<4;j++)
                        check(x+i,y+j);
                if(checkCnt==16){
                    labDistance = distance
                    labX = x
                    labY = y
                }
            }
        })
        labX+=1
        labY+=1
        /**
         * 这里开始计算布局！
         * @type {{}}
         */
        let structMap = {}
        _.keys(CONTROLLER_STRUCTURES).forEach(e=>structMap[e] = [])

        // 资源点布局
        structMap["link"] = roomObjectCache.link
        structMap["container"] = roomObjectCache.container
        structMap["extractor"] = roomObjectCache.extractor
        //中心布局
        structMap["storage"] .push([storageX-1,storageY])
        structMap["terminal"] .push([storageX,storageY+1])
        structMap["factory"] .push([storageX+1,storageY])
        structMap["link"] .push([storageX,storageY-1])
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++) {
                structMap["road"].push([storageX+i+j,storageY+i-j]) //仿射变换 [sin,cos,cos,-sin]
            }
        }
        // 这里修改lab布局
        let labs = [
            "☢☢-☢",
            "☢-☢-",
            "-☢-☢",
            "☢-☢☢"
        ]
        let labChangeDirection = false;
        if ((storageX - labX) * (storageY - labY) < 0) {
            labChangeDirection = true
        }

        let vis = {}
        for(let i=0;i<2;i++){
            for(let j=0;j<2;j++){
                vis[i+"_"+j] = 1 // 优先放置中间的label
                let jj = labChangeDirection?j:1-j;
                let structs = labs[i+1].charAt(j+1)
                if(structs == '☢')
                    structMap["lab"].push([labX+i,labY+jj])
                else
                    structMap["road"].push([labX+i,labY+jj])
            }
        }

        for(let i=-1;i<3;i++){
            for(let j=-1;j<3;j++){
                if(vis[i+"_"+j])continue;
                let jj = labChangeDirection?j:1-j;
                let structs = labs[i+1].charAt(j+1)
                if(structs == '☢')
                    structMap["lab"].push([labX+i,labY+jj])
                else
                    structMap["road"].push([labX+i,labY+jj])
            }
        }

        walls.forEach(e=>structMap["rampart"].push([e.x,e.y]))

        _.keys(CONTROLLER_STRUCTURES).forEach(struct=>structMap[struct].forEach(e=>roomStructs.set(e[0],e[1],struct)))

        structMap["road"].forEach(e=>roomStructs.set(e[0],e[1],1))
        //设置权值，bfs联通路径！
        let setModel = function (xx,yy){
            let checkAble = (x,y)=> (x>=0&&y>=0&&x<=49&&y<=49)&&roomManor.get(x,y)>0&&!roomStructs.get(x,y)
            for(let i=-1;i<=1;i++){
                for(let j=-1;j<=1;j++) {
                    let x = xx+i+j
                    let y = yy+i-j
                    if(checkAble(x,y)){
                        if(i||j){
                            roomStructs.set(x,y,1)
                        }else{
                            roomStructs.set(x,y,12)
                        }
                    }
                }
            }
            for(let e of [[1,0],[-1,0],[0,1],[0,-1]]){
                let x=xx+e[0]
                let y=yy+e[1]
                if(checkAble(x,y)){
                    roomStructs.set(x,y,8)
                }
            }
        }

        for(let i=0;i<50;i+=4){
            for(let j=0;j<50;j+=4) {
                let x =storageX%4+i
                let y =storageY%4+j
                setModel(x,y)
                setModel(x+2,y+2)

            }
        }
        visited.init()
        visited.set(storageX,storageY,1)

        queMin.push(NewNode(1,storageX,storageY))
        let costRoad = routeDistance //重复使用
        costRoad.init()
        queMin.whileNoEmpty(nd=>{
            roomStructs.forNear((x,y,val)=>{
                if(!visited.exec(x,y,1)&&val>0){
                    queMin.push(NewNode(nd.k+val,x,y))
                }
            },nd.x,nd.y)
            costRoad.set(nd.x,nd.y,nd.k)
        })

        structMap["road"].forEach(e=>roomStructs.set(e[0],e[1],"road")) //这里把之前的road覆盖上去防止放在之前里road上了

        costRoad.forEach((x,y,val)=>{
            if(!val)return;
            let minVal =50;
            costRoad.forNear((x1,y1,val)=>{
                if(minVal>val&&val>0){
                    minVal = val
                }
            },x,y)
            // 方案2 没那么密集
            costRoad.forNear((x1,y1,val)=>{
                if(minVal==val&&val>0){
                    roomStructs.set(x1,y1,"road")
                }
            },x,y)
        })

        let spawnPos = []
        let extensionPos = []
        roomStructs.forEach((x,y,val)=>{
            if (val > 0) {
                let dist = 100;
                costRoad.forNear((x,y,val)=>{
                    if(val)dist = Math.min(dist,val)
                },x,y)
                if(val==12){// 8 && 12 上面有写，注意！！！
                    spawnPos.push([x,y,dist])
                }
                else{
                    extensionPos.push([x,y,dist])
                }
            }
        })
        let cmpFunc=(a,b)=>a[2]==b[2]?(a[1]==b[1]?a[0]-b[0]:a[1]-b[1]):a[2]-b[2];
        spawnPos = spawnPos.sort(cmpFunc);
        extensionPos = extensionPos.sort(cmpFunc);
        let oriStruct = [];
        let putList=[];
        ["spawn","nuker","powerSpawn","tower", "observer"].forEach(struct=>{
            for(let i=0;i<CONTROLLER_STRUCTURES[struct][8];i++){
                oriStruct.push(struct)
            }
        })
        oriStruct.forEach(struct=>{
            let e = spawnPos.shift()
            if(!e) e = extensionPos.shift()
            structMap[struct].push([e[0],e[1]])
            putList.push([e[0],e[1],struct])
        })
        extensionPos.push(...spawnPos)
        extensionPos = extensionPos.sort(cmpFunc);
        let extCnt= 60
        extensionPos.forEach(e=>{
            if(extCnt>0){
                structMap["extension"].push([e[0],e[1]]);
                putList.push([e[0],e[1],"extension"])
                extCnt-=1;
            }
        })


        // 更新roads
        roomStructs.init()
        _.keys(CONTROLLER_STRUCTURES).forEach(struct=>structMap[struct].forEach(e=>roomStructs.set(e[0],e[1],struct)))
        visited.init()
        structMap["road"].forEach(e=>visited.set(e[0],e[1],1))
        /**
         * 更新最近的roads 但是可能有残缺
         */
        putList.forEach(e=>{
            let x = e[0]
            let y = e[1]
            let minVal =50;
            costRoad.forNear((x1,y1,val)=>{
                if(minVal>val&&val>0){
                    minVal = val
                }
            },x,y)
            // 方案2 没那么密集
            costRoad.forNear((x1,y1,val)=>{
                if(minVal==val&&val>0){
                    // 找到建筑最近的那个road
                    roomStructs.set(x1,y1,"road")
                }
            },x,y)
        })
        /**
         * 再roads的基础上，对rads进行补全，将残缺的连起来
         */
        roomStructs.forEach((x,y,val)=>{
            if(val == 'link'||val == 'container')return; // 资源点的不要 放路
            if(! val instanceof String||val>-1)return; // 附近有建筑 ，并且不是road
            let minVal =50;
            costRoad.forNear((x1,y1,val)=>{
                if(minVal>val&&val>0){
                    minVal = val
                }
            },x,y)
            // 方案2 没那么密集
            costRoad.forNear((x1,y1,val)=>{
                if(minVal==val&&val>0){
                    // 找到建筑最近的那个road
                    if(!visited.exec(x1,y1,1))structMap["road"].push([x1,y1])
                }
            },x,y)
        })
        pro.dismiss()
        return{
            roomName:roomName,
            structMap:structMap
        }

    },

};

window.ManagerPlanner = pro;

let Game = {
    flags: {
        storagePos: null
    }
}










