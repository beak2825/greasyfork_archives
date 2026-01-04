// ==UserScript==
// @namespace    rockswang@github
// @name         懂车帝热门车型
// @version      0.1
// @description  热门车型抓取
// @author       Rocks
// @match        https://www.dongchedi.com/auto/library/*
// @icon         https://www.dongchedi.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446498/%E6%87%82%E8%BD%A6%E5%B8%9D%E7%83%AD%E9%97%A8%E8%BD%A6%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446498/%E6%87%82%E8%BD%A6%E5%B8%9D%E7%83%AD%E9%97%A8%E8%BD%A6%E5%9E%8B.meta.js
// ==/UserScript==

(function() {

    // 预先采集的表格列头全集，包括所有能源类型的车
    var RAW_FIELDS = 'official_price::官方指导价;;sub_brand_name::厂商;;jb::级别;;fuel_form::能源类型;;market_time::上市时间;;engine_description::发动机;;recharge_mileage::纯电续航里程(km);;battery_charge_time::充电时间(小时);;fast_charge_electricity::快充电量(%);;engine_max_power::发动机最大功率(kW);;electric_max_power::电动机最大功率(kW);;engine_max_torque::发动机最大扭矩(N·m);;electric_max_torque::电动机最大扭矩(N·m);;gearbox_description::变速箱;;length_width_height::长x宽x高(mm);;car_body_struct::车身结构;;max_speed::最高车速(km/h);;acceleration_time::官方百公里加速时间(s);;fuel_comprehensive::NEDC综合油耗(L/100km);;power_consumption_v3::百公里耗电量(kWh/100km);;period::整车保修期限;;maintain_cost::6万公里保养总成本预估;;length::长(mm);;width::宽(mm);;height::高(mm);;wheelbase::轴距(mm);;front_track::前轮距(mm);;rear_track::后轮距(mm);;min_clearance::最小离地间隙(mm);;body_struct::车身结构;;door_nums::车门数(个);;door_open_way::车门开启方式;;seat_count::座位数(个);;curb_weight::整备质量(kg);;max_load_weight::最大载重质量(kg);;full_load_weight::满载质量(kg);;oil_tank_volume::油箱容积(L);;baggage_volume::行李舱容积(L);;drag_coefficient::风阻系数(Cd);;model::发动机型号;;cylinder_volume_ml::排量(mL);;capacity_l::排量(L);;gas_form::进气形式;;cylinder_arrangement::气缸排列形式;;cylinder_nums::气缸数(个);;valves_per_cylinder_nums::每缸气门数(个);;compression_ratio_s::压缩比;;air_supply::配气机构;;max_horsepower::最大马力(Ps);;max_power::最大功率(kW);;max_power_revolution::最大功率转速(rpm);;max_torque::最大扭矩(N·m);;max_torque_revolution::最大扭矩转速(rpm);;unique_tech::发动机特有技术;;fuel_form::燃料形式;;fuel_label::燃油标号;;oil_supply::供油方式;;cylinder_head_material::缸盖材料;;cylinder_material::缸体材料;;environmental_standards::环保标准;;electric_description::电动机描述;;electric_type::电机类型;;total_electric_power::电动机总功率(kW);;front_electric_max_horsepower::电动机总马力(Ps);;total_electric_torque::电动机总扭矩(N·m);;front_electric_max_power::前电动机最大功率(kW);;front_electric_max_torque::前电动机最大扭矩(N·m);;rear_electric_max_power::后电动机最大功率(kW);;rear_electric_max_torque::后电动机最大扭矩(N·m);;system_power::系统综合功率(kW);;system_torque::系统综合扭矩(N·m);;electric_drive_number::驱动电机数;;electric_layout::电机布局;;battery_type_v3::电池类型;;battery_brand_v4::电芯品牌;;battery_warranty_v3::电池组质保;;battery_capacity::电池容量(kWh);;battery_energy_density_v3::电池能量密度(Wh/kg);;battery_charge::电池充电;;battery_temperature_management_system::电池温度管理系统;;charging_pile::充电桩;;gearbox_description::变速箱描述;;stalls::挡位数;;gearbox_type::变速箱类型;;driver_form::驱动方式;;fourwheel_drive_type::四驱类型;;central_differential_structure::中央差速器结构;;front_suspension_form::前悬挂形式;;rear_suspension_form::后悬挂形式;;power_steering_type::转向类型;;car_body_structure::车体结构;;front_brake_type::前制动器类型;;rear_brake_type::后制动器类型;;park_brake_type::驻车制动类型;;front_tire_size::前轮胎规格尺寸;;rear_tire_size::后轮胎规格尺寸;;spare_tire_specification::备胎规格;;spare_tire_placement_v3::备胎放置方式;;abs_anti_lock::ABS防抱死;;brake_force::制动力分配(EBD/CBC等);;brake_assist::刹车辅助(EBA/BA等);;traction_control::牵引力控制(TCS/ASR等);;body_stability_system::车身稳定系统(ESP/DSC等);;car_warning_system::主动安全预警系统;;active_brake::主动刹车;;line_support::并线辅助;;lane_keeping_assist_v2::车道保持辅助系统;;fatigue_driving_warning::疲劳驾驶提示;;road_traffic_sign_recognition_v2::道路交通标识识别;;night_vision_system::夜视系统;;main_vice_airbag::前排安全气囊;;front_rear_airbag::侧安全气囊;;side_air_curtain::侧安全气帘;;main_vice_knee_airbag::前排膝部气囊;;vice_cushion_airbag_v3::副驾驶座垫式气囊;;front_near_center_airbag::中央安全气囊;;rear_front_airbag::后排正向安全气囊;;rear_seat_belt::后排气囊式安全带;;rear_anti_slide_airbag_v3::后排座椅防下滑气囊;;seat_belt_prompted::安全带未系提示;;tire_pressure_system_v2::胎压监测系统;;child_seat_interface::儿童座椅接口(ISOFIX);;passive_pedestrian_protection_v2::被动行人保护;;explosion_tire::安全轮胎;;parking_radar::驻车雷达;;driving_assistant_camera::驾驶辅助影像;;cruise_system::巡航系统;;automatic_drive_level_v2::辅助驾驶级别;;auto_park_entry::自动泊车入位;;auto_park::自动驻车(AUTOHOLD);;uphill_support::上坡辅助(HAC);;steep_slope::陡坡缓降(HDC);;engine_sas_tech::发动机启停技术;;variable_suspension::可变悬挂调节;;air_suspension::空气悬挂;;electromagnetic_induct_suspension::电磁感应悬挂;;variable_steer_system::可变转向比系统;;front_slip_method::前桥限滑方式;;rear_slip_method::后桥限滑方式;;central_differential_lock::中央差速器锁止功能;;four_wd_low::低速四驱;;overall_turn::整体主动转向系统;;drive_mode_v2::驾驶模式选择;;brake_energy_regeneration_v3::制动能量回收系统;;low_speed_driving_warning_v3::低速行车警示音;;wade_sensing_system_v3::涉水感应系统;;skylight_type_v2::天窗类型;;roof_racks::车顶行李架;;sports_appearance_kit::运动外观套件;;active_closed_inlet_grid_v3::主动闭合式进气格栅;;alloy_wheel::铝合金轮毂;;side_footrest_v3::车侧脚踏板;;frameless_design_door_v4::无框设计车门;;hidden_door_handle_v4::隐藏式门把手;;steer_wheel_material_v3::方向盘材质;;steer_wheel_adjustment::方向盘调节;;elec_steer_wheel_adjustment::方向盘电动调节;;steer_wheel_functional::方向盘功能;;driving_computer_display_screen_v2::行车电脑屏幕;;lcd_dashboard_type_v2::液晶仪表样式;;lcd_dashboard_size_v2::液晶仪表尺寸(in);;electric_door::电动吸合门;;electric_back_door::电动后尾门;;inductive_back_door::感应式后尾门;;electric_back_door_memory_v2::电动后尾门位置记忆;;engine_anti_theft::发动机电子防盗;;central_locking_car::车内中控锁;;remote_key_v2::遥控钥匙类型;;keyless_entry_v2::无钥匙进入;;keyless_start::无钥匙启动;;engine_remote_start::远程启动;;remote_control_move_v3::遥控移动车辆;;car_call_v3::车辆召唤功能;;header_display_system::抬头显示系统(HUD);;built_in_tachograph::内置行车记录仪;;active_noise_reduction::主动降噪;;mobile_wireless_charging::手机无线充电;;power_outlet::110V/220V/230V电源插座;;baggage_12v_power_outlet_v2::行李舱12V电源接口;;seat_material::座椅材质;;seat_cork_style::座椅皮质风格;;sport_style_seat::运动风格座椅;;layout_seat::座椅布局;;second_independent_seat::第二排独立座椅;;third_row_seat_count::第三排座椅;;seat_electrical_adjustment::座椅电动调节;;main_drive_whole_adjustment::主驾座椅整体调节;;main_drive_part_adjustment::主驾座椅局部调节;;vice_drive_whole_adjustment::副驾座椅整体调节;;vice_drive_part_adjustment::副驾座椅局部调节;;second_seat_control_functional::第二排座椅整体调节;;second_local_seat::第二排座椅局部调节;;front_seat_functional::前排座椅功能;;rear_seat_functional::第二排座椅功能;;third_seat_functional::第三排座椅功能;;co_pilot_rear_adjustable_button::老板键;;centre_armrest::前/后扶手;;rear_cup_holder::后排杯架;;hot_cold_cup_holder::可加热/制冷杯架;;second_row_seat_down_ratio::后排座椅放倒比例;;rear_seat_electric_down_v3::后排座椅电动放倒;;second_row_small_desktop_v2::第二排小桌板;;center_screen::中控彩色屏幕;;center_screen_size::中控屏尺寸;;gps::GPS导航系统;;navigation_system_v2::导航路况信息展示;;position_service::道路救援服务;;bluetooth_and_car_phone::蓝牙/车载电话;;mobile_system_v2::手机互联映射;;car_networking::车联网;;ota_upgrade_v3::OTA升级;;facial_recognition_v3::面部识别;;speech_recognition_system_v2::语音识别控制系统;;gesture_control_system_v2::手势控制功能;;wifi_v2::Wi-Fi热点;;audio_and_video_system::影音系统;;control_lcd_screen_display::中控分屏显示;;multimedia_interface::多媒体接口;;usb_typec_interface_count::USB/Type-C接口数量;;car_tv::车载电视;;rear_lcd_screen::后排液晶屏;;sound_brand::音响品牌;;speaker::扬声器数量(个);;rear_touch_control_system_v2::后排多媒体控制;;low_headlamp_type::近光灯;;high_headlamp_type::远光灯;;daytime_light::日间行车灯;;adaptive_light::自适应远近光;;auto_headlamp::自动大灯;;steer_assist_light::转向辅助灯;;front_fog_light::前雾灯;;headlamp_follow_up::大灯随动转向(AFS);;headlight_height_adjustment::大灯高度调节;;headlight_clean_function::大灯清洗功能;;interior_light_v2::车内氛围灯;;light_special_function_v2::灯光特色功能;;headlamp_delay_off_v3::大灯延时关闭;;headlamp_rain_fog_mode_v3::前大灯雨雾模式;;electric_window::电动车窗;;window_one_key_lift::车窗一键升降;;window_anti_clip_function::车窗防夹手功能;;exter_mirror_functional::外后视镜功能;;inside_mirror_functional::内后视镜功能;;car_window_sunshade_mirror::车内化妆镜;;backside_privacy_glass::后排隐私玻璃;;window_sunshade::车内遮阳帘;;rain_induction_wiper::雨量感应式雨刷;;rear_wiper::后雨刷;;rear_window_open_method::后窗玻璃开启;;multilayer_soundproof_glass_v2::多层隔音玻璃;;heated_nozzle_v3::可加热喷水嘴;;air_control_model::空调控制方式;;rear_independent_air_conditioning::后排独立空调;;rear_exhaust::后排出风口;;temperature_partition_control::温度分区控制;;air_purification::车内空气调节/花粉过滤;;car_purifier_v3::车载空气净化器;;pm25_filtrating_equipment_v2::车内PM2.5过滤装置;;negative_ion_generator_v2::负离子发生器;;car_fragrance_device_v2::车内香氛装置;;car_refrigerator::车载冰箱;;driving_assist_op_system_v4::辅助驾驶操作系统;;driving_assist_chip_v4::辅助驾驶芯片;;driving_assist_chip_computing_v4::辅助驾驶芯片算力(TOPS);;car_intelligent_system_v4::车载智能系统;;car_intelligent_chip_v4::车载智能芯片;;mobile_remote_control_v4::手机App远程控制;;heat_pump_management_system_v4::热泵管理系统;;camera_count_v4::摄像头数量;;ultrasonic_radar_v4::超声波雷达数量;;millimeter_wave_radar_v4::毫米波雷达数量;;laser_radar_v4::激光雷达数量;;high_precision_map_v4::高精度地图;;v2x_communication_v4::V2X通讯;;user_custom_pkg::定制选装;;electric_description::电动机;;energy_elect_max_power::最大功率(kW);;energy_elect_max_torque::最大扭矩(N·m);;wltc_fuel_comprehensive::WLTC综合油耗(L/100km);;ota_version::OTA版本;;center_down_screen_size::中控下屏幕尺寸;;vice_screen_size::副驾驶屏幕尺寸;;fuel_consumption::官方油耗(L);;first_owner_period::首任车主保修期限;;sliding_door::侧滑门;;constant_speed_mileage::等速续航里程(km);;approach_angle::接近角(°);;departure_angle::离去角(°);;max_grade::最大爬坡度(%);;traction_weight::牵引重量(kg);;container_length_width_height::货箱长×宽×高(mm);;box_treasure::货箱宝'
    var FIELDS = RAW_FIELDS.split(';;').map(s => s.split('::'))

    /**
     * 对CSV的字段值按照RFC4180规范进行标准化处理。
     * 只要包含CRLF（回车换行），英文逗号，英文双引号的字段值，必须用英文双引号包裹。
     * 字段中的英文双引号，需要用两个双引号转义。
     */
    function csvNormalize (s) {
        if (/[\r\n,"]/.test(s)) {
            return '"' + s.replace(/[\r\n]+/g, '\n').replaceAll('"', '""') + '"'
        }
        return s
    }

    /** 采集一页的车系基本信息
     * city_name: 城市名, fuel_form: 能源类型，price: 价格范围，pg: 页码
     */
    async function crawOnePage(city_name, fuel_form, price, pg) {
        var bd = `city_name=${encodeURIComponent(city_name)}&sort_new=hot_desc&limit=30&page=${pg}`
        if (price !== 'x') bd += '&price=' + encodeURIComponent(price.replace('!', '-'))
        if (fuel_form !== 'x') bd += '&fuel_form=' + fuel_form
        var params = { // 准备POST参数，为防止fetch切换到multipart/form-data，自己组装请求体
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bd
        }
        // 请求车系列表页JSON数据，并直接解析成js对象
        var data = await fetch('/motor/pc/car/brand/select_series_v2', params).then(r => r.json())
        return [data.data.series, data.data.series_count]
    }

    /** 采集一个车系的所有车型的详细参数表
     * id: 车系ID
     */
    async function crawOneSeries(id) {
        var txt = await fetch('/auto/params-carIds-x-' + id).then(r => r.text()) // 请求车系参数页，并转成文本
        var doc = new DOMParser().parseFromString(txt, 'text/html') // 将文本解析成DOM文档
        // 获取车型列表
        var cars = [...doc.querySelectorAll('div[class*=table_head__] a[class^=cell_car__')].map(n => [n.innerText])
        // console.log('-----------------\n', cars)
        var count = cars.length // 车型数量
        // var tabels = doc.body.querySelectorAll('div[name^=config-body]')
        //console.log("!!!!!!!!!!!!! " + doc.querySelectorAll('div[data-row-anchor]').length)
        var row = [...doc.querySelectorAll('div[data-row-anchor]')] // 查询所有表格的行，并转成数组
        // 将数组转成映射表，键为行的英文列头
        row = row.reduce((m, n) => (m[n.dataset.rowAnchor] = n, m), {}) // eslint-disable-line
        for (var [f] of FIELDS) {
            var r = row[f]
            if (r != null) { // 当前页面的行中存在此列头
                // document.querySelector('div[data-row-anchor=mobile_remote_control_v4]').querySelectorAll('div[class^=table_col__]')
                var cells = [...r.querySelectorAll('div[class^=table_col__]')] // 此行所有单元格
                cells = cells.filter(c => !/table_is-(label|nest)/.test(c.getAttribute('class'))) // 过滤掉列头，组头
                // 多行的按车型分割
                cells = cells.reduce((aa, c, i) => (aa[i % count].push(c.innerText.replace('\n', ' ')), aa), [...Array(count)].map(_ => [])) // eslint-disable-line
                cells = cells.map(aa => aa.join('\n')) // 使用回车连接多行
                cells = cells.map(c => csvNormalize(c)) // csv值标准化处理
                cars.forEach((cc, i) => cc.push(cells[i])) // eslint-disable-line
            } else { // 不存在此列头，使用N/A填充
                cars.forEach((cc) => cc.push('N/A'))
            }
        }
        // console.log('LLLLLLLLL > cars=' + cars.length + ',' + cars[0].length)
        return cars
        //return .map(r => r.dataset.rowAnchor + '::' + r.children[0].innerText)
    }

    /** 生成一个csv文件，并自动令浏览器开始下载
     */
    function csvDownload (csv) {
        csv = csv.map(e => e.join(',')).join('\n') // 二维数组转成csv格式文本
        var elem = document.createElement('a')
        //elem.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
        var blob = new Blob([csv]) // 必须使用Blob方式，否则收到URL长度限制
        elem.href = URL.createObjectURL(blob)
        elem.target = '_blank'
        elem.download = '懂车帝热门车型.csv'
        elem.click()
    }

    window.__mycraw__ = function() {
        var btn = document.getElementById('__mycraw__') // 获取按钮
        btn.innerHTML = '抓取中...'
        btn.disabled = true
        // 抓取当前城市
        var city = document.querySelector('div[class*=new-header_city__] button').innerText
        // 从当前页面地址中抓取价格区间和能源类型参数
        var param = location.href.split('/').splice(-1)[0].split('-')
        var price = param[0]
        var fuel_form = param[6]
        console.log(`查询条件：城市=${city}, 价格=${price}, 能源=${fuel_form}`)

        ;(async() => {
            var head = ['车型名称'].concat(FIELDS.map(e => e[1])) // 表头
            var csv = [head] // 所有车型详细参数
            var [all, count] = await crawOnePage(city, fuel_form, price, 1)
            var pgs = [...Array(~~(count / 30)).keys()].map((v, i) => i + 2)
            for await (var i of pgs) {
                var [data] = await crawOnePage(city, fuel_form, price, i)
                Array.prototype.push.apply(all, data)
            }
            console.log(`符合条件的车系共${all.length}个，开始抓取详细参数`)
            var ids = all.map((s, i) => [i, s.id]) // 车系ID
            for await (var [j, id] of ids) {
                btn.innerHTML = `抓取进度 ${j + 1}/${count}`
                var sdata = await crawOneSeries(id)
                Array.prototype.push.apply(csv, sdata)
            }
            btn.innerHTML = '抓取完成'
            csvDownload(csv)
            // console.log([...new Set(alldata)].join(';;'))
        })()
    }

    // 在页面筛选头部添加一个按钮，用来启动抓取
    var elem = document.querySelector('p[class^="sort_matched_"]')
    var src = elem.innerHTML
    elem.innerHTML = src + '<button id="__mycraw__" onclick="__mycraw__()" style="border:2px solid red;border-radius:3px;margin-left:8px;padding:0 4px;color:red">开始抓取</button>'

})();