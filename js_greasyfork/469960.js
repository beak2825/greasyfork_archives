// ==UserScript==
// @name        银行项目-布谷鸟哥哥进化版本 - 59.64.78.76
// @namespace   Violentmonkey Scripts
// @match       http://59.64.78.76/course/*
// @grant       none
// @version     2.1
// @author      -
// @license MIT
// @description 2023/6/27 16:01:17  用于自动执行银行项目提交作业
// @downloadURL https://update.greasyfork.org/scripts/469960/%E9%93%B6%E8%A1%8C%E9%A1%B9%E7%9B%AE-%E5%B8%83%E8%B0%B7%E9%B8%9F%E5%93%A5%E5%93%A5%E8%BF%9B%E5%8C%96%E7%89%88%E6%9C%AC%20-%2059647876.user.js
// @updateURL https://update.greasyfork.org/scripts/469960/%E9%93%B6%E8%A1%8C%E9%A1%B9%E7%9B%AE-%E5%B8%83%E8%B0%B7%E9%B8%9F%E5%93%A5%E5%93%A5%E8%BF%9B%E5%8C%96%E7%89%88%E6%9C%AC%20-%2059647876.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.head.appendChild(script);
console.log("import jq success")


// 对 http://59.64.78.76/course/*执行的代码逻辑
console.log("执行闯关")
var data = new Map();
data.set("3.2", `\nimport pymysql
connection =  pymysql.connect(host='59.64.78.76', 
                             port=3306, 
                             user='raa_user', 
                             password='bigdata123', 
                             db='risk_assessment_analysis',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

try:
    with connection.cursor() as cursor:
        sql = "SELECT * from all_data"
        cursor.execute(sql)
        all_data = cursor.fetchall()  
finally:
    connection.close()

# 查看数据前两个元素
print(all_data[:2])`);
data.set("3.3", `\nimport pandas as pd
 #将列表转换为DataFrame
data =pd.DataFrame(all_data)

print(data[:100])`);
data.set("4.2", `\nimport pandas as pd

# 使用head()函数查看数据前五行
data_5 = data.head()

print(data_5)`);
data.set("4.4", `\nimport pandas as pd
 # 使用describe()函数查看数据整体的基本统计信息
data_des =data.describe(include='all')


print(data_des)`);
data.set("4.5", `\nimport pandas as pd
import matplotlib.pyplot as plt

fig = plt.figure(figsize=(8,6))
# 绘制柱状图，查看违约关系的取值分布情况
data['Default'].value_counts(dropna=False).plot(kind='bar',rot=40)

# 在柱形上方显示计数
counts = data['Default'].value_counts(dropna=False).values
for index, item in zip([0,1,2], counts): 
    plt.text(index, item, item, ha="center", va= "bottom", fontsize=12) 

# 设置柱形名称
plt.xticks([0,1,2],['未违约', '违约','NaN']) 

# 设置x、y轴标签
plt.xlabel('是否违约') 
plt.ylabel('客户数量') 

# 设置标题以及字体大小
plt.title('违约与未违约数量分布图',size=13)

# 设置中文显示
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']
plt.show()`);
data.set("4.6", `\nimport seaborn as sns
import matplotlib.pyplot as plt

fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16,6))

# 对CityId列的类别设定顺序
data['CityId'] = data['CityId'].astype('category')
data['CityId'] = data['CityId'].cat.set_categories(['一线城市', '二线城市', '其它'],ordered=True)

# 绘制柱状图，查看不同城市级别在不同是否违约的取值分布情况
sns.countplot(x='CityId',hue='Default',data=data,ax=ax1)

# 将具体的计数值显示在柱形上方
counts=data['Default'].groupby(data['CityId']).value_counts().values
count1 = counts[[0, 2, 4]]
count2 = counts[[1, 3, 5]]
for index, item1, item2 in zip([0,1,2], count1, count2): 
    ax1.text(index-0.2, item1 + 0.05, '%.0f' % item1, ha="center", va= "bottom",fontsize=12)
    ax1.text(index+0.2, item2 + 0.05, '%.0f' % item2, ha="center", va= "bottom",fontsize=12)
    

# 绘制柱状图查看违约率分布
cityid_rate = data.groupby('CityId')['Default'].sum() / data.groupby('CityId')['Default'].count()
sns.barplot(x=[0,1,2],y=cityid_rate.values,ax=ax2)

# 将具体的计数值显示在柱形上方
for index, item in zip([0,1,2], cityid_rate): 
     ax2.text(index, item, '%.3f' % item, ha="center", va= "bottom",fontsize=12)
        
#设置柱形名称
ax1.set_xticklabels(['一线城市','二线城市','其它']) 
ax2.set_xticklabels(['一线城市','二线城市','其它']) 

# 修改图例名称
ax1.legend(labels=['未违约', '违约'])

# 设置标题以及字体大小
ax1.set_title('不同城市级别下不同违约情况数量分布柱状图',size=13)
ax2.set_title('不同城市级别违约率分布柱状图',size=13)

# 设置x,y轴标签
ax1.set_xlabel('CityId')
ax1.set_ylabel('客户人数')
ax2.set_xlabel('CityId')
ax2.set_ylabel('违约率')
#显示汉语标注
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']
plt.show()`);
data.set("4.7", `\nimport seaborn as sns
import matplotlib.pyplot as plt

fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16,6))

# 对education列的类别设定顺序
data['education'] = data['education'].astype('category')
data['education'] = data['education'].cat.set_categories(['小学', '初中', '高中', '本科以上'],ordered=True)

# 绘制柱状图，查看不同文化程度(education)在不同是否违约(Default)的取值分布情况
sns.countplot(x='education',hue='Default',data=data,ax=ax1)

# 将具体的计数值显示在柱形上方
counts=data['Default'].groupby(data['education']).value_counts().values
count1 = counts[[0, 2, 4,6]]
count2 = counts[[1, 3, 5,7]]
for index, item1, item2 in zip([0,1,2,3], count1, count2): 
    ax1.text(index-0.2, item1 + 0.05, '%.0f' % item1, ha="center", va= "bottom",fontsize=12)
    ax1.text(index+0.2, item2 + 0.05, '%.0f' % item2, ha="center", va= "bottom",fontsize=12)


# 绘制柱状图查看违约率分布
education_rate = data.groupby('education')['Default'].sum() / data.groupby('education')['Default'].count()
sns.barplot(x=[0,1,2,3],y=education_rate.values,ax=ax2)

# 将具体的计数值显示在柱形上方
for index, item in zip([0,1,2,3], education_rate): 
     ax2.text(index, item, '%.2f' % item, ha="center", va= "bottom",fontsize=12)
        
# 设置柱形名称
ax1.set_xticklabels(['小学', '初中', '高中', '本科以上']) 
ax2.set_xticklabels(['小学', '初中', '高中', '本科以上']) 

# 设置图例名称
ax1.legend(labels=['未违约', '违约'])

# 设置标题以及字体大小
ax1.set_title('不同文化程度下不同违约情况数量分布柱状图',size=13)
ax2.set_title('不同文化程度下违约率分布柱状图',size=13)

# 设置x,y轴标签
ax2.set_xlabel('education')
ax2.set_ylabel('违约率')
ax1.set_xlabel('education')
ax1.set_ylabel('客户人数')

#显示汉语标注`);
data.set("4.8", `\nimport seaborn as sns
import matplotlib.pyplot as plt

fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16,6))

# 对threeVerify列的类别设定顺序
data['threeVerify'] = data['threeVerify'].astype('category')
data['threeVerify'] = data['threeVerify'].cat.set_categories(['一致','不一致'],ordered=True)

# 绘制柱状图，查看不同三要素验证情况(threeVerify)在不同是否违约(Default)的取值分布情况
sns.countplot(x='threeVerify',hue='Default',data=data,ax=ax1)

# 将具体的计数值显示在柱形上方
counts=data['Default'].groupby(data['threeVerify']).value_counts().values
count1 = counts[[0, 2]]
count2 = counts[[1, 3]]
for index, item1, item2 in zip([0,1,2,3], count1, count2): 
    ax1.text(index-0.2, item1 + 0.05, '%.0f' % item1, ha="center", va= "bottom",fontsize=12)
    ax1.text(index+0.2, item2 + 0.05, '%.0f' % item2, ha="center", va= "bottom",fontsize=12)


# 绘制柱状图查看违约率分布
threeVerify_rate = data.groupby('threeVerify')['Default'].sum() / data.groupby('threeVerify')['Default'].count()
sns.barplot(x=[0,1],y=threeVerify_rate.values,ax=ax2)

# 将具体的计数值显示在柱形上方
for index, item in zip([0,1], threeVerify_rate): 
     ax2.text(index, item, '%.2f' % item, ha="center", va= "bottom",fontsize=12)
        
# 设置柱形名称
ax1.set_xticklabels(['一致','不一致']) 
ax2.set_xticklabels(['一致','不一致']) 

# 设置图例名称
ax1.legend(labels=['未违约', '违约'])

# 设置标题以及字体大小
ax1.set_title('不同三要素验证下不同违约情况数量分布柱状图',size=13)
ax2.set_title('不同三要素验证下违约率分布柱状图',size=13)

# 设置x,y轴标签
ax2.set_xlabel('threeVerify')
ax2.set_ylabel('违约率')
ax1.set_xlabel('threeVerify')
ax1.set_ylabel('客户人数')
#显示汉语标注
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']
plt.show()`);
data.set("4.9", `\nimport seaborn as sns
import matplotlib.pyplot as plt

fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16,6))

# 对maritalStatus列的类别设定顺序
data['maritalStatus'] = data['maritalStatus'].astype('category')
data['maritalStatus'] = data['maritalStatus'].cat.set_categories(['未婚','已婚'],ordered=True)

# 绘制柱状图，查看不同婚姻状况在不同违约情况的取值分布
sns.countplot(x='maritalStatus',hue='Default',data=data,ax=ax1)

# 将具体的计数值显示在柱形上方
counts=data['Default'].groupby(data['maritalStatus']).value_counts().values
count1 = counts[[0, 2]]
count2 = counts[[1, 3]]
for index, item1, item2 in zip([0,1,2,3], count1, count2): 
    ax1.text(index-0.2, item1 + 0.05, '%.0f' % item1, ha="center", va= "bottom",fontsize=12)
    ax1.text(index+0.2, item2 + 0.05, '%.0f' % item2, ha="center", va= "bottom",fontsize=12)


# 绘制柱状图查看违约率分布
maritalStatus_rate = data.groupby('maritalStatus')['Default'].sum() / data.groupby('maritalStatus')['Default'].count()
sns.barplot(x=[0,1],y=maritalStatus_rate.values,ax=ax2)

# 将具体的计数值显示在柱形上方
for index, item in zip([0,1], maritalStatus_rate): 
     ax2.text(index, item, '%.2f' % item, ha="center", va= "bottom",fontsize=12)
        
# 设置柱形名称
ax1.set_xticklabels(['未婚','已婚']) 
ax2.set_xticklabels(['未婚','已婚']) 

# 设置图例名称
ax1.legend(labels=['未违约', '违约'])

# 设置标题以及字体大小
ax1.set_title('不同婚姻状况下不同违约情况数量分布柱状图',size=13)
ax2.set_title('不同婚姻状况下违约率分布柱状图',size=13)

# 设置x,y轴标签
ax2.set_xlabel('maritalStatus')
ax2.set_ylabel('违约率')
ax1.set_xlabel('maritalStatus')
ax1.set_ylabel('客户人数')


#显示汉语标注
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']
plt.show()`);
data.set("4.10", `\nimport seaborn as sns
import matplotlib.pyplot as plt

fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16,6))

# 对netLength列的类别设定顺序
data['netLength'] = data['netLength'].astype('category')
data['netLength'] = data['netLength'].cat.set_categories(['0-6个月','6-12个月','12-24个月','24个月以上','无效'],ordered=True)

# 绘制柱状图，查看不同在网时长在不同违约情况的取值分布
sns.countplot(x='netLength',hue='Default',data=data,ax=ax1)

# 将具体的计数值显示在柱形上方
counts=data['Default'].groupby(data['netLength']).value_counts().values
count1 = counts[[0,2,4,6,8]]
count2 = counts[[1,3,5,7,9]]

# 将具体的计数值显示在柱形上方
for index, item1, item2 in zip([0,1,2,3,4], count1, count2): 
    ax1.text(index-0.2, item1 + 0.05, '%.0f' % item1, ha="center", va= "bottom",fontsize=12)
    ax1.text(index+0.2, item2 + 0.05, '%.0f' % item2, ha="center", va= "bottom",fontsize=12)


# 绘制柱状图查看违约率分布
netLength_rate = data.groupby('netLength')['Default'].sum() / data.groupby('netLength')['Default'].count()
sns.barplot(x=[0,1,2,3,4],y=netLength_rate.values,ax=ax2)

# 将具体的计数值显示在柱形上方
for index, item in zip([0,1,2,3,4], netLength_rate): 
     ax2.text(index, item, '%.2f' % item, ha="center", va= "bottom",fontsize=12)
        
# 设置柱形名称
ax1.set_xticklabels(['0-6个月','6-12个月','12-24个月','24个月以上','无效']) 
ax2.set_xticklabels(['0-6个月','6-12个月','12-24个月','24个月以上','无效']) 

# 设置图例名称
ax1.legend(labels=['未违约', '违约'])

# 设置标题以及字体大小
ax1.set_title('不同在网时长下不同违约情况数量分布柱状图',size=13)
ax2.set_title('不同在网时长下违约率分布柱状图',size=13)

# 设置x,y轴标签
ax2.set_xlabel('netLength')
ax2.set_ylabel('违约率')
ax1.set_xlabel('netLength')
ax1.set_ylabel('客户人数')

#显示汉语标注
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']
plt.show()`);
data.set("4.11", `\nimport seaborn as sns
import matplotlib.pyplot as plt

# 建立画布ax1和ax2,及设置图像大小，设置subplots()函数中参数为(1,2)表示两画图呈一行两列
fig, [ax1,ax2] = plt.subplots(1, 2, figsize=(16, 5))

# 在画布ax1中画出总消费金额的核密度图
sns.kdeplot(data['transTotalAmt'], shade=True, ax=ax1)

# 在画布ax2中画出总消费笔数和总消费金额的回归关系图
sns.regplot(x='transTotalCnt', y='transTotalAmt', data=data, ax=ax2)`);
data.set("4.12", `\nimport seaborn as sns
import matplotlib.pyplot as plt

# 建立画布ax1和ax2,及设置图像大小，设置subplots()函数中参数为(1,2)表示一行两列
fig,[ax1,ax2] = plt.subplots(1,2,figsize=(16,6))

# 在画布ax1中绘制年龄的直方图，颜色为红色
sns.distplot(data["age"], ax=ax1,color='r')

# 在画布ax2中绘制开卡时长的直方图，颜色为默认值
sns.distplot(data["card_age"], ax=ax2)

# 在画布ax1、ax2中设置标题
ax1.set_title('年龄分布')
ax2.set_title('开卡时长分布')

# 显示汉语标注
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']`);
data.set("4.13", `\nimport seaborn as sns
import matplotlib.pyplot as plt

# 建立画布ax1和ax2,及设置图像大小，设置subplots()函数中参数为(1,2)表示两画图呈一行两列
fig, [ax1,ax2] = plt.subplots(1, 2, figsize=(16, 5))

# 在画布ax1中画出总取现金额的核密度图
sns.kdeplot(data['cashTotalAmt'], shade=True, ax=ax1)

# 在画布ax2中画出总取现笔数和总取现金额的回归关系图
sns.regplot(x='cashTotalCnt', y='cashTotalAmt', data=data, ax=ax2)`)
data.set("4.14", `\nimport seaborn as sns
import matplotlib.pyplot as plt

# 建立画布ax1和ax2,及设置图像大小，设置subplots()函数中参数为(1,2)表示两画图呈一行两列
fig, [ax1,ax2] = plt.subplots(1, 2, figsize=(16, 5))

# 在画布ax1中画出网上消费金额的核密度估计曲线
sns.kdeplot(data['onlineTransAmt'], shade=True, ax=ax1)

# 在画布ax2中画出网上消费笔数和网上消费金额的回归关系图
sns.regplot(x='onlineTransCnt', y='onlineTransAmt', data=data, ax=ax2)`);
data.set("4.15", `\n# 计算特征缺失值个数
na_counts = data.isnull().sum()

# 将na_counts取大于0的部分进行降序排序
missing_value = na_counts[na_counts > 0].sort_values(ascending = False)

# 查看存在缺失值的特征
print(missing_value)`);
data.set("4.16", `\nimport pandas as pd
 # 缺失值处理
data.dropna(subset=['Default'],inplace=True)

filling_columns = ['idVerify','maritalStatus','threeVerify','education','sex']
for column in filling_columns:
    data[column].fillna('未知',inplace=True)
    
# 查看存在缺失值的特征
na_counts = data.isnull().sum()
missing_value = na_counts[na_counts > 0].sort_values(ascending = False)
print(missing_value)`);
data.set("4.17", `\nimport pandas as pd
 # 异常值处理
data['isCrime'] =data['isCrime'].replace(2, 0)

# 查看处理后的数据情况
print(data['isCrime'].value_counts())`);
data.set("4.18", `\n# 所有连续型特征列名已保存在continuous_columns中
continuous_columns = ['age','cashTotalAmt','cashTotalCnt','monthCardLargeAmt','onlineTransAmt','onlineTransCnt','publicPayAmt','publicPayCnt','transTotalAmt','transTotalCnt','transCnt_non_null_months','transAmt_mean','transAmt_non_null_months','cashCnt_mean','cashCnt_non_null_months','cashAmt_mean','cashAmt_non_null_months','card_age']
# 查看数据各连续型特征的最小值
data_con_min = data[continuous_columns].min()
print(data_con_min)`);
data.set("4.19", `\n# 从原始数据中筛选出网上消费金额小于0时，网上消费金额和网上消费笔数这两列
online_trans =  data[data["onlineTransAmt"] < 0][["onlineTransAmt","onlineTransCnt"]]
print(online_trans)`);
data.set("4.20", `\n# 将网上消费笔数为0时的网上消费金额皆修改为0
data.loc[data["onlineTransCnt"] == 0,'onlineTransAmt'] = 0
# 查看修正后网上消费笔数为0时，网上消费金额与网上消费笔数
online_after = data[data["onlineTransCnt"]  == 0 ][["onlineTransAmt","onlineTransCnt"]] 
print(online_after)`);
data.set("4.21", `\nimport seaborn as sns
import matplotlib.pyplot as plt 
fig,ax = plt.subplots(figsize=(8,6))
# 绘制盒图查看网上消费金额数据分布
sns.boxplot(data["onlineTransAmt"], orient="v")
plt.title('onlineTransAmt distribution')`);
data.set("4.22", `\n# 筛选出网上消费金额在2千万以下的数据样本,更新data
data = data[data['onlineTransAmt']<2.0e+07]
print(data.head())`);
data.set("4.23", `\n# 从原始数据中筛选出公共事业缴费金额小于0时，公共事业缴费笔数和公共事业缴费金额这两列
public_pay =  data[data["publicPayAmt"]  <  0][["publicPayAmt","publicPayCnt"]]
print(public_pay)`);
data.set("4.24", `\n# 将公共事业缴费笔数为0时的公共事业缴费金额皆修改为0（直接在原始数据上进行修改）
data.loc[data["publicPayCnt"] == 0,'publicPayAmt'] = 0

# 查看修正后的，公共事业缴费笔数为0时的公共事业缴费金额与公共事业缴费笔数
public_after = data[data["publicPayCnt"]  ==  0][["publicPayAmt","publicPayCnt"]]
print(public_after)`);
data.set("4.25", `\nimport seaborn as sns
import matplotlib.pyplot as plt
fig,ax = plt.subplots(figsize=(8,6))
# 绘制盒图查看公共事业缴费金额数据分布。
sns.boxplot(data["publicPayAmt"], orient="v")
plt.title('publicPayAmt distribution')`);
data.set("4.26", `\n# 筛选出公共事业缴费金额小于-400万的样本数据
public_pay =  data[data["publicPayAmt"]<-4.0e+06]
print(public_pay[['publicPayCnt','publicPayAmt']])`);
data.set("4.27", `\n# 从原始数据中筛选出总消费笔数等于0时，总消费笔数，总消费金额这两列
transTotal = data[data["transTotalCnt"]  ==  0][["transTotalAmt","transTotalCnt"]]
print(transTotal)`);
data.set("4.28", `\nimport seaborn as sns
import matplotlib.pyplot as plt
fig,ax = plt.subplots(figsize=(8,6))
# 绘制盒图，查看总消费金额数据分布。
sns.boxplot(data["transTotalAmt"], orient="v")
plt.title('transTotalAmt distribution')`);
data.set("4.29", `\n# 筛选出总消费金额大于1000万的样本数据
transTotal =  data[data["transTotalAmt"]>1.0e+07]
print(transTotal[['transTotalAmt','transTotalCnt','onlineTransAmt','onlineTransCnt','monthCardLargeAmt']])`);
data.set("4.30", `\n# 筛选出总取现笔数为0时，总取现笔数，总取现金额这两列
cashTotal =  data[data["cashTotalCnt"]  ==  0][["cashTotalAmt","cashTotalCnt"]]
print(cashTotal)`);
data.set("4.31", `\nimport seaborn as sns
import matplotlib.pyplot as plt
fig,ax = plt.subplots(figsize=(8,6))
# 绘制盒图，查看总取现金额数据分布。
sns.boxplot(data["cashTotalAmt"], orient="v")
plt.title('cashTotalAmt distribution')`);
data.set("4.32", `\n# 筛选出总取现金额大于50万的样本数据。
cashTotal =  data[data["cashTotalAmt"]>5.0e+05]
print(cashTotal)`);
data.set("4.33", `\nimport seaborn as sns
import matplotlib.pyplot as plt
fig,ax = plt.subplots(figsize=(8,6))
# 绘制盒图，查看月最大消费金额数据分布
sns.boxplot(data["monthCardLargeAmt"], orient="v")
plt.title('monthCardLargeAmt distribution')`);
data.set("4.34", `\n# 筛选出月最大消费金额大于200万的数据
monthCard = data[data["monthCardLargeAmt"]>2.0e+06]
print(monthCard)`);
data.set("4.35", `\nimport seaborn as sns
import matplotlib.pyplot as plt
fig,ax = plt.subplots(figsize=(8,6))
# 绘制盒图，查看总消费笔数数据分布
sns.boxplot(data["transTotalCnt"], orient="v")
plt.title('transTotalCnt distribution')`);
data.set("4.36", `\n# 从data中筛选总消费笔数小于6000的值，赋值给data
data =data[data['transTotalCnt']<6000]
print(data.head())`);
data.set("4.37", `\nimport numpy as np
import pandas as pd

data["maritalStatus"] = data["maritalStatus"].map({"未知":0,"未婚":1,"已婚":2})
data['education']=data['education'].map({"未知":0,'小学':1,'初中':2,'高中':3,'本科以上':4})
data['idVerify']=data['idVerify'].map({"未知":0,'一致':1,'不一致':2})
data['threeVerify']=data['threeVerify'].map({"未知":0,'一致':1,'不一致':2})
data["netLength"] = data['netLength'].map({'无效':0,'0-6个月':1,'6-12个月':2,'12-24个月':3,'24个月以上':4})
data["sex"] = data['sex'].map({"未知":0,'男':1,'女':2})
data["CityId"] = data['CityId'].map({'一线城市':1,'二线城市':2,'其它':3})

print(data.head())`);
data.set("4.38", `\nimport numpy as np
import pandas as pd

data = pd.get_dummies(data = data,columns = ['maritalStatus','education','idVerify','threeVerify','Han','netLength','sex','CityId'])
print(data.columns)`);
data.set("5.2", `\n# 计算客户年消费总额。
trans_total = data['transCnt_mean']*data['transAmt_mean']

# 将计算结果保留到小数点后六位。
trans_total = round(trans_total, 6)

# 将结果加在data数据集中的最后一列，并将此列命名为trans_total。
data['trans_total'] = trans_total

print(data['trans_total'].head(20))`);
data.set("5.3", `\n# 计算客户年取现总额。
total_withdraw = data['cashCnt_mean']*data['cashAmt_mean']

# 将计算结果保留到小数点后六位。
total_withdraw = round(total_withdraw, 6)

# 将结果加在data数据集的最后一列，并将此列命名为total_withdraw。
data['total_withdraw'] = total_withdraw

print(data['total_withdraw'].head(20))`);
data.set("5.4", `\nimport numpy as np
 # 计算客户的平均每笔取现金额。
avg_per_withdraw = data['cashTotalAmt']/data['cashTotalCnt']

# 将所有的inf和NaN变为0。
avg_per_withdraw = avg_per_withdraw.replace({np.nan:0,np.inf:0})

# 将计算结果保留到小数点后六位。
avg_per_withdraw = round(avg_per_withdraw, 6)

# 将结果加在data数据集的最后一列，并将此列命名为avg_per_withdraw。
data['avg_per_withdraw'] = avg_per_withdraw

print(data['avg_per_withdraw'].head(20))`);
data.set("5.5", `\nimport numpy as np
 # 请计算客户的网上平均每笔消费额。
avg_per_online_spend = data['onlineTransAmt']/data['onlineTransCnt']

# 将所有的inf和NaN变为0。
avg_per_online_spend = avg_per_online_spend.replace({np.nan:0,np.inf:0})

# 将计算结果保留到小数点后六位。
avg_per_online_spend = round(avg_per_online_spend, 6)

# 将结果加在data数据集的最后一列，并将此列命名为avg_per_online_spend。
data['avg_per_online_spend'] = avg_per_online_spend

print(data['avg_per_online_spend'].head(20))`);
data.set("5.6", `\nimport numpy as np
 # 请计算客户的公共事业平均每笔缴费额。
avg_per_public_spend = data['publicPayAmt']/data['publicPayCnt']

# 将所有的inf和NaN变为0。
avg_per_public_spend = avg_per_public_spend.replace({np.nan:0,np.inf:0})

# 将计算结果保留到小数点后六位。
avg_per_public_spend = round(avg_per_public_spend, 6)

# 将结果加在data数据集的最后一列，并将此列命名为avg_per_public_spend。
data['avg_per_public_spend'] = avg_per_public_spend

print(data['avg_per_public_spend'].head(20))`);
data.set("5.7", `\n#请计算客户的不良记录分数。
bad_record = data['inCourt']+data['isDue']+data['isCrime']+data['isBlackList']

#将计算结果加在data数据集的最后一列，并将此列命名为bad_record。
data['bad_record'] = bad_record

print(data['bad_record'].head(20))`);
data.set("6.3", `\nfrom sklearn.model_selection import train_test_split
 # 筛选data中的Default列的值，赋予变量y
y = data['Default'].values

# 筛选除去Default列的其他列的值，赋予变量x
x = data.drop(['Default'], axis=1).values

# 使用train_test_split方法，将x,y划分训练集和测试集
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2,random_state = 33,stratify=y)

# 查看划分后的x_train与x_test的长度
len_x_train = len(x_train)
len_x_test = len(x_test)
print('x_train length: %d, x_test length: %d'%(len_x_train,len_x_test))

# 查看分层采样后的训练集中违约客户人数的占比
train_ratio = y_train.sum()/len(y_train)
print(train_ratio)

# 查看分层采样后的测试集中违约客户人数的占比
test_ratio = y_test.sum()/len(y_test)
print(test_ratio)`);
data.set("6.4", `\nfrom sklearn.linear_model import LogisticRegression
 # 调用模型，新建模型对象
lr = LogisticRegression()

# 带入训练集x_train, y_train进行训练
lr.fit(x_train, y_train)


# 对训练好的lr模型调用predict方法,带入测试集x_test进行预测
y_predict =  lr.predict(x_test)

# 查看模型预测结果
print(y_predict[:10])
print(len(y_predict))`);
data.set("6.5", `from sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression

# 建立一个LogisticRegression对象，命名为lr
lr = LogisticRegression(penalty='l1',C=0.6,class_weight='balanced')

# 对lr对象调用fit方法，带入训练集x_train, y_train进行训练
lr.fit(x_train, y_train)

# 对训练好的lr模型调用predict_proba方法
y_predict = lr.predict_proba(x_test)[:,1]

# 调用roc_auc_score方法
test_auc = roc_auc_score(y_test,y_predict)

print('逻辑回归模型test auc:')
print(test_auc)`);
data.set("6.6", `\nfrom sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression

# 建立一个LogisticRegression对象，命名为lr
lr = LogisticRegression(penalty='l1',C=0.6,class_weight='balanced')

# 对lr对象调用fit方法，带入训练集x_train, y_train进行训练
lr.fit(x_train, y_train)

# 对训练好的lr模型调用predict_proba方法
y_predict = lr.predict_proba(x_test)[:,1]

# 调用roc_auc_score方法
test_auc = roc_auc_score(y_test,y_predict)

print('逻辑回归模型test auc:')
print(test_auc)`);
data.set("6.7", `\ncontinuous_columns = ['age','cashTotalAmt','cashTotalCnt','monthCardLargeAmt','onlineTransAmt','onlineTransCnt','publicPayAmt','publicPayCnt','transTotalAmt','transTotalCnt','transCnt_non_null_months','transAmt_mean','transAmt_non_null_months','cashCnt_mean','cashCnt_non_null_months','cashAmt_mean','cashAmt_non_null_months','card_age', 'trans_total','total_withdraw', 'avg_per_withdraw','avg_per_online_spend', 'avg_per_public_spend', 'bad_record','transCnt_mean','noTransWeekPre']
 # 对data中所有连续型的列进行Z-score标准化

data[continuous_columns] = data[continuous_columns].apply(lambda x : (x-x.mean())/x.std())

# 查看标准化后的数据的均值和标准差，以cashAmt_mean为例
print('cashAmt_mean标准化后的均值：',data['cashAmt_mean'].mean())
print('cashAmt_mean标准化后的标准差：',data['cashAmt_mean'].std())

# 查看标准化后对模型的效果提升
y = data['Default'].values
x = data.drop(['Default'], axis=1).values
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2,random_state = 33,stratify=y)

from sklearn.metrics import roc_auc_score
from sklearn.linear_model import LogisticRegression

lr = LogisticRegression(penalty='l1',C=0.6,class_weight='balanced')
lr.fit(x_train, y_train)

# 查看模型预测结果
y_predict = lr.predict_proba(x_test)[:,1]
auc_score =roc_auc_score(y_test,y_predict)
print('score:',auc_score)`);
data.set("6.8", `\ncontinuous_columns = ['age','cashTotalAmt','cashTotalCnt','monthCardLargeAmt','onlineTransAmt','onlineTransCnt','publicPayAmt','publicPayCnt','transTotalAmt','transTotalCnt','transCnt_non_null_months','transAmt_mean','transAmt_non_null_months','cashCnt_mean','cashCnt_non_null_months','cashAmt_mean','cashAmt_non_null_months','card_age', 'trans_total','total_withdraw', 'avg_per_withdraw','avg_per_online_spend', 'avg_per_public_spend', 'bad_record','transCnt_mean','noTransWeekPre']
 # 对data中数值连续型的列进行等频离散化，将每一列都离散为5个组。
data[continuous_columns] = data[continuous_columns].apply(lambda x : pd.qcut(x,5,duplicates='drop'))

# 查看离散化后的数据
print(data.head())

# 查看离散化后对模型的效果提升
# 先对各离散组进行One-Hot处理
data=pd.get_dummies(data)
y = data['Default'].values
x = data.drop(['Default'], axis=1).values
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2,random_state = 33,stratify=y)

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

lr = LogisticRegression(penalty='l1',C=0.6,class_weight='balanced')
lr.fit(x_train, y_train)

# 查看模型预测结果
y_predict = lr.predict_proba(x_test)[:,1]
score_auc = roc_auc_score(y_test,y_predict)
print('score:',score_auc)
`);
data.set("6.9", `\nfrom sklearn.ensemble import RandomForestClassifier 
from sklearn.metrics import roc_auc_score

rf_clf = RandomForestClassifier()
rf_clf.fit(x_train, y_train)
y_predict = rf_clf.predict_proba(x_test)[:,1]

# 查看模型效果
test_auc = roc_auc_score(y_test,y_predict)
print ("AUC Score (Test): %f" % test_auc)`);
data.set("6.10", `\nfrom sklearn.ensemble import RandomForestClassifier 
from sklearn.metrics import roc_auc_score

# 尝试设置参数n_estimators
rf_clf1 =  RandomForestClassifier(n_estimators=100)
rf_clf1.fit(x_train, y_train)
y_predict1 = rf_clf1.predict_proba(x_test)[:,1]

# 查看模型效果
test_auc = roc_auc_score(y_test,y_predict1)
print ("AUC Score (Test): %f" % test_auc)`);
data.set("6.11", `\nfrom sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score
import matplotlib.pyplot as plt

# 定义存储AUC分数的数组
scores_train=[]
scores_test=[]
# 定义存储n_estimators取值的数组
estimators=[]

# 设置n_estimators在100-210中每隔20取一个数值
for i in range(100,210,20):
        estimators.append(i)
        rf = RandomForestClassifier(n_estimators=i, random_state=12)
        rf.fit(x_train,y_train)
        y_predict =  rf.predict_proba(x_test)[:,1]
        scores_test.append(roc_auc_score(y_test,y_predict))

# 查看我们使用的n_estimators取值
print("estimators =", estimators)

# 查看以上模型中在测试集最好的评分
print("best_scores_test =",max(scores_test))

# 画出n_estimators与AUC的图形
fig,ax = plt.subplots()

# 设置x y坐标名称
ax.set_xlabel('estimators')
ax.set_ylabel('AUC分数')
plt.plot(estimators,scores_test, label='测试集')

#显示汉语标注
plt.rcParams['font.sans-serif']=['SimHei'] 
plt.rcParams['font.family']=['sans-serif']

# 设置图例
plt.legend(loc="lower right")
plt.show()`);
data.set("6.12", `\nfrom sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score

rf = RandomForestClassifier()

# 设置需要调试的参数
tuned_parameters = {'n_estimators': [180,190],'max_depth': [8,10]}

# 调用网格搜索函数
rf_clf = GridSearchCV(rf, tuned_parameters, cv=5, n_jobs=2, scoring='roc_auc')
rf_clf.fit(x_train, y_train)

y_predict = rf_clf.predict_proba(x_test)[:,1]
test_auc = roc_auc_score(y_test,y_predict)
print ('随机森林模型test AUC:')
print (test_auc)`);
data.set("7.2", `\n#用metrics.roc_curve()求出 fpr, tpr, threshold
fpr, tpr, threshold = metrics.roc_curve(y_test, y_predict_best)

#用metrics.auc求出roc_auc的值
roc_auc = metrics.auc(fpr, tpr)

#将图片大小设为8:6
fig,ax = plt.subplots(figsize=(8,6))

#将plt.plot里的内容填写完整
plt.plot(fpr, tpr, label = 'AUC = %0.2f' % roc_auc)

#将图例显示在右下方
plt.legend(loc = 'lower right') 

#画出一条红色对角虚线
plt.plot([0, 1], [0, 1],'r--') 

#设置横纵坐标轴范围
plt.xlim([-0.01, 1.01]) 
plt.ylim([-0.01, 1.01])

#设置横纵名称以及图形名称
plt.ylabel('True Positive Rate')
plt.xlabel('False Positive Rate')
plt.title('Receiver Operating Characteristic Curve')
plt.show()`);
data.set("7.3", `\n#用metrics.roc_curve()求出 fpr, tpr, threshold
fpr, tpr, threshold = metrics.roc_curve(y_test, y_predict_best)

#用metrics.auc求出roc_auc的值
roc_auc = metrics.auc(fpr, tpr)

#将图片大小设为8:6
fig,ax = plt.subplots(figsize=(8,6))

#将plt.plot里的内容填写完整
plt.plot(fpr, tpr, label = 'AUC = %0.2f' % roc_auc)

#将图例显示在右下方
plt.legend(loc = 'lower right') 

#画出一条红色对角虚线
plt.plot([0, 1], [0, 1],'r--') 

#设置横纵坐标轴范围
plt.xlim([-0.01, 1.01]) 
plt.ylim([-0.01, 1.01])

#设置横纵名称以及图形名称
plt.ylabel('True Positive Rate')
plt.xlabel('False Positive Rate')
plt.title('Receiver Operating Characteristic Curve')
plt.show()`);
data.set("7.4", `\n## 运行正确代码
#用metric.roc_curve()求出 fpr, tpr, threshold
fpr, tpr, threshold = metrics.roc_curve(y_test, y_predict_best)

#求出KS值和相应的阈值
ks = max(abs(tpr-fpr))
thre = threshold[abs(tpr-fpr).argmax()]

ks = round(ks*100, 2)
thre = round(thre, 2)
print('KS值：', ks,  '%', '阈值：', thre)

#将图片大小设为8:6
fig = plt.figure(figsize=(8,6))
#将plt.plot里的内容填写完整

plt.plot(threshold[::-1], tpr[::-1], lw=1, alpha=1,label='真正率TPR')
plt.plot(threshold[::-1], fpr[::-1], lw=1, alpha=1,label='假正率FPR')


#画出KS值的直线
ks_tpr = tpr[abs(tpr-fpr).argmax()]
ks_fpr = fpr[abs(tpr-fpr).argmax()]
x1 = [thre, thre]
x2 = [ks_fpr, ks_tpr]
plt.plot(x1, x2)

#设置横纵名称以及图例
plt.xlabel('阈值')
plt.ylabel('真正率TPR/假正率FPR')
plt.title('KS曲线', fontsize=15)
plt.legend(loc="upper right")
plt.grid(axis='x')

# 在图上标注ks值
plt.annotate('KS值', xy=(0.18, 0.45), xytext=(0.25, 0.43),
             fontsize=20,arrowprops=dict(facecolor='green', shrink=0.01))`);
data.set("7.5", `\n#用metric.roc_curve()求出 fpr, tpr, threshold
fpr, tpr, threshold = metrics.roc_curve(y_test, y_predict_best)

#求出KS值和相应的阈值
ks = max(abs(tpr-fpr))
thre = threshold[abs(tpr-fpr).argmax()]

ks = round(ks*100, 2)
thre = round(thre, 2)
print('KS值：', ks,  '%', '阈值：', thre)

#将图片大小设为8:6
fig = plt.figure(figsize=(8,6))
#将plt.plot里的内容填写完整

plt.plot(threshold[::-1], tpr[::-1], lw=1, alpha=1,label='真正率TPR')
plt.plot(threshold[::-1], fpr[::-1], lw=1, alpha=1,label='假正率FPR')


#画出KS值的直线
ks_tpr = tpr[abs(tpr-fpr).argmax()]
ks_fpr = fpr[abs(tpr-fpr).argmax()]
x1 = [thre, thre]
x2 = [ks_fpr, ks_tpr]
plt.plot(x1, x2)

#设置横纵名称以及图例
plt.xlabel('阈值')
plt.ylabel('真正率TPR/假正率FPR')
plt.title('KS曲线', fontsize=15)
plt.legend(loc="upper right")
plt.grid(axis='x')

# 在图上标注ks值
plt.annotate('KS值', xy=(0.26, 0.45), xytext=(0.30, 0.43),
             fontsize=20,arrowprops=dict(facecolor='green', shrink=0.01))`);
data.set("7.6", `\n## 训练集预测概率
y_train_probs = lr.predict_proba(x_train)[:,1]
## 测试集预测概率
y_test_probs = lr.predict_proba(x_test)[:,1]

def psi(y_train_probs, y_test_probs):
    ## 设定每组的分点
    bins = np.arange(0, 1.1, 0.1)
    
    ## 将训练集预测概率分组
    y_train_probs_cut = pd.cut(y_train_probs, bins=bins, labels=False)
    ## 计算预期占比
    expect_prop = (pd.Series(y_train_probs_cut).value_counts()/len(y_train_probs)).sort_index()
    
    ## 将测试集预测概率分组
    y_test_probs_cut = pd.cut(y_test_probs, bins=bins, labels=False)
    ## 计算实际占比
    actual_prop = (pd.Series(y_test_probs_cut).value_counts()/len(y_test_probs)).sort_index()
    
    ## 计算PSI
    psi =((actual_prop - expect_prop) * np.log(actual_prop/expect_prop)).sum()
    
    return psi, expect_prop, actual_prop

## 运行函数得到psi、预期占比和实际占比
psi, expect_prop, actual_prop = psi(y_train_probs, y_test_probs)
print('psi=',psi)

## 创建(12, 8)的绘图框
fig = plt.figure(figsize=(12, 8))

## 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei'] 
plt.rcParams['axes.unicode_minus'] = False

## 绘制条形图
plt.bar(expect_prop.index + 0.2, expect_prop, width=0.4, label='预期占比')
plt.bar(actual_prop.index - 0.2, actual_prop, width=0.4, label='实际占比')
plt.legend()

## 设置轴标签
plt.xlabel('概率分组', fontsize=12)
plt.ylabel('样本占比', fontsize=12)

## 设置轴刻度
plt.xticks([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
           ['0-0.1', '0.1-0.2', '0.2-0.3', '0.3-0.4', '0.4-0.5', '0.5-0.6', '0.6-0.7', '0.7-0.8', '0.8-0.9', '0.9-1'])

## 设置图标题
plt.title('预期占比与实际占比对比条形图', fontsize=15)

## 在图上添加文字
for index, item1, item2 in zip(range(10), expect_prop.values, actual_prop.values): 
    plt.text(index+0.2, item1 + 0.01, '%.3f' % item1, ha="center", va= "bottom",fontsize=10)
    plt.text(index-0.2, item2 + 0.01, '%.3f' % item2, ha="center", va= "bottom",fontsize=10)
`);
data.set("7.7", `\n## 训练集预测概率
y_train_probs = rf.predict_proba(x_train)[:,1]
## 测试集预测概率
y_test_probs = rf.predict_proba(x_test)[:,1]

def psi(y_train_probs, y_test_probs):
    ## 设定每组的分点
    bins = np.arange(0, 1.1, 0.1)
    
    ## 将训练集预测概率分组
    y_train_probs_cut = pd.cut(y_train_probs, bins=bins, labels=False)
    ## 计算预期占比
    expect_prop = (pd.Series(y_train_probs_cut).value_counts()/len(y_train_probs)).sort_index()
    
    ## 将测试集预测概率分组
    y_test_probs_cut = pd.cut(y_test_probs, bins=bins, labels=False)
    ## 计算实际占比
    actual_prop = (pd.Series(y_test_probs_cut).value_counts()/len(y_test_probs)).sort_index()
    
    ## 计算PSI
    psi = ((actual_prop - expect_prop) * np.log(actual_prop/expect_prop)).sum()
    
    return psi, expect_prop, actual_prop

## 运行函数得到psi、预期占比和实际占比
psi, expect_prop, actual_prop = psi(y_train_probs, y_test_probs)
print('psi=', round(psi, 3))

## 创建(12, 8)的绘图框
fig = plt.figure(figsize=(12, 8))

## 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei'] 
plt.rcParams['axes.unicode_minus'] = False

## 绘制条形图
plt.bar(expect_prop.index + 0.2, expect_prop, width=0.4, label='预期占比')
plt.bar(actual_prop.index - 0.2, actual_prop, width=0.4, label='实际占比')
plt.legend()

## 设置轴标签
plt.xlabel('概率分组', fontsize=12)
plt.ylabel('样本占比', fontsize=12)

## 设置轴刻度
plt.xticks([0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
           ['0-0.1', '0.1-0.2', '0.2-0.3', '0.3-0.4', '0.4-0.5', '0.5-0.6', '0.6-0.7', '0.7-0.8', '0.8-0.9', '0.9-1'])

## 设置图标题
plt.title('预期占比与实际占比对比条形图', fontsize=15)

## 在图上添加文字
for index, item1, item2 in zip(range(10), expect_prop.values, actual_prop.values): 
    plt.text(index+0.2, item1 + 0.01, '%.3f' % item1, ha="center", va= "bottom",fontsize=10)
    plt.text(index-0.2, item2 + 0.01, '%.3f' % item2, ha="center", va= "bottom",fontsize=10)`);
data.set("7.8", `\n
from sklearn.linear_model import LogisticRegression
lr_clf = LogisticRegression(penalty='l1',C = 0.6, random_state=55)
lr_clf.fit(x_train, y_train)

# 查看逻辑回归各项指标系数
coefficient = lr_clf.coef_

# 取出指标系数，并对其求绝对值
importance =abs(coefficient)

# 通过图形的方式直观展现前八名的重要指标
index=data.drop('Default', axis=1).columns
feature_importance = pd.DataFrame(importance.T, index=index).sort_values(by=0, ascending=True)

# # 查看指标重要度
print(feature_importance)

# 水平条形图绘制
feature_importance.tail(8).plot(kind='barh', title='Feature Importances', figsize=(8, 6), legend=False)
plt.show()
`);
data.set("7.9", `\n
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators = 150, criterion = 'entropy', max_depth = 5, min_samples_split = 2, random_state=12)
rf.fit(x_train, y_train)

# 查看随机森林各项指标系数
importance =rf.feature_importances_

# 通过图形的方式直观展现前八名的重要指标
index=data.drop('Default', axis=1).columns
feature_importance = pd.DataFrame(importance.T, index=index).sort_values(by=0, ascending=True)

# # 查看指标重要度
print(feature_importance)

# 水平条形图绘制
feature_importance.tail(8).plot(kind='barh', title='Feature Importances', figsize=(8, 6), legend=False)
plt.show()`);

//获得标题
var title = $('.s-title1').find('span').text().toString().split(' ')[0]
const button = document.querySelector('.dir-right');
var submitbutton = $('.code-btn.submit-code-btn.rf');

function next() {

    console.log("触发下一页点击事件")
    var judge = document.querySelector("body > div.box > div > div.content-view > div.View-root > div.right-part > div.run-submit-content > div.judge-right.judge-flag");
    // 检查judge元素的style属性

    try {
        var style = window.getComputedStyle(judge);
    } catch (error) {
        button.click();
    }


    if (style.display === 'block') {
        console.log("触发下一页")
        // 在style不隐藏时执行的事件
        //下一页
        // 模拟点击按钮

        console.log("下一页")
        button.click();




    }

}

function f() {


    // 目标元素
    var targetElement = document.querySelector("body > div.box > div > div.content-view > div.View-root > div.right-part > div.run-submit-content > div.judge-right.judge-flag");

    // 创建一个新的MutationObserver实例

    var observer = new MutationObserver(function (mutationsList, observer) {
        // 遍历所有的变动
        for (var mutation of mutationsList) {
            // 检查style属性的变化
            if (mutation.attributeName === 'style') {
                // 获取元素的当前style属性值
                var currentStyle = targetElement.style.display;

                // 检查style属性是否变为block
                if (currentStyle === 'block') {
                    // 触发某些代码
                    // Your code here


                    next();

                }
            }
        }
    });

    // 配置观察选项
    var config = {attributes: true};

    // 开始观察目标元素
    observer.observe(targetElement, config);


    editor_user.setValue(data.get(title))
    //提交
    submitbutton.click();
    console.log("submit text success")

    console.log("end success")


}

try {


    f();
} catch (error) {
    next();
}




