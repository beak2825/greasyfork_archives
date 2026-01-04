// ==UserScript==
// @name           github snake
// @author         wusuluren
// @description    在github上玩贪吃蛇
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          *://github.com/*
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/371104/github%20snake.user.js
// @updateURL https://update.greasyfork.org/scripts/371104/github%20snake.meta.js
// ==/UserScript==
(function () {
    'use strict';
  
    class Position {
      constructor(x, y) {
        this.x = x
        this.y = y      
      }
    }
  
    class SnakeNode extends Position {
      constructor(x, y, prev, next) {
        super(x, y)
        this.prev = prev
        this.next = next
      }
    }
  
    const CLEAR_COLOR = 0
    const SNAKE_COLOR = 2
    const FOOD_COLOR = 4
    
    var color_table = new Array()
    var snake_head, snake_tail
    var food
    var Screen_Width, Screen_Height
    var map
    
    $(function(){     
        get_color_table()
        full(0)
        init()
        var timer = setInterval(function() {
         if (!move_snake()) {
           clearInterval(timer)
           full(0)
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
    
    function new_position() {
      while(1) {
        var x = Math.floor(Math.random() * Screen_Width)
        var y = Math.floor(Math.random() * Screen_Height)
        if (map[y][x] === undefined || map[y][x] == 0)
          break
      }        
      return new Position(x, y)
    }
  
    function same_position(a, b) {
      return a.x == b.x && a.y == b.y
    }
  
    function init() {
      var gs = document.getElementsByTagName('g')
      Screen_Width = gs.length
      Screen_Height = 7
      
      map = new Array()
      for (var y = 0; y < Screen_Height; y++) {
        map[y] = new Array()
        for (var x = 0; x < Screen_Width; x++)
          map[y][x] = 0
      }
      
      var pos = new_position()
      snake_head = new SnakeNode(pos.x, pos.y, undefined, undefined)
      snake_tail = snake_head
      draw_position(snake_head, SNAKE_COLOR)
      map[pos.y][pos.x] = 1
      
      food = new_position()
      draw_position(food, FOOD_COLOR)
    }
  
    function in_screen(x, y) {
      return (x >= 0 && x < Screen_Width) && (y >= 0 && y < Screen_Height)
    }
  
    function get_safe_x(x) {
      if (x < 0) 
          return Screen_Width - 1
      if (x >= Screen_Width)
          return 0
      return x
    }
  
    function get_safe_y(y) {
      if (y < 0) 
          return Screen_Height - 1
      if (y >= Screen_Height)
          return 0
      return y
    }
  
    function get_next_step() {
      var gap_x = [0, -1, 0, 1]
      var gap_y = [-1, 0, 1, 0]
      var min_score = Infinity
      var min_idx = 0
      for (var i = 0; i < 4; i++) {
        var x = get_safe_x(snake_head.x + gap_x[i])
        var y = get_safe_y(snake_head.y + gap_y[i])
        if (map[y][x] == 0) {
          var score = Math.abs(food.x - x) + Math.abs(food.y - y)
          if (score < min_score) {
            min_score = score
            min_idx = i
          }
        }
      }
      return new Position(get_safe_x(snake_head.x + gap_x[min_idx]), get_safe_y(snake_head.y + gap_y[min_idx]))
    }
   
    function move_snake() {
      var next_step = get_next_step()
      
      if (!judge_game(next_step)) {
        return false
      }
      
      var new_head = new SnakeNode(next_step.x, next_step.y, undefined, snake_head)
      snake_head.prev = new_head
      snake_head = new_head
      var discard_node = snake_tail
      snake_tail = snake_tail.prev
      snake_tail.next = undefined
      
      map[snake_head.y][snake_head.x] = 1
      map[discard_node.y][discard_node.x] = 0
      
      draw_position(discard_node, CLEAR_COLOR)
      draw_position(snake_head, SNAKE_COLOR)
      
      return true
    }
  
    function judge_game(next_step) {
      if (same_position(next_step, food)) {
          var pos = new_position()
          var node = new SnakeNode(pos.x, pos.y, snake_tail, undefined)
          snake_tail.next = node
          snake_tail = node
          map[snake_tail.y][snake_tail.x] = 1
        
          food = new_position()
          draw_position(food, FOOD_COLOR)
          return true
      }
      if (map[next_step.y][next_step.x] == 1) {
        return false
      }
      return true
    }
})();
