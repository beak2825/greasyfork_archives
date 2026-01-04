// ==UserScript==
// @name           github maze
// @author         wusuluren
// @description    在github上玩迷宫
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          *://github.com/*
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/371136/github%20maze.user.js
// @updateURL https://update.greasyfork.org/scripts/371136/github%20maze.meta.js
// ==/UserScript==
(function () {
    'use strict';
  
    class Position {
      constructor(x, y) {
        this.x = x
        this.y = y      
      }
    }
  
    const CLEAR_COLOR = 0
    const WALL_COLOR = 2
    const PATH_COLOR = 4
    
    var color_table = new Array()
    var Screen_Width, Screen_Height
    var map = new Array()
    var accessed = new Array()
    var unAccessed = new Array()
    var row, column
    var visit_path = new Array()
    var visited = new Array()
    var cur_x, cur_y
    
    $(function(){     
        get_color_table()
        clear_screen()
        init()
        var timer = setInterval(function() {
         move()
         if (cur_x >= Screen_Width - 2) {
           clearInterval(timer)
           clear_screen()
           return
         }
        }, 1000)
    })
  
    function get_color_table () {
      var lis = $('.legend').children()
      for (var i = 0; i < lis.length; i++) {
        color_table[i] = lis[i].style.backgroundColor
      }
    }
    
    function draw_point(x, y, depth) {
        var gs = document.getElementsByTagName('g')
        if (x < gs.length) {
          var days = gs[x].getElementsByClassName('day')
          if (y < days.length) {
            days[y].setAttribute('fill', color_table[depth])
          }
        }
    }
  
    function draw_position(pos, depth) {
        var gs = document.getElementsByTagName('g')
        if (pos.x < gs.length) {       
          var days = gs[pos.x].getElementsByClassName('day')
          if (pos.y < days.length) {
            days[pos.y].setAttribute('fill', color_table[depth])
          }
        }
    }  
    
    function draw_path(x, y) {
        draw_point(x, y, PATH_COLOR)
    }
  
    function clear_path(x, y) {
      draw_point(x, y, CLEAR_COLOR)
    }
  
    function full (depth) {
      var gs = document.getElementsByTagName('g')
      if (gs === undefined)
        return false
      for (var x = 1; x < gs.length; x++) {        
        for (var y = 0; y < 7; y++)
          draw_point(x, y, depth)
      }
      return true
    }
    
    function clear_screen() {
      full(CLEAR_COLOR)
    }
  
    function draw_map() {
      for (var x = 0; x < Screen_Width; x++) {
        for (var y = 0; y < Screen_Height; y++) {
          if (map[y][x] == 1)
            draw_point(x, y, WALL_COLOR)
          else 
            draw_point(x, y, CLEAR_COLOR)
        }
      }
    }
  
    function new_position(x, y) {   
      return new Position(x, y)
    }
  
    function new_random(max) {
      return Math.floor(Math.random() * max)
    }
 
    function init_map() {
      map = new Array()
      row = 3
      column = (Screen_Width - 1) / 2
      for (var y = 0; y < Screen_Height; y++) {
        map[y] = new Array()
        for (var x = 0; x < Screen_Width-1; x++) {
          if (y%2 == 0) {
            map[y][x] = 1
          } else {
            if (x%2 == 1) {
              map[y][x] = 1
            } else {
              map[y][x] = 0
              unAccessed.push(0)
            }
          }
        }
      }
    }
  
    function init_visit_path() {
      visit_path = new Array()
      for (var y = 0; y < Screen_Height; y++) {
        visit_path[y] = new Array()
        for (var x = 0; x < Screen_Width-1; x++) {
          visit_path[y][x] = 0
        }
      }
    }  
 
    // reference: https://www.cnblogs.com/xxhuan/p/6947651.html
    function generate_maze() {
      const offs = [-column, column, -1, 1]
      const offr = [-1, 1, 0, 0]
      const offc = [0, 0, -1, 1]
      
      var count = unAccessed.length
      var cur = new_random(count)
      accessed.push(cur)
      unAccessed[cur] = 1
      
      while (accessed.length < count) {
        var r = Math.floor(cur / column)
        var c = cur % column
        var num = 0
        var off = -1
        
        while (++num < 5) {
          var around = new_random(5)
          var nr = r + offr[around]
          var nc = c + offc[around]
          if ((nr >= 0 && nr < row) && 
              (nc >= 0 && nc < column) &&
              (unAccessed[cur + offs[around]] === 0)) {
            off = around
            break
          }
        }
        
        if (off < 0) {
          cur = accessed[new_random(accessed.length)]
        } else {
          r = 2 * r + 1
          c = 2 * c + 2
          map[r + offr[off]][c + offc[off]] = 0
          cur += offs[off]
          unAccessed[cur] = 1
          accessed.push(cur)
        }
      }
      
      // make entry point
      map[1][1] = 0
      cur_x = 1
      cur_y = 1
    }
  
    function init() {
      var gs = document.getElementsByTagName('g')
      Screen_Width = gs.length - 1
      Screen_Height = 7
      
      init_map()
      generate_maze()
      draw_map()
      draw_path(cur_x, cur_y)
      
      init_visit_path()
    }
  
    function move() {
      const off_x = [0, -1, 0, 1]
      const off_y = [-1, 0, 1, 0]
     
      clear_path(cur_x, cur_y)
      
      for (var i = 0; i < 4; i++) {
        var x = cur_x + off_x[i]
        var y = cur_y + off_y[i]
        if (map[y][x] == 0 && visit_path[y][x] == 0) {
          cur_x = x
          cur_y = y
          visit_path[y][x] = 1
          visited.push(new_position(x, y))
          draw_path(cur_x, cur_y)
          return
        }
      }
      
      if (i >= 4) {
        var last = visited.pop()
        cur_x = last.x
        cur_y = last.y
        draw_path(cur_x, cur_y)
      }
    }
})();
