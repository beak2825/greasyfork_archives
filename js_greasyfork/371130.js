// ==UserScript==
// @name           github rainmeter
// @author         wusuluren
// @description    github的雨滴效果
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          *://github.com/*
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/371130/github%20rainmeter.user.js
// @updateURL https://update.greasyfork.org/scripts/371130/github%20rainmeter.meta.js
// ==/UserScript==
(function () {
    'use strict';
  
    class Position {
      constructor(x, y) {
        this.x = x
        this.y = y      
      }
    }
  
    class RainMeter extends Position {
      constructor(x, y, prev, next, expire, depth) {
        super(x, y)
        this.prev = prev
        this.next = next
        this.expire = expire
        this.passed = 0
        this.depth = depth
      }
    }
  
    var color_table = new Array()
    var Screen_Width, Screen_Height
    var map
    var rainmeter_head
    
    $(function(){     
        get_color_table()
        clear_screen()
        init()
        var timer = setInterval(function() {
         update_rainmeter()
        }, 1000)
    })
  
    function clear_screen() {
      full(0)
    }
  
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
  
    function draw_rainmeter(rainmeter) {
      draw_position(rainmeter, rainmeter.depth)
    }
  
    function clear_rainmeter(rainmeter) {
      draw_position(rainmeter, 0)
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
      var x = new_random(Screen_Width)
      var y = new_random(Screen_Height)
      if (map[y][x] === undefined || map[y][x] == 1)
        return undefined
      return new Position(x, y)
    }
  
    function new_random(max) {
      return Math.floor(Math.random() * max)
    }
  
    function same_position(a, b) {
      return a.x == b.x && a.y == b.y
    }
  
    function new_rainmeter() {
      var pos = new_position()
      if (pos === undefined) {
        return undefined
      }
      var expire = new_random(10) + 5
      var depth = new_random(4) + 1
      var rainmeter = new RainMeter(pos.x, pos.y, undefined, undefined, expire, depth)
      return rainmeter
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
      
      rainmeter_head = new_rainmeter()
      draw_rainmeter(rainmeter_head)
      map[rainmeter_head.y][rainmeter_head.x] = 1
    }
   
    function update_rainmeter() {
      var num = new_random(10) + 5
      for (var i = 0; i < num; i++) {
        var rainmeter = new_rainmeter()
        if (rainmeter !== undefined) {
          draw_rainmeter(rainmeter_head)
          map[rainmeter.y][rainmeter.x] = 1

          rainmeter_head.prev = rainmeter
          rainmeter.next = rainmeter_head
          rainmeter_head = rainmeter
        }
      }
      
      rainmeter = rainmeter_head
      while (rainmeter !== undefined) {
        if (rainmeter.passed > rainmeter.expire) {
          clear_rainmeter(rainmeter)
          map[rainmeter.y][rainmeter.x] = 0
          
          if (rainmeter.next !== undefined && rainmeter.next.prev !== undefined)
            rainmeter.next.prev = rainmeter.prev
          if (rainmeter.prev !== undefined && rainmeter.prev.next !== undefined)
            rainmeter.prev.next = rainmeter.next
        }
        rainmeter.passed++
        rainmeter = rainmeter.next
      }
    }
})();
