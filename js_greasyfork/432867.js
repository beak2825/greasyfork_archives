var AliyunFileIcon = (function () {
  var r = {
      id: "FILEICON_FOLDER_EMPTY",
      desc: "空文件夹",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01rGJZac1Zn37NL70IT_!!6000000003238-2-tps-230-180.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01rGJZac1Zn37NL70IT_!!6000000003238-2-tps-230-180.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png",
    },
    i = {
      id: "FILEICON_IMAGE",
      desc: "图片",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01alwwGK23HODJubkfX_!!6000000007230-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01LJkSQb1rZurCPWBE2_!!6000000005646-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01nTpqfa1r3Oix8W5gQ_!!6000000005575-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01PcuYZj21TdaJV6e3e_!!6000000006986-2-tps-80-80.png",
    },
    o = {
      id: "FILEICON_AUDIO",
      desc: "音频",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01Kpm3PQ1we6XnumP1M_!!6000000006332-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01ZEyUIS1VvVzCGxIRs_!!6000000002715-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN016MMvV325VhpDSUyrK_!!6000000007532-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01XQ8RzR1cG1PrXi281_!!6000000003572-2-tps-80-80.png",
    },
    a = {
      id: "FILEICON_VIDEO",
      desc: "视频",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01YgPBAp1zvunG71HdD_!!6000000006777-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01FkWoEz1Q5EhTaCJfg_!!6000000001924-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01H7FCkb1P6mPJxDEFa_!!6000000001792-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01WxcECx1TRcuS6YYjw_!!6000000002379-2-tps-80-80.png",
    },
    s = {
      id: "FILEICON_ZIP",
      desc: "压缩包",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01AL5gT51gGiSu2jMbx_!!6000000004115-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i3/O1CN01iGK86t1XF2UJeHczd_!!6000000002893-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i4/O1CN01nkRtEq1UWx7RA6wAg_!!6000000002526-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01MyqFyq1zj5iZcv0oT_!!6000000006749-2-tps-80-80.png",
    },
    l = {
      id: "FILEICON_FONT",
      desc: "字体",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01j3qOsy1VQpRK5lmie_!!6000000002648-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01bXREDn1X5QAjAQgwr_!!6000000002872-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN018X1UHQ29FudCDSfDu_!!6000000008039-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01klWdRc1IQkNQyLT9M_!!6000000000888-2-tps-80-80.png",
    },
    c = {
      id: "FILEICON_TXT",
      desc: "纯文本",
      pngM: "https://img.alicdn.com/imgextra/i4/O1CN01dkEowk1XdJT0LKFhj_!!6000000002946-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01WfrXxI1PzHYGt1CQo_!!6000000001911-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01kHskgT2ACzipXL4Ra_!!6000000008168-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01j8F1231zDUOByaBew_!!6000000006680-2-tps-80-80.png",
    },
    u = {
      id: "FILEICON_DOCUMENT",
      desc: "一般文档",
      pngM: "https://img.alicdn.com/imgextra/i4/O1CN013YI7aj1my7hTVmp3q_!!6000000005022-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01m0wSVW1UJfeDkv92d_!!6000000002497-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01lsQ3Re1dD6UgfjcSf_!!6000000003701-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01FoEpps1OSTZFcDBTF_!!6000000001704-2-tps-80-80.png",
    },
    d = {
      id: "FILEICON_APK",
      desc: "Android 安装包",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01jKP2501uqoIovdGz5_!!6000000006089-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01M3lc0T1nOggK16z3u_!!6000000005080-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN01c7Eyle1yNHE5orvXh_!!6000000006566-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01qD7aQR1C1ezGGEGCp_!!6000000000021-2-tps-80-80.png",
    },
    f = {
      id: "FILEICON_MIND",
      desc: "思维导图",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01i8Wy7l27j6e44eg1N_!!6000000007832-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01NoCqHR1KzDPo3qEff_!!6000000001234-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01l5aDOa1wIZvjOK1I7_!!6000000006285-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01yFfWYN2AN4RuujNVS_!!6000000008190-2-tps-80-80.png",
    },
    h = {
      id: "FILEICON_OTHERS",
      desc: "其他文件",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01ROG7du1aV18hZukHC_!!6000000003334-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01NVSzRz25VFRGlsewQ_!!6000000007531-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN01mhaPJ21R0UC8s9oik_!!6000000002049-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01H7fNC91xi3akC6uG0_!!6000000006476-2-tps-80-80.png",
    },
    p = {
      id: "FILEICON_WARNING",
      desc: "被封文件",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01VQMA8P1Z8kGQfempY_!!6000000003150-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01ZhvEQv1pmADYgF2yU_!!6000000005402-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i4/O1CN01uDXcyF1LxfgOy4LWN_!!6000000001366-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01vfTeMI1Ilob1N4p3s_!!6000000000934-2-tps-80-80.png",
    },
    m = {
      id: "FILEICON_WORD",
      desc: "Microsoft Word",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN017vpxdQ27S9zPCPqMD_!!6000000007795-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN017vpxdQ27S9zPCPqMD_!!6000000007795-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01oGX8f91poSBSkdfD1_!!6000000005407-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01oGX8f91poSBSkdfD1_!!6000000005407-2-tps-80-80.png",
    },
    A = {
      id: "FILEICON_EXCEL",
      desc: "Microsoft Excel",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01seltan1FMDbHjtByl_!!6000000000472-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i3/O1CN01seltan1FMDbHjtByl_!!6000000000472-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN018BxLhk1wk3hCR6rY3_!!6000000006345-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN018BxLhk1wk3hCR6rY3_!!6000000006345-2-tps-80-80.png",
    },
    g = {
      id: "FILEICON_POWERPOINT",
      desc: "Microsoft Powerpoint",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01rCYy6x1tYezHtMNq2_!!6000000005914-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01rCYy6x1tYezHtMNq2_!!6000000005914-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01bPvtWS1NtD3XBNxG7_!!6000000001627-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01bPvtWS1NtD3XBNxG7_!!6000000001627-2-tps-80-80.png",
    },
    v = {
      id: "FILEICON_PAGES",
      desc: "Apple Pages",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN019Ed3Cq1cdq00SKcPY_!!6000000003624-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN019Ed3Cq1cdq00SKcPY_!!6000000003624-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01us93tl24p6zP57GTZ_!!6000000007439-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01us93tl24p6zP57GTZ_!!6000000007439-2-tps-80-80.png",
    },
    y = {
      id: "FILEICON_NUMBERS",
      desc: "Apple Numbers",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01jQg56D1zMBtsuwn6U_!!6000000006699-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01jQg56D1zMBtsuwn6U_!!6000000006699-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN010ZIqwC1auCvQsDwUN_!!6000000003389-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN010ZIqwC1auCvQsDwUN_!!6000000003389-2-tps-80-80.png",
    },
    b = {
      id: "FILEICON_KEYNOTE",
      desc: "Apple Keynote",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01obpWj31QWG3V8dpU8_!!6000000001983-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01obpWj31QWG3V8dpU8_!!6000000001983-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01VNSKZy20RW7gu5tlC_!!6000000006846-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01VNSKZy20RW7gu5tlC_!!6000000006846-2-tps-80-80.png",
    },
    C = {
      id: "FILEICON_PDF",
      desc: "Adobe PDF",
      pngM: "https://img.alicdn.com/imgextra/i4/O1CN016J66R728rBF4EJ8Ml_!!6000000007985-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN016J66R728rBF4EJ8Ml_!!6000000007985-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01RFXLvR1z5FFSCtDy9_!!6000000006662-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01RFXLvR1z5FFSCtDy9_!!6000000006662-2-tps-80-80.png",
    },
    x = {
      id: "FILEICON_AI",
      desc: "Adobe Illustrator",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN013QtvOE1TjULSQ7gj9_!!6000000002418-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN013QtvOE1TjULSQ7gj9_!!6000000002418-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01l9PXfI1cZiR01AXlj_!!6000000003615-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01l9PXfI1cZiR01AXlj_!!6000000003615-2-tps-80-80.png",
    },
    w = {
      id: "FILEICON_PS",
      desc: "Adobe Photoshop",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01EWrqHq1y94wkN3kNr_!!6000000006535-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01EWrqHq1y94wkN3kNr_!!6000000006535-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01nswPsr28NPUy4rIbT_!!6000000007920-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01nswPsr28NPUy4rIbT_!!6000000007920-2-tps-80-80.png",
    },
    _ = {
      id: "FILEICON_LR",
      desc: "Adobe Lightroom",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01gDc1vc1fWurTwWVA8_!!6000000004015-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01gDc1vc1fWurTwWVA8_!!6000000004015-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN01oGAXvm1uS4uoc5DOu_!!6000000006035-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01oGAXvm1uS4uoc5DOu_!!6000000006035-2-tps-80-80.png",
    },
    k = {
      id: "FILEICON_AU",
      desc: "Adobe Audition",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01plEWxf1xWbg0XJSNg_!!6000000006451-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01plEWxf1xWbg0XJSNg_!!6000000006451-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01gm9eGC1Pq7cJvtw4k_!!6000000001891-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01gm9eGC1Pq7cJvtw4k_!!6000000001891-2-tps-80-80.png",
    },
    E = {
      id: "FILEICON_PR",
      desc: "Adobe Premiere",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01RMCk011e8M0GvxJDY_!!6000000003826-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01RMCk011e8M0GvxJDY_!!6000000003826-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN01dLnrHb24ZXWVUcxi9_!!6000000007405-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01dLnrHb24ZXWVUcxi9_!!6000000007405-2-tps-80-80.png",
    },
    D = {
      id: "FILEICON_AE",
      desc: "Adobe After Effet",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01W2WiCc1EE907sjOu3_!!6000000000319-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01W2WiCc1EE907sjOu3_!!6000000000319-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01WyGeFl1XQwlvjHlfy_!!6000000002919-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01WyGeFl1XQwlvjHlfy_!!6000000002919-2-tps-80-80.png",
    },
    S = {
      id: "FILEICON_DW",
      desc: "Adobe Dreamweaver",
      pngM: "https://img.alicdn.com/imgextra/i4/O1CN01wKxAmm29gvzyINSCc_!!6000000008098-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01wKxAmm29gvzyINSCc_!!6000000008098-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01Gl3D991P37Ep6HSqE_!!6000000001784-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01Gl3D991P37Ep6HSqE_!!6000000001784-2-tps-80-80.png",
    },
    T = {
      id: "FILEICON_XD",
      desc: "Adobe XD",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01uHPmdu1g23nBU40tG_!!6000000004083-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01uHPmdu1g23nBU40tG_!!6000000004083-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i4/O1CN017jaYPJ1e9jC3IEm0g_!!6000000003829-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i4/O1CN017jaYPJ1e9jC3IEm0g_!!6000000003829-2-tps-80-80.png",
    },
    M = {
      id: "FILEICON_MARKDOWN",
      desc: "Markdown",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN013Vi8M91rnej9zTLrG_!!6000000005676-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN013Vi8M91rnej9zTLrG_!!6000000005676-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN01nD83As1Vau9Z1dZTg_!!6000000002670-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01nD83As1Vau9Z1dZTg_!!6000000002670-2-tps-80-80.png",
    },
    P = {
      id: "FILEICON_XML",
      desc: "XML",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01BC0QML2ABA8hHqCS4_!!6000000008164-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i3/O1CN01BC0QML2ABA8hHqCS4_!!6000000008164-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN01k2T8Ji1tVuc1m5g0L_!!6000000005908-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN01k2T8Ji1tVuc1m5g0L_!!6000000005908-2-tps-80-80.png",
    },
    B = {
      id: "FILEICON_HTML",
      desc: "HTML",
      pngM: "https://img.alicdn.com/imgextra/i4/O1CN01SWxi4l1rNY9SoHzkz_!!6000000005619-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01SWxi4l1rNY9SoHzkz_!!6000000005619-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN012j3pSY1Kl17oTVZTa_!!6000000001203-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN012j3pSY1Kl17oTVZTa_!!6000000001203-2-tps-80-80.png",
    },
    O = {
      id: "FILEICON_CSS",
      desc: "CSS",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01nD0SHV1OJJdHnJM9R_!!6000000001684-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01nD0SHV1OJJdHnJM9R_!!6000000001684-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01voAknR1i1GKvaV1kk_!!6000000004352-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01voAknR1i1GKvaV1kk_!!6000000004352-2-tps-80-80.png",
    },
    I = {
      id: "FILEICON_JS",
      desc: "JavaScript",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN013zMVdx25JnWnWO9cN_!!6000000007506-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN013zMVdx25JnWnWO9cN_!!6000000007506-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i4/O1CN01bHoRs41okxY3ZdYcf_!!6000000005264-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i4/O1CN01bHoRs41okxY3ZdYcf_!!6000000005264-2-tps-80-80.png",
    },
    F = {
      id: "FILEICON_JSON",
      desc: "JSON",
      pngM: "https://img.alicdn.com/imgextra/i4/O1CN01E88OQe1JrbCSYAAZt_!!6000000001082-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i4/O1CN01E88OQe1JrbCSYAAZt_!!6000000001082-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i4/O1CN010YFhZp1s1r0KikhUQ_!!6000000005707-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i4/O1CN010YFhZp1s1r0KikhUQ_!!6000000005707-2-tps-80-80.png",
    },
    R = {
      id: "FILEICON_SKETCH",
      desc: "Sketch",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01dEEOix1sorNvBVXKL_!!6000000005814-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i3/O1CN01dEEOix1sorNvBVXKL_!!6000000005814-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN019ttBRo1g3Qyuc7m9y_!!6000000004086-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN019ttBRo1g3Qyuc7m9y_!!6000000004086-2-tps-80-80.png",
    },
    L = {
      id: "FILEICON_AXURE",
      desc: "Axure",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01sWCc2c1DpPc68GOVz_!!6000000000265-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01sWCc2c1DpPc68GOVz_!!6000000000265-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01hPxvLO1TN2wBUgc6n_!!6000000002369-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01hPxvLO1TN2wBUgc6n_!!6000000002369-2-tps-80-80.png",
    },
    N = {
      id: "FILEICON_THOUGHTS",
      desc: "Thoughts 文档",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN015l7FU91CSgLJXyXCB_!!6000000000080-2-tps-140-140.png",
      pngMDark: "https://img.alicdn.com/imgextra/i3/O1CN015l7FU91CSgLJXyXCB_!!6000000000080-2-tps-140-140.png",
      pngS: "https://img.alicdn.com/imgextra/i3/O1CN01H3AwHn29lyM5aKbVc_!!6000000008109-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i3/O1CN01H3AwHn29lyM5aKbVc_!!6000000008109-2-tps-80-80.png",
    },
    j = {
      id: "FILEICON_KDOC",
      desc: "金山文档",
      pngM: "https://img.alicdn.com/imgextra/i1/O1CN01cQO2f21OWb9rPp5IZ_!!6000000001713-2-tps-128-128.png",
      pngMDark: "https://img.alicdn.com/imgextra/i1/O1CN01cQO2f21OWb9rPp5IZ_!!6000000001713-2-tps-128-128.png",
      pngS: "https://img.alicdn.com/imgextra/i2/O1CN01njmh9w1cjnBh7lZEx_!!6000000003637-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i2/O1CN01njmh9w1cjnBh7lZEx_!!6000000003637-2-tps-80-80.png",
    },
    Z = {
      id: "FILEICON_KPPT",
      desc: "金山PPT",
      pngM: "https://img.alicdn.com/imgextra/i2/O1CN01sVVrwd1ta2DV86Bl4_!!6000000005917-2-tps-128-128.png",
      pngMDark: "https://img.alicdn.com/imgextra/i2/O1CN01sVVrwd1ta2DV86Bl4_!!6000000005917-2-tps-128-128.png",
      pngS: "https://img.alicdn.com/imgextra/i4/O1CN01IyqnMy1CVQlAxPCmC_!!6000000000086-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i4/O1CN01IyqnMy1CVQlAxPCmC_!!6000000000086-2-tps-80-80.png",
    },
    z = {
      id: "FILEICON_KXLS",
      desc: "金山表格",
      pngM: "https://img.alicdn.com/imgextra/i3/O1CN01N0vN6z1vqdoC3Jrzq_!!6000000006224-2-tps-128-128.png",
      pngMDark: "https://img.alicdn.com/imgextra/i3/O1CN01N0vN6z1vqdoC3Jrzq_!!6000000006224-2-tps-128-128.png",
      pngS: "https://img.alicdn.com/imgextra/i1/O1CN012eVewi2AGeverMNtV_!!6000000008176-2-tps-80-80.png",
      pngSDark: "https://img.alicdn.com/imgextra/i1/O1CN012eVewi2AGeverMNtV_!!6000000008176-2-tps-80-80.png",
    };

  var rv = {
      lE: function() {
        return r;
      },
      Ls: function() {
        return i;
      },
      AJ: function() {
        return o;
      },
      zl: function() {
        return a;
      },
      To: function() {
        return s;
      },
      Zo: function() {
        return l;
      },
      oo: function() {
        return c;
      },
      lW: function() {
        return u;
      },
      yQ: function() {
        return d;
      },
      xu: function() {
        return f;
      },
      c_: function() {
        return h;
      },
      yf: function() {
        return p;
      },
      mJ: function() {
        return m;
      },
      sU: function() {
        return A;
      },
      Cd: function() {
        return g;
      },
      EG: function() {
        return v;
      },
      _x: function() {
        return y;
      },
      ml: function() {
        return b;
      },
      qw: function() {
        return C;
      },
      DP: function() {
        return x;
      },
      LP: function() {
        return w;
      },
      tP: function() {
        return _;
      },
      iq: function() {
        return k;
      },
      wB: function() {
        return E;
      },
      ix: function() {
        return D;
      },
      _o: function() {
        return S;
      },
      Yy: function() {
        return T;
      },
      D9: function() {
        return M;
      },
      gz: function() {
        return P;
      },
      bs: function() {
        return B;
      },
      Db: function() {
        return O;
      },
      qc: function() {
        return I;
      },
      I1: function() {
        return F;
      },
      e0: function() {
        return R;
      },
      VZ: function() {
        return L;
      },
      uZ: function() {
        return N;
      },
      Ab: function() {
        return j;
      },
      Ys: function() {
        return Z;
      },
      HS: function() {
        return z;
      }
    },
    i = new Map([
      ["folder", rv.lE],
      ["image", rv.Ls],
      ["audio", rv.AJ],
      ["video", rv.zl],
      ["zip", rv.To],
      ["font", rv.Zo],
      ["text", rv.oo],
      ["document", rv.lW],
      ["apk", rv.yQ],
      ["mind", rv.xu],
      ["others", rv.c_],
      ["warning", rv.yf],
      ["word", rv.mJ],
      ["excel", rv.sU],
      ["powerpoint", rv.Cd],
      ["pages", rv.EG],
      ["numbers", rv._x],
      ["keynote", rv.ml],
      ["pdf", rv.qw],
      ["ai", rv.DP],
      ["ps", rv.LP],
      ["lr", rv.tP],
      ["au", rv.iq],
      ["pr", rv.wB],
      ["ae", rv.ix],
      ["xd", rv.Yy],
      ["dw", rv._o],
      ["markdown", rv.D9],
      ["xml", rv.gz],
      ["html", rv.bs],
      ["css", rv.Db],
      ["js", rv.qc],
      ["json", rv.I1],
      ["sketch", rv.e0],
      ["axure", rv.VZ],
      ["thoughts", rv.uZ],
      ["kppt", rv.Ys],
      ["kdoc", rv.Ab],
      ["kxls", rv.HS],
    ]),
    o = new Map([
      ["aac", "audio"],
      ["3gp", "video"],
      ["aac", "audio"],
      ["ac3", "audio"],
      ["aep", "ae"],
      ["aepx", "ae"],
      ["ai", "ai"],
      ["aiff", "audio"],
      ["amr", "audio"],
      ["ape", "audio"],
      ["apk", "zip"],
      ["asf", "video"],
      ["avi", "video"],
      ["bmp", "image"],
      ["cdr", "image"],
      ["css", "css"],
      ["csv", "excel"],
      ["cur", "image"],
      ["dfont", "font"],
      ["dmg", "zip"],
      ["doc", "word"],
      ["docm", "word"],
      ["docx", "word"],
      ["dot", "word"],
      ["dotm", "word"],
      ["dotx", "word"],
      ["dps", "word"],
      ["dpt", "word"],
      ["dts", "audio"],
      ["dv", "video"],
      ["dxf", "image"],
      ["eot", "font"],
      ["eps", "image"],
      ["et", "excel"],
      ["f4v", "video"],
      ["flac", "audio"],
      ["flv", "video"],
      ["gif", "image"],
      ["heic", "image"],
      ["html", "html"],
      ["ico", "image"],
      ["iso", "zip"],
      ["jpeg", "image"],
      ["jpg", "image"],
      ["js", "js"],
      ["json", "json"],
      ["kdoc", "kdoc"],
      ["kppt", "kppt"],
      ["kxls", "kxls"],
      ["key", "keynote"],
      ["livp", "image"],
      ["less", "css"],
      ["m2ts", "video"],
      ["m4a", "audio"],
      ["m4v", "video"],
      ["md", "markdown"],
      ["mind", "mind"],
      ["mkv", "video"],
      ["mmap", "mind"],
      ["mmat", "mind"],
      ["mov", "video"],
      ["mp2", "audio"],
      ["mp3", "audio"],
      ["mp4", "video"],
      ["mpeg", "video"],
      ["mpg", "video"],
      ["mpga", "video"],
      ["mts", "video"],
      ["numbers", "numbers"],
      ["ogg", "audio"],
      ["otf", "font"],
      ["pages", "pages"],
      ["pdf", "pdf"],
      ["pkg", "zip"],
      ["pmp", "video"],
      ["png", "image"],
      ["potm", "powerpoint"],
      ["potx", "powerpoint"],
      ["pps", "powerpoint"],
      ["ppsm", "powerpoint"],
      ["ppsx", "powerpoint"],
      ["ppt", "powerpoint"],
      ["pptm", "powerpoint"],
      ["pptx", "powerpoint"],
      ["ps", "ps"],
      ["psb", "ps"],
      ["psd", "ps"],
      ["ra", "audio"],
      ["rar", "zip"],
      ["rar4", "zip"],
      ["rar5", "zip"],
      ["raw", "image"],
      ["rm", "video"],
      ["rmvb", "video"],
      ["rp", "axure"],
      ["rplib", "axure"],
      ["rpteam", "axure"],
      ["rpteamlib", "axure"],
      ["rtf", "text"],
      ["sass", "css"],
      ["scss", "css"],
      ["sketch", "sketch"],
      ["styl", "css"],
      ["svg", "image"],
      ["tga", "image"],
      ["tif", "image"],
      ["tiff", "image"],
      ["ts", "video"],
      ["ttf", "font"],
      ["txt", "text"],
      ["vob", "video"],
      ["wav", "audio"],
      ["webm", "video"],
      ["webp", "image"],
      ["wm", "video"],
      ["wma", "audio"],
      ["wmv", "video"],
      ["wmz", "video"],
      ["woff", "font"],
      ["woff2", "font"],
      ["wps", "document"],
      ["wpt", "document"],
      ["xd", "xd"],
      ["xls", "excel"],
      ["xlsm", "excel"],
      ["xlsx", "excel"],
      ["xlt", "excel"],
      ["xltm", "excel"],
      ["xltx", "excel"],
      ["xmind", "mind"],
      ["xml", "xml"],
      ["xmmap", "mind"],
      ["xmmat", "mind"],
      ["zip", "zip"],
    ]);

  return {
    get: function(filename, isFolder=false) {
        if(isFolder === true) {
          return i.get('folder')();
        }
        var ext = (filename || '').toString().trim().toLowerCase().split('.').pop();
        var eo = o.get(ext);
        var ef = i.get(eo ? eo : 'others');
        return ef();
    }
  }
})();