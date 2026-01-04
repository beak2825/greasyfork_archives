// ==UserScript==
// @name        AuTo Redeem Steamkey
// @namespace   HCLonely
// @author      HCLonely
// @description 复制网页中的Steamkey后自动激活，3.0+版本为Beta版
// @version     3.4.1
// @supportURL  https://keylol.com/t344489-1-1
// @homepage    https://blog.hclonely.com/posts/71381355/
// @iconURL     https://blog.hclonely.com/img/avatar.jpg
// @include     *://*/*
// @exclude     *store.steampowered.com/widget/*
// @exclude     *googleads*
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @run-at      document-idle
// @require     https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/sweetalert@2.1.2/dist/sweetalert.min.js
// @connect     *
// @compatible  chrome 没有测试其他浏览器的兼容性
// @downloadURL https://update.greasyfork.org/scripts/36666/AuTo%20Redeem%20Steamkey.user.js
// @updateURL https://update.greasyfork.org/scripts/36666/AuTo%20Redeem%20Steamkey.meta.js
// ==/UserScript==

"use strict";

// asfCmd.ts
var asfCommands = `
<table class="hclonely">
<thead>
<tr>
<th>命令</th>
<th>权限</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>2fa [Bots]</code></td>
<td><code>Master</code></td>
<td>为指定机器人生成临时的​<strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN">两步验证</a></strong>​令牌。</td>
</tr>
<tr>
<td><code>2fafinalize [Bots] &lt;ActivationCode&gt;</code></td>
<td><code>Master</code></td>
<td>使用短信或邮件验证码，完成为指定机器人绑定新<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN#%E5%88%9B%E5%BB%BA"><strong>两步验证</strong></a>凭据的流程。</td>
</tr>
<tr>
<td><code>2fafinalized [Bots] &lt;ActivationCode&gt;</code></td>
<td><code>Master</code></td>
<td>为指定机器人导入已创建完成的<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN#%E5%88%9B%E5%BB%BA"><strong>两步验证</strong></a>凭据，并用两步验证令牌代码验证。</td>
</tr>
<tr>
<td><code>2fafinalizedforce [Bots]</code></td>
<td><code>Master</code></td>
<td>为指定机器人导入已创建完成的<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN#%E5%88%9B%E5%BB%BA"><strong>两步验证</strong></a>凭据，并跳过两步验证令牌代码验证。</td>
</tr>
<tr>
<td><code>2fainit [Bots]</code></td>
<td><code>Master</code></td>
<td>开始为指定机器人绑定新<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN#%E5%88%9B%E5%BB%BA"><strong>两步验证</strong></a>凭据的流程。</td>
</tr>
<tr>
<td><code>2fano [Bots]</code></td>
<td><code>Master</code></td>
<td>为指定机器人拒绝所有等待操作的<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN"><strong>两步验证</strong></a>交易确认。</td>
</tr>
<tr>
<td><code>2faok [Bots]</code></td>
<td><code>Master</code></td>
<td>为指定机器人接受所有等待操作的<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Two-factor-authentication-zh-CN"><strong>两步验证</strong></a>交易确认。</td>
</tr>
<tr>
<td><code>addlicense [Bots] &lt;Licenses&gt;</code></td>
<td><code>Operator</code></td>
<td>为指定机器人激活给定的 <code>Licenses </code>（许可），该参数解释详见<a href="#addlicense-%E5%91%BD%E4%BB%A4%E7%9A%84-licenses-%E5%8F%82%E6%95%B0"><strong>下文</strong></a>。</td>
</tr>
<tr>
<td><code>balance [Bots]</code></td>
<td><code>Master</code></td>
<td>显示指定机器人的 Steam 钱包余额。</td>
</tr>
<tr>
<td><code>bgr [Bots]</code></td>
<td><code>Master</code></td>
<td>显示指定机器人的 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Background-games-redeemer-zh-CN">BGR</a></strong>（后台游戏激活器）队列信息。</td>
</tr>
<tr>
<td><code>bgrclear [Bots]</code></td>
<td><code>Master</code></td>
<td>清除指定机器人的<a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Background-games-redeemer-zh-CN"><strong>后台游戏激活器</strong></a>队列。</td>
</tr>
<tr>
<td><code>encrypt &lt;encryptionMethod&gt; &lt;stringToEncrypt&gt;</code></td>
<td><code>Owner</code></td>
<td>以给定的加密方式加密字符串——详见<a href="#encrypt-%E5%91%BD%E4%BB%A4"><strong>下文的解释</strong></a>。</td>
</tr>
<tr>
<td><code>exit</code></td>
<td><code>Owner</code></td>
<td>完全停止 ASF 进程。</td>
</tr>
<tr>
<td><code>farm [Bots]</code></td>
<td><code>Master</code></td>
<td>重新启动指定机器人的挂卡模块。</td>
</tr>
<tr>
<td><code>fb [Bots]</code></td>
<td><code>Master</code></td>
<td>列出指定机器人的自动挂卡黑名单。</td>
</tr>
<tr>
<td><code>fbadd [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>AppIDs</code> 加入指定机器人的自动挂卡黑名单。</td>
</tr>
<tr>
<td><code>fbrm [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>AppIDs</code> 从指定机器人的自动挂卡黑名单中移除。</td>
</tr>
<tr>
<td><code>fq [Bots]</code></td>
<td><code>Master</code></td>
<td>列出指定机器人的优先挂卡队列。</td>
</tr>
<tr>
<td><code>fqadd [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>AppIDs</code> 加入指定机器人的优先挂卡队列。</td>
</tr>
<tr>
<td><code>fqrm [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>AppIDs</code> 从指定机器人的优先挂卡队列中移除。</td>
</tr>
<tr>
<td><code>hash &lt;hashingMethod&gt; &lt;stringToHash&gt;</code></td>
<td><code>Owner</code></td>
<td>以指定的加密方式生成给定字符串的哈希值——详见<a href="#hash-%E5%91%BD%E4%BB%A4"><strong>下文的解释</strong></a>。</td>
</tr>
<tr>
<td><code>help</code></td>
<td><code>FamilySharing</code></td>
<td>显示帮助（指向此页面的链接）。</td>
</tr>
<tr>
<td><code>input [Bots] &lt;Type&gt; &lt;Value&gt;</code></td>
<td><code>Master</code></td>
<td>为指定机器人填写给定的输入值，仅在 <code>Headless</code> 模式中可用——详见<a href="#input-%E5%91%BD%E4%BB%A4"><strong>下文的解释</strong></a>。</td>
</tr>
<tr>
<td><code>inventory [Bots]</code></td>
<td><code>Operator</code></td>
<td>显示指定机器人的库存摘要。</td>
</tr>
<tr>
<td><code>level [Bots]</code></td>
<td><code>Master</code></td>
<td>显示指定机器人的 Steam 帐户等级。</td>
</tr>
<tr>
<td><code>loot [Bots]</code></td>
<td><code>Master</code></td>
<td>将指定机器人的所有 <code>LootableTypes</code> 社区物品拾取到其 <code>SteamUserPermissions</code> 属性中设置的 <code>Master</code> 用户（如果有多个则取 steamID 最小的）。</td>
</tr>
<tr>
<td><code>loot@ [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的所有符合给定 <code>AppIDs</code> 的 <code>LootableTypes</code> 社区物品拾取到其 <code>SteamUserPermissions</code> 属性中设置的 <code>Master</code> 用户（如果有多个则取 steamID 最小的）。 此命令与 <code>loot%</code> 相反。</td>
</tr>
<tr>
<td><code>loot% [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的所有不符合给定 <code>AppIDs</code> 的 <code>LootableTypes</code> 社区物品拾取到其 <code>SteamUserPermissions</code> 属性中设置的 <code>Master</code> 用户（如果有多个则取 steamID 最小的）。 此命令与 <code>loot@</code> 相反。</td>
</tr>
<tr>
<td><code>loot^ [Bots] &lt;AppID&gt; &lt;ContextID&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的 <code>ContextID</code> 库存分类中符合给定 <code>AppID</code> 的物品拾取到其 <code>SteamUserPermissions</code> 属性中设置的 <code>Master</code> 用户（如果有多个则取 steamID 最小的）。</td>
</tr>
<tr>
<td><code>loot&amp; [Bots] &lt;AppID&gt; &lt;ContextID&gt; &lt;Rarities&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的 <code>ContextID</code> 库存分类中符合给定 <code>AppID</code> 并且符合给定 <strong><a href="#%E5%B7%B2%E7%9F%A5%E7%9A%84%E7%A8%80%E6%9C%89%E5%BA%A6"><code>Rarities</code></a></strong> 的物品拾取到其 <code>SteamUserPermissions</code> 属性中设置的 <code>Master</code> 用户（如果有多个则取 steamID 最小的）。</td>
</tr>
<tr>
<td><code>mab [Bots]</code></td>
<td><code>Master</code></td>
<td>列出 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/ItemsMatcherPlugin-zh-CN#matchactively%E4%B8%BB%E5%8A%A8%E5%8C%B9%E9%85%8D"><code>MatchActively</code></a></strong> 自动交易的 App 黑名单。</td>
</tr>
<tr>
<td><code>mabadd [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>AppIDs</code> 加入到 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/ItemsMatcherPlugin-zh-CN#matchactively%E4%B8%BB%E5%8A%A8%E5%8C%B9%E9%85%8D"><code>MatchActively</code></a></strong> 自动交易的 App 黑名单。</td>
</tr>
<tr>
<td><code>mabrm [Bots] &lt;AppIDs&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>AppIDs</code> 从 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/ItemsMatcherPlugin-zh-CN#matchactively%E4%B8%BB%E5%8A%A8%E5%8C%B9%E9%85%8D"><code>MatchActively</code></a></strong> 自动交易的 App 黑名单中移除。</td>
</tr>
<tr>
<td><code>match [Bots]</code></td>
<td><code>Master</code></td>
<td>控制 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/ItemsMatcherPlugin-zh-CN#matchactively%E4%B8%BB%E5%8A%A8%E5%8C%B9%E9%85%8D"><code>ItemsMatcherPlugin</code></a></strong> 的特殊命令，用于立即触发 <code>MatchActively</code> 流程。</td>
</tr>
<tr>
<td><code>nickname [Bots] &lt;Nickname&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的昵称更改为 <code>Nickname</code>。</td>
</tr>
<tr>
<td><code>owns [Bots] &lt;Games&gt;</code></td>
<td><code>Operator</code></td>
<td>检查指定机器人是否已拥有 <code>Games</code>，该参数解释详见<a href="#owns-%E5%91%BD%E4%BB%A4%E7%9A%84-games-%E5%8F%82%E6%95%B0"><strong>下文</strong></a>。</td>
</tr>
<tr>
<td><code>pause [Bots]</code></td>
<td><code>Operator</code></td>
<td>永久暂停指定机器人的自动挂卡模块。 ASF 在本次会话中将不会再尝试对此帐户进行挂卡，除非您手动 <code>resume</code> 或者重启 ASF。</td>
</tr>
<tr>
<td><code>pause~ [Bots]</code></td>
<td><code>FamilySharing</code></td>
<td>临时暂停指定机器人的自动挂卡模块。 挂卡进程将会在下次游戏事件或者机器人断开连接时自动恢复。 您可以 <code>resume</code> 以恢复挂卡。</td>
</tr>
<tr>
<td><code>pause&amp; [Bots] &lt;Seconds&gt;</code></td>
<td><code>Operator</code></td>
<td>临时暂停指定机器人的自动挂卡模块 <code>Seconds</code> 秒。 之后，挂卡模块会自动恢复。</td>
</tr>
<tr>
<td><code>play [Bots] &lt;AppIDs,GameName&gt;</code></td>
<td><code>Master</code></td>
<td>切换到手动挂卡——使指定机器人运行给定的 <code>AppIDs</code>，并且可选自定义 <code>GameName</code> 为游戏名称。 若要此功能正常工作，您的 Steam 帐户<strong>必须</strong>拥有所有您指定的 <code>AppIDs</code> 的有效许可，包括免费游戏。 使用 <code>reset</code> 或 <code>resume</code> 命令恢复。</td>
</tr>
<tr>
<td><code>points [Bots]</code></td>
<td><code>Master</code></td>
<td>显示指定机器人的 <a href="https://store.steampowered.com/points/shop" rel="nofollow"><strong>Steam 点数商店</strong></a>点数余额。</td>
</tr>
<tr>
<td><code>privacy [Bots] &lt;Settings&gt;</code></td>
<td><code>Master</code></td>
<td>更改指定机器人的 <strong><a href="https://steamcommunity.com/my/edit/settings" rel="nofollow">Steam 隐私设置</a></strong>，可用选项见<a href="#privacy-%E8%AE%BE%E7%BD%AE"><strong>下文</strong></a>。</td>
</tr>
<tr>
<td><code>redeem [Bots] &lt;Keys&gt;</code></td>
<td><code>Operator</code></td>
<td>为指定机器人激活给定的游戏序列号或钱包充值码。</td>
</tr>
<tr>
<td><code>redeem^ [Bots] &lt;Modes&gt; &lt;Keys&gt;</code></td>
<td><code>Operator</code></td>
<td>以 <code>Modes</code> 模式为指定机器人激活给定的游戏序列号或钱包充值码，模式详见下文的<a href="#redeem-%E6%A8%A1%E5%BC%8F"><strong>解释</strong></a>。</td>
</tr>
<tr>
<td><code>redeempoints [Bots] &lt;DefinitionIDs&gt;</code></td>
<td><code>Operator</code></td>
<td>为指定机器人以 <a href="https://store.steampowered.com/points/shop" rel="nofollow"><strong>Steam 点数</strong></a>兑换给定物品。 默认只允许免费物品，如果要无条件兑换物品，包括付费物品，则需要在每个符合条件的物品 <code>DefinitionID</code> 结尾添加 <code>!</code> 符号。</td>
</tr>
<tr>
<td><code>reset [Bots]</code></td>
<td><code>Master</code></td>
<td>重置为原始（之前的）游玩状态，用来配合 <code>play</code> 命令的手动挂卡模式使用。</td>
</tr>
<tr>
<td><code>restart</code></td>
<td><code>Owner</code></td>
<td>重新启动 ASF 进程。</td>
</tr>
<tr>
<td><code>resume [Bots]</code></td>
<td><code>FamilySharing</code></td>
<td>恢复指定机器人的自动挂卡进程。</td>
</tr>
<tr>
<td><code>start [Bots]</code></td>
<td><code>Master</code></td>
<td>启动指定机器人。</td>
</tr>
<tr>
<td><code>stats</code></td>
<td><code>Owner</code></td>
<td>显示进程统计信息，例如托管内存用量。</td>
</tr>
<tr>
<td><code>status [Bots]</code></td>
<td><code>FamilySharing</code></td>
<td>显示指定机器人的状态。</td>
</tr>
<tr>
<td><code>std [Bots]</code></td>
<td><code>Master</code></td>
<td>控制 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/SteamTokenDumperPlugin-zh-CN"><code>SteamTokenDumperPlugin</code></a></strong> 的特殊命令，用于触发刷新指定的机器人并立即提交数据。</td>
</tr>
<tr>
<td><code>stop [Bots]</code></td>
<td><code>Master</code></td>
<td>停止指定机器人。</td>
</tr>
<tr>
<td><code>tb [Bots]</code></td>
<td><code>Master</code></td>
<td>列出指定机器人的交易黑名单用户。</td>
</tr>
<tr>
<td><code>tbadd [Bots] &lt;SteamIDs64&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>SteamIDs</code> 加入指定机器人的交易黑名单。</td>
</tr>
<tr>
<td><code>tbrm [Bots] &lt;SteamIDs64&gt;</code></td>
<td><code>Master</code></td>
<td>将给定的 <code>SteamIDs</code> 从指定机器人的交易黑名单中移除。</td>
</tr>
<tr>
<td><code>transfer [Bots] &lt;TargetBot&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的所有 <code>TransferableTypes</code> 社区物品转移到一个目标机器人。</td>
</tr>
<tr>
<td><code>transfer@ [Bots] &lt;AppIDs&gt; &lt;TargetBot&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的所有符合给定 <code>AppIDs</code> 的 <code>TransferableTypes</code> 社区物品转移到一个目标机器人。 此命令与 <code>transfer%</code> 相反。</td>
</tr>
<tr>
<td><code>transfer% [Bots] &lt;AppIDs&gt; &lt;TargetBot&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的所有不符合给定 <code>AppIDs</code> 的 <code>TransferableTypes</code> 社区物品转移到一个目标机器人。 此命令与 <code>transfer@</code> 相反。</td>
</tr>
<tr>
<td><code>transfer^ [Bots] &lt;AppID&gt; &lt;ContextID&gt; &lt;TargetBot&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的 <code>ContextID</code> 库存分类中符合给定 <code>AppID</code> 的物品转移到一个目标机器人。</td>
</tr>
<tr>
<td><code>transfer&amp; [Bots] &lt;AppID&gt; &lt;ContextID&gt; &lt;TargetBot&gt; &lt;Rarities&gt;</code></td>
<td><code>Master</code></td>
<td>将指定机器人的 <code>ContextID</code> 库存分类中符合给定 <code>AppID</code> 并且符合给定 <strong><a href="#%E5%B7%B2%E7%9F%A5%E7%9A%84%E7%A8%80%E6%9C%89%E5%BA%A6"><code>Rarities</code></a></strong> 的物品转移到一个目标机器人。</td>
</tr>
<tr>
<td><code>unpack [Bots]</code></td>
<td><code>Master</code></td>
<td>拆开指定机器人库存中的所有补充包。</td>
</tr>
<tr>
<td><code>update [Channel]</code></td>
<td><code>Owner</code></td>
<td>在 GitHub 上检查 ASF 新版本，如果可用则更新。 通常这会每隔 <code>UpdatePeriod</code> 自动执行一次。 可选的 <code>Channel</code> 参数指定 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration-zh-CN#updatechannel"><code>UpdateChannel</code></a></strong>，如果未提供，则默认使用全局设置中的值。 <code>Channel</code> 可以用 <code>!</code> 字符结尾，这会强制在指定频道上更新——包括降级等操作。</td>
</tr>
<tr>
<td><code>updateplugins [Channel] [Plugins]</code></td>
<td><code>Owner</code></td>
<td>更新指定的插件。 如果插件支持多个更新频道，可选的 <code>Channel</code> 参数允许您选择不同的 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration-zh-CN#updatechannel"><code>UpdateChannel</code></a></strong> 进行更新。 <code>Channel</code> 可以用 <code>!</code> 字符结尾，这会强制在指定频道上更新——包括降级等操作，但具体的功能取决于插件自身。 如果不指定 <code>Plugins</code>，则所有由 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration-zh-CN#pluginsupdatelist"><code>PluginsUpdateList</code></a></strong> 和 <strong><a href="https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration-zh-CN#pluginsupdatemode"><code>PluginsUpdateMode</code></a></strong> 配置判断为允许自动更新的插件都会被更新。 如果您要更新指定插件，特别是已经默认禁用自动更新的，则需要同时提供 <code>Channel</code> 和 <code>Plugins</code> 参数，这样 ASF 就会忽略其自动更新设置，强行更新它们。</td>
</tr>
<tr>
<td><code>version</code></td>
<td><code>FamilySharing</code></td>
<td>显示 ASF 的版本号。</td>
</tr>
</tbody>
</table>
`;

// asf.ts
var getASFConfig = (setting) => ({
  protocol: setting.asfProtocol,
  host: setting.asfHost,
  port: setting.asfPort,
  password: setting.asfPassword
});
var getASFHeaders = (setting) => {
  const { protocol, host, port } = getASFConfig(setting);
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authentication: setting.asfPassword,
    Host: `${host}:${port}`,
    Origin: `${protocol}://${host}:${port}`,
    Referer: `${protocol}://${host}:${port}/page/commands`
  };
};
var getASFUrl = (setting) => {
  const { protocol, host, port } = getASFConfig(setting);
  return `${protocol}://${host}:${port}/Api/Command`;
};
function asfSend(command = "") {
  const setting = GM_getValue("setting") || globalThis.defaultSetting;
  if (!setting?.asf) {
    swal({
      closeOnClickOutside: false,
      className: "swal-user",
      icon: "warning",
      title: "此功能需要在设置中配置ASF IPC并开启ASF功能！",
      //@ts-ignore
      buttons: {
        confirm: "确定"
      }
    });
    return;
  }
  swal({
    closeOnClickOutside: false,
    className: "swal-user",
    text: "请在下方输入要执行的ASF指令：",
    content: {
      element: "input",
      attributes: {
        placeholder: "输入ASF指令"
      }
    },
    //@ts-ignore
    buttons: {
      test: "连接测试",
      redeem: "激活key",
      pause: "暂停挂卡",
      resume: "恢复挂卡",
      "2fa": "获取令牌",
      "2faok": "2faok",
      more: "更多ASF指令",
      confirm: "确定",
      cancel: "取消"
    }
  }).then((value) => {
    switch (value) {
      case "redeem":
        swalRedeem();
        break;
      case "pause":
      case "resume":
      case "2fa":
      case "2faok":
        asfRedeem(`!${value}`);
        break;
      case "test":
        asfTest();
        break;
      case "more":
        swal({
          closeOnClickOutside: false,
          className: "swal-user",
          text: "ASF指令",
          //@ts-ignore
          content: $(asfCommands)[0],
          //@ts-ignore
          buttons: {
            confirm: "返回",
            cancel: "关闭"
          }
        }).then((value2) => {
          if (value2) asfSend();
        });
        $("table.hclonely button.swal-button").on("click", function() {
          const command2 = setting.asfBot ? $(this).parent().next().text().trim().replace(/<Bots>/gim, setting.asfBot) : $(this).parent().next().text().trim();
          asfSend(command2);
        });
        break;
      case null:
        break;
      default:
        const inputValue = $(".swal-content__input").val()?.toString()?.trim();
        if (!inputValue) {
          swal({
            closeOnClickOutside: false,
            title: "ASF指令不能为空！",
            icon: "warning",
            //@ts-ignore
            buttons: {
              confirm: "确定"
            }
          }).then(() => {
            asfSend(command);
          });
        } else {
          const finalCommand = value || inputValue;
          if (finalCommand) asfRedeem(finalCommand);
        }
        break;
    }
  });
  if (command) {
    $(".swal-content__input").val(`!${command}`);
  }
}
function swalRedeem() {
  swal({
    closeOnClickOutside: false,
    className: "swal-user",
    title: "请输入要激活的key:",
    //@ts-ignore
    content: $('<textarea id="keyText" class="asf-output"></textarea>')[0],
    //@ts-ignore
    buttons: {
      confirm: "激活",
      cancel: "返回"
    }
  }).then((value) => {
    if (value) {
      const key = getKeysByRE($("#keyText").val()?.toString()?.trim() || "");
      if (key.length > 0) {
        const setting = GM_getValue("setting") || globalThis.defaultSetting;
        const asfBot = setting.asfBot ? `${setting.asfBot} ` : "";
        asfRedeem(`!redeem ${asfBot}${key.join(",")}`);
      } else {
        swal({
          closeOnClickOutside: false,
          title: "steam key不能为空！",
          icon: "error",
          //@ts-ignore
          buttons: {
            confirm: "返回",
            cancel: "关闭"
          }
        }).then((value2) => {
          if (value2) {
            swalRedeem();
          }
        });
      }
    } else {
      asfSend();
    }
  });
}
function asfTest() {
  const setting = GM_getValue("setting") || globalThis.defaultSetting;
  if (!setting.asf) {
    swal({
      closeOnClickOutside: false,
      title: "请先在设置中开启ASF功能",
      icon: "warning",
      //@ts-ignore
      buttons: {
        confirm: "确定"
      }
    });
    return;
  }
  const apiUrl = getASFUrl(setting);
  swal({
    closeOnClickOutside: false,
    title: "ASF连接测试",
    text: `正在尝试连接 "${apiUrl}"`,
    //@ts-ignore
    buttons: {
      confirm: "确定"
    }
  });
  GM_xmlhttpRequest({
    method: "POST",
    url: apiUrl,
    data: '{"Command":"!stats"}',
    responseType: "json",
    headers: getASFHeaders(setting),
    onload(data) {
      const response = data.response;
      if (data.status === 200) {
        if (response?.Success === true && response.Message === "OK" && response.Result) {
          swal({
            closeOnClickOutside: false,
            title: "ASF连接成功！",
            icon: "success",
            text: `连接地址 "${apiUrl}" 
返回内容 "${response.Result.trim()}"`,
            //@ts-ignore
            buttons: {
              confirm: "确定"
            }
          });
        } else if (response?.Message) {
          swal({
            closeOnClickOutside: false,
            title: "ASF连接成功？",
            icon: "info",
            text: `连接地址 "${apiUrl}" 
返回内容 "${response.Message.trim()}"`,
            //@ts-ignore
            buttons: {
              confirm: "确定"
            }
          });
        } else {
          swal({
            closeOnClickOutside: false,
            title: "ASF连接失败！",
            icon: "error",
            text: `连接地址 "${apiUrl}" 
返回内容 "${data.responseText}"`,
            //@ts-ignore
            buttons: {
              confirm: "确定"
            }
          });
        }
      } else {
        swal({
          closeOnClickOutside: false,
          title: `ASF连接失败：${data.status}`,
          icon: "error",
          text: `连接地址 "${apiUrl}"`,
          //@ts-ignore
          buttons: {
            confirm: "确定"
          }
        });
      }
    },
    onabort() {
      showErrorDialog("ASF连接失败：aborted", apiUrl);
    },
    onerror() {
      showErrorDialog("ASF连接失败：error", apiUrl);
    },
    ontimeout() {
      showErrorDialog("ASF连接失败：timeout", apiUrl);
    }
  });
}
function showErrorDialog(title, apiUrl) {
  swal({
    closeOnClickOutside: false,
    title,
    icon: "error",
    text: `连接地址 "${apiUrl}"`,
    //@ts-ignore
    buttons: {
      confirm: "确定"
    }
  });
}
function asfRedeem(command) {
  const setting = GM_getValue("setting") || globalThis.defaultSetting;
  const apiUrl = getASFUrl(setting);
  const textarea = document.createElement("textarea");
  textarea.setAttribute("class", "asf-output");
  textarea.setAttribute("readonly", "readonly");
  const btn = /!redeem/gim.test(command) ? { confirm: "提取未使用key", cancel: "关闭" } : { confirm: "确定" };
  swal({
    closeOnClickOutside: false,
    className: "swal-user",
    text: `正在执行ASF指令：${command}`,
    //@ts-ignore
    content: textarea,
    //@ts-ignore
    buttons: btn
  }).then((v) => {
    if (/!redeem/gim.test(command)) {
      let value = "";
      const textareaElement = $(".swal-content textarea");
      if (textareaElement.length > 0) {
        value = textareaElement.val()?.toString() || "";
      }
      GM_setValue("history", [$(".swal-content").html() || "", value]);
      if (v) {
        const unUseKey = textareaElement.val()?.toString()?.split(/[(\r\n)\r\n]+/).filter((e) => /未使用/gim.test(e || "")).join(",");
        if (unUseKey) {
          GM_setClipboard(arr(getKeysByRE(unUseKey)).join(","));
          swal({ title: "复制成功！", icon: "success" });
        }
      }
    }
  });
  GM_xmlhttpRequest({
    method: "POST",
    url: apiUrl,
    data: JSON.stringify({ Command: command }),
    responseType: "json",
    headers: getASFHeaders(setting),
    onload(data) {
      console.log(data);
      console.log(command);
      if (data.status === 200) {
        if (data.response?.Success && data.response.Message === "OK" && data.response.Result) {
          textarea.value += `${data.response.Result.trim()} 
`;
        } else if (data.response?.Message) {
          textarea.value += `${data.response.Message.trim()} 
`;
        } else {
          textarea.value += data.responseText || "";
        }
      } else {
        swal({
          closeOnClickOutside: false,
          className: "swal-user",
          title: `执行ASF指令(${command})失败！请检查ASF配置是否正确！`,
          text: data.responseText || data.status.toString(),
          icon: "error",
          //@ts-ignore
          buttons: {
            confirm: "关闭"
          }
        });
      }
    },
    onabort() {
      swal({
        closeOnClickOutside: false,
        className: "swal-user",
        title: `执行ASF指令(${command})失败！请检查网络！`,
        text: "aborted",
        icon: "error",
        //@ts-ignore
        buttons: {
          confirm: "关闭"
        }
      });
    },
    onerror(error) {
      console.error(error);
      swal({
        closeOnClickOutside: false,
        className: "swal-user",
        title: `执行ASF指令(${command})失败！请检查控制台日志！`,
        text: "error",
        icon: "error",
        //@ts-ignore
        buttons: {
          confirm: "关闭"
        }
      });
    },
    ontimeout() {
      swal({
        closeOnClickOutside: false,
        className: "swal-user",
        title: `执行ASF指令(${command})失败！请检查网络！`,
        text: "连接超时",
        icon: "error",
        //@ts-ignore
        buttons: {
          confirm: "关闭"
        }
      });
    }
  });
}

// utils.ts
function mouseClick($2, e) {
  const $i = $2("<span/>").text("Steam Key");
  const x = e.pageX;
  const y = e.pageY;
  $i.css({
    "z-index": 999999999999999,
    top: y - 20,
    left: x,
    position: "absolute",
    "font-weight": "bold",
    color: "#ff6651"
  });
  $2("body").append($i);
  $i.animate({ top: y - 180, opacity: 0 }, 1500, () => {
    $i.remove();
  });
}
function addBtn() {
  const div = $('<div id="keyDiv" style="position:fixed;left:5px;bottom:5px"></div>');
  const btn = $('<button id="allKey" class="btn btn-default" key="" style="display:none;z-index:9999">激活本页面所有key(共0个)</button>')[0];
  btn.onclick = function() {
    const setting = GM_getValue("setting") || {};
    const keys = getKeysByRE($(this).attr("key") || "");
    if (setting.asf) {
      asfRedeem(`!redeem ${setting.asfBot} ${keys.join(",")}`);
    } else if (setting.newTab) {
      window.open(`https://store.steampowered.com/account/registerkey?key=${keys.join(",")}`, "_blank");
    } else {
      webRedeem(keys.join(","));
    }
  };
  div.append(btn);
  $("body").append(div);
  return btn;
}
function redeemAllKey() {
  let len = 0;
  let keyList = "";
  let hasKey = [];
  const btn = addBtn();
  setInterval(() => {
    const allSteamKey = arr(getKeysByRE($("body").text() || "")) || [];
    len = allSteamKey.length;
    if (len > 0) {
      hasKey.push(...allSteamKey);
      hasKey = arr(hasKey);
      keyList = hasKey.join(",");
      if ($(btn).attr("key") !== keyList) {
        $(btn).attr("key", keyList).text(`激活本页面所有key(共${hasKey.length}个)`).show();
      }
    } else if (document.getElementById("allKey")?.style?.display === "block") {
      $(btn).hide().text("激活本页面所有key(共0个)");
    }
  }, 1e3);
}
function arr(arr2) {
  return [...new Set(arr2)];
}
async function httpRequest(options, times = 0) {
  if (window.TRACE) {
    console.trace("%cAuto-Task[Debug]:", "color:blue");
  }
  try {
    const result = await new Promise((resolve) => {
      if (options.dataType) {
        options.responseType = options.dataType;
      }
      const requestObj = {
        timeout: 3e4,
        ontimeout(data) {
          resolve({
            result: "Error",
            statusText: "Timeout",
            status: 601,
            data,
            options
          });
        },
        onabort(data) {
          resolve({
            result: "Error",
            statusText: "Aborted",
            status: 602,
            data,
            options
          });
        },
        onerror(data) {
          resolve({
            result: "Error",
            statusText: "Error",
            status: 603,
            data,
            options
          });
        },
        onload(data) {
          if (options.responseType === "json" && data?.responseText && typeof data.response !== "object") {
            try {
              data.response = JSON.parse(data.responseText);
            } catch (error) {
            }
          }
          resolve({
            result: "Success",
            statusText: "Load",
            status: 600,
            data,
            options
          });
        },
        ...options
      };
      GM_xmlhttpRequest(requestObj);
    });
    if (window.DEBUG) {
      console.log("%cAuto-Task[httpRequest]:", "color:blue", JSON.stringify(result));
    }
    if (result.status !== 600 && times < 2) {
      return await httpRequest(options, times + 1);
    }
    return result;
  } catch (error) {
    console.log("%cAuto-Task[httpRequest]:", "color:red", JSON.stringify({
      errorMsg: error,
      options
    }));
    return {
      result: "JsError",
      statusText: "Error",
      status: 604,
      error,
      options
    };
  }
}
function settingChange() {
  const setting = GM_getValue("setting") || globalThis.defaultSetting;
  const div = $(`
      <div id="hclonely-asf">
        <input type="checkbox" name="newTab" ${setting.newTab ? "checked=checked" : ""} title="开启ASF激活后此功能无效"/>
        <span title="开启ASF激活后此功能无效">新标签页激活</span>
        <br/>
        <input type="checkbox" name="copyListen" ${setting.copyListen ? "checked=checked" : ""} title="复制key时询问是否激活"/>
        <span title="复制key时询问是否激活">开启复制捕捉</span>
        <input type="checkbox" name="selectListen" ${setting.selectListen ? "checked=checked" : ""} title="选中key时显示激活图标"/>
        <span title="选中key时显示激活图标">开启选中捕捉</span>
        <input type="checkbox" name="clickListen" ${setting.clickListen ? "checked=checked" : ""} title="点击key时添加激活链接"/>
        <span title="点击key时添加激活链接">开启点击捕捉</span><br/>
        <input type="checkbox" name="allKeyListen" ${setting.allKeyListen ? "checked=checked" : ""} title="匹配页面内所有符合steam key格式的内容"/>
        <span title="匹配页面内所有符合steam key格式的内容">捕捉页面内所有key</span>
        <div class="swal-title">ASF IPC设置</div>
        <span>ASF IPC协议</span><input type="text" name="asfProtocol" value='${setting.asfProtocol}' placeholder="http或https,默认为http"/>
        <br/>
        <span>ASF IPC地址</span><input type="text" name="asfHost" value='${setting.asfHost}' placeholder="ip地址或域名,默认为127.0.0.1"/>
        <br/>
        <span>ASF IPC端口</span><input type="text" name="asfPort" value='${setting.asfPort}' placeholder="默认1242"/>
        <br/>
        <span>ASF IPC密码</span><input type="text" name="asfPassword" value='${setting.asfPassword}' placeholder="ASF IPC密码"/>
        <br/>
        <span>ASF Bot名字</span><input type="text" name="asfBot" value='${setting.asfBot}' placeholder="ASF Bot name,可留空"/>
        <br/>
        <input type="checkbox" name="asf" ${setting.asf ? "checked=checked" : ""} title="此功能默认关闭新标签页激活"/>
        <span title="此功能默认关闭新标签页激活">开启ASF激活</span>
      </div>`)[0];
  swal({
    closeOnClickOutside: false,
    className: "asf-class",
    title: "全局设置",
    content: div,
    buttons: {
      save: "保存",
      showHistory: "上次激活记录",
      showSwitchKey: "Key格式转换",
      cancel: "取消"
    }
  }).then((value) => {
    if (value === "save") {
      const newSetting = {};
      $("#hclonely-asf input").each(function(index, element) {
        const name = $(element).attr("name");
        if (name) {
          newSetting[name] = element.type === "checkbox" ? element.checked : element.value;
        }
      });
      GM_setValue("setting", newSetting);
      swal({
        closeOnClickOutside: false,
        icon: "success",
        title: "保存成功！",
        text: "刷新页面后生效！",
        buttons: {
          confirm: "确定"
        }
      });
    } else if (value === "showHistory") {
      showHistory();
    } else if (value === "showSwitchKey") {
      showSwitchKey();
    }
  });
}
function showHistory() {
  const history = GM_getValue("history");
  if (Array.isArray(history)) {
    swal({
      closeOnClickOutside: false,
      className: "swal-user",
      title: "上次激活记录：",
      content: $(history[0])[0],
      buttons: {
        confirm: "确定"
      }
    });
    if (history[1]) {
      $(".swal-content textarea").val(history[1]);
    }
  } else {
    swal({
      closeOnClickOutside: false,
      title: "没有操作记录！",
      icon: "error",
      buttons: {
        cancel: "关闭"
      }
    });
  }
}
function showSwitchKey() {
  swal({
    closeOnClickOutside: false,
    title: "请选择要转换成什么格式：",
    buttons: {
      confirm: "确定",
      cancel: "关闭"
    },
    content: $('<div class="switch-key"><div class="switch-key-left"><p>key</p><p>key</p><p>key</p><input name="keyType" type="radio" value="1"/></div><div class="switch-key-right"><p>&nbsp;</p><p>key,key,key</p><p>&nbsp;</p><input name="keyType" type="radio" value="2"/></div></div>')[0]
  }).then((value) => {
    if (value) {
      const selectedValue = $("input:radio:checked").val();
      if (selectedValue) {
        showSwitchArea(selectedValue);
      } else {
        swal({
          closeOnClickOutside: false,
          title: "请选择要将key转换成什么格式！",
          icon: "warning"
        }).then(() => showSwitchKey());
      }
    }
  });
  $(".switch-key div").each(function() {
    $(this).on("click", function() {
      $(this).find("input")[0].click();
    });
  });
}
function showSwitchArea(type) {
  swal({
    closeOnClickOutside: false,
    title: "请输入要转换的key:",
    content: $('<textarea style="width: 80%;height: 100px;"></textarea>')[0],
    buttons: {
      confirm: "转换",
      back: "返回",
      cancel: "关闭"
    }
  }).then((value) => {
    if (value === "back") {
      showSwitchKey();
    } else if (value) {
      const inputKey = $(".swal-content textarea").val();
      if (inputKey) {
        switchKey(inputKey, type);
      }
    }
  });
}
function switchKey(key, type) {
  switch (type) {
    case "1":
      showKey(getKeysByRE(key).join("\n"), type);
      break;
    case "2":
      showKey(getKeysByRE(key).join(","), type);
      break;
    default:
      break;
  }
}
function showKey(key, type) {
  swal({
    closeOnClickOutside: false,
    icon: "success",
    title: "转换成功！",
    content: $(`<textarea style="width: 80%;height: 100px;" readonly="readonly">${key}</textarea>`)[0],
    buttons: {
      confirm: "返回",
      cancel: "关闭"
    }
  }).then((value) => {
    if (value) {
      showSwitchArea(type);
    }
  });
  $(".swal-content textarea").on("click", function() {
    this.select();
  });
}
function getKeysByRE(text) {
  text = text.trim().toUpperCase();
  const reg = new RegExp("([0-9A-Z]{5}-){2,4}[0-9A-Z]{5}", "g");
  const keys = [];
  let result;
  while (result = reg.exec(text)) {
    keys.push(result[0]);
  }
  return keys;
}

// steamWeb.ts
var STEAM_HOSTS = {
  STORE: "store.steampowered.com",
  LOGIN: "login.steampowered.com"
};
var handleError = (error, message) => {
  console.error(`${message}:`, error);
  return false;
};
async function refreshToken() {
  try {
    const formData = new FormData();
    formData.append("redir", `https://${STEAM_HOSTS.STORE}/`);
    const response = await httpRequest({
      url: `https://${STEAM_HOSTS.LOGIN}/jwt/ajaxrefresh`,
      method: "POST",
      responseType: "json",
      headers: {
        Host: STEAM_HOSTS.LOGIN,
        Origin: `https://${STEAM_HOSTS.STORE}`,
        Referer: `https://${STEAM_HOSTS.STORE}/`
      },
      data: formData
    });
    if (response.result === "Success" && response.data?.response?.success) {
      return await setStoreToken(response.data.response);
    }
    return false;
  } catch (error) {
    return handleError(error, "Failed to refresh token");
  }
}
async function setStoreToken(param) {
  try {
    const host = "store.steampowered.com";
    const formData = new FormData();
    formData.append("steamID", param.steamID);
    formData.append("nonce", param.nonce);
    formData.append("redir", param.redir);
    formData.append("auth", param.auth);
    const { result, statusText, status, data } = await httpRequest({
      url: `https://${host}/login/settoken`,
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        Host: host,
        Origin: `https://${host}`
        // Referer: `https://${host}/login`
      },
      data: formData
    });
    if (result === "Success") {
      if (data?.status === 200) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function updateStoreAuth(retry = false) {
  try {
    const { result, statusText, status, data } = await httpRequest({
      url: "https://store.steampowered.com/",
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Upgrade-Insecure-Requests": "1"
      },
      fetch: false,
      redirect: "manual"
    });
    if (data?.status === 200) {
      if (!data.responseText.includes("data-miniprofile=")) {
        if (await refreshToken()) {
          if (retry) {
            return false;
          }
          return updateStoreAuth(true);
        }
        return false;
      }
      const storeSessionID = data.responseText.match(/g_sessionID = "(.+?)";/)?.[1];
      if (storeSessionID) {
        globalThis.sessionID = storeSessionID;
        return true;
      }
      return false;
    }
    if ([301, 302].includes(data?.status)) {
      if (await refreshToken()) {
        if (retry) {
          return false;
        }
        return updateStoreAuth(true);
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
var showSwalMessage = (options) => {
  return swal({
    className: "swal-user",
    closeOnClickOutside: false,
    ...options
  });
};
function webRedeem(key) {
  const redeemContent = createRedeemContent();
  showSwalMessage({
    title: "正在获取sessionID...",
    buttons: {
      confirm: "关闭"
    }
  });
  if (!globalThis.sessionID) {
    handleNoSession(key, redeemContent);
    return;
  }
  showRedeemDialog(key, redeemContent);
}
function createRedeemContent() {
  return $(`
    <div id="registerkey_examples_text">
      <div class="notice_box_content" id="unusedKeyArea">
        <b>未使用的Key：</b><br>
        <div><ol id="unusedKeys" align="left"></ol></div>
      </div>
      <div class="table-responsive table-condensed">
        <table class="table table-hover hclonely">
          <caption><h2>激活记录</h2></caption>
          <thead>
            <th>No.</th><th>Key</th><th>结果</th><th>详情</th><th>Sub</th>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <br>
    </div>
  `)[0];
}
function handleNoSession(key, redeemContent) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://store.steampowered.com/account/registerkey",
    onload: async (data) => {
      if (data.finalUrl.includes("login") && !await updateStoreAuth()) {
        showSwalMessage({
          title: "请先登录steam！",
          icon: "warning",
          buttons: {
            confirm: "登录",
            cancel: "关闭"
          }
        }).then((value) => {
          if (value) window.open("https://store.steampowered.com/login/", "_blank");
        });
      } else {
        if (data.status === 200) {
          globalThis.sessionID = data.responseText?.match(/g_sessionID = "(.+?)";/)?.[1] || "";
          showRedeemDialog(key, redeemContent);
        } else {
          showSwalMessage({
            title: "获取sessionID失败！",
            icon: "error",
            buttons: {
              confirm: "关闭"
            }
          });
        }
      }
    }
  });
}
function showRedeemDialog(key, redeemContent) {
  showSwalMessage({
    title: "正在激活steam key...",
    content: redeemContent,
    buttons: {
      confirm: "提取未使用key",
      cancel: "关闭"
    }
  }).then((v) => {
    let value = "";
    const textarea = $(".swal-content textarea");
    if (textarea.length > 0) {
      value = textarea.val()?.toString() || "";
    }
    GM_setValue("history", [$(".swal-content").html() || "", value]);
    if (v) {
      GM_setClipboard(arr(getKeysByRE($("#unusedKeys").text() || "")).join(","));
      showSwalMessage({ title: "复制成功！", icon: "success" });
    }
  });
  redeemKeys(key);
}
function redeemSub(e) {
  const subText = e || $("#gameSub").val();
  if (subText) {
    const ownedPackages = {};
    $(".account_table a").each((i, el) => {
      const match = el.href.match(/javascript:RemoveFreeLicense\( ([0-9]+), '/);
      if (match !== null) {
        ownedPackages[+match[1]] = true;
      }
    });
    const freePackages = subText.match(/[\d]{2,}/g) || [];
    let loaded = 0;
    const total = freePackages.length;
    swal("正在执行…", "请等待所有请求完成。 忽略所有错误，让它完成。");
    freePackages.forEach((packae) => {
      const packageId = parseInt(packae, 10);
      if (ownedPackages[packageId]) {
        loaded++;
        return;
      }
      $.post("//store.steampowered.com/checkout/addfreelicense", {
        action: "add_to_cart",
        sessionid: g_sessionID,
        subid: packageId
      }).always(() => {
        loaded++;
        if (loaded >= total) {
          if (window.location.href.includes("licenses")) {
            window.open("https://store.steampowered.com/account/licenses/", "_self");
          } else {
            swal("全部激活完成，是否前往账户页面查看结果？", {
              //@ts-ignore
              buttons: {
                cancel: "取消",
                确定: true
              }
            }).then((value) => {
              if (value) {
                window.open("https://store.steampowered.com/account/licenses/", "_blank");
              }
            });
          }
        } else {
          swal("正在激活…", `进度：${loaded}/${total}.`);
        }
      });
    });
  }
}
function redeemSubs() {
  const key = $("#inputKey").val()?.trim();
  if (key) {
    redeemSub(key);
  }
}
async function cc() {
  try {
    showSwalMessage({ title: "正在获取当前国家/地区...", icon: "info" });
    const cartData = await fetchCartData();
    const { cartConfig, userInfo } = parseCartData(cartData);
    if (!isValidCartConfig(cartConfig, userInfo)) {
      showSwalMessage({ title: "需要挂相应地区的梯子！", icon: "warning" });
      return;
    }
    showCountryChangeDialog(cartConfig, userInfo, cartData);
  } catch (error) {
    showSwalMessage({ title: "获取当前国家/地区失败！", icon: "error" });
  }
}
function fetchCartData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "//store.steampowered.com/cart/",
      type: "get",
      success: (data) => resolve(data),
      error: reject
    });
  });
}
function parseCartData(data) {
  const cartConfigRaw = data.match(/data-cart_config="(.*?)"/)?.[1];
  const temp = document.createElement("div");
  temp.innerHTML = cartConfigRaw || "";
  const cartConfigStr = temp.textContent || temp.innerText || "";
  try {
    const cartConfig = JSON.parse(cartConfigStr);
    if (!cartConfig || !cartConfig.rgUserCountryOptions) {
      throw new Error("Invalid cartConfig format");
    }
    const userInfoRaw = data.match(/data-userinfo="(.*?)"/)?.[1];
    const temp1 = document.createElement("div");
    temp1.innerHTML = userInfoRaw || "";
    const userInfoStr = temp1.textContent || temp1.innerText || "";
    const userInfo = JSON.parse(userInfoStr);
    if (!userInfo || !userInfo.country_code) {
      throw new Error("Invalid userInfo format");
    }
    return {
      cartConfig,
      userInfo
    };
  } catch (e) {
    throw new Error("Failed to parse Steam data");
  }
}
function isValidCartConfig(cartConfig, userInfo) {
  return cartConfig && userInfo && Object.keys(cartConfig.rgUserCountryOptions).length > 2;
}
function bindCurrencyChangeOption() {
  const checkElement = () => {
    const $currencyChangeOptions = $(".currency_change_option");
    if ($currencyChangeOptions.length > 0) {
      $currencyChangeOptions.click(function() {
        const newCountry = $(this).attr("data-country");
        if (newCountry) {
          changeCountry(newCountry);
        }
      });
      return true;
    }
    return false;
  };
  const intervalId = setInterval(() => {
    if (checkElement()) {
      clearInterval(intervalId);
    }
  }, 500);
  setTimeout(() => {
    clearInterval(intervalId);
  }, 1e4);
}
function showCountryChangeDialog(cartConfig, userInfo, cartData) {
  const divContent = cartData.match(/<div class="currency_change_options">([\w\W]*?)<p/i)?.[1]?.trim();
  const div = `${divContent || ""}</div>`;
  showSwalMessage({
    closeOnClickOutside: false,
    title: `当前国家/地区：${cartConfig.rgUserCountryOptions[userInfo.country_code] || userInfo.country_code}`,
    //@ts-ignore
    content: $(`<div>${div}</div>`)[0]
  });
  bindCurrencyChangeOption();
}
function changeCountry(country) {
  showSwalMessage({
    closeOnClickOutside: false,
    icon: "info",
    title: "正在更换国家/地区..."
  });
  $.ajax({
    url: "//store.steampowered.com/country/setcountry",
    type: "post",
    data: {
      sessionid: g_sessionID,
      cc: country
    },
    complete() {
      $.ajax({
        url: "//store.steampowered.com/cart/",
        type: "get",
        success(data) {
          const cartConfigRaw = data.match(/data-cart_config="(.*?)"/)?.[1];
          const temp = document.createElement("div");
          temp.innerHTML = cartConfigRaw || "";
          const cartConfigStr = temp.textContent || temp.innerText || "";
          let cartConfig;
          try {
            cartConfig = JSON.parse(cartConfigStr);
          } catch (e) {
            console.error(e);
            showSwalMessage({ title: "获取当前国家/地区失败！", icon: "error" });
            return;
          }
          const userInfoRaw = data.match(/data-userinfo="(.*?)"/)?.[1];
          const temp1 = document.createElement("div");
          temp1.innerHTML = userInfoRaw || "";
          const userInfoStr = temp1.textContent || temp1.innerText || "";
          let userInfo;
          try {
            userInfo = JSON.parse(userInfoStr);
          } catch (e) {
            console.error(e);
            showSwalMessage({ title: "获取当前国家/地区失败！", icon: "error" });
            return;
          }
          const divContent = data.match(/<div class="currency_change_options">([\w\W]*?)<p/i)?.[1]?.trim();
          const div = `${divContent || ""}</div>`;
          if (userInfo?.country_code === country) {
            showSwalMessage({ title: "更换成功！", icon: "success" }).then(() => {
              showSwalMessage({
                closeOnClickOutside: false,
                title: `当前国家/地区：${cartConfig?.rgUserCountryOptions[userInfo.country_code] || userInfo.country_code}`,
                //@ts-ignore
                content: $(`<div>${div}</div>`)[0]
              });
              bindCurrencyChangeOption();
            });
          } else {
            showSwalMessage({ title: "更换失败！", icon: "error" });
          }
        },
        error: () => {
          showSwalMessage({ title: "获取当前国家/地区失败！", icon: "error" });
        }
      });
    }
  });
}

// redeem.ts
var FAILURE_DETAILS = {
  14: "无效激活码",
  15: "重复激活",
  53: "次数上限",
  13: "地区限制",
  9: "已拥有",
  24: "缺少主游戏",
  36: "需要PS3?",
  50: "这是充值码"
};
var UNUSED_KEY_REASONS = [
  "次数上限",
  "地区限制",
  "已拥有",
  "缺少主游戏",
  "其他错误",
  "未知错误",
  "网络错误或超时"
];
function redeemKey(key) {
  GM_xmlhttpRequest({
    url: "https://store.steampowered.com/account/ajaxregisterkey/",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://store.steampowered.com",
      Referer: "https://store.steampowered.com/account/registerkey"
    },
    data: `product_key=${key}&sessionid=${globalThis.sessionID}`,
    method: "POST",
    responseType: "json",
    onloadstart() {
      if ($(globalThis.selecter + "table").is(":hidden")) {
        $(globalThis.selecter + "table").fadeIn();
      }
    },
    onload(response) {
      if (response.status === 200 && response.response) {
        const data = response.response;
        if (data.success === 1 && data.purchase_receipt_info?.line_items[0]) {
          const item = data.purchase_receipt_info.line_items[0];
          tableUpdateKey(
            key,
            globalThis.myTexts.success,
            globalThis.myTexts.line,
            item.packageid,
            item.line_item_description
          );
          return;
        } else if (data.purchase_result_details !== void 0 && data.purchase_receipt_info) {
          const item = data.purchase_receipt_info.line_items[0];
          const failureReason = FAILURE_DETAILS[data.purchase_result_details] || globalThis.myTexts.others;
          if (!item) {
            tableUpdateKey(
              key,
              globalThis.myTexts.fail,
              failureReason,
              0,
              globalThis.myTexts.nothing
            );
          } else {
            tableUpdateKey(
              key,
              globalThis.myTexts.fail,
              failureReason,
              item.packageid,
              item.line_item_description
            );
          }
          return;
        }
        tableUpdateKey(key, globalThis.myTexts.fail, globalThis.myTexts.nothing, 0, globalThis.myTexts.nothing);
      } else {
        tableUpdateKey(key, globalThis.myTexts.fail, globalThis.myTexts.network, 0, globalThis.myTexts.nothing);
      }
    },
    ontimeout: () => {
      tableUpdateKey(key, globalThis.myTexts.fail, globalThis.myTexts.network, 0, globalThis.myTexts.nothing);
    },
    onerror: () => {
      tableUpdateKey(key, globalThis.myTexts.fail, globalThis.myTexts.network, 0, globalThis.myTexts.nothing);
    },
    onabort: () => {
      tableUpdateKey(key, globalThis.myTexts.fail, globalThis.myTexts.network, 0, globalThis.myTexts.nothing);
    }
  });
}
function setUnusedKeys(key, success, reason, subId, subName) {
  if (success && globalThis.allUnusedKeys.includes(key)) {
    let listObject;
    globalThis.allUnusedKeys = globalThis.allUnusedKeys.filter((keyItem) => keyItem !== key);
    $(`${globalThis.selecter}li`).each((i, e) => {
      if ($(e).html()?.includes(key)) {
        listObject = $(e);
        listObject.remove();
      }
    });
  } else if (!success && !globalThis.allUnusedKeys.includes(key) && UNUSED_KEY_REASONS.includes(reason)) {
    const listObject = $("<li></li>");
    listObject.html(
      `${key} (${reason}${subId !== 0 ? `: <code>${subId}</code> ${subName}` : ""})`
    );
    $("#unusedKeys").append(listObject);
    globalThis.allUnusedKeys.push(key);
  }
}
function tableInsertKey(key) {
  globalThis.keyCount++;
  const row = $("<tr></tr>");
  row.append(`<td class="nobr">${globalThis.keyCount}</td>`);
  row.append(`<td class="nobr"><code>${key}</code></td>`);
  row.append(`<td colspan="3">${globalThis.myTexts.redeeming}...</td>`);
  $(`${globalThis.selecter}tbody`).prepend(row);
}
function tableWaitKey(key) {
  globalThis.keyCount++;
  const row = $("<tr></tr>");
  row.append(`<td class="nobr">${globalThis.keyCount}</td>`);
  row.append(`<td class="nobr"><code>${key}</code></td>`);
  row.append(`<td colspan="3">${globalThis.myTexts.waiting} (${globalThis.waitingSeconds}秒)...</td>`);
  $(`${globalThis.selecter}tbody`).prepend(row);
}
function tableUpdateKey(key, result, detail, subId, subName) {
  setUnusedKeys(key, result === globalThis.myTexts.success, detail, subId, subName);
  globalThis.recvCount++;
  if (!globalThis.selecter && globalThis.recvCount === globalThis.keyCount) {
    $("#buttonRedeem").fadeIn();
    $("#inputKey").removeAttr("disabled");
  }
  const rowObjects = $(`${globalThis.selecter}tr`);
  for (let i = 1; i < rowObjects.length; i++) {
    const rowElement = rowObjects[i];
    const rowObject = $(rowElement);
    if (rowObject.children()[1].innerHTML.includes(key) && rowObject.children()[2].innerHTML.includes(globalThis.myTexts.redeeming)) {
      rowObject.children()[2].remove();
      if (result === globalThis.myTexts.fail) {
        rowObject.append(`<td class="nobr" style="color:red">${result}</td>`);
      } else {
        rowObject.append(`<td class="nobr" style="color:green">${result}</td>`);
      }
      rowObject.append(`<td class="nobr">${detail}</td>`);
      if (subId === 0) {
        rowObject.append("<td>——</td>");
      } else {
        rowObject.append(
          `<td><code>${subId}</code> <a href="https://steamdb.info/sub/${subId}/" target="_blank">${subName}</a></td>`
        );
      }
      break;
    }
  }
}
function startTimer() {
  const timer = setInterval(() => {
    let flag = false;
    let nowKey = 0;
    const rowObjects = $(`${globalThis.selecter}tr`);
    for (let i = rowObjects.length - 1; i >= 1; i--) {
      const rowElement = rowObjects[i];
      const rowObject = $(rowElement);
      const cellContent = rowObject.children()[2]?.innerHTML;
      if (cellContent?.includes(globalThis.myTexts.waiting)) {
        nowKey++;
        if (nowKey <= globalThis.autoDivideNum) {
          let key = rowObject.children()[1]?.innerHTML.substring(6);
          key = key?.substring(0, key.indexOf("</code>")) || "";
          rowObject.children()[2].innerHTML = `<td colspan="3">${globalThis.myTexts.redeeming}...</td>`;
          redeemKey(key);
        } else {
          flag = true;
          break;
        }
      }
    }
    if (!flag) {
      clearInterval(timer);
    }
  }, 1e3 * globalThis.waitingSeconds);
}
function redeem(keys) {
  if (keys.length <= 0) {
    return;
  }
  if (!globalThis.selecter) {
    $("#buttonRedeem").hide();
    $("#inputKey").attr("disabled", "disabled");
  }
  let nowKey = 0;
  keys.forEach((key) => {
    nowKey++;
    if (nowKey <= globalThis.autoDivideNum) {
      tableInsertKey(key);
      redeemKey(key);
    } else {
      tableWaitKey(key);
    }
  });
  if (nowKey > globalThis.autoDivideNum) {
    startTimer();
  }
}
function redeemKeys(key) {
  const keys = key ? key.split(",") : getKeysByRE($("#inputKey").val()?.toString()?.trim() || "");
  redeem(keys);
}
function toggleUnusedKeyArea() {
  if (!globalThis.selecter) {
    const unusedKeyArea = $("#unusedKeyArea");
    if (unusedKeyArea.is(":hidden")) {
      unusedKeyArea.show();
    } else {
      unusedKeyArea.hide();
    }
  }
}
function registerkey(key) {
  const setting = GM_getValue("setting");
  const keys = getKeysByRE(key);
  if (setting?.asf) {
    const asfCommand = `!redeem ${setting.asfBot ? `${setting.asfBot} ` : ""}${keys.join(",")}`;
    asfRedeem(asfCommand);
  } else if (setting?.newTab) {
    const url = `https://store.steampowered.com/account/registerkey?key=${keys.join(",")}`;
    window.open(url, "_blank");
  } else {
    webRedeem(keys.join(","));
  }
}

// css.ts
var css = `table.hclonely {
    font-family: verdana,arial,sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #999999;
    border-collapse: collapse;
}

table.hclonely th {
    background-color: #c3dde0;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #a9c6c9;
}

table.hclonely tr {
    background-color: #d4e3e5;
}

table.hclonely td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #a9c6c9;
}
table.hclonely caption {
    padding-top: 8px;
    color: #808294;
    text-align: center;
    caption-side: top;
    background-color: #94d7df;
}
table.hclonely h2 {
    margin: 0;
    font-size: 25px;
}

.swal-user {
    width: 80%;
}

table.hclonely a {
    color: #2196F3;
}
table.hclonely .swal-button {
    padding: 5px;
}
#unusedKeyArea code {
    padding: 2px 4px;
    font-size: 90%;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 3px;
}

.notice_box_content {
    border: 1px solid #a25024;
    border-radius: 3px;
    color: #acb2b8;
    font-size: 14px;
    font-family: "Motiva Sans", Sans-serif;
    font-weight: normal;
    padding: 15px 15px;
    margin-bottom: 15px;
}

.notice_box_content b {
    font-weight: normal;
    color: #f47b20;
    float: left;
}

#unusedKeys {
    margin:0 15px;
}

#copyUnuseKey span {
    font-size: 15px;
    line-height: 20px;
}

#unusedKeyArea li {
    white-space: nowrap;
    color: #007fff;
}

.currency_change_option_ctn {
	vertical-align: top;
	margin: 0 6%;
}
.currency_change_option_ctn:first-child {
	margin-bottom: 12px;
}
.currency_change_option_ctn > p {
	font-size: 12px;
	margin: 8px 8px 0 8px;
}
.currency_change_option_ctn {
	vertical-align: top;
	margin: 0 6%;
}
.currency_change_option_ctn:first-child {
	margin-bottom: 12px;
}

.currency_change_option {
			font-family: "Motiva Sans", Sans-serif;
		font-weight: 300; /* light */

			display: block;
}

.currency_change_option > span {
	display: block;
	padding: 9px 19px;
}

.currency_change_option .country {
	font-size: 20px;
}
.currency_change_option .notes {
	font-size: 13px;
	line-height: 18px;
}

.currency_change_option_ctn > p {
	font-size: 12px;
	margin: 8px 8px 0 8px;
}

.asf-class input[type="text"]{
    border: 1px solid #c2e9ee;
    width:180px;
}

.asf-output{
    width:90%;
    min-height:150px;
}

.switch-key {
    margin:0 15%;
    height:100px;
}
.switch-key-left {
    float:left;
}
.switch-key-right {
    float:right;
}

.switch-key div {
    width: 50%;
    position: relative;
    cursor:default;
}
.switch-key input {
    margin:10px 0;
}
.switch-key p {
    font-size:25px;
    height:25px;
    color:black;
    margin:0;
}
.swal-content *{
    color:#000;
}
.swal-content textarea{
    background: #fff;
}
#allKey{
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;color: #333;
    background-color: #fff;
    border-color: #ccc;
}
#allKey:hover{
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
    text-decoration: none;
}
#allKey:focus{
    color: #333;
    background-color: #e6e6e6;
    border-color: #8c8c8c;
    text-decoration: none;
}
#allKey:active{
    background-image: none;
    outline: 0;
    -webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
    box-shadow: inset 0 3px 5px rgba(0,0,0,.125);color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
}
.icon-img {
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 0px!important;
}

.icon-div {
    width: 32px!important;
    height: 32px!important;
    display: none;
    background: #fff!important;
    border-radius: 16px!important;
    box-shadow: 4px 4px 8px #888!important;
    position: absolute!important;
    z-index: 2147483647!important;
    cursor: pointer;
}
`;

// main.ts
globalThis.url = window.location.href;
globalThis.defaultSetting = {
  newTab: false,
  copyListen: true,
  selectListen: true,
  clickListen: true,
  allKeyListen: false,
  asf: false,
  asfProtocol: "http",
  asfHost: "127.0.0.1",
  asfPort: 1242,
  asfPassword: "",
  asfBot: ""
};
globalThis.sessionID = "";
try {
  globalThis.sessionID = g_sessionID;
} catch (e) {
  globalThis.sessionID = "";
}
globalThis.allUnusedKeys = [];
globalThis.selecter = globalThis.url.includes("/account/registerkey") ? "" : ".hclonely ";
globalThis.myTexts = {
  fail: "失败",
  success: "成功",
  network: "网络错误或超时",
  line: "——",
  nothing: "",
  others: "其他错误",
  unknown: "未知错误",
  redeeming: "激活中",
  waiting: "等待中",
  showUnusedKey: "显示未使用的Key",
  hideUnusedKey: "隐藏未使用的Key"
};
globalThis.autoDivideNum = 9;
globalThis.waitingSeconds = 20;
globalThis.keyCount = 0;
globalThis.recvCount = 0;
try {
  const setting = GM_getValue("setting");
  if (Object.prototype.toString.call(setting) !== "[object Object]") {
    GM_setValue("setting", globalThis.defaultSetting);
  }
  if (setting?.selectListen) {
    const icon = document.createElement("div");
    icon.className = "icon-div";
    icon.title = "激活";
    icon.innerHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABsFBMVEVHcEz9/f3+/v8Tdaf///8LGTP+/v4NPWX+/v8GGDj8/f4OGzX///////////8ZJ1ALJ0oNGzf+/v4mOGXX2+T8/f3z9vkPH0UjMFj5+fr///8NGzMJG0ERHS8SKEgXW40Ubp8WY5Ula5ePnrb3+PlnhKUfQ3Q3R3C2vMvt8PRcZH7///8TgrMTgbITfa4YNmcPHDT///8JGj0HGT2rucxGWYJ0g6H///9aZYbGy9jFyNQhL1TO0dp5lbOTma39/f7///+Sl6br7O6SlqT///////8UY5UUY5UJGTgTc6QThLUTfa8VToETdKYQK1sRK1sUWowUY5X///+mq7tlc5MzWX7Mztl5gZuytcJPV3AjL08iLlEUTYAUPXATK10Tfa4FO3IVToHEz9wAL2fj5+5GUG4JFz1mbIC8wMsFFzYFGDwHGkILGTIJG0cLHUoFGD8RJFMUU4YUN2kOIE4TSHsUYJMUbqAUQnUVTYAQLWEUWowUPG8SKFoTZ5kRHDATfq8Tdqf///8IIFQUaJkeWYrA0N4JMmgHQndAc5wJTYIIVooGXpNllrdchanT3ui2xtaZV9eJAAAAaXRSTlMAj/j97/vmAtD8xzncwJvwJay59uHd/ObqgnBtlpgLPfz8Femx+/7s0vitXqVLf53k3VmE9fDr59vaxLSY/qmGRnxeXjI/lGy5MLbr+8A/cPuiqLzgfLHJhJfN17bjr6z8xfmu9cH4cHitMXlOAAACjUlEQVQ4y2XTh1faQBgA8IMGQqCiGPaQAgUE3OLeFTfurR120SYkAQSrQUABUSyOf7l3kQC+/i7JfXff9/Ly4DsAXuA4AG0qi02jsVlUbS/rRnCpsvXkqnpsKmGrnsZBy2KOyTGyHBrooWlpeAkMLAzDyBiRDIayvloFnKwMJSOoKgJGsghD9YsVOLASBEE3pKtz/8t34MBCEXQddbQ7O/trjKAiVB96BY630I2ow1BobjoUmjXQdAR+KRyL0Ug0VhWlD+c+jBkMxzNzM3BXgwrWog1oYyBgODr47adnpv2xSBT+HkDDRlgxz9H+wM/jgNkc8BvNBzGWtQLgNLAcy8JbGLFJs3HSZDJNmQzjpmaWM7SBviRXk2SbxyXGSQkCI1jAqUB/Mp6sYbfV6mGvWq2W7JOSPQ7urIPuJBsXccNbkNG7t7cf397aQQkrMLUPZLh4JoMushV5P0yS3vatUbSV+QwkytaRQbJQ4DOFwqiySQnBR1PTKAnTPCyY0ikUSoVrgPcOjihE2vYdPnPK8yTfDczytwKtbsQVhHOvTqcd4Hn+VMCvg2lM3itHMK3LMyiXD/UGPbeXkFBwuQacrh8Yhg1hiM8TxHxu/vT8UvQJtud3j/ubVKCXTrix8O15Xaob/hf21MlJOZiX5qXSvHvi+Tacqgmn7Kgfvl6E7+58ped8vpTyTdwlLkThi49CP9gTiZv7R/1juXxTerpPNEINA6/d9Eb6/kH/VNKXbtJ1G+kFsSk3zxyOv46Hh3KlclbjOJsHYleDzWKxmK1UskUkixSzxfnGc9f1DvkjQvHCq6OHL61eX1+/qYLR6tKrw4lKOr+sXFWtdNj/O99wiTs7uzqWlzu6Op14Pf0P2PD9NrHDeWsAAAAASUVORK5CYII=" class="icon-img" alt="激活图标">`;
    const $icon = $(icon);
    $("html").append(icon);
    $(document).mousedown((e) => {
      if (e.target === icon || e.target?.parentNode === icon || e.target?.parentNode?.parentNode === icon) {
        e.preventDefault();
      }
    });
    document.addEventListener("selectionchange", () => {
      if (!window.getSelection()?.toString()?.trim()) {
        $icon.hide();
      }
    });
    $(document).mouseup((e) => {
      if (e.target === icon || e.target?.parentNode === icon || e.target?.parentNode?.parentNode === icon) {
        e.preventDefault();
        return false;
      }
      const text = window.getSelection()?.toString()?.trim();
      const productKey = text || e.target?.value;
      if (/[\d\w]{5}(-[\d\w]{5}){2}/.test(productKey) && text && $icon.is(":hidden")) {
        $icon.css({
          top: e.pageY + 12,
          left: e.pageX + 18
        }).show();
      } else if (!text) {
        $icon.hide();
      }
    });
    $icon.click((e) => {
      const productKey = window.getSelection()?.toString()?.trim() || e.target?.value;
      registerkey(productKey);
    });
  }
  if (!/https?:\/\/store\.steampowered\.com\/account\/registerkey[\w\W]{0,}/.test(globalThis.url) && setting?.copyListen) {
    const activateProduct = async function(e) {
      const productKey = window.getSelection()?.toString()?.trim() || e.target?.value;
      const clipboardSuccess = await navigator.clipboard.writeText(productKey).then(() => true, () => false);
      if (/^([\w\W]*)?([\d\w]{5}(-[\d\w]{5}){2}(\r||,||，)?){1,}/.test(productKey)) {
        if (!$("div.swal-overlay").hasClass("swal-overlay--show-modal")) {
          swal({
            title: "检测到神秘key,是否激活？",
            icon: "success",
            //@ts-ignore
            buttons: {
              confirm: "激活",
              cancel: "取消"
            }
          }).then((value) => {
            if (value) registerkey(productKey);
          });
        }
      } else if (/^![\w\d]+\s+asf\s+.+/gi.test(productKey)) {
        if (setting?.asf && !$("div.swal-overlay").hasClass("swal-overlay--show-modal")) {
          swal({
            closeOnClickOutside: false,
            className: "swal-user",
            title: "检测到您复制了以下ASF指令，是否执行？",
            text: productKey,
            //@ts-ignore
            buttons: {
              confirm: "执行",
              cancel: "取消"
            }
          }).then((value) => {
            if (value) asfRedeem(productKey);
          });
        }
      }
    };
    window.addEventListener("copy", activateProduct, false);
  }
  if (/^https?:\/\/store\.steampowered\.com\/account\/registerkey*/.test(globalThis.url)) {
    $("#registerkey_examples_text").html(`
      <div class="notice_box_content" id="unusedKeyArea" style="display: none">
        <b>未使用的Key：</b>
        <a tabindex="300" class="btnv6_blue_hoverfade btn_medium" id="copyUnuseKey">
          <span>提取未使用key</span>
        </a>
        <br>
        <div><ol id="unusedKeys"></ol></div>
      </div>
      <div class="table-responsive table-condensed">
        <table class="table table-hover" style="display: none">
          <caption><h2>激活记录</h2></caption>
          <thead>
            <tr>
              <th>No.</th>
              <th>Key</th>
              <th>结果</th>
              <th>详情</th>
              <th>Sub</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <br>`);
    $("#copyUnuseKey").click(() => {
      const unusedKeys = $("#unusedKeys").text();
      GM_setClipboard(arr(getKeysByRE(unusedKeys)).join(","));
      swal({ title: "复制成功！", icon: "success" });
    });
    $(".registerkey_input_box_text").parent().css("float", "none").append(`
        <textarea class="form-control" rows="3" id="inputKey" placeholder="支持批量激活，可以把整个网页文字复制过来&#10;若一次激活的Key的数量超过9个则会自动分批激活（等待20秒）&#10;激活多个SUB时每个SUB之间用英文逗号隔开" style="margin: 3px 0px 0px; width: 525px; height: 102px;"></textarea><br>`);
    if (/^https?:\/\/store\.steampowered\.com\/account\/registerkey\?key=.+/.test(globalThis.url)) {
      $("#inputKey").val(globalThis.url.replace(/https?:\/\/store\.steampowered\.com\/account\/registerkey\?key=/i, ""));
    }
    $(".registerkey_input_box_text,#purchase_confirm_ssa").hide();
    $("#register_btn").parent().css("margin", "10px 0").append(`
        <a tabindex="300" class="btnv6_blue_hoverfade btn_medium" style="margin-left:0" id="redeemKey">
          <span>激活key</span>
        </a> &nbsp;&nbsp;
        <a tabindex="300" class="btnv6_blue_hoverfade btn_medium" style="margin-left:0" id="redeemSub">
          <span>激活sub</span>
        </a> &nbsp;&nbsp;
        <a tabindex="300" class="btnv6_blue_hoverfade btn_medium" style="margin-left:0" id="changeCountry">
          <span>更换国家/地区</span>
        </a> &nbsp;&nbsp;`);
    $("#register_btn").remove();
    if (/^https?:\/\/store\.steampowered\.com\/account\/registerkey\?key=.+/.test(globalThis.url)) {
      redeem(getKeysByRE(globalThis.url.replace(/https?:\/\/store\.steampowered\.com\/account\/registerkey\?key=/i, "").trim()));
    }
    $("#redeemKey").click(() => {
      redeemKeys();
    });
    $("#redeemSub").click(redeemSubs);
    $("#changeCountry").click(cc);
    toggleUnusedKeyArea();
  } else if (/https?:\/\/steamdb\.info\/freepackages\//.test(globalThis.url)) {
    const activateConsole = () => {
      const sub = [];
      $("#freepackages span:visible").each(function() {
        const subId = $(this).attr("data-subid");
        if (subId) sub.push(subId);
      });
      const freePackages = sub.join(",");
      window.open(`https://store.steampowered.com/account/licenses/?sub=${freePackages}`, "_self");
    };
    const fp = setInterval(() => {
      if ($("#freepackages").length > 0) {
        $("#freepackages").click(activateConsole);
        clearInterval(fp);
      }
    }, 1e3);
  } else if (/https?:\/\/store\.steampowered\.com\/account\/licenses\/(\?sub=[\w\W]{0,})?/.test(globalThis.url)) {
    $("h2.pageheader").parent().append(`
        <div style="float: left;">
          <textarea class="registerkey_input_box_text" rows="1" name="product_key" id="gameSub" placeholder="输入SUB,多个SUB之间用英文逗号连接" value="" style="margin: 3px 0px 0px; width: 400px; height: 15px;background-color:#102634; padding: 6px 18px 6px 18px; font-weight:bold; color:#fff;"></textarea> &nbsp;
        </div>
        <a tabindex="300" class="btnv6_blue_hoverfade btn_medium" style="width: 95px; height: 30px;" id="buttonSUB">
          <span>激活SUB</span>
        </a>
        <a tabindex="300" class="btnv6_blue_hoverfade btn_medium" style="width: 125px; height: 30px;margin-left:5px" id="changeCountry-account">
          <span>更改国家/地区</span>
        </a>`);
    $("#buttonSUB").click(() => {
      redeemSub();
    });
    $("#changeCountry-account").click(cc);
    if (/https?:\/\/store\.steampowered\.com\/account\/licenses\/\?sub=([\d]+,)+/.test(globalThis.url)) {
      setTimeout(() => {
        redeemSub(globalThis.url);
      }, 2e3);
    }
  } else if (setting?.clickListen) {
    let htmlEl = null;
    if ($("body").length > 0) {
      $("body").click((event) => {
        htmlEl = event.target;
        if ($(htmlEl).parents(".swal-overlay").length === 0 && !["A", "BUTTON", "TEXTAREA"].includes(htmlEl.tagName) && !["button", "text"].includes(htmlEl.getAttribute("type") || "") && ($(htmlEl).children().length === 0 || !/([0-9,A-Z]{5}-){2,4}[0-9,A-Z]{5}/gim.test($.makeArray($(htmlEl).children().map(function() {
          return $(this).text();
        })).join(""))) && /([0-9,A-Z]{5}-){2,4}[0-9,A-Z]{5}/gim.test($(htmlEl).text())) {
          mouseClick($, event);
          arr($(htmlEl).text().match(/[\w\d]{5}(-[\w\d]{5}){2}/gim) || []).map((e) => {
            $(htmlEl).html($(htmlEl).html()?.replace(new RegExp(e, "gi"), `<a class="redee-key" href='javascript:void(0)' target="_self" key='${e}'>${e}</a>`));
          });
          $(".redee-key").click(function() {
            registerkey($(this).attr("key") || "");
          });
        }
      });
    }
  }
  if (/https?:\/\/store\.steampowered\.com\//.test(globalThis.url)) {
    $("#account_pulldown").before('<span id="changeCountry" style="cursor:pointer;display:inline-block;padding-left:4px;line-height:25px" class="global_action_link persona_name_text_content">更改国家/地区 |</span>');
    $("#changeCountry").click(cc);
  }
  if (setting?.allKeyListen) {
    redeemAllKey();
  }
  GM_addStyle(css);
  GM_registerMenuCommand("⚙设置", settingChange);
  GM_registerMenuCommand("执行ASF指令", () => {
    asfSend();
  });
} catch (e) {
  swal("AuTo Redeem Steamkey脚本执行出错，详情请查看控制台！", e.stack, "error");
  console.error(e);
}
