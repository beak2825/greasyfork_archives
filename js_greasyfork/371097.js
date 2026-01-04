// ==UserScript==
// @name           github fake commits
// @author         wusuluren
// @description    自定义github commit历史
// @require        http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match          *://github.com/*
// @supportURL     https://github.com/Wusuluren
// @version        0.0.1
// @grant          None
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/371097/github%20fake%20commits.user.js
// @updateURL https://update.greasyfork.org/scripts/371097/github%20fake%20commits.meta.js
// ==/UserScript==
(function () {
    'use strict';
  
    var color_table = new Array()
    
    $(function(){
        get_color_table()
        //full(color_table.length-1)
        random()
        //love()
        //the_520()
        //the_666()
        //i_love_u()
    })
  
    function get_color_table () {
      var lis = $('.legend').children()
      for (var i = 0; i < lis.length; i++) {
        color_table[i] = lis[i].style.backgroundColor
      }
    }
    
    function draw_point(x, y, depth) {
        var gs = document.getElementsByTagName('g')
        if (x < gs.length)
        {
          var days = gs[x].getElementsByClassName('day')
          if (y < days.length)
          {
            days[y].setAttribute('fill', color_table[depth])
          }
        }
    }
  
    function draw_rect(start_x, start_y, end_x, end_y, depth) {
      var step_x, step_y
      if (start_x <= end_x) {
        step_x = 1
      } else {
        step_x = -1
      }
      if (start_y <= end_y) {
        step_y = 1
      } else {
        step_y = -1
      }
      for (var x = start_x; x <= end_x; x += step_x) {
        for (var y = start_y; y <= end_y; y += step_y)
          draw_point(x, y, depth)
      }
    }
  
    function draw_line(start_x, start_y, end_x, end_y, depth) {
      var step_x, step_y
      if (start_x < end_x) {
        step_x = 1
      } else if (start_x > end_x) {
        step_x = -1
      } else {
        step_x = 0
      }
      if (start_y < end_y) {
        step_y = 1
      } else if (start_y > end_y) {
        step_y = -1
      } else {
        step_y = 0
      }
      while (start_x !== end_x || start_y !== end_y) {
        draw_point(start_x, start_y, depth)
        if (start_x < end_x)
          start_x += step_x
        if (start_y < end_y)
          start_y += step_y
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
    
   function random() {
      var gs = document.getElementsByTagName('g')
      if (gs === undefined)
        return false
      for (var x = 1; x < gs.length; x++) {        
        for (var y = 0; y < 7; y++)
          draw_point(x, y, Math.floor(Math.random() * color_table.length))
      }
      return true
   }
   
   function love () {
        var gs = document.getElementsByTagName('g')
        if (gs === undefined)
          return false
        full(0)
     
        var depth = color_table.length - 1
        var step = Math.floor((gs.length - 1) / 4)
        
        //L
        draw_line(4, 0, 4, 7, depth)
        draw_line(4, 6, 9, 6, depth)
     
        //O
        draw_line(step+3, 0, step+3+7, 0, depth)
        draw_line(step+3, 6, step+3+7, 6, depth)
        draw_line(step+3, 0, step+3, 7, depth)
        draw_line(step+3+7, 0, step+3+7, 7, depth)
     
        //V
        draw_line(step*2+3, 0, step*2+3, 3, depth)
        draw_line(step*2+3+5, 0, step*2+3+5, 3, depth)
        draw_line(step*2+4, 3, step*2+4, 6, depth)
        draw_line(step*2+4+3, 3, step*2+4+3, 6, depth)
        draw_point(step*2+5, 6, step*2+5, 7, depth)
        draw_point(step*2+6, 6, step*2+6, 7, depth)
     
        //E
        draw_line(step*3+3, 0, step*3+3+7, 0, depth)
        draw_line(step*3+3, 3, step*3+3+7, 3, depth)
        draw_line(step*3+3, 6, step*3+3+7, 6, depth)
        draw_line(step*3+3, 0, step*3+3, 6, depth)
     
        return true
    }
  
   function i_love_u () {
      var gs = document.getElementsByTagName('g')
      if (gs === undefined)
        return false
      full(0)

      var depth = color_table.length - 1
      var step = Math.floor((gs.length - 1) / 6)

      //I
      draw_line(4, 0, 4, 7,depth)

      //L
      draw_line(step+2, 0, step+2, 7, depth)
      draw_line(step+2, 6, step+7, 6, depth)

      //O
      draw_line(step*2+1, 0, step*2+1+5, 0, depth)
      draw_line(step*2+1, 6, step*2+1+5, 6, depth)
      draw_line(step*2+1, 0, step*2+1, 7, depth)
      draw_line(step*2+1+5, 0, step*2+1+5, 7, depth)

      //V
      draw_line(step*3+2, 0, step*3+2, 3, depth)
      draw_line(step*3+2+5, 0, step*3+2+5, 3, depth)
      draw_line(step*3+3, 3, step*3+3, 6, depth)
      draw_line(step*3+3+3, 3, step*3+3+3, 6, depth)
      draw_point(step*3+4, 6, step*3+4, 7, depth)
      draw_point(step*3+5, 6, step*3+5, 7, depth)

      //E
      draw_line(step*4+3, 0, step*4+3+5, 0, depth)
      draw_line(step*4+3, 3, step*4+3+5, 3, depth)
      draw_line(step*4+3, 6, step*4+3+5, 6, depth)
      draw_line(step*4+3, 0, step*4+3, 6, depth)

      //U
      draw_line(step*5+3, 0, step*5+3, 7, depth)
      draw_line(step*5+3, 6, step*5+8, 6, depth)
      draw_line(step*5+7, 0, step*5+7, 7, depth)

      return true
    }
  
   function the_520 () {
      var gs = document.getElementsByTagName('g')
      if (gs === undefined)
        return false
      full(0)

      var depth = color_table.length - 1
      var step = Math.floor((gs.length - 1) / 3)

      //5
      draw_line(5, 0, 5+7, 0, depth)
      draw_line(5, 3, 5+7, 3, depth)
      draw_line(5, 6, 5+7, 6, depth)
      draw_line(5, 0, 5, 3, depth)
      draw_line(5+6, 3, 5+6, 6, depth)

      //2
      draw_line(step+5, 0, step+5+7, 0, depth)
      draw_line(step+5, 3, step+5+7, 3, depth)
      draw_line(step+5, 6, step+5+7, 6, depth)
      draw_line(step+5, 3, step+5, 6, depth)
      draw_line(step+5+6, 0, step+5+6, 3, depth)

      //0
      draw_line(step*2+5, 0, step*2+5+7, 0, depth)
      draw_line(step*2+5, 6, step*2+5+7, 6, depth)
      draw_line(step*2+5, 0, step*2+5, 7, depth)
      draw_line(step*2+5+7, 0, step*2+5+7, 7, depth)

      return true
    }
  
   function the_666 () {
      var gs = document.getElementsByTagName('g')
      if (gs === undefined)
        return false
      full(0)

      var depth = color_table.length - 1
      var step = Math.floor((gs.length - 1) / 3)

      //6
      draw_line(5, 0, 5+7, 0, depth)
      draw_line(5, 3, 5+7, 3, depth)
      draw_line(5, 6, 5+7, 6, depth)
      draw_line(5, 0, 5, 6, depth)
      draw_line(5+6, 3, 5+6, 6, depth)

      //6
      draw_line(step+5, 0, step+5+7, 0, depth)
      draw_line(step+5, 3, step+5+7, 3, depth)
      draw_line(step+5, 6, step+5+7, 6, depth)
      draw_line(step+5, 0, step+5, 6, depth)
      draw_line(step+5+6, 3, step+5+6, 6, depth)

      //6
      draw_line(step*2+5, 0, step*2+5+7, 0, depth)
      draw_line(step*2+5, 3, step*2+5+7, 3, depth)
      draw_line(step*2+5, 6, step*2+5+7, 6, depth)
      draw_line(step*2+5, 0, step*2+5, 6, depth)
      draw_line(step*2+5+6, 3, step*2+5+6, 6, depth)

      return true
   }
})();
