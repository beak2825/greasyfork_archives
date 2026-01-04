// ==UserScript==
// @name        汉化vmshell
// @namespace   Violentmonkey Scripts
// @match       https://*.vmshell.com/*
// @version     1.0
// @author      -
// @description 汉化界面的部分菜单及内容
// @grant       none
// @author       sec
// @namespace    https://t.me/KingRan_qun
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498723/%E6%B1%89%E5%8C%96vmshell.user.js
// @updateURL https://update.greasyfork.org/scripts/498723/%E6%B1%89%E5%8C%96vmshell.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const i18n = new Map([

      ['1 Core', '1 核心'],
['2 Core', '2 核心'],
['Memory', '内存'],
['Disk', '磁盘'],
['Status', '状态'],
['Online', '在线'],
['IP Address', 'IP 地址'],
['Operating SystemDebian 11 X64', '操作系统Debian 11 X64'],
['KVM VPS Information', 'KVM VPS 信息'],
['TUN/TAP', 'TUN/TAP'],
['Enable', '启用'],
['Disable', '禁用'],
['VPS Cloud Control Panel', 'VPS 云控制面板'],
['Click Here', '点击此处'],
['Username', '用户名'],
['Password', '密码'],
['View Password', '查看密码'],
['Bandwidth', '带宽'],
['Graphs', '图表'],
['Payment Details', '付款详情'],
['Refresh', '刷新'],
['ReNew', '重新刷新'],
['Transfer', '转移'],
['Reboot', '重启'],
['Shutdown', '关机'],
['Boot', '启动'],
['Reconfigure Network', '重新配置网络'],
['Operating System', '操作系统'],
['Wyoming, United States', '美国怀俄明州'],
['Our Products', '我们的产品'],
['Web Hosting', '虚拟主机'],
['Dedicated Hosting', '专用主机'],
['VPS Hosting', 'VPS 托管'],
['Reseller Hosting', '分销主机'],
['Our Services', '我们的服务'],
['SSL Certificates', 'SSL 证书'],
['E-mail Services', '电子邮件服务'],
['Site Builder', '网站生成器'],
['Weebly Website Builder', 'Weebly 网站生成器'],

['IPv4 Address', 'IPv4 地址'],
['Virtualization Type', '虚拟化类型'],
['Hostname', '主机名'],
['带宽 Usage', '带宽 使用'],
['磁盘 Usage', '磁盘 使用'],
['Reinstall', '重新安装'],
['Reinstall', '重新安装'],
['AlmaLinux OS is an open-source, community-driven Linux operating system that fills the gap left by the discontinuation of the CentOS Linux stable release. AlmaLinux OS is an Enterprise Linux distro, ABI compatible with RHEL', 'AlmaLinux OS 是一个开源、社区驱动的 Linux 操作系统，填补了 CentOS Linux 稳定版停产后留下的空白。AlmaLinux OS 是一个企业级 Linux 发行版，ABI 兼容 RHEL'],
['and guided and built by the community. As a standalone, completely free OS, AlmaLinux OS enjoys ', '并由社区指导和构建。作为一个独立的、完全免费的操作系统，AlmaLinux OS 享有 '],
['1M in annual sponsorship from CloudLinux Inc. and support from more than 25 other sponsors. Ongoing development efforts are governed by the members of the community. The AlmaLinux OS Foundation is a 501', 'CloudLinux Inc. 每年 100 万美元的赞助，以及其他超过 25 家赞助商的支持。持续的开发工作由社区成员管理。AlmaLinux OS 基金会是一个 501'],
['non-profit created for the benefit of the AlmaLinux OS community.', '非营利组织，旨在为 AlmaLinux 操作系统社区谋福利。'],
['CentOS 7 is an open source server operating system released by the CentOS project. It was officially released on July 7, 2014. CentOS 7 is an enterprise-level Linux distribution, which is reissued from the free and open source code of RedHat. The CentOS 7 kernel is updated to 3.10.0, supports Linux containers, supports Open VMware Tools and 3D images out-of-the-box, supports OpenJDK-7 as the default JDK, supports iSCSI and FCoE in the kernel space, and supports PTPv2 and other functions. On November 12, 2020, the official version of CentOS 7 launched the final version of the series, CentOS 7.9.2009.', 'CentOS 7 是 CentOS 项目发布的开源服务器操作系统。它于 2014 年 7 月 7 日正式发布。CentOS 7 是一款企业级 Linux 发行版，由 RedHat 的免费开源代码重新发布。CentOS 7 内核更新至 3.10.0，支持 Linux 容器，支持开箱即用的开放式 VMware 工具和 3D 映像，支持 OpenJDK-7 作为默认 JDK，支持内核空间中的 iSCSI 和 FCoE，支持 PTPv2 等功能。2020 年 11 月 12 日，CentOS 7 正式版推出了该系列的最终版本 CentOS 7.9.2009。'],

['CentOS Stream is a Linux', 'CentOS Stream 是一个 Linux'],
['distribution that enables open source community members to join Red Hat developers to develop, test, and contribute upstream to the continuous delivery distribution for Red Hat? Enterprise Linux. ', '发行版，使开源社区成员能够与 Red Hat 开发人员一起开发、测试并为 Red Hat? 企业 Linux。'],
['Before releasing a new Red Hat Enterprise Linux release, Red Hat develops the Red Hat Enterprise Linux source code on the CentOS Stream development platform', '在发布新的 Red Hat Enterprise Linux 版本之前，Red Hat 会在 CentOS Stream 开发平台上开发 Red Hat Enterprise Linux 源代码。'],
['Red Hat Enterprise Linux 8 is the first major release built on CentOS Stream', 'Red Hat Enterprise Linux 8 是基于 CentOS Stream 开发的第一个重要版本。'],
['Debian 10, the GNOME desktop environment uses Wayland instead of Xorg as the display server by default. Because the Debian team believes that Wayland has a simpler and more modern design, and it also has advantages in terms of security. Even so, Debian 10 comes with the Xorg display server installed by default, and it is possible to choose which display server to use before starting a session', 'Debian 10 的 GNOME 桌面环境默认使用 Wayland 而不是 Xorg 作为显示服务器。因为 Debian 团队认为 Wayland 的设计更简单、更现代，而且在安全性方面也有优势。即便如此，Debian 10 还是默认安装了 Xorg 显示服务器，用户可以在启动会话前选择使用哪个显示服务器'],
['Debian GNU/Linux 11 "Bullseye" released many updated components and new GNU/Linux technologies to keep up with the times. It is powered by the Linux 5.10 LTS kernel series', '为了与时俱进，Debian GNU/Linux 11 "Bullseye "发布了许多更新组件和新的 GNU/Linux 技术。它采用 Linux 5.10 LTS 内核系列'],
['which will be supported for the next five years until December 2026, with improved hardware support.', '该内核将在未来五年内提供支持，直至 2026 年 12 月，并改进了硬件支持。'],
['AlmaLinux OS is an open-source, community-driven Linux operating system that fills the gap left by the discontinuation of the CentOS Linux stable release. AlmaLinux OS is an Enterprise Linux distro, ABI compatible with RHEL', 'AlmaLinux OS 是一个开源、社区驱动的 Linux 操作系统，填补了 CentOS Linux 稳定版停产后留下的空白。AlmaLinux OS 是一个企业级 Linux 发行版，ABI 兼容 RHEL'],
['and guided and built by the community. As a standalone, completely free OS, AlmaLinux OS enjoys ', '并由社区指导和构建。作为一个独立的、完全免费的操作系统，AlmaLinux OS 享有 '],
['1M in annual sponsorship from CloudLinux Inc. and support from more than 25 other sponsors. Ongoing development efforts are governed by the members of the community. The AlmaLinux OS Foundation is a 501', 'CloudLinux Inc. 每年 100 万美元的赞助，以及其他超过 25 家赞助商的支持。持续的开发工作由社区成员管理。AlmaLinux OS 基金会是一个 501'],
['non-profit created for the benefit of the AlmaLinux OS community.', '非营利组织，旨在为 AlmaLinux 操作系统社区谋福利。'],
['CentOS 7 is an open source server operating system released by the CentOS project. It was officially released on July 7, 2014. CentOS 7 is an enterprise-level Linux distribution, which is reissued from the free and open source code of RedHat. The CentOS 7 kernel is updated to 3.10.0, supports Linux containers, supports Open VMware Tools and 3D images out-of-the-box, supports OpenJDK-7 as the default JDK, supports iSCSI and FCoE in the kernel space, and supports PTPv2 and other functions. On November 12, 2020, the official version of CentOS 7 launched the final version of the series, CentOS 7.9.2009.', 'CentOS 7 是 CentOS 项目发布的开源服务器操作系统。它于 2014 年 7 月 7 日正式发布。CentOS 7 是一款企业级 Linux 发行版，由 RedHat 的免费开源代码重新发布。CentOS 7 内核更新至 3.10.0，支持 Linux 容器，支持开箱即用的开放式 VMware 工具和 3D 映像，支持 OpenJDK-7 作为默认 JDK，支持内核空间中的 iSCSI 和 FCoE，支持 PTPv2 等功能。2020 年 11 月 12 日，CentOS 7 正式版推出了该系列的最终版本 CentOS 7.9.2009。'],
['Ubuntu 18.04 LTS version was officially released on the 26th, the code name of Ubuntu 18.04 LTS is Bionic Beaver, Ubuntu 18.04 LTS is extremely efficient in the field of cloud computing. ', 'Ubuntu 18.04 LTS 版本于 26 日正式发布，Ubuntu 18.04 LTS 的代号为 Bionic Beaver，Ubuntu 18.04 LTS 在云计算领域非常高效。'],
['It is especially suitable for storage-intensive and compute-intensive tasks such as machine learning. Canonical will support this operating system until May 2023', '它尤其适用于存储密集型和计算密集型任务，如机器学习。Canonical将支持该操作系统至2023年5月'],
['Ubuntu 18.04 LTS uses version 4.15 of the Linux kernel and supports new features such as AMD secure memory encryption and improvements for SATA Link power management.', 'Ubuntu 18.04 LTS 使用 4.15 版 Linux 内核，支持 AMD 安全内存加密和 SATA Link 电源管理改进等新功能。'],
['Ubuntu 20.04 is the 8th LTS version of Ubuntu, code-named ', 'Ubuntu 20.04 是 Ubuntu 的第 8 个 LTS 版本，代号为 '],
['Focal Fossa', 'Focal Fossa'],
['This version will receive technical support for 5 years until April 2025. This long-term support version contains many enhanced security features', '该版本将获得 5 年的技术支持，直至 2025 年 4 月。这个长期支持版本包含许多增强的安全功能'],
['including Protection against low-level attacks and includes secure boot protection against rootkits and low-level attacks.', '包括针对低级攻击的保护，以及针对 rootkit 和低级攻击的安全启动保护。'],
['Settings', '设置'],
['CDRom', '光盘'],
['Drivers', '驱动程序'],
['Clock', '时钟'],
['Network', '网络'],
['API', '应用程序接口'],
['Statistics', '统计数据'],
['Change', '更改'],
['No API settings found. Click the button below to generate your connection settings.', '未找到 API 设置。单击下面的按钮生成连接设置。'],
['Generate', '生成'],
['Select a Time Span', '选择时间跨度'],




['Database Cluster', '数据库集群'],
      ['instances are good for full-duty workloads where consistent performance is important.', '实例适合对性能要求较高的全负荷工作。'],








      ['with your bank or credit card.', '.'],

    ])

    replaceText(document.body)
//   |
//  ₘₙⁿ
// ▏n
// █▏　､⺍             所以，不要停下來啊（指加入词条
// █▏ ⺰ʷʷｨ
// █◣▄██◣
// ◥██████▋
// 　◥████ █▎
// 　　███▉ █▎
// 　◢████◣⌠ₘ℩
// 　　██◥█◣\≫
// 　　██　◥█◣
// 　　█▉　　█▊
// 　　█▊　　█▊
// 　　█▊　　█▋
// 　　 █▏　　█▙
// 　　 █ ​
    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();