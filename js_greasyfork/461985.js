// ==UserScript==
   // @name         学师通校园安全学习列表
   // @namespace    http://tampermonkey.net/
   // @version      0.0.5
   // @description  学习列表
   // @author       BK
   // @license      MIT
   // ==/UserScript== 
 
   (function () {
       'use strict';
       var KCList = [
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33659&studyPlanLinkId=658121&courseCode=FAJX202224007A&courseId=2340382&courseName=%E5%9D%9A%E6%8C%81%E4%B9%A0%E8%BF%91%E5%B9%B3%E6%B3%95%E6%B2%BB%E6%80%9D%E6%83%B3%E2%80%94%E2%80%94%E6%B7%B1%E5%85%A5%E5%AD%A6%E4%B9%A0%E8%B4%AF%E5%BD%BB%E4%B9%A0%E8%BF%91%E5%B9%B3%E6%80%BB%E4%B9%A6%E8%AE%B0%E5%9C%A8%E4%B8%AD%E5%A4%AE%E5%85%A8%E9%9D%A2%E4%BE%9D%E6%B3%95%E6%B2%BB%E5%9B%BD%E5%B7%A5%E4%BD%9C%E4%BC%9A%E8%AE%AE%E4%B8%8A%E9%87%8D%E8%A6%81%E8%AE%B2%E8%AF%9D%E7%B2%BE%E7%A5%9E",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33659&studyPlanLinkId=658121&courseCode=FAJX202224004A&courseId=2340379&courseName=%E3%80%8A%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E6%9C%AA%E6%88%90%E5%B9%B4%E4%BA%BA%E4%BF%9D%E6%8A%A4%E6%B3%95%E3%80%8B%E8%A7%A3%E8%AF%BB",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33659&studyPlanLinkId=658122&courseCode=BZRGZ202230018A&courseId=2340487&courseName=%E5%A6%82%E4%BD%95%E6%9C%89%E6%95%88%E9%A2%84%E9%98%B2%E5%AD%A6%E7%94%9F%E5%AE%89%E5%85%A8%E4%BA%8B%E6%95%85",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=YJXKB202224003A&courseId=2340417&courseName=%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E6%96%B9%E6%A1%88%E7%9A%84%E6%80%BB%E4%BD%93%E5%8F%98%E5%8C%96",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=YJXKB202224005A&courseId=2340419&courseName=%E5%AE%9E%E6%96%BD%E5%9B%BD%E5%AE%B6%E8%AF%BE%E7%A8%8B%E6%96%B9%E6%A1%88%EF%BC%8C%E5%AD%A6%E6%A0%A1%E6%80%8E%E4%B9%88%E5%81%9A%EF%BC%9F",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=YJXKB202224004A&courseId=2340418&courseName=%E5%9F%BA%E4%BA%8E%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E8%AF%BE%E7%A8%8B%E6%96%B9%E6%A1%88%E7%BB%9F%E7%AD%B9%E4%B8%8B%E7%9A%84%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%E7%9A%84%E6%80%BB%E4%BD%93%E5%8F%98%E5%8C%96",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=YJXKB202224002A&courseId=2340404&courseName=%E6%95%B4%E4%BD%93%E6%8A%8A%E6%8F%A1%E8%AF%BE%E6%A0%87%E4%BF%AE%E8%AE%A2%E6%80%9D%E8%B7%AF%EF%BC%8C%E4%BF%83%E8%BF%9B%E6%A0%B8%E5%BF%83%E7%B4%A0%E5%85%BB%E5%8F%91%E5%B1%95",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=YJXKB202224006A&courseId=2340448&courseName=%E5%9F%BA%E4%BA%8E%E5%86%85%E5%AE%B9%E7%BB%93%E6%9E%84%E5%8C%96%E7%9A%84%E5%8D%95%E5%85%83%E6%95%B4%E4%BD%93%E6%95%99%E5%AD%A6",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=YJXKB202224007A&courseId=2340459&courseName=%E8%B7%A8%E5%AD%A6%E7%A7%91%E4%B8%BB%E9%A2%98%E5%AD%A6%E4%B9%A0%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E5%BC%80%E5%B1%95%EF%BC%9F%E6%98%AF%E4%BB%80%E4%B9%88%E6%A0%B7%E5%AD%90%EF%BC%9F%E6%80%8E%E6%A0%B7%E6%95%99%E5%AD%A6%EF%BC%9F",
           "http://cn202243112.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=33660&studyPlanLinkId=658177&courseCode=XXSY202124047A&courseId=2340353&courseName=%E8%B7%A8%E5%AD%A6%E7%A7%91%E6%95%99%E5%AD%A6%E7%9A%84%E7%90%86%E8%AE%BA%E4%B8%8E%E5%AE%9E%E8%B7%B5"
           ];
       window.KCList = KCList;
   })();