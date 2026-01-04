// ==UserScript==
// @name         wme-wazevn-traffic-cams-list
// @namespace    asd
// @version      2025.08.20.01
// @description  List of traffic cams in VietNam. To be used with WME WazeVN script.
// @author       tranlong5252
// @license      MIT
// ==/UserScript==

var trafficCamsData = [
    {
        "desc": "Trần Quang Khải - Trần Khắc Chân",
        "lat": 10.7918902432446,
        "lon": 106.691054105759,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b86c41afb9c00172dd31c"
        }
    },
    {
        "desc": "Tô Ngọc Vân - TX25",
        "lat": 10.8797100979598,
        "lon": 106.677986383438,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6065c58576340017d06615"
        }
    },
    {
        "desc": "Quốc Lộ 13 - cầu Ông Dầu",
        "lat": 10.8361932799182,
        "lon": 106.713809967041,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f4df6f998a001b2528eb"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Bùi Thị Xuân",
        "lat": 10.7726452614037,
        "lon": 106.691064834595,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b7ce71afb9c00172dc676"
        }
    },
    {
        "desc": "Nguyễn Thị Định - Đường D",
        "lat": 10.7646823693643,
        "lon": 106.781423091888,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=583f969161cfea0012cf68f7"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Thích Quảng Đức",
        "lat": 10.8032933150268,
        "lon": 106.684530973434,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e8da6f998a001b2524a6"
        }
    },
    {
        "desc": "Võ Văn Kiệt - An Dương Vương 2",
        "lat": 10.7265671915496,
        "lon": 106.620351076126,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481299"
        }
    },
    {
        "desc": "Quốc lộ 1 - Rạch Láng Le 1",
        "lat": 10.8610818827294,
        "lon": 106.686397790909,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dc29c3dcfc400106f2894"
        }
    },
    {
        "desc": "Lũy Bán Bích - Thoại Ngọc Hầu",
        "lat": 10.7821519725547,
        "lon": 106.636122465134,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f1046f998a001b2527db"
        }
    },
    {
        "desc": "Cao tốc LTDG - Võ Chí Công",
        "lat": 10.796827763223,
        "lon": 106.790762543678,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9de4de766c880017188cbb"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - Đỗ Xuân Hợp (1)",
        "lat": 10.8349709243101,
        "lon": 106.765716075897,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f44f6f998a001b2528aa"
        }
    },
    {
        "desc": "Kinh Dương Vương - Tên Lửa",
        "lat": 10.7380517925754,
        "lon": 106.61497592926,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a881a1afb9c00172d2559"
        }
    },
    {
        "desc": "Nguyễn Thái Sơn - Nguyễn Văn Nghi 1",
        "lat": 10.8243119827038,
        "lon": 106.686521172523,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a605f828576340017d06608"
        }
    },
    {
        "desc": "Nguyễn Chí Thanh - Thuận Kiều",
        "lat": 10.7576784340111,
        "lon": 106.658009290695,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4ecb1afb9c00172d8692"
        }
    },
    {
        "desc": "Lý Tự Trọng - Chu Mạnh Trinh",
        "lat": 10.781944,
        "lon": 106.704602,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad15"
        }
    },
    {
        "desc": "Trường Sơn - Ga Quốc Nội 2",
        "lat": 10.8129465937096,
        "lon": 106.664902567863,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b8b2323ca057700116405d0"
        }
    },
    {
        "desc": "Ba Tháng Hai – Sư Vạn Hạnh",
        "lat": 10.7697784337206,
        "lon": 106.670830249786,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7a50bfd3d90017e8f2b2"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Lê Văn Duyệt",
        "lat": 10.8019970541825,
        "lon": 106.696482896805,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ee0ecb807da0011e33d50"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Huỳnh Mẫn Đạt",
        "lat": 10.751960277381,
        "lon": 106.677197813988,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48128f"
        }
    },
    {
        "desc": "Nút giao Mỹ Thủy 2",
        "lat": 10.7701157,
        "lon": 106.7755866,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c4812a2"
        }
    },
    {
        "desc": "Nguyễn Văn Trỗi - Trần Huy Liệu",
        "lat": 10.794472307568,
        "lon": 106.677948832512,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58b571c817139d0010f35d5d"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Phạm Hữu Lầu",
        "lat": 10.7052043577961,
        "lon": 106.737660169601,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63bd1f21bfd3d90017ec3d04"
        }
    },
    {
        "desc": "Phổ Quang - Hoàng Minh Giám",
        "lat": 10.8079619154301,
        "lon": 106.672879457474,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58df4d95dc195800111e04b9"
        }
    },
    {
        "desc": "Quốc lộ 1 - KCX Linh Trung 1",
        "lat": 10.872081942303,
        "lon": 106.768741607666,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e28a0f9fab7001111b0b3"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường Lê Thị Riêng 2",
        "lat": 10.8619248135124,
        "lon": 106.654415130615,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dd8463dcfc400106f28b2"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Huỳnh Văn Bánh",
        "lat": 10.7918902432446,
        "lon": 106.671452522278,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd4ee766c880017188946"
        }
    },
    {
        "desc": "Đinh Tiên Hoàng - Trần Quang Khải",
        "lat": 10.7927439077816,
        "lon": 106.696075201035,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b81721afb9c00172dcc44"
        }
    },
    {
        "desc": "Cầu Phú Mỹ (Q7)",
        "lat": 10.7409610852775,
        "lon": 106.7367374897,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8269c45058170011f6eae4"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Nguyễn Tri Phương 2",
        "lat": 10.7503686605855,
        "lon": 106.670079231262,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481297"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cầu Chữ Y 1",
        "lat": 10.7519444666594,
        "lon": 106.68367266655,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5822adbbedeb6c0012a2d65f"
        }
    },
    {
        "desc": "Điện Biên Phủ - Hai Bà Trưng",
        "lat": 10.7866311946675,
        "lon": 106.693720221519,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad00"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Bà Huyện Thanh Quang",
        "lat": 10.7748059039379,
        "lon": 106.690624952316,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e43e6f998a001b2522cb"
        }
    },
    {
        "desc": "Đinh Tiên Hoàng - Võ Thị Sáu 1",
        "lat": 10.7917743133057,
        "lon": 106.695774793625,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a823e425058170011f6eaa4"
        }
    },
    {
        "desc": "Tôn Đức Thắng - Hàm Nghi",
        "lat": 10.7710748334425,
        "lon": 106.70635342598,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=649da72ca6068200171a6dbb"
        }
    },
    {
        "desc": "Lê Văn Duyệt - Vũ Huy Tấn",
        "lat": 10.7956526724414,
        "lon": 106.696085929871,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65fd8bfd3d90017eaa461"
        }
    },
    {
        "desc": "Cộng Hòa - Tân Kỳ Tân Quý",
        "lat": 10.8041364085074,
        "lon": 106.637651324272,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad08"
        }
    },
    {
        "desc": "Quốc lộ 1 - Ngã 4 Ga",
        "lat": 10.8615244216871,
        "lon": 106.679971218109,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dc70d3dcfc400106f289a"
        }
    },
    {
        "desc": "Điện Biên Phủ - Nguyễn Văn Thương 2",
        "lat": 10.7986878751089,
        "lon": 106.718965172768,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c79e9b807da0011e33d3d"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh - Ngô Tất Tố 2 (Dạ cầu Thủ Thiêm 1)",
        "lat": 10.7891447995017,
        "lon": 106.71642780304,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65ebebfd3d90017eaa3ae"
        }
    },
    {
        "desc": "Cộng Hòa - Út Tịch 2",
        "lat": 10.8001053464053,
        "lon": 106.657757163048,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5874769eb807da0011e33cec"
        }
    },
    {
        "desc": "Cầu Tân Thuận 2 - Q7 (Q7-Q4)",
        "lat": 10.7526506780822,
        "lon": 106.723862886429,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b660f8bfd3d90017eaa4ea"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh - Tôn Đức Thắng",
        "lat": 10.7826315159924,
        "lon": 106.706235408783,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af994abd82540010390c37"
        }
    },
    {
        "desc": "Hoàng Minh Giám - Hồng Hà",
        "lat": 10.8090315732439,
        "lon": 106.674022078514,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8108c062921100c143db"
        }
    },
    {
        "desc": "Hậu Giang -  Hẻm 491",
        "lat": 10.7483923035435,
        "lon": 106.636669635773,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7903bfd3d90017e8f211"
        }
    },
    {
        "desc": "Hoàng Diệu - Đoàn Văn Bơ 2",
        "lat": 10.7635071530486,
        "lon": 106.703719496727,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7727bfd3d90017e8f14a"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Kha Vạn Cân 2",
        "lat": 10.8663923069317,
        "lon": 106.762282848358,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f36e6f998a001b252878"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 5 (Hàng Xanh - Bạch Đằng)",
        "lat": 10.8021551350728,
        "lon": 106.711503267288,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9ddec9766c880017188c9c"
        }
    },
    {
        "desc": "Điện Biên Phủ - Pasteur",
        "lat": 10.7843441648872,
        "lon": 106.691552996635,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad02"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Trường Sơn",
        "lat": 10.7858618271433,
        "lon": 106.6664904356,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae79aabfd3d90017e8f26a"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Đường 20 (hướng đi Sân bay)",
        "lat": 10.8291383225836,
        "lon": 106.722366213799,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd7fb766c880017188954"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Hải Thượng Lãn Ông 1",
        "lat": 10.7499786604875,
        "lon": 106.663234233856,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481293"
        }
    },
    {
        "desc": "Nơ Trang Long - Chu Văn An",
        "lat": 10.8114079914905,
        "lon": 106.695753335953,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b66089bfd3d90017eaa4bd"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Bắc Hải",
        "lat": 10.7869104851311,
        "lon": 106.664623618126,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae798abfd3d90017e8f255"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Trịnh Quang Nghị 2",
        "lat": 10.7024001433989,
        "lon": 106.634652614593,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a89f51afb9c00172d26ef"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Đinh Tiên Hoàng 2",
        "lat": 10.7865626894198,
        "lon": 106.701729297638,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6318287ec9eae60017a19f36"
        }
    },
    {
        "desc": "Cộng Hòa - Út Tịch 1",
        "lat": 10.8010380283306,
        "lon": 106.657853722572,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587476e3b807da0011e33cee"
        }
    },
    {
        "desc": "Cầu Phú Hữu 2",
        "lat": 10.8208924000834,
        "lon": 106.792302131653,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=597bf277faa7ea0011c7c29f"
        }
    },
    {
        "desc": "Cao tốc LTDG - Đỗ Xuân Hợp 2",
        "lat": 10.7961796195486,
        "lon": 106.778848171234,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9de49d766c880017188cb9"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 7 (Hàng Xanh - Cầu Văn Thánh)",
        "lat": 10.8012277259948,
        "lon": 106.712324023247,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9ddf49766c880017188ca0"
        }
    },
    {
        "desc": "Lý Thái Tổ - Nguyễn Đình Chiểu",
        "lat": 10.7662581006404,
        "lon": 106.678780317307,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae763bbfd3d90017e8f0c4"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Kha Vạn Cân (hướng đi Sân bay)",
        "lat": 10.8411932946322,
        "lon": 106.743823885918,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cda6a766c880017188960"
        }
    },
    {
        "desc": "Cách mạng tháng 8 - Sương Nguyệt Anh",
        "lat": 10.7730352321784,
        "lon": 106.690050959587,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b80e81afb9c00172dcbec"
        }
    },
    {
        "desc": "Nút giao Nguyễn Thái Sơn 3 (Phạm Văn Đồng)",
        "lat": 10.8142217306645,
        "lon": 106.679236292839,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df84abc062921100c143e5"
        }
    },
    {
        "desc": "Tùng Thiện Vương - Cao Xuân Dục",
        "lat": 10.7456043005395,
        "lon": 106.65856719017,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a86a11afb9c00172d2410"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Nguyễn Văn Cừ 1",
        "lat": 10.7543213358374,
        "lon": 106.68691277504,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48128b"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Trần Quốc Toản",
        "lat": 10.7863150164711,
        "lon": 106.687223911285,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58e49ff8d9d6200011e0b9d4"
        }
    },
    {
        "desc": "Đinh Tiên Hoàng - Võ Thị Sáu 2",
        "lat": 10.7919218604929,
        "lon": 106.695785522461,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8241105058170011f6eaa6"
        }
    },
    {
        "desc": "Lê Duẩn - Mạc Đĩnh Chi",
        "lat": 10.7832164525575,
        "lon": 106.701187491417,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=65e054fb6b18080018db6632"
        }
    },
    {
        "desc": "Quốc lộ 50 - Cầu Ông Thìn (2)",
        "lat": 10.6484508725221,
        "lon": 106.655831336975,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a825ded5058170011f6ead7"
        }
    },
    {
        "desc": "Trường Chinh - Xuân Hồng",
        "lat": 10.7937134991298,
        "lon": 106.651657819748,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdb0a766c880017188964"
        }
    },
    {
        "desc": "Nguyễn Hữu Thọ - Nguyễn Thị Thập 2",
        "lat": 10.7403707962704,
        "lon": 106.701048016548,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df833ac062921100c143e1"
        }
    },
    {
        "desc": "QL1 - Trạm thu phí AS-AL 2",
        "lat": 10.7947673992211,
        "lon": 106.59654378891,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6082698576340017d06678"
        }
    },
    {
        "desc": "Nút giao Mỹ Thủy (7)",
        "lat": 10.7697468141455,
        "lon": 106.775082349777,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b5503bbfd3d90017ea7ccc"
        }
    },
    {
        "desc": "Võ Trần Chí - Trần Văn Giàu 1",
        "lat": 10.7489509551128,
        "lon": 106.581823825836,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a873b1afb9c00172d2483"
        }
    },
    {
        "desc": "Lý Tự Trọng - Hai Bà Trưng 2",
        "lat": 10.779137682017,
        "lon": 106.702335476875,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5ad0621c98d8fc001102e268"
        }
    },
    {
        "desc": "Quốc lộ 1 - BQB Cầu vượt Quang Trung A (hướng An Sương)",
        "lat": 10.8532003648042,
        "lon": 106.633172035217,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f89323dcfc400106f28ee"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Nguyễn Văn Cừ 2",
        "lat": 10.7536415,
        "lon": 106.6864407,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48128c"
        }
    },
    {
        "desc": "625 Quang Trung",
        "lat": 10.8351289878163,
        "lon": 106.663491725922,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b558c1afb9c00172d8ed2"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - Đỗ Xuân Hợp (2)",
        "lat": 10.8354978023394,
        "lon": 106.765801906586,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f4836f998a001b2528bf"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Hàm Nghi",
        "lat": 10.7709694352995,
        "lon": 106.701128482819,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b85bf1afb9c00172dd149"
        }
    },
    {
        "desc": "Quốc lộ 1 - An Phú Đông 13 (2)",
        "lat": 10.8589376668263,
        "lon": 106.711578369141,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595d98fc3dcfc400106f287b"
        }
    },
    {
        "desc": "Hồng Bàng - Phù Đổng Thiên Vương",
        "lat": 10.7546955197447,
        "lon": 106.662520766258,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b3c274bfd3d90017e9ab93"
        }
    },
    {
        "desc": "Tỉnh lộ 43 - KCX Linh Trung 2",
        "lat": 10.8960825794088,
        "lon": 106.718090772629,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54bcdbfd3d90017ea7a82"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cầu Chà Và 2 (trên cầu)",
        "lat": 10.7489404145267,
        "lon": 106.660348176956,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b5995a3fd4edb0019c7d9ab"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Võ Văn Tần",
        "lat": 10.7805394362678,
        "lon": 106.693907976151,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b81a31afb9c00172dcc65"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lý Thường Kiệt 3",
        "lat": 10.7644610285251,
        "lon": 106.659817099571,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7b3cbfd3d90017e8f34d"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Đinh Tiên Hoàng 1",
        "lat": 10.7866101161314,
        "lon": 106.701568365097,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6318283cc9eae60017a19f0c"
        }
    },
    {
        "desc": "Nút giao Ngã sáu Cộng Hòa",
        "lat": 10.765389,
        "lon": 106.681205,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf6"
        }
    },
    {
        "desc": "Đường hầm - Trạm Thu Phí",
        "lat": 10.7715175052402,
        "lon": 106.717844009399,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56f8e796025e9511002786cf"
        }
    },
    {
        "desc": "Cầu vượt Sóng Thần 2",
        "lat": 10.8743050851613,
        "lon": 106.748507022858,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58746488b807da0011e33cd7"
        }
    },
    {
        "desc": "Hai Bà Trưng - Nguyễn Đình Chiểu",
        "lat": 10.7846919631639,
        "lon": 106.695957183838,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b83381afb9c00172dcf88"
        }
    },
    {
        "desc": "Mai Chí Thọ - Nguyễn Cơ Thạch 1",
        "lat": 10.7732144077704,
        "lon": 106.722586154938,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5822b5ededeb6c0012a2d66a"
        }
    },
    {
        "desc": "Cầu Tân Thuận 2 - Q7 (Q4-Q7)",
        "lat": 10.7527666230832,
        "lon": 106.723691225052,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b660d8bfd3d90017eaa4d5"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lê Đại Hành 1",
        "lat": 10.7621527500863,
        "lon": 106.657199263573,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7be0bfd3d90017e8f3a8"
        }
    },
    {
        "desc": "Lê Văn Việt - Hoàng Hữu Nam",
        "lat": 10.8502078623705,
        "lon": 106.813673973084,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54a04bfd3d90017ea783e"
        }
    },
    {
        "desc": "Cầu Sài Gòn (10)",
        "lat": 10.7985614089434,
        "lon": 106.726276874542,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54f70bfd3d90017ea7c86"
        }
    },
    {
        "desc": "Lê Văn Lương - Cầu Rạch Đĩa",
        "lat": 10.7235786992945,
        "lon": 106.697700619698,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8267fe5058170011f6eae1"
        }
    },
    {
        "desc": "Quốc lộ 1 - An Phú Đông 13 (1)",
        "lat": 10.8589534719139,
        "lon": 106.711691021919,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595d984b3dcfc400106f2879"
        }
    },
    {
        "desc": "Quốc lộ 1 - ĐH Nông Lâm 2",
        "lat": 10.8672299545045,
        "lon": 106.787940859795,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58746122b807da0011e33cc5"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Lê Thánh Tôn",
        "lat": 10.7747057769436,
        "lon": 106.699481606483,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b25a268f13cba001124e713"
        }
    },
    {
        "desc": "11B Nguyễn Bỉnh Khiêm",
        "lat": 10.7857353555811,
        "lon": 106.706600189209,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b7f651afb9c00172dc992"
        }
    },
    {
        "desc": "Khánh Hội - Vĩnh Hội",
        "lat": 10.7560025246799,
        "lon": 106.701278686523,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae768dbfd3d90017e8f0f1"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Trịnh Quang Nghị",
        "lat": 10.7028218314316,
        "lon": 106.633536815643,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a89ae1afb9c00172d26ad"
        }
    },
    {
        "desc": "Lã Xuân Oai - Đường D2",
        "lat": 10.830049838744,
        "lon": 106.804490089417,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54a70bfd3d90017ea7862"
        }
    },
    {
        "desc": "Trường Chinh - Phan Văn Hớn 2 (HM-Q12)",
        "lat": 10.8274733494884,
        "lon": 106.624760627747,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58e49783d9d6200011e0b9ce"
        }
    },
    {
        "desc": "Nút giao Ngã sáu Phù Đổng",
        "lat": 10.771135,
        "lon": 106.693342,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad0c"
        }
    },
    {
        "desc": "Quốc Lộ 22 - Nguyễn Thị Sóc",
        "lat": 10.8616719345273,
        "lon": 106.602745056152,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ef776f998a001b252768"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đinh Đức Thiện 2",
        "lat": 10.6656266937569,
        "lon": 106.570794582367,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d7bbf2c1e33c00112b3216"
        }
    },
    {
        "desc": "Tên Lửa - Đường số 7",
        "lat": 10.7521974381054,
        "lon": 106.610255241394,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b51d21afb9c00172d89bf"
        }
    },
    {
        "desc": "Quốc lộ 1 - Bình Đường",
        "lat": 10.8752217316573,
        "lon": 106.758962273598,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58746295b807da0011e33ccb"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Huỳnh Tấn Phát 2",
        "lat": 10.7525452734972,
        "lon": 106.728331446648,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=585b2baec3f96200127dc508"
        }
    },
    {
        "desc": "BX Miền Đông - Đinh Bộ Lĩnh 2",
        "lat": 10.8144114199963,
        "lon": 106.71005487442,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a606cd08576340017d06628"
        }
    },
    {
        "desc": "Nguyễn Trãi - Nguyễn Cư Trinh",
        "lat": 10.7625269242757,
        "lon": 106.686580181122,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b80051afb9c00172dcaf6"
        }
    },
    {
        "desc": "Cầu Sài Gòn 2 (dạ cầu)",
        "lat": 10.7990303873734,
        "lon": 106.727387309074,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589d0bceb3bf7600110283d6"
        }
    },
    {
        "desc": "Nguyễn Tri Phương - Hùng Vương",
        "lat": 10.7576520833075,
        "lon": 106.669279932976,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd253766c88001718893a"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Phan Xích Long",
        "lat": 10.8020392090947,
        "lon": 106.683232784271,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ee2aeb807da0011e33d52"
        }
    },
    {
        "desc": "Lê Trọng Tấn - Đường Kênh 19/5",
        "lat": 10.8093424582973,
        "lon": 106.615083217621,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5bc31afb9c00172d92e2"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Bùi Thị Xuân",
        "lat": 10.8006480938667,
        "lon": 106.661823391914,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b58401afb9c00172d90f5"
        }
    },
    {
        "desc": "Đường hầm - Ký Con",
        "lat": 10.7646665593097,
        "lon": 106.699186563492,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56f8e708025e9511002786cb"
        }
    },
    {
        "desc": "Cầu vượt Sóng Thần 1",
        "lat": 10.8758064874328,
        "lon": 106.750985383987,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5874644cb807da0011e33cd5"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Ký Con",
        "lat": 10.7692988698081,
        "lon": 106.696676015854,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b867b1afb9c00172dd250"
        }
    },
    {
        "desc": "Cầu Phú Hữu 1",
        "lat": 10.8163926125139,
        "lon": 106.791679859161,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=597bf0b8faa7ea0011c7c293"
        }
    },
    {
        "desc": "Mai Chí Thọ - Tố Hữu (C6)",
        "lat": 10.7713172490313,
        "lon": 106.716717481613,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a10c79f02eb490011a0b0dd"
        }
    },
    {
        "desc": "Lê Duẩn - Phạm Ngọc Thạch",
        "lat": 10.7805078178228,
        "lon": 106.698188781738,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b83ff1afb9c00172dcffb"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Mạc Đĩnh Chi",
        "lat": 10.784426,
        "lon": 106.699659,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad19"
        }
    },
    {
        "desc": "Nguyễn Trãi - Nguyễn Văn Cừ",
        "lat": 10.7596494601112,
        "lon": 106.684375405312,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b6329fdfd4edb0019c7dc0b"
        }
    },
    {
        "desc": "Tô Ký (Tỉnh lộ 15) - Đông Bắc",
        "lat": 10.8556133114939,
        "lon": 106.623339056969,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589add0fb3bf7600110283ae"
        }
    },
    {
        "desc": "Võ Thị Sáu - Hai Bà Trưng",
        "lat": 10.7878590168447,
        "lon": 106.691815853119,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad01"
        }
    },
    {
        "desc": "Cầu Sài Gòn 9 (Bình Thạnh - Thủ Đức)",
        "lat": 10.7985614089434,
        "lon": 106.726319789886,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58abbf72bd82540010390ba4"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Đào Trinh Nhất",
        "lat": 10.865064709737,
        "lon": 106.759042739868,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f1f16f998a001b25281f"
        }
    },
    {
        "desc": "Nút giao Phú Nhuận 1 (Phan Đình Phùng)",
        "lat": 10.7990461956223,
        "lon": 106.680378913879,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58ad6961bd82540010390be5"
        }
    },
    {
        "desc": "QL1 - cầu Bình Thuận",
        "lat": 10.7877852422632,
        "lon": 106.595111489296,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2fa302eb490011a0a3fd"
        }
    },
    {
        "desc": "Hoàng Hữu Nam - Đường D400",
        "lat": 10.8700853140978,
        "lon": 106.814097762108,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8257e25058170011f6eacd"
        }
    },
    {
        "desc": "Điện Biên Phủ - Nguyễn Hữu Cảnh",
        "lat": 10.7978184191454,
        "lon": 106.721127033234,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a606dbc8576340017d0662b"
        }
    },
    {
        "desc": "Lê Đức Thọ - Hẻm 688",
        "lat": 10.846467192202,
        "lon": 106.670604944229,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b52a31afb9c00172d8b01"
        }
    },
    {
        "desc": "Cầu Sài Gòn 5 (dạ cầu Thủ Đức)",
        "lat": 10.7991621227557,
        "lon": 106.729398965836,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58abbee5bd82540010390ba2"
        }
    },
    {
        "desc": "Lê Văn Lương - đường số 15",
        "lat": 10.7449876687987,
        "lon": 106.704325675964,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8ef41afb9c00172d2af2"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - quay đầu An Phú (2)",
        "lat": 10.8022710610062,
        "lon": 106.746608018875,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f5b56f998a001b25292f"
        }
    },
    {
        "desc": "Nút giao Chợ Đệm 2 (CT Trung Lương - Bùi Thanh Khiết)",
        "lat": 10.6860698233787,
        "lon": 106.57566010952,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d7b756c1e33c00112b320d"
        }
    },
    {
        "desc": "Kỳ Đồng - Bà Huyện Thanh Quan",
        "lat": 10.7816671586319,
        "lon": 106.681677103043,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e31e6f998a001b252250"
        }
    },
    {
        "desc": "Lý Chính Thắng - Trương Định",
        "lat": 10.7825155824841,
        "lon": 106.683688759804,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acfe"
        }
    },
    {
        "desc": "Yên Thế - Bạch Đằng",
        "lat": 10.8141637700114,
        "lon": 106.668593287468,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58df4e22dc195800111e04bb"
        }
    },
    {
        "desc": "Quốc lộ 1 - Nguyễn Văn Linh",
        "lat": 10.6901498501196,
        "lon": 106.595363616943,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d7b3e8c1e33c00112b3207"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Lý Chính Thắng",
        "lat": 10.7886020312638,
        "lon": 106.6847884655,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58e49e3dd9d6200011e0b9d1"
        }
    },
    {
        "desc": "Lý Thường Kiệt - Lạc Long Quân",
        "lat": 10.7904463853615,
        "lon": 106.652473211288,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdc57766c88001718896e"
        }
    },
    {
        "desc": "Lê Văn Việt - Man Thiện",
        "lat": 10.8452343413582,
        "lon": 106.786707043648,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5ad0679598d8fc001102e274"
        }
    },
    {
        "desc": "Nút giao Bốn Xã 3 (Lê Văn Quới)",
        "lat": 10.773841521503,
        "lon": 106.621397137642,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824b6c5058170011f6eaab"
        }
    },
    {
        "desc": "Mai Chí Thọ - Đồng Văn Cống 1",
        "lat": 10.7878800952932,
        "lon": 106.749606728554,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58175ac4edeb6c0012a2d5bb"
        }
    },
    {
        "desc": "Âu Cơ - Thoại Ngọc Hầu",
        "lat": 10.7859250629045,
        "lon": 106.641583442688,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f0576f998a001b2527ac"
        }
    },
    {
        "desc": "Quốc Lộ 13 - Đinh Thị Thi 3",
        "lat": 10.8451078948305,
        "lon": 106.71789765358,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=62da3e840637a10017d7073d"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cầu Ông Lãnh 1",
        "lat": 10.7637917349984,
        "lon": 106.697652339935,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481288"
        }
    },
    {
        "desc": "Lê Quang Định - Nơ Trang Long",
        "lat": 10.8081937627675,
        "lon": 106.69519007206,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd614766c88001718894a"
        }
    },
    {
        "desc": "Nguyễn Oanh - Phan Văn Trị (2)",
        "lat": 10.8310719980749,
        "lon": 106.676913499832,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824f975058170011f6eab8"
        }
    },
    {
        "desc": "Nút giao Bốn Xã 1 (Bình Long)",
        "lat": 10.7738836803625,
        "lon": 106.621649265289,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824c3e5058170011f6eaae"
        }
    },
    {
        "desc": "Nút giao Công Trường Dân Chủ",
        "lat": 10.777768,
        "lon": 106.68202,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf9"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh - Ngô Tất Tố (Cầu Thủ Thiêm 1)",
        "lat": 10.7892027649838,
        "lon": 106.715097427368,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587470c2b807da0011e33ce4"
        }
    },
    {
        "desc": "Quốc lộ 1 - Lê Trọng Tấn",
        "lat": 10.8162345391232,
        "lon": 106.60130739212,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=584e734a61cfea0012cf694f"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Nguyễn Du",
        "lat": 10.7767873576075,
        "lon": 106.697995662689,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b7f251afb9c00172dc8bc"
        }
    },
    {
        "desc": "Nguyễn Oanh - Lê Đức Thọ",
        "lat": 10.8419361769392,
        "lon": 106.676613092422,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ec826f998a001b252686"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lý Thường Kiệt",
        "lat": 10.763649,
        "lon": 106.659903,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad23"
        }
    },
    {
        "desc": "Quốc lộ 1 - An Phú Đông 12 (2)",
        "lat": 10.8591062543837,
        "lon": 106.705430746078,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595d9ba43dcfc400106f2880"
        }
    },
    {
        "desc": "Lê Lợi - Pasteur",
        "lat": 10.774816,
        "lon": 106.700909,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad0d"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Lê Quang Định 1",
        "lat": 10.8192748027252,
        "lon": 106.689192652702,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587efb60b807da0011e33d5d"
        }
    },
    {
        "desc": "Tô Ký (Tỉnh lộ 15) - Hẻm 146",
        "lat": 10.8486167661312,
        "lon": 106.633611917496,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589ad89eb3bf7600110283ac"
        }
    },
    {
        "desc": "Trường Chinh - Phan Huy Ích 1",
        "lat": 10.8235795946401,
        "lon": 106.629202365875,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5adc1afb9c00172d925b"
        }
    },
    {
        "desc": "Nguyễn Công Trứ - Calmette 1",
        "lat": 10.7671171078657,
        "lon": 106.699680089951,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5701e22bc4350a1100e26f6c"
        }
    },
    {
        "desc": "Đường hầm (Đầu hầm Tp Thủ Đức)",
        "lat": 10.7710432140034,
        "lon": 106.715902090073,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b87c386ca057700116404a6"
        }
    },
    {
        "desc": "Võ Văn Ngân - Đặng Văn Bi",
        "lat": 10.8511456568495,
        "lon": 106.757980585098,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd542766c880017188948"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Hoàng Hoa Thám",
        "lat": 10.8031773894881,
        "lon": 106.692352294922,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e8406f998a001b252465"
        }
    },
    {
        "desc": "Trường Chinh - Phạm Văn Bạch 2",
        "lat": 10.8134629721378,
        "lon": 106.632796525955,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5875cef0b807da0011e33d14"
        }
    },
    {
        "desc": "Lý Tự Trọng - Hai Bà Trưng 1",
        "lat": 10.7791113331904,
        "lon": 106.702115535736,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a823d555058170011f6eaa2"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường 15 (1)",
        "lat": 10.8601019727034,
        "lon": 106.698827147484,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595da2853dcfc400106f2883"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Trần Quốc Hoàn",
        "lat": 10.8013067666529,
        "lon": 106.662268638611,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c8183b807da0011e33d3f"
        }
    },
    {
        "desc": "Nguyễn Văn Cừ - Trần Hưng Đạo 3",
        "lat": 10.7568773715932,
        "lon": 106.684874296188,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b632950fd4edb0019c7dc07"
        }
    },
    {
        "desc": "Đinh Tiên Hoàng - Nguyễn Đình Chiểu",
        "lat": 10.788566,
        "lon": 106.699558,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad06"
        }
    },
    {
        "desc": "90 Nguyễn Thái Sơn",
        "lat": 10.8160870038835,
        "lon": 106.680099964142,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b54711afb9c00172d8d4f"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Phạm Hùng 2",
        "lat": 10.7275738904052,
        "lon": 106.677889823914,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8279865058170011f6eaef"
        }
    },
    {
        "desc": "Tháp Mười - Phạm Đình Hổ",
        "lat": 10.7497256871815,
        "lon": 106.649479866028,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4faa1afb9c00172d875e"
        }
    },
    {
        "desc": "Võ Trần Chí - Trần Văn Giàu 2",
        "lat": 10.7492250102216,
        "lon": 106.580879688263,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a87641afb9c00172d24b0"
        }
    },
    {
        "desc": "Nút giao Mỹ Thủy 1",
        "lat": 10.769926,
        "lon": 106.7747069,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c4812a1"
        }
    },
    {
        "desc": "Khánh Hội - Cầu Kênh Tẻ",
        "lat": 10.7528720275909,
        "lon": 106.702179908752,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7669bfd3d90017e8f0d9"
        }
    },
    {
        "desc": "Nguyễn Thị Định - Thân Văn Nhiếp",
        "lat": 10.7903304548658,
        "lon": 106.754236221313,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65e6abfd3d90017eaa361"
        }
    },
    {
        "desc": "Nguyễn Lương Bằng - Phạm Hữu Lầu",
        "lat": 10.7045402040992,
        "lon": 106.732370853424,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8fd41afb9c00172d2bac"
        }
    },
    {
        "desc": "Trường Sơn - Phan Đình Giót",
        "lat": 10.8048741133609,
        "lon": 106.664215922356,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56f11afc3ac17b11001c504e"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Huỳnh Tấn Phát 1",
        "lat": 10.7528825680397,
        "lon": 106.728594303131,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=585b2b1ec3f96200127dc505"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Hữu Thọ (3)",
        "lat": 10.7282010989927,
        "lon": 106.700441837311,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a825b7d5058170011f6ead4"
        }
    },
    {
        "desc": "Bạch Đằng - Lê Quang Định",
        "lat": 10.8026188385378,
        "lon": 106.698435544968,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6069238576340017d0661c"
        }
    },
    {
        "desc": "Điện Biên Phủ - Nguyễn Bỉnh Khiêm",
        "lat": 10.7920852162229,
        "lon": 106.699739098549,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b857b1afb9c00172dd106"
        }
    },
    {
        "desc": "Võ Văn Kiệt - An Dương Vương 1",
        "lat": 10.7263616348268,
        "lon": 106.61993265152,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481298"
        }
    },
    {
        "desc": "Cao Thắng – Võ Văn Tần 2",
        "lat": 10.769072262419,
        "lon": 106.683275699615,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae75f9bfd3d90017e8f097"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Cầu Tân Thuận 1",
        "lat": 10.7564346782916,
        "lon": 106.719351410866,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7829bfd3d90017e8f1ac"
        }
    },
    {
        "desc": "Nguyễn Thái Học - Phạm Ngũ Lão",
        "lat": 10.7689774034613,
        "lon": 106.694637537003,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=65e0556b6b18080018db665e"
        }
    },
    {
        "desc": "Trần Hưng Đạo – Nguyễn Biểu 2",
        "lat": 10.7558233388544,
        "lon": 106.683876514435,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae78ccbfd3d90017e8f1f9"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Nguyễn Bỉnh Khiêm 2",
        "lat": 10.7882331590867,
        "lon": 106.703939437866,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b81eb1afb9c00172dcc85"
        }
    },
    {
        "desc": "Quốc lộ 1 - BQB Trước UBND Q12 (hướng đi An Sương)",
        "lat": 10.8619827649163,
        "lon": 106.653299331665,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dd9ac3dcfc400106f28b4"
        }
    },
    {
        "desc": "Xa lộ Hà Nội - Đường D1",
        "lat": 10.8581948267685,
        "lon": 106.787774562836,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54d27bfd3d90017ea7ae5"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Phú Thuận",
        "lat": 10.7307995207108,
        "lon": 106.732006072998,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8cc51afb9c00172d2938"
        }
    },
    {
        "desc": "Võ Chí Công - Đường số 2",
        "lat": 10.7625480044979,
        "lon": 106.767582893372,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587654d3b807da0011e33d36"
        }
    },
    {
        "desc": "Đường hầm (Đầu hầm Tp Thủ Đức)",
        "lat": 10.7705847317646,
        "lon": 106.713402271271,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5990ffdbbec3b90016d2ad2d"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Hữu Thọ (1)",
        "lat": 10.7291234621994,
        "lon": 106.700549125671,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8259035058170011f6eacf"
        }
    },
    {
        "desc": "Hưng Phú - Chánh Hưng 1",
        "lat": 10.7459679545654,
        "lon": 106.668984889984,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744f1fb807da0011e33cbd"
        }
    },
    {
        "desc": "Tỉnh lộ 43 - Chân cầu Gò Dưa",
        "lat": 10.8730512767713,
        "lon": 106.732392311096,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54cffbfd3d90017ea7ad0"
        }
    },
    {
        "desc": "Hà Huy Giáp - Cầu Phú Long 1",
        "lat": 10.8984214318454,
        "lon": 106.693124771118,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b4644b3bf7600110283ce"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Hiệp Bình (hướng đi Sân bay)",
        "lat": 10.8374050930507,
        "lon": 106.732848286629,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd8e2766c880017188958"
        }
    },
    {
        "desc": "Nút giao Mỹ Thủy (5)",
        "lat": 10.7701684082075,
        "lon": 106.775146722794,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54fe4bfd3d90017ea7ca2"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh - Lã Xuân Oai",
        "lat": 10.8055485847835,
        "lon": 106.817160844803,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54938bfd3d90017ea77f6"
        }
    },
    {
        "desc": "Quốc Lộ 1 - Tô Ký",
        "lat": 10.8522309658882,
        "lon": 106.626455783844,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ebd76f998a001b25264d"
        }
    },
    {
        "desc": "QL1-Cty Pouyuen (1)",
        "lat": 10.7485662234825,
        "lon": 106.594237089157,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6086e88576340017d0668a"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh 3 (Hầm chui)",
        "lat": 10.7911261587324,
        "lon": 106.718181967735,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b6c15b8ca0577001163fe39"
        }
    },
    {
        "desc": "Ung Văn Khiêm - Nguyễn Gia Trí (D2)",
        "lat": 10.8075192972885,
        "lon": 106.716395616531,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e2995f9fab7001111b0b5"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Tô Ngọc Vân (hướng đi Bình Dương)",
        "lat": 10.8533952979021,
        "lon": 106.751462817192,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd98d766c88001718895a"
        }
    },
    {
        "desc": "Quang Trung - Phan Huy Ích",
        "lat": 10.8442965283387,
        "lon": 106.640124320984,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ee666f998a001b252726"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Phạm Ngọc Thạch",
        "lat": 10.7817830924671,
        "lon": 106.696933507919,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b84c11afb9c00172dd0b5"
        }
    },
    {
        "desc": "Hương Lộ 2 - Mã Lò",
        "lat": 10.7654465210122,
        "lon": 106.60413980484,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b51201afb9c00172d889a"
        }
    },
    {
        "desc": "Nút giao Thủ Đức (Võ Văn Ngân)",
        "lat": 10.8492753334826,
        "lon": 106.773784160614,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8198c062921100c143dd"
        }
    },
    {
        "desc": "Mai Chí Thọ - Đồng Văn Cống 2",
        "lat": 10.7876851195878,
        "lon": 106.74994468689,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481282"
        }
    },
    {
        "desc": "Thăng Long - Phan Thúc Duyện",
        "lat": 10.8044525679523,
        "lon": 106.660938262939,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58df4c2bdc195800111e04b7"
        }
    },
    {
        "desc": "Quang Trung - Tân Sơn",
        "lat": 10.839438820585,
        "lon": 106.647216081619,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6066608576340017d06617"
        }
    },
    {
        "desc": "Phan Đình Phùng - Nguyễn Trọng Tuyển",
        "lat": 10.7971913554037,
        "lon": 106.681151390076,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ea416f998a001b25260a"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Trần Quang Diệu",
        "lat": 10.7878115903301,
        "lon": 106.677889823914,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b872d1afb9c00172dd36a"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Nguyễn Thượng Hiền",
        "lat": 10.7703792050172,
        "lon": 106.686387062073,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e4b06f998a001b2522f1"
        }
    },
    {
        "desc": "Mai Chí Thọ - Võ Nguyên Giáp (Cát Lái cầu B)",
        "lat": 10.8062546704304,
        "lon": 106.754064559937,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48127e"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường Tô Ngọc Vân 1",
        "lat": 10.8617667641718,
        "lon": 106.671018004417,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dd3a63dcfc400106f28a7"
        }
    },
    {
        "desc": "Trường Sơn - Ga Quốc Nội 1",
        "lat": 10.8128675561166,
        "lon": 106.664929389954,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56f8d743025e9511002786c5"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Quốc lộ 50 (2)",
        "lat": 10.7190774577163,
        "lon": 106.655761599541,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8266105058170011f6eadf"
        }
    },
    {
        "desc": "Trường Chinh - Phan Huy Ích 2",
        "lat": 10.8227260178037,
        "lon": 106.629813909531,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5afe1afb9c00172d9284"
        }
    },
    {
        "desc": "Vĩnh Lộc - Nguyễn Thị Tú 1",
        "lat": 10.8135788937036,
        "lon": 106.579173803329,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a82602c5058170011f6ead9"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Lưu Trọng Lư 2",
        "lat": 10.755127675229,
        "lon": 106.727993488312,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=585b2980c3f96200127dc502"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Nguyễn Thiện Thuật",
        "lat": 10.7664899801327,
        "lon": 106.682481765747,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481284"
        }
    },
    {
        "desc": "Bạch Đằng - Đặng Văn Sâm",
        "lat": 10.8146485314923,
        "lon": 106.671742200851,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b56c51afb9c00172d9071"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lê Hồng Phong 1",
        "lat": 10.7710959130666,
        "lon": 106.673265695572,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7a08bfd3d90017e8f285"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - đường số 1",
        "lat": 10.7232729964823,
        "lon": 106.660873889923,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8b061afb9c00172d27d7"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Nơ Trang Long",
        "lat": 10.8031879281753,
        "lon": 106.694852113724,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ee7d7b807da0011e33d55"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Lê Lợi",
        "lat": 10.7731,
        "lon": 106.70004,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad12"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Hai Bà Trưng",
        "lat": 10.782987,
        "lon": 106.698076,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad17"
        }
    },
    {
        "desc": "Lê Văn Quới - Mã Lò",
        "lat": 10.7763973916927,
        "lon": 106.601006984711,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b51a41afb9c00172d8926"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Lê Văn Linh",
        "lat": 10.7643450880206,
        "lon": 106.707345843315,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7893bfd3d90017e8f1e1"
        }
    },
    {
        "desc": "đường dẫn cao tốc Thành Phố Hồ Chí Minh - Trung Lương - Tân Túc 1",
        "lat": 10.6882837981823,
        "lon": 106.585782766342,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8b9e1afb9c00172d284d"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Nguyễn Thái Học 1",
        "lat": 10.7682501504601,
        "lon": 106.695769429207,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a823ba75058170011f6ea9e"
        }
    },
    {
        "desc": "Trường Chinh - Nguyễn Hồng Đào",
        "lat": 10.7980239271457,
        "lon": 106.6437292099,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5a401afb9c00172d91fc"
        }
    },
    {
        "desc": "Trường Sơn - Ga Quốc Tế",
        "lat": 10.8136315853096,
        "lon": 106.665363907814,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8544c062921100c143e6"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cầu vượt Tân Thới Hiệp 2",
        "lat": 10.8620881310764,
        "lon": 106.649731993675,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595ddb493dcfc400106f28b6"
        }
    },
    {
        "desc": "QL 22 - Giáp Hải",
        "lat": 10.9713380309812,
        "lon": 106.481675505638,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b4379b3bf7600110283c9"
        }
    },
    {
        "desc": "Nguyễn Thái Sơn - Nguyễn Văn Nghi 2",
        "lat": 10.8243172516762,
        "lon": 106.686376333237,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a60604f8576340017d0660b"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Tô Ngọc Vân (hướng đi Sân bay)",
        "lat": 10.8536007677866,
        "lon": 106.751317977905,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd9cb766c88001718895c"
        }
    },
    {
        "desc": "Lý Thái Tổ - Hồ Thị Kỷ",
        "lat": 10.7669642785384,
        "lon": 106.676344871521,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e6b86f998a001b2523b8"
        }
    },
    {
        "desc": "Đinh Bộ Lĩnh - Nguyễn Xí",
        "lat": 10.8133575888573,
        "lon": 106.709566712379,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8256315058170011f6eac9"
        }
    },
    {
        "desc": "Lã Xuân Oai - Cầu Tăng Long (2)",
        "lat": 10.827699912827,
        "lon": 106.805992126465,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5ad064b498d8fc001102e26f"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Điện Biên Phủ 2",
        "lat": 10.7833376554873,
        "lon": 106.690700054169,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af8d68bd82540010390c2e"
        }
    },
    {
        "desc": "Lê Lai - Phan Chu Trinh",
        "lat": 10.7717072215258,
        "lon": 106.697888374329,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=65e0552f6b18080018db6647"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường Vườn Lài 1",
        "lat": 10.8607341730882,
        "lon": 106.691998243332,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595da7783dcfc400106f2888"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - cầu Tân Thuận (1)",
        "lat": 10.7522290595212,
        "lon": 106.724324226379,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8e121afb9c00172d2a3f"
        }
    },
    {
        "desc": "Lê Trọng Tấn - Tây Thạnh",
        "lat": 10.8082464553192,
        "lon": 106.618773937225,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5be91afb9c00172d939b"
        }
    },
    {
        "desc": "Hồng Bàng - Châu Văn Liêm",
        "lat": 10.7548430851016,
        "lon": 106.658910512924,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b728aafca0577001163ff7e"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Tô Hiến Thành",
        "lat": 10.7828791919741,
        "lon": 106.672096252441,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7966bfd3d90017e8f240"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Trần Phú",
        "lat": 10.7525663544172,
        "lon": 106.667847633362,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4efc1afb9c00172d86bc"
        }
    },
    {
        "desc": "QL1-KCN Vĩnh Lộc (2) - Hướng An Lạc",
        "lat": 10.8253815821995,
        "lon": 106.603088378906,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a607fa38576340017d06671"
        }
    },
    {
        "desc": "Trần Quốc Thảo - Kỳ Đồng",
        "lat": 10.7848974801384,
        "lon": 106.683104038239,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b87551afb9c00172dd43a"
        }
    },
    {
        "desc": "Nút giao Ngã sáu Nguyễn Tri Phương",
        "lat": 10.759539,
        "lon": 106.668851,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad21"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cầu Ông Lãnh 2",
        "lat": 10.7639024056841,
        "lon": 106.698285341263,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481289"
        }
    },
    {
        "desc": "Nút giao Phú Nhuận 2 (Phan Đăng Lưu)",
        "lat": 10.7993096663153,
        "lon": 106.680368185043,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58ad69c4bd82540010390be7"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - quay đầu An Phú (1)",
        "lat": 10.8021340576256,
        "lon": 106.745932102203,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f5876f998a001b25291a"
        }
    },
    {
        "desc": "Hai Bà Trưng - Trần Quốc Toản",
        "lat": 10.7899088890498,
        "lon": 106.689380407333,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e2e16f998a001b252233"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh - Bưng Ông Thoàn",
        "lat": 10.7912052020479,
        "lon": 106.796894073486,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54898bfd3d90017ea77ae"
        }
    },
    {
        "desc": "Đỗ Xuân Hợp - Tây Hòa",
        "lat": 10.8244331690453,
        "lon": 106.769192218781,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b549b8bfd3d90017ea782c"
        }
    },
    {
        "desc": "Trường Chinh - Tân Hải",
        "lat": 10.7999419950356,
        "lon": 106.640210151672,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5b271afb9c00172d9296"
        }
    },
    {
        "desc": "Trần Văn Giàu - Nguyễn Cửu Phú",
        "lat": 10.7478547321893,
        "lon": 106.585021018982,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a87df1afb9c00172d2522"
        }
    },
    {
        "desc": "Đường hầm (Đầu hầm Tp Thủ Đức)",
        "lat": 10.7706637804763,
        "lon": 106.714040637016,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56f8e7c9025e9511002786d1"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Nguyễn Thái Học 2",
        "lat": 10.7675334356397,
        "lon": 106.695860624313,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a823bd55058170011f6eaa0"
        }
    },
    {
        "desc": "QL1-Tỉnh lộ 10 (3)",
        "lat": 10.756524271036,
        "lon": 106.591758728027,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6085688576340017d06684"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường Lê Thị Riêng 1",
        "lat": 10.8619248135124,
        "lon": 106.65426492691,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dd7693dcfc400106f28b0"
        }
    },
    {
        "desc": "QL1 - Nút giao An Lạc 1",
        "lat": 10.7240003578389,
        "lon": 106.601028442383,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca329d02eb490011a0a410"
        }
    },
    {
        "desc": "Hoàng Minh Giám - Đăng Văn Sâm",
        "lat": 10.8111972234488,
        "lon": 106.676033735275,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e88c6f998a001b25248b"
        }
    },
    {
        "desc": "Đỗ Xuân Hợp - Dương Đình Hội",
        "lat": 10.8167087590452,
        "lon": 106.774277687073,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54996bfd3d90017ea781a"
        }
    },
    {
        "desc": "Mai Chí Thọ - Trần Não 1",
        "lat": 10.775796632403,
        "lon": 106.72761797905,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481283"
        }
    },
    {
        "desc": "Nút giao Lê Đại Hành 1 (Bình Thới)",
        "lat": 10.7688034952946,
        "lon": 106.651834845543,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdcf0766c880017188972"
        }
    },
    {
        "desc": "Cộng Hòa - Hoàng Hoa Thám",
        "lat": 10.8018284344744,
        "lon": 106.64838552475,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b57ec1afb9c00172d90e3"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Phan Văn Trị 1",
        "lat": 10.8212296179772,
        "lon": 106.693714857101,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af9670bd82540010390c34"
        }
    },
    {
        "desc": "Quốc Lộ 50 - Bùi Minh Trực",
        "lat": 10.7375142028136,
        "lon": 106.656239032745,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b50571afb9c00172d87df"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - Tây Hòa 1",
        "lat": 10.8264933293527,
        "lon": 106.761032938957,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8274c062921100c143df"
        }
    },
    {
        "desc": "Tỉnh lộ 10 - Mã Lò",
        "lat": 10.7581738268099,
        "lon": 106.606982946396,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b52131afb9c00172d8a23"
        }
    },
    {
        "desc": "Quang Trung - Trưng Nữ Vương",
        "lat": 10.8885285926454,
        "lon": 106.596522331238,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6061fd8576340017d06613"
        }
    },
    {
        "desc": "Âu Cơ - Lũy Bán Bích",
        "lat": 10.7957475229889,
        "lon": 106.638236045837,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f0246f998a001b252797"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường Vườn Lài 2",
        "lat": 10.8605550497817,
        "lon": 106.692035794258,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595da7d93dcfc400106f288a"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Kha Vạn Cân 1",
        "lat": 10.8664976715355,
        "lon": 106.761660575867,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f3436f998a001b252863"
        }
    },
    {
        "desc": "Võ Trần Chí - Trần Đại Nghĩa",
        "lat": 10.7302724592873,
        "lon": 106.577425003052,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a896e1afb9c00172d2674"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Trần Trọng Cung",
        "lat": 10.7433433113335,
        "lon": 106.729581356049,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8cfe1afb9c00172d296e"
        }
    },
    {
        "desc": "QL 22 - Nguyễn Ảnh Thủ 2",
        "lat": 10.8554657956616,
        "lon": 106.607159972191,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b39d9b3bf7600110283c1"
        }
    },
    {
        "desc": "Nút giao Cây Gõ 3 (dạ cầu)",
        "lat": 10.75418958083,
        "lon": 106.643235683441,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd326766c88001718893e"
        }
    },
    {
        "desc": "Quốc lộ 1 - KCX Linh Trung 2",
        "lat": 10.8735570152435,
        "lon": 106.765501499176,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587461c1b807da0011e33cc8"
        }
    },
    {
        "desc": "Khánh Hội - Đường số 41",
        "lat": 10.7579524811918,
        "lon": 106.699776649475,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae76afbfd3d90017e8f106"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Cảng SG (Q4-Q7)",
        "lat": 10.7596125693667,
        "lon": 106.713321805,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b661a3bfd3d90017eaa520"
        }
    },
    {
        "desc": "Nguyễn Thị Định - Cổng A Cảng Cát Lái",
        "lat": 10.7599709364081,
        "lon": 106.786578297615,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=583f926761cfea0012cf68f1"
        }
    },
    {
        "desc": "Nút giao Thủ Đức (trên cầu)",
        "lat": 10.8491804998734,
        "lon": 106.774009466171,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df81d8c062921100c143de"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Cống Quỳnh",
        "lat": 10.7684240589462,
        "lon": 106.684364676476,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae73cebfd3d90017e8f00d"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Quản Trọng Linh",
        "lat": 10.6939873445986,
        "lon": 106.610469818115,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8a661afb9c00172d2762"
        }
    },
    {
        "desc": "Thành Thái - cư xá Đồng Tiến",
        "lat": 10.7694200783416,
        "lon": 106.666313409805,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e7526f998a001b252407"
        }
    },
    {
        "desc": "QL1 - Tân Tạo Chợ Đệm 3",
        "lat": 10.7642238774455,
        "lon": 106.590535640717,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6084898576340017d06680"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Hồ Học Lãm 2",
        "lat": 10.721839351587,
        "lon": 106.611467599869,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48129b"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Cầu Ông Lớn 2 làn",
        "lat": 10.7285647739644,
        "lon": 106.69020652771,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587447b4b807da0011e33ca0"
        }
    },
    {
        "desc": "Nguyễn Văn Trỗi - Nguyễn Đình Chính",
        "lat": 10.7955947082032,
        "lon": 106.675336360931,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e2492f9fab7001111b0ab"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Phạm Văn Hai (2)",
        "lat": 10.7892923479795,
        "lon": 106.660181879997,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b571d1afb9c00172d9083"
        }
    },
    {
        "desc": "Trường Chinh - Tây Thạnh 2",
        "lat": 10.8189533898328,
        "lon": 106.628301143646,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587479b1b807da0011e33cf9"
        }
    },
    {
        "desc": "Quốc Lộ 13 - Đinh Thị Thi 2",
        "lat": 10.8456979781692,
        "lon": 106.718176603317,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=62da3e620637a10017d70720"
        }
    },
    {
        "desc": "Nguyễn Văn Cừ - Trần Hưng Đạo 1",
        "lat": 10.7563714363383,
        "lon": 106.685367822647,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0b7aba0e517b00119fd800"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh - Võ Chí Công 2",
        "lat": 10.7909838807122,
        "lon": 106.792902946472,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54909bfd3d90017ea77e4"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cầu vượt Tân Thới Hiệp 3",
        "lat": 10.8618299839181,
        "lon": 106.649796366692,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595ddbbf3dcfc400106f28b8"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - cầu Tân Thuận (2)",
        "lat": 10.752102573838,
        "lon": 106.725064516068,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8ddd1afb9c00172d2a0f"
        }
    },
    {
        "desc": "Cao tốc LTDG - Đỗ Xuân Hợp 1",
        "lat": 10.7965537514336,
        "lon": 106.778896450996,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9de43b766c880017188cb6"
        }
    },
    {
        "desc": "Lê Văn Việt - Đình Phong Phú 1",
        "lat": 10.8445494220268,
        "lon": 106.78128361702,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8250cc5058170011f6eaba"
        }
    },
    {
        "desc": "Quốc lộ 1 - BQB Cầu vượt Quang Trung B (hướng Ngã 4 Ga)",
        "lat": 10.8491120089147,
        "lon": 106.624749898911,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f8f0b3dcfc400106f28f4"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh (Chợ Long Trường)",
        "lat": 10.8067078290005,
        "lon": 106.823662519455,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0b7e1c0e517b00119fd80b"
        }
    },
    {
        "desc": "Lê Hồng Phong - Nguyễn Trãi",
        "lat": 10.7573411448313,
        "lon": 106.678184866905,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd3b7766c880017188942"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Hồ Học Lãm 1",
        "lat": 10.722239929521,
        "lon": 106.610904335976,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48129a"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Cầu Ông Lớn 3 làn",
        "lat": 10.7281220391583,
        "lon": 106.690313816071,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744810b807da0011e33ca2"
        }
    },
    {
        "desc": "Cộng Hòa - Đường A4",
        "lat": 10.8017125083701,
        "lon": 106.649898290634,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b57711afb9c00172d90a7"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh - Đỗ Xuân Hợp",
        "lat": 10.7904358462274,
        "lon": 106.781616210938,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54968bfd3d90017ea7808"
        }
    },
    {
        "desc": "Mai Chí Thọ - Lương Định Của 1",
        "lat": 10.791531914198,
        "lon": 106.751103401184,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48127f"
        }
    },
    {
        "desc": "Yên Thế - Hồng Hà",
        "lat": 10.8133259738659,
        "lon": 106.668566465378,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58df5016dc195800111e04bd"
        }
    },
    {
        "desc": "Trường Chinh - Đồng Đen",
        "lat": 10.7970385413523,
        "lon": 106.645912528038,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdac3766c880017188962"
        }
    },
    {
        "desc": "Nguyễn Văn Trỗi - Huỳnh Văn Bánh",
        "lat": 10.7928914544929,
        "lon": 106.679853200912,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ef5dfb807da0011e33d59"
        }
    },
    {
        "desc": "Quốc lộ 1 - Rạch Láng Le 2",
        "lat": 10.8610924193788,
        "lon": 106.686226129532,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dc2f03dcfc400106f2896"
        }
    },
    {
        "desc": "Nguyễn Thị Nghĩa - Lê Lai",
        "lat": 10.7698416728609,
        "lon": 106.694197654724,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b85f51afb9c00172dd1c2"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Cộng Hòa",
        "lat": 10.8006744408059,
        "lon": 106.660782694817,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdbdc766c88001718896a"
        }
    },
    {
        "desc": "Đường số 1 - Cảng Phước Long",
        "lat": 10.8266672041268,
        "lon": 106.755888462067,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54d5abfd3d90017ea7afe"
        }
    },
    {
        "desc": "Pasteur - Lê Thánh Tôn",
        "lat": 10.775708,
        "lon": 106.700359,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad13"
        }
    },
    {
        "desc": "Hàm Nghi - Phó Đức Chính",
        "lat": 10.7711749616441,
        "lon": 106.699524521828,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b862a1afb9c00172dd1ff"
        }
    },
    {
        "desc": "Điện Biên Phủ - Cách Mạng Tháng Tám",
        "lat": 10.7765712954739,
        "lon": 106.683694124222,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf2"
        }
    },
    {
        "desc": "Quang Trung - Lê Văn Thọ (2)",
        "lat": 10.8366990807787,
        "lon": 106.658325791359,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824e465058170011f6eab4"
        }
    },
    {
        "desc": "Cộng Hòa - Ấp Bắc",
        "lat": 10.8023975256098,
        "lon": 106.641572713852,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b57471afb9c00172d9095"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Nguyễn Tri Phương 1",
        "lat": 10.7503370389747,
        "lon": 106.668738126755,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481291"
        }
    },
    {
        "desc": "Quốc lộ 1 - KCN Vĩnh Lộc 3",
        "lat": 10.8248968380735,
        "lon": 106.603265404701,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=584e71cb61cfea0012cf694b"
        }
    },
    {
        "desc": "Lê Văn Chí - Linh Trung",
        "lat": 10.8589007882855,
        "lon": 106.777850389481,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54c93bfd3d90017ea7ab8"
        }
    },
    {
        "desc": "Quốc lộ 1 - Nguyễn Văn Quá 2",
        "lat": 10.8566669938921,
        "lon": 106.639571785927,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f874d3dcfc400106f28ec"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Tôn Đản",
        "lat": 10.7625638146636,
        "lon": 106.708472371101,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b19d34faf4ff60011d6ea52"
        }
    },
    {
        "desc": "Kha Vạn Cân - Đường Số 2",
        "lat": 10.8418834903115,
        "lon": 106.746854782104,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b3c9bfbfd3d90017e9b039"
        }
    },
    {
        "desc": "Nút giao Ngã bảy Lý Thái Tổ",
        "lat": 10.767465,
        "lon": 106.674156,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf4"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh - Nguyễn Bỉnh Khiêm",
        "lat": 10.7846234574745,
        "lon": 106.707914471626,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af99abbd82540010390c39"
        }
    },
    {
        "desc": "Nguyễn Oanh - Nguyễn Văn Lượng",
        "lat": 10.838553676621,
        "lon": 106.675518751144,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ecc16f998a001b25269e"
        }
    },
    {
        "desc": "Nguyễn Đình Chiểu - Cao Thắng",
        "lat": 10.7700419300508,
        "lon": 106.682138442993,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e3ea6f998a001b2522ae"
        }
    },
    {
        "desc": "Cống Quỳnh - Bùi Viện",
        "lat": 10.7652778808151,
        "lon": 106.690131425858,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b7d0c1afb9c00172dc6a6"
        }
    },
    {
        "desc": "Phạm Văn Chiêu - Đường số 59",
        "lat": 10.8502078623705,
        "lon": 106.652623414993,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b54bb1afb9c00172d8dbb"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Đặng Văn Ngữ",
        "lat": 10.7937556552044,
        "lon": 106.66899561882,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b58bd1afb9c00172d9119"
        }
    },
    {
        "desc": "Quốc lộ 1 - Nguyễn Văn Quá 1",
        "lat": 10.8566248466676,
        "lon": 106.639485955238,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f86c43dcfc400106f28ea"
        }
    },
    {
        "desc": "QL1 - Cầu An Lập",
        "lat": 10.7286174804458,
        "lon": 106.601784825325,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca321b02eb490011a0a40d"
        }
    },
    {
        "desc": "Nguyễn Biểu - Cầu Chữ Y",
        "lat": 10.75113811876,
        "lon": 106.68364584446,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a82439f5058170011f6eaa9"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Đỗ Thị Lời",
        "lat": 10.783880433226,
        "lon": 106.670325994492,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e5d66f998a001b25235a"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Phan Văn Trị 2",
        "lat": 10.8207659432755,
        "lon": 106.69480919838,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d7c20ac1e33c00112b321c"
        }
    },
    {
        "desc": "Cầu Sài Gòn 4 (Thủ Đức 1)",
        "lat": 10.7997417577515,
        "lon": 106.730428934097,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589d0b74b3bf7600110283d4"
        }
    },
    {
        "desc": "Trường Chinh - Âu Cơ",
        "lat": 10.8019180137061,
        "lon": 106.63648724556,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df807bc062921100c143da"
        }
    },
    {
        "desc": "Trần Quang Khải - Trần Nhật Duật",
        "lat": 10.7916478442304,
        "lon": 106.689380407333,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b82a61afb9c00172dcdfd"
        }
    },
    {
        "desc": "Trường Chinh - Phạm Văn Bạch 1",
        "lat": 10.8140847327392,
        "lon": 106.633150577545,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e266ef9fab7001111b0b0"
        }
    },
    {
        "desc": "Tô Hiến Thành – Sư Vạn Hạnh",
        "lat": 10.7778940148849,
        "lon": 106.665540933609,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7a74bfd3d90017e8f2c7"
        }
    },
    {
        "desc": "Xa Lộ Hà Nội - Đường 120",
        "lat": 10.8674828287814,
        "lon": 106.803814172745,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59d3414302eb490011a0a610"
        }
    },
    {
        "desc": "Phan Đình Phùng - Huynh Văn Bánh",
        "lat": 10.7958634513952,
        "lon": 106.681923866272,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e9e96f998a001b2525ce"
        }
    },
    {
        "desc": "Điện Biên Phủ – Cao Thắng",
        "lat": 10.7727295794518,
        "lon": 106.679091453552,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7a9cbfd3d90017e8f303"
        }
    },
    {
        "desc": "QL1-Tỉnh lộ 10 (2)",
        "lat": 10.7563292750288,
        "lon": 106.592434644699,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6085188576340017d06682"
        }
    },
    {
        "desc": "Cao tốc LTDG - Cầu Bà Dạt 2",
        "lat": 10.7936239174516,
        "lon": 106.75617814064,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d8ebd2dc195800111e0429"
        }
    },
    {
        "desc": "Nơ Trang Long - Nguyễn Xí",
        "lat": 10.8200809679719,
        "lon": 106.704116463661,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a606a0f8576340017d0661e"
        }
    },
    {
        "desc": "Mai Chí Thọ - Nguyễn Cơ Thạch 2",
        "lat": 10.7733830435244,
        "lon": 106.722918748856,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481286"
        }
    },
    {
        "desc": "Tân Kỳ Tân Quý - Lê Trọng Tấn",
        "lat": 10.8037570167341,
        "lon": 106.632571220398,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f14b6f998a001b2527f0"
        }
    },
    {
        "desc": "Hậu Giang - Minh Phụng",
        "lat": 10.7497836602495,
        "lon": 106.642361283302,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4f411afb9c00172d86fc"
        }
    },
    {
        "desc": "Lê Thánh Tôn - Đồng Khởi",
        "lat": 10.7771984022141,
        "lon": 106.701825857162,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b843d1afb9c00172dd02d"
        }
    },
    {
        "desc": "Quốc lộ 1 - An Phú Đông 12 (1)",
        "lat": 10.8592853785591,
        "lon": 106.70542538166,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595d9b3b3dcfc400106f287e"
        }
    },
    {
        "desc": "Cộng Hòa - Thăng Long",
        "lat": 10.8009484488364,
        "lon": 106.660755872726,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58df50ffdc195800111e04c0"
        }
    },
    {
        "desc": "Bà Hom - An Dương Vương",
        "lat": 10.7559709036596,
        "lon": 106.624610424042,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b50e51afb9c00172d886a"
        }
    },
    {
        "desc": "Pasteur - Lê Duẩn",
        "lat": 10.779127,
        "lon": 106.697417,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad1a"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Lý Tự Trọng",
        "lat": 10.775615,
        "lon": 106.699042,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad0b"
        }
    },
    {
        "desc": "QL1-Trạm Biến Áp 500Kv Phú Lâm",
        "lat": 10.7414565055181,
        "lon": 106.598871946335,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6087858576340017d0668e"
        }
    },
    {
        "desc": "Lê Hồng Phong - Trần Phú",
        "lat": 10.7604188946108,
        "lon": 106.677095890045,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4e581afb9c00172d862f"
        }
    },
    {
        "desc": "Cầu vượt nút giao thông Gò Dưa",
        "lat": 10.8699588780888,
        "lon": 106.733132600784,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587464e2b807da0011e33cd9"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cao tốc Trung Lương",
        "lat": 10.689411864849,
        "lon": 106.592531204224,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58afdbaebd82540010390c48"
        }
    },
    {
        "desc": "Đường số 1 - Nguyễn Văn Bá",
        "lat": 10.8266882798502,
        "lon": 106.760228276253,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54c51bfd3d90017ea7aa0"
        }
    },
    {
        "desc": "Cộng Hòa - Hoàng Hoa Thám",
        "lat": 10.8013120360293,
        "lon": 106.647366285324,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58ad6214bd82540010390be2"
        }
    },
    {
        "desc": "Trường Chinh - Hoàng Hoa Thám",
        "lat": 10.7964536316791,
        "lon": 106.647017598152,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad09"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Võ Thị Sáu",
        "lat": 10.784533873088,
        "lon": 106.688543558121,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af8a0bbd82540010390c25"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Cảng Sài Gòn",
        "lat": 10.7581316657523,
        "lon": 106.715644598007,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0b74280e517b00119fd7f9"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cầu Chữ Y 2",
        "lat": 10.7514332528817,
        "lon": 106.684101819992,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48128e"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Lê Quang Định 2",
        "lat": 10.8200546227367,
        "lon": 106.689868569374,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ef859b807da0011e33d5b"
        }
    },
    {
        "desc": "Dương Bá Trạc - Hẻm 219",
        "lat": 10.7469851294422,
        "lon": 106.689042448998,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744e97b807da0011e33cb9"
        }
    },
    {
        "desc": "Lã Xuân Oai - Lò Lu",
        "lat": 10.8243804793376,
        "lon": 106.808009147644,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54a48bfd3d90017ea7850"
        }
    },
    {
        "desc": "Phan Văn Hớn -> An Sương",
        "lat": 10.8393755961029,
        "lon": 106.611757278442,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59c8adf202eb490011a0a352"
        }
    },
    {
        "desc": "Quốc Lộ 50 - Cầu Nhị Thiên Đường 2",
        "lat": 10.7418073259385,
        "lon": 106.656062516536,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58c2717ed56e930010a39ac0"
        }
    },
    {
        "desc": "Quốc lộ 1 - Nguyễn Hữu Trí 2",
        "lat": 10.6965544326304,
        "lon": 106.596699357033,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58afcd9bbd82540010390c41"
        }
    },
    {
        "desc": "Nguyễn Xiển - Nguyễn Văn Tăng",
        "lat": 10.8428107736029,
        "lon": 106.828694343567,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54a9ebfd3d90017ea7911"
        }
    },
    {
        "desc": "Lê Văn Lương - Cầu Long Kiểng (HCM)",
        "lat": 10.6895647333739,
        "lon": 106.702550053597,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5bbc7163ca0577001164127f"
        }
    },
    {
        "desc": "Quốc Lộ 1K - đường số 8",
        "lat": 10.8822808688795,
        "lon": 106.769835948944,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f3d66f998a001b252890"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Nguyễn Biểu",
        "lat": 10.7561079280569,
        "lon": 106.683527827263,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b6005b6fd4edb0019c7db25"
        }
    },
    {
        "desc": "Quốc Lộ 1 - Hưng Nhơn",
        "lat": 10.7114030554397,
        "lon": 106.59907579422,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a902a1afb9c00172d2bed"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Pasteur",
        "lat": 10.7687191761474,
        "lon": 106.703091859818,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b85481afb9c00172dd0f1"
        }
    },
    {
        "desc": "Phan Văn Hớn - Trần Văn Mười",
        "lat": 10.8498285289366,
        "lon": 106.587703227997,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ef2b6f998a001b252753"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Quốc Lộ 1",
        "lat": 10.7170534584198,
        "lon": 106.600942611694,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48129c"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Hoàng Văn Thụ",
        "lat": 10.7999683420367,
        "lon": 106.660519838333,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c8661b807da0011e33d43"
        }
    },
    {
        "desc": "Nguyễn Tri Phương - Trần Hưng Đạo",
        "lat": 10.7524240581789,
        "lon": 106.669510602951,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b632a79fd4edb0019c7dc0f"
        }
    },
    {
        "desc": "Trần Văn Giàu - Tỉnh Lộ 10",
        "lat": 10.7617258747396,
        "lon": 106.569678783417,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a87a41afb9c00172d24e9"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường Tô Ngọc Vân 2",
        "lat": 10.8619616916798,
        "lon": 106.671023368835,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dd4133dcfc400106f28a9"
        }
    },
    {
        "desc": "Lã Xuân Oai - Cầu Tăng Long (1)",
        "lat": 10.82640375746,
        "lon": 106.806828975677,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5ad0644698d8fc001102e26b"
        }
    },
    {
        "desc": "Bình Long - Lê Thúc Hoạch",
        "lat": 10.7884439432433,
        "lon": 106.617207527161,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5b8c1afb9c00172d92ca"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Đường 20 (hướng đi Thủ Đức)",
        "lat": 10.8289275670072,
        "lon": 106.722747087479,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd7bb766c880017188952"
        }
    },
    {
        "desc": "Trần Quốc Hoàn - Phan Thúc Duyện",
        "lat": 10.8026451853041,
        "lon": 106.663454174995,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df857fc062921100c143e7"
        }
    },
    {
        "desc": "Tôn Đức Thắng - Lê Duẩn",
        "lat": 10.7852927046947,
        "lon": 106.703263521194,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af9a07bd82540010390c3b"
        }
    },
    {
        "desc": "Cao Thắng – Võ Văn Tần 1",
        "lat": 10.7685031082248,
        "lon": 106.683892607689,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae75debfd3d90017e8f082"
        }
    },
    {
        "desc": "Hà Huy Giáp - An Lộc",
        "lat": 10.8536955999934,
        "lon": 106.679220199585,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623eb466f998a001b252632"
        }
    },
    {
        "desc": "Quang Trung - Lê Văn Thọ (1)",
        "lat": 10.8366042431825,
        "lon": 106.658180952072,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824dc05058170011f6eab2"
        }
    },
    {
        "desc": "Nguyễn Tri Phương - Nguyễn Trãi",
        "lat": 10.7547007899372,
        "lon": 106.669499874115,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd49f766c880017188944"
        }
    },
    {
        "desc": "Lê Duẩn - Nguyễn Bỉnh Khiêm",
        "lat": 10.7873373247725,
        "lon": 106.704819202423,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b836d1afb9c00172dcfa0"
        }
    },
    {
        "desc": "Quốc lộ 13 - Hiệp Bình",
        "lat": 10.8495545656016,
        "lon": 106.718916893005,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a606c078576340017d06624"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lý Thái Tổ",
        "lat": 10.768198,
        "lon": 106.668459,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf3"
        }
    },
    {
        "desc": "Xô Viết Nghệ Tĩnh - Nguyễn Xí 1",
        "lat": 10.809674419948,
        "lon": 106.712254285812,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8254b05058170011f6eac3"
        }
    },
    {
        "desc": "An Dương Vương - Đường số 7",
        "lat": 10.7517441974476,
        "lon": 106.624084711075,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b50c11afb9c00172d8843"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Cầu Tân Thuận 2",
        "lat": 10.757040746338,
        "lon": 106.717768907547,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae77bfbfd3d90017e8f18f"
        }
    },
    {
        "desc": "Quốc Lộ 13 - Nguyễn Thị Nhung",
        "lat": 10.8403450366927,
        "lon": 106.716363430023,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f51a6f998a001b252900"
        }
    },
    {
        "desc": "Hoàng Diệu - Cầu Ông Lãnh",
        "lat": 10.761236,
        "lon": 106.700404,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad1b"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Xuân Diệu",
        "lat": 10.795418,
        "lon": 106.655729,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad0a"
        }
    },
    {
        "desc": "Dương Bá Trạc - Hẻm 288",
        "lat": 10.7444131987789,
        "lon": 106.688919067383,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744e3eb807da0011e33cb7"
        }
    },
    {
        "desc": "Quốc lộ 50 - Tạ Quang Bửu",
        "lat": 10.7341621509602,
        "lon": 106.656190752983,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744dd9b807da0011e33cb5"
        }
    },
    {
        "desc": "Nút giao Nguyễn Thái Sơn 2 (Nguyễn Kiệm)",
        "lat": 10.8143956125566,
        "lon": 106.678592562675,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8416c062921100c143e4"
        }
    },
    {
        "desc": "Võ Văn Kiệt - An Bình",
        "lat": 10.7493356862526,
        "lon": 106.673292517662,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481290"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Điện Biên Phủ 1",
        "lat": 10.7832744191822,
        "lon": 106.69091463089,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af8b69bd82540010390c28"
        }
    },
    {
        "desc": "Lý Chính Thắng - Trần Quốc Thảo",
        "lat": 10.7843863222755,
        "lon": 106.684466600418,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e3a26f998a001b252291"
        }
    },
    {
        "desc": "QL 22 - Nguyễn Văn Bứa 1",
        "lat": 10.8837348196645,
        "lon": 106.587172150612,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b3ceeb3bf7600110283c3"
        }
    },
    {
        "desc": "Quốc lộ 1 - BQB Trước bến xe Ngã 4 Ga (hướng đi Bình Phước)",
        "lat": 10.861629788009,
        "lon": 106.678490638733,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dcab53dcfc400106f289d"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Nguyễn Văn Đậu",
        "lat": 10.8038413260585,
        "lon": 106.687197089195,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58ad7291bd82540010390bf9"
        }
    },
    {
        "desc": "Quốc Lộ 1 - Dương Đình Cúc",
        "lat": 10.705952846726,
        "lon": 106.597981452942,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a89211afb9c00172d2636"
        }
    },
    {
        "desc": "Điện Biên Phủ - Đinh Tiên Hoàng",
        "lat": 10.790705,
        "lon": 106.697491,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad05"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cầu Bến Cát 1",
        "lat": 10.8616403246391,
        "lon": 106.663309335709,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dd4f43dcfc400106f28ab"
        }
    },
    {
        "desc": "Nguyễn Du - Công xã Paris",
        "lat": 10.7790322866967,
        "lon": 106.700012683868,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b84771afb9c00172dd076"
        }
    },
    {
        "desc": "Hòa Bình - Lũy Bán Bích",
        "lat": 10.7704213643614,
        "lon": 106.631401777267,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f0b46f998a001b2527c3"
        }
    },
    {
        "desc": "QL1-Phan Văn Hớn (H.Hoc Mon)",
        "lat": 10.8344440453534,
        "lon": 106.606779098511,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a607f078576340017d0666f"
        }
    },
    {
        "desc": "Nguyễn Oanh - Phan Văn Trị (1)",
        "lat": 10.8306083386046,
        "lon": 106.67790055275,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824ee15058170011f6eab6"
        }
    },
    {
        "desc": "Nguyễn Thái Sơn - Phạm Ngũ Lão",
        "lat": 10.820344420197,
        "lon": 106.683468818665,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ed396f998a001b2526b8"
        }
    },
    {
        "desc": "Hồng Bàng - Ngô Quyền 1",
        "lat": 10.7557179353779,
        "lon": 106.666420698166,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b632b60fd4edb0019c7dc12"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Nguyễn Văn Trỗi 2",
        "lat": 10.8001000770077,
        "lon": 106.669188737869,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c8d97b807da0011e33d49"
        }
    },
    {
        "desc": "Cộng Hòa - Bình Giã",
        "lat": 10.8018653200436,
        "lon": 106.645107865334,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59414c883dcfc400106f260b"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - Tây Hòa 2",
        "lat": 10.8264933293527,
        "lon": 106.760866641998,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df82d4c062921100c143e0"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Quốc Lộ 13 (1)",
        "lat": 10.8262720340397,
        "lon": 106.714013814926,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58affc6017139d0010f35cc8"
        }
    },
    {
        "desc": "Quốc lộ 1 - Lê Thị Hoa",
        "lat": 10.8747792130109,
        "lon": 106.748399734497,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587463bab807da0011e33cd3"
        }
    },
    {
        "desc": "Hoàng Diệu - Nguyễn Tất Thành",
        "lat": 10.7652936908376,
        "lon": 106.707260012627,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad1c"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Ký Con",
        "lat": 10.7654781410386,
        "lon": 106.700146794319,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481287"
        }
    },
    {
        "desc": "Tân Kỳ Tân Quý - Tân Quý",
        "lat": 10.7994361321658,
        "lon": 106.619310379028,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5c981afb9c00172d94c0"
        }
    },
    {
        "desc": "Nguyễn Hữu Thọ - Phạm Hữu Lầu",
        "lat": 10.6954843759884,
        "lon": 106.718187332153,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a861e1afb9c00172d23ad"
        }
    },
    {
        "desc": "Trường Chinh - Nguyễn Thái Bình",
        "lat": 10.7946620093783,
        "lon": 106.650145053864,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5a9c1afb9c00172d9240"
        }
    },
    {
        "desc": "Trần Văn Giàu - Đường Thanh Niên",
        "lat": 10.7893819309486,
        "lon": 106.514554023743,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a88a01afb9c00172d25d1"
        }
    },
    {
        "desc": "Hồng Bàng - Tạ Uyên",
        "lat": 10.7537258027461,
        "lon": 106.653825044632,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4e201afb9c00172d85f9"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Út Tịch",
        "lat": 10.7980555437486,
        "lon": 106.658374071121,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdb4b766c880017188966"
        }
    },
    {
        "desc": "Xa Lộ Hà Nội - Đường D13",
        "lat": 10.8790147216882,
        "lon": 106.812987327576,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58b57a6c17139d0010f35d65"
        }
    },
    {
        "desc": "Nơ Trang Long - Phan Văn Trị",
        "lat": 10.8112288386645,
        "lon": 106.695485115051,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b66051bfd3d90017eaa4a3"
        }
    },
    {
        "desc": "Quốc Lộ 13 - Đinh Thị Thi 1",
        "lat": 10.8444440496827,
        "lon": 106.718230247498,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=62da3e390637a10017d706ff"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Nguyễn Thị Minh Khai",
        "lat": 10.773652,
        "lon": 106.689579,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad10"
        }
    },
    {
        "desc": "Nguyễn Văn Trỗi - Hoàng Văn Thụ 1",
        "lat": 10.7996311002478,
        "lon": 106.668410897255,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56f11ac33ac17b11001c504c"
        }
    },
    {
        "desc": "Cầu Sài Gòn 8 (Thủ Đức)",
        "lat": 10.7995520591487,
        "lon": 106.731228232384,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=631813ebc9eae60017a196b0"
        }
    },
    {
        "desc": "Trường Sơn - Cửu Long",
        "lat": 10.8091738427151,
        "lon": 106.664789915085,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587475abb807da0011e33cea"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Nguyễn Đình Chiểu",
        "lat": 10.774969,
        "lon": 106.686639,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad0e"
        }
    },
    {
        "desc": "Nguyễn Đình Chiểu - Trương Định",
        "lat": 10.777922,
        "lon": 106.689658,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad11"
        }
    },
    {
        "desc": "Nút giao Bảy Hiền 1 (Cách Mạng Tháng Tám)",
        "lat": 10.7928387592472,
        "lon": 106.653594374657,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587478d8b807da0011e33cf3"
        }
    },
    {
        "desc": "Ba Tháng Hai - Cao Thắng",
        "lat": 10.773823,
        "lon": 106.67782,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf8"
        }
    },
    {
        "desc": "Đặng Thúc Vịnh - Trịnh Thị Miếng",
        "lat": 10.890809558636,
        "lon": 106.613377332687,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=591c6833a6bfb500119400a3"
        }
    },
    {
        "desc": "Quốc Lộ 1- Công ty Pouyen 3 (Cổng)",
        "lat": 10.7470852656437,
        "lon": 106.595476269722,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7938bfd3d90017e8f226"
        }
    },
    {
        "desc": "CT Trung Lương - Võ Trần Chí 2",
        "lat": 10.6846307310993,
        "lon": 106.566883921623,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b664edbfd3d90017eaaa24"
        }
    },
    {
        "desc": "Nút giao Nguyễn Thái Sơn 1 (Hồng Hà)",
        "lat": 10.8140847327392,
        "lon": 106.678351163864,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df83d8c062921100c143e3"
        }
    },
    {
        "desc": "Trần Quang Diệu - Trường Sa",
        "lat": 10.7845127944049,
        "lon": 106.678436994553,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e5776f998a001b252337"
        }
    },
    {
        "desc": "QL1 - Tân Tạo Chợ Đệm 1",
        "lat": 10.7672014274613,
        "lon": 106.590755581856,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca308302eb490011a0a403"
        }
    },
    {
        "desc": "Lý Chính Thắng - Nguyễn Thông",
        "lat": 10.7793063144528,
        "lon": 106.682181358337,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acfd"
        }
    },
    {
        "desc": "Nút giao Thủ Đức (Lê Văn Việt)",
        "lat": 10.8490751291612,
        "lon": 106.774283051491,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8159c062921100c143dc"
        }
    },
    {
        "desc": "Nguyễn Văn Trỗi - Nguyễn Trọng Tuyển",
        "lat": 10.7976866831738,
        "lon": 106.672310829163,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ef2e4b807da0011e33d57"
        }
    },
    {
        "desc": "QL 22 - Nguyễn Văn Bứa 2",
        "lat": 10.8841088420888,
        "lon": 106.586925387383,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b3f7db3bf7600110283c6"
        }
    },
    {
        "desc": "Hùng Vương - Trần Nhân Tôn",
        "lat": 10.7612726484012,
        "lon": 106.675046682358,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e6706f998a001b25239b"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Calmette",
        "lat": 10.7702052976598,
        "lon": 106.697469949722,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b86551afb9c00172dd227"
        }
    },
    {
        "desc": "Kinh Dương Vương - Hồ Học Lãm",
        "lat": 10.7281852870275,
        "lon": 106.607261896133,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a88521afb9c00172d2592"
        }
    },
    {
        "desc": "Tôn Đức Thắng - Công trường Mê Linh",
        "lat": 10.775301268578,
        "lon": 106.70676112175,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=649da77ea6068200171a6dd4"
        }
    },
    {
        "desc": "Vĩnh Lộc - Quách Điêu",
        "lat": 10.8125250596398,
        "lon": 106.577596664429,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b3c59fbfd3d90017e9ace8"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Quốc Lộ 13 (2)",
        "lat": 10.8254711543978,
        "lon": 106.71435713768,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58b5510817139d0010f35d4e"
        }
    },
    {
        "desc": "Nút giao Bốn Xã 2 (Hòa Bình)",
        "lat": 10.7736939654481,
        "lon": 106.62178337574,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a824c905058170011f6eab0"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Pasteur",
        "lat": 10.780518,
        "lon": 106.695957,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad16"
        }
    },
    {
        "desc": "Lý Thường Kiệt - Tô Hiến Thành 2",
        "lat": 10.7708113380158,
        "lon": 106.658003926277,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7c73bfd3d90017e8f3ed"
        }
    },
    {
        "desc": "Cộng Hòa - Đường C 18",
        "lat": 10.8016071209638,
        "lon": 106.651110649109,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e1d4ef9fab7001111b0a2"
        }
    },
    {
        "desc": "Nguyễn Trãi - Cống Quỳnh 1",
        "lat": 10.7663399395947,
        "lon": 106.688103715542,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63195512c9eae60017a1c279"
        }
    },
    {
        "desc": "QL1 - Trạm thu phí AS-AL 1",
        "lat": 10.7958581819231,
        "lon": 106.596806645393,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2ecb02eb490011a0a3f6"
        }
    },
    {
        "desc": "Hai Bà Trưng - Trần Cao Vân",
        "lat": 10.7839015119534,
        "lon": 106.69704079628,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623df636f998a001b251e92"
        }
    },
    {
        "desc": "Lạc Long Quân - Âu Cơ",
        "lat": 10.7747690150491,
        "lon": 106.647881269455,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdc9d766c880017188970"
        }
    },
    {
        "desc": "Cao tốc LTDG - Cầu Bà Dạt 1",
        "lat": 10.793987513509,
        "lon": 106.75607085228,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d8ec0adc195800111e042b"
        }
    },
    {
        "desc": "Quốc lộ 1 - BQB Đường dẫn cầu vượt Ngã 4 Ga (hướng đi An Sương)",
        "lat": 10.8613452988547,
        "lon": 106.682245731354,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595dc5ac3dcfc400106f2898"
        }
    },
    {
        "desc": "Xô Viết Nghệ Tĩnh - Nguyễn Xí 2",
        "lat": 10.8102803807443,
        "lon": 106.712415218353,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8254f25058170011f6eac5"
        }
    },
    {
        "desc": "Lý Thường Kiệt - Tô Hiến Thành 1",
        "lat": 10.7704951431996,
        "lon": 106.658336520195,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7c53bfd3d90017e8f3d8"
        }
    },
    {
        "desc": "Hồng Bàng - Ngô Quyền 2",
        "lat": 10.755881,
        "lon": 106.666241,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad20"
        }
    },
    {
        "desc": "Trường Chinh - Tây Thạnh 1",
        "lat": 10.8199228965258,
        "lon": 106.630790233612,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5874796db807da0011e33cf7"
        }
    },
    {
        "desc": "Nút giao Công Trường Dân Chủ",
        "lat": 10.777664,
        "lon": 106.681336,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acfa"
        }
    },
    {
        "desc": "Cầu vượt Bình Phước 1",
        "lat": 10.8659497751896,
        "lon": 106.723519563675,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58746536b807da0011e33cdc"
        }
    },
    {
        "desc": "Lê Văn Việt - Đình Phong Phú 2",
        "lat": 10.8444335124463,
        "lon": 106.781578660011,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8251575058170011f6eabc"
        }
    },
    {
        "desc": "Hậu Giang - Nguyễn Văn Luông",
        "lat": 10.7480971664479,
        "lon": 106.635103225708,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4f7e1afb9c00172d872e"
        }
    },
    {
        "desc": "Nguyễn Huệ 24",
        "lat": 10.7742209510263,
        "lon": 106.703526377678,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=584e80a761cfea0012cf6989"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Nguyễn Trọng Tuyển",
        "lat": 10.7987511081718,
        "lon": 106.662569046021,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b59291afb9c00172d912b"
        }
    },
    {
        "desc": "Nguyễn Thái Sơn - Phan Văn Trị  1",
        "lat": 10.8261245037402,
        "lon": 106.689493060112,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6060a88576340017d0660d"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh - Ngô Tất Tố 3 (Nhánh chính cầu Thủ Thiêm 1)",
        "lat": 10.7887970063747,
        "lon": 106.716953516006,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65f33bfd3d90017eaa405"
        }
    },
    {
        "desc": "Pasteur - Hàm Nghi",
        "lat": 10.770674,
        "lon": 106.702639,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad1e"
        }
    },
    {
        "desc": "Quang Trung - Bà Triệu",
        "lat": 10.8883494860312,
        "lon": 106.596280932426,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6061868576340017d06611"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Nguyễn Trọng Tuyển",
        "lat": 10.7987669164354,
        "lon": 106.662263274193,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5875cb72b807da0011e33d0c"
        }
    },
    {
        "desc": "QL 22 - Nguyễn Ảnh Thủ 1",
        "lat": 10.8551338847726,
        "lon": 106.607385277748,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b3705b3bf7600110283bd"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Cầu Khánh Hội",
        "lat": 10.7675070857977,
        "lon": 106.706036925316,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7759bfd3d90017e8f162"
        }
    },
    {
        "desc": "Hoàng Diệu - Đoàn Văn Bơ 1",
        "lat": 10.7632541910898,
        "lon": 106.703810691834,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7709bfd3d90017e8f135"
        }
    },
    {
        "desc": "Quang Trung - Phạm Văn Chiêu",
        "lat": 10.8446442571047,
        "lon": 106.640725135803,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b55111afb9c00172d8e2e"
        }
    },
    {
        "desc": "Nguyễn Chí Thanh - Ngô Quyền",
        "lat": 10.759206770879,
        "lon": 106.665605306625,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=649da419a6068200171a6c90"
        }
    },
    {
        "desc": "Quốc lộ 1 - Nguyễn Hữu Trí 1",
        "lat": 10.6966335007055,
        "lon": 106.596463322639,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58afccadbd82540010390c3f"
        }
    },
    {
        "desc": "Trần Quang Khải - Trần Nguyên Đán",
        "lat": 10.7923592320866,
        "lon": 106.694144010544,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b82761afb9c00172dcda3"
        }
    },
    {
        "desc": "Nút giao Ngã sáu Cộng Hòa",
        "lat": 10.765059,
        "lon": 106.68172,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf7"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 1 (Viện Máy tính)",
        "lat": 10.8016545453012,
        "lon": 106.71106338501,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9ddd49766c880017188c94"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Nguyễn Xí (hướng đi Sân bay)",
        "lat": 10.8230474266509,
        "lon": 106.702968478203,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd767766c880017188950"
        }
    },
    {
        "desc": "Quốc lộ 1 - Quang Trung 2 (hướng đi An Sương)",
        "lat": 10.8529158676222,
        "lon": 106.632431745529,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f8d813dcfc400106f28f2"
        }
    },
    {
        "desc": "Cầu vượt Bình Phước 2",
        "lat": 10.8647433460363,
        "lon": 106.724211573601,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5874656eb807da0011e33cde"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Trường Sa",
        "lat": 10.786135848679,
        "lon": 106.680936813354,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e3566f998a001b25226d"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Lương Bằng (1)",
        "lat": 10.7320855467281,
        "lon": 106.719925403595,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5abbb6d698d8fc001102dfc8"
        }
    },
    {
        "desc": "Lê Văn Sỹ - Phạm Văn Hai",
        "lat": 10.7968909966773,
        "lon": 106.664655804634,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c87e8b807da0011e33d45"
        }
    },
    {
        "desc": "Nút giao Lê Đại Hành 2 (Lê Đại Hành)",
        "lat": 10.7688351149688,
        "lon": 106.652623414993,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdd26766c880017188974"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cao Văn Lầu",
        "lat": 10.7442498171975,
        "lon": 106.650842428207,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481296"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa - Nguyễn Đình Chiểu",
        "lat": 10.7814721788992,
        "lon": 106.692835092545,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad03"
        }
    },
    {
        "desc": "Đồng Văn Cống - Cầu Giồng Ông Tố 2",
        "lat": 10.7840648720405,
        "lon": 106.75255715847,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5874461db807da0011e33c9c"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Đoàn Như Hài",
        "lat": 10.7667745592657,
        "lon": 106.706455349922,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae777cbfd3d90017e8f177"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Nguyễn Bỉnh Khiêm",
        "lat": 10.7887074232314,
        "lon": 106.703531742096,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=631828cac9eae60017a19f50"
        }
    },
    {
        "desc": "Cầu Sài Gòn 1 (dạ cầu Bình Thạnh)",
        "lat": 10.7980089972696,
        "lon": 106.724379211664,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b3c2fbbfd3d90017e9abbf"
        }
    },
    {
        "desc": "Trường Chinh - Phan Văn Hớn 1 (Q12-HM)",
        "lat": 10.8269833398213,
        "lon": 106.625425815582,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d7c2e6c1e33c00112b321e"
        }
    },
    {
        "desc": "Võ Chí Công - Liên Phường 1",
        "lat": 10.8045368770814,
        "lon": 106.792543530464,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54ad1bfd3d90017ea7974"
        }
    },
    {
        "desc": "Trường Chinh - Trương Công Định",
        "lat": 10.7990461956223,
        "lon": 106.641937494278,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5b481afb9c00172d92a8"
        }
    },
    {
        "desc": "Đồng Văn Cống - Phan Văn Đáng",
        "lat": 10.7785053,
        "lon": 106.7572618,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48129e"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 2 (ĐH Hồng Bàng)",
        "lat": 10.7998787622235,
        "lon": 106.706600189209,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9dddb9766c880017188c96"
        }
    },
    {
        "desc": "Nút giao Cây Gõ 2 (Minh Phụng)",
        "lat": 10.7550275416962,
        "lon": 106.643267869949,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd372766c880017188940"
        }
    },
    {
        "desc": "Vĩnh Lộc - Nguyễn Thị Tú 2",
        "lat": 10.8135578170586,
        "lon": 106.579318642616,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5ad06a0d98d8fc001102e27b"
        }
    },
    {
        "desc": "QL1 - Hương Lộ 2 (2)",
        "lat": 10.769962881176,
        "lon": 106.591436862946,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a60839c8576340017d0667c"
        }
    },
    {
        "desc": "Xô Viết Nghệ Tĩnh - Đường D5",
        "lat": 10.8068184838962,
        "lon": 106.711615920067,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65f64bfd3d90017eaa41f"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường 14",
        "lat": 10.8696796650458,
        "lon": 106.775951385498,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58746371b807da0011e33cd1"
        }
    },
    {
        "desc": "Nguyễn Lương Bằng - Hoàng Quốc Việt",
        "lat": 10.7131108376067,
        "lon": 106.731684207916,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63bd1e95bfd3d90017ec3cd5"
        }
    },
    {
        "desc": "Lạc Long Quân - Ông Ích Khiêm",
        "lat": 10.7667007795163,
        "lon": 106.64261341095,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7cd3bfd3d90017e8f408"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Nguyễn Xí (hướng đi Thủ Đức)",
        "lat": 10.8228313977916,
        "lon": 106.703445911407,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd70e766c88001718894e"
        }
    },
    {
        "desc": "Tùng Thiện Vương - Cầu Nhị Thiên Đường",
        "lat": 10.7443815765443,
        "lon": 106.656072735786,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58b555ac17139d0010f35d59"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cầu vượt Tân Thới Hiệp 1",
        "lat": 10.8617509592331,
        "lon": 106.649812459946,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595ddc123dcfc400106f28ba"
        }
    },
    {
        "desc": "Quốc lộ 1 - ĐH Nông Lâm 1",
        "lat": 10.8671930769878,
        "lon": 106.788429021835,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587460aab807da0011e33cc2"
        }
    },
    {
        "desc": "Cầu vượt Trạm 2 (TĐ ->Q9)",
        "lat": 10.8655019745646,
        "lon": 106.793106794357,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59d3524f02eb490011a0a61b"
        }
    },
    {
        "desc": "Nguyễn Thị Thập - Lê Văn Lương",
        "lat": 10.739928078758,
        "lon": 106.703596115112,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8f701afb9c00172d2b5e"
        }
    },
    {
        "desc": "Nút giao Mỹ Thủy (6)",
        "lat": 10.7680077324028,
        "lon": 106.773376464844,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b55020bfd3d90017ea7cb7"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Xóm Chiếu",
        "lat": 10.7604452450726,
        "lon": 106.712136268616,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b19d2f9af4ff60011d6ea4f"
        }
    },
    {
        "desc": "Quang Trung - Thống Nhất",
        "lat": 10.8346442594662,
        "lon": 106.664371490479,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623eec96f998a001b25273b"
        }
    },
    {
        "desc": "An Dương Vương - Lê Hồng Phong",
        "lat": 10.7589116443632,
        "lon": 106.677567958832,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4d781afb9c00172d8571"
        }
    },
    {
        "desc": "Đinh Bộ Lĩnh - Bạch Đằng 3",
        "lat": 10.8028664980496,
        "lon": 106.709464788437,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a606a958576340017d06621"
        }
    },
    {
        "desc": "Dương Bá Trạc - đường 9A",
        "lat": 10.7388529049553,
        "lon": 106.689584255218,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8c381afb9c00172d28b6"
        }
    },
    {
        "desc": "Nguyễn Tất Thành - Cảng SG (Q7-Q4)",
        "lat": 10.7592436616732,
        "lon": 106.713917255402,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b6617ebfd3d90017eaa50b"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cầu vượt An Sương (Song hành QL 22)",
        "lat": 10.8454766970536,
        "lon": 106.618419885635,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f91653dcfc400106f28f6"
        }
    },
    {
        "desc": "Quốc lộ 1 - Trần Đại Nghĩa",
        "lat": 10.7223980522437,
        "lon": 106.600669026375,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48129d"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Phạm Phú Thứ",
        "lat": 10.7413616378753,
        "lon": 106.645520925522,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481292"
        }
    },
    {
        "desc": "Hai Bà Trưng - Lý Chính Thắng",
        "lat": 10.791464,
        "lon": 106.687554,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acff"
        }
    },
    {
        "desc": "255 Hoàng Văn Thụ",
        "lat": 10.8005216285264,
        "lon": 106.664301753044,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b58791afb9c00172d9107"
        }
    },
    {
        "desc": "Trần Hưng Đạo - Nguyễn Cư Trinh",
        "lat": 10.7650143803183,
        "lon": 106.692867279053,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b811d1afb9c00172dcc1d"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Thị Thập 2",
        "lat": 10.7379990877391,
        "lon": 106.721824407578,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8eb41afb9c00172d2aba"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh - Võ Chí Công 1",
        "lat": 10.7909628024813,
        "lon": 106.791990995407,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b548ecbfd3d90017ea77d2"
        }
    },
    {
        "desc": "Võ Thị Sáu - Bà Huyện Thanh Quan",
        "lat": 10.7801863634439,
        "lon": 106.684262752533,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acfb"
        }
    },
    {
        "desc": "Mai Chí Thọ - Võ Nguyên Giáp (Cát Lái cầu A)",
        "lat": 10.8049847689326,
        "lon": 106.752707362175,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48127d"
        }
    },
    {
        "desc": "Hải Thượng Lãn Ông - Cầu Chà Và",
        "lat": 10.7505847415039,
        "lon": 106.660031676292,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48128d"
        }
    },
    {
        "desc": "Lý Thái Tổ - Sư Vạn Hạnh",
        "lat": 10.7677758540786,
        "lon": 106.671495437622,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e7076f998a001b2523ea"
        }
    },
    {
        "desc": "Cầu vượt An Sương 2",
        "lat": 10.8395020450536,
        "lon": 106.611746549606,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2cac02eb490011a0a3e9"
        }
    },
    {
        "desc": "Võ Chí Công - Cầu Phú Mỹ",
        "lat": 10.7496677141024,
        "lon": 106.754032373428,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5aab1f852d266a0017e5afd4"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Kha Vạn Cân (hướng đi Quốc lộ 1)",
        "lat": 10.840819218446,
        "lon": 106.74354493618,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cda2e766c88001718895e"
        }
    },
    {
        "desc": "Trường Chinh - Tân Kỳ Tân Quý",
        "lat": 10.8037728247342,
        "lon": 106.635918617249,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e25e1f9fab7001111b0ae"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 4 (Cầu Văn Thánh - Hàng Xanh)",
        "lat": 10.8015491578746,
        "lon": 106.713750958443,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9dde8e766c880017188c9a"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 6 (Cầu Điện Biên Phủ - Hàng Xanh)",
        "lat": 10.8007429428369,
        "lon": 106.709132194519,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9ddf0f766c880017188c9e"
        }
    },
    {
        "desc": "Khánh Hội -  Hoàng Diệu",
        "lat": 10.7596389198989,
        "lon": 106.698489189148,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae76ddbfd3d90017e8f11b"
        }
    },
    {
        "desc": "Lý Tự Trọng - Đồng Khởi",
        "lat": 10.7778940148849,
        "lon": 106.701037287712,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad14"
        }
    },
    {
        "desc": "Nơ Trang Long - Nguyễn Huy Lượng (Bệnh viện Ung Bướu)",
        "lat": 10.8053483512381,
        "lon": 106.695023775101,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b66035bfd3d90017eaa48e"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Lưu Trọng Lư 1",
        "lat": 10.7545321437295,
        "lon": 106.727795004845,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=585b284ac3f96200127dc500"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Cầu Chà Và 1 (dạ cầu)",
        "lat": 10.7490827124077,
        "lon": 106.659994125366,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481295"
        }
    },
    {
        "desc": "Võ Thị Sáu - Pasteur",
        "lat": 10.7860304558102,
        "lon": 106.690008044243,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad04"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Phạm Hùng 1",
        "lat": 10.7284488196731,
        "lon": 106.677117347717,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8278f35058170011f6eaed"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Võ Văn Tần",
        "lat": 10.7743421575788,
        "lon": 106.688017845154,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b830e1afb9c00172dcf50"
        }
    },
    {
        "desc": "QL1 - Tân Tạo Chợ Đệm 2",
        "lat": 10.7661000008843,
        "lon": 106.590557098389,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6084208576340017d0667e"
        }
    },
    {
        "desc": "Võ Chí Công - Liên Phường 2",
        "lat": 10.8049478837466,
        "lon": 106.791937351227,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54aedbfd3d90017ea79c3"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Hữu Thọ (2)",
        "lat": 10.7289864255581,
        "lon": 106.700313091278,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a825ab55058170011f6ead2"
        }
    },
    {
        "desc": "Nguyễn Kiệm - Hồ Văn Huê",
        "lat": 10.8062968247449,
        "lon": 106.6783618927,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e20a0f9fab7001111b0a7"
        }
    },
    {
        "desc": "Nguyễn Văn Cừ - Trần Hưng Đạo 2",
        "lat": 10.7563925169909,
        "lon": 106.685357093811,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0b7bbe0e517b00119fd806"
        }
    },
    {
        "desc": "Vòng xoay Gò Vấp (2)",
        "lat": 10.8267936584446,
        "lon": 106.679542064667,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623edd26f998a001b2526f7"
        }
    },
    {
        "desc": "BX Miền Đông - Đinh Bộ Lĩnh 1",
        "lat": 10.8168141411482,
        "lon": 106.711433529854,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8255a55058170011f6eac7"
        }
    },
    {
        "desc": "Đường hầm - Đầu Quận 1",
        "lat": 10.7675334356397,
        "lon": 106.702040433884,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481294"
        }
    },
    {
        "desc": "Mai Chí Thọ - Lương Định Của 2",
        "lat": 10.792627978172,
        "lon": 106.751446723938,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c481280"
        }
    },
    {
        "desc": "Phan Đăng Lưu - Đinh Tiên Hoàng 2",
        "lat": 10.8024818353159,
        "lon": 106.697963476181,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587ed91db807da0011e33d4e"
        }
    },
    {
        "desc": "Quốc Lộ 1 - Cổng ĐH Quốc gia TPHCM",
        "lat": 10.865338658848,
        "lon": 106.793847084045,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b54dcbbfd3d90017ea7ba8"
        }
    },
    {
        "desc": "Võ Văn Kiệt - Trần Đình Xu 2",
        "lat": 10.7587798913611,
        "lon": 106.692545413971,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48128a"
        }
    },
    {
        "desc": "Vòng xoay Gò Vấp (1)",
        "lat": 10.8260981590362,
        "lon": 106.680099964142,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ed9b6f998a001b2526cd"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa -Nguyễn Thị Minh Khai 2",
        "lat": 10.7794696770349,
        "lon": 106.695173978806,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58b5752e17139d0010f35d5f"
        }
    },
    {
        "desc": "Mai Chí Thọ - Trần Não 2",
        "lat": 10.7757228548636,
        "lon": 106.727376580238,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58175c81edeb6c0012a2d5c2"
        }
    },
    {
        "desc": "Cầu Sài Gòn 11 (Bình Thạnh)",
        "lat": 10.7980818909152,
        "lon": 106.723358631134,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=631812e6c9eae60017a19567"
        }
    },
    {
        "desc": "Đinh Bộ Lĩnh - Bùi Đình Túy",
        "lat": 10.8083518403949,
        "lon": 106.709260940552,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e7b76f998a001b25242d"
        }
    },
    {
        "desc": "Quốc lộ 50 - Cầu Ông Thìn (1)",
        "lat": 10.6524259645754,
        "lon": 106.654586791992,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5ad068b198d8fc001102e278"
        }
    },
    {
        "desc": "Cống Quỳnh - Phạm Viết Chánh",
        "lat": 10.767891793263,
        "lon": 106.685453653336,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae75a3bfd3d90017e8f051"
        }
    },
    {
        "desc": "Lê Lai - Phạm Hồng Thái",
        "lat": 10.7712223907807,
        "lon": 106.695914268494,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b7d8a1afb9c00172dc71f"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Lương Bằng (2)",
        "lat": 10.7315690287392,
        "lon": 106.719989776611,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5abbb77298d8fc001102dfce"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Nguyễn Thị Thập",
        "lat": 10.7375247437985,
        "lon": 106.730353832245,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63bd1f48bfd3d90017ec3d19"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đinh Đức Thiện 1",
        "lat": 10.6647884855642,
        "lon": 106.569807529449,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58aff2c6bd82540010390c55"
        }
    },
    {
        "desc": "Lý Tự Trọng - Pasteur 1",
        "lat": 10.7767662783818,
        "lon": 106.700028777123,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b25a1dcf13cba001124e710"
        }
    },
    {
        "desc": "Phạm Văn Đồng - Hiệp Bình (hướng đi Thủ Đức)",
        "lat": 10.8372522994913,
        "lon": 106.732848286629,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd886766c880017188956"
        }
    },
    {
        "desc": "Hai Bà Trưng - Lê Duẩn",
        "lat": 10.781431,
        "lon": 106.699614,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad18"
        }
    },
    {
        "desc": "Nguyễn Thị Định - Đường A",
        "lat": 10.7627851568961,
        "lon": 106.783590316772,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c4812a0"
        }
    },
    {
        "desc": "Tô Ký - Nguyễn Ảnh Thủ",
        "lat": 10.8675723883698,
        "lon": 106.615512371063,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623efc26f998a001b25277f"
        }
    },
    {
        "desc": "Tùng Thiện Vương - Xóm Củi",
        "lat": 10.7466952613032,
        "lon": 106.660562753677,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b50841afb9c00172d880d"
        }
    },
    {
        "desc": "Cầu Sài Gòn 3 (Dạ cầu Bình Thạnh)",
        "lat": 10.7982289959934,
        "lon": 106.724311485887,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58abc0cbbd82540010390ba6"
        }
    },
    {
        "desc": "Quốc lộ 1 - Bùi Thanh Khiết 1",
        "lat": 10.6741931544789,
        "lon": 106.580477356911,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58afea5dbd82540010390c4d"
        }
    },
    {
        "desc": "Nguyễn Văn Trỗi - Trương Quốc Dung",
        "lat": 10.797381,
        "lon": 106.672665,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad07"
        }
    },
    {
        "desc": "Trường Sơn - Hậu Giang",
        "lat": 10.8076721060064,
        "lon": 106.664478778839,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdc1d766c88001718896c"
        }
    },
    {
        "desc": "BX Miền Đông - Quốc Lộ 13 (1)",
        "lat": 10.8142322689639,
        "lon": 106.712779998779,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a606c758576340017d06626"
        }
    },
    {
        "desc": "Ung Văn Khiêm - Nguyễn Văn Thương (D1)",
        "lat": 10.8036621687159,
        "lon": 106.721674203873,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b66008bfd3d90017eaa476"
        }
    },
    {
        "desc": "Cầu vượt An Sương 3",
        "lat": 10.8427001319976,
        "lon": 106.615458726883,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2cf302eb490011a0a3eb"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Quốc lộ 50 (1)",
        "lat": 10.7199365991593,
        "lon": 106.655665040016,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a82628e5058170011f6eadb"
        }
    },
    {
        "desc": "Hà Huy Giáp - Cầu Phú Long 2",
        "lat": 10.8986321383696,
        "lon": 106.69497013092,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=589b46b3b3bf7600110283d0"
        }
    },
    {
        "desc": "Kha Vạn Cân - Võ Văn Ngân",
        "lat": 10.8509770648006,
        "lon": 106.75500869751,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd653766c88001718894c"
        }
    },
    {
        "desc": "Hải Thượng Lãn Ông - Châu Văn Liêm",
        "lat": 10.7509852813336,
        "lon": 106.658996343613,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4de41afb9c00172d85c5"
        }
    },
    {
        "desc": "Nam Kỳ Khởi Nghĩa -Nguyễn Thị Minh Khai 1",
        "lat": 10.7797542439016,
        "lon": 106.695082783699,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58af8eb2bd82540010390c30"
        }
    },
    {
        "desc": "Phan Văn Trị - Lê Đức Thọ",
        "lat": 10.829417573494,
        "lon": 106.6819024086,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ee176f998a001b25270c"
        }
    },
    {
        "desc": "Hương Lộ 2 (Số 878)",
        "lat": 10.7672172373829,
        "lon": 106.59831404686,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0b7d240e517b00119fd809"
        }
    },
    {
        "desc": "Quốc lộ 1 - Cầu vượt Linh Xuân",
        "lat": 10.8733304866588,
        "lon": 106.765040159225,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58746314b807da0011e33cce"
        }
    },
    {
        "desc": "Quốc lộ 1 - Quang Trung 1 (hướng đi Bình Phước)",
        "lat": 10.8528104982269,
        "lon": 106.632506847382,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f8d233dcfc400106f28f0"
        }
    },
    {
        "desc": "Đỗ Xuân Hợp - Cầu Cống Đập.",
        "lat": 10.8104489957249,
        "lon": 106.7762196064,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59d34ce302eb490011a0a616"
        }
    },
    {
        "desc": "Nguyễn Văn Linh - Nguyễn Thị Thập 1",
        "lat": 10.7379358419233,
        "lon": 106.721234321594,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8e641afb9c00172d2a7e"
        }
    },
    {
        "desc": "Nguyễn Công Trứ - Calmette 2",
        "lat": 10.7673753365528,
        "lon": 106.699846386909,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad1d"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lê Đại Hành 2",
        "lat": 10.7621422099615,
        "lon": 106.656598448753,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7c12bfd3d90017e8f3c0"
        }
    },
    {
        "desc": "Tam Bình (Số 81)",
        "lat": 10.8530844585776,
        "lon": 106.73014998436,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0b835b0e517b00119fd80d"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh 1 (Dạ cầu)",
        "lat": 10.7974969832732,
        "lon": 106.720730066299,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b6c155aca0577001163fe36"
        }
    },
    {
        "desc": "Hai Bà Trưng - Nguyễn Hữu Cầu",
        "lat": 10.7893713917772,
        "lon": 106.690120697021,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b82da1afb9c00172dce94"
        }
    },
    {
        "desc": "Nút giao Cây Gõ 1 (trên cầu)",
        "lat": 10.7544425503934,
        "lon": 106.642913818359,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd2a3766c88001718893c"
        }
    },
    {
        "desc": "Lý Thường Kiệt - Nguyễn Chí Thanh",
        "lat": 10.7584267930315,
        "lon": 106.661485433578,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b4e8e1afb9c00172d865c"
        }
    },
    {
        "desc": "Nguyễn Đình Chiểu - Nguyễn Bỉnh Khiêm",
        "lat": 10.7904674636287,
        "lon": 106.701471805573,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b7f9f1afb9c00172dca50"
        }
    },
    {
        "desc": "KCN Vĩnh Lộc -> Phan Văn Hớn",
        "lat": 10.8330109299002,
        "lon": 106.606307029724,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59c8c17602eb490011a0a37e"
        }
    },
    {
        "desc": "Nút giao Bảy Hiền 2 (Hoàng Văn Thụ)",
        "lat": 10.7931970867358,
        "lon": 106.653615832329,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58747923b807da0011e33cf5"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lý Thường Kiệt 2",
        "lat": 10.7636125538021,
        "lon": 106.659564971924,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7af4bfd3d90017e8f32c"
        }
    },
    {
        "desc": "Tạ Quang Bửu - Phạm Hùng 1",
        "lat": 10.7372717600591,
        "lon": 106.670937538147,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5875d4f8b807da0011e33d1a"
        }
    },
    {
        "desc": "Quốc Lộ 1A - Cầu Bình Phước",
        "lat": 10.8607025631008,
        "lon": 106.715140342712,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595d92013dcfc400106f2877"
        }
    },
    {
        "desc": "Nguyễn Thị Định - Lê Phụng Hiểu",
        "lat": 10.7619577577189,
        "lon": 106.784512996674,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=583f976361cfea0012cf68f9"
        }
    },
    {
        "desc": "Nguyễn Văn Thủ - Trần Doãn Khanh",
        "lat": 10.788633648858,
        "lon": 106.69774889946,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b80721afb9c00172dcb28"
        }
    },
    {
        "desc": "QL1 - Tân Kỳ Tân Quý 2",
        "lat": 10.7894293572155,
        "lon": 106.595449447632,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2f4402eb490011a0a3f9"
        }
    },
    {
        "desc": "Cộng Hòa - Trường Chinh",
        "lat": 10.8070661399436,
        "lon": 106.634953022003,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=586e1f18f9fab7001111b0a5"
        }
    },
    {
        "desc": "Xô Viết Nghệ Tĩnh - Phan Văn Hân (Cầu Thị Nghè)",
        "lat": 10.7927439077816,
        "lon": 106.707404851913,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65f8dbfd3d90017eaa434"
        }
    },
    {
        "desc": "Cao tốc LTDG - Cầu Bà Dạt 3",
        "lat": 10.7929019935409,
        "lon": 106.754863858223,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9de3c2766c880017188cb3"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám – Phạm Văn Hai",
        "lat": 10.7890446772791,
        "lon": 106.660680770874,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7cfcbfd3d90017e8f422"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 8 (HX-VT)",
        "lat": 10.8012804197692,
        "lon": 106.711969971657,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b0e1faacddcc80011ceb449"
        }
    },
    {
        "desc": "Xô Viết Nghệ Tĩnh - Nguyễn Văn Lạc",
        "lat": 10.7953154258079,
        "lon": 106.709818840027,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b65fa9bfd3d90017eaa449"
        }
    },
    {
        "desc": "Đinh Bộ Lĩnh - Chu Văn An",
        "lat": 10.8105965337175,
        "lon": 106.709175109863,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e7f06f998a001b25244a"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Tôn Thất Tùng",
        "lat": 10.7712645500069,
        "lon": 106.687191724777,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e5066f998a001b252317"
        }
    },
    {
        "desc": "Tân Kỳ Tân Quý - Bình Long",
        "lat": 10.7965800987319,
        "lon": 106.613742113113,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b5c141afb9c00172d93d7"
        }
    },
    {
        "desc": "Nguyễn Hữu Thọ - Nguyễn Thị Thập 1",
        "lat": 10.740497286869,
        "lon": 106.700946092606,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df8381c062921100c143e2"
        }
    },
    {
        "desc": "Nguyễn Tri Phương - Trần Phú",
        "lat": 10.7535782368426,
        "lon": 106.669569611549,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cd1f9766c880017188938"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám - Rạch Bùng Binh",
        "lat": 10.7794538677567,
        "lon": 106.678587198257,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623e61d6f998a001b252377"
        }
    },
    {
        "desc": "Quốc lộ 1 - Đường 15 (2)",
        "lat": 10.8601177777294,
        "lon": 106.698709130287,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595da2dd3dcfc400106f2885"
        }
    },
    {
        "desc": "Mai Chí Thọ - Xa Lộ Hà Nội (3)",
        "lat": 10.809194919668,
        "lon": 106.756038665771,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623f1996f998a001b252805"
        }
    },
    {
        "desc": "Quốc lộ 1 - BQB Cầu vượt Tân Thới Hiệp B (hướng Bình Phước)",
        "lat": 10.8600387525913,
        "lon": 106.645692586899,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=595f80e83dcfc400106f28e4"
        }
    },
    {
        "desc": "Nút giao Ngã bảy Lý Thái Tổ",
        "lat": 10.767428,
        "lon": 106.674596,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acf5"
        }
    },
    {
        "desc": "Cách Mạng Tháng Tám – Hòa Hưng",
        "lat": 10.7802232516687,
        "lon": 106.677144169807,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=631955e7c9eae60017a1c30a"
        }
    },
    {
        "desc": "Nguyễn Thái Sơn - Phan Văn Trị 2",
        "lat": 10.8262720340397,
        "lon": 106.689149737358,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6060e08576340017d0660f"
        }
    },
    {
        "desc": "QL1-Phan Văn Hớn (Q12)",
        "lat": 10.8343386694508,
        "lon": 106.607272624969,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a607ea98576340017d0666d"
        }
    },
    {
        "desc": "Ba Tháng Hai - Lê Hồng Phong 2",
        "lat": 10.7711380723106,
        "lon": 106.672922372818,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7a26bfd3d90017e8f29a"
        }
    },
    {
        "desc": "Nguyễn Duy Trinh - Nguyễn Thị Tư",
        "lat": 10.792733368728,
        "lon": 106.806946992874,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b548c3bfd3d90017ea77c0"
        }
    },
    {
        "desc": "Huỳnh Tấn Phát - Hoàng Quốc Việt",
        "lat": 10.7143336880567,
        "lon": 106.736941337585,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8c931afb9c00172d2901"
        }
    },
    {
        "desc": "Nguyễn Trãi - Cống Quỳnh 2",
        "lat": 10.7668302628021,
        "lon": 106.688015724794,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63195556c9eae60017a1c2ba"
        }
    },
    {
        "desc": "Phổ Quang - Huỳnh Lan Khanh",
        "lat": 10.8049689609963,
        "lon": 106.666592359543,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58df4adedc195800111e04b4"
        }
    },
    {
        "desc": "QL1 - Hương Lộ 2 (1)",
        "lat": 10.7702369171868,
        "lon": 106.591292023659,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca301902eb490011a0a400"
        }
    },
    {
        "desc": "Quốc lộ 1 - Nguyễn Thị Tú",
        "lat": 10.8161291568165,
        "lon": 106.600910425186,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=584e738361cfea0012cf6951"
        }
    },
    {
        "desc": "Nguyễn Thị Định - Đường C",
        "lat": 10.7660209509751,
        "lon": 106.779872775078,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=583f958161cfea0012cf68f5"
        }
    },
    {
        "desc": "Đinh Bộ Lĩnh - Bạch Đằng 1",
        "lat": 10.8030720025958,
        "lon": 106.710022687912,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8253615058170011f6eabf"
        }
    },
    {
        "desc": "Nguyễn Thị Minh Khai - Trương Định",
        "lat": 10.776014,
        "lon": 106.691731,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad0f"
        }
    },
    {
        "desc": "Hương Lộ 3 - Đường kênh 19/5",
        "lat": 10.8029560769717,
        "lon": 106.610062122345,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b51761afb9c00172d88ef"
        }
    },
    {
        "desc": "Tô Ký - Nguyễn Văn Quá",
        "lat": 10.8474892954581,
        "lon": 106.635167598724,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=6623ec376f998a001b252671"
        }
    },
    {
        "desc": "QL1 - TTDK 50-07V",
        "lat": 10.8041364085074,
        "lon": 106.598539352417,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2e6002eb490011a0a3f3"
        }
    },
    {
        "desc": "Nút giao Hàng Xanh 3 (Cầu Thị Nghè - Hàng Xanh)",
        "lat": 10.8001422321862,
        "lon": 106.711294054985,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d9dde1f766c880017188c98"
        }
    },
    {
        "desc": "Nguyễn Hữu Cảnh 2 (Chân cầu)",
        "lat": 10.795078299042,
        "lon": 106.718080043793,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5b6c1618ca0577001163fe3c"
        }
    },
    {
        "desc": "Xa Lộ Hà Nội - Đường D400",
        "lat": 10.8719449708741,
        "lon": 106.807773113251,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58b5528e17139d0010f35d52"
        }
    },
    {
        "desc": "Nút giao Ngã sáu Nguyễn Tri Phương",
        "lat": 10.76009,
        "lon": 106.669124,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad22"
        }
    },
    {
        "desc": "CT Trung Lương - Võ Trần Chí 1",
        "lat": 10.6852580285724,
        "lon": 106.571159362793,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63b664d2bfd3d90017eaaa0f"
        }
    },
    {
        "desc": "Phan Đình Giót - Phan Thúc Duyện",
        "lat": 10.8015070028935,
        "lon": 106.665642857552,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56df85bdc062921100c143e8"
        }
    },
    {
        "desc": "Lê Lợi - Phan Bội Châu",
        "lat": 10.772307988975,
        "lon": 106.698939800262,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b85031afb9c00172dd0dc"
        }
    },
    {
        "desc": "Nút giao Chợ Đệm 1 (CT Trung Lương - Bùi Thanh Khiết)",
        "lat": 10.6859643956044,
        "lon": 106.576287746429,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58d7b5a7c1e33c00112b320a"
        }
    },
    {
        "desc": "Nguyễn Hữu Thọ - đường số 15",
        "lat": 10.7445238765742,
        "lon": 106.701600551605,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8f3a1afb9c00172d2b31"
        }
    },
    {
        "desc": "Võ Chí Công - Cầu Kỳ Hà 1",
        "lat": 10.753947151466,
        "lon": 106.759203672409,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744693b807da0011e33c9e"
        }
    },
    {
        "desc": "Quốc lộ 1 - Bùi Thanh Khiết 2",
        "lat": 10.6737028958529,
        "lon": 106.58026278019,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58aff01fbd82540010390c50"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Trần Huy Liệu",
        "lat": 10.7993728992472,
        "lon": 106.677471399307,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5d8cdb9f766c880017188968"
        }
    },
    {
        "desc": "QL1-Tỉnh lộ 10B (1)",
        "lat": 10.7499628496621,
        "lon": 106.593507528305,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a6085fb8576340017d06686"
        }
    },
    {
        "desc": "Đinh Bộ Lĩnh - Bạch Đằng 2",
        "lat": 10.8030930799773,
        "lon": 106.709395051003,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8253bc5058170011f6eac1"
        }
    },
    {
        "desc": "QL1 - Hồ Học Lãm",
        "lat": 10.7342095859156,
        "lon": 106.602809429169,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca31d602eb490011a0a40b"
        }
    },
    {
        "desc": "Võ Nguyên Giáp - Thảo Điền",
        "lat": 10.8010116814233,
        "lon": 106.738277077675,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c782db807da0011e33d3b"
        }
    },
    {
        "desc": "Nguyễn Thị Thập - Tân Mỹ",
        "lat": 10.7381993660681,
        "lon": 106.718316078186,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662a8d821afb9c00172d29c8"
        }
    },
    {
        "desc": "Lý Thường Kiệt - Bắc Hải",
        "lat": 10.7778307774358,
        "lon": 106.656131744385,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=63ae7d29bfd3d90017e8f437"
        }
    },
    {
        "desc": "Đồng Văn Cống - Nguyễn Thị Định",
        "lat": 10.7731722,
        "lon": 106.7702866,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=56de42f611f398ec0c48129f"
        }
    },
    {
        "desc": "Ngã sáu Phù Đổng 2",
        "lat": 10.7715702042204,
        "lon": 106.693022847176,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b80b91afb9c00172dcb5b"
        }
    },
    {
        "desc": "Hùng Vương - Ngô Gia Tự",
        "lat": 10.7563292750288,
        "lon": 106.666474342346,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515ad1f"
        }
    },
    {
        "desc": "Dương Bá Trạc - Đường số 9",
        "lat": 10.7420784148825,
        "lon": 106.688178777695,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=662b50261afb9c00172d87b2"
        }
    },
    {
        "desc": "QL1 - Phan Văn Hớn 2",
        "lat": 10.8342965190794,
        "lon": 106.606961488724,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=59ca2d9d02eb490011a0a3f0"
        }
    },
    {
        "desc": "BX Miền Đông - Quốc Lộ 13 (2)",
        "lat": 10.8172620146729,
        "lon": 106.713198423386,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5a8256df5058170011f6eacb"
        }
    },
    {
        "desc": "Điện Biên Phủ - Trương Định",
        "lat": 10.7800124617515,
        "lon": 106.68729364872,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5deb576d1dc17d7c5515acfc"
        }
    },
    {
        "desc": "Hoàng Văn Thụ - Hồ Văn Huê",
        "lat": 10.7994466709843,
        "lon": 106.674934029579,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=587c8c20b807da0011e33d47"
        }
    },
    {
        "desc": "Hưng Phú - Chánh Hưng 2",
        "lat": 10.7463895818732,
        "lon": 106.669129729271,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=58744fb0b807da0011e33cc0"
        }
    },
    {
        "desc": "Hồng Bàng - Nguyễn Thị Nhỏ",
        "lat": 10.7535518857808,
        "lon": 106.651153564453,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=5822f23aedeb6c0012a2d6a8"
        }
    },
    {
        "desc": "Mai Chí Thọ - Trần Quý Kiên (3)",
        "lat": 10.7817936319045,
        "lon": 106.740009784698,
        "url": {
            "HCMC": "https://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandler.ashx?id=649da495a6068200171a6cb6"
        }
    },
    {
        "desc": "Camera cổng trường Nguyễn Huệ Đà Nẵng",
        "lat": 16.07411,
        "lon": 108.21639,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=Fu3nDsqC1J0"
        }
    },
    {
        "desc": "Camera cầu vượt Ngã Ba Huế",
        "lat": 16.0626,
        "lon": 108.17891,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Kho hàng dầu ăn Quốc Linh - 65 Trường Sơn",
        "lat": 16.01169,
        "lon": 108.1842,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera tầng 20 Khách sạn Vanda - 3 Nguyễn Văn Linh",
        "lat": 16.06078,
        "lon": 108.22277,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=F06HWCf22-Q"
        }
    },
    {
        "desc": "Camera Tầng 22 - Công viên Phần mềm Đà Nẵng - 2 Quang Trung",
        "lat": 16.07598,
        "lon": 108.22217,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Khách sạn An Thịnh Lộc - 57 Điện Biên Phủ",
        "lat": 16.06552,
        "lon": 108.20124,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera cổng Sau bệnh viện C Đà Nẵng",
        "lat": 16.07441,
        "lon": 108.21785,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=IXBTD4VgFF4"
        }
    },
    {
        "desc": "Camera Coffee Mây - Tây Cầu Sông Hàn - 1B Lê Duẩn",
        "lat": 16.07152,
        "lon": 108.22428,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường tiểu học Trần Cao Vân - 213 Lê Duẩn",
        "lat": 16.06996,
        "lon": 108.21234,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=OqlPrgu8csA"
        }
    },
    {
        "desc": "Camera Trường tiểu học Trần Cao Vân - 16 Hoàng Hoa Thám",
        "lat": 16.07028,
        "lon": 108.20959,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường trung học cơ sở Kim Đồng - 87 Trần Bình Trọng",
        "lat": 16.06494,
        "lon": 108.21759,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=TJcy0mwEJXc"
        }
    },
    {
        "desc": "Camera UBND Phường Hải Châu II - 38 Triệu Nữ Vương",
        "lat": 16.06599,
        "lon": 108.2162,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường mầm non Hoa Phương Đỏ - K85/12 Trần Bình Trọng",
        "lat": 16.06432,
        "lon": 108.21754,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=0-FqGnUDQUs"
        }
    },
    {
        "desc": "Camera Công An Phường Tân Chính - 265 Hải Phòng",
        "lat": 16.071,
        "lon": 108.20998,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=H4GYd5815wg"
        }
    },
    {
        "desc": "Camera Coffee Phượt - 241 Trần Cao Vân",
        "lat": 16.07103,
        "lon": 108.20035,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Hair & Spa Hưng Samurai - 23 Lê Độ",
        "lat": 16.07031,
        "lon": 108.20146,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường tiểu học Nguyễn Văn Trỗi - 565 Tôn Đức Thắng",
        "lat": 16.06562,
        "lon": 108.15459,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Cây Xăng Hòa Mỹ - 198 Tôn Đức Thắng",
        "lat": 16.0571,
        "lon": 108.17169,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Nguyễn Lương Bằng - 27 Nguyễn Lương Bằng",
        "lat": 16.07285,
        "lon": 108.14998,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường tiểu học Võ Thị Sáu - 39 Trần Đình Tri",
        "lat": 16.0809,
        "lon": 108.15598,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=AsRqBD-ZWjc"
        }
    },
    {
        "desc": "Camera 43 Trần Đình Tri - Hòa Minh - Liên Chiểu",
        "lat": 16.08429,
        "lon": 108.1584,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Sơn Trà Tịnh Viên - Phường Thọ Quang - Sơn Trà Đà Nẵng",
        "lat": 16.11429,
        "lon": 108.25693,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường Tiểu Học Lê Lai - 87 Ngũ Hành Sơn",
        "lat": 16.04454,
        "lon": 108.24002,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường Tiểu Học Lê Lai - đường Phan Tứ",
        "lat": 16.04481,
        "lon": 108.24032,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Mầm Non &  Luyện chữ đẹp Hoàn Trí - 145 Lê Độ",
        "lat": 16.06684,
        "lon": 108.20184,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera UBND Phường Thanh Khê Đông - 856 Trần Cao Vân",
        "lat": 16.06863,
        "lon": 108.18336,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Shop Hoa tươi Hồng Nhung - 326 Tôn Đức Thắng",
        "lat": 16.05694,
        "lon": 108.16732,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=5b8rY-u8Cg8"
        }
    },
    {
        "desc": "Camera trường Tiểu học Phan Phu Tiên -79 Ngô Văn Sở",
        "lat": 16.0678,
        "lon": 108.14828,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Tầng 12 Khách Sạn Minh Toàn - 162 đường 2 Tháng 9",
        "lat": 16.05052,
        "lon": 108.22213,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Lê Lợi - 7 Hồ Xuân Hương",
        "lat": 16.03861,
        "lon": 108.24357,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Trưng Vương - Cổng Yên Bái",
        "lat": 16.06707,
        "lon": 108.22253,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Trưng Vương - Cổng Phạm Hồng Thái",
        "lat": 16.06736,
        "lon": 108.22234,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường Tiểu học Hà Huy Tập - 285/6 Trần Cao Vân",
        "lat": 16.07071,
        "lon": 108.19894,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Dịch Vụ cho Thuê xe ô tô Gia Linh - Chu Huy Mân",
        "lat": 16.08885,
        "lon": 108.24086,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=fCW4E4p5gRs"
        }
    },
    {
        "desc": "Camera Trường Tiểu Học Hai Bà Trưng - 95 Trần Hưng Đạo",
        "lat": 16.08119,
        "lon": 108.22894,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Phạm Ngọc Thạch - Dương Văn Nga",
        "lat": 16.08691,
        "lon": 108.23064,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Phạm Ngọc Thạch - Nguyễn Trung Trực",
        "lat": 16.08646,
        "lon": 108.22976,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường tiểu học Trần Quốc Toản - 134 Ngô Quyền",
        "lat": 16.09549,
        "lon": 108.24477,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường trung học cơ sở Lý Tự Trọng - 02 Phan Vinh",
        "lat": 16.10182,
        "lon": 108.24788,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường Đại học Bách khoa Đà Nẵng - 54 Nguyễn Lương Bằng",
        "lat": 16.07371,
        "lon": 108.14978,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=HgP8KEB2-Cs"
        }
    },
    {
        "desc": "Camera Trường tiểu học Chi Lăng - Cầu Rồng - Lý Nam Đế",
        "lat": 16.06216,
        "lon": 108.2324,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường tiểu học Chi Lăng - Ngô Quyền - Lý Nam Đế",
        "lat": 16.06219,
        "lon": 108.23281,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường Tiểu học Ngô Mây - 306 Nguyễn Công Trứ",
        "lat": 16.06477,
        "lon": 108.24237,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường THCS Nguyễn Trãi - 191 Hải Phòng",
        "lat": 16.07149,
        "lon": 108.21212,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Công An Phường Xuân Hà - 01 Hà Huy Tập",
        "lat": 16.0712,
        "lon": 108.19175,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera trường tiểu học Nguyễn Trung Trực - 732 Trần Cao Vân",
        "lat": 16.07175,
        "lon": 108.18677,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Coffee Phố Anh Vũ - 467 Tôn Đức Thắng",
        "lat": 16.06342,
        "lon": 108.15795,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường Tiểu Học Trần Văn Ơn - 140 Hoàng Diệu",
        "lat": 16.06378,
        "lon": 108.21794,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Trường THCS Nguyễn Văn Cừ - 64B Nguyễn Duy Hiệu",
        "lat": 16.05538,
        "lon": 108.23802,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera UBND Quận Ngũ Hành Sơn - 486 Lê Văn Hiến",
        "lat": 16.01634,
        "lon": 108.25411,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Bảo tàng Điêu khắc Chăm Đà Nẵng - Số 2 - đường 2 tháng 9 ",
        "lat": 16.06002,
        "lon": 108.22351,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Tầng 13 Khách Sạn Riverside Đà Nẵng - Trần Hưng Đạo ",
        "lat": 16.06229,
        "lon": 108.23019,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera TRƯỜNG TRUNG CẤP NGHỀ GIAO THÔNG CÔNG CHÍNH ĐÀ NẴNG - 72 Đỗ Thúc Tịnh  ",
        "lat": 16.025,
        "lon": 108.20985,
        "url": {
            "DaNang": "none"
        }
    },
    {
        "desc": "Camera Khách sạn Imperial Huế -8 Hùng Vương - Huế",
        "lat": 16.46572,
        "lon": 107.59148,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=f9VMVglCjuk"
        }
    },
    {
        "desc": "Camera di động ",
        "lat": 16.07411,
        "lon": 108.2157,
        "url": {
            "DaNang": "https://www.youtube.com/watch?v=EDRl5hy3gDs"
        }
    }
];